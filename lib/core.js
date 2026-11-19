/**
 * Pure scope model shared by the Host service, the HTTP API and the tests.
 *
 * No Node or Cordis imports live here: every function is deterministic and
 * takes the persisted state explicitly, so the resolver can be tested without
 * a running Harness.
 */

export const STATE_VERSION = 1
export const SCOPES = ['global', 'on-demand', 'off']

/** Tool/skill/section names contributed by well-known installed bundles. */
export const BUILTIN_CONTRIBUTIONS = {
  'dsh-ai-diagrams': {
    tools: [
      'diagram_types', 'diagram_save', 'diagram_png', 'diagram_svg',
      'diagram_validate', 'diagram_import', 'diagram_profile',
    ],
    skills: ['diagram-design'],
    sections: [],
  },
  '@michengai/dsh-skills-manager': {
    tools: ['create_skill'],
    skills: [],
    sections: [],
  },
  '@wxg-prc-cpg/browser-skill-dsh-plugin': {
    tools: ['bsk_session', 'bsk_page', 'bsk_tabs', 'bsk_inspect', 'bsk_interact', 'bsk_assist'],
    skills: [],
    sections: [],
  },
  dshmarket: { tools: [], skills: [], sections: [] },
  'dsh-whale-widget': { tools: [], skills: [], sections: [] },
}

/** Bundles that manage the Harness itself and must not be switched off by scope. */
export const PROTECTED_BUNDLES = new Set(['dsh-plugin-scope', 'dshmarket'])

/** @returns {string[]} the built-in profiles every profile starts with. */
export function defaultProfiles() {
  return [
    { id: 'all', name: 'All', description: 'Every on-demand plugin', builtin: true, order: 0, plugins: ['*'], tools: { include: [], exclude: [] }, skills: { include: [], exclude: [] }, sections: { include: [], exclude: [] } },
    { id: 'minimal', name: 'Minimal', description: 'No on-demand plugins', builtin: true, order: 1, plugins: [], tools: { include: [], exclude: [] }, skills: { include: [], exclude: [] }, sections: { include: [], exclude: [] } },
    { id: 'coding', name: 'Coding', description: 'Coding and file operations', builtin: true, order: 2, plugins: ['dsh-ai-diagrams'], tools: { include: [], exclude: [] }, skills: { include: [], exclude: [] }, sections: { include: [], exclude: [] } },
  ]
}

/** @returns {object} a fresh default state. */
export function defaultState() {
  return {
    version: STATE_VERSION,
    settings: {
      defaultProfileId: 'all',
      mode: 'gate',
      language: 'zh',
      autoMatchTags: false,
      autoApplyOnCreate: true,
      showChip: true,
      subagentInherits: true,
    },
    plugins: {},
    profiles: defaultProfiles(),
    sessions: {},
    workspaces: {},
    pluginTags: {},
    tagRules: {},
  }
}

/** @param {unknown} value @returns {string[]} unique non-empty strings. */
export function stringList(value) {
  if (!Array.isArray(value)) return []
  const seen = new Set()
  const out = []
  for (const item of value) {
    if (typeof item !== 'string') continue
    const text = item.trim()
    if (text === '' || seen.has(text)) continue
    seen.add(text)
    out.push(text)
  }
  return out
}

/** @param {unknown} value @returns {{include: string[], exclude: string[]}} */
export function nameFilter(value) {
  const source = value !== null && typeof value === 'object' ? value : {}
  return { include: stringList(source.include), exclude: stringList(source.exclude) }
}

/** @param {unknown} value @returns {{tools: string[], skills: string[], sections: string[]}} */
export function normalizeContribution(value) {
  const source = value !== null && typeof value === 'object' ? value : {}
  return {
    tools: stringList(source.tools),
    skills: stringList(source.skills),
    sections: stringList(source.sections),
  }
}

/** @param {string} name @param {object|null|undefined} manifest @returns {{tools: string[], skills: string[], sections: string[]}} */
export function contributionFor(name, manifest) {
  const fromManifest = normalizeContribution(manifest)
  if (fromManifest.tools.length > 0 || fromManifest.skills.length > 0 || fromManifest.sections.length > 0) {
    return fromManifest
  }
  return normalizeContribution(BUILTIN_CONTRIBUTIONS[name])
}

