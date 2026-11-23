# v0.1–v0.3 实现说明（含 M4a / M4d）

> Stable：dsh-plugin-scope 0.3.2（Gate + 工作区 + 用量 + 标签列表 + 统一下拉作用域 + 侧栏入口 + 单轮调用历史）；M4b / Preset 隔离未开始
> 设计基线：[docs/DESIGN.md](DESIGN.md)  
> 运行环境：DeepSeek Harness 0.2.2-rc.5 / Desktop profile

## 1. 代码地图

| 文件 | 作用 |
|---|---|
| lib/core.js | 纯函数：状态归一化、作用域解析、工具/技能/section 收集、token 估算、模板 CRUD |
| lib/state.js | profile 级 JSON 状态：原子写、备份、串行化、损坏恢复 |
| lib/stats.js | 纯函数：session log 折叠调用/工具 token/模型 usage、按插件/工作区归集、按 turn 折叠 |
| lib/index.js | Host 插件：inventory、Gate、pluginManager 全局开关、HTTP API、agent/created |
| lib/client.js | 浏览器半：Settings 页、Plugins/Settings tab、左侧栏入口 + main panel、插件详情徽章/区块、对话 chip、右上角对话插件选择器、映射抽屉 |
| package.json | dsh.bundle.patch + dsh.client + exports；无运行时依赖 |
| cordis.patch.yml | 只插入一个 Host row |
| locale/en.json, locale/zh.json | 插件管理器的标题/描述 |
| test/core.test.mjs | 20 个纯函数测试 |
| test/stats.test.mjs | 4 个用量折叠/归集测试 |

v0.1 是**纯 ESM JavaScript**，没有构建步骤。这样本地 link 安装和 GitHub 源码安装都不需要 pnpm 执行 prepare/build 脚本。TypeScript/tsdown 可以作为后续重构，不是当前运行前提。

## 2. 实际行为

### 2.1 作用域

- 全局：所有对话可见。
- 按需：默认隐藏；只有对话/工作区 override 的 add 或标签自动匹配把它加入时才可见；否则工具声明被 tools.restrict 移除。作用域模板不再决定按需插件可见性。
- 关闭：调用 pluginManager.setBundleEnabled(name, false)；所有对话不可见。
- 工作区级：state.workspaces[cwd] 记录 mode（global/on-demand/off）+ overrides；对话没有 session 记录时使用 cwd 对应工作区。
- 对话级：每个 session 记录 mode + overrides（add/remove/includeTools/excludeTools）；有记录时优先于工作区。
- 作用域模板/profile 选择已从 UI 移除；profileId 仅作为旧数据兼容字段保留，插件可见性不再依赖 profile。
- 语言：settings.language 为 zh/en，默认 zh。

### 2.2 Gate

在 agent/created 时：

1. 读取 session 的模板（无记录则默认模板；fork 会复制父 session 记录）。
2. 收集应隐藏的工具名。
3. 在 agent.ctx.effect 中调用 agent.ctx.tools.restrict({ deny })。
4. 对已映射且在当前 scope 实际可见的技能注册同名空技能（modelInvocable:false）；对已映射的 prompt section 注册空 section。未知/不可见技能不会伪造 stub。
5. 工具名不存在时从 deny 集合剔除，不让 agent 创建失败。

工具变化由 DSH 自动写入 tool-addition/removal，因此会话可回放。

### 2.3 全局开关

所有全局变更走 ctx.pluginManager：

- setBundleEnabled(name, enabled)
- 返回 application / nextStep，客户端原样显示，不把 saved 当 applied。
- 受保护插件（本插件、dshmarket、@deepseek-ai/dsh-*）只能保持 Global。

### 2.4 Token 估算

优先用 agentPresets.acquireScope(presetId) 拿到当前 preset 的 scope key，再调用 ctx.tools.schemas(scopeKey)。  
非 live 会话回落到全局 schemas。估算值是 JSON 长度 / 4，只用于相对比较。

### 2.4.1 用量

- 调用次数：`tool/call` + `tool/ptc-dispatch`（PTC 嵌套工具按真实工具名计数）。
- 工具 tokens：工具参数 + 模型可见结果的 JSON 长度 / 4，属于估算。
- 模型 tokens：`assistant/message.usage.totalTokens`（缺失时 input+output+cache）。
- 按插件归集使用 contribution.tools；未映射工具进入 unattributed，不显示在插件行。
- 会话统计来自 sessionQuery.readSession（live-preferred）；全部/工作区统计扫描最近 200 个会话，缓存 20 秒。
- 费用 = tokens / 1,000,000 × settings.pricePerMillion（默认 ¥2/1M）；工具 tokens 和模型 usage 使用同一单价，属于估算，不代表 provider 实际账单。

