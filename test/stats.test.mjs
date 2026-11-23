import assert from 'node:assert/strict'
import test from 'node:test'
import {
  aggregateStats,
  attributeStats,
  estimateValueTokens,
  foldSessionStats,
  foldSessionTurns,
  groupByWorkspace,
} from '../lib/stats.js'

const call = {
  type: 'tool/call',
  data: { callId: 'c1', name: 'run_code', arguments: '{"code":"x"}' },
}
const result = {
  type: 'tool/result',
  data: {
    message: {
      role: 'tool',
      source: { kind: 'tool', callId: 'c1' },
      content: [{ type: 'text', text: 'hello world' }],
    },
  },
}

test('foldSessionStats counts calls, tool tokens and model usage', () => {
  const stats = foldSessionStats([
    { type: 'turn/start', data: {} },
    call,
    result,
    { type: 'assistant/message', data: { usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 } } },
    { type: 'step/end', data: {} },
  ])
  const expectedTokens = estimateValueTokens(call.data.arguments) + estimateValueTokens(result.data.message)
  assert.equal(stats.calls, 1)
  assert.equal(stats.tokens, expectedTokens)
  assert.equal(stats.tools.run_code.calls, 1)
  assert.equal(stats.tools.run_code.tokens, expectedTokens)
  assert.deepEqual(stats.usage, { input: 10, output: 5, cacheRead: 0, cacheWrite: 0, total: 15 })
  assert.equal(stats.turns, 1)
  assert.equal(stats.steps, 1)
})

test('foldSessionStats counts PTC nested dispatches', () => {
  const stats = foldSessionStats([{
    type: 'tool/ptc-dispatch',
    data: { name: 'diagram_save', arguments: { html: 'x' }, content: [{ type: 'text', text: 'ok' }] },
  }])
  assert.equal(stats.calls, 1)
  assert.equal(stats.tools.diagram_save.calls, 1)
  assert.ok(stats.tools.diagram_save.tokens > 0)
})

test('aggregateStats sums sessions and attributes tools to plugins', () => {
  const one = foldSessionStats([call, result])
  const two = foldSessionStats([call, result])
  const total = aggregateStats([one, two])
  assert.equal(total.calls, 2)
  const records = [{ name: 'demo', contribution: { tools: ['run_code'], skills: [], sections: [] } }]
  const attributed = attributeStats(records, total)
  assert.equal(attributed.plugins.demo.calls, 2)
  assert.equal(attributed.plugins.demo.tokens, total.tokens)
  assert.equal(attributed.plugins.demo.tools.run_code.calls, 2)
  assert.equal(attributed.unattributed.calls, 0)
})

test('foldSessionTurns separates turns, prompts and tool usage', () => {
  const firstCall = { ...call, data: { ...call.data, turn: 1 } }
  const firstResult = { ...result, data: { ...result.data, turn: 1 } }
  const turns = foldSessionTurns([
    { type: 'turn/start', time: 100, data: { turn: 1 } },
    { type: 'user/message', time: 101, data: { content: [{ type: 'text', text: 'first prompt' }], source: { kind: 'user' } } },
    { type: 'user/message', time: 102, data: { content: [{ type: 'text', text: 'time context' }], source: { kind: 'time-context' } } },
    firstCall,
    firstResult,
    { type: 'assistant/message', data: { turn: 1, usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 } } },
    { type: 'turn/end', time: 200, data: { turn: 1, reason: { kind: 'completed' } } },
    { type: 'turn/start', time: 300, data: { turn: 2 } },
    { type: 'user/message', time: 301, data: { content: [{ type: 'text', text: 'second prompt' }], source: { kind: 'user' } } },
  ])
  assert.equal(turns.length, 2)
  assert.equal(turns[0].turn, 1)
  assert.equal(turns[0].prompt, 'first prompt')
  assert.equal(turns[0].calls, 1)
  assert.equal(turns[0].usage.total, 15)
  assert.equal(turns[0].durationMs, 100)
  assert.equal(turns[1].prompt, 'second prompt')
  assert.equal(turns[1].status, 'open')
})

test('groupByWorkspace aggregates by cwd', () => {
  const stats = foldSessionStats([call, result])
  const workspaces = groupByWorkspace([
    { cwd: '/a', stats: stats },
    { cwd: '/a', stats: stats },
    { cwd: '/b', stats: stats },
  ])
  assert.equal(workspaces['/a'].sessions, 2)
  assert.equal(workspaces['/a'].calls, 2)
  assert.equal(workspaces['/b'].calls, 1)
})