/** @param {unknown} scope @returns {'global'|'on-demand'|'off'} */
export function normalizeScope(scope) {
  if (scope === 'off' || scope === 'disabled' || scope === false) return 'off'
  if (scope === 'on-demand' || scope === 'on_demand' || scope === 'ondemand' || scope === 'onDemand') return 'on-demand'
  return 'global'
}

/** @param {string} name @returns {boolean} */
export function isProtectedPlugin(name) {
  return PROTECTED_BUNDLES.has(name) || name.startsWith('@deepseek-ai/dsh-')
}

/** @param {unknown} value @param {number} index @returns {object} */
export function normalizeProfile(value, index) {
  const source = value !== null && typeof value === 'object' ? value : {}
  const rawId = typeof source.id === 'string' ? source.id.trim().toLowerCase() : ''
  const fallbackId = index === 0 ? 'all' : 'profile-' + index
  const id = /^[a-z0-9][a-z0-9-]{0,63}$/.test(rawId) ? rawId : fallbackId
  const plugins = stringList(source.plugins)
  const wildcard = plugins.includes('*')
  return {
    id,
    name: typeof source.name === 'string' && source.name.trim() !== '' ? source.name.trim() : id,
    description: typeof source.description === 'string' ? source.description : '',
    builtin: source.builtin === true,
    order: Number.isFinite(source.order) ? source.order : index,
    plugins: wildcard ? ['*'] : plugins,
    tools: nameFilter(source.tools),
    skills: nameFilter(source.skills),
    sections: nameFilter(source.sections),
  }
}

