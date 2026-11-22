# Changelog

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
