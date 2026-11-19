# v0.1 实现说明

> 对应版本：dsh-plugin-scope 0.1.0（Gate 引擎）  
> 设计基线：[docs/DESIGN.md](DESIGN.md)  
> 运行环境：DeepSeek Harness 0.2.2-rc.5 / Desktop profile

## 1. 代码地图

| 文件 | 作用 |
|---|---|
| lib/core.js | 纯函数：状态归一化、作用域解析、工具/技能/section 收集、token 估算、模板 CRUD |
| lib/state.js | profile 级 JSON 状态：原子写、备份、串行化、损坏恢复 |
| lib/index.js | Host 插件：inventory、Gate、pluginManager 全局开关、HTTP API、agent/created |
| lib/client.js | 浏览器半：Settings 页、Plugins/Settings tab、插件详情徽章/区块、对话 chip、映射抽屉 |
| package.json | dsh.bundle.patch + dsh.client + exports；无运行时依赖 |
| cordis.patch.yml | 只插入一个 Host row |
| locale/en.json, locale/zh.json | 插件管理器的标题/描述 |
| test/core.test.mjs | 12 个纯函数测试 |

v0.1 是**纯 ESM JavaScript**，没有构建步骤。这样本地 link 安装和 GitHub 源码安装都不需要 pnpm 执行 prepare/build 脚本。TypeScript/tsdown 可以作为后续重构，不是当前运行前提。

## 2. 实际行为

### 2.1 作用域

- 全局：所有对话可见。
- 按需：只有选中它的模板/对话可见；未选中时工具声明被 tools.restrict 移除。
- 关闭：调用 pluginManager.setBundleEnabled(name, false)；所有对话不可见。
- 对话级：每个 session 记录 profileId + overrides（add/remove/includeTools/excludeTools）。

### 2.2 Gate

在 agent/created 时：

1. 读取 session 的模板（无记录则默认模板；fork 会复制父 session 记录）。
2. 收集应隐藏的工具名。
3. 在 agent.ctx.effect 中调用 agent.ctx.tools.restrict({ deny })。
4. 对已映射的技能注册同名空技能（modelInvocable:false），对已映射的 prompt section 注册空 section。
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

### 2.5 映射

内置映射覆盖：

- dsh-ai-diagrams：7 个 diagram_* 工具 + diagram-design 技能
- @michengai/dsh-skills-manager：create_skill
- @wxg-prc-cpg/browser-skill-dsh-plugin：6 个 bsk_* 工具
- dshmarket / dsh-whale-widget：无模型工具

其余插件：读取 package.json 的 dsh.scope（如果作者声明）；否则 unknown，默认保持 Global。  
Map tools 抽屉允许手动把当前会话可见工具归到插件下，保存为 mappedBy: manual。

## 3. HTTP API（实际实现）

前缀：/api/dsh-plugin-scope

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | /state?session= | 库存 + 作用域 + 估算 + live sessions |
| GET | /tools?session= | 当前会话可见工具，用于映射抽屉 |
| POST | /plugin | { name, scope, profiles }；全局/按需/关闭 |
| POST | /session | { sessionId, profileId, overrides } |
| POST | /default | { profileId } |
| POST | /profile | { action: create/update/delete, profile/id } |
| POST | /mapping | { name, contribution } |
| POST | /settings | { showChip, autoApplyOnCreate, subagentInherits } |
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

- npm test：12/12 通过。
- node --check lib/core.js lib/state.js lib/index.js lib/client.js：通过。
- 安装：dsh plugin --profile desktop add link:/Users/haozhanshi/WorkSpace/deepseek-work/plugin-scope 成功；profile 依赖与 bundle 列表包含 dsh-plugin-scope。
- GET /api/dsh-plugin-scope/state：返回 8 个 profile 插件、2 个 live agent。
- Gate：把 dsh-ai-diagrams 设为 on-demand、默认模板 minimal 后，两个 live agent 的 gate 都登记了 7 个 diagram_* 工具和 diagram-design 技能；estimate 从 32 tools / 19,590 tokens 降到 25 tools / 18,291 tokens。
- 全局开关：POST /plugin 把 dsh-ai-diagrams 设为 off 返回 application: applied，enabled 变为 false；设回 on-demand 后 enabled 恢复 true。
- 客户端 bundle：GET /api/dsh-plugin-scope/client 的 client module graph 包含 dsh-plugin-scope；combo URL 返回 HTTP 200（40 KB）。
- 当前状态已恢复为默认 all，两个 live agent 的 gate 数为 0，避免影响用户后续对话。
- GitHub：main、v0.1.0 tag 与 Release 已发布到 https://github.com/UserShi/dsh-plugin-scope；Release 自带 dsh-plugin-scope-0.1.0.tgz。npm 发布待 npm login。

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