/** @param {unknown} value @returns {object} normalized persisted state. */
export function normalizeState(value) {
  const raw = value !== null && typeof value === 'object' ? value : {}
  const base = defaultState()
  const settings = raw.settings !== null && typeof raw.settings === 'object' ? raw.settings : {}
  const profiles = []
  const seenIds = new Set()
  const rawProfiles = Array.isArray(raw.profiles) ? raw.profiles : []
  for (const [index, entry] of rawProfiles.entries()) {
    const profile = normalizeProfile(entry, index)
    if (seenIds.has(profile.id)) continue
    seenIds.add(profile.id)
    profiles.push(profile)
  }
  for (const profile of base.profiles) {
    if (!seenIds.has(profile.id)) profiles.push(profile)
  }
  profiles.sort((left, right) => left.order - right.order || left.id.localeCompare(right.id))

  const plugins = {}
  if (raw.plugins !== null && typeof raw.plugins === 'object' && !Array.isArray(raw.plugins)) {
    for (const [name, value] of Object.entries(raw.plugins)) {
      const assignment = value !== null && typeof value === 'object' ? value : {}
      plugins[name] = {
        scope: normalizeScope(assignment.scope),
        profiles: stringList(assignment.profiles),
        contribution: normalizeContribution(assignment.contribution),
        mappedBy: typeof assignment.mappedBy === 'string' ? assignment.mappedBy : 'unknown',
      }
    }
  }

  const workspaces = {}
  if (raw.workspaces !== null && typeof raw.workspaces === 'object' && !Array.isArray(raw.workspaces)) {
    for (const [rawCwd, value] of Object.entries(raw.workspaces)) {
      const cwd = typeof rawCwd === 'string' ? rawCwd.trim() : ''
      if (cwd === '') continue
      const workspace = value !== null && typeof value === 'object' ? value : {}
      const overrides = workspace.overrides !== null && typeof workspace.overrides === 'object' ? workspace.overrides : {}
      workspaces[cwd] = {
        profileId: typeof workspace.profileId === 'string' ? workspace.profileId : base.settings.defaultProfileId,
        overrides: {
          add: stringList(overrides.add),
          remove: stringList(overrides.remove),
          includeTools: stringList(overrides.includeTools),
          excludeTools: stringList(overrides.excludeTools),
        },
        updatedAt: typeof workspace.updatedAt === 'string' ? workspace.updatedAt : new Date().toISOString(),
      }
    }
  }

  const pluginTags = {}
  if (raw.pluginTags !== null && typeof raw.pluginTags === 'object' && !Array.isArray(raw.pluginTags)) {
    for (const [name, value] of Object.entries(raw.pluginTags)) {
      const tags = stringList(value)
      if (tags.length > 0) pluginTags[name] = tags
    }
  }

  const tagRules = {}
  if (raw.tagRules !== null && typeof raw.tagRules === 'object' && !Array.isArray(raw.tagRules)) {
    for (const [rawTag, value] of Object.entries(raw.tagRules)) {
      const tag = typeof rawTag === 'string' ? rawTag.trim() : ''
      if (tag === '') continue
      const rule = value !== null && typeof value === 'object' ? value : {}
      tagRules[tag] = {
        keywords: stringList(rule.keywords),
        enabled: rule.enabled !== false,
      }
    }
  }

  const sessions = {}
  if (raw.sessions !== null && typeof raw.sessions === 'object' && !Array.isArray(raw.sessions)) {
    for (const [id, value] of Object.entries(raw.sessions)) {
      const session = value !== null && typeof value === 'object' ? value : {}
      const overrides = session.overrides !== null && typeof session.overrides === 'object' ? session.overrides : {}
      sessions[id] = {
        profileId: typeof session.profileId === 'string' ? session.profileId : base.settings.defaultProfileId,
        overrides: {
          add: stringList(overrides.add),
          remove: stringList(overrides.remove),
          includeTools: stringList(overrides.includeTools),
          excludeTools: stringList(overrides.excludeTools),
        },
        updatedAt: typeof session.updatedAt === 'string' ? session.updatedAt : new Date().toISOString(),
      }
    }
  }

  const defaultProfileId = typeof settings.defaultProfileId === 'string' && profiles.some(profile => profile.id === settings.defaultProfileId)
    ? settings.defaultProfileId
    : profiles[0]?.id ?? 'all'

  return {
    version: STATE_VERSION,
    settings: {
      defaultProfileId,
      mode: 'gate',
      language: settings.language === 'en' ? 'en' : 'zh',
      autoMatchTags: settings.autoMatchTags === true,
      autoApplyOnCreate: settings.autoApplyOnCreate !== false,
      showChip: settings.showChip !== false,
      subagentInherits: settings.subagentInherits !== false,
    },
    plugins,
    profiles,
    sessions: trimSessions(sessions),
    workspaces: trimWorkspaces(workspaces),
    pluginTags,
    tagRules,
  }
}

/** Keep the most recently touched 500 session rows. */
export function trimSessions(sessions, limit = 500) {
  const entries = Object.entries(sessions)
  if (entries.length <= limit) return sessions
  entries.sort((left, right) => String(right[1]?.updatedAt ?? '').localeCompare(String(left[1]?.updatedAt ?? '')))
  return Object.fromEntries(entries.slice(0, limit))
}

/** Keep the most recently touched 200 workspace rows. */
export function trimWorkspaces(workspaces, limit = 200) {
  const entries = Object.entries(workspaces)
  if (entries.length <= limit) return workspaces
  entries.sort((left, right) => String(right[1]?.updatedAt ?? '').localeCompare(String(left[1]?.updatedAt ?? '')))
  return Object.fromEntries(entries.slice(0, limit))
}

/** @param {object} state @param {string} id @returns {object|undefined} */
export function getProfile(state, id) {
  return state.profiles.find(profile => profile.id === id)
}

/** @param {object} state @param {string} name @returns {object|undefined} */
export function getAssignment(state, name) {
  return state.plugins[name]
}

/** @param {object} state @param {string} name @returns {object} */
export function assignmentFor(state, name) {
  const existing = state.plugins[name]
  if (existing !== undefined) return existing
  return { scope: 'global', profiles: [], contribution: contributionFor(name), mappedBy: 'unknown' }
}

/** @param {object} profile @param {string} name @returns {boolean} */
export function profileIncludes(profile, name) {
  if (profile === undefined) return true
  return profile.plugins.includes('*') || profile.plugins.includes(name)
}

