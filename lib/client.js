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
        historyNote: 'One row per completed turn with mapped plugin calls. Open a turn to see plugin and tool details.',
        managePluginsTab: 'Manage',
        callHistoryTab: 'Call history',
        turnUsageTitle: 'Plugin calls this turn',
        turnHistoryTitle: 'Plugin call history',
        noTurnHistory: 'No completed turns with plugin calls yet.',
        noTurnPrompt: '(no text)',
        backToHistory: 'Back',
        turnLabel: 'Turn {turn}',
        toolBreakdown: 'Tools',
        unattributed: 'Unmapped tools',
        turnTotal: 'This turn',
        modelUsage: 'Model',
        turnCalls: '{count} calls',
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
        workspacePlugins: 'Workspace plugins',
        pluginSettings: 'Plugins',
        workspacePluginHelp: 'These toggles are the workspace default; on-demand plugins stay off until enabled here or by tag auto-match. Conversations without their own override use them.',
        calls: 'Calls',
        callsShort: 'calls',
        modelTokens: 'Model tokens',
        usage: 'Usage',
        sessionUsage: 'Conversation usage',
        workspaceUsage: 'Workspace usage',
        totalUsage: 'Total usage',
        sessionsCounted: '{count} sessions',
        tags: 'Tags',
        editTags: 'Edit tags',
        tagsHelp: 'Pick tags from the managed list. Renaming or deleting a tag updates every tagged plugin.',
        tagGroups: 'Tags',
        tagKeywords: 'Keywords (comma separated)',
        tagAuto: 'Auto-match',
        newTag: 'New tag',
        tagName: 'Tag name',
        rename: 'Rename',
        delete: 'Delete',
        deleteTag: 'Delete tag',
        moveUp: 'Move up',
        moveDown: 'Move down',
        noTags: 'No tags yet. Create one above, then tag plugins.',
        autoMatchTags: 'Auto-enable tagged plugins from conversation keywords',
        pricePerMillion: 'Token price (¥ / 1M)',
        pricingHelp: 'Used for tool-token and model-usage cost estimates.',
        mappingWarning: 'Mapping needs attention',
        staleToolsWarning: '{count} mapped tools no longer exist: {names}',
        staleSkillsWarning: '{count} mapped skills no longer exist: {names}',
        duplicateToolsWarning: 'Tools also mapped by another plugin: {names}',
        duplicateSkillsWarning: 'Skills also mapped by another plugin: {names}',
        protectedSectionsWarning: 'Protected prompt sections: {names}',
        filterSkills: 'Filter skills by provider/source',
        allProviders: 'All providers/sources',
        tagSaved: 'Tags saved.',
        tagRuleSaved: 'Tag rule saved.',
        noTagGroups: 'No tags yet. Add tags to plugins to create groups.',
        tagMatchNote: 'Auto-match enables tagged on-demand plugins when a message contains a keyword. Tags follow this list order; renaming or deleting updates tagged plugins. It uses the conversation scope and can be turned off above.',
        title: 'Plugin Scope',
        subtitle: 'Choose which plugins are global, on demand or off for each conversation.',
        global: 'Global',
        onDemand: 'On demand',
        onDemandHint: 'Hidden by default; enable it in a conversation, or let tag auto-match turn it on.',
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
        historyNote: '每个有已映射插件调用的完成对话一行；点开可看插件与工具明细。',
        managePluginsTab: '管理',
        callHistoryTab: '调用历史',
        turnUsageTitle: '本轮插件调用',
        turnHistoryTitle: '插件调用历史',
        noTurnHistory: '还没有产生插件调用的已完成对话。',
        noTurnPrompt: '（无文本）',
        backToHistory: '返回',
        turnLabel: '第 {turn} 轮',
        toolBreakdown: '工具明细',
        unattributed: '未映射工具',
        turnTotal: '本轮',
        modelUsage: '模型',
        turnCalls: '{count} 次调用',
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
        workspacePlugins: '工作区插件',
        pluginSettings: '插件列表',
        workspacePluginHelp: '这些开关作为工作区默认；按需插件默认关闭，在此启用或由标签自动匹配触发。没有单独设置的对话会使用它们。',
        calls: '调用次数',
        callsShort: '调用',
        modelTokens: '模型 tokens',
        usage: '用量',
        sessionUsage: '对话用量',
        workspaceUsage: '工作区用量',
        totalUsage: '累计用量',
        sessionsCounted: '{count} 个会话',
        tags: '标签',
        editTags: '编辑标签',
        tagsHelp: '从管理列表中选择标签；标签重命名或删除会同步到所有已打标插件。',
        tagGroups: '标签列表',
        tagKeywords: '关键词（逗号分隔）',
        tagAuto: '自动匹配',
        newTag: '新建标签',
        tagName: '标签名称',
        rename: '重命名',
        delete: '删除',
        deleteTag: '删除标签',
        moveUp: '上移',
        moveDown: '下移',
        noTags: '还没有标签；先在上方新建，再给插件打标。',
        autoMatchTags: '根据对话关键词自动启用标签组插件',
        pricePerMillion: 'Token 单价（¥/1M）',
        pricingHelp: '用于工具 token 和模型 usage 的费用估算。',
        mappingWarning: '映射需要检查',
        staleToolsWarning: '{count} 个已映射工具已不存在：{names}',
        staleSkillsWarning: '{count} 个已映射技能已不存在：{names}',
        duplicateToolsWarning: '工具同时被其他插件映射：{names}',
        duplicateSkillsWarning: '技能同时被其他插件映射：{names}',
        protectedSectionsWarning: '受保护的 Prompt section：{names}',
        filterSkills: '按 provider/source 过滤技能',
        allProviders: '全部 provider/source',
        tagSaved: '标签已保存。',
        tagRuleSaved: '标签规则已保存。',
        noTagGroups: '还没有标签；给插件添加标签后会形成标签组。',
        tagMatchNote: '自动匹配在用户消息命中标签关键词时启用对应按需插件；标签按此列表顺序展示，重命名/删除会同步到已打标插件。使用当前对话作用域，可在上方关闭。',
        title: '插件作用域',
        subtitle: '为每个对话选择哪些插件常驻、按需或关闭。',
        global: '全局',
        onDemand: '按需',
        onDemandHint: '默认隐藏；在对话中手动启用，或由标签自动匹配触发。',
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

    const PLUGIN_COPY = {
      'dsh-plugin-scope': {
        zh: '为每个对话选择插件的全局、按需或关闭状态；移除未使用工具声明，估算 token 和费用，并与 Plugins 页和 dsh-market 集成。',
        en: 'Choose which plugins are global, on demand or off for each conversation. Removes unused tool declarations from the model, estimates token cost, and integrates with the Plugins page and dsh-market.',
      },
      dshmarket: {
        zh: '浏览、搜索并安装 DeepSeek Harness 社区插件。',
        en: 'Browse, search, and install community plugins for DeepSeek Harness.',
      },
      '@furongjun1999/dsh-memory': {
        zh: '灵枢（Lingshu·líng shū）DeepSeek Harness 插件：完整大脑——长期记忆/知识飞轮/自我认知/递归反思接入 DSH，对话自动沉淀进 md_cg 认知图。',
        en: 'Lingshu DeepSeek Harness plugin: a complete brain — long-term memory, knowledge flywheel, self-model and recursive reflection, with conversations distilled into the md_cg graph.',
      },
      '@michengai/dsh-skills-manager': {
        zh: '加载并安全管理本地 Agent Skills。',
        en: 'Load and safely manage local Agent Skills in DeepSeek Harness.',
      },
      '@vectorize-io/hindsight-coding-agents': {
        zh: '为编码代理提供只读式 Hindsight 长期记忆（可接入 opencode 等），并自动在后台摄取。',
        en: 'Reflect-only Hindsight long-term memory for coding agents (harness-pluggable: opencode, …), with automatic background ingestion.',
      },
      '@wxg-prc-cpg/browser-skill-dsh-plugin': {
        zh: '向模型暴露 BrowserSkill 浏览器自动化能力（bsk_* 工具）。',
        en: 'DeepSeek Harness tool plugin that exposes BrowserSkill browser automation (bsk_* tools) to the model.',
      },
      '@xmanrui/dsh-im': {
        zh: '把 Telegram、WhatsApp、Slack、Discord、Matrix、微信、飞书、企业微信、钉钉和 QQ 连接到 DSH。',
        en: 'Connect Telegram, WhatsApp, Slack, Discord, Matrix, WeChat, Feishu, WeCom, DingTalk, and QQ to DSH.',
      },
      'dsh-ai-diagrams': {
        zh: '在对话中生成自包含 HTML 和 inline SVG 的编辑级图表：50 种图表类型、侧边栏画廊，可重绘 draw.io / Mermaid / Excalidraw / PlantUML，支持品牌配置和 SVG/PNG 导出。',
        en: 'Editorial diagrams in chat: one self-contained HTML file with inline SVG renders right in the transcript; 50 diagram types with a sidebar gallery, redraws draw.io / Mermaid / Excalidraw / PlantUML, reusable brand profiles, SVG/PNG export.',
      },
      'dsh-whale-widget': {
        zh: 'DSH Web 界面右下角的 DeepSeek 余额小鲸鱼挂件：余额/今日已用/峰谷定价、自定义泡泡点击序列、逐行样式与字体、悬浮快捷编辑、音效与每轮消耗、自定义角色/动图/音效、吸附与翻转。',
        en: 'A DeepSeek balance whale widget in the bottom-right of the DSH Web UI: balance, today usage, peak/off-peak pricing, custom bubble sequences, per-line styles and fonts, floating quick edit, sounds, per-turn usage, custom characters and motion.',
      },
    }

    function pluginDescription(plugin, language) {
      const copy = PLUGIN_COPY[plugin?.name]
      if (copy !== undefined && typeof copy[language] === 'string') return copy[language]
      return plugin?.description || ''
    }

    let currentLanguage = 'zh'
    try {
      const saved = localStorage.getItem('dsh-plugin-scope.language')
      if (saved === 'zh' || saved === 'en') currentLanguage = saved
    } catch { /* localStorage may be unavailable */ }

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

    function parseTags(value) {
      return [...new Set(String(value || '').split(/[\n,]+/).map(item => item.trim()).filter(Boolean))]
    }

    function formatNumber(value) {
      const number = Number(value)
      if (!Number.isFinite(number) || number <= 0) return '0'
      if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M'
      if (number >= 1000) return (number / 1000).toFixed(1) + 'k'
      return String(Math.round(number))
    }

    function costOf(tokens, price) {
      const amount = (Number(tokens) || 0) / 1000000 * (Number(price) || 0)
      if (!Number.isFinite(amount) || amount <= 0) return '¥0.00'
      if (amount < 0.01) return '¥' + amount.toFixed(4)
      if (amount < 1) return '¥' + amount.toFixed(3)
      return '¥' + amount.toFixed(2)
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
      '.pscope-main-panel{height:100%;overflow:auto;box-sizing:border-box;padding:24px 28px 48px}',
      '.pscope-main-panel .pscope-root{max-width:1280px;margin:0 auto}',
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
      '.pscope-header-icon{display:inline-flex;color:var(--dsw-alias-brand-primary,#2e5aa8)}',
      '.pscope-header-icon svg{display:block;width:14px;height:14px}',

      '.pscope-header-count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:var(--dsw-alias-button-ghost-active-fill,#eef1f6);color:var(--dsw-alias-label-primary,#2d3142);font-size:10px;font-weight:600}',
      '.pscope-popover-backdrop{position:fixed;inset:0;z-index:900;background:transparent}',
      '.pscope-popover{position:fixed;top:64px;right:24px;z-index:901;display:flex;flex-direction:column;width:min(460px,calc(100vw - 32px));max-height:calc(100vh - 92px);background:var(--dsw-alias-bg-layer-1,#fff);border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.15));border-radius:12px;box-shadow:0 18px 50px rgba(20,24,36,.25);overflow:hidden}',
      '.pscope-popover-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:12px 14px 10px;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1))}',
      '.pscope-popover-title{font-size:14px;font-weight:650;color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-popover-sub{font-size:11px;color:var(--dsw-alias-label-secondary,#5a6580);margin-top:2px}',
      '.pscope-tabs{display:flex;gap:2px;padding:8px 14px 0;border-bottom:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1))}',
      '.pscope-tabs button{appearance:none;border:0;border-bottom:2px solid transparent;background:transparent;color:var(--dsw-alias-label-tertiary,#8a93a6);padding:6px 10px 8px;font:inherit;font-size:12px;cursor:pointer}',
      '.pscope-tabs button[data-active="true"]{color:var(--dsw-alias-label-primary,#2d3142);border-bottom-color:var(--dsw-alias-brand-primary,#2e5aa8);font-weight:600}',
      '.pscope-history-body{padding-top:8px}',
      '.pscope-turn-card{margin:6px 0 2px;padding:9px 11px;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.12));border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff)}',
      '.pscope-turn-card-head{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:600;color:var(--dsw-alias-label-secondary,#5a6580)}',
      '.pscope-turn-card-icon{display:inline-flex;color:var(--dsw-alias-brand-primary,#2e5aa8)}',
      '.pscope-turn-card-icon svg{width:13px;height:13px}',
      '.pscope-turn-card-time{margin-left:auto;font-weight:400;color:var(--dsw-alias-label-tertiary,#8a93a6);font-variant-numeric:tabular-nums}',
      '.pscope-turn-card-plugins{display:flex;flex-direction:column;gap:3px;margin-top:6px}',
      '.pscope-turn-card-plugin{display:flex;justify-content:space-between;gap:10px;font-size:11px;line-height:1.5}',
      '.pscope-turn-card-name{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-turn-card-metric{flex:none;color:var(--dsw-alias-label-tertiary,#8a93a6);font-variant-numeric:tabular-nums}',
      '.pscope-turn-card-foot{display:flex;gap:4px 12px;flex-wrap:wrap;margin-top:7px;padding-top:6px;border-top:1px dashed var(--dsw-alias-border-l2,rgba(45,49,66,.1));font-size:10px;color:var(--dsw-alias-label-tertiary,#8a93a6)}',
      '.pscope-turn-history{display:flex;flex-direction:column;gap:6px}',
      '.pscope-turn-history-row{display:flex;flex-direction:column;gap:3px;width:100%;padding:8px 9px;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.12));border-radius:7px;background:var(--dsw-alias-bg-layer-1,#fff);color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.pscope-turn-history-row:hover{border-color:var(--dsw-alias-brand-primary,#2e5aa8)}',
      '.pscope-turn-history-top{display:flex;align-items:center;gap:8px;font-size:11px}',
      '.pscope-turn-history-time{color:var(--dsw-alias-label-tertiary,#8a93a6);font-size:10px}',
      '.pscope-turn-history-metric{margin-left:auto;color:var(--dsw-alias-label-secondary,#5a6580);font-size:10px;font-variant-numeric:tabular-nums}',
      '.pscope-turn-history-prompt{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary,#5a6580);font-size:11px}',
      '.pscope-turn-history-plugins{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary,#8a93a6);font-size:10px}',
      '.pscope-turn-detail{display:flex;flex-direction:column;gap:8px;padding-bottom:8px}',
      '.pscope-turn-detail-head{display:flex;align-items:center;gap:8px;font-size:12px}',
      '.pscope-turn-detail-time{margin-left:auto;color:var(--dsw-alias-label-tertiary,#8a93a6);font-size:10px}',
      '.pscope-turn-detail-prompt{padding:7px 9px;border-radius:6px;background:var(--dsw-alias-bg-layer-2,#f4f5f8);color:var(--dsw-alias-label-secondary,#5a6580);font-size:11px;line-height:1.5;max-height:80px;overflow:auto;white-space:pre-wrap;word-break:break-word}',
      '.pscope-turn-detail-summary{display:flex;flex-direction:column;gap:2px;font-size:11px;color:var(--dsw-alias-label-secondary,#5a6580)}',
      '.pscope-turn-detail-plugins{display:flex;flex-direction:column;gap:7px}',
      '.pscope-turn-detail-plugin{padding:7px 9px;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.1));border-radius:7px}',
      '.pscope-turn-detail-plugin-head{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:11px}',
      '.pscope-turn-tools{margin-top:5px;padding-top:5px;border-top:1px dashed var(--dsw-alias-border-l2,rgba(45,49,66,.1));display:flex;flex-direction:column;gap:2px}',
      '.pscope-turn-tools-title{font-size:9px;text-transform:uppercase;letter-spacing:.05em;color:var(--dsw-alias-label-tertiary,#8a93a6);margin-bottom:2px}',
      '.pscope-turn-tool{display:flex;justify-content:space-between;gap:10px;font-size:10px;color:var(--dsw-alias-label-secondary,#5a6580)}',
      '.pscope-turn-tool-name{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.pscope-popover-search{padding:10px 14px 4px}',
      '.pscope-search{padding:7px 9px;font-size:12px}',
      '.pscope-popover-body{overflow:auto;padding:2px 10px 10px;display:flex;flex-direction:column;gap:8px}',
      '.pscope-popover-group{display:flex;flex-direction:column;gap:2px}',
      '.pscope-group-title{font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:var(--dsw-alias-label-tertiary,#8a93a6);font-weight:600;padding:8px 4px 3px}',
      '.pscope-group-head{display:flex;align-items:center;gap:6px;width:100%;padding:8px 4px 3px;border:0;background:transparent;cursor:pointer;font-family:inherit;text-align:left}',
      '.pscope-group-head:hover .pscope-group-title{color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-group-head .pscope-group-title{padding:0}',
      '.pscope-group-caret{display:inline-flex;align-items:center;justify-content:center;color:var(--dsw-alias-label-tertiary,#8a93a6);width:12px;height:12px;flex:none}',
      '.pscope-group-count{font-size:11px;color:var(--dsw-alias-label-tertiary,#8a93a6);margin-left:auto;font-variant-numeric:tabular-nums}',
      '.pscope-tooltip{position:fixed;z-index:1002;max-width:340px;padding:8px 10px;border-radius:8px;background:var(--dsw-alias-bg-layer-2,#232733);border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.18));color:var(--dsw-alias-label-primary,#2d3142);font-size:11px;line-height:1.5;box-shadow:0 10px 30px rgba(20,24,36,.28);pointer-events:none;white-space:normal}',

      '.pscope-plugin-item{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;padding:8px;border-radius:8px}',
      '.pscope-plugin-item:hover{background:var(--dsw-alias-interactive-bg-hover,#f3f5f8)}',
      '.pscope-plugin-main{min-width:0;flex:1}',
      '.pscope-plugin-line{display:flex;align-items:center;gap:6px;flex-wrap:wrap}',
      '.pscope-plugin-title{font-size:12px;font-weight:600;color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-plugin-version{font-size:10px;color:var(--dsw-alias-label-tertiary,#8a93a6)}',
      '.pscope-plugin-name{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;color:var(--dsw-alias-label-tertiary,#8a93a6);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.pscope-plugin-desc{font-size:11px;line-height:1.4;color:var(--dsw-alias-label-secondary,#5a6580);margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.pscope-plugin-usage{font-size:10px;line-height:1.4;color:var(--dsw-alias-label-tertiary,#8a93a6);margin-top:3px}',
      '.pscope-popover-usage{font-size:10px;line-height:1.5;color:var(--dsw-alias-label-secondary,#5a6580);margin-top:3px;display:flex;flex-wrap:wrap;gap:4px 10px}',
      '.pscope-plugin-action{flex:none;display:flex;align-items:center;padding-top:2px}',
      '.pscope-workspace-list{display:flex;flex-direction:column;gap:8px;padding:12px}',
      '.pscope-workspace-row{display:flex;align-items:center;gap:10px;padding:8px 10px;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.12));border-radius:8px;background:var(--dsw-alias-bg-layer-1,#fff)}',
      '.pscope-workspace-path{flex:1;min-width:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-workspace-meta{font-size:10px;color:var(--dsw-alias-label-tertiary,#8a93a6);white-space:nowrap}',
      '.pscope-workspace-actions{display:flex;align-items:center;gap:6px;flex:none}',
      '.pscope-tag-row{display:flex;align-items:center;gap:8px;padding:8px 12px;border-top:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.08));flex-wrap:wrap}',
      '.pscope-tag-main{display:flex;align-items:center;gap:8px;flex:1;min-width:260px;flex-wrap:wrap}',
      '.pscope-tag-title{display:flex;align-items:center;gap:8px;min-width:150px}',
      '.pscope-tag-name{font-size:12px;font-weight:600;min-width:90px;color:var(--dsw-alias-label-primary,#2d3142)}',
      '.pscope-tag-name-input{width:170px;max-width:none}',
      '.pscope-tag-count{font-size:10px;color:var(--dsw-alias-label-tertiary,#8a93a6);white-space:nowrap}',
      '.pscope-tag-input{flex:1;min-width:160px;max-width:none}',
      '.pscope-tag-actions{display:flex;align-items:center;gap:6px;flex:none;flex-wrap:wrap}',
      '.pscope-tag-create{display:flex;align-items:center;gap:8px;padding:10px 14px;flex-wrap:wrap}',
      '.pscope-tag-create .pscope-input{flex:1;min-width:180px}',
      '.pscope-tag-picker{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}',
      '.pscope-tag-option{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border:1px solid var(--dsw-alias-border-l2,rgba(45,49,66,.12));border-radius:6px;font-size:12px;cursor:pointer}',
      '.pscope-warning{margin-top:5px;padding:5px 7px;border:1px solid var(--dsw-alias-state-warn-primary,rgba(180,120,30,.4));border-radius:6px;background:var(--dsw-alias-state-warn-tertiary,rgba(180,120,30,.08));color:var(--dsw-alias-state-warn-primary,#8a5a00);font-size:10px;line-height:1.45;overflow-wrap:anywhere}',
      '.pscope-warning>div{margin-top:2px}',
      '.pscope-map-section .pscope-select{margin-bottom:6px}',
      '.pscope-scope-select{min-width:96px}',


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

    function ScopeSelect(props) {
      const t = props.t
      return h('select', {
        className: 'pscope-select pscope-scope-select',
        value: props.value,
        disabled: props.disabled === true || props.busy === true,
        'aria-label': t('scope'),
        onChange: function (event) { props.onChange(event.target.value) },
      },
        h('option', { value: 'global' }, t('global')),
        h('option', { value: 'on-demand' }, t('onDemand')),
        h('option', { value: 'off' }, t('off')),
      )
    }

    function tagsInOrder(tags, order) {
      const rank = new Map((order || []).map(function (tag, index) { return [tag, index] }))
      return [...new Set(tags || [])].sort(function (left, right) {
        const leftRank = rank.has(left) ? rank.get(left) : Number.MAX_SAFE_INTEGER
        const rightRank = rank.has(right) ? rank.get(right) : Number.MAX_SAFE_INTEGER
        return leftRank - rightRank || String(left).localeCompare(String(right))
      })
    }

    function TagModal(props) {
      const t = props.t
      const order = props.state?.tagOrder || []
      const [selected, setSelected] = React.useState(new Set(props.tags || []))
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState(null)
      function toggle(tag) {
        setSelected(function (current) {
          const next = new Set(current)
          if (next.has(tag)) next.delete(tag)
          else next.add(tag)
          return next
        })
      }
      async function save() {
        setBusy(true)
        setError(null)
        try {
          const tags = order.filter(function (tag) { return selected.has(tag) })
          await post('/tags', { name: props.plugin.name, tags: tags })
          props.onSaved()
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : String(caught))
        } finally {
          setBusy(false)
        }
      }
      return h('div', { className: 'pscope-modal', role: 'dialog', 'aria-modal': 'true', onClick: function (event) { if (event.target === event.currentTarget) props.onClose() } },
        h('div', { className: 'pscope-modal-card' },
          h('div', { className: 'pscope-modal-head' },
            h('div', { className: 'pscope-section-title' }, t('editTags') + ' · ' + (props.plugin.title || props.plugin.name)),
            h('button', { type: 'button', className: 'pscope-btn', onClick: props.onClose }, t('close')),
          ),
          h('div', { className: 'pscope-modal-body' },
            h('div', { className: 'pscope-note' }, t('tagsHelp')),
            error ? h('div', { className: 'pscope-error' }, error) : null,
            order.length === 0
              ? h('div', { className: 'pscope-empty' }, t('noTags'))
              : h('div', { className: 'pscope-tag-picker' }, order.map(function (tag) {
                  return h('label', { key: tag, className: 'pscope-tag-option' },
                    h('input', {
                      type: 'checkbox',
                      checked: selected.has(tag),
                      disabled: busy,
                      onChange: function () { toggle(tag) },
                    }),
                    h('span', null, tag),
                  )
                })),
          ),
          h('div', { className: 'pscope-modal-foot' },
            h('button', { type: 'button', className: 'pscope-btn', onClick: props.onClose }, t('close')),
            h('button', { type: 'button', className: 'pscope-btn primary', disabled: busy, onClick: save }, busy ? t('saving') : t('save')),
          ),
        ),
      )
    }

    function TagRow(props) {
      const t = props.t
      const rule = props.rule || { keywords: [], enabled: true }
      const [keywords, setKeywords] = React.useState((rule.keywords || []).join(', '))
      const [renaming, setRenaming] = React.useState(false)
      const [name, setName] = React.useState(props.tag)
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState(null)
      React.useEffect(function () {
        setKeywords((props.rule?.keywords || []).join(', '))
        if (!renaming) setName(props.tag)
      }, [props.tag, props.rule])
      async function call(path, body) {
        setBusy(true)
        setError(null)
        try {
          await post(path, body)
          props.onSaved()
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : String(caught))
        } finally {
          setBusy(false)
        }
      }
      async function save(enabled) {
        await call('/tag-rule', { tag: props.tag, keywords: parseTags(keywords), enabled: enabled })
      }
      async function rename() {
        const nextName = name.trim()
        if (nextName === '' || nextName === props.tag) {
          setRenaming(false)
          setName(props.tag)
          return
        }
        await call('/tag', { action: 'rename', tag: props.tag, name: nextName })
        setRenaming(false)
      }
      function remove() {
        if (!window.confirm(t('deleteTag') + ' ' + props.tag + '?')) return
        call('/tag', { action: 'delete', tag: props.tag })
      }
      return h('div', { className: 'pscope-tag-row' },
        h('div', { className: 'pscope-tag-main' },
          renaming
            ? h('div', { className: 'pscope-row' },
                h('input', {
                  className: 'pscope-input pscope-tag-name-input',
                  value: name,
                  autoFocus: true,
                  disabled: busy,
                  onChange: function (event) { setName(event.target.value) },
                  onKeyDown: function (event) { if (event.key === 'Enter') rename() },
                }),
                h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: rename }, t('save')),
                h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: function () { setRenaming(false); setName(props.tag) } }, t('close')),
              )
            : h('div', { className: 'pscope-tag-title' },
                h('span', { className: 'pscope-tag-name' }, props.tag),
                h('span', { className: 'pscope-tag-count' }, String(props.count) + ' ' + t('plugins')),
              ),
          h('input', {
            className: 'pscope-input pscope-tag-input',
            value: keywords,
            placeholder: t('tagKeywords'),
            disabled: busy,
            onChange: function (event) { setKeywords(event.target.value) },
            onKeyDown: function (event) { if (event.key === 'Enter') save(rule.enabled !== false) },
          }),
        ),
        h('div', { className: 'pscope-tag-actions' },
          h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: function () { save(rule.enabled !== false) } }, t('save')),
          h('label', { className: 'pscope-row' },
            h('input', { type: 'checkbox', checked: rule.enabled !== false, disabled: busy, onChange: function (event) { save(event.target.checked) } }),
            t('tagAuto'),
          ),
          h('button', { type: 'button', className: 'pscope-btn', disabled: busy || props.index === 0, title: t('moveUp'), onClick: function () { call('/tag', { action: 'move', tag: props.tag, direction: 'up' }) } }, '↑'),
          h('button', { type: 'button', className: 'pscope-btn', disabled: busy || props.index === props.total - 1, title: t('moveDown'), onClick: function () { call('/tag', { action: 'move', tag: props.tag, direction: 'down' }) } }, '↓'),
          h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: function () { setRenaming(true) } }, t('rename')),
          h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: remove }, t('delete')),
        ),
        error ? h('div', { className: 'pscope-error' }, error) : null,
      )
    }

    function TagsSection(props) {
      const t = props.t
      const state = props.state
      const order = state.tagOrder || []
      const counts = new Map()
      for (const [name, tags] of Object.entries(state.pluginTags || {})) {
        for (const tag of tags) {
          if (!counts.has(tag)) counts.set(tag, 0)
          counts.set(tag, counts.get(tag) + 1)
        }
      }
      const [creating, setCreating] = React.useState(false)
      const [name, setName] = React.useState('')
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState(null)
      async function create() {
        const nextName = name.trim()
        if (nextName === '') return
        setBusy(true)
        setError(null)
        try {
          await post('/tag', { action: 'create', name: nextName })
          setCreating(false)
          setName('')
          props.onSaved()
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : String(caught))
        } finally {
          setBusy(false)
        }
      }
      return h('div', { className: 'pscope-section' },
        h('div', { className: 'pscope-section-head' },
          h('div', { className: 'pscope-section-title' }, t('tagGroups')),
          h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: function () { setCreating(true) } }, '+ ' + t('newTag')),
        ),
        h('div', { className: 'pscope-note', style: { padding: '10px 14px 0' } }, t('tagMatchNote')),
        creating ? h('div', { className: 'pscope-tag-create' },
          h('input', {
            className: 'pscope-input', value: name, autoFocus: true, placeholder: t('tagName'),
            disabled: busy,
            onChange: function (event) { setName(event.target.value) },
            onKeyDown: function (event) { if (event.key === 'Enter') create() },
          }),
          h('button', { type: 'button', className: 'pscope-btn primary', disabled: busy || name.trim() === '', onClick: create }, t('save')),
          h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: function () { setCreating(false); setName('') } }, t('close')),
        ) : null,
        error ? h('div', { className: 'pscope-error', style: { padding: '0 14px' } }, error) : null,
        order.length === 0
          ? h('div', { className: 'pscope-empty' }, t('noTags'))
          : h('div', null, order.map(function (tag, index) {
              return h(TagRow, {
                key: tag,
                t: t,
                tag: tag,
                index: index,
                total: order.length,
                count: counts.get(tag) || 0,
                rule: state.tagRules?.[tag],
                onSaved: props.onSaved,
              })
            })),
      )
    }

    function PluginRow(props) {
      const t = props.t
      const plugin = props.plugin
      const state = props.state
      const busy = props.busy
      const [mapping, setMapping] = React.useState(false)
      const [tagging, setTagging] = React.useState(false)
      const tags = tagsInOrder(state.pluginTags?.[plugin.name] || [], state.tagOrder)
      const protectedPlugin = plugin.protected === true
      const toolCount = (plugin.contribution && plugin.contribution.tools ? plugin.contribution.tools.length : 0)
      const skillCount = (plugin.contribution && plugin.contribution.skills ? plugin.contribution.skills.length : 0)
      const usage = props.usage
      const price = state.settings.pricePerMillion ?? 2
      const warnings = mappingMessages(plugin.mappingDiagnostics, t)
      function choose(scope) {
        props.onScope(plugin.name, scope, [])
      }
      return h('tr', null,
        h('td', null,
          h('div', { className: 'pscope-plugin-name' }, plugin.title || plugin.name),
          h('div', { className: 'pscope-plugin-meta' }, plugin.name + (plugin.version ? ' · ' + plugin.version : '')),
          h('div', { className: 'pscope-chips' },
            tags.map(function (tag) { return h('span', { key: tag, className: 'pscope-chip' }, tag) }),
            h('button', { type: 'button', className: 'pscope-chip', style: { cursor: 'pointer' }, onClick: function () { setTagging(true) } }, t('editTags')),
          ),
          warnings.length > 0
            ? h('div', { className: 'pscope-warning', title: warnings.join('\n') },
                warnings[0] + (warnings.length > 1 ? ' +' + String(warnings.length - 1) : ''),
              )
            : null,
          plugin.error ? h('div', { className: 'pscope-error', style: { marginTop: '4px' } }, plugin.error.code || plugin.error.message || String(plugin.error)) : null,
          tagging ? h(TagModal, {
            t: t,
            state: state,
            plugin: plugin,
            tags: tags,
            onClose: function () { setTagging(false) },
            onSaved: function () { setTagging(false); props.refresh() },
          }) : null,
        ),
        h('td', null,
          h('div', { className: 'pscope-row' },
            h(ScopeSelect, {
              t: t,
              value: plugin.scope,
              disabled: protectedPlugin,
              busy: busy,
              onChange: choose,
            }),
            protectedPlugin ? h('span', { className: 'pscope-badge protected' }, t('protected')) : null,
          ),
          plugin.scope === 'on-demand'
            ? h('div', { className: 'pscope-note' }, t('onDemandHint'))
            : null,
          protectedPlugin ? h('div', { className: 'pscope-note' }, t('protectedNote')) : null,
        ),
        h('td', null,
          h('div', null, toolCount + ' ' + t('tools')),
          skillCount > 0 ? h('div', { className: 'pscope-plugin-meta' }, skillCount + ' skills') : null,
          h('div', { className: 'pscope-plugin-meta' },
            plugin.mappedBy === 'unknown' ? t('unmapped') : t('mapped') + ' · ' + plugin.mappedBy,
          ),
        ),
        h('td', null, h('span', { className: 'pscope-muted' }, usage ? String(usage.calls) : '—')),
        h('td', null, h('span', { className: 'pscope-muted' }, usage ? '~' + formatNumber(usage.tokens) + ' · ' + costOf(usage.tokens, price) : '—')),
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
      const [skillFilter, setSkillFilter] = React.useState('all')
      const [busy, setBusy] = React.useState(false)
      const warnings = mappingMessages(props.plugin.mappingDiagnostics, t)
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
      const skillOptions = []
      for (const skill of skills || []) {
        const provider = skill.provider || ''
        const source = skill.source || ''
        const value = provider + '::' + source
        if (!skillOptions.some(option => option.value === value)) {
          skillOptions.push({ value, label: [provider || 'unknown', source].filter(Boolean).join(' · ') })
        }
      }
      const visibleSkills = (skills || []).filter(function (skill) {
        if (skillFilter === 'all') return true
        return (skill.provider || '') + '::' + (skill.source || '') === skillFilter
      })
      return h('div', { className: 'pscope-modal', role: 'dialog', 'aria-modal': 'true', onClick: function (event) { if (event.target === event.currentTarget) props.onClose() } },
        h('div', { className: 'pscope-modal-card' },
          h('div', { className: 'pscope-modal-head' },
            h('div', { className: 'pscope-section-title' }, t('mappingTitle') + ' ' + (props.plugin.title || props.plugin.name)),
            h('button', { type: 'button', className: 'pscope-btn', onClick: props.onClose }, t('close')),
          ),
          h('div', { className: 'pscope-modal-body' },
            h('div', { className: 'pscope-note' }, t('mappingHelp')),
            warnings.length > 0
              ? h('div', { className: 'pscope-warning' },
                  h('strong', null, t('mappingWarning')),
                  warnings.map(function (message) { return h('div', { key: message }, message) }),
                )
              : null,
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
              loading ? null : skills.length === 0 ? h('div', { className: 'pscope-empty' }, t('noSkills')) : h(React.Fragment, null,
                h('select', {
                  className: 'pscope-select',
                  value: skillFilter,
                  disabled: busy,
                  'aria-label': t('filterSkills'),
                  onChange: function (event) { setSkillFilter(event.target.value) },
                },
                  h('option', { value: 'all' }, t('allProviders')),
                  skillOptions.map(function (option) { return h('option', { key: option.value, value: option.value }, option.label) }),
                ),
                visibleSkills.map(function (skill) {
                return h('label', { key: skill.name, className: 'pscope-tool' },
                  h('input', { type: 'checkbox', checked: selectedSkills.has(skill.name), onChange: function () { toggle(setSelectedSkills, skill.name) } }),
                  h('span', null,
                    h('div', { className: 'pscope-tool-name' }, skill.name),
                    h('div', { className: 'pscope-tool-desc' }, [skill.description, skill.provider ? ' · ' + skill.provider : ''].filter(Boolean).join('')),
                  ),
                )
              }),
              ),
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
              h('div', { className: 'pscope-plugin-name' }, session.id.slice(0, 18)),
              h('div', { className: 'pscope-plugin-meta' }, (session.blank ? 'blank' : '') + (session.cwd ? (session.blank ? ' · ' : '') + session.cwd : '')),
            ),
            h('td', null, h('select', {
              className: 'pscope-select',
              value: session.mode || 'on-demand',
              disabled: busy,
              onChange: function (event) { props.onSessionMode(session.id, event.target.value) },
            },
              h('option', { value: 'global' }, t('global')),
              h('option', { value: 'on-demand' }, t('onDemand')),
              h('option', { value: 'off' }, t('off')),
            )),
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

    function WorkspacePluginModal(props) {
      const t = props.t
      const language = useLanguage()
      const state = props.state
      const cwd = props.cwd
      const config = state.workspaces?.[cwd]
      const mode = config?.mode || 'on-demand'
      const [query, setQuery] = React.useState('')
      const [add, setAdd] = React.useState(config?.overrides?.add || [])
      const [remove, setRemove] = React.useState(config?.overrides?.remove || [])
      const [busy, setBusy] = React.useState(false)
      const [error, setError] = React.useState(null)
      function enabled(plugin) {
        if (plugin.scope === 'global') return true
        if (plugin.scope === 'off') return false
        if (remove.includes(plugin.name)) return false
        if (add.includes(plugin.name)) return true
        return mode === 'global'
      }
      function toggle(plugin) {
        const next = !enabled(plugin)
        if (next) {
          setRemove(remove.filter(function (item) { return item !== plugin.name }))
          setAdd([...new Set(add.concat([plugin.name]))])
        } else {
          setAdd(add.filter(function (item) { return item !== plugin.name }))
          setRemove([...new Set(remove.concat([plugin.name]))])
        }
      }
      async function save() {
        setBusy(true)
        setError(null)
        try {
          await props.onSave(cwd, {
            add: add,
            remove: remove,
            includeTools: config?.overrides?.includeTools || [],
            excludeTools: config?.overrides?.excludeTools || [],
          })
          props.onClose()
        } catch (caught) {
          setError(caught instanceof Error ? caught.message : String(caught))
        } finally {
          setBusy(false)
        }
      }
      const matches = state.plugins.map(function (plugin) {
        return { plugin: plugin, score: pluginSearchScore(plugin, query) }
      }).filter(function (entry) { return entry.score > 0 }).sort(function (left, right) {
        if (right.score !== left.score) return right.score - left.score
        return String(left.plugin.title || left.plugin.name).localeCompare(String(right.plugin.title || right.plugin.name))
      })
      return h('div', { className: 'pscope-modal', role: 'dialog', 'aria-modal': 'true', onClick: function (event) { if (event.target === event.currentTarget) props.onClose() } },
        h('div', { className: 'pscope-modal-card' },
          h('div', { className: 'pscope-modal-head' },
            h('div', null,
              h('div', { className: 'pscope-section-title' }, t('workspacePlugins')),
              h('div', { className: 'pscope-popover-sub' }, cwd),
            ),
            h('button', { type: 'button', className: 'pscope-btn', onClick: props.onClose }, t('close')),
          ),
          h('div', { className: 'pscope-modal-body' },
            h('div', { className: 'pscope-note' }, t('workspacePluginHelp')),
            error ? h('div', { className: 'pscope-error' }, error) : null,
            h('input', {
              className: 'pscope-input pscope-search',
              value: query,
              placeholder: t('searchPlugins'),
              autoFocus: true,
              onChange: function (event) { setQuery(event.target.value) },
            }),
            matches.length === 0
              ? h('div', { className: 'pscope-empty' }, t('noSearchResults'))
              : matches.map(function (entry) {
                  const plugin = entry.plugin
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
                      h('div', { className: 'pscope-plugin-desc' }, pluginDescription(plugin, language)),
                    ),
                    h('div', { className: 'pscope-plugin-action' },
                      global
                        ? h('span', { className: 'pscope-badge global' }, t('alwaysOn'))
                        : off
                          ? h('span', { className: 'pscope-badge off' }, t('off'))
                          : h('button', {
                              type: 'button',
                              className: 'pscope-btn' + (enabled(plugin) ? '' : ' primary'),
                              disabled: busy,
                              onClick: function () { toggle(plugin) },
                            }, enabled(plugin) ? t('disable') : t('enable')),
                    ),
                  )
                }),
          ),
          h('div', { className: 'pscope-modal-foot' },
            h('button', { type: 'button', className: 'pscope-btn', onClick: props.onClose }, t('close')),
            h('button', { type: 'button', className: 'pscope-btn primary', disabled: busy, onClick: save }, busy ? t('saving') : t('save')),
          ),
        ),
      )
    }

    function WorkspacesSection(props) {
      const t = props.t
      const language = useLanguage()
      const state = props.state
      const usage = props.usage
      const price = state.settings.pricePerMillion ?? 2
      const busy = props.busy
      const [editing, setEditing] = React.useState(null)
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
              const workspaceUsage = usage?.workspaces?.[entry.cwd]
              return h('div', { key: entry.cwd, className: 'pscope-workspace-row' },
                h('div', { className: 'pscope-workspace-path', title: entry.cwd }, entry.cwd),
                workspaceUsage ? h('span', { className: 'pscope-workspace-meta' }, String(workspaceUsage.calls) + ' ' + t('callsShort') + ' · ~' + formatNumber(workspaceUsage.tokens) + ' ' + t('tokens') + ' · ' + costOf(workspaceUsage.tokens, price)) : null,
                current ? h('span', { className: 'pscope-workspace-meta' }, t('currentWorkspace')) : null,
                h('div', { className: 'pscope-workspace-actions' },
                  h('select', {
                    className: 'pscope-select',
                    value: config?.mode || 'on-demand',
                    disabled: busy,
                    'aria-label': t('scope') + ' ' + entry.cwd,
                    onChange: function (event) { props.onWorkspaceMode(entry.cwd, event.target.value) },
                  },
                    h('option', { value: 'global' }, t('global')),
                    h('option', { value: 'on-demand' }, t('onDemand')),
                    h('option', { value: 'off' }, t('off')),
                  ),
                  h('button', {
                    type: 'button',
                    className: 'pscope-btn',
                    disabled: busy,
                    onClick: function () { setEditing(entry.cwd) },
                  }, t('pluginSettings')),
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
        editing !== null
          ? h(WorkspacePluginModal, {
              t: t,
              state: state,
              cwd: editing,
              onSave: props.onWorkspacePlugins,
              onClose: function () { setEditing(null) },
            })
          : null,
      )
    }

    function ScopeSidebarIcon(props) {
      const size = props && props.size ? props.size : 18
      return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 36 36',
        fill: 'none',
        'aria-hidden': 'true',
        style: { opacity: props && props.active ? 1 : 0.82 },
      },
        h('rect', { x: 2, y: 2, width: 32, height: 32, rx: 9, fill: 'currentColor', fillOpacity: 0.16 }),
        h('rect', { x: 8.5, y: 8.5, width: 19, height: 5.6, rx: 2.8, fill: 'currentColor', fillOpacity: 0.36 }),
        h('rect', { x: 8.5, y: 15.2, width: 19, height: 5.6, rx: 2.8, fill: 'currentColor', fillOpacity: 0.62 }),
        h('rect', { x: 8.5, y: 21.9, width: 13.2, height: 5.6, rx: 2.8, fill: 'currentColor' }),
        h('circle', { cx: 26.1, cy: 26.2, r: 3.1, stroke: 'currentColor', strokeWidth: 1.4, strokeOpacity: 0.9 }),
        h('circle', { cx: 26.1, cy: 26.2, r: 1.15, fill: 'currentColor' }),
      )
    }

    function ScopeGlyph() {
      return h('svg', { width: 14, height: 14, viewBox: '0 0 36 36', fill: 'none', 'aria-hidden': 'true' },
        h('rect', { x: 2, y: 2, width: 32, height: 32, rx: 9, fill: 'currentColor', fillOpacity: 0.18 }),
        h('rect', { x: 8.5, y: 8.5, width: 19, height: 5.6, rx: 2.8, fill: 'currentColor', fillOpacity: 0.42 }),
        h('rect', { x: 8.5, y: 15.2, width: 19, height: 5.6, rx: 2.8, fill: 'currentColor', fillOpacity: 0.7 }),
        h('rect', { x: 8.5, y: 21.9, width: 13.2, height: 5.6, rx: 2.8, fill: 'currentColor' }),
        h('circle', { cx: 26.1, cy: 26.2, r: 3.1, stroke: 'currentColor', strokeWidth: 1.4, strokeOpacity: 0.9 }),
        h('circle', { cx: 26.1, cy: 26.2, r: 1.15, fill: 'currentColor' }),
      )
    }

    function mappingMessages(diagnostics, t) {
      if (diagnostics === undefined || diagnostics === null) return []
      const messages = []
      function add(key, names) {
        if (Array.isArray(names) && names.length > 0) {
          messages.push(t(key, { count: names.length, names: names.join(', ') }))
        }
      }
      add('staleToolsWarning', diagnostics.staleTools)
      add('staleSkillsWarning', diagnostics.staleSkills)
      add('duplicateToolsWarning', diagnostics.duplicateTools)
      add('duplicateSkillsWarning', diagnostics.duplicateSkills)
      add('protectedSectionsWarning', diagnostics.protectedSections)
      return messages
    }

    function formatTurnTime(ms, language) {
      if (!Number.isFinite(Number(ms))) return ''
      try {
        return new Date(Number(ms)).toLocaleTimeString(language === 'en' ? 'en-US' : 'zh-CN', { hour: '2-digit', minute: '2-digit' })
      } catch {
        return ''
      }
    }

    function turnPluginEntries(turn) {
      return Object.entries(turn?.plugins || {}).sort(function (left, right) {
        return (right[1].calls || 0) - (left[1].calls || 0) || String(left[1].title || left[0]).localeCompare(String(right[1].title || right[0]))
      })
    }

    const turnUsageCache = new Map()

    function loadTurnUsage(sessionId, turnNumber) {
      const key = sessionId + ':' + turnNumber
      const cached = turnUsageCache.get(key)
      if (cached !== undefined && Date.now() - cached.at < 3000) return cached.promise
      const promise = request('/stats?session=' + encodeURIComponent(sessionId) + '&refresh=1')
        .catch(function (error) {
          turnUsageCache.delete(key)
          throw error
        })
      turnUsageCache.set(key, { at: Date.now(), promise: promise })
      return promise
    }

    function TurnUsageCard(props) {
      const t = props.t
      const language = useLanguage()
      const sessionId = props.sessionId
      const turnNumber = props.turn?.turn
      const [details, setDetails] = React.useState(null)
      React.useEffect(function () {
        if (sessionId === undefined || !Number.isFinite(Number(turnNumber))) return undefined
        let alive = true
        loadTurnUsage(sessionId, turnNumber)
          .then(function (result) { if (alive) setDetails(result) })
          .catch(function () { /* usage is optional */ })
        return function () { alive = false }
      }, [sessionId, turnNumber])
      if (details === null) return null
      const detail = (details.session?.turnDetails || []).find(function (entry) { return entry.turn === Number(turnNumber) })
      if (detail === undefined) return null
      const plugins = turnPluginEntries(detail)
      if (plugins.length === 0) return null
      const price = details.pricePerMillion ?? 2
      const pluginCalls = plugins.reduce(function (sum, entry) { return sum + (entry[1].calls || 0) }, 0)
      const pluginTokens = plugins.reduce(function (sum, entry) { return sum + (entry[1].tokens || 0) }, 0)
      return h('div', { className: 'pscope-turn-card' },
        h('div', { className: 'pscope-turn-card-head' },
          h('span', { className: 'pscope-turn-card-icon', 'aria-hidden': 'true' }, h(ScopeGlyph)),
          h('span', null, t('turnUsageTitle')),
          h('span', { className: 'pscope-turn-card-time' }, formatTurnTime(detail.endAt, language)),
        ),
        h('div', { className: 'pscope-turn-card-plugins' },
          plugins.map(function ([name, bucket]) {
            return h('div', { key: name, className: 'pscope-turn-card-plugin' },
              h('span', { className: 'pscope-turn-card-name' }, bucket.title || name),
              h('span', { className: 'pscope-turn-card-metric' }, String(bucket.calls || 0) + ' ' + t('callsShort') + ' · ~' + formatNumber(bucket.tokens || 0) + ' ' + t('tokens') + ' · ' + costOf(bucket.tokens, price)),
            )
          }),
        ),
        h('div', { className: 'pscope-turn-card-foot' },
          h('span', null, t('turnTotal') + ': ' + String(pluginCalls) + ' ' + t('callsShort') + ' · ~' + formatNumber(pluginTokens) + ' ' + t('tokens') + ' · ' + costOf(pluginTokens, price)),
          h('span', null, t('modelUsage') + ': ' + formatNumber(detail.usage?.total || 0) + ' ' + t('tokens') + ' · ' + costOf(detail.usage?.total || 0, price)),
        ),
      )
    }

    function TurnHistoryPanel(props) {
      const t = props.t
      const language = props.language
      const price = props.price
      const turns = [...(props.turns || [])]
        .filter(function (turn) { return turn.status === 'closed' && turnPluginEntries(turn).length > 0 })
        .sort(function (left, right) { return right.turn - left.turn })
      const [selected, setSelected] = React.useState(null)
      if (turns.length === 0) return h('div', { className: 'pscope-empty' }, t('noTurnHistory'))
      if (selected !== null) {
        const turn = turns.find(function (entry) { return entry.turn === selected })
        if (turn === undefined) return null
        const plugins = turnPluginEntries(turn)
        const pluginCalls = plugins.reduce(function (sum, entry) { return sum + (entry[1].calls || 0) }, 0)
        const pluginTokens = plugins.reduce(function (sum, entry) { return sum + (entry[1].tokens || 0) }, 0)
        return h('div', { className: 'pscope-turn-detail' },
          h('button', { type: 'button', className: 'pscope-btn', onClick: function () { setSelected(null) } }, '← ' + t('backToHistory')),
          h('div', { className: 'pscope-turn-detail-head' },
            h('strong', null, t('turnLabel', { turn: turn.turn })),
            h('span', { className: 'pscope-turn-detail-time' }, formatTurnTime(turn.endAt, language)),
          ),
          h('div', { className: 'pscope-turn-detail-prompt', title: turn.prompt || '' }, turn.prompt || t('noTurnPrompt')),
          h('div', { className: 'pscope-turn-detail-summary' },
            h('span', null, t('turnTotal') + ': ' + String(pluginCalls) + ' ' + t('callsShort') + ' · ~' + formatNumber(pluginTokens) + ' ' + t('tokens') + ' · ' + costOf(pluginTokens, price)),
            h('span', null, t('modelUsage') + ': ' + formatNumber(turn.usage?.total || 0) + ' ' + t('tokens') + ' · ' + costOf(turn.usage?.total || 0, price)),
          ),
          h('div', { className: 'pscope-turn-detail-plugins' },
            plugins.map(function ([name, bucket]) {
              const tools = Object.entries(bucket.tools || {}).sort(function (left, right) { return (right[1].calls || 0) - (left[1].calls || 0) })
              return h('div', { key: name, className: 'pscope-turn-detail-plugin' },
                h('div', { className: 'pscope-turn-detail-plugin-head' },
                  h('strong', null, bucket.title || name),
                  h('span', { className: 'pscope-turn-card-metric' }, String(bucket.calls || 0) + ' ' + t('callsShort') + ' · ~' + formatNumber(bucket.tokens || 0) + ' ' + t('tokens') + ' · ' + costOf(bucket.tokens, price)),
                ),
                tools.length > 0
                  ? h('div', { className: 'pscope-turn-tools' },
                      h('div', { className: 'pscope-turn-tools-title' }, t('toolBreakdown')),
                      tools.map(function ([tool, toolStats]) {
                        return h('div', { key: tool, className: 'pscope-turn-tool' },
                          h('span', { className: 'pscope-turn-tool-name' }, tool),
                          h('span', { className: 'pscope-turn-card-metric' }, String(toolStats.calls || 0) + ' ' + t('callsShort') + ' · ~' + formatNumber(toolStats.tokens || 0) + ' ' + t('tokens') + ' · ' + costOf(toolStats.tokens, price)),
                        )
                      }),
                    )
                  : null,
              )
            }),
          ),
        )
      }
      return h('div', { className: 'pscope-turn-history' },
        turns.map(function (turn) {
          const plugins = turnPluginEntries(turn)
          const pluginCalls = plugins.reduce(function (sum, entry) { return sum + (entry[1].calls || 0) }, 0)
          const pluginTokens = plugins.reduce(function (sum, entry) { return sum + (entry[1].tokens || 0) }, 0)
          return h('button', {
            key: turn.turn,
            type: 'button',
            className: 'pscope-turn-history-row',
            onClick: function () { setSelected(turn.turn) },
          },
            h('div', { className: 'pscope-turn-history-top' },
              h('strong', null, t('turnLabel', { turn: turn.turn })),
              h('span', { className: 'pscope-turn-history-time' }, formatTurnTime(turn.endAt, language)),
              h('span', { className: 'pscope-turn-history-metric' }, String(pluginCalls) + ' ' + t('callsShort') + ' · ~' + formatNumber(pluginTokens) + ' ' + t('tokens') + ' · ' + costOf(pluginTokens, price)),
            ),
            h('div', { className: 'pscope-turn-history-prompt' }, turn.prompt || t('noTurnPrompt')),
            h('div', { className: 'pscope-turn-history-plugins' }, plugins.map(function ([name, bucket]) { return (bucket.title || name) + ' ×' + String(bucket.calls || 0) }).join(' · ')),
          )
        }),
      )
    }

    function ConversationPlugins(props) {
      const t = props.t
      const sessionId = props.sessionId ?? props.session?.id ?? props.session?.sessionId
      const language = useLanguage()
      const [open, setOpen] = React.useState(false)
      const [tab, setTab] = React.useState('manage')
      const [query, setQuery] = React.useState('')
      const [collapsed, setCollapsed] = React.useState({})
      const [tooltip, setTooltip] = React.useState(null)
      const [usage, setUsage] = React.useState(null)
      const { state, error, loading, refresh } = useScopeState(props.ctx, sessionId)
      const { busy, failure, run } = useBusy()
      const loadUsage = React.useCallback(async function (force) {
        if (sessionId === undefined) return
        try {
          const suffix = '?session=' + encodeURIComponent(sessionId) + (force === true ? '&refresh=1' : '')
          setUsage(await request('/stats' + suffix))
        } catch { /* stats are optional */ }
      }, [sessionId])
      React.useEffect(function () {
        loadUsage(false)
      }, [loadUsage])
      React.useEffect(function () {
        if (!open) {
          setTooltip(null)
          return undefined
        }
        const onKey = function (event) { if (event.key === 'Escape') setOpen(false) }
        window.addEventListener('keydown', onKey)
        return function () { window.removeEventListener('keydown', onKey) }
      }, [open])
      if (sessionId === undefined) return null
      function openPanel() {
        setOpen(true)
        setTab('manage')
        refresh(true)
        loadUsage(true)
      }
      function openHistory() {
        setTab('history')
        loadUsage(true)
      }
      function toggle(plugin) {
        const enabled = !plugin.visible
        return run(function () {
          return post('/session/plugin', { sessionId: sessionId, name: plugin.name, enabled: enabled })
        }, null).then(function (result) {
          if (result !== undefined) {
            loadUsage(true)
            return refresh(true)
          }
        })
      }
      function resetSession() {
        return run(function () {
          return post('/session/reset', { sessionId: sessionId })
        }, t('sessionReset')).then(function (result) {
          if (result !== undefined) {
            loadUsage(true)
            return refresh(true)
          }
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
        const pluginUsage = usage?.session?.plugins?.[plugin.name]
        return h('div', { key: plugin.name, className: 'pscope-plugin-item' },
          h('div', { className: 'pscope-plugin-main' },
            h('div', { className: 'pscope-plugin-line' },
              h('span', {
                className: 'pscope-plugin-title',
                onMouseEnter: function (event) {
                  if (pluginDescription(plugin, language) !== '') setTooltip({ plugin: plugin, x: event.clientX, y: event.clientY })
                },
                onMouseLeave: function () { setTooltip(null) },
              }, plugin.title || plugin.name),
              plugin.version ? h('span', { className: 'pscope-plugin-version' }, plugin.version) : null,
              plugin.protected ? h('span', { className: 'pscope-badge protected' }, t('protected')) : null,
            ),
            h('div', { className: 'pscope-plugin-name' }, plugin.name),
            pluginUsage ? h('div', { className: 'pscope-plugin-usage' }, String(pluginUsage.calls) + ' ' + t('callsShort') + ' · ~' + formatNumber(pluginUsage.tokens) + ' ' + t('tokens') + ' · ' + costOf(pluginUsage.tokens, price)) : null,
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
      const mode = state?.session?.mode || 'on-demand'
      const modeLabel = mode === 'global' ? t('global') : mode === 'off' ? t('off') : t('onDemand')
      const price = state?.settings?.pricePerMillion ?? 2
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
          h('span', { className: 'pscope-header-icon', 'aria-hidden': 'true' }, h(ScopeGlyph)),
          h('span', { className: 'pscope-header-label' }, t('pluginsShort')),
          h('span', { className: 'pscope-header-count' }, String(visibleCount)),
        ),
        open ? h(React.Fragment, null,
          h('div', { className: 'pscope-popover-backdrop', onClick: function () { setOpen(false) } }),
          h('div', { className: 'pscope-popover', role: 'dialog', 'aria-modal': 'false', 'aria-label': t('conversationPlugins') },
            h('div', { className: 'pscope-popover-head' },
              h('div', null,
                h('div', { className: 'pscope-popover-title' }, t('conversationPlugins')),
                h('div', { className: 'pscope-popover-sub' }, modeLabel + ' · ' + t('enabledCount', { count: visibleCount }) + ' · ' + sourceLabel),
                h('div', { className: 'pscope-popover-usage' },
                  h('span', null, t('calls') + ': ' + String(usage?.session?.calls || 0)),
                  h('span', null, t('tokens') + ': ~' + formatNumber(usage?.session?.tokens || 0) + ' · ' + costOf(usage?.session?.tokens || 0, price)),
                  h('span', null, t('modelTokens') + ': ' + formatNumber(usage?.session?.usage?.total || 0) + ' · ' + costOf(usage?.session?.usage?.total || 0, price)),
                ),
              ),
              h('div', { className: 'pscope-row' },
                source === 'session'
                  ? h('button', { type: 'button', className: 'pscope-btn', disabled: busy, onClick: resetSession }, t('resetSession'))
                  : null,
                h('button', { type: 'button', className: 'pscope-btn', onClick: function () { setOpen(false) } }, t('close')),
              ),
            ),
            h('div', { className: 'pscope-tabs', role: 'tablist', 'aria-label': t('conversationPlugins') },
              h('button', {
                type: 'button',
                role: 'tab',
                'data-active': tab === 'manage',
                'aria-selected': tab === 'manage',
                onClick: function () { setTab('manage') },
              }, t('managePluginsTab')),
              h('button', {
                type: 'button',
                role: 'tab',
                'data-active': tab === 'history',
                'aria-selected': tab === 'history',
                onClick: openHistory,
              }, t('callHistoryTab')),
            ),
            tab === 'manage' ? h('div', { className: 'pscope-popover-search' },
              h('input', {
                className: 'pscope-input pscope-search',
                autoFocus: true,
                value: query,
                placeholder: t('searchPlugins'),
                'aria-label': t('searchPlugins'),
                onChange: function (event) { setQuery(event.target.value) },
              }),
            ) : null,
            tab === 'manage' ? h('div', { className: 'pscope-popover-body' },
              failure ? h('div', { className: 'pscope-error' }, failure) : null,
              error ? h('div', { className: 'pscope-error' }, error) : null,
              state === null
                ? h('div', { className: 'pscope-empty' }, loading ? t('loading') : t('error'))
                : groups.map(function (group) {
                    if (group.items.length === 0) return null
                    const closed = collapsed[group.key] === true
                    return h('div', { key: group.key, className: 'pscope-popover-group' },
                      h('button', {
                        type: 'button',
                        className: 'pscope-group-head',
                        onClick: function () {
                          setCollapsed(function (current) { return { ...current, [group.key]: !current[group.key] } })
                        },
                        'aria-expanded': closed !== true,
                      },
                        h('span', { className: 'pscope-group-caret', 'aria-hidden': 'true' },
                          h('svg', { width: 11, height: 11, viewBox: '0 0 12 12', fill: 'none' },
                            h('path', {
                              d: closed ? 'M4 2.2 7.8 6 4 9.8' : 'M2.2 4 6 7.8 9.8 4',
                              stroke: 'currentColor',
                              strokeWidth: 1.6,
                              strokeLinecap: 'round',
                              strokeLinejoin: 'round',
                            }),
                          ),
                        ),
                        h('span', { className: 'pscope-group-title' }, group.title),
                        h('span', { className: 'pscope-group-count' }, String(group.items.length)),
                      ),
                      closed ? null : group.items.map(row),
                    )
                  }),
              state !== null && matches.length === 0 ? h('div', { className: 'pscope-empty' }, t('noSearchResults')) : null,
            )
              : h('div', { className: 'pscope-popover-body pscope-history-body' },
                  h(TurnHistoryPanel, {
                    t: t,
                    language: language,
                    price: price,
                    turns: usage?.session?.turnDetails || [],
                  }),
                ),
            h('div', { className: 'pscope-popover-foot' }, tab === 'manage' ? t('globalNote') : t('historyNote')),
          ),
        ) : null,
        tooltip !== null
          ? h('div', {
              className: 'pscope-tooltip',
              style: {
                left: Math.max(8, Math.min(tooltip.x + 12, (typeof window === 'undefined' ? 1200 : window.innerWidth) - 340)),
                top: Math.max(8, Math.min(tooltip.y + 14, (typeof window === 'undefined' ? 800 : window.innerHeight) - 96)),
              },
            }, pluginDescription(tooltip.plugin, language))
          : null,
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
      const [usage, setUsage] = React.useState(null)
      React.useEffect(function () {
        if (state === null) return undefined
        let alive = true
        const suffix = sessionId ? '?session=' + encodeURIComponent(sessionId) : ''
        request('/stats' + suffix).then(function (result) {
          if (alive) setUsage(result)
        }).catch(function () { /* stats are optional */ })
        return function () { alive = false }
      }, [state?.revision, sessionId])
      if (loading && state === null) return h('div', { className: 'pscope-root' }, h(Styles), h('div', { className: 'pscope-empty' }, t('loading')))
      if (error && state === null) return h('div', { className: 'pscope-root' }, h(Styles), h('div', { className: 'pscope-error' }, t('error') + ': ' + error), h('button', { type: 'button', className: 'pscope-btn', onClick: function () { refresh(true) } }, t('retry')))
      if (state === null) return null
      const visible = state.estimate || { tools: 0, tokens: 0, hiddenTools: 0, hiddenSkills: 0 }
      function onScope(name, scope, profiles) {
        return run(function () { return post('/plugin', { name: name, scope: scope, profiles: profiles }) }, t('scopeSaved'))
          .then(function () { return refresh(true) })
      }
      function onSessionMode(id, mode) {
        return run(function () { return post('/session', { sessionId: id, mode: mode }) }, t('scopeSaved'))
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
      function onWorkspaceMode(cwd, mode) {
        return run(function () { return post('/workspace', { cwd: cwd, profileId: state.settings.defaultProfileId, mode: mode }) }, t('workspaceSaved'))
          .then(function () { return refresh(true) })
      }
      function onDeleteWorkspace(cwd) {
        return run(function () { return post('/workspace/delete', { cwd: cwd }) }, t('workspaceCleared'))
          .then(function () { return refresh(true) })
      }
      async function onWorkspacePlugins(cwd, overrides) {
        const config = state.workspaces[cwd]
        const profileId = config?.profileId || state.settings.defaultProfileId
        await post('/workspace', { cwd: cwd, profileId: profileId, overrides: overrides })
        await refresh(true)
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
            h('div', { className: 'pscope-card-note' }, state.settings.mode),
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
              h('th', null, t('calls')),
              h('th', null, t('tokens')),
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
                usage: usage?.plugins?.[plugin.name],
                refresh: function () { refresh(true) },
                onScope: onScope,
              })
            })),
          ),
        ),
        h(WorkspacesSection, { t: t, state: state, usage: usage, busy: busy, onWorkspaceMode: onWorkspaceMode, onDeleteWorkspace: onDeleteWorkspace, onWorkspacePlugins: onWorkspacePlugins }),
        h(TagsSection, { t: t, state: state, onSaved: function () { refresh(true) } }),
        h('div', { className: 'pscope-section' },
          h('div', { className: 'pscope-section-head' }, h('div', { className: 'pscope-section-title' }, t('sessions'))),
          h(SessionsTable, { t: t, language: language, state: state, busy: busy, onSessionMode: onSessionMode }),
        ),
        h(ConfigurationSection, { t: t, state: state, busy: busy, onSettings: function (patch) { return run(function () { return post('/settings', patch) }, t('scopeSaved')).then(function () { return refresh(true) }) } }),
      )
    }

    function ScopeMainPage(props) {
      return h('div', { className: 'pscope-main-panel' },
        h(ScopePage, { ctx: props.ctx, t: props.t, sessionId: props.sessionId }),
      )
    }

    function PriceInput(props) {
      const t = props.t
      const [value, setValue] = React.useState(String(props.value ?? 2))
      React.useEffect(function () { setValue(String(props.value ?? 2)) }, [props.value])
      function commit() {
        const number = Number(value)
        if (Number.isFinite(number) && number >= 0) props.onCommit(number)
      }
      return h('label', { className: 'pscope-row', style: { alignItems: 'center' } },
        h('span', null, t('pricePerMillion')),
        h('input', {
          type: 'number',
          min: '0',
          step: '0.01',
          className: 'pscope-select',
          style: { width: '90px', maxWidth: '90px' },
          value: value,
          disabled: props.busy,
          onChange: function (event) { setValue(event.target.value) },
          onBlur: commit,
          onKeyDown: function (event) { if (event.key === 'Enter') commit() },
        }),
        h('span', { className: 'pscope-note' }, t('pricingHelp')),
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
          h('label', { className: 'pscope-row' },
            h('input', { type: 'checkbox', checked: state.settings.autoMatchTags === true, disabled: busy, onChange: function () { toggle('autoMatchTags') } }),
            t('autoMatchTags'),
          ),
          h(PriceInput, {
            t: t,
            value: state.settings.pricePerMillion,
            busy: busy,
            onCommit: function (value) { props.onSettings({ pricePerMillion: value }) },
          }),
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
      const [usage, setUsage] = React.useState(null)
      const price = state?.settings?.pricePerMillion ?? 2
      React.useEffect(function () {
        let alive = true
        request('/stats').then(function (result) { if (alive) setUsage(result) }).catch(function () { /* optional */ })
        return function () { alive = false }
      }, [])
      if (name === undefined || state === null) return null
      const plugin = findPlugin(state, name)
      if (plugin === undefined) return h('div', { className: 'pscope-detail' }, h(Styles), h('div', { className: 'pscope-note' }, t('noPlugin')))
      const protectedPlugin = plugin.protected === true
      function choose(scope) {
        run(function () { return post('/plugin', { name: name, scope: scope, profiles: [] }) }, t('scopeSaved'))
          .then(function (result) { if (result !== undefined) setSaved(result.application || 'applied'); refresh(true) })
      }
      return h('div', { className: 'pscope-detail' },
        h(Styles),
        h('div', { className: 'pscope-detail-title' }, t('scope')),
        h('div', { className: 'pscope-row' },
          h(ScopeSelect, { t: t, value: plugin.scope, disabled: protectedPlugin, busy: busy, onChange: choose }),
          plugin.scope === 'on-demand' ? h('div', { className: 'pscope-note' }, t('onDemandHint')) : null,
        ),
        protectedPlugin ? h('div', { className: 'pscope-note' }, t('protectedNote')) : null,
        (function () {
          const pluginUsage = usage?.plugins?.[name]
          return pluginUsage
            ? h('div', { className: 'pscope-plugin-usage' }, t('totalUsage') + ': ' + String(pluginUsage.calls) + ' ' + t('callsShort') + ' · ~' + formatNumber(pluginUsage.tokens) + ' ' + t('tokens') + ' · ' + costOf(pluginUsage.tokens, price))
            : null
        })(),
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
      const mode = state.session?.mode || 'on-demand'
      const modeLabel = mode === 'global' ? t('global') : mode === 'off' ? t('off') : t('onDemand')
      const estimate = state.estimate || { tools: 0, tokens: 0 }
      function change(nextMode) {
        run(function () { return post('/session', { sessionId: sessionId, mode: nextMode }) }, null)
          .then(function () { refresh(true) })
      }
      return h(React.Fragment, null,
        h(Styles),
        h('span', { className: 'pscope-chipbar', title: t('sessionScope') },
        h('span', null, t('sessionScope')),
        h('strong', null, modeLabel),
        h('select', { value: mode, disabled: busy, onChange: function (event) { change(event.target.value) }, 'aria-label': t('sessionScope') },
          h('option', { value: 'global' }, t('global')),
          h('option', { value: 'on-demand' }, t('onDemand')),
          h('option', { value: 'off' }, t('off')),
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

      register('main', { key: 'plugin-scope' }, function () {
        return h(ScopeMainPage, { ctx: ctx, t: t })
      })
      register('sidebar.panellist', { id: 'plugin-scope', order: 15, label: function () { return t('nav') } }, ScopeSidebarIcon)
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
      register('conversation.chat.turnTail', {
        id: 'plugin-scope-turn-usage',
        order: 30,
        inject: function (sessionId) { return { sessionId: sessionId, t: t } },
      }, TurnUsageCard)
    }

    return { inject: ['slots', 'locale'], apply: apply }
  },
})
