# Changelog

## v0.4.4 — 2026-11-23

### 中文

- 新增已开始会话手动迁移：
  - `POST /session/migrate`;
  - 通过 registry `recompose` + `agent-preset/selected` 事件切换 preset；
  - open turn 拒绝迁移；
  - 会话表 Preset 下拉在已开始会话上先确认再迁移。
- 验证：从磁盘恢复的已开始会话从 40 tools 迁移到 47 tools（7 个 diagram）。
- 新增 [docs/BACKLOG.md](docs/BACKLOG.md)：登记 client-half、上游 Host、进程级单加载、全量失败回退、会话迁移边界测试等。
- 测试 26/26 通过。

### English

- Added manual migration for started sessions:
  - `POST /session/migrate`;
  - switches presets via registry `recompose` plus the `agent-preset/selected` event;
  - rejects when a turn is open;
  - the session Preset dropdown confirms before migrating a started session.
- Verified a disk-restored started session moving from 40 tools to 47 tools (7 diagram tools).
- Added [docs/BACKLOG.md](docs/BACKLOG.md) for client-half, upstream Host, process-level single load, full-pool failure fallback and migration edge tests.
- 26/26 tests pass.

## v0.4.3 — 2026-11-23

### 中文

- 工作区 preset 变更后自动重选空白会话；工作区删除也恢复 profile 全量池。
- 已开始会话仍由 registry 锁定，不会迁移。
- 验证：工作区空 → 40 tools/无 diagram；工作区全量 → 47 tools/7 diagram。
- 测试 26/26 通过。

### English

- After a workspace preset change, blank conversations are re-selected automatically; deleting a workspace restores the profile full pool.
- Started sessions remain locked by the registry.
- Verified: empty workspace -> 40 tools/no diagram; full workspace -> 47 tools/7 diagram.
- 26/26 tests pass.

## v0.4.2 — 2026-11-23

### 中文

- Profile Preset 产品化：
  - per-workspace 子集：工作区插件弹窗中多选 preset bundle；
  - per-session：会话表新增 Preset 下拉（跟随工作区 / 不使用 / 全部池）；
  - 自定义 subset 通过 `POST /session` 的 `presetBundles` 设置。
- preset 改为懒注册：
  - 首个需要该子集的空白会话才注册；
  - 并发创建有 pending guard，避免重复 preset ID；
  - 子集注册失败自动回退全量池。
- 增加 `presetWarning`、session `presetBundles/presetId` 状态。
- Host 补丁缺失检测保留。
- 测试 26/26 通过。

### English

- Productized Profile Presets:
  - per-workspace subsets in the workspace plugin modal;
  - per-session Preset dropdown (inherit / none / full pool);
  - custom subsets via `POST /session` `presetBundles`.
- Presets are registered lazily:
  - only when a blank session needs that subset;
  - concurrent creation is guarded with a pending map;
  - subset registration failure falls back to the full pool.
- Added `presetWarning` and session `presetBundles/presetId` state.
- Missing Host patch detection remains.
- 26/26 tests pass.

## v0.4.1 — 2026-11-23

### 中文

- 新增 Profile Preset 配置 UI：
  - 列出 profile 已安装 bundle，勾选后写入 `dsh.profile.presetBundles`；
  - 显示 Host 能力、注册状态、错误和 client-half 警告；
  - 保存后提示重启 DSH。
- 新增 `GET /preset` 与 `POST /preset/save`。
- 增加 Host 补丁缺失检测：检测到 bundle 仍在 root 挂载时中止 preset 注册，避免重复服务。
- preset 会话跳过 Gate；preset bundle 不再误报 stale 映射。
- 保存前备份 profile `package.json` 为 `.plugin-scope-backup`。
- 测试 26/26 通过。

### English

- Added the Profile Preset configuration UI:
  - lists profile-installed bundles and writes selected names to `dsh.profile.presetBundles`;
  - shows Host capability, registration status, errors and client-half warnings;
  - tells the user to restart DSH after saving.
