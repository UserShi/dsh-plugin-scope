# Plugin Scope for DeepSeek Harness

> **v0.3.3 · Gate 引擎 + 作用域/用量/标签/侧栏 + 调用历史** — 全局 / 按需 / 关闭 / 工作区 / 对话级作用域，带 token/费用统计、标签组自动匹配，并与 **dsh-market** 和原生 **Plugins** 页集成。
> 设计说明：[docs/DESIGN.md](docs/DESIGN.md) · 路线图：[docs/ROADMAP.md](docs/ROADMAP.md) · 版本说明：[CHANGELOG.md](CHANGELOG.md) · 发布说明：[docs/GITHUB.md](docs/GITHUB.md)

## 它解决什么问题

DSH 的插件一装就是全局：每个插件的工具 schema 都会进入每一次请求，哪怕这次对话根本用不到它。
**Plugin Scope** 给 DSH 加一层「插件预算」：

- **全局**：所有对话常驻，例如市场、技能管理器。
- **按需**：默认隐藏；在对话中手动启用，或由标签关键词自动匹配触发；不启用就不占工具声明 token。
- **关闭**：禁用插件，不加载。
- **工作区/会话级**：用下拉框选择全局 / 按需 / 关闭，会话设置优先于工作区。

同时提供：

- 左侧栏 **插件作用域** 入口：点击直接打开独立管理页；
- 每个插件的工具数量与 token 估算；
- 与 **dsh-market / 原生 Plugins 页** 结合：插件详情显示作用域徽章，并可直接设置全局/按需/关闭；
- 映射抽屉：把工具、技能和 prompt section 归到插件下；未映射插件保持全局、不会被静默隐藏。
- 中英文界面切换，默认中文；选择保存在本地设置里。
- 对话框右上角插件选择器：显示全局插件、本次对话已启用、可选按需插件和已关闭插件，支持按名称/说明模糊搜索，并在对话内一键启停按需插件。
- 工作区级配置：每个工作目录可以选择全局 / 按需 / 关闭，并单独配置该工作区启用的插件列表；对话没有单独设置时自动继承工作区，设置过则优先使用会话配置。
- 用量统计：对话右上角插件面板显示本次对话调用次数、工具 token 估算和模型 token；插件列表、工作区、市场 scope 列表显示累计。
- 每轮结束后在对话下方显示本轮插件调用卡；插件面板提供「管理 / 调用历史」两个 tab，历史可按轮查看插件与工具明细。
- 标签列表：主动新建/重命名/删除/排序标签；给插件打标后，标签改名或删除会同步到所有已打标插件。开启自动匹配后，用户消息命中标签关键词时会自动启用对应但尚未启用的按需插件（全局开关 + 标签开关）。
- 费用估算：按可配置的「¥/1M tokens」单价，在对话面板、插件列表、工作区和插件详情中把 token 换算成费用。
- 对话面板支持分类折叠，插件说明改为鼠标悬浮提示（已知插件中英文跟随切换），减少长列表占用。

![总体架构](docs/assets/architecture.png)

## 状态

- **v0.3.3（当前）**：对话下方显示本轮插件调用；插件面板新增「管理 / 调用历史」两个 tab，支持单轮明细；按轮缓存用量请求。
- **v0.3.2**：单轮调用卡与调用历史。
- **v0.3.1**：新增左侧栏 **插件作用域** 入口，点击直达管理页。
- **v0.3.0**：删除作用域模板；工作区/会话/插件统一下拉选择全局/按需/关闭；标签列表支持增删改查、排序，改名/删除同步到已打标插件；保留用量、费用、关键词自动匹配、技能/Prompt 映射。
- **v0.2.1**：上一版（按需交互简化）。
- **M4b / Preset 完全隔离**：尚未开始。

## 安装

### GitHub 源码（当前可用）

    dsh plugin --profile desktop add github:UserShi/dsh-plugin-scope

