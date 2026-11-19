/**
 * Browser half of Plugin Scope.
 *
 * Registered through the Harness module loader; React arrives from the host's
 * module table. No Harness Client package is imported, so a host upgrade can
 * change primitives without breaking this bundle.
 */
window.__ModuleLoader__.load({
  id: 'dsh-plugin-scope',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const COPY = {
      en: {
        nav: 'Plugin Scope',
        scopesTab: 'Scopes',
        language: 'Language',
        conversationPlugins: 'Conversation plugins',
        pluginsShort: 'Plugins',
        currentProfile: 'Current profile',
        enabledCount: '{count} enabled',
        searchPlugins: 'Search by plugin name or description…',
        globalPlugins: 'Global plugins',
        enabledInConversation: 'Enabled in this conversation',
        availableOnDemand: 'Available on demand',
        offPlugins: 'Off',
        enable: 'Enable',
        disable: 'Disable',
        alwaysOn: 'Always on',
        offHint: 'Set it to On demand on the Scopes page to enable it here.',
        noSearchResults: 'No matching plugins.',
        globalNote: 'Global plugins stay on. On-demand toggles affect only this conversation.',
        workspaces: 'Workspaces',
        noWorkspaces: 'No workspace settings yet. Open a conversation with a working directory to configure one.',
        workspaceDefault: 'Follow default',
        workspaceSaved: 'Workspace scope saved.',
        workspaceCleared: 'Workspace scope cleared.',
        clearWorkspace: 'Clear',
        workspaceNote: 'Conversations without their own override use their workspace scope; a conversation override wins.',
        currentWorkspace: 'Current',
        sourceSession: 'Conversation override',
        sourceWorkspace: 'Workspace scope',
        sourceDefault: 'Default scope',
        resetSession: 'Use default',
        sessionReset: 'Using the default scope.',
        title: 'Plugin Scope',
        subtitle: 'Choose which plugins are global, on demand or off for each conversation.',
        global: 'Global',
        onDemand: 'On demand',
        off: 'Off',
        tools: 'tools',
        tokens: 'tokens',
        profiles: 'Scope profiles',
        defaultProfile: 'Default scope',
        sessions: 'Live sessions',
        noSessions: 'No live sessions. New conversations use the default scope.',
        plugins: 'Plugins',
        plugin: 'Plugin',
        scope: 'Scope',
        map: 'Map tools',
        mapped: 'Mapped',
        unmapped: 'Unmapped',
        protected: 'Management',
        save: 'Save',
        saving: 'Saving…',
        applied: 'Applied',
        restart: 'Restart required',
        failed: 'Failed',
        retry: 'Retry',
        loading: 'Loading Plugin Scope…',
        empty: 'No plugins are installed in this profile.',
        noProfiles: 'No scope profiles yet.',
        newProfile: 'New profile',
        deleteProfile: 'Delete',
        makeDefault: 'Make default',
        compactTools: 'visible tool schemas',
        hiddenTools: 'hidden tools',
        hiddenSkills: 'hidden skills',
        mappingTitle: 'Map contributions to',
        mappingHelp: 'Select the tools and skills this plugin contributes. Hidden contributions are removed from conversations that do not select the plugin.',
        toolsHeading: 'Tools',
        skillsHeading: 'Skills',
        noSkills: 'No skills are visible in this session.',
        sectionsHeading: 'Prompt sections (advanced)',
        sectionsHelp: 'Comma- or newline-separated section names. Only add names you know belong to this plugin.',
        close: 'Close',
        saveMapping: 'Save mapping',
        note: 'On-demand keeps the plugin loaded but removes its tool declarations from unselected conversations.',
        sessionScope: 'Conversation scope',
        open: 'Open',
        noPlugin: 'This plugin is not in the scope inventory.',
        error: 'Plugin Scope error',
        protectedNote: 'Management plugins can only stay Global.',
        on: 'On',
        offLabel: 'Off',
        applyToSession: 'Apply to this conversation',
        scopeSaved: 'Scope saved.',
        config: 'Configuration',
        showChip: 'Show conversation chip',
        autoApply: 'Apply default scope to new conversations',
        subagents: 'Subagents inherit the parent scope',
        defaultSaved: 'Default scope saved.',
      },
      zh: {
        nav: '插件作用域',
        scopesTab: '作用域',
        language: '语言',
        conversationPlugins: '对话插件',
        pluginsShort: '插件',
        currentProfile: '当前模板',
        enabledCount: '{count} 个已启用',
        searchPlugins: '搜索插件名称或说明…',
        globalPlugins: '全局插件',
        enabledInConversation: '本次对话已启用',
        availableOnDemand: '可选按需插件',
        offPlugins: '已关闭',
        enable: '启用',
        disable: '停用',
        alwaysOn: '常驻',
        offHint: '在作用域页设为「按需」后可在这里启用。',
        noSearchResults: '没有匹配的插件。',
        globalNote: '全局插件始终启用；按需插件只影响当前对话。',
        workspaces: '工作区',
        noWorkspaces: '还没有工作区配置。打开一个带工作目录的对话后可以在这里设置。',
        workspaceDefault: '跟随默认',
        workspaceSaved: '工作区配置已保存。',
        workspaceCleared: '工作区配置已清除。',
        clearWorkspace: '清除',
        workspaceNote: '没有单独设置的对话使用所属工作区配置；会话设置优先。',
        currentWorkspace: '当前',
        sourceSession: '会话覆盖',
        sourceWorkspace: '工作区配置',
        sourceDefault: '默认配置',
        resetSession: '恢复默认',
        sessionReset: '已恢复默认配置。',
        title: '插件作用域',
        subtitle: '为每个对话选择哪些插件常驻、按需或关闭。',
        global: '全局',
        onDemand: '按需',
        off: '关闭',
        tools: '工具',
        tokens: 'tokens',
        profiles: '作用域模板',
        defaultProfile: '默认作用域',
        sessions: '活跃对话',
        noSessions: '当前没有活跃对话；新对话使用默认作用域。',
        plugins: '插件',
        plugin: '插件',
        scope: '作用域',
        map: '映射工具',
        mapped: '已映射',
        unmapped: '未映射',
        protected: '管理插件',
        save: '保存',
        saving: '保存中…',
        applied: '已生效',
        restart: '需要重启',
        failed: '失败',
        retry: '重试',
        loading: '正在加载插件作用域…',
        empty: '当前 profile 没有已安装插件。',
        noProfiles: '还没有作用域模板。',
        newProfile: '新建模板',
        deleteProfile: '删除',
        makeDefault: '设为默认',
        compactTools: '可见工具声明',
        hiddenTools: '隐藏工具',
        hiddenSkills: '隐藏技能',
        mappingTitle: '映射贡献到',
        mappingHelp: '勾选该插件贡献的工具和技能；未被选中的对话会移除这些贡献。',
        toolsHeading: '工具',
        skillsHeading: '技能',
        noSkills: '当前会话没有可见技能。',
        sectionsHeading: '提示词段落（高级）',
        sectionsHelp: '用逗号或换行分隔段落名称；只填你确认属于该插件的段落。',
        close: '关闭',
        saveMapping: '保存映射',
        note: '按需模式会保留插件加载，但从未选中的对话中移除其工具声明。',
        sessionScope: '对话作用域',
        open: '打开',
        noPlugin: '这个插件不在作用域清单中。',
        error: '插件作用域错误',
        protectedNote: '管理插件只能保持全局。',
        on: '开',
        offLabel: '关',
        applyToSession: '应用到当前对话',
        scopeSaved: '作用域已保存。',
        config: '配置',
        showChip: '显示对话作用域标签',
        autoApply: '新对话自动应用默认作用域',
        subagents: '子代理继承父对话作用域',
        defaultSaved: '默认作用域已保存。',
      },
    }

    let currentLanguage = 'zh'
    try {
      const saved = localStorage.getItem('dsh-plugin-scope.language')
      if (saved === 'zh' || saved === 'en') currentLanguage = saved
    } catch { /* localStorage may be unavailable */ }

    const PROFILE_COPY = {
      all: {
        zh: { name: '全部', description: '所有按需插件' },
        en: { name: 'All', description: 'Every on-demand plugin' },
      },
      minimal: {
        zh: { name: '最小', description: '不启用任何按需插件' },
        en: { name: 'Minimal', description: 'No on-demand plugins' },
      },
      coding: {
        zh: { name: '编码', description: '编码与文件操作' },
        en: { name: 'Coding', description: 'Coding and file operations' },
      },
    }

    function normalizeLanguage(value) {
      return value === 'en' ? 'en' : 'zh'
    }

    const languageListeners = new Set()

    function setLanguage(value) {
      const next = normalizeLanguage(value)
      if (next === currentLanguage) return
      currentLanguage = next
      try { localStorage.setItem('dsh-plugin-scope.language', currentLanguage) } catch { /* ignore */ }
      for (const listener of languageListeners) {
        try { listener() } catch { /* listener errors are isolated */ }
      }
    }

    function useLanguage() {
      const [, setTick] = React.useState(0)
      React.useEffect(function () {
        const listener = function () { setTick(function (value) { return value + 1 }) }
        languageListeners.add(listener)
        return function () { languageListeners.delete(listener) }
      }, [])
      return currentLanguage
    }

    function profileName(profile, language) {
      if (profile?.builtin === true) {
        const copy = PROFILE_COPY[profile.id]?.[language]
        if (copy !== undefined) return copy.name
      }
      return profile?.name || profile?.id || ''
    }

    function profileDescription(profile, language) {
      if (profile?.builtin === true) {
        const copy = PROFILE_COPY[profile.id]?.[language]
        if (copy !== undefined) return copy.description
      }
      return profile?.description || ''
    }

    function profilePluginCount(profile, language) {
      if (profile.plugins.includes('*')) return language === 'zh' ? '全部插件' : 'All plugins'
      const count = profile.plugins.length
      return language === 'zh' ? count + ' 个插件' : count + (count === 1 ? ' plugin' : ' plugins')
    }

    function isSubsequence(needle, haystack) {
      let index = 0
      for (const character of haystack) {
        if (character === needle[index]) index += 1
        if (index === needle.length) return true
      }
      return needle.length === 0
    }

    function pluginSearchScore(plugin, query) {
      const text = String(query || '').trim().toLowerCase()
      if (text === '') return 1
      const fields = [plugin.title, plugin.name, plugin.description]
        .filter(function (value) { return typeof value === 'string' && value !== '' })
        .map(function (value) { return value.toLowerCase() })
      let best = 0
      for (const field of fields) {
        const index = field.indexOf(text)
        if (index >= 0) best = Math.max(best, 100 - Math.min(index, 40))
      }
      if (best > 0) return best
      const tokens = text.split(/\s+/).filter(Boolean)
      const haystack = fields.join(' ')
      if (tokens.length > 1 && tokens.every(function (token) { return haystack.includes(token) })) return 60
      if (fields.some(function (field) { return isSubsequence(text, field) })) return 30
      return 0
    }

    function makeT(ctx) {
      return function t(key, vars) {
        const dict = COPY[currentLanguage] || COPY.zh
        let text = dict[key] ?? COPY.en[key] ?? key
        if (vars !== undefined && vars !== null) {
          text = text.replace(/\{(\w+)\}/g, function (_match, name) {
            return String(vars[name] ?? '')
          })
        }
        return text
      }
    }

    async function request(path, options) {
      const init = options || {}
      const headers = Object.assign({}, init.headers || {})
      if (init.body !== undefined) headers['content-type'] = 'application/json'
      const response = await fetch('/api/dsh-plugin-scope' + path, Object.assign({ cache: 'no-store' }, init, { headers }))
      let body = {}
      try { body = await response.json() } catch { body = {} }
      if (!response.ok || body.ok === false) {
        const message = body?.error?.message || ('HTTP ' + response.status)
        const error = new Error(message)
        error.code = body?.error?.code
        throw error
      }
      return body
    }

    const cache = new Map()

    async function loadState(sessionId, force) {
      const key = sessionId || ''
      const entry = cache.get(key)
      if (!force && entry !== undefined && Date.now() - entry.at < 1200) return entry.value
      const suffix = sessionId ? '?session=' + encodeURIComponent(sessionId) : ''
      const value = await request('/state' + suffix)
      cache.set(key, { at: Date.now(), value })
      return value
    }

    function invalidate() {
      cache.clear()
    }

    function notifyScopeChanged() {
      try { window.dispatchEvent(new Event('dsh-plugin-scope:changed')) } catch { /* ignore */ }
    }

    async function post(path, body) {
      const result = await request(path, { method: 'POST', body: JSON.stringify(body || {}) })
      invalidate()
      notifyScopeChanged()
      return result
    }

    function useScopeState(ctx, sessionId) {
      const [state, setState] = React.useState(null)
      const [error, setError] = React.useState(null)
      const [loading, setLoading] = React.useState(true)
      const refresh = React.useCallback(async function (force) {
        try {
          if (force === true) setLoading(state === null)
          const next = await loadState(sessionId, force === true)
          setLanguage(next?.settings?.language)
          setState(next)
          setError(null)
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : String(caught))
        } finally {
          setLoading(false)
        }
      }, [sessionId])
      React.useEffect(function () {
        refresh(false)
      }, [refresh])
      React.useEffect(function () {
        const onChange = function () { refresh(true) }
        window.addEventListener('dsh-plugin-scope:changed', onChange)
        return function () { window.removeEventListener('dsh-plugin-scope:changed', onChange) }
      }, [refresh])
      return { state: state, error: error, loading: loading, refresh: refresh, setState: setState }
    }

    function useBusy() {
      const [busy, setBusy] = React.useState(false)
      const [message, setMessage] = React.useState(null)
      const [failure, setFailure] = React.useState(null)
      const run = React.useCallback(async function (task, success) {
        setBusy(true)
        setFailure(null)
        try {
          const result = await task()
          setMessage(success || null)
          return result
        } catch (caught) {
          setFailure(caught instanceof Error ? caught.message : String(caught))
          return undefined
        } finally {
          setBusy(false)
        }
      }, [])
      return { busy: busy, message: message, failure: failure, run: run, clear: function () { setMessage(null); setFailure(null) } }
    }

    const CSS = [
      '.pscope-root{display:flex;flex-direction:column;gap:16px;color:var(--dsw-alias-label-primary,#2d3142);font-size:13px;line-height:1.45}',
      '.pscope-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}',
      '.pscope-title{margin:0;font-size:18px;font-weight:600;letter-spacing:-.01em}',
      '.pscope-sub{margin:4px 0 0;color:var(--dsw-alias-label-secondary,#5a6580);font-size:12px}',
      '.pscope-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px}',
      '.pscope-card{border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.12));border-radius:10px;padding:10px 12px;background:var(--dsw-alias-bg-layer-1,#fff)}',
      '.pscope-card-label{font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--dsw-alias-label-tertiary,#8a93a6)}',
      '.pscope-card-value{font-size:16px;font-weight:600;margin-top:2px}',
      '.pscope-card-note{font-size:11px;color:var(--dsw-alias-label-secondary,#5a6580);margin-top:2px}',
      '.pscope-section{border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.12));border-radius:12px;background:var(--dsw-alias-bg-layer-1,#fff);overflow:hidden}',
      '.pscope-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1));background:var(--dsw-alias-bg-layer-2,#fafafa)}',
      '.pscope-section-title{font-size:13px;font-weight:600}',
      '.pscope-table{width:100%;border-collapse:collapse}',
      '.pscope-table th{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--dsw-alias-label-tertiary,#8a93a6);text-align:left;font-weight:500;padding:8px 12px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1))}',
      '.pscope-table td{padding:10px 12px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.08));vertical-align:top}',
      '.pscope-table tr:last-child td{border-bottom:0}',
      '.pscope-plugin-name{font-weight:600;word-break:break-word}',
      '.pscope-plugin-meta{font-size:11px;color:var(--dsw-alias-label-secondary,#5a6580);margin-top:2px}',
      '.pscope-badge{display:inline-flex;align-items:center;gap:4px;border-radius:999px;padding:2px 8px;font-size:10px;font-weight:600;border:1px solid transparent;white-space:nowrap}',
      '.pscope-badge.global{background:color-mix(in srgb, var(--dsw-alias-state-success-primary,#2e7a4a) 14%, transparent);color:var(--dsw-alias-state-success-primary,#2e7a4a);border-color:color-mix(in srgb, var(--dsw-alias-state-success-primary,#2e7a4a) 35%, transparent)}',
      '.pscope-badge.on-demand{background:color-mix(in srgb, var(--dsw-alias-brand-primary,#2e5aa8) 14%, transparent);color:var(--dsw-alias-brand-primary,#2e5aa8);border-color:color-mix(in srgb, var(--dsw-alias-brand-primary,#2e5aa8) 35%, transparent)}',
      '.pscope-badge.off{background:var(--dsw-alias-interactive-bg-hover,rgba(45,49,66,.08));color:var(--dsw-alias-label-secondary,#5a6580);border-color:var(--dsw-alias-border-l2,rgba(45,49,66,.15))}',
      '.pscope-badge.protected{background:color-mix(in srgb, var(--dsw-alias-state-warn-primary,#bf4520) 12%, transparent);color:var(--dsw-alias-state-warn-primary,#bf4520);border-color:color-mix(in srgb, var(--dsw-alias-state-warn-primary,#bf4520) 35%, transparent)}',
      '.pscope-seg{display:inline-flex;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.18));border-radius:8px;overflow:hidden}',
      '.pscope-seg button{border:0;background:transparent;padding:4px 9px;font-size:11px;color:var(--dsw-alias-label-secondary,#5a6580);cursor:pointer;font-family:inherit}',
      '.pscope-seg button[data-active="true"]{background:var(--dsw-alias-button-ghost-active-fill,#eef1f6);color:var(--dsw-alias-label-primary,#2d3142);font-weight:600}',
      '.pscope-seg button:disabled{opacity:.45;cursor:not-allowed}',
      '.pscope-lang{display:inline-flex;align-items:center;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.16));border-radius:7px;overflow:hidden;background:var(--dsw-alias-bg-layer-1,#fff)}',
      '.pscope-lang button{border:0;background:transparent;color:var(--dsw-alias-label-secondary,#5a6580);padding:4px 8px;font-size:11px;cursor:pointer;font-family:inherit}',
      '.pscope-lang button[data-active="true"]{background:var(--dsw-alias-button-ghost-active-fill,#eef1f6);color:var(--dsw-alias-label-primary,#2d3142);font-weight:600}',
      '.pscope-lang button:disabled{opacity:.5;cursor:not-allowed}',
      '.pscope-header-btn{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 9px;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.16));border-radius:999px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-secondary,#5a6580);font-size:11px;font-family:inherit;cursor:pointer;white-space:nowrap}',
      '.pscope-header-btn:hover{background:var(--dsw-alias-interactive-bg-hover,#f3f5f8);color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-header-icon{font-size:12px;color:var(--dsw-alias-brand-primary,#2e5aa8)}',
      '.pscope-header-count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--dsw-alias-button-ghost-active-fill,#eef1f6);color:var(--dsw-alias-label-primary,#2d3142);font-size:10px;font-weight:600}',
      '.pscope-popover-backdrop{position:fixed;inset:0;z-index:900;background:transparent}',
      '.pscope-popover{position:fixed;top:64px;right:24px;z-index:901;display:flex;flex-direction:column;width:min(460px,calc(100vw - 32px));max-height:calc(100vh - 92px);background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.15));border-radius:12px;box-shadow:0 18px 50px rgba(20,24,36,.25);overflow:hidden}',
      '.pscope-popover-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:12px 14px 10px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1))}',
      '.pscope-popover-title{font-size:14px;font-weight:650;color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-popover-sub{font-size:11px;color:var(--dsw-alias-label-secondary,#5a6580);margin-top:2px}',
      '.pscope-popover-search{padding:10px 14px 4px}',
      '.pscope-search{padding:7px 9px;font-size:12px}',
      '.pscope-popover-body{overflow:auto;padding:2px 10px 10px;display:flex;flex-direction:column;gap:8px}',
      '.pscope-popover-group{display:flex;flex-direction:column;gap:2px}',
      '.pscope-group-title{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--dsw-alias-label-tertiary,#8a93a6);font-weight:600;padding:8px 4px 3px}',
      '.pscope-plugin-item{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:8px;border-radius:8px}',
      '.pscope-plugin-item:hover{background:var(--dsw-alias-interactive-bg-hover,#f3f5f8)}',
      '.pscope-plugin-main{min-width:0;flex:1}',
      '.pscope-plugin-line{display:flex;align-items:center;gap:6px;flex-wrap:wrap}',
      '.pscope-plugin-title{font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-plugin-version{font-size:10px;color:var(--dsw-alias-label-tertiary,#8a93a6)}',
      '.pscope-plugin-name{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;color:var(--dsw-alias-label-tertiary,#8a93a6);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.pscope-plugin-desc{font-size:11px;line-height:1.4;color:var(--dsw-alias-label-secondary,#5a6580);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.pscope-plugin-action{flex:none;display:flex;align-items:center;padding-top:2px}',
      '.pscope-workspace-list{display:flex;flex-direction:column;gap:8px;padding:12px}',
      '.pscope-workspace-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.12));border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff)}',
      '.pscope-workspace-path{flex:1;min-width:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-workspace-meta{font-size:10px;color:var(--dsw-alias-label-tertiary,#8a93a6);white-space:nowrap}',
      '.pscope-workspace-actions{display:flex;align-items:center;gap:6px;flex:none}',

      '.pscope-popover-foot{padding:9px 14px;border-top:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1));font-size:10px;line-height:1.4;color:var(--dsw-alias-label-tertiary,#8a93a6)}',

      '.pscope-btn{border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.18));border-radius:7px;background:var(--dsw-alias-bg-layer-1,#fff);color:var(--dsw-alias-label-primary,#2d3142);padding:4px 10px;font-size:11px;cursor:pointer;font-family:inherit}',
      '.pscope-btn:hover{background:var(--dsw-alias-interactive-bg-hover,#f3f5f8)}',
      '.pscope-btn:disabled{opacity:.5;cursor:not-allowed}',
      '.pscope-btn.primary{background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary,#2d3142));border-color:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary,#2d3142));color:var(--dsw-alias-label-primary-inverted,#fff)}',
      '.pscope-select{border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.18));border-radius:7px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;padding:4px 8px;font-size:12px;font-family:inherit;max-width:240px}',
      '.pscope-note{font-size:11px;color:var(--dsw-alias-label-secondary,#5a6580)}',
      '.pscope-error{border:1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary,#be3232) 35%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-error-primary,#be3232) 10%, transparent);color:var(--dsw-alias-state-error-primary,#9b2c2c);border-radius:8px;padding:8px 10px;font-size:12px}',
      '.pscope-ok{border:1px solid color-mix(in srgb, var(--dsw-alias-state-success-primary,#2e7a4a) 35%, transparent);background:color-mix(in srgb, var(--dsw-alias-state-success-primary,#2e7a4a) 10%, transparent);color:var(--dsw-alias-state-success-primary,#2e7a4a);border-radius:8px;padding:8px 10px;font-size:12px}',
      '.pscope-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
      '.pscope-chips{display:flex;gap:4px;flex-wrap:wrap;margin-top:4px}',
      '.pscope-chip{display:inline-flex;align-items:center;gap:4px;font-size:10px;color:var(--dsw-alias-label-secondary,#5a6580);border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.12));border-radius:999px;padding:1px 6px}',
      '.pscope-chip input{margin:0}',
      '.pscope-empty{padding:18px;text-align:center;color:var(--dsw-alias-label-secondary,#5a6580);font-size:12px}',
      '.pscope-modal{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;background:rgba(20,24,36,.38);padding:24px}',
      '.pscope-modal-card{width:min(640px,100%);max-height:82vh;overflow:auto;background:var(--dsw-alias-bg-layer-1,#fff);border-radius:12px;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.15));box-shadow:0 18px 50px rgba(20,24,36,.25)}',
      '.pscope-modal-head{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1))}',
      '.pscope-modal-body{padding:12px 14px;display:flex;flex-direction:column;gap:8px}',
      '.pscope-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:12px 14px;border-top:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1))}',
      '.pscope-tool{display:flex;align-items:flex-start;gap:8px;padding:5px 6px;border-radius:6px}',
      '.pscope-tool:hover{background:var(--dsw-alias-interactive-bg-hover,#f3f5f8)}',
      '.pscope-tool-name{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;font-weight:600}',
      '.pscope-tool-desc{font-size:11px;color:var(--dsw-alias-label-secondary,#5a6580);margin-top:1px}',
      '.pscope-map-heading{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--dsw-alias-label-tertiary,#8a93a6);font-weight:600;margin:10px 0 4px}',
      '.pscope-map-section{display:flex;flex-direction:column;gap:2px}',
      '.pscope-input{width:100%;box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.18));border-radius:7px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;padding:6px 8px;font-size:12px;font-family:inherit}',
      '.pscope-input::placeholder{color:var(--dsw-alias-label-tertiary,#8a93a6)}',
      '.pscope-chipbar{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.16));border-radius:999px;padding:3px 9px;background:var(--dsw-alias-bg-layer-1,#fff);font-size:11px;color:var(--dsw-alias-label-secondary,#5a6580)}',
      '.pscope-chipbar strong{color:var(--dsw-alias-label-primary,#2d3142);font-weight:600}',
      '.pscope-chipbar select{border:0;background:transparent;color:inherit;font:inherit;max-width:130px}',
      '.pscope-detail{border-top:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1));padding-top:12px;margin-top:12px;display:flex;flex-direction:column;gap:8px}',
      '.pscope-detail-title{font-size:12px;font-weight:600}',
      '.pscope-muted{color:var(--dsw-alias-label-secondary,#5a6580)}',
    ].join('\n')

    function Styles() {
      return h('style', { 'data-plugin-scope': 'styles' }, CSS)
    }

    function Badge(props) {
      const label = props.scope === 'on-demand' ? props.t('onDemand') : props.scope === 'off' ? props.t('off') : props.t('global')
      const cls = 'pscope-badge ' + (props.scope === 'on-demand' ? 'on-demand' : props.scope === 'off' ? 'off' : 'global')
      return h('span', { className: cls }, label)
    }

    function ScopeButtons(props) {
      const t = props.t
      const value = props.value
      const disabled = props.disabled === true
      function choose(scope) {
        if (disabled || props.busy === true || scope === value) return
        props.onChange(scope)
      }
      return h('div', { className: 'pscope-seg', role: 'group', 'aria-label': t('scope') },
        h('button', { type: 'button', 'data-active': value === 'global' ? 'true' : undefined, disabled: disabled || props.busy, onClick: function () { choose('global') } }, t('global')),
        h('button', { type: 'button', 'data-active': value === 'on-demand' ? 'true' : undefined, disabled: disabled || props.busy, onClick: function () { choose('on-demand') } }, t('onDemand')),
        h('button', { type: 'button', 'data-active': value === 'off' ? 'true' : undefined, disabled: disabled || props.busy, onClick: function () { choose('off') } }, t('off')),
      )
    }

    function ScopeChips(props) {
      const t = props.t
      const language = useLanguage()
      const profiles = props.profiles || []
      return h('div', { className: 'pscope-chips' },
        profiles.map(function (profile) {
          const checked = (props.selected || []).includes(profile.id)
          return h('label', { key: profile.id, className: 'pscope-chip' },
            h('input', {
              type: 'checkbox',
              checked: checked,
              disabled: props.disabled === true || props.busy === true,
              onChange: function () {
                const next = checked
                  ? (props.selected || []).filter(function (id) { return id !== profile.id })
                  : (props.selected || []).concat([profile.id])
                props.onChange(next)
              },
            }),
            profileName(profile, language),
          )
        }),
      )
    }

    function PluginRow(props) {
      const t = props.t
      const plugin = props.plugin
      const state = props.state
      const busy = props.busy
      const [mapping, setMapping] = React.useState(false)
      const assignmentProfiles = plugin.profiles || []
      const protectedPlugin = plugin.protected === true
      const toolCount = (plugin.contribution && plugin.contribution.tools ? plugin.contribution.tools.length : 0)
      const skillCount = (plugin.contribution && plugin.contribution.skills ? plugin.contribution.skills.length : 0)
      function choose(scope) {
        props.onScope(plugin.name, scope, assignmentProfiles)
      }
      function toggleProfile(next) {
        props.onScope(plugin.name, 'on-demand', next)
      }
      return h('tr', null,
        h('td', null,
          h('div', { className: 'pscope-plugin-name' }, plugin.title || plugin.name),
          h('div', { className: 'pscope-plugin-meta' }, plugin.name + (plugin.version ? ' · ' + plugin.version : '')),
          plugin.error ? h('div', { className: 'pscope-error', style: { marginTop: '4px' } }, plugin.error.code || plugin.error.message || String(plugin.error)) : null,
        ),
        h('td', null,
          h('div', { className: 'pscope-row' },
            h(ScopeButtons, {
              t: t,
              value: plugin.scope,
              disabled: protectedPlugin,
              busy: busy,
              onChange: choose,
            }),
            protectedPlugin ? h('span', { className: 'pscope-badge protected' }, t('protected')) : null,
          ),
          plugin.scope === 'on-demand' ? h(ScopeChips, {
            t: t,
            profiles: state.profiles,
            selected: assignmentProfiles,
            busy: busy,
            onChange: toggleProfile,
          }) : null,
          protectedPlugin ? h('div', { className: 'pscope-note' }, t('protectedNote')) : null,
        ),
        h('td', null,
          h('div', null, toolCount + ' ' + t('tools')),
          skillCount > 0 ? h('div', { className: 'pscope-plugin-meta' }, skillCount + ' skills') : null,
          h('div', { className: 'pscope-plugin-meta' },
            plugin.mappedBy === 'unknown' ? t('unmapped') : t('mapped') + ' · ' + plugin.mappedBy,
          ),
        ),
        h('td', null,
          h('div', { className: 'pscope-row' },
            h('span', { className: 'pscope-badge ' + (plugin.visible ? 'global' : 'off') }, plugin.visible ? t('on') : t('offLabel')),
            h('button', { type: 'button', className: 'pscope-btn', onClick: function () { setMapping(true) }, disabled: busy }, t('map')),
          ),
          mapping ? h(MappingModal, {
            ctx: props.ctx,
            t: t,
            plugin: plugin,
            sessionId: props.sessionId,
            onClose: function () { setMapping(false) },
            onSaved: function () { setMapping(false); props.refresh() },
          }) : null,
        ),
      )
    }

    function parseSectionNames(value) {
      return [...new Set(String(value || '').split(/[\n,]+/).map(item => item.trim()).filter(Boolean))]
    }

    function MappingModal(props) {
      const t = props.t
      const [tools, setTools] = React.useState(null)
      const [skills, setSkills] = React.useState(null)
      const [error, setError] = React.useState(null)
      const [selectedTools, setSelectedTools] = React.useState(new Set(props.plugin.contribution?.tools || []))
      const [selectedSkills, setSelectedSkills] = React.useState(new Set(props.plugin.contribution?.skills || []))
      const [sectionsText, setSectionsText] = React.useState((props.plugin.contribution?.sections || []).join(', '))
      const [busy, setBusy] = React.useState(false)
      React.useEffect(function () {
        let alive = true
        const suffix = props.sessionId ? '?session=' + encodeURIComponent(props.sessionId) : ''
        const toolsRequest = request('/tools' + suffix).then(function (result) { return result.tools || [] })
        const skillsRequest = request('/skills' + suffix).then(function (result) { return result.skills || [] }).catch(function () { return [] })
        Promise.all([toolsRequest, skillsRequest]).then(function (results) {
          if (!alive) return
          setTools(results[0])
          setSkills(results[1])
        }).catch(function (caught) {
          if (alive) setError(caught instanceof Error ? caught.message : String(caught))
        })
        return function () { alive = false }
      }, [props.sessionId])
      function toggle(setter, name) {
        setter(function (current) {
          const next = new Set(current)
          if (next.has(name)) next.delete(name)
          else next.add(name)
          return next
        })
      }
      async function save() {
        setBusy(true)
        setError(null)
        try {
          await post('/mapping', {
            name: props.plugin.name,
            contribution: {
              tools: [...selectedTools],
              skills: [...selectedSkills],
              sections: parseSectionNames(sectionsText),
            },
          })
          props.onSaved()
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : String(caught))
        } finally {
          setBusy(false)
        }
      }
      const loading = tools === null || skills === null
      return h('div', { className: 'pscope-modal', role: 'dialog', 'aria-modal': 'true', onClick: function (event) { if (event.target === event.currentTarget) props.onClose() } },
        h('div', { className: 'pscope-modal-card' },
          h('div', { className: 'pscope-modal-head' },
            h('div', { className: 'pscope-section-title' }, t('mappingTitle') + ' ' + (props.plugin.title || props.plugin.name)),
            h('button', { type: 'button', className: 'pscope-btn', onClick: props.onClose }, t('close')),
          ),
          h('div', { className: 'pscope-modal-body' },
            h('div', { className: 'pscope-note' }, t('mappingHelp')),
            error ? h('div', { className: 'pscope-error' }, error) : null,
            h('div', { className: 'pscope-map-section' },
              h('div', { className: 'pscope-map-heading' }, t('toolsHeading')),
              loading ? h('div', { className: 'pscope-empty' }, t('loading')) : tools.length === 0 ? h('div', { className: 'pscope-empty' }, t('empty')) : tools.map(function (tool) {
                return h('label', { key: tool.name, className: 'pscope-tool' },
                  h('input', { type: 'checkbox', checked: selectedTools.has(tool.name), onChange: function () { toggle(setSelectedTools, tool.name) } }),
                  h('span', null,
                    h('div', { className: 'pscope-tool-name' }, tool.name),
                    tool.description ? h('div', { className: 'pscope-tool-desc' }, tool.description) : null,
                  ),
                )
              }),
            ),
            h('div', { className: 'pscope-map-section' },
              h('div', { className: 'pscope-map-heading' }, t('skillsHeading')),
              loading ? null : skills.length === 0 ? h('div', { className: 'pscope-empty' }, t('noSkills')) : skills.map(function (skill) {
                return h('label', { key: skill.name, className: 'pscope-tool' },
                  h('input', { type: 'checkbox', checked: selectedSkills.has(skill.name), onChange: function () { toggle(setSelectedSkills, skill.name) } }),
                  h('span', null,
                    h('div', { className: 'pscope-tool-name' }, skill.name),
                    h('div', { className: 'pscope-tool-desc' }, [skill.description, skill.provider ? ' · ' + skill.provider : ''].filter(Boolean).join('')),
                  ),
                )
              }),
            ),
            h('div', { className: 'pscope-map-section' },
              h('div', { className: 'pscope-map-heading' }, t('sectionsHeading')),
              h('input', { className: 'pscope-input', value: sectionsText, placeholder: 'e.g. diagram-guidance, design-review', onChange: function (event) { setSectionsText(event.target.value) } }),
              h('div', { className: 'pscope-tool-desc' }, t('sectionsHelp')),
            ),
          ),
          h('div', { className: 'pscope-modal-foot' },
            h('button', { type: 'button', className: 'pscope-btn', onClick: props.onClose }, t('close')),
            h('button', { type: 'button', className: 'pscope-btn primary', disabled: busy || loading, onClick: save }, busy ? t('saving') : t('saveMapping')),
          ),
        ),
      )
    }

    function SessionsTable(props) {
      const t = props.t
      const language = props.language || currentLanguage
      const state = props.state
      const busy = props.busy
      if (state.sessions.length === 0) return h('div', { className: 'pscope-empty' }, t('noSessions'))
      return h('table', { className: 'pscope-table' },
        h('thead', null, h('tr', null,
          h('th', null, t('sessions')),
          h('th', null, t('scope')),
          h('th', null, t('tools')),
        )),
        h('tbody', null, state.sessions.map(function (session) {
          return h('tr', { key: session.id },
            h('td', null,
              h('div', { className: 'pscope-plugin-name' }, session.profileName || session.profileId),
              h('div', { className: 'pscope-plugin-meta' }, session.id.slice(0, 18) + (session.blank ? ' · blank' : '') + (session.cwd ? ' · ' + session.cwd : '')),
            ),
            h('td', null, h('select', {
              className: 'pscope-select',
              value: session.profileId,
              disabled: busy,
              onChange: function (event) { props.onSession(session.id, event.target.value) },
            }, state.profiles.map(function (profile) {
              return h('option', { key: profile.id, value: profile.id }, profileName(profile, language))
            }))),
            h('td', null, h('span', { className: 'pscope-muted' }, (function () {
              const gated = []
              if (session.gatedTools) gated.push(session.gatedTools + ' ' + t('tools'))
              if (session.gatedSkills) gated.push(session.gatedSkills + ' ' + t('skillsHeading'))
              return gated.length > 0 ? gated.join(' · ') : '—'
            })())),
          )
        })),
      )
    }

    function WorkspacesSection(props) {
      const t = props.t
      const language = useLanguage()
      const state = props.state
      const busy = props.busy
      const entries = new Map()
      for (const [cwd, config] of Object.entries(state.workspaces || {})) {
        entries.set(cwd, { cwd: cwd, config: config })
      }
      for (const session of state.sessions) {
        if (typeof session.cwd === 'string' && session.cwd !== '' && !entries.has(session.cwd)) {
          entries.set(session.cwd, { cwd: session.cwd, config: undefined })
        }
      }
      const rows = [...entries.values()].sort(function (left, right) {
        return left.cwd.localeCompare(right.cwd)
      })
      const activeCwds = new Set(state.sessions.map(function (session) { return session.cwd }).filter(Boolean))
      return h('div', { className: 'pscope-section' },
        h('div', { className: 'pscope-section-head' }, h('div', { className: 'pscope-section-title' }, t('workspaces'))),
        h('div', { className: 'pscope-note', style: { padding: '10px 14px 0' } }, t('workspaceNote')),
        rows.length === 0
          ? h('div', { className: 'pscope-empty' }, t('noWorkspaces'))
          : h('div', { className: 'pscope-workspace-list' }, rows.map(function (entry) {
              const config = entry.config
              const current = activeCwds.has(entry.cwd)
              return h('div', { key: entry.cwd, className: 'pscope-workspace-row' },
                h('div', { className: 'pscope-workspace-path', title: entry.cwd }, entry.cwd),
                current ? h('span', { className: 'pscope-workspace-meta' }, t('currentWorkspace')) : null,
                h('div', { className: 'pscope-workspace-actions' },
                  h('select', {
                    className: 'pscope-select',
                    value: config?.profileId || state.settings.defaultProfileId,
                    disabled: busy,
                    'aria-label': t('workspaces') + ' ' + entry.cwd,
                    onChange: function (event) { props.onWorkspace(entry.cwd, event.target.value) },
                  }, state.profiles.map(function (profile) {
                    return h('option', { key: profile.id, value: profile.id }, profileName(profile, language))
                  })),
                  config === undefined
                    ? h('span', { className: 'pscope-workspace-meta' }, t('workspaceDefault'))
                    : h('button', {
                        type: 'button',
                        className: 'pscope-btn',
                        disabled: busy,
                        onClick: function () { props.onDeleteWorkspace(entry.cwd) },
                      }, t('clearWorkspace')),
                ),
              )
            })),
      )
    }

    function ProfilesSection(props) {
      const t = props.t
      const language = props.language || currentLanguage
      const state = props.state
      const busy = props.busy
      const [creating, setCreating] = React.useState(false)
      const [name, setName] = React.useState('')
      async function create() {
        const text = name.trim()
        if (text === '') return
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'profile-' + Date.now().toString(36)
        await props.onCreate({ id: id, name: text, description: '', plugins: [] })
        setCreating(false)
        setName('')
      }
      return h('div', { className: 'pscope-section' },
        h('div', { className: 'pscope-section-head' },
          h('div', { className: 'pscope-section-title' }, t('profiles')),
          h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: function () { setCreating(true) } }, '+ ' + t('newProfile')),
        ),
        h('div', { className: 'pscope-grid', style: { padding: '12px' } },
          creating ? h('div', { className: 'pscope-card' },
            h('div', { className: 'pscope-card-label' }, t('newProfile')),
            h('input', {
              className: 'pscope-select',
              style: { width: '100%', marginTop: '6px' },
              value: name,
              autoFocus: true,
              placeholder: t('newProfile'),
              onChange: function (event) { setName(event.target.value) },
              onKeyDown: function (event) { if (event.key === 'Enter') create() },
            }),
            h('div', { className: 'pscope-row', style: { marginTop: '8px' } },
              h('button', { type: 'button', className: 'pscope-btn primary', disabled: busy || name.trim() === '', onClick: create }, t('save')),
              h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: function () { setCreating(false); setName('') } }, t('close')),
            ),
          ) : null,
          state.profiles.map(function (profile) {
            const name = profileName(profile, language)
            return h('div', { key: profile.id, className: 'pscope-card' },
              h('div', { className: 'pscope-card-label' }, profile.id),
              h('div', { className: 'pscope-card-value' }, name),
              h('div', { className: 'pscope-card-note' }, profileDescription(profile, language)),
              h('div', { className: 'pscope-card-note' }, profilePluginCount(profile, language)),
              h('div', { className: 'pscope-row', style: { marginTop: '8px' } },
                h('button', { type: 'button', className: 'pscope-btn', disabled: busy || profile.id === state.settings.defaultProfileId, onClick: function () { props.onDefault(profile.id) } }, profile.id === state.settings.defaultProfileId ? t('defaultProfile') : t('makeDefault')),
                profile.builtin ? null : h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: function () { if (window.confirm(t('deleteProfile') + ' ' + name + '?')) props.onDelete(profile.id) } }, t('deleteProfile')),
              ),
            )
          }),
        ),
      )
    }

    function ConversationPlugins(props) {
      const t = props.t
      const sessionId = props.sessionId ?? props.session?.id ?? props.session?.sessionId
      const language = useLanguage()
      const [open, setOpen] = React.useState(false)
      const [query, setQuery] = React.useState('')
      const { state, error, loading, refresh } = useScopeState(props.ctx, sessionId)
      const { busy, failure, run } = useBusy()
      React.useEffect(function () {
        if (!open) return undefined
        const onKey = function (event) { if (event.key === 'Escape') setOpen(false) }
        window.addEventListener('keydown', onKey)
        return function () { window.removeEventListener('keydown', onKey) }
      }, [open])
      if (sessionId === undefined) return null
      function openPanel() {
        setOpen(true)
        refresh(true)
      }
      function toggle(plugin) {
        const enabled = !plugin.visible
        return run(function () {
          return post('/session/plugin', { sessionId: sessionId, name: plugin.name, enabled: enabled })
        }, null).then(function (result) {
          if (result !== undefined) return refresh(true)
        })
      }
      function resetSession() {
        return run(function () {
          return post('/session/reset', { sessionId: sessionId })
        }, t('sessionReset')).then(function (result) {
          if (result !== undefined) return refresh(true)
        })
      }
      const plugins = state?.plugins || []
      const visibleCount = plugins.filter(function (plugin) { return plugin.visible }).length
      const queryText = query.trim()
      const matches = plugins.map(function (plugin) {
        return { plugin: plugin, score: pluginSearchScore(plugin, queryText) }
      }).filter(function (entry) {
        return entry.score > 0
      }).sort(function (left, right) {
        if (right.score !== left.score) return right.score - left.score
        return String(left.plugin.title || left.plugin.name).localeCompare(String(right.plugin.title || right.plugin.name))
      })
      const items = function (predicate) {
        return matches.filter(function (entry) { return predicate(entry.plugin) }).map(function (entry) { return entry.plugin })
      }
      const groups = [
        { key: 'global', title: t('globalPlugins'), items: items(function (plugin) { return plugin.scope === 'global' }) },
        { key: 'enabled', title: t('enabledInConversation'), items: items(function (plugin) { return plugin.scope === 'on-demand' && plugin.visible }) },
        { key: 'available', title: t('availableOnDemand'), items: items(function (plugin) { return plugin.scope === 'on-demand' && !plugin.visible }) },
        { key: 'off', title: t('offPlugins'), items: items(function (plugin) { return plugin.scope === 'off' }) },
      ]
      function row(plugin) {
        const global = plugin.scope === 'global'
        const off = plugin.scope === 'off'
        return h('div', { key: plugin.name, className: 'pscope-plugin-item' },
          h('div', { className: 'pscope-plugin-main' },
            h('div', { className: 'pscope-plugin-line' },
              h('span', { className: 'pscope-plugin-title' }, plugin.title || plugin.name),
              plugin.version ? h('span', { className: 'pscope-plugin-version' }, plugin.version) : null,
              plugin.protected ? h('span', { className: 'pscope-badge protected' }, t('protected')) : null,
            ),
            h('div', { className: 'pscope-plugin-name' }, plugin.name),
            h('div', { className: 'pscope-plugin-desc' }, plugin.description || ''),
          ),
          h('div', { className: 'pscope-plugin-action' },
            global
              ? h('span', { className: 'pscope-badge global' }, t('alwaysOn'))
              : off
                ? h('span', { className: 'pscope-badge off', title: t('offHint') }, t('off'))
                : h('button', {
                    type: 'button',
                    className: 'pscope-btn' + (plugin.visible ? '' : ' primary'),
                    disabled: busy,
                    title: plugin.visible ? t('disable') : t('enable'),
                    onClick: function () { toggle(plugin) },
                  }, plugin.visible ? t('disable') : t('enable')),
          ),
        )
      }
      const profile = state?.session?.profile
      const profileLabel = profile !== undefined
        ? profileName(profile, language)
        : (state?.session?.profileId || '')
      const source = state?.session?.source
      const sourceLabel = source === 'session'
        ? t('sourceSession')
        : source === 'workspace' ? t('sourceWorkspace') : t('sourceDefault')
      return h(React.Fragment, null,
        h(Styles),
        h('button', {
          type: 'button',
          className: 'pscope-header-btn',
          'aria-expanded': open,
          'aria-label': t('conversationPlugins') + ' · ' + visibleCount,
          title: t('conversationPlugins') + ' · ' + visibleCount,
          onClick: function () { if (open) setOpen(false); else openPanel() },
        },
          h('span', { className: 'pscope-header-icon', 'aria-hidden': 'true' }, '◈'),
          h('span', { className: 'pscope-header-label' }, t('pluginsShort')),
          h('span', { className: 'pscope-header-count' }, String(visibleCount)),
        ),
        open ? h(React.Fragment, null,
          h('div', { className: 'pscope-popover-backdrop', onClick: function () { setOpen(false) } }),
          h('div', { className: 'pscope-popover', role: 'dialog', 'aria-modal': 'false', 'aria-label': t('conversationPlugins') },
            h('div', { className: 'pscope-popover-head' },
              h('div', null,
                h('div', { className: 'pscope-popover-title' }, t('conversationPlugins')),
                h('div', { className: 'pscope-popover-sub' }, (profileLabel || t('currentProfile')) + ' · ' + t('enabledCount', { count: visibleCount }) + ' · ' + sourceLabel),
              ),
              h('div', { className: 'pscope-row' },
                source === 'session'
                  ? h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: resetSession }, t('resetSession'))
                  : null,
                h('button', { type: 'button', className: 'pscope-btn', onClick: function () { setOpen(false) } }, t('close')),
              ),
            ),
            h('div', { className: 'pscope-popover-search' },
              h('input', {
                className: 'pscope-input pscope-search',
                autoFocus: true,
                value: query,
                placeholder: t('searchPlugins'),
                'aria-label': t('searchPlugins'),
                onChange: function (event) { setQuery(event.target.value) },
              }),
            ),
            h('div', { className: 'pscope-popover-body' },
              failure ? h('div', { className: 'pscope-error' }, failure) : null,
              error ? h('div', { className: 'pscope-error' }, error) : null,
              state === null
                ? h('div', { className: 'pscope-empty' }, loading ? t('loading') : t('error'))
                : groups.map(function (group) {
                    if (group.items.length === 0) return null
                    return h('div', { key: group.key, className: 'pscope-popover-group' },
                      h('div', { className: 'pscope-group-title' }, group.title),
                      group.items.map(row),
                    )
                  }),
              state !== null && matches.length === 0 ? h('div', { className: 'pscope-empty' }, t('noSearchResults')) : null,
            ),
            h('div', { className: 'pscope-popover-foot' }, t('globalNote')),
          ),
        ) : null,
      )
    }

    function LanguageSwitch(props) {
      const t = props.t
      const language = props.language || 'zh'
      return h('div', { className: 'pscope-lang', role: 'group', 'aria-label': t('language') },
        h('button', { type: 'button', 'data-active': language === 'zh', disabled: props.disabled, onClick: function () { props.onChange('zh') } }, '中文'),
        h('button', { type: 'button', 'data-active': language === 'en', disabled: props.disabled, onClick: function () { props.onChange('en') } }, 'EN'),
      )
    }

    function ScopePage(props) {
      const t = props.t
      const ctx = props.ctx
      const language = useLanguage()
      const sessionId = props.sessionId
      const { state, error, loading, refresh } = useScopeState(ctx, sessionId)
      const { busy, message, failure, run } = useBusy()
      const [defaultId, setDefaultId] = React.useState('')
      React.useEffect(function () {
        if (state !== null) setDefaultId(state.settings.defaultProfileId)
      }, [state])
      if (loading && state === null) return h('div', { className: 'pscope-root' }, h(Styles), h('div', { className: 'pscope-empty' }, t('loading')))
      if (error && state === null) return h('div', { className: 'pscope-root' }, h(Styles), h('div', { className: 'pscope-error' }, t('error') + ': ' + error), h('button', { type: 'button', className: 'pscope-btn', onClick: function () { refresh(true) } }, t('retry')))
      if (state === null) return null
      const visible = state.estimate || { tools: 0, tokens: 0, hiddenTools: 0, hiddenSkills: 0 }
      function onScope(name, scope, profiles) {
        return run(function () { return post('/plugin', { name: name, scope: scope, profiles: profiles }) }, t('scopeSaved'))
          .then(function () { return refresh(true) })
      }
      function onSession(id, profileId) {
        return run(function () { return post('/session', { sessionId: id, profileId: profileId }) }, t('scopeSaved'))
          .then(function () { return refresh(true) })
      }
      function onDefault(profileId) {
        setDefaultId(profileId)
        return run(function () { return post('/default', { profileId: profileId }) }, t('defaultSaved'))
          .then(function () { return refresh(true) })
      }
      function onCreate(profile) {
        return run(function () { return post('/profile', { action: 'create', profile: profile }) }, t('scopeSaved'))
          .then(function () { return refresh(true) })
      }
      function onDelete(id) {
        return run(function () { return post('/profile', { action: 'delete', id: id }) }, t('scopeSaved'))
          .then(function () { return refresh(true) })
      }
      function onLanguage(next) {
        return run(function () { return post('/settings', { language: next }) }, null)
          .then(function (result) {
            if (result === undefined) return
            setLanguage(next)
            return refresh(true)
          })
      }
      function onWorkspace(cwd, profileId) {
        return run(function () { return post('/workspace', { cwd: cwd, profileId: profileId }) }, t('workspaceSaved'))
          .then(function () { return refresh(true) })
      }
      function onDeleteWorkspace(cwd) {
        return run(function () { return post('/workspace/delete', { cwd: cwd }) }, t('workspaceCleared'))
          .then(function () { return refresh(true) })
      }
      return h('div', { className: 'pscope-root', 'data-plugin-scope': 'page' },
        h(Styles),
        h('div', { className: 'pscope-head' },
          h('div', null,
            h('h2', { className: 'pscope-title' }, t('title')),
            h('p', { className: 'pscope-sub' }, t('subtitle')),
          ),
          h('div', { className: 'pscope-row' },
            h(LanguageSwitch, { t: t, language: language, disabled: busy, onChange: onLanguage }),
            h('span', { className: 'pscope-note' }, t('defaultProfile')),
            h('select', { className: 'pscope-select', value: defaultId, onChange: function (event) { onDefault(event.target.value) } },
              state.profiles.map(function (profile) { return h('option', { key: profile.id, value: profile.id }, profileName(profile, language)) }),
            ),
          ),
        ),
        failure ? h('div', { className: 'pscope-error' }, failure) : null,
        message ? h('div', { className: 'pscope-ok' }, message) : null,
        h('div', { className: 'pscope-grid' },
          h('div', { className: 'pscope-card' },
            h('div', { className: 'pscope-card-label' }, t('compactTools')),
            h('div', { className: 'pscope-card-value' }, String(visible.tools)),
            h('div', { className: 'pscope-card-note' }, '~' + String(visible.tokens) + ' ' + t('tokens')),
          ),
          h('div', { className: 'pscope-card' },
            h('div', { className: 'pscope-card-label' }, t('hiddenTools')),
            h('div', { className: 'pscope-card-value' }, String(visible.hiddenTools || 0)),
            h('div', { className: 'pscope-card-note' }, String(visible.hiddenSkills || 0) + ' ' + t('hiddenSkills')),
          ),
          h('div', { className: 'pscope-card' },
            h('div', { className: 'pscope-card-label' }, t('sessions')),
            h('div', { className: 'pscope-card-value' }, String(state.sessions.length)),
            h('div', { className: 'pscope-card-note' }, state.settings.defaultProfileId),
          ),
        ),
        h('div', { className: 'pscope-note' }, t('note')),
        h('div', { className: 'pscope-section' },
          h('div', { className: 'pscope-section-head' },
            h('div', { className: 'pscope-section-title' }, t('plugins')),
            h('button', { type: 'button', className: 'pscope-btn', onClick: function () { refresh(true) }, disabled: busy }, t('retry')),
          ),
          state.plugins.length === 0 ? h('div', { className: 'pscope-empty' }, t('empty')) : h('table', { className: 'pscope-table' },
            h('thead', null, h('tr', null,
              h('th', null, t('plugin')),
              h('th', null, t('scope')),
              h('th', null, t('mapped')),
              h('th', null, t('map')),
            )),
            h('tbody', null, state.plugins.map(function (plugin) {
              return h(PluginRow, {
                key: plugin.name,
                ctx: ctx,
                t: t,
                plugin: plugin,
                state: state,
                busy: busy,
                sessionId: sessionId,
                refresh: function () { refresh(true) },
                onScope: onScope,
              })
            })),
          ),
        ),
        h(ProfilesSection, { t: t, language: language, state: state, busy: busy, onCreate: onCreate, onDelete: onDelete, onDefault: onDefault }),
        h(WorkspacesSection, { t: t, state: state, busy: busy, onWorkspace: onWorkspace, onDeleteWorkspace: onDeleteWorkspace }),
        h('div', { className: 'pscope-section' },
          h('div', { className: 'pscope-section-head' }, h('div', { className: 'pscope-section-title' }, t('sessions'))),
          h(SessionsTable, { t: t, language: language, state: state, busy: busy, onSession: onSession }),
        ),
        h(ConfigurationSection, { t: t, state: state, busy: busy, onSettings: function (patch) { return run(function () { return post('/settings', patch) }, t('scopeSaved')).then(function () { return refresh(true) }) } }),
      )
    }

    function ConfigurationSection(props) {
      const t = props.t
      const state = props.state
      const busy = props.busy
      function toggle(key) {
        props.onSettings({ [key]: !state.settings[key] })
      }
      return h('div', { className: 'pscope-section' },
        h('div', { className: 'pscope-section-head' }, h('div', { className: 'pscope-section-title' }, t('config'))),
        h('div', { style: { padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' } },
          h('label', { className: 'pscope-row' },
            h('input', { type: 'checkbox', checked: state.settings.showChip !== false, disabled: busy, onChange: function () { toggle('showChip') } }),
            t('showChip'),
          ),
          h('label', { className: 'pscope-row' },
            h('input', { type: 'checkbox', checked: state.settings.autoApplyOnCreate !== false, disabled: busy, onChange: function () { toggle('autoApplyOnCreate') } }),
            t('autoApply'),
          ),
          h('label', { className: 'pscope-row' },
            h('input', { type: 'checkbox', checked: state.settings.subagentInherits !== false, disabled: busy, onChange: function () { toggle('subagentInherits') } }),
            t('subagents'),
          ),
        ),
      )
    }

    function findPlugin(state, name) {
      if (state === null || name === undefined) return undefined
      return state.plugins.find(function (plugin) { return plugin.name === name })
    }

    function PluginBadge(props) {
      useLanguage()
      const name = props.subject?.pkg?.name
      const { state } = useScopeState(props.ctx, undefined)
      if (name === undefined || state === null) return null
      const plugin = findPlugin(state, name)
      if (plugin === undefined) return null
      return h(React.Fragment, null, h(Styles), h('span', { className: 'pscope-badge ' + (plugin.scope === 'on-demand' ? 'on-demand' : plugin.scope === 'off' ? 'off' : 'global') }, props.t(plugin.scope === 'on-demand' ? 'onDemand' : plugin.scope === 'off' ? 'off' : 'global')))
    }

    function PluginSection(props) {
      const t = props.t
      useLanguage()
      const name = props.subject?.pkg?.name
      const { state, refresh } = useScopeState(props.ctx, undefined)
      const { busy, failure, run } = useBusy()
      const [saved, setSaved] = React.useState(null)
      if (name === undefined || state === null) return null
      const plugin = findPlugin(state, name)
      if (plugin === undefined) return h('div', { className: 'pscope-detail' }, h(Styles), h('div', { className: 'pscope-note' }, t('noPlugin')))
      const protectedPlugin = plugin.protected === true
      function choose(scope) {
        run(function () { return post('/plugin', { name: name, scope: scope, profiles: plugin.profiles || [] }) }, t('scopeSaved'))
          .then(function (result) { if (result !== undefined) setSaved(result.application || 'applied'); refresh(true) })
      }
      return h('div', { className: 'pscope-detail' },
        h(Styles),
        h('div', { className: 'pscope-detail-title' }, t('scope')),
        h('div', { className: 'pscope-row' },
          h(ScopeButtons, { t: t, value: plugin.scope, disabled: protectedPlugin, busy: busy, onChange: choose }),
          plugin.scope === 'on-demand' ? h(ScopeChips, {
            t: t,
            profiles: state.profiles,
            selected: plugin.profiles || [],
            busy: busy,
            onChange: function (next) { run(function () { return post('/plugin', { name: name, scope: 'on-demand', profiles: next }) }, t('scopeSaved')).then(function () { refresh(true) }) },
          }) : null,
        ),
        protectedPlugin ? h('div', { className: 'pscope-note' }, t('protectedNote')) : null,
        saved ? h('div', { className: 'pscope-note' }, t('applied') + ': ' + saved) : null,
        failure ? h('div', { className: 'pscope-error' }, failure) : null,
      )
    }

    function SessionChip(props) {
      const t = props.t
      const language = useLanguage()
      const session = props.session
      const sessionId = session?.id
      const { state, refresh } = useScopeState(props.ctx, sessionId)
      const { busy, run } = useBusy()
      if (sessionId === undefined || state === null) return null
      if (state.settings.showChip === false) return null
      const currentId = state.session?.profileId || state.settings.defaultProfileId
      const current = state.profiles.find(function (profile) { return profile.id === currentId })
      const estimate = state.estimate || { tools: 0, tokens: 0 }
      function change(profileId) {
        run(function () { return post('/session', { sessionId: sessionId, profileId: profileId }) }, null)
          .then(function () { refresh(true) })
      }
      return h(React.Fragment, null,
        h(Styles),
        h('span', { className: 'pscope-chipbar', title: t('sessionScope') },
        h('span', null, t('sessionScope')),
        h('strong', null, current !== undefined ? profileName(current, language) : currentId),
        h('select', { value: currentId, disabled: busy, onChange: function (event) { change(event.target.value) }, 'aria-label': t('sessionScope') },
          state.profiles.map(function (profile) { return h('option', { key: profile.id, value: profile.id }, profileName(profile, language)) }),
        ),
        h('span', null, String(estimate.tools) + ' ' + t('tools') + ' · ~' + String(estimate.tokens)),
        ),
      )
    }

    function apply(ctx) {
      const t = makeT(ctx)
      const register = function (slot, options, component) {
        try {
          ctx.slots.inject(slot, function () {
            return ctx.slots.register(Object.assign({ name: slot }, options), component)
          })
        } catch (error) {
          console.warn('[plugin-scope] could not register slot ' + slot + ':', error)
        }
      }

      register('settings.section', { id: 'plugin-scope', order: 80, label: function () { return t('nav') } }, function () {
        return h(ScopePage, { ctx: ctx, t: t })
      })
      register('plugins.tab', { id: 'plugin-scope', order: 50, label: function () { return t('scopesTab') || t('nav') } }, function () {
        return h(ScopePage, { ctx: ctx, t: t, compact: true })
      })
      register('settings.plugins.tab', { id: 'plugin-scope', order: 70, label: function () { return t('scopesTab') || t('nav') } }, function () {
        return h(ScopePage, { ctx: ctx, t: t, compact: true })
      })
      register('plugins.detail.badge', { id: 'plugin-scope-badge', order: 90 }, function (props) {
        return h(PluginBadge, { ctx: ctx, t: t, subject: props?.subject })
      })
      register('plugins.detail.section', { id: 'plugin-scope-section', order: 90 }, function (props) {
        return h(PluginSection, { ctx: ctx, t: t, subject: props?.subject })
      })
      register('conversation.input.dock', { id: 'plugin-scope-chip', order: 10 }, function (props) {
        return h(SessionChip, { ctx: ctx, t: t, session: props?.session })
      })
      register('conversation.session.header.utilities', { id: 'plugin-scope-conversation', order: 20 }, function (props) {
        return h(ConversationPlugins, { ctx: ctx, t: t, sessionId: props?.sessionId })
      })
    }

    return { inject: ['slots', 'locale'], apply: apply }
  },
})