- Added `GET /preset` and `POST /preset/save`.
- Added missing-Host-patch detection: registration aborts if a listed bundle is still mounted at root, preventing duplicate services.
- Preset sessions skip Gate; preset bundles no longer show false stale mappings.
- The original profile `package.json` is backed up as `.plugin-scope-backup`.
- 26/26 tests pass.

## v0.4.0 — 2026-11-23

### 中文

- 新增实验性 **Profile Preset Engine**：
  - Host `presetBundles` 补丁把 bundle 从 root 移入 preset layers；
  - Plugin Scope 解析默认 preset + bundle patch rows，注册 `scope:profile`；
  - 新空白会话自动选择，已开始会话保持锁定；
  - `diagnostics.presetIsolation` 暴露启用/注册/错误/bundle 列表。
- 隔离运行时验证：root 不加载 `dsh-ai-diagrams`，preset 会话获得 47 个工具（含 7 个 diagram 工具）。
- 映射诊断、技能 provider/source 过滤、DETAIL/FAQ/示例保留。
- 已知限制：profile 级固定集合；有 client half 的 bundle 只警告；失败不自动回退 Gate；需 Host 补丁。
- 测试 26/26 通过。

### English

- Added experimental **Profile Preset Engine**:
  - the Host `presetBundles` patch moves bundles from root into preset layers;
  - Plugin Scope parses the default preset plus bundle patch rows and registers `scope:profile`;
  - new blank sessions select it automatically; started sessions stay locked;
  - `diagnostics.presetIsolation` reports enabled/registered/error/bundles.
- Verified in an isolated runtime: `dsh-ai-diagrams` is absent from root and a preset session receives 47 tools (including 7 diagram tools).
- Mapping diagnostics, skill provider/source filter, DETAIL/FAQ/examples remain.
- Known limits: profile-level fixed set; client-half bundles only warn; no automatic Gate fallback on failure; requires the Host patch.
- 26/26 tests pass.

## v0.3.4 — 2026-11-23

### 中文

- 新增映射诊断：过期工具/技能、重复归属工具/技能、受保护 Prompt section 警告。
- 插件列表和映射弹窗展示诊断；只提示，不自动删除映射。
- 映射弹窗的技能列表新增 provider/source 过滤。
- 新增 DETAIL.md（架构、状态、API、排查、M4b 阻塞说明）。
- 新增 examples/README.md（作用域、工作区、标签匹配、单轮统计、诊断示例）。
- README 增加 FAQ/故障排查；M0/M4a/M5 状态更新。
- M4b Preset Engine 记录为阻塞：DSH profile bundles 在 root 加载，agentPresets 无法 per-session 卸载。
- 测试 26/26 通过。

### English

- Added mapping diagnostics: stale tools/skills, duplicate ownership, protected prompt sections.
- Plugin list and mapping modal show warnings; mappings are never deleted automatically.
- Added provider/source filtering to the mapping modal's skill list.
- Added DETAIL.md (architecture, state, API, troubleshooting, M4b blocker).
- Added examples/README.md (scopes, workspace, tag matching, per-turn stats, diagnostics).
- README gains an FAQ/troubleshooting section; M0/M4a/M5 status updated.
- M4b Preset Engine recorded as blocked: DSH profile bundles load at root and agentPresets cannot unload them per session.
- 26/26 tests pass.

## v0.3.3 — 2026-11-23

### 中文

- 修复单轮调用卡的用量请求缓存：改为按「会话 + 轮次」缓存，避免复用上一轮数据导致当前轮卡片不显示。
- 保持 0.3.2 的每轮调用卡、管理/调用历史双 tab、单轮插件与工具明细。
- 25/25 测试通过。

### English

- Fixed per-turn usage request caching: cache is now keyed by session + turn, so a newly completed turn cannot reuse stale data and hide its card.
- Keeps the v0.3.2 per-turn usage card, Manage / Call history tabs, and per-turn plugin/tool detail.
- 25/25 tests pass.

## v0.3.2 — 2026-11-23

### 中文

