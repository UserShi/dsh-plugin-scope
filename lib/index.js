/**
 * Host half of Plugin Scope.
 *
 * v0.1 is a Gate engine: plugins stay loaded, and each Agent receives a
 * tools.restrict() mask, skill shadows and prompt-section shadows for the
 * plugins its conversation does not select. Global/off switches go through
 * pluginManager, never through profile YAML.
 */
import { createRequire } from 'node:module'
import { copyFileSync, existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { StateStore } from './state.js'
import {
  aggregateStats,
  attributeStats,
  foldSessionStats,
  foldSessionTurns,
  groupByWorkspace,
} from './stats.js'
import {
  assignmentFor,
  collectDeniedTools,
  collectHiddenSections,
  collectHiddenSkills,
  contributionFor,
  createProfile,
  defaultState,
  deleteProfile,
  diagnoseMappings,
  estimateTokens,
  getProfile,
  isProtectedPlugin,
  matchTags,
  normalizeContribution,
  normalizeMode,
  normalizeScope,
  normalizeState,
  resolveSessionScope,
  resolveVisibility,
  scopeLabel,
  stringList,
  updateProfile,
} from './core.js'

export const name = 'dsh-plugin-scope'
export const inject = ['tools', 'agents', 'agentPresets']

const API = '/api/dsh-plugin-scope'
const MAX_BODY = 256 * 1024
const INVENTORY_TTL_MS = 1500
const SESSION_LIMIT = 500

/** @param {unknown} value @returns {string} */
function errorText(value) {
  if (value instanceof Error) return value.message
  return String(value)
}

/** @param {unknown} value @param {string} fallback @returns {string} */
function localized(value, fallback) {
  if (typeof value === 'string' && value !== '') return value
  if (value !== null && typeof value === 'object') {
    if (typeof value.en === 'string' && value.en !== '') return value.en
    for (const candidate of Object.values(value)) {
      if (typeof candidate === 'string' && candidate !== '') return candidate
    }
  }
  return fallback
}

/** @param {string} name @returns {string} */
function prettyName(name) {
  return String(name)
    .replace(/^@[^/]+\//, '')
    .replace(/^dsh-/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase())
}

/** @param {string} profileDir @param {string} name @param {Map<string, object|null>} cache @returns {object|null} */
function readManifestScope(profileDir, name, cache) {
  if (cache.has(name)) return cache.get(name)
  const candidates = [
    join(profileDir, 'node_modules', name, 'package.json'),
  ]
  try {
    const require = createRequire(import.meta.url)
    candidates.push(require.resolve(name + '/package.json'))
  } catch {
    // Exports-restricted packages are read from the profile copy above.
  }
  for (const file of candidates) {
    try {
      if (!existsSync(file)) continue
      const manifest = JSON.parse(readFileSync(file, 'utf8'))
      const scope = manifest?.dsh?.scope ?? manifest?.dsh?.pluginScope
      const result = scope !== null && typeof scope === 'object' ? scope : null
      cache.set(name, result)
      return result
    } catch {
      // Try the next candidate; a broken package is not a fatal condition.
    }
  }
  cache.set(name, null)
  return null
}

/** @param {import('node:http').IncomingMessage} req @returns {boolean} */
function isLoopback(req) {
  if (process.env.DSH_PLUGIN_SCOPE_ALLOW_REMOTE === '1') return true
  const remote = req.socket?.remoteAddress ?? ''
  return remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
}

/** @param {number} status @param {string} code @param {string} message @returns {Error} */
function httpError(status, code, message) {
  const error = new Error(message)
  error.status = status
  error.code = code
  return error
}

/** @param {import('node:http').ServerResponse} res @param {number} status @param {unknown} payload */
function sendJson(res, status, payload) {
  if (res.writableEnded) return
  const text = JSON.stringify(payload)
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  })
  res.end(text)
}

/** @param {import('node:http').IncomingMessage} req @returns {Promise<object>} */
function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', chunk => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(httpError(413, 'body-too-large', 'request body is larger than 256 KiB'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (size === 0) return resolve({})
      try {
        const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        resolve(parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {})
      } catch (error) {
        reject(httpError(400, 'invalid-json', 'invalid JSON body: ' + errorText(error)))
      }
    })
    req.on('error', reject)
  })
}

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {object} [config]
 */