### 本地目录（开发）

    dsh plugin --profile desktop add link:/absolute/path/to/dsh-plugin-scope

或在 **Plugins → Add plugin** 里选择本目录。

### GitHub Release（v0.3.3）

    dsh plugin --profile desktop add https://github.com/UserShi/dsh-plugin-scope/releases/download/v0.3.3/dsh-plugin-scope-0.3.3.tgz

### npm（v0.3.3）

    dsh plugin --profile desktop add dsh-plugin-scope

0.3.3 已发布到 npm。

npm 页面：https://www.npmjs.com/package/dsh-plugin-scope

## 使用

1. 点左侧栏 **插件作用域**，或打开 **Settings → Plugin Scope** / **Plugins → Scopes**。
2. 每个插件的下拉框选 **全局 / 按需 / 关闭**。
3. 在 **工作区** 行给当前目录选 **全局 / 按需 / 关闭**；按需插件默认隐藏。
4. 在对话底部 **Plugin Scope** chip 或右上角 **插件** 面板切换会话作用域，并手动启停按需插件。
5. 点插件的 **Map contributions**，勾选该插件的工具和技能，并可按需填写 prompt section 名称；未映射的插件保持全局，不节省但不会破坏会话。
6. 在 **标签列表** 新建标签、填关键词、打开自动匹配；点插件行的 **编辑标签** 从列表中选择标签。重命名/删除标签会自动同步到插件。
7. 对话右上角的插件面板和 **插件列表** 会显示调用次数/token/费用；每轮结束后对话下方显示本轮调用卡；面板的 **调用历史** 可查看单轮明细。**工作区** 行也会显示累计。
8. 在 **配置** 里调整 **Token 单价（¥/1M）**；费用只用于估算，不替代 provider 账单。

## 工作方式

1. 读取 profile 的 bundle / row 清单（通过 **dsh-plugin-manager**，不手改 YAML）。
2. 通过内置映射、插件 manifest 的 **dsh.scope** 或手动映射，知道「哪个工具/技能属于哪个插件」。
3. 在 **agent/created** 时，对 **agent.ctx** 应用 **tools.restrict** / 技能遮蔽 / prompt section 遮蔽。
4. 工具集合变化由 DSH 自动写成 **tool-addition/removal**，会话可回放、可恢复。
5. 全局开关调用 **pluginManager.setBundleEnabled/setPluginEnabled**，HMR 下即时，否则提示重启。

## 限制

- 不是安全沙箱：按需插件仍然在 Host 进程运行；v0.1/v0.2-dev 仍以**工具声明** token 节省为主。
- 技能/prompt section 的遮蔽只在有映射时生效；技能列表来自当前会话 scope，未映射插件保持全局。
- v0.2 的 **Preset 完全隔离**（M4b）尚未实现；当前按需插件仍会加载代码。
- 工具 tokens 是参数/结果 JSON 长度估算；模型 tokens 来自 provider usage（含 cacheRead）。全部/工作区用量最多扫描最近 200 个会话，缓存 20 秒。
- 费用 = tokens / 1,000,000 × 单价；默认 ¥2/1M，输入/输出/缓存使用同一单价，只是估算，不是 provider 精确账单。
- 自动匹配只启用 **on-demand** 插件，且需要全局开关 + 标签组开关 + 关键词命中；不会启用 off/global 插件。
- dsh-market Discover 卡片没有公开的 per-card slot；累计用量显示在 Scopes 插件列表、工作区和插件详情，不在 Discover 卡片内。
- 不会直接编辑 **cordis.patch.yml**；全局变更全部走 **pluginManager**。
- 对话作用域选择保存在插件自己的 JSON 中；工具/prompt 变化由 DSH 写入 session log。
- 管理插件（本插件、dsh-market、核心包）只能保持全局。

## 开发

    npm test
    npm run check
    npm run pack

仓库当前是纯 ESM JavaScript，无构建步骤；lib/index.js 是 Host 半，lib/client.js 是浏览器半。

## License

MIT