- 每次完成的对话下方显示本轮插件调用卡：插件名称、调用次数、工具 token、费用，以及本轮模型 token/费用。
- 调用卡只展示已映射插件的调用；未映射/core 工具不计入插件调用历史。
- 对话插件面板新增顶部两个 tab：**管理** 与 **调用历史**。
- 调用历史按已完成对话倒序展示：轮次、时间、用户问题摘要、插件调用次数/token/费用。
- 点击一条历史进入单轮明细：每个插件的调用次数、token、费用，再展开到具体工具明细。
- 统计 API 新增每轮 turnDetails（会话级按需计算），并增加 pricePerMillion 与插件标题。
- 测试 25/25 通过。

### English

- Each completed turn now renders a plugin usage card below the conversation: plugin names, calls, tool tokens, cost, plus model tokens/cost for the turn.
- The card only shows mapped plugin calls; unmapped/core tools are excluded from plugin history.
- The conversation plugin panel now has two tabs: **Manage** and **Call history**.
- History lists completed turns newest-first with turn number, time, user prompt preview, calls/tokens/cost.
- Clicking a row opens per-turn detail: each plugin's calls/tokens/cost, expandable to individual tools.
- The stats API adds per-turn turnDetails for the requested session, pricePerMillion and plugin titles.
- 25/25 tests pass.

## v0.3.1 — 2026-11-23

### 中文

- 左侧栏新增 **插件作用域** 入口（sidebar.panellist），与 Plugins、Skills 等入口并列。
- 点击入口直接打开独立的 **Plugin Scope** 主面板（main key plugin-scope），不再需要进入 Settings 或 Plugins 页查找。
- 主面板复用现有管理页：插件作用域、工作区、标签列表、会话、费用配置。
- 新增可折叠侧栏的图标适配（16/18px，active 态）。
- 客户端依赖显式声明 @deepseek-ai/dsh-client-ui-layout。

### English

- Added a **Plugin Scope** entry to the left sidebar (sidebar.panellist), alongside Plugins and Skills.
- Clicking it opens the dedicated Plugin Scope main panel (main key plugin-scope) directly, without going through Settings or the Plugins page.
- The panel reuses the existing management UI: plugin scopes, workspaces, tags, sessions and cost settings.
- Added sidebar icon sizing for both expanded and collapsed rail states.
- Explicitly depends on @deepseek-ai/dsh-client-ui-layout.

## v0.3.0 — 2026-11-22

### 中文

作用域与标签管理重构。

**移除作用域模板**

- 删除「作用域模板」区域、默认模板下拉、工作区模板下拉、会话模板下拉；
- Profile 不再决定插件可见性；旧的 profile 数据保留用于兼容，但不再暴露给用户；
- 插件可见性只由三层决定：插件 scope → 工作区/会话 mode → 会话/工作区 override。

**统一下拉作用域**

- 插件行、插件详情、工作区行、会话 chip、会话表的下拉框都只有 **全局 / 按需 / 关闭**；
- 工作区 mode：全局 = 该工作区默认启用所有按需插件；按需 = 默认隐藏，由标签/手动触发；关闭 = 默认隐藏；
- 会话 mode 优先于工作区，并会保留继承来的 workspace overrides；
- 所有下拉修改后立即刷新 Gate 并同步到对话面板。

**标签列表增删改查**

- 标签不再是插件标签的派生集合，而是独立有序列表 `tagOrder`；
- 支持新建、重命名、删除、上移/下移；
- 重命名会同步迁移 `pluginTags` 和 `tagRules`；删除会从所有插件和规则中移除；
- 插件标签选择改为从管理列表勾选，显示顺序跟随标签列表；
- 标签关键词和自动匹配开关保留在每个标签行。

**兼容与限制**

- 旧的自定义 profile 工具/技能过滤不再生效；如需工具级过滤，使用会话/工作区 overrides 的 includeTools/excludeTools。
- 旧会话/工作区没有 mode 时默认 `on-demand`；首次切换会话 mode 会保留从工作区继承的 overrides。
- 费用估算、200 会话缓存、dsh-market Discover 卡片限制不变。
- npm 0.3.0 已发布（2026-11-23）。

### English

Scope and tag-management refactor.

**Scope profiles removed**

