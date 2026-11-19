/**
 * Durable scope state for one Harness profile.
 *
 * The file is the user's data, not configuration: nothing here reads or writes
 * cordis.patch.yml. Writes are serialized and atomic so a crash cannot leave a
 * half-written state file.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { defaultState, normalizeState } from './core.js'

export class StateStore {
  /**
   * @param {string} profileDir absolute profile directory
   * @param {{ logger?: {warn: Function, info?: Function} }} [options]
   */
  constructor(profileDir, options = {}) {
    this.dir = join(profileDir, '.dsh-plugin-scope')
    this.path = join(this.dir, 'state.json')
    this.backupPath = join(this.dir, 'state.backup.json')
    this.logger = options.logger
    this.queue = Promise.resolve()
    this.lastWarning = undefined
  }

  /** @returns {object} normalized state, defaulting on a missing/corrupt file. */
  load() {
    try {
      if (!existsSync(this.path)) return defaultState()
      const text = readFileSync(this.path, 'utf8')
      const parsed = JSON.parse(text)
      return normalizeState(parsed)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      this.lastWarning = 'state could not be read: ' + message
      this.logger?.warn?.('[plugin-scope] ' + this.lastWarning)
      try {
        if (existsSync(this.path)) renameSync(this.path, this.path + '.corrupt-' + Date.now())
      } catch {
        // The corrupt file is already unusable; a failed rename must not block boot.
      }
      return defaultState()
    }
  }

  /** @param {object} state @returns {object} the same normalized state after writing. */
  save(state) {
    const normalized = normalizeState(state)
    mkdirSync(this.dir, { recursive: true })
    if (existsSync(this.path)) {
      try { copyFileSync(this.path, this.backupPath) } catch { /* backup is best effort */ }
    }
    const temporary = this.path + '.tmp-' + process.pid + '-' + Date.now()
    writeFileSync(temporary, JSON.stringify(normalized, null, 2) + '\n', 'utf8')
    renameSync(temporary, this.path)
    return normalized
  }

  /**
   * Serialize a read-modify-write. The callback receives a parsed state and may
   * mutate it; the returned value is passed through to the caller.
   * @param {(state: object) => unknown} mutate
   * @returns {Promise<unknown>}
   */
  update(mutate) {
    const run = this.queue.then(() => {
      const state = this.load()
      const result = mutate(state)
      this.save(state)
      return result
    })
    this.queue = run.catch(() => undefined)
    return run
  }

  /** @returns {string} absolute state path for diagnostics. */
  get file() {
    return this.path
  }

  /** @returns {string} directory containing state and logs. */
  get directory() {
    return this.dir
  }
}