/**
 * Resolve one session's effective scope: explicit session override, then the
 * workspace default for its cwd, then the profile default.
 * @param {object} state
 * @param {string} sessionId
 * @param {string|undefined} cwd
 * @returns {{profileId: string, overrides: object, profile: object|undefined, source: 'session'|'workspace'|'default', workspaceCwd?: string}}
 */
export function resolveSessionScope(state, sessionId, cwd) {
  const emptyOverrides = { add: [], remove: [], includeTools: [], excludeTools: [] }
  const workspace = typeof cwd === 'string' && cwd !== '' ? state.workspaces?.[cwd] : undefined
  const saved = state.sessions?.[sessionId]
  const defaultProfileId = state.settings.defaultProfileId
  const workspaceProfileId = workspace?.profileId !== undefined && getProfile(state, workspace.profileId) !== undefined
    ? workspace.profileId
    : defaultProfileId
  const fallbackProfileId = workspace !== undefined ? workspaceProfileId : defaultProfileId
  let source = 'default'
  let profileId = fallbackProfileId
  let rawOverrides = emptyOverrides
  if (saved !== undefined) {
    source = 'session'
    profileId = saved.profileId !== undefined && getProfile(state, saved.profileId) !== undefined
      ? saved.profileId
      : fallbackProfileId
    rawOverrides = saved.overrides ?? emptyOverrides
  } else if (workspace !== undefined) {
    source = 'workspace'
    rawOverrides = workspace.overrides ?? emptyOverrides
  }
  const profile = getProfile(state, profileId) ?? getProfile(state, 'all') ?? state.profiles[0]
  return {
    profileId: profile?.id ?? 'all',
    overrides: {
      add: stringList(rawOverrides?.add),
      remove: stringList(rawOverrides?.remove),
      includeTools: stringList(rawOverrides?.includeTools),
      excludeTools: stringList(rawOverrides?.excludeTools),
    },
    profile,
    source,
    ...(workspace !== undefined ? { workspaceCwd: cwd } : {}),
  }
}

/**
 * Match one user message against enabled tag rules.
 * @param {string} text
 * @param {object} tagRules
 * @returns {string[]} matched tags in rule order.
 */
export function matchTags(text, tagRules) {
  const haystack = String(text || '').toLowerCase()
  const matched = []
  for (const [tag, rule] of Object.entries(tagRules || {})) {
    if (rule === null || typeof rule !== 'object' || rule.enabled === false) continue
    const keywords = stringList(rule.keywords)
    if (keywords.some(keyword => keyword !== '' && haystack.includes(keyword.toLowerCase()))) matched.push(tag)
  }
  return matched
}

/**
 * Whether a plugin contributes to this session.
 * @param {object} record inventory record: { name, enabled, assignment }
 * @param {{profileId: string, overrides: object, profile: object|undefined}} sessionScope
 * @param {object} state
 * @returns {{visible: boolean, reason: string}}
 */
export function resolveVisibility(record, sessionScope, state) {
  if (record.enabled === false) return { visible: false, reason: 'disabled' }
  const assignment = record.assignment ?? assignmentFor(state, record.name)
  if (assignment.scope === 'off') return { visible: false, reason: 'off' }
  if (assignment.scope === 'global') return { visible: true, reason: 'global' }
  const overrides = sessionScope.overrides
  if (overrides.remove.includes(record.name)) return { visible: false, reason: 'removed-in-session' }
  if (overrides.add.includes(record.name)) return { visible: true, reason: 'added-in-session' }
  if (profileIncludes(sessionScope.profile, record.name)) return { visible: true, reason: 'profile' }
  return { visible: false, reason: 'not-in-profile' }
}

/**
 * Tools to hide from the agent. Unknown names are harmless: the Host drops
 * names the registry rejects before calling tools.restrict.
 * @param {object[]} records
 * @param {object} sessionScope
 * @param {object} state
 * @returns {string[]}
 */