- Removed the Scope profiles section, the default-profile dropdown, workspace profile dropdown and session profile dropdown.
- Profiles no longer decide plugin visibility; legacy profile data is kept for compatibility but is not exposed.
- Visibility is now: plugin scope → workspace/session mode → session/workspace overrides.

**Unified scope dropdowns**

- Plugin rows, plugin detail, workspace rows, the session chip and the sessions table only offer **Global / On-demand / Off**.
- Workspace mode: Global = enable all on-demand plugins by default in that workspace; On-demand = hidden by default, tag/manual activation; Off = hidden by default.
- Session mode overrides workspace mode and preserves inherited workspace overrides.
- Every dropdown change reapplies the Gate and syncs the conversation panel.

**Tag list CRUD**

- Tags are now an independent ordered list (`tagOrder`) instead of a derived set of plugin tags.
- Create, rename, delete and move up/down.
- Rename migrates `pluginTags` and `tagRules`; delete removes the tag everywhere.
- Plugin tagging now selects from the managed list; display order follows the tag list.
- Per-tag keywords and auto-match switches remain.

**Compatibility and limits**

- Legacy custom profile tool/skill filters no longer apply; use session/workspace includeTools/excludeTools for tool filtering.
- Sessions/workspaces without a mode default to `on-demand`; first session mode change preserves inherited workspace overrides.
- Cost estimates, 200-session stats cache and the dsh-market Discover card limitation are unchanged.
- npm 0.3.0 is published (2026-11-23).

## v0.2.1 — 2026-11-22

### 中文

按需插件的交互简化：不再按作用域模板逐个勾选。

- 插件列表、插件详情和工作区插件弹窗移除「全部/最小/编码/…」模板复选框；
- 按需插件默认隐藏，不再因为模板包含而自动出现；
- 在对话右上角插件面板手动启用，或由标签关键词自动匹配触发；
- 修复自动匹配的一个问题：之前模板已包含插件时不会写入 session override，导致标签命中后仍不可见；
- 作用域模板继续用于工具/技能/提示词过滤，不再决定按需插件可见性；
- 插件列表的「按需」下方改为一行说明，提示启用方式。

### English

Simplified on-demand behavior: no more per-profile checkbox matrix.

- Removed the profile checkboxes from the plugin list, plugin detail and workspace plugin modal.
- On-demand plugins are hidden by default and no longer appear just because a profile includes them.
- Enable them manually in the conversation plugin panel, or let tag keywords auto-match them.
- Fixed auto-match: when a profile already included the plugin, no session override was written, so a keyword hit still left it hidden.
- Scope profiles still control tool/skill/prompt filters, but no longer decide on-demand plugin visibility.
- The plugin list now shows a short hint under “On demand” instead of profile chips.

## v0.2.0 — 2026-11-22

### 中文

这是 Plugin Scope 从「工具门控」升级为「作用域 + 用量 + 标签组」的版本。

**作用域**

- 全局 / 按需 / 关闭三种插件状态；
- 工作区级作用域：按 cwd 选择模板并配置插件列表；
- 会话级覆盖：单个对话可以单独启停按需插件；
- 解析顺序：会话显式设置 → 工作区 → 默认模板；
- 会话「恢复默认」会删除自己的覆盖，重新继承工作区。

**对话插件面板**

- 对话框右上角插件选择器；
- 支持按插件名称/说明模糊搜索；
- 全局 / 本次已启用 / 可选 / 已关闭分组，可折叠；
- 插件说明改为鼠标悬浮 tooltip，支持中英文跟随切换；
- 在对话内启用/停用按需插件，写入 session overrides；
- 显示本次对话调用次数、工具 token、模型 token，以及费用估算。

**用量与费用**

- 从 session log 折叠调用次数、工具 token、模型 usage；
- 对话面板按插件展示单插件用量；
- Scopes 插件列表增加 Calls / Tokens / 费用列；
- 工作区行显示累计调用/token/费用；
- 插件详情显示累计用量；
- 单价可在配置中修改，默认 ¥2 / 1M tokens。

**标签组与自动匹配**

