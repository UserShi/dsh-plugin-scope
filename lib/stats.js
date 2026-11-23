/** Pure usage folding for plugin-scope. */

/** @returns {object} an empty usage record. */
export function emptyStats() {
  return {
    calls: 0,
    tokens: 0,
    tools: {},
    usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
    turns: 0,
    steps: 0,
  }
}

/** @param {unknown} value @returns {number} rough token estimate, JSON length / 4. */
export function estimateValueTokens(value) {
  try {
    const text = typeof value === 'string' ? value : JSON.stringify(value)
    return Math.ceil(String(text || '').length / 4)
  } catch {
    return 0
  }
}

/** @param {object} stats @param {string} name @returns {{calls: number, tokens: number}} */
function toolBucket(stats, name) {
  if (stats.tools[name] === undefined) stats.tools[name] = { calls: 0, tokens: 0 }
  return stats.tools[name]
}

/** @param {object} stats @param {unknown} usage @returns {void} */
function addUsage(stats, usage) {
  if (usage === null || typeof usage !== 'object') return
  const input = Number(usage.inputTokens)
  const output = Number(usage.outputTokens)
  const cacheRead = Number(usage.cacheReadTokens)
  const cacheWrite = Number(usage.cacheWriteTokens)
  const total = Number(usage.totalTokens)
  if (Number.isFinite(input)) stats.usage.input += input
  if (Number.isFinite(output)) stats.usage.output += output
  if (Number.isFinite(cacheRead)) stats.usage.cacheRead += cacheRead
  if (Number.isFinite(cacheWrite)) stats.usage.cacheWrite += cacheWrite
  stats.usage.total += Number.isFinite(total) && total > 0
    ? total
    : (Number.isFinite(input) ? input : 0)
      + (Number.isFinite(output) ? output : 0)
      + (Number.isFinite(cacheRead) ? cacheRead : 0)
      + (Number.isFinite(cacheWrite) ? cacheWrite : 0)
}

/**
 * Fold one chronological session event log into call/token totals.
 * Token counts are estimates over tool arguments and model-facing results;
 * model usage is the provider-reported total when present.
 * @param {readonly object[]} events
 * @returns {object}
 */
export function foldSessionStats(events) {
  const stats = emptyStats()
  const calls = new Map()
  for (const event of events || []) {
    if (event.type === 'turn/start') stats.turns += 1
    if (event.type === 'step/end') stats.steps += 1
    if (event.type === 'assistant/message') addUsage(stats, event.data?.usage)
    if (event.type === 'tool/call') {
      const name = String(event.data?.name || 'unknown')
      const callId = String(event.data?.callId || '')
      calls.set(callId, name)
      stats.calls += 1
      const bucket = toolBucket(stats, name)
      bucket.calls += 1
      const tokens = estimateValueTokens(event.data?.arguments)
      bucket.tokens += tokens
      stats.tokens += tokens
    }
    if (event.type === 'tool/result') {
      const callId = String(event.data?.message?.source?.callId || event.data?.message?.toolCallId || '')
      const name = calls.get(callId) || 'unknown'
      const tokens = estimateValueTokens(event.data?.message)
      const bucket = toolBucket(stats, name)
      bucket.tokens += tokens
      stats.tokens += tokens
    }
    if (event.type === 'tool/ptc-dispatch') {
      const name = String(event.data?.name || 'unknown')
      const tokens = estimateValueTokens(event.data?.arguments) + estimateValueTokens(event.data?.content)
      const bucket = toolBucket(stats, name)
      bucket.calls += 1
      bucket.tokens += tokens
      stats.calls += 1
      stats.tokens += tokens
    }
  }
  return stats
}

/** @param {object} message @returns {string} */
function messageText(message) {
  const content = message?.content
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content.map(part => typeof part?.text === 'string' ? part.text : '').filter(Boolean).join('\n')
}

/**
 * Fold one session's events into per-turn usage rows.
 * Events carry data.turn; user messages (which do not) attach to the turn
 * opened by the preceding turn/start event.
 * @param {readonly object[]} events
 * @returns {object[]}
 */