export async function apply(ctx, config = {}) {
  const logger = (() => {
    try {
      const service = ctx.get('logger')
      return service?.('plugin-scope') ?? console
    } catch {
      return console
    }
  })()

  const profileDir = (() => {
    try {
      const profile = ctx.get('profileContext')
      if (profile && typeof profile.dir === 'string' && profile.dir !== '') return profile.dir
    } catch {
      // Fall through to environment/defaults.
    }
    if (typeof process.env.DSH_PROFILE_DIR === 'string' && process.env.DSH_PROFILE_DIR !== '') return process.env.DSH_PROFILE_DIR
    const profileName = typeof process.env.DSH_PROFILE === 'string' && process.env.DSH_PROFILE !== '' ? process.env.DSH_PROFILE : 'desktop'
    return join(homedir(), '.dsh', 'profiles', profileName)
  })()

  function resolveProfilePackage(profile, name, requireFromProfile) {
    try {
      return dirname(requireFromProfile.resolve(name + '/package.json'))
    } catch {
      return join(profile.dir, 'node_modules', name)
    }
  }

  async function readBundlePresetRows(profile, names, yaml, include, logger) {
    const presets = ctx.get('agentPresets')
    let defaults
    for (let attempt = 0; attempt < 100; attempt += 1) {
      try {
        defaults = await presets.readDocument(presets.defaultId)
        break
      } catch (error) {
        if (attempt === 99) throw error
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
    const baseRows = yaml.load(defaults.content, { schema: include.entryListSchema })
    if (!Array.isArray(baseRows)) throw new Error('default preset document is not a row list')
    const rowsByName = new Map()
    for (const name of names) {
      const packageDir = resolveProfilePackage(profile, name, createRequire(join(profile.dir, 'package.json')))
      const manifest = JSON.parse(readFileSync(join(packageDir, 'package.json'), 'utf8'))
      if (manifest.dsh?.client !== undefined) logger.warn?.('[plugin-scope] preset bundle has a client half; its UI may need a root mount: ' + name)
      const patch = manifest.dsh?.bundle?.patch
      if (patch === undefined) throw new Error('preset bundle has no dsh.bundle.patch: ' + name)
      const files = Array.isArray(patch) ? patch : [patch]
      const rows = []
      for (const file of files) {
        const loaded = yaml.load(readFileSync(join(packageDir, file), 'utf8'), { schema: include.entryListSchema })
        if (!Array.isArray(loaded)) throw new Error('bundle patch is not a patch list: ' + name + '/' + file)
        rows.push(...include.applyEntryPatches([], loaded, (message, ...args) => {
          let index = 0
          logger.warn?.('[plugin-scope] preset patch: ' + message.replace(/%C/g, () => JSON.stringify(args[index++])))
        }))
      }
      rowsByName.set(name, rows)
    }
    return { baseRows, rowsByName }
  }

  function presetKeyHash(key) {
    let hash = 2166136261
    for (let index = 0; index < key.length; index += 1) {
      hash ^= key.charCodeAt(index)
      hash = Math.imul(hash, 16777619)
    }
    return (hash >>> 0).toString(36)
  }

  const presetIsolation = (() => {
    let enabled = false
    let ready = null
    let registered = false
    let hostCapable = false
    let error = null
    let bundles = []
    let presetsService = null
    let baseRows = null
    let rowsByName = new Map()
    const subsetPresets = new Map()
    try {
      const profile = ctx.get('profileContext')
      if (profile !== undefined && typeof profile.dir === 'string') {
        let manifest
        try {
          manifest = JSON.parse(readFileSync(join(profile.dir, 'package.json'), 'utf8'))
        } catch {
          manifest = null
        }
        const names = [...new Set(stringList(manifest?.dsh?.profile?.presetBundles))]
        bundles = names
        if (names.length > 0) {
          enabled = true
          ready = (async () => {
            const presets = ctx.get('agentPresets')
            if (presets === undefined) throw new Error('agentPresets service is unavailable')
            const manager = ctx.get('pluginManager')
            if (manager === undefined) throw new Error('pluginManager service is unavailable')
            for (let attempt = 0; attempt < 20; attempt += 1) {
              const plugins = await manager.listPlugins()
              const mounted = plugins.filter(plugin => names.includes(plugin.moduleName) || names.includes(plugin.entryId))
              if (mounted.length > 0) {
                throw new Error('Host presetBundles patch is missing: still mounted at root: ' + mounted.map(plugin => plugin.moduleName).join(', '))
              }
              if (attempt === 19) break
              await new Promise(resolve => setTimeout(resolve, 100))
            }
            const requireFromCli = createRequire(process.argv[1] || import.meta.url)
            const yaml = requireFromCli('js-yaml')
            const include = requireFromCli('@deepseek-ai/cordis-plugin-include')
            const parsed = await readBundlePresetRows(profile, names, yaml, include, logger)
            baseRows = parsed.baseRows
            rowsByName = parsed.rowsByName
            presetsService = presets
            hostCapable = true
            logger.info?.('[plugin-scope] profile preset ready with bundles: ' + names.join(', '))
          })()
          ready.catch(cause => {
            error = errorText(cause)
            logger.warn?.('[plugin-scope] profile preset failed: ' + error)
          })
        }
      }
    } catch (cause) {
      enabled = false
      error = errorText(cause)
      logger.warn?.('[plugin-scope] profile preset setup: ' + error)
    }

    function rowsFor(subset) {
      if (baseRows === null) throw new Error('profile preset rows are not ready')
      const rows = [...baseRows]
      for (const name of subset) rows.push(...(rowsByName.get(name) ?? []))
      return rows
    }

    const pendingPresets = new Map()

    async function ensure(subset) {
      await (ready ?? Promise.resolve())
      if (!enabled || !hostCapable || presetsService === null) throw new Error(error ?? 'profile preset is unavailable')
      const unique = [...new Set(subset)].filter(name => bundles.includes(name))
      if (unique.length === 0) return 'standard'
      const poolKey = [...bundles].sort().join('\n')
      const key = [...unique].sort().join('\n')
      if (subsetPresets.has(key)) return subsetPresets.get(key)
      if (pendingPresets.has(key)) return pendingPresets.get(key)
      const operation = (async () => {
        if (key === poolKey) {
          const id = 'scope:profile'
          await presetsService.register({
            id,
            name: 'Plugin Scope',
            description: 'Profile preset bundles selected by Plugin Scope',
            order: 900,
            plugins: rowsFor(unique),
          })
          subsetPresets.set(key, id)
          registered = true
          return id
        }
        const id = 'scope:profile:' + presetKeyHash(key)
        await presetsService.register({
          id,
          name: 'Plugin Scope (' + unique.length + ')',
          description: 'Profile preset subset selected by Plugin Scope',
          order: 901,
          plugins: rowsFor(unique),
        })
        subsetPresets.set(key, id)
        registered = true
        logger.info?.('[plugin-scope] registered profile preset subset: ' + unique.join(', '))
        return id
      })()
      pendingPresets.set(key, operation)
      try {
        return await operation
      } finally {
        pendingPresets.delete(key)
      }
    }

    return {
      get enabled() { return enabled },
      get registered() { return registered },
      get hostCapable() { return hostCapable },
      get error() { return error },
      get bundles() { return bundles },
      ready: ready ?? Promise.resolve(),
      ensure,
      status: () => ({ enabled, registered, hostCapable, error, bundles, presetId: 'scope:profile' }),
    }
  })()

  function readProfileManifestDocument() {
    try {
      return JSON.parse(readFileSync(join(profileDir, 'package.json'), 'utf8'))
    } catch {
      return null
    }
  }

  function bundlePackageManifest(name) {
    try {
      const manifest = JSON.parse(readFileSync(join(profileDir, 'node_modules', name, 'package.json'), 'utf8'))
      return manifest
    } catch {
      return null
    }
  }

  async function presetInfo() {
    const manager = ctx.get('pluginManager')
    const candidates = []
    if (manager !== undefined) {
      try {
        const bundles = await manager.listBundles()
        for (const bundle of bundles) {
          if (bundle.installed !== true || bundle.name === 'dsh-plugin-scope') continue
          const manifest = bundlePackageManifest(bundle.name)
          candidates.push({
            name: bundle.name,
            title: localized(bundle.meta?.title, prettyName(bundle.name)),
            description: localized(bundle.meta?.description, localized(bundle.description, '')),
            version: bundle.version,
            clientHalf: manifest?.dsh?.client !== undefined,
            presetSafe: manifest?.dsh?.client === undefined,
          })
        }
      } catch { /* inventory diagnostics remain empty */ }
    }
    candidates.sort((left, right) => left.name.localeCompare(right.name))
    const manifest = readProfileManifestDocument()
    const selected = stringList(manifest?.dsh?.profile?.presetBundles)
    return { selected, candidates, isolation: presetIsolation.status() }
  }

  async function savePresetBundles(rawBundles) {
    if (!Array.isArray(rawBundles)) throw httpError(400, 'invalid-bundles', 'bundles must be an array')
    const bundles = [...new Set(rawBundles.filter(value => typeof value === 'string' && value.trim() !== '').map(value => value.trim()))]
    const info = await presetInfo()
    const known = new Set(info.candidates.map(candidate => candidate.name))
    for (const name of bundles) {
      if (!known.has(name)) throw httpError(400, 'unknown-bundle', 'unknown installed bundle: ' + name)
    }
    const manifestPath = join(profileDir, 'package.json')
    const manifest = readProfileManifestDocument()
    if (manifest === null) throw httpError(500, 'profile-manifest', 'cannot read profile package.json')
    manifest.dsh ??= {}
    manifest.dsh.profile ??= {}
    if (bundles.length === 0) delete manifest.dsh.profile.presetBundles
    else manifest.dsh.profile.presetBundles = bundles
    const backupPath = manifestPath + '.plugin-scope-backup'
    const temporaryPath = manifestPath + '.plugin-scope-tmp'
    try {
      copyFileSync(manifestPath, backupPath)
      writeFileSync(temporaryPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
      renameSync(temporaryPath, manifestPath)
    } catch (cause) {
      throw httpError(500, 'profile-write', 'cannot write profile package.json: ' + errorText(cause))
    }
    return { presetBundles: bundles, restartRequired: true }
  }

  async function selectProfilePreset(agent) {
    if (!presetIsolation.enabled) return
    await presetIsolation.ready
    const presets = ctx.get('agentPresets')
    if (presets === undefined) return
    if (typeof agent?.session?.header?.parentSession === 'string') return
    const boundary = ctx.agents.turnBoundaryOf(agent.session)
    if (boundary.lastTurn !== 0 || boundary.openTurnStartSeq !== null) return
    const state = store.load()
    const sessionRecord = state.sessions[agent.id]
    const cwd = agent.session.header.cwd ?? undefined
    const workspace = cwd === undefined ? undefined : state.workspaces[cwd]
    const configured = sessionRecord?.presetBundles !== undefined
      ? sessionRecord.presetBundles
      : workspace?.presetBundles
    const pool = presetIsolation.bundles
    const subset = configured === undefined
      ? [...pool]
      : configured.filter(name => pool.includes(name))
    const current = presets.presetForSession(agent.session)
    if (subset.length === 0) {
      if (typeof current === 'string' && current.startsWith('scope:profile')) {
        await presets.select(agent, 'standard')
        logger.info?.('[plugin-scope] cleared profile preset for ' + agent.id)
      }
      return
    }
    let presetId
    try {
      presetId = await presetIsolation.ensure(subset)
    } catch (cause) {
      logger.warn?.('[plugin-scope] preset subset failed, falling back to full pool: ' + errorText(cause))
      presetId = await presetIsolation.ensure(pool)
    }
    if (presetId === 'standard' || current === presetId) return
    await presets.select(agent, presetId)
    logger.info?.('[plugin-scope] selected profile preset ' + presetId + ' for ' + agent.id)
  }

  async function migrateProfilePreset(agent) {
    const presets = ctx.get('agentPresets')
    if (presets === undefined) throw new Error('agentPresets service is unavailable')
    if (typeof presets.recompose !== 'function') throw new Error('agent preset recompose is unavailable')
    const boundary = ctx.agents.turnBoundaryOf(agent.session)
    if (boundary.openTurnStartSeq !== null) throw httpError(409, 'turn-open', 'cannot migrate while a turn is open')
    const state = store.load()
    const sessionRecord = state.sessions[agent.id]
    const cwd = agent.session.header.cwd ?? undefined
    const workspace = cwd === undefined ? undefined : state.workspaces[cwd]
    const configured = sessionRecord?.presetBundles !== undefined
      ? sessionRecord.presetBundles
      : workspace?.presetBundles
    const pool = presetIsolation.bundles
    const subset = configured === undefined
      ? [...pool]
      : configured.filter(name => pool.includes(name))
    const currentId = presets.presetForSession(agent.session)
    let presetId = subset.length === 0 ? 'standard' : await (async () => {
      try {
        return await presetIsolation.ensure(subset)
      } catch (cause) {
        logger.warn?.('[plugin-scope] preset subset migration failed, falling back to full pool: ' + errorText(cause))
        return presetIsolation.ensure(pool)
      }
    })()
    if (currentId === presetId) return presetId
    await presets.recompose(agent.ctx, presetId)
    agent.session.append('agent-preset/selected', { agentPreset: presetId })
    await applyGate(agent)
    logger.info?.('[plugin-scope] migrated ' + agent.id + ' to preset ' + presetId)
    return presetId
  }

  async function reselectPresetAgents() {
    if (!presetIsolation.enabled) return
    for (const agent of ctx.agents.list()) {
      try {
        await selectProfilePreset(agent)
      } catch (error) {
        logger.warn?.('[plugin-scope] preset reselect for ' + agent.id + ': ' + errorText(error))
      }
    }
  }

  const store = new StateStore(profileDir, { logger })
  const manifestCache = new Map()
  const agentGates = new Map()
  const skillCache = new Map()
  const sessionUsageCache = new Map()
  const autoMatchCache = new Map()
  let allUsageCache = { at: 0, value: null }
  let inventory = []
  let inventoryAt = 0
  let inventoryPromise
  let revision = 0
  let lastError
  let lastGateError

  /** @param {boolean} [force] @returns {Promise<object[]>} */
  async function refreshInventory(force = false) {
    if (!force && inventory.length > 0 && Date.now() - inventoryAt < INVENTORY_TTL_MS) return inventory
    if (inventoryPromise !== undefined) return inventoryPromise
    inventoryPromise = (async () => {
      const state = store.load()
      const manager = ctx.get('pluginManager')
      const records = []
      try {
        if (manager !== undefined) {
          const [bundles, plugins] = await Promise.all([manager.listBundles(), manager.listPlugins()])
          const byEntryId = new Map()
          const byModule = new Map()
          for (const plugin of plugins) {
            if (plugin.entryId !== undefined) byEntryId.set(plugin.entryId, plugin)
            if (!byModule.has(plugin.moduleName)) byModule.set(plugin.moduleName, plugin)
          }
          for (const bundle of bundles) {
            // Only profile-installed bundles are actionable here; the
            // installation's shipped optional catalog stays in the market.
            if (bundle.installed !== true && bundle.name !== 'dsh-plugin-scope') continue
            const assignment = assignmentFor(state, bundle.name)
            const manifest = readManifestScope(profileDir, bundle.name, manifestCache)
            const contribution = assignment.contribution.tools.length > 0 || assignment.contribution.skills.length > 0 || assignment.contribution.sections.length > 0
              ? assignment.contribution
              : contributionFor(bundle.name, manifest)
            const mappedBy = assignment.mappedBy !== 'unknown' ? assignment.mappedBy : manifest !== null ? 'manifest' : contribution.tools.length > 0 ? 'builtin' : 'unknown'
            records.push({
              name: bundle.name,
              title: localized(bundle.meta?.title, prettyName(bundle.name)),
              description: localized(bundle.meta?.description, bundle.description ?? ''),
              version: bundle.version,
              enabled: bundle.enabled === true,
              installed: bundle.installed === true,
              availability: bundle.availability,
              official: bundle.official === true,
              removable: bundle.removable === true,
              readOnlyReason: bundle.readOnlyReason,
              protected: isProtectedPlugin(bundle.name),
              error: bundle.error,
              assignment,
              scope: assignment.scope,
              profiles: assignment.profiles,
              contribution,
              mappedBy,
              rows: (bundle.rows ?? []).map(row => {
                const live = byEntryId.get(row.entryId) ?? byModule.get(row.moduleName)
                return {
                  rowId: row.rowId,
                  moduleName: row.moduleName,
                  entryId: row.entryId,
                  enabled: live?.enabled ?? false,
                  phase: live?.fiberPhase ?? null,
                  diagnostic: live?.diagnostic,
                }
              }),
            })
          }
        } else {
          const loader = ctx.get('loader')
          const grouped = new Map()
          if (loader !== undefined) {
            for (const entry of loader.entries()) {
              if (entry.options?.group === true) continue
              const moduleName = entry.options?.name ?? entry.id
              if (!grouped.has(moduleName)) grouped.set(moduleName, [])
              grouped.get(moduleName).push(entry)
            }
          }
          for (const [bundleName, entries] of grouped) {
            const assignment = assignmentFor(state, bundleName)
            const manifest = readManifestScope(profileDir, bundleName, manifestCache)
            const contribution = assignment.contribution.tools.length > 0 || assignment.contribution.skills.length > 0 || assignment.contribution.sections.length > 0
              ? assignment.contribution
              : contributionFor(bundleName, manifest)
            records.push({
              name: bundleName,
              title: prettyName(bundleName),
              description: '',
              enabled: entries.some(entry => !entry.disabled),
              installed: true,
              availability: 'profile',
              protected: isProtectedPlugin(bundleName),
              assignment,
              scope: assignment.scope,
              profiles: assignment.profiles,
              contribution,
              mappedBy: assignment.mappedBy !== 'unknown' ? assignment.mappedBy : manifest !== null ? 'manifest' : contribution.tools.length > 0 ? 'builtin' : 'unknown',
              rows: entries.map(entry => ({
                rowId: entry.id,
                moduleName: entry.options?.name ?? entry.id,
                entryId: entry.id,
                enabled: !entry.disabled,
                phase: entry.fiber?.state ?? null,
              })),
            })
          }
        }
      } catch (error) {
        lastError = errorText(error)
        logger.warn?.('[plugin-scope] inventory failed: ' + lastError)
      }
      records.sort((left, right) => {
        if (left.protected !== right.protected) return left.protected ? -1 : 1
        return left.name.localeCompare(right.name)
      })
      inventory = records
      inventoryAt = Date.now()
      return records
    })()
    try {
      return await inventoryPromise
    } finally {
      inventoryPromise = undefined
    }
  }

  /** @param {string} name @returns {Promise<object>} */
  async function recordFor(name) {
    const records = await refreshInventory(true)
    const record = records.find(candidate => candidate.name === name)
    if (record === undefined) throw httpError(404, 'unknown-plugin', 'unknown plugin: ' + name)
    return record
  }

  /**
   * Apply a tools.restrict mask, dropping names the registry rejects. The
   * error text itself names the unknown tools, so a stale mapping cannot break
   * an Agent.
   * @param {object} scopedCtx agent.ctx
   * @param {string[]} deny
   * @returns {() => void}
   */
  function restrictTools(scopedCtx, deny) {
    let remaining = new Set(deny)
    for (let attempt = 0; attempt < 4; attempt += 1) {
      if (remaining.size === 0) return () => {}
      try {
        return scopedCtx.tools.restrict({ deny: [...remaining] })
      } catch (error) {
        const message = errorText(error)
        const head = message.split('; known global tools:')[0]
        const unknown = [...head.matchAll(/"([^"]+)"/g)].map(match => match[1])
        if (unknown.length === 0) throw error
        for (const name of unknown) remaining.delete(name)
      }
    }
    return () => {}
  }

  /** @param {object} agent @param {object[]} [records] @returns {Promise<void>} */
  async function applyGate(agent, records) {
    if (agent === undefined || agent === null || agent.ctx === undefined) return
    try {
      const presetId = ctx.get('agentPresets')?.presetForSession(agent.session)
      if (typeof presetId === 'string' && presetId.startsWith('scope:profile')) {
        const previousPresetGate = agentGates.get(agent.id)
        if (previousPresetGate !== undefined) {
          try { previousPresetGate.dispose() } catch { /* Agent disposal owns the rest */ }
          agentGates.delete(agent.id)
        }
        return
      }
    } catch { /* fall through to the Gate */ }
    const state = store.load()
    const currentRecords = records ?? await refreshInventory()
    const cwd = agent.session.header.cwd ?? undefined
    const sessionScope = resolveSessionScope(state, agent.id, cwd)
    const denied = collectDeniedTools(currentRecords, sessionScope, state)
    let hiddenSkills = collectHiddenSkills(currentRecords, sessionScope, state)
    const hiddenSections = collectHiddenSections(currentRecords, sessionScope, state)
    if (hiddenSkills.length > 0) {
      const known = await visibleSkillNames(agent)
      if (known !== null) hiddenSkills = hiddenSkills.filter(name => known.has(name))
    }
    const signature = JSON.stringify({ denied, hiddenSkills, hiddenSections })
    const previous = agentGates.get(agent.id)
    if (previous !== undefined && previous.signature === signature) return
    if (previous !== undefined) {
      try { previous.dispose() } catch { /* the Agent may already be gone */ }
      agentGates.delete(agent.id)
    }
    if (denied.length === 0 && hiddenSkills.length === 0 && hiddenSections.length === 0) return
    try {
      const dispose = agent.ctx.effect(() => {
        const local = []
        try {
          local.push(restrictTools(agent.ctx, denied))
        } catch (error) {
          lastGateError = 'tools gate for ' + agent.id + ': ' + errorText(error)
          logger.warn?.('[plugin-scope] ' + lastGateError)
        }
        try {
          const skills = agent.ctx.skills
          for (const skill of hiddenSkills) {
            try {
              local.push(skills.register({
                name: skill,
                description: 'Hidden by Plugin Scope',
                content: '',
                source: 'runtime',
                invocation: { modelInvocable: false, userInvocable: false },
                provider: 'plugin-scope',
              }))
            } catch (error) {
              logger.warn?.('[plugin-scope] skill gate failed for ' + skill + ': ' + errorText(error))
            }
          }
        } catch {
          // The Agent's composition has no skill registry.
        }
        try {
          const prompt = agent.ctx.systemPrompt
          for (const section of hiddenSections) {
            try {
              local.push(prompt.section({ name: section, order: 0, text: '' }))
            } catch (error) {
              logger.warn?.('[plugin-scope] section gate failed for ' + section + ': ' + errorText(error))
            }
          }
        } catch {
          // The Agent's composition has no prompt registry.
        }
        return () => {
          for (const item of local) {
            try { item() } catch { /* already disposed */ }
          }
        }
      }, 'plugin-scope: gate')
      agentGates.set(agent.id, { dispose, signature, denied, hiddenSkills, hiddenSections })
    } catch (error) {
      lastGateError = errorText(error)
      logger.warn?.('[plugin-scope] gate failed for ' + agent.id + ': ' + lastGateError)
    }
  }

  /** @returns {Promise<void>} */
  async function reapplyAll() {
    const records = await refreshInventory(true)
    for (const agent of ctx.agents.list()) await applyGate(agent, records)
  }

  /** @param {string} sessionId @returns {Promise<object[]>} */
  async function readSessionEvents(sessionId) {
    const query = ctx.get('sessionQuery')
    if (query !== undefined && typeof query.readSession === 'function') {
      const snapshot = await query.readSession(sessionId)
      return snapshot.events
    }
    const agent = ctx.agents.get(sessionId)
    return agent?.session?.snapshotEvents() ?? []
  }

  /** @param {string} sessionId @param {boolean} [force] @returns {Promise<object>} */
  async function usageForSession(sessionId, force) {
    const cached = sessionUsageCache.get(sessionId)
    if (force !== true && cached !== undefined && Date.now() - cached.at < 3000) return cached.value
    const events = await readSessionEvents(sessionId)
    const stats = foldSessionStats(events)
    sessionUsageCache.set(sessionId, { at: Date.now(), value: stats })
    return stats
  }

  /** @type {Map<string, {at: number, value: object[]}>} */
  const turnDetailsCache = new Map()

  /** @param {string} sessionId @param {boolean} [force] @returns {Promise<object[]>} */
  async function turnDetailsForSession(sessionId, force) {
    const cached = turnDetailsCache.get(sessionId)
    if (force !== true && cached !== undefined && Date.now() - cached.at < 3000) return cached.value
    const events = await readSessionEvents(sessionId)
    const value = foldSessionTurns(events)
    turnDetailsCache.set(sessionId, { at: Date.now(), value })
    return value
  }

  /** @param {object[]} inventoryRecords @param {boolean} [force] @returns {Promise<object>} */
  async function collectUsage(inventoryRecords, force) {
    if (force !== true && allUsageCache.value !== null && Date.now() - allUsageCache.at < 20000) {
      return allUsageCache.value
    }
    const query = ctx.get('sessionQuery')
    let listing = []
    if (query !== undefined && typeof query.listSessions === 'function') {
      listing = await query.listSessions()
    } else {
      listing = ctx.agents.list().map(agent => ({ header: { id: agent.id, cwd: agent.session.header.cwd } }))
    }
    const limited = listing.slice(0, 200)
    const sessions = []
    for (let index = 0; index < limited.length; index += 4) {
      const batch = await Promise.all(limited.slice(index, index + 4).map(async record => {
        const id = record?.header?.id ?? record?.id
        const cwd = record?.header?.cwd ?? record?.cwd
        if (typeof id !== 'string' || id === '') return null
        try {
          const stats = await usageForSession(id, force)
          return { id, cwd: typeof cwd === 'string' ? cwd : undefined, stats }
        } catch (error) {
          logger.warn?.('[plugin-scope] usage read failed for ' + id + ': ' + errorText(error))
          return null
        }
      }))
      for (const entry of batch) if (entry !== null) sessions.push(entry)
    }
    const total = aggregateStats(sessions)
    const attributed = attributeStats(inventoryRecords, total)
    const value = {
      sessions: sessions.map(entry => ({
        id: entry.id,
        cwd: entry.cwd,
        calls: entry.stats.calls,
        tokens: entry.stats.tokens,
        usage: entry.stats.usage,
      })),
      total,
      plugins: attributed.plugins,
      unattributed: attributed.unattributed,
      workspaces: groupByWorkspace(sessions),
      sessionsCounted: sessions.length,
      generatedAt: new Date().toISOString(),
    }
    allUsageCache = { at: Date.now(), value }
    return value
  }

  function titlePlugins(plugins, records) {
    const titled = {}
    for (const [name, bucket] of Object.entries(plugins || {})) {
      const record = records.find(candidate => candidate.name === name)
      titled[name] = {
        ...bucket,
        name,
        title: record?.title || record?.manifest?.title || name,
      }
    }
    return titled
  }

  /** @param {string|undefined} sessionId @param {boolean} refresh @returns {Promise<object>} */
  async function buildStats(sessionId, refresh) {
    const inventoryRecords = await refreshInventory(true)
    const all = await collectUsage(inventoryRecords, refresh)
    let session = null
    if (sessionId !== undefined && sessionId !== '') {
      try {
        const stats = await usageForSession(sessionId, refresh)
        const attributed = attributeStats(inventoryRecords, stats)
        const turnDetails = (await turnDetailsForSession(sessionId, refresh)).map(turn => {
          const turnAttribution = attributeStats(inventoryRecords, turn)
          return {
            ...turn,
            plugins: titlePlugins(turnAttribution.plugins, inventoryRecords),
            unattributed: turnAttribution.unattributed,
          }
        })
        const agent = ctx.agents.get(sessionId)
        session = {
          id: sessionId,
          cwd: agent?.session?.header?.cwd,
          ...stats,
          turnDetails,
          plugins: titlePlugins(attributed.plugins, inventoryRecords),
          unattributed: attributed.unattributed,
        }
      } catch (error) {
        logger.warn?.('[plugin-scope] session usage failed: ' + errorText(error))
      }
    }
    return {
      ok: true,
      generatedAt: all.generatedAt,
      pricePerMillion: store.load().settings.pricePerMillion,
      sessionsCounted: all.sessionsCounted,
      total: all.total,
      plugins: titlePlugins(all.plugins, inventoryRecords),
      unattributed: all.unattributed,
      workspaces: all.workspaces,
      session,
    }
  }

  async function mappingDiagnostics(records, cwd) {
    let toolNames = null
    let skillNames = null
    try {
      const schemas = ctx.tools.schemas()
      toolNames = schemas.map(schema => schema.name)
    } catch { /* tools unavailable: skip stale tool detection */ }
    const skills = ctx.get('skills')
    if (skills !== undefined && typeof skills.list === 'function') {
      try {
        const list = await skills.list(cwd === undefined ? {} : { cwd })
        skillNames = list.map(skill => skill.name)
      } catch { /* skills unavailable: skip stale skill detection */ }
    }
    const result = diagnoseMappings(records, { tools: toolNames, skills: skillNames })
    for (const name of presetIsolation.bundles) {
      if (result[name] !== undefined) {
        result[name].staleTools = []
        result[name].staleSkills = []
      }
    }
    return result
  }

  /** @returns {Promise<object>} */
  async function buildState(sessionId) {
    const records = await refreshInventory()
    const state = store.load()
    const scopeAgent = sessionId !== undefined ? ctx.agents.get(sessionId) : undefined
    const scopeCwd = scopeAgent?.session?.header?.cwd ?? undefined
    const scope = resolveSessionScope(state, sessionId ?? '__default__', scopeCwd)
    const diagnostics = await mappingDiagnostics(records, scopeCwd)
    const plugins = records.map(record => {
      const visibility = resolveVisibility(record, scope, state)
      return {
        ...record,
        visible: visibility.visible,
        visibilityReason: visibility.reason,
        label: scopeLabel(record.scope),
        mappingDiagnostics: diagnostics[record.name],
      }
    })
    const estimateSession = sessionId ?? ctx.agents.list()[0]?.id
    const estimate = await estimateForSession(estimateSession, records)
    const liveSessions = ctx.agents.list().map(agent => {
      let blank = false
      try {
        const boundary = ctx.agents.turnBoundaryOf(agent.session)
        blank = boundary.lastTurn === 0 && boundary.openTurnStartSeq === null
      } catch {
        blank = false
      }
      const sessionScope = resolveSessionScope(state, agent.id, agent.session.header.cwd ?? undefined)
      const gatedTools = collectDeniedTools(records, sessionScope, state).length
      const gatedSkills = collectHiddenSkills(records, sessionScope, state).length
      const gatedSections = collectHiddenSections(records, sessionScope, state).length
      return {
        id: agent.id,
        cwd: agent.session.header.cwd ?? undefined,
        blank,
        profileId: sessionScope.profileId,
        profileName: sessionScope.profile?.name ?? sessionScope.profileId,
        mode: sessionScope.mode,
        source: sessionScope.source,
        workspaceCwd: sessionScope.workspaceCwd,
        gatedTools,
        gatedSkills,
        gatedSections,
        presetBundles: state.sessions[agent.id]?.presetBundles,
        presetId: (() => {
          try { return ctx.get('agentPresets')?.presetForSession(agent.session) ?? null } catch { return null }
        })(),
        active: true,
      }
    })
    return {
      version: normalizeState(state).version,
      revision,
      settings: state.settings,
      profiles: state.profiles,
      workspaces: state.workspaces,
      pluginTags: state.pluginTags,
      tagRules: state.tagRules,
      tagOrder: state.tagOrder,
      plugins,
      sessions: liveSessions,
      session: sessionId !== undefined ? { id: sessionId, ...scope } : null,
      estimate,
      capabilities: {
        management: ctx.get('pluginManager') !== undefined,
        presets: ctx.get('agentPresets') !== undefined,
        skills: ctx.get('skills') !== undefined,
        prompt: ctx.get('systemPrompt') !== undefined,
      },
      preset: await presetInfo(),
      diagnostics: {
        profileDir,
        stateFile: store.file,
        inventory: records.length,
        liveAgents: liveSessions.length,
        gates: agentGates.size,
        lastError,
        lastGateError,
        presetIsolation: presetIsolation.status(),
      },
    }
  }

  /** @param {string|undefined} sessionId @returns {Promise<object[]|null>} */
  async function listSkillsForSession(sessionId) {
    const skills = ctx.get('skills')
    if (skills === undefined) return null
    const presets = ctx.get('agentPresets')
    const agent = sessionId === undefined ? undefined : ctx.agents.get(sessionId)
    let lease
    let scopeKey
    if (presets !== undefined && agent !== undefined) {
      try {
        const presetId = presets.presetForSession(agent.session)
        if (presetId !== null) {
          lease = await presets.acquireScope(presetId)
          scopeKey = lease.key
        }
      } catch (error) {
        logger.warn?.('[plugin-scope] skills scope failed: ' + errorText(error))
      }
    }
    try {
      const cwd = agent?.session?.header?.cwd
      return await skills.list({ scope: scopeKey, cwd })
    } catch (error) {
      logger.warn?.('[plugin-scope] skills list failed: ' + errorText(error))
      return null
    } finally {
      if (lease !== undefined) {
        try {
          const dispose = lease[Symbol.asyncDispose]
          if (typeof dispose === 'function') await dispose.call(lease)
        } catch { /* lease disposal is best effort */ }
      }
    }
  }

  /** @param {object} agent @returns {Promise<Set<string>|null>} */
  async function visibleSkillNames(agent) {
    const cached = skillCache.get(agent.id)
    if (cached !== undefined && Date.now() - cached.at < 5000) return cached.names
    const list = await listSkillsForSession(agent.id)
    if (list === null) return null
    const names = new Set(list.map(skill => skill.name))
    skillCache.set(agent.id, { at: Date.now(), names })
    return names
  }

  /** @param {string|undefined} sessionId @param {object[]} records @returns {Promise<object>} */
  async function estimateForSession(sessionId, records) {
    const state = store.load()
    const agent = sessionId === undefined ? undefined : ctx.agents.get(sessionId)
    const scope = resolveSessionScope(state, sessionId ?? '__default__', agent?.session?.header?.cwd ?? undefined)
    const denied = collectDeniedTools(records, scope, state)
    const hiddenSkills = collectHiddenSkills(records, scope, state)
    const hiddenSections = collectHiddenSections(records, scope, state)
    const presets = ctx.get('agentPresets')
    let lease
    let scopeKey
    if (presets !== undefined && agent !== undefined) {
      try {
        const presetId = presets.presetForSession(agent.session)
        if (presetId !== null) {
          lease = await presets.acquireScope(presetId)
          scopeKey = lease.key
        }
      } catch (error) {
        logger.warn?.('[plugin-scope] estimate scope failed: ' + errorText(error))
      }
    }
    try {
      const schemas = ctx.tools.schemas(scopeKey).filter(schema => !denied.includes(schema.name))
      return { ...estimateTokens(schemas), hiddenTools: denied.length, hiddenSkills: hiddenSkills.length, hiddenSections: hiddenSections.length }
    } catch (error) {
      logger.warn?.('[plugin-scope] estimate failed: ' + errorText(error))
      return { tools: 0, tokens: 0, hiddenTools: denied.length, hiddenSkills: hiddenSkills.length, hiddenSections: hiddenSections.length }
    } finally {
      if (lease !== undefined) {
        try {
          const dispose = lease[Symbol.asyncDispose]
          if (typeof dispose === 'function') await dispose.call(lease)
        } catch { /* lease disposal is best effort */ }
      }
    }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function setPluginScope(body) {
    const plugin = typeof body.name === 'string' ? body.name.trim() : ''
    if (plugin === '') throw httpError(400, 'missing-plugin', 'name is required')
    const scope = normalizeScope(body.scope)
    const record = await recordFor(plugin)
    if (record.protected === true && scope !== 'global') {
      throw httpError(403, 'protected-plugin', plugin + ' is a management plugin and can only stay Global')
    }
    const manager = ctx.get('pluginManager')
    let application = 'unchanged'
    let nextStep
    if (manager !== undefined) {
      const enabled = scope !== 'off'
      if (record.enabled !== enabled) {
        try {
          const result = await manager.setBundleEnabled(plugin, enabled)
          application = result?.application ?? 'unknown'
          nextStep = result?.nextStep
        } catch (error) {
          throw httpError(500, 'management-failed', errorText(error))
        }
      }
    } else if (scope === 'off') {
      throw httpError(409, 'management-unavailable', 'pluginManager is not available in this profile')
    }
    const profiles = stringList(body.profiles)
    await store.update(state => {
      const current = state.plugins[plugin] ?? { contribution: record.contribution, mappedBy: record.mappedBy }
      state.plugins[plugin] = {
        scope,
        profiles,
        contribution: current.contribution ?? record.contribution,
        mappedBy: current.mappedBy ?? record.mappedBy,
      }
    })
    revision += 1
    await reapplyAll()
    return { plugin, scope, profiles, application, nextStep, revision }
  }

  function validatePresetSelection(value) {
    if (value === undefined || value === null) return undefined
    if (!Array.isArray(value)) throw httpError(400, 'invalid-preset-bundles', 'presetBundles must be an array')
    const selection = [...new Set(stringList(value))]
    const invalid = selection.filter(name => !presetIsolation.bundles.includes(name))
    if (invalid.length > 0) {
      throw httpError(400, 'unknown-preset-bundle', 'presetBundles must come from the profile preset pool: ' + invalid.join(', '))
    }
    return selection
  }

  /** @param {object} body @returns {Promise<object>} */
  async function setSessionScope(body) {
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
    if (sessionId === '') throw httpError(400, 'missing-session', 'sessionId is required')
    const state = store.load()
    const existing = state.sessions[sessionId]
    const profileId = typeof body.profileId === 'string' && body.profileId !== ''
      ? body.profileId
      : existing?.profileId ?? 'all'
    if (getProfile(state, profileId) === undefined) throw httpError(400, 'unknown-profile', 'unknown profile: ' + profileId)
    const mode = normalizeMode(body.mode ?? existing?.mode)
    const liveAgent = ctx.agents.get(sessionId)
    const current = resolveSessionScope(state, sessionId, liveAgent?.session?.header?.cwd ?? undefined)
    const sourceOverrides = body.overrides !== null && typeof body.overrides === 'object'
      ? body.overrides
      : existing?.overrides ?? current.overrides
    const clearPresetBundles = body.presetBundles === null
    const requestedPresetBundles = validatePresetSelection(body.presetBundles)
    const sourcePresetBundles = clearPresetBundles
      ? undefined
      : requestedPresetBundles !== undefined
        ? requestedPresetBundles
        : existing?.presetBundles
    state.sessions[sessionId] = {
      profileId,
      mode,
      overrides: {
        add: stringList(sourceOverrides.add),
        remove: stringList(sourceOverrides.remove),
        includeTools: stringList(sourceOverrides.includeTools),
        excludeTools: stringList(sourceOverrides.excludeTools),
      },
      updatedAt: new Date().toISOString(),
    }
    if (clearPresetBundles) delete state.sessions[sessionId].presetBundles
    else if (Array.isArray(sourcePresetBundles)) state.sessions[sessionId].presetBundles = sourcePresetBundles
    store.save(state)
    revision += 1
    const agent = ctx.agents.get(sessionId)
    let presetWarning = null
    const migrate = body.migrate === true
    if (agent !== undefined) {
      try {
        if (migrate) await migrateProfilePreset(agent)
        else await selectProfilePreset(agent)
      } catch (error) {
        presetWarning = errorText(error)
        logger.warn?.('[plugin-scope] preset ' + (migrate ? 'migration' : 'reselect') + ': ' + presetWarning)
      }
      await applyGate(agent)
    }
    return { sessionId, profileId, mode, presetBundles: state.sessions[sessionId].presetBundles, presetWarning, migrated: migrate, revision }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function setSessionPlugin(body) {
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const enabled = body.enabled === true
    if (sessionId === '') throw httpError(400, 'missing-session', 'sessionId is required')
    if (name === '') throw httpError(400, 'missing-plugin', 'name is required')
    const records = await refreshInventory(true)
    const record = records.find(candidate => candidate.name === name)
    if (record === undefined) throw httpError(404, 'unknown-plugin', 'unknown plugin: ' + name)
    if (record.protected === true) throw httpError(400, 'protected-plugin', 'management plugins stay global')
    if (record.scope !== 'on-demand') throw httpError(400, 'not-on-demand', 'only on-demand plugins can be toggled in a conversation')
    const state = store.load()
    const stateAgent = ctx.agents.get(sessionId)
    const scope = resolveSessionScope(state, sessionId, stateAgent?.session?.header?.cwd ?? undefined)
    const add = scope.overrides.add.filter(item => item !== name)
    const remove = scope.overrides.remove.filter(item => item !== name)
    if (enabled) {
      add.push(name)
    } else {
      remove.push(name)
    }
    const result = await setSessionScope({
      sessionId,
      profileId: scope.profileId,
      overrides: { ...scope.overrides, add, remove },
    })
    return { ...result, name, enabled }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function setWorkspace(body) {
    const cwd = typeof body.cwd === 'string' ? body.cwd.trim() : ''
    const profileId = typeof body.profileId === 'string' ? body.profileId : ''
    if (cwd === '') throw httpError(400, 'missing-workspace', 'cwd is required')
    const state = store.load()
    if (getProfile(state, profileId) === undefined) throw httpError(400, 'unknown-profile', 'unknown profile: ' + profileId)
    const existing = state.workspaces[cwd]
    const mode = normalizeMode(body.mode ?? existing?.mode)
    const overrides = body.overrides !== null && typeof body.overrides === 'object' ? body.overrides : existing?.overrides
    const requestedPresetBundles = validatePresetSelection(body.presetBundles)
    const sourcePresetBundles = requestedPresetBundles !== undefined
      ? requestedPresetBundles
      : existing?.presetBundles
    state.workspaces[cwd] = {
      profileId,
      mode,
      overrides: {
        add: stringList(overrides?.add),
        remove: stringList(overrides?.remove),
        includeTools: stringList(overrides?.includeTools),
        excludeTools: stringList(overrides?.excludeTools),
      },
      updatedAt: new Date().toISOString(),
    }
    if (Array.isArray(sourcePresetBundles)) state.workspaces[cwd].presetBundles = sourcePresetBundles
    store.save(state)
    revision += 1
    await reapplyAll()
    await reselectPresetAgents()
    return { cwd, profileId, mode, presetBundles: sourcePresetBundles, revision }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function deleteWorkspace(body) {
    const cwd = typeof body.cwd === 'string' ? body.cwd.trim() : ''
    if (cwd === '') throw httpError(400, 'missing-workspace', 'cwd is required')
    const state = store.load()
    delete state.workspaces[cwd]
    store.save(state)
    revision += 1
    await reapplyAll()
    await reselectPresetAgents()
    return { cwd, removed: true, revision }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function resetSessionScope(body) {
    const sessionId = typeof body.sessionId === 'string' ? body.sessionId.trim() : ''
    if (sessionId === '') throw httpError(400, 'missing-session', 'sessionId is required')
    const state = store.load()
    const existed = state.sessions[sessionId] !== undefined
    delete state.sessions[sessionId]
    store.save(state)
    revision += 1
    const agent = ctx.agents.get(sessionId)
    if (agent !== undefined) await applyGate(agent)
    return { sessionId, reset: true, existed, revision }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function setDefaultProfile(body) {
    const id = typeof body.profileId === 'string' ? body.profileId : ''
    const state = store.load()
    if (getProfile(state, id) === undefined) throw httpError(400, 'unknown-profile', 'unknown profile: ' + id)
    state.settings.defaultProfileId = id
    store.save(state)
    revision += 1
    await reapplyAll()
    return { defaultProfileId: id, revision }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function profileAction(body) {
    const action = body.action === 'delete' ? 'delete' : body.action === 'update' ? 'update' : 'create'
    const state = store.load()
    if (action === 'delete') {
      const id = typeof body.id === 'string' ? body.id : ''
      deleteProfile(state, id)
      store.save(state)
      revision += 1
      await reapplyAll()
      return { deleted: id, revision }
    }
    if (action === 'update') {
      const id = typeof body.id === 'string' ? body.id : ''
      const profile = updateProfile(state, id, body.profile ?? {})
      store.save(state)
      revision += 1
      await reapplyAll()
      return { profile, revision }
    }
    const profile = createProfile(state, body.profile ?? {})
    store.save(state)
    revision += 1
    return { profile, revision }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function setMapping(body) {
    const plugin = typeof body.name === 'string' ? body.name.trim() : ''
    if (plugin === '') throw httpError(400, 'missing-plugin', 'name is required')
    const contribution = normalizeContribution(body.contribution)
    await store.update(state => {
      const current = state.plugins[plugin] ?? { scope: 'global', profiles: [] }
      state.plugins[plugin] = {
        scope: normalizeScope(current.scope),
        profiles: stringList(current.profiles),
        contribution,
        mappedBy: 'manual',
      }
    })
    revision += 1
    await reapplyAll()
    return { plugin, contribution, revision }
  }

  /** @param {object} body @returns {Promise<object>} */
  function ensureTag(state, tag) {
    if (!Array.isArray(state.tagOrder)) state.tagOrder = []
    if (!state.tagOrder.includes(tag)) state.tagOrder.push(tag)
    if (state.tagRules[tag] === undefined) state.tagRules[tag] = { keywords: [], enabled: true }
  }

  function removeTagEverywhere(state, tag) {
    if (!Array.isArray(state.tagOrder)) state.tagOrder = []
    state.tagOrder = state.tagOrder.filter(item => item !== tag)
    delete state.tagRules[tag]
    for (const [name, tags] of Object.entries(state.pluginTags)) {
      const next = tags.filter(item => item !== tag)
      if (next.length === 0) delete state.pluginTags[name]
      else state.pluginTags[name] = next
    }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function setTag(body) {
    const action = typeof body.action === 'string' ? body.action : 'create'
    const tag = typeof body.tag === 'string' ? body.tag.trim() : ''
    const state = store.load()
    if (!Array.isArray(state.tagOrder)) state.tagOrder = []
    if (action === 'create') {
      const name = typeof body.name === 'string' ? body.name.trim() : ''
      if (name === '') throw httpError(400, 'missing-tag', 'name is required')
      if (state.tagOrder.includes(name)) throw httpError(409, 'tag-exists', 'tag already exists: ' + name)
      ensureTag(state, name)
      store.save(state)
      revision += 1
      return { action, tag: name, tags: state.tagOrder, revision }
    }
    if (tag === '') throw httpError(400, 'missing-tag', 'tag is required')
    if (!state.tagOrder.includes(tag)) throw httpError(404, 'unknown-tag', 'unknown tag: ' + tag)
    if (action === 'rename') {
      const nextName = typeof body.name === 'string' ? body.name.trim() : ''
      if (nextName === '') throw httpError(400, 'missing-tag', 'name is required')
      if (nextName !== tag && state.tagOrder.includes(nextName)) throw httpError(409, 'tag-exists', 'tag already exists: ' + nextName)
      state.tagOrder = state.tagOrder.map(item => item === tag ? nextName : item)
      const rule = state.tagRules[tag] ?? { keywords: [], enabled: true }
      delete state.tagRules[tag]
      state.tagRules[nextName] = rule
      for (const [name, tags] of Object.entries(state.pluginTags)) {
        const next = stringList(tags.map(item => item === tag ? nextName : item))
        if (next.length === 0) delete state.pluginTags[name]
        else state.pluginTags[name] = next
      }
      store.save(state)
      revision += 1
      return { action, tag: nextName, previous: tag, tags: state.tagOrder, revision }
    }
    if (action === 'delete') {
      removeTagEverywhere(state, tag)
      store.save(state)
      revision += 1
      return { action, tag, removed: true, tags: state.tagOrder, revision }
    }
    if (action === 'move') {
      const direction = body.direction === 'up' ? -1 : body.direction === 'down' ? 1 : 0
      if (direction === 0) throw httpError(400, 'invalid-direction', 'direction must be up or down')
      const index = state.tagOrder.indexOf(tag)
      const next = index + direction
      if (next < 0 || next >= state.tagOrder.length) return { action, tag, tags: state.tagOrder, revision }
      const copy = [...state.tagOrder]
      copy[index] = copy[next]
      copy[next] = tag
      state.tagOrder = copy
      store.save(state)
      revision += 1
      return { action, tag, tags: state.tagOrder, revision }
    }
    throw httpError(400, 'invalid-action', 'unknown tag action: ' + action)
  }

  async function setPluginTags(body) {
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    if (name === '') throw httpError(400, 'missing-plugin', 'name is required')
    const state = store.load()
    const tags = stringList(body.tags)
    for (const tag of tags) ensureTag(state, tag)
    if (tags.length === 0) delete state.pluginTags[name]
    else state.pluginTags[name] = tags
    store.save(state)
    revision += 1
    return { name, tags, tagOrder: state.tagOrder, revision }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function setTagRule(body) {
    const tag = typeof body.tag === 'string' ? body.tag.trim() : ''
    if (tag === '') throw httpError(400, 'missing-tag', 'tag is required')
    const state = store.load()
    if (body.remove === true) {
      removeTagEverywhere(state, tag)
      store.save(state)
      revision += 1
      return { tag, removed: true, tags: state.tagOrder, revision }
    }
    ensureTag(state, tag)
    state.tagRules[tag] = {
      keywords: stringList(body.keywords),
      enabled: body.enabled !== false,
    }
    store.save(state)
    revision += 1
    return { tag, rule: state.tagRules[tag], tags: state.tagOrder, revision }
  }

  /** @param {object} message @returns {string} */
  function messageText(message) {
    const content = message?.content
    if (typeof content === 'string') return content
    if (Array.isArray(content)) {
      return content.map(part => typeof part?.text === 'string' ? part.text : '').join('\n')
    }
    return ''
  }

  /** @param {object[]} messages @returns {string} */
  function messagesText(messages) {
    return (messages || []).map(messageText).filter(Boolean).join('\n')
  }

  /** @param {object} agent @returns {string} */
  function lastUserText(agent) {
    const events = agent?.session?.snapshotEvents?.() ?? []
    for (let index = events.length - 1; index >= 0; index -= 1) {
      const event = events[index]
      if (event?.type !== 'user/message') continue
      return messageText(event.data?.message)
    }
    return ''
  }

  /** @param {object} agent @param {string} [textOverride] @returns {Promise<void>} */
  async function autoMatchForAgent(agent, textOverride) {
    if (agent === undefined || agent === null) return
    const text = typeof textOverride === 'string' ? textOverride : lastUserText(agent)
    if (text === '') return
    const cached = autoMatchCache.get(agent.id)
    if (cached === text) return
    autoMatchCache.set(agent.id, text)
    try {
      const state = store.load()
      if (state.settings.autoMatchTags !== true) return
      const matched = matchTags(text, state.tagRules)
      if (matched.length === 0) return
      const wanted = new Set(matched.map(tag => tag.toLowerCase()))
      const records = await refreshInventory()
      const cwd = agent.session.header.cwd ?? undefined
      const scope = resolveSessionScope(state, agent.id, cwd)
      const names = []
      for (const [name, tags] of Object.entries(state.pluginTags)) {
        if (!tags.some(tag => wanted.has(tag.toLowerCase()))) continue
        const record = records.find(candidate => candidate.name === name)
        if (record === undefined || record.enabled === false || record.scope !== 'on-demand') continue
        if (resolveVisibility(record, scope, state).visible) continue
        names.push(name)
      }
      if (names.length === 0) return
      const add = [...scope.overrides.add]
      const remove = [...scope.overrides.remove]
      for (const name of names) {
        const removeIndex = remove.indexOf(name)
        if (removeIndex >= 0) remove.splice(removeIndex, 1)
        if (!add.includes(name)) add.push(name)
      }
      state.sessions[agent.id] = {
        profileId: scope.profileId,
        overrides: { ...scope.overrides, add, remove },
        updatedAt: new Date().toISOString(),
      }
      store.save(state)
      revision += 1
      await applyGate(agent, records)
      logger.info?.('[plugin-scope] auto-enabled plugins for tags ' + matched.join(',') + ': ' + names.join(', '))
    } catch (error) {
      logger.warn?.('[plugin-scope] auto tag match failed: ' + errorText(error))
    }
  }

  /** @param {object} body @returns {Promise<object>} */
  async function setSettings(body) {
    const state = store.load()
    if (typeof body.defaultProfileId === 'string' && body.defaultProfileId !== '') {
      if (getProfile(state, body.defaultProfileId) === undefined) throw httpError(400, 'unknown-profile', 'unknown profile: ' + body.defaultProfileId)
      state.settings.defaultProfileId = body.defaultProfileId
    }
    if (body.language === 'zh' || body.language === 'en') state.settings.language = body.language
    if (Number.isFinite(Number(body.pricePerMillion)) && Number(body.pricePerMillion) >= 0) state.settings.pricePerMillion = Number(body.pricePerMillion)
    if (typeof body.autoMatchTags === 'boolean') state.settings.autoMatchTags = body.autoMatchTags
    if (typeof body.autoApplyOnCreate === 'boolean') state.settings.autoApplyOnCreate = body.autoApplyOnCreate
    if (typeof body.showChip === 'boolean') state.settings.showChip = body.showChip
    if (typeof body.subagentInherits === 'boolean') state.settings.subagentInherits = body.subagentInherits
    store.save(state)
    revision += 1
    return { settings: state.settings, revision }
  }

  /** @returns {Promise<object>} */
  async function resetState() {
    const state = defaultState()
    store.save(state)
    revision += 1
    await reapplyAll()
    return { reset: true, revision }
  }

  /** @param {string|undefined} sessionId @param {object[]} records @returns {Promise<object[]>} */
  async function visibleTools(sessionId, records) {
    const presets = ctx.get('agentPresets')
    const agent = sessionId === undefined ? undefined : ctx.agents.get(sessionId)
    let lease
    let scopeKey
    if (presets !== undefined && agent !== undefined) {
      try {
        const presetId = presets.presetForSession(agent.session)
        if (presetId !== null) {
          lease = await presets.acquireScope(presetId)
          scopeKey = lease.key
        }
      } catch { /* fall through to the global view */ }
    }
    try {
      const schemas = ctx.tools.schemas(scopeKey)
      return schemas.map(schema => {
        const owner = records.find(record => (record.contribution?.tools ?? []).includes(schema.name))
        return {
          name: schema.name,
          description: schema.description,
          parameters: schema.parameters,
          plugin: owner?.name ?? 'unknown',
        }
      })
    } finally {
      if (lease !== undefined) {
        try {
          const dispose = lease[Symbol.asyncDispose]
          if (typeof dispose === 'function') await dispose.call(lease)
        } catch { /* best effort */ }
      }
    }
  }

  /** @param {object} webServer @param {object} webCtx */
  function registerRoutes(webServer, webCtx) {
    /** @param {string} path @param {'GET'|'POST'} method @param {(req: object, url: URL) => Promise<object>} handler */
    const route = (path, method, handler) => {
      webCtx.effect(() => webServer.register({
        kind: 'exact',
        path,
        handler: async (req, res) => {
          try {
            if (req.method !== method) throw httpError(405, 'method-not-allowed', 'method not allowed')
            if (!isLoopback(req)) throw httpError(403, 'loopback-only', 'this API is loopback-only')
            const url = new URL(req.url ?? path, 'http://127.0.0.1')
            const body = method === 'POST' ? await readJson(req) : {}
            const result = await handler({ req, body, url })
            sendJson(res, 200, { ok: true, ...result })
          } catch (error) {
            const status = Number.isInteger(error?.status) ? error.status : 500
            const code = typeof error?.code === 'string' ? error.code : 'internal-error'
            lastError = errorText(error)
            if (status >= 500) logger.warn?.('[plugin-scope] api ' + path + ': ' + lastError)
            sendJson(res, status, { ok: false, error: { code, message: errorText(error) } })
          }
        },
      }), 'plugin-scope: route ' + path)
    }

    route(API + '/state', 'GET', async ({ url }) => buildState(url.searchParams.get('session') ?? undefined))
    route(API + '/preset', 'GET', async () => presetInfo())
    route(API + '/preset/save', 'POST', async ({ body }) => savePresetBundles(body?.bundles))
    route(API + '/preset-inspect', 'GET', async () => {
      const presets = ctx.get('agentPresets')
      if (presets === undefined) return { available: false }
      const defaultId = presets.defaultId
      return {
        available: true,
        defaultId,
        list: await presets.list(),
        document: await presets.readDocument(defaultId),
        scopePreset: await presets.readDocument('scope:profile').catch(error => ({ error: errorText(error) })),
        sessions: ctx.agents.list().map(agent => ({ id: agent.id, preset: presets.presetForSession(agent.session) })),
        inventory: await presets.compositionInventory(),
      }
    })
    route(API + '/stats', 'GET', async ({ url }) => buildStats(url.searchParams.get('session') ?? undefined, url.searchParams.get('refresh') === '1'))
    route(API + '/tools', 'GET', async ({ url }) => {
      const records = await refreshInventory(true)
      return { tools: await visibleTools(url.searchParams.get('session') ?? undefined, records) }
    })
    route(API + '/skills', 'GET', async ({ url }) => {
      const list = await listSkillsForSession(url.searchParams.get('session') ?? undefined)
      return {
        skills: (list ?? []).map(skill => ({
          name: skill.name,
          description: skill.description,
          whenToUse: skill.whenToUse,
          provider: skill.provider,
          source: skill.source,
          invocation: skill.invocation,
        })),
      }
    })
    route(API + '/plugin', 'POST', async ({ body }) => setPluginScope(body))
    route(API + '/session', 'POST', async ({ body }) => setSessionScope(body))
    route(API + '/session/migrate', 'POST', async ({ body }) => setSessionScope({ ...body, migrate: true }))
    route(API + '/session/plugin', 'POST', async ({ body }) => setSessionPlugin(body))
    route(API + '/session/reset', 'POST', async ({ body }) => resetSessionScope(body))
    route(API + '/workspace', 'POST', async ({ body }) => setWorkspace(body))
    route(API + '/workspace/delete', 'POST', async ({ body }) => deleteWorkspace(body))
    route(API + '/default', 'POST', async ({ body }) => setDefaultProfile(body))
    route(API + '/profile', 'POST', async ({ body }) => profileAction(body))
    route(API + '/mapping', 'POST', async ({ body }) => setMapping(body))
    route(API + '/tags', 'POST', async ({ body }) => setPluginTags(body))
    route(API + '/tag', 'POST', async ({ body }) => setTag(body))
    route(API + '/tag-rule', 'POST', async ({ body }) => setTagRule(body))
    route(API + '/auto-match', 'POST', async ({ body }) => {
      const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
      const agent = ctx.agents.get(sessionId)
      if (agent === undefined) throw httpError(404, 'unknown-session', 'unknown live session: ' + sessionId)
      await autoMatchForAgent(agent, typeof body.text === 'string' ? body.text : '')
      return { ok: true, sessionId, revision }
    })
    route(API + '/settings', 'POST', async ({ body }) => setSettings(body))
    route(API + '/reset', 'POST', async () => resetState())
    route(API + '/client', 'GET', async () => {
      const registry = ctx.get('clientModules')
      const graph = registry?.graph?.()
      const ids = Array.isArray(graph?.entries) ? graph.entries.map(entry => entry.id) : []
      const entry = graph?.entries?.find(candidate => candidate.id === 'dsh-plugin-scope')
      return {
        available: registry !== undefined,
        hasScope: ids.includes('dsh-plugin-scope'),
        url: entry?.url,
        inject: entry?.inject,
        ids,
        rev: graph?.rev,
      }
    })
    route(API + '/gates', 'GET', async () => ({
      gates: [...agentGates.entries()].map(([id, gate]) => ({
        id,
        denied: gate.denied,
        hiddenSkills: gate.hiddenSkills,
        hiddenSections: gate.hiddenSections,
        signature: gate.signature,
      })),
    }))
    route(API + '/diagnostics', 'GET', async () => ({
      profileDir,
      stateFile: store.file,
      inventory: inventory.length,
      liveAgents: ctx.agents.list().length,
      gates: agentGates.size,
      gateDetails: [...agentGates.entries()].map(([sessionId, gate]) => ({
        sessionId,
        denied: gate.denied,
        hiddenSkills: gate.hiddenSkills,
        hiddenSections: gate.hiddenSections,
      })),
      lastError,
      lastGateError,
      version: revision,
    }))
  }

  // Routes exist only in compositions that serve a Web UI.
  ctx.inject(['webServer'], webCtx => {
    const webServer = webCtx.webServer
    if (webServer === undefined) return
    registerRoutes(webServer, webCtx)
  })

  ctx.on('agent/pre-step', async (payload, next) => {
    try {
      const text = messagesText(payload?.messages)
      if (text !== '') await autoMatchForAgent(payload?.agent, text)
    } catch (error) {
      logger.warn?.('[plugin-scope] agent pre-step auto-match: ' + errorText(error))
    }
    return next()
  })

  ctx.on('agent-preset/selected', (sessionId, presetId) => {
    if (!presetIsolation.enabled || (typeof presetId === 'string' && presetId.startsWith('scope:profile'))) return
    const agent = ctx.agents.get(sessionId)
    if (agent === undefined) return
    setTimeout(() => {
      void selectProfilePreset(agent)
        .catch(error => logger.warn?.('[plugin-scope] profile preset reselect: ' + errorText(error)))
    }, 0)
  })

  ctx.on('agent/created', payload => {
    const agent = payload?.agent
    const parentId = agent?.session?.header?.parentSession
    if (typeof parentId === 'string') {
      const state = store.load()
      if (state.sessions[agent.id] === undefined && state.sessions[parentId] !== undefined) {
        state.sessions[agent.id] = { ...state.sessions[parentId], updatedAt: new Date().toISOString() }
        store.save(state)
      }
    }
    void selectProfilePreset(agent)
      .catch(error => logger.warn?.('[plugin-scope] profile preset select: ' + errorText(error)))
      .then(() => applyGate(agent))
      .catch(error => logger.warn?.('[plugin-scope] agent gate: ' + errorText(error)))
  })

  ctx.effect(() => () => {
    for (const gate of agentGates.values()) {
      try { gate.dispose() } catch { /* Agent disposal owns the rest */ }
    }
    agentGates.clear()
  }, 'plugin-scope: agent gates')

  // Existing Agents may predate the plugin; apply the default scope shortly
  // after boot so the first prompt already sees the mask.
  setTimeout(() => {
    void reapplyAll().catch(error => logger.warn?.('[plugin-scope] initial apply: ' + errorText(error)))
  }, 0)

  await refreshInventory().catch(error => logger.warn?.('[plugin-scope] initial inventory: ' + errorText(error)))
}