### 2.5 映射

内置映射覆盖：

- dsh-ai-diagrams：7 个 diagram_* 工具 + diagram-design 技能
- @michengai/dsh-skills-manager：create_skill
- @wxg-prc-cpg/browser-skill-dsh-plugin：6 个 bsk_* 工具
- dshmarket / dsh-whale-widget：无模型工具

其余插件：读取 package.json 的 dsh.scope（如果作者声明）；否则 unknown，默认保持 Global。  
Map contributions 抽屉允许手动把当前会话可见工具、技能归到插件下，并可填写 prompt section 名称；保存为 mappedBy: manual。

## 3. HTTP API（实际实现）

前缀：/api/dsh-plugin-scope

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /state?session= | 库存 + 作用域 + 估算 + live sessions |
| GET | /tools?session= | 当前会话可见工具，用于映射抽屉 |
| GET | /skills?session= | 当前会话可见技能（含 provider/source），用于映射抽屉 |
| GET | /gates | 当前 live agent 的 deny 工具、隐藏技能、隐藏 section 诊断 |
| POST | /plugin | { name, scope, profiles }；全局/按需/关闭；profiles 仅为兼容字段，按需可见性不再依赖它 |
| POST | /session | { sessionId, mode, overrides? }；会话作用域，省略 overrides 时保留继承值 |
| POST | /session/plugin | { sessionId, name, enabled }；只对 on-demand 插件启停本次对话 |
| POST | /session/reset | { sessionId }；删除会话覆盖，回退到工作区/默认 |
| POST | /workspace | { cwd, mode, profileId?, overrides? }；工作区作用域 |
| POST | /workspace/delete | { cwd }；清除工作区配置 |
| GET | /stats?session= | 当前会话 / 插件 / 工作区 / 全部累计用量；session.turnDetails 为单轮明细，pricePerMillion 为当前单价 |
| POST | /tags | { name, tags }；插件标签 |
| POST | /tag | { action: create/rename/delete/move, tag/name, direction? }；标签列表 CRUD |
| POST | /tag-rule | { tag, keywords, enabled }；标签关键词/自动开关 |
| POST | /auto-match | { sessionId, text }；手动触发关键词匹配（诊断） |
| POST | /default | { profileId } |
| POST | /profile | { action: create/update/delete, profile/id } |
| POST | /mapping | { name, contribution } |
| POST | /settings | { language, showChip, autoApplyOnCreate, subagentInherits } |
| POST | /reset | 重置为默认状态 |
| GET | /diagnostics | 路径、库存、live agent、lastError |

安全：默认仅 loopback；POST 只接受 JSON，body 上限 256 KiB；错误统一为 { ok:false, error:{ code, message } }。

## 4. 与设计的差异

| 设计 | 实现 | 原因 |
|---|---|---|
| import @deepseek-ai/dsh-scope 的 scopeOf/scopeParentOf | 不 import 核心包 | 第三方 Host 插件不应依赖安装包内部路径；restrict 的未知工具重试足够安全 |
| 用父 scope 的 definitions 过滤可限制工具 | 直接调用 restrict，按错误信息剔除未知工具 | restrict 的错误本身列出未知工具，避免依赖 scope key |
| header.utilities 会话 chip | conversation.input.dock chip | 该 slot 的 owner props 明确带 session，能直接拿到 session.id |
| tsdown/TypeScript 构建 | 纯 ESM，无构建 | 本地 link/GitHub 安装不触发 pnpm prepare；v0.1 优先可安装 |
| 配置编辑器/ctx.storageDomain | profile 下 .dsh-plugin-scope/state.json | 无 peer 依赖，行为可控；后续可迁移 storage domain |
| Typert Remote | 同源 HTTP routes | 不需要生成 host/remote 类型产物 |

## 5. dsh-market 适配

- dshmarket 被标记为受保护管理插件：只能 Global，UI 显示 Management。
- 原生 Plugins 页的 plugins.detail.badge / plugins.detail.section 对市场安装的插件同样生效。
- plugins.tab 与 settings.plugins.tab 增加 Scopes 页，和 dshmarket 的 Discover tab 并列。
- 不复制市场的安装/卸载/更新/快照逻辑；全局开关仍走 pluginManager，市场自己的状态会随 inventory 刷新。
- 市场的 Discover 卡片目前没有公开 per-card slot，所以 v0.1 不在卡片内嵌控件；v0.2 可向 dshmarket 提 PR。