export function foldSessionTurns(events) {
  const buckets = new Map()
  let current = null
  function bucket(turn) {
    if (buckets.has(turn)) return buckets.get(turn)
    const entry = {
      turn,
      startAt: null,
      endAt: null,
      status: 'open',
      prompt: '',
      events: [],
    }
    buckets.set(turn, entry)
    return entry
  }
  for (const event of events || []) {
    if (event.type === 'turn/start') {
      current = Number(event.data?.turn)
      if (Number.isFinite(current)) {
        const entry = bucket(current)
        entry.startAt = event.time ?? null
        entry.status = 'open'
      }
      continue
    }
    if (event.type === 'turn/end') {
      const turn = Number(event.data?.turn)
      if (Number.isFinite(turn)) {
        const entry = bucket(turn)
        entry.endAt = event.time ?? null
        entry.status = 'closed'
        entry.reason = event.data?.reason?.kind
      }
      continue
    }
    const turn = Number(event.data?.turn)
    if (Number.isFinite(turn)) {
      current = turn
      bucket(turn)
    }
    if (current === null) continue
    const entry = bucket(current)
    entry.events.push(event)
    if (event.type === 'user/message' && entry.prompt === '' && event.data?.source?.kind === 'user') {
      entry.prompt = messageText(event.data).trim()
    }
  }
  return [...buckets.values()]
    .filter(entry => Number.isFinite(entry.turn))
    .sort((left, right) => left.turn - right.turn)
    .map(entry => {
      const stats = foldSessionStats(entry.events)
      return {
        turn: entry.turn,
        startAt: entry.startAt,
        endAt: entry.endAt,
        durationMs: entry.startAt !== null && entry.endAt !== null ? Math.max(0, entry.endAt - entry.startAt) : null,
        status: entry.status,
        reason: entry.reason,
        prompt: entry.prompt,
        ...stats,
      }
    })
}

/** @param {object} target @param {object} source @returns {object} target */
export function mergeStats(target, source) {
  target.calls += source.calls || 0
  target.tokens += source.tokens || 0
  target.turns += source.turns || 0
  target.steps += source.steps || 0
  for (const [key, value] of Object.entries(source.usage || {})) {
    target.usage[key] = (target.usage[key] || 0) + (Number(value) || 0)
  }
  for (const [name, bucket] of Object.entries(source.tools || {})) {
    const targetBucket = toolBucket(target, name)
    targetBucket.calls += bucket.calls || 0
    targetBucket.tokens += bucket.tokens || 0
  }
  return target
}

/** @param {object[]} sessions @returns {object} aggregate */
export function aggregateStats(sessions) {
  const total = emptyStats()
  for (const session of sessions || []) mergeStats(total, session.stats || session)
  return total
}

/** @param {object[]} records @returns {Map<string, string>} tool name to plugin name. */
export function toolOwners(records) {
  const owners = new Map()
  for (const record of records || []) {
    const contribution = record.contribution ?? record.assignment?.contribution
    for (const tool of contribution?.tools || []) {
      if (!owners.has(tool)) owners.set(tool, record.name)
    }
  }
  return owners
}

/** @param {object[]} records @param {object} stats @returns {{plugins: object, unattributed: object}} */
export function attributeStats(records, stats) {
  const owners = toolOwners(records)
  const plugins = {}
  const unattributed = { calls: 0, tokens: 0 }
  for (const [tool, bucket] of Object.entries(stats?.tools || {})) {
    const plugin = owners.get(tool)
    if (plugin === undefined) {
      unattributed.calls += bucket.calls || 0
      unattributed.tokens += bucket.tokens || 0
      continue
    }
    if (plugins[plugin] === undefined) plugins[plugin] = { calls: 0, tokens: 0, tools: {} }
    plugins[plugin].calls += bucket.calls || 0
    plugins[plugin].tokens += bucket.tokens || 0
    plugins[plugin].tools[tool] = {
      calls: (plugins[plugin].tools[tool]?.calls || 0) + (bucket.calls || 0),
      tokens: (plugins[plugin].tools[tool]?.tokens || 0) + (bucket.tokens || 0),
    }
  }
  return { plugins, unattributed }
}

/** @param {object[]} sessions @returns {object} cwd to aggregate stats. */
export function groupByWorkspace(sessions) {
  const workspaces = {}
  for (const session of sessions || []) {
    const cwd = typeof session.cwd === 'string' ? session.cwd : ''
    if (cwd === '') continue
    if (workspaces[cwd] === undefined) {
      workspaces[cwd] = { calls: 0, tokens: 0, sessions: 0 }
    }
    workspaces[cwd].calls += session.stats?.calls || 0
    workspaces[cwd].tokens += session.stats?.tokens || 0
    workspaces[cwd].sessions += 1
  }
  return workspaces
}
