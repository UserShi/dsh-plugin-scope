import assert from 'node:assert/strict'
import test from 'node:test'
import {
  collectDeniedTools,
  collectHiddenSections,
  collectHiddenSkills,
  defaultState,
  deleteProfile,
  estimateTokens,
  normalizeScope,
  normalizeState,
  resolveSessionScope,
  resolveVisibility,
  scopeLabel,
} from '../lib/core.js'

function record(name, scope, tools, skills, sections) {
  return {
    name,
    enabled: true,
    assignment: { scope, profiles: [], contribution: { tools: tools || [], skills: skills || [], sections: sections || [] }, mappedBy: 'manual' },
    contribution: { tools: tools || [], skills: skills || [], sections: sections || [] },
  }
}

test('default state contains the three built-in profiles', () => {
  const state = defaultState()
  assert.deepEqual(state.profiles.map(profile => profile.id), ['all', 'minimal', 'coding'])
  assert.equal(state.settings.defaultProfileId, 'all')
  assert.equal(state.settings.language, 'zh')
  assert.deepEqual(state.workspaces, {})
  assert.equal(state.version, 1)
})

test('workspace settings are normalized and sessions fall back to them', () => {
  const state = normalizeState({
    workspaces: {
      '/workspace/a': { profileId: 'minimal' },
      '  ': { profileId: 'all' },
    },
  })
  assert.deepEqual(Object.keys(state.workspaces), ['/workspace/a'])
  assert.equal(state.workspaces['/workspace/a'].profileId, 'minimal')

  const withoutSession = resolveSessionScope(state, 's1', '/workspace/a')
  assert.equal(withoutSession.profileId, 'minimal')
  assert.equal(withoutSession.source, 'workspace')
  assert.equal(withoutSession.workspaceCwd, '/workspace/a')

  state.sessions.s1 = { profileId: 'coding', overrides: { add: [], remove: [], includeTools: [], excludeTools: [] }, updatedAt: new Date().toISOString() }
  const withSession = resolveSessionScope(state, 's1', '/workspace/a')
  assert.equal(withSession.profileId, 'coding')
  assert.equal(withSession.source, 'session')
})

test('language defaults to zh and only accepts zh or en', () => {
  assert.equal(defaultState().settings.language, 'zh')
  assert.equal(normalizeState({ settings: { language: 'en' } }).settings.language, 'en')
  assert.equal(normalizeState({ settings: { language: 'fr' } }).settings.language, 'zh')
  assert.equal(normalizeState({ settings: {} }).settings.language, 'zh')
})

test('normalizeScope accepts aliases and rejects unknown values', () => {
  assert.equal(normalizeScope('off'), 'off')
  assert.equal(normalizeScope('disabled'), 'off')
  assert.equal(normalizeScope('on_demand'), 'on-demand')
  assert.equal(normalizeScope('onDemand'), 'on-demand')
  assert.equal(normalizeScope('weird'), 'global')
})

test('normalizeState keeps user profiles, merges defaults and normalizes assignments', () => {
  const state = normalizeState({
    version: 1,
    settings: { defaultProfileId: 'minimal' },
    profiles: [{ id: 'custom', name: 'Custom', plugins: ['dsh-ai-diagrams'], builtin: false }],
    plugins: { 'dsh-ai-diagrams': { scope: 'on-demand', profiles: ['custom'] } },
    sessions: { sessionA: { profileId: 'custom' } },
  })
  assert.ok(state.profiles.some(profile => profile.id === 'all'))
  assert.ok(state.profiles.some(profile => profile.id === 'custom'))
  assert.equal(state.settings.defaultProfileId, 'minimal')
  assert.equal(state.plugins['dsh-ai-diagrams'].scope, 'on-demand')
  assert.deepEqual(state.sessions.sessionA.overrides.excludeTools, [])
})

test('resolveSessionScope falls back to the default profile', () => {
  const state = defaultState()
  state.settings.defaultProfileId = 'minimal'
  const scope = resolveSessionScope(state, 'missing')
  assert.equal(scope.profileId, 'minimal')
  assert.equal(scope.profile.id, 'minimal')
})