export function collectDeniedTools(records, sessionScope, state) {
  const denied = new Set()
  for (const record of records) {
    const visibility = resolveVisibility(record, sessionScope, state)
    if (visibility.visible) continue
    for (const name of record.contribution?.tools ?? []) denied.add(name)
  }
  const profile = sessionScope.profile
  for (const name of profile?.tools?.exclude ?? []) denied.add(name)
  for (const name of sessionScope.overrides.excludeTools) denied.add(name)
  for (const name of profile?.tools?.include ?? []) denied.delete(name)
  for (const name of sessionScope.overrides.includeTools) denied.delete(name)
  return [...denied].sort()
}

/** @param {object[]} records @param {object} sessionScope @param {object} state @returns {string[]} */
export function collectHiddenSkills(records, sessionScope, state) {
  const hidden = new Set()
  for (const record of records) {
    const visibility = resolveVisibility(record, sessionScope, state)
    if (visibility.visible) continue
    for (const name of record.contribution?.skills ?? []) hidden.add(name)
  }
  const profile = sessionScope.profile
  for (const name of profile?.skills?.exclude ?? []) hidden.add(name)
  for (const name of profile?.skills?.include ?? []) hidden.delete(name)
  return [...hidden].sort()
}

/** @param {object[]} records @param {object} sessionScope @param {object} state @returns {string[]} */
export function collectHiddenSections(records, sessionScope, state) {
  const hidden = new Set()
  for (const record of records) {
    const visibility = resolveVisibility(record, sessionScope, state)
    if (visibility.visible) continue
    for (const name of record.contribution?.sections ?? []) hidden.add(name)
  }
  const profile = sessionScope.profile
  for (const name of profile?.sections?.exclude ?? []) hidden.add(name)
  for (const name of profile?.sections?.include ?? []) hidden.delete(name)
  return [...hidden].sort()
}

/** Rough schema token estimate (4 characters per token). */
export function estimateTokens(schemas) {
  if (!Array.isArray(schemas)) return { tools: 0, tokens: 0 }
  let characters = 0
  for (const schema of schemas) {
    if (schema === null || typeof schema !== 'object') continue
    characters += JSON.stringify({
      name: schema.name,
      description: schema.description,
      parameters: schema.parameters,
    }).length
  }
  return { tools: schemas.length, tokens: Math.ceil(characters / 4) }
}

/** @param {string} scope @returns {string} */
export function scopeLabel(scope) {
  if (scope === 'on-demand') return 'On demand'
  if (scope === 'off') return 'Off'
  return 'Global'
}

/** @param {object} state @param {object} input @returns {object} */
export function createProfile(state, input) {
  const wanted = typeof input?.id === 'string' ? input.id : ''
  const id = /^[a-z0-9][a-z0-9-]{0,63}$/.test(wanted) ? wanted : 'profile-' + Date.now().toString(36)
  if (getProfile(state, id) !== undefined) throw new Error('profile already exists: ' + id)
  const profile = normalizeProfile({ ...input, id, builtin: false, order: state.profiles.length }, state.profiles.length)
  state.profiles.push(profile)
  return profile
}

/** @param {object} state @param {string} id @param {object} patch @returns {object} */
export function updateProfile(state, id, patch) {
  const profile = getProfile(state, id)
  if (profile === undefined) throw new Error('unknown profile: ' + id)
  if (id === 'all') throw new Error('the All profile cannot be replaced')
  const merged = normalizeProfile({ ...profile, ...patch, id: profile.id, builtin: profile.builtin, order: profile.order }, profile.order ?? 0)
  Object.assign(profile, merged)
  return profile
}

/** @param {object} state @param {string} id @returns {boolean} */
export function deleteProfile(state, id) {
  if (id === 'all' || id === 'minimal') throw new Error('built-in profiles cannot be deleted')
  const index = state.profiles.findIndex(profile => profile.id === id)
  if (index < 0) throw new Error('unknown profile: ' + id)
  state.profiles.splice(index, 1)
  if (state.settings.defaultProfileId === id) state.settings.defaultProfileId = 'all'
  for (const session of Object.values(state.sessions)) {
    if (session.profileId === id) session.profileId = 'all'
  }
  return true
}