## 6. 已验证

已在本机 desktop profile 安装并做运行时验证：

- npm test：25/25 通过。
- node --check lib/core.js lib/state.js lib/index.js lib/client.js：通过。
- 安装：dsh plugin --profile desktop add link:/Users/haozhanshi/WorkSpace/deepseek-work/plugin-scope 成功；profile 依赖与 bundle 列表包含 dsh-plugin-scope。
- GET /api/dsh-plugin-scope/state：返回 8 个 profile 插件、2 个 live agent。
- Gate：把 dsh-ai-diagrams 设为 on-demand、默认模板 minimal 后，两个 live agent 的 gate 都登记了 7 个 diagram_* 工具和 diagram-design 技能；estimate 从 32 tools / 19,590 tokens 降到 25 tools / 18,291 tokens。
- 全局开关：POST /plugin 把 dsh-ai-diagrams 设为 off 返回 application: applied，enabled 变为 false；设回 on-demand 后 enabled 恢复 true。
- 客户端 bundle：GET /api/dsh-plugin-scope/client 的 client module graph 包含 dsh-plugin-scope；combo URL 返回 HTTP 200（40 KB）。
- M4a：GET /skills 返回 7 个技能；把 session 临时切到 minimal 时 gatedTools=7、gatedSkills=1、gates=1，切回 all 后归零；映射弹窗、技能/section 保存和 /gates 诊断已接入。
- 语言：POST /settings {language:'en'} 返回 settings.language='en'，切回 zh 成功；内置模板名/描述/计数在客户端本地化，默认 zh。
- 对话插件选择器：POST /session/plugin 关闭 dsh-ai-diagrams 后 /state?session 的 visible=false、overrides.remove=['dsh-ai-diagrams']、gatedTools=7；重新开启后 visible=true、gatedTools=0。客户端 bundle 包含 ConversationPlugins 与 pscope-popover。
- 工作区：给当前 cwd 设置 minimal 后 /session/reset，source=workspace、profile=minimal、diagrams=false、gatedTools=7；清除工作区后 source=default、profile=all、gatedTools=0。
- 工作区插件列表：/workspace 传 overrides.remove=['dsh-ai-diagrams'] 后 source=workspace、diagrams=false、gatedTools=7；删除工作区后恢复 default/all。客户端包含 WorkspacePluginModal 与 pluginSettings。
- 用量：/stats 扫描 3 个会话，total calls=1591、tool tokens≈1.33M、model usage total≈282M；session 当前 1439 calls、plugins 中 dsh-ai-diagrams=4 calls/4102 tokens、browser-skill=3 calls/223 tokens；workspaces 按 cwd 聚合成功。
- 标签/自动匹配：给 dsh-ai-diagrams 打 diagram 标签、规则关键词（画图/diagram）、开启 autoMatchTags；session minimal 时 diagrams=false/gatedTools=7；POST /auto-match text=帮我画图 后 diagrams=true、overrides.add=['dsh-ai-diagrams']、gatedTools=0；清理后恢复。
- 深色模式：把错误的 --dsw-alias-bg-elevated / line-subtle 等替换为真实的 --dsw-alias-bg-layer-1/2、border-l2、label-*、button-primary-fill；待用户刷新确认视觉效果。
- 当前状态已恢复为默认 all，live agent 的 gate 数为 0，避免影响用户后续对话。
- GitHub：main、v0.2.1 tag 与 Release 已发布到 https://github.com/UserShi/dsh-plugin-scope；Release 自带 dsh-plugin-scope-0.2.1.tgz。
- npm：dsh-plugin-scope@0.1.0 已发布到 https://www.npmjs.com/package/dsh-plugin-scope（npm 的 staged publishing 留下一个 0.0.0-stage 占位版本；latest 是 0.1.0）。

尚未完成的验证（需要浏览器控制或用户确认）：

- Settings 页出现 Plugin Scope、Plugins 页出现 Scopes tab；
- 插件详情页出现作用域徽章/区块；
- 对话输入框上方出现 chip；
- 点击切换后浏览器端无 React/slot 崩溃；
- 下一轮请求 header 中出现 tool-removal（当前会话的工具列表在 gate 应用前已经固定，下一轮才能观察）。

## 7. 下一步

1. 在 desktop profile 安装并修复真实 slot/服务差异。
2. 增加 preset 引擎（完全隔离，仅 preset-safe 插件）。
3. 增加技能/ prompt section 的自动映射（插件 manifest 标准）。
4. 截图、README 预览、npm 发布。
5. GitHub Actions CI + Release tarball。