test('global plugins are visible regardless of the profile', () => {
  const state = defaultState()
  const global = record('always', 'global', ['always_tool'])
  const scope = resolveSessionScope(state, 's1')
  assert.deepEqual(resolveVisibility(global, scope, state), { visible: true, reason: 'global' })
})

test('off and unselected on-demand tools are denied', () => {
  const state = defaultState()
  state.profiles = state.profiles.map(profile => profile.id === 'all' ? { ...profile, plugins: [] } : profile)
  state.settings.defaultProfileId = 'all'
  const off = record('off-plugin', 'off', ['off_tool'])
  const onDemand = record('diagram', 'on-demand', ['diagram_save', 'diagram_png'], ['diagram-design'])
  const global = record('always', 'global', ['always_tool'])
  const scope = resolveSessionScope(state, 's1')
  const denied = collectDeniedTools([off, onDemand, global], scope, state)
  assert.deepEqual(denied, ['diagram_png', 'diagram_save', 'off_tool'])
  assert.deepEqual(collectHiddenSkills([off, onDemand, global], scope, state), ['diagram-design'])
})

test('hidden prompt sections are collected for invisible plugins', () => {
  const state = defaultState()
  state.settings.defaultProfileId = 'minimal'
  const onDemand = record('diagram', 'on-demand', [], ['diagram-design'], ['diagram-guidance', 'design-review'])
  const scope = resolveSessionScope(state, 's1')
  assert.deepEqual(collectHiddenSections([onDemand], scope, state), ['design-review', 'diagram-guidance'])
  assert.deepEqual(collectHiddenSkills([onDemand], scope, state), ['diagram-design'])
})

test('on-demand becomes visible when the profile includes it', () => {
  const state = defaultState()
  state.settings.defaultProfileId = 'all'
  const onDemand = record('diagram', 'on-demand', ['diagram_save'])
  const scope = resolveSessionScope(state, 's1')
  assert.equal(resolveVisibility(onDemand, scope, state).visible, true)
  assert.deepEqual(collectDeniedTools([onDemand], scope, state), [])
})

test('session overrides can add or remove an on-demand plugin', () => {
  const state = defaultState()
  state.settings.defaultProfileId = 'minimal'
  state.sessions.s1 = {
    profileId: 'minimal',
    overrides: { add: ['diagram'], remove: [], includeTools: [], excludeTools: [] },
    updatedAt: new Date().toISOString(),
  }
  const onDemand = record('diagram', 'on-demand', ['diagram_save'])
  const scope = resolveSessionScope(state, 's1')
  assert.equal(resolveVisibility(onDemand, scope, state).visible, true)
  assert.deepEqual(collectDeniedTools([onDemand], scope, state), [])
})

test('tool include and exclude filters apply after plugin visibility', () => {
  const state = defaultState()
  state.settings.defaultProfileId = 'minimal'
  state.profiles = state.profiles.map(profile => profile.id === 'minimal'
    ? { ...profile, tools: { include: ['diagram_png'], exclude: ['diagram_save'] } }
    : profile)
  const onDemand = record('diagram', 'on-demand', ['diagram_save', 'diagram_png'])
  const scope = resolveSessionScope(state, 's1')
  assert.deepEqual(collectDeniedTools([onDemand], scope, state), ['diagram_save'])
})

test('estimateTokens is stable for an empty and a populated schema', () => {
  assert.deepEqual(estimateTokens([]), { tools: 0, tokens: 0 })
  const result = estimateTokens([{ name: 'x', description: 'hello', parameters: { type: 'object' } }])
  assert.equal(result.tools, 1)
  assert.ok(result.tokens > 0)
})

test('scopeLabel is human readable', () => {
  assert.equal(scopeLabel('global'), 'Global')
  assert.equal(scopeLabel('on-demand'), 'On demand')
  assert.equal(scopeLabel('off'), 'Off')
})

test('built-in profiles cannot be deleted', () => {
  const state = defaultState()
  assert.throws(() => deleteProfile(state, 'all'), /built-in/)
  assert.throws(() => deleteProfile(state, 'minimal'), /built-in/)
})