- 插件可自定义标签；
- 按标签形成标签组，可配置关键词和自动开关；
- 用户消息命中关键词时，自动启用尚未启用的按需标签组插件；
- 全局开关 + 每组开关；不会自动启用 off/global 管理插件；
- 自动匹配挂在 agent/pre-step，复用 session overrides 和 Gate。

**其他**

- M4a 技能映射、Prompt section 手动映射、技能列表、隐藏技能过滤；
- 中英文界面，默认中文；
- 深色模式对比度修复；
- 插件图标重设计（透明渐变、分层、状态点）；
- 对话面板折叠箭头改为 SVG chevron。

**兼容与限制**

- 不包含 M4b / Preset 完全隔离；按需插件代码仍会加载。
- 费用为估算：输入/输出/缓存共用一个单价，不代表 provider 精确账单。
- 全部/工作区统计最多扫描最近 200 个会话，缓存 20 秒。
- dsh-market Discover 卡片没有 per-card slot；用量显示在 Scopes 列表和插件详情。
- npm 仍为 0.1.0；本版通过 GitHub Release 分发。

**升级**

```bash
dsh plugin --profile desktop add https://github.com/UserShi/dsh-plugin-scope/releases/download/v0.2.0/dsh-plugin-scope-0.2.0.tgz
```

或源码安装：

```bash
dsh plugin --profile desktop add github:UserShi/dsh-plugin-scope
```

### English

This is the release that turns Plugin Scope from a tool gate into scopes + usage + tag groups.

**Scopes**

- Global / on-demand / off plugin states;
- Workspace scopes keyed by cwd, with their own plugin list;
- Conversation overrides for individual on-demand plugins;
- Resolution order: explicit conversation → workspace → default profile;
- “Use default” removes the conversation override and re-inherits the workspace.

**Conversation plugin panel**

- Top-right conversation plugin picker;
- Fuzzy search by plugin name/description;
- Collapsible Global / Enabled / Available / Off groups;
- Plugin descriptions move to hover tooltips and follow the Chinese/English switch;
- Enable/disable on-demand plugins for the current conversation;
- Calls, tool tokens, model tokens and estimated cost for the conversation.

**Usage and cost**

- Fold session logs into calls, estimated tool tokens and model usage;
- Per-plugin usage in the conversation panel;
- Calls / Tokens / cost columns in the Scopes plugin list;
- Workspace totals and plugin-detail totals;
- Configurable token price, default ¥2 / 1M tokens.

**Tag groups and auto-match**

- Custom tags per plugin;
- Tag groups with keywords and an auto-match switch;
- When a user message contains a keyword, not-yet-enabled on-demand plugins in that group are enabled automatically;
- Global switch + per-group switch; off/global/management plugins are never auto-enabled;
- Runs at agent/pre-step, reusing session overrides and the Gate.

**Other**

- M4a skill mapping, manual prompt-section mapping, skill list and visible-skill filtering;
- Chinese/English UI, Chinese by default;
- Dark-mode contrast fixes;
- Redesigned plugin icon (transparent gradient, layers, status dot);
- SVG chevrons for collapsible groups.

**Compatibility and limits**

- M4b / full Preset isolation is not included; on-demand plugins still load.
- Costs are estimates with one blended price for input/output/cache, not provider billing.
- Total/workspace stats scan up to the latest 200 sessions with a 20-second cache.
- dsh-market Discover cards have no per-card slot; usage appears in the Scopes list and plugin detail.
- npm remains 0.1.0; this version is distributed through GitHub Releases.

**Upgrade**

```bash
dsh plugin --profile desktop add https://github.com/UserShi/dsh-plugin-scope/releases/download/v0.2.0/dsh-plugin-scope-0.2.0.tgz
```

Or from source:

```bash
dsh plugin --profile desktop add github:UserShi/dsh-plugin-scope
```

## v0.1.0 — 2026-11-19

- Initial Gate engine release: global / on-demand / off, session scopes, token estimates, dsh-market and native Plugins integration.
- Published to GitHub Release and npm as `dsh-plugin-scope@0.1.0`.
