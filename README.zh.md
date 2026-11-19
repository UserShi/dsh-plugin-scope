# Plugin Scope for DeepSeek Harness

> **v0.2.0-dev · Gate 引擎 + M4a 技能/Prompt 映射** — 全局 / 按需 / 关闭 / 对话级作用域，带 token 估算，并与 **dsh-market** 和原生 **Plugins** 页集成。
> 设计说明：[docs/DESIGN.md](docs/DESIGN.md) · 路线图：[docs/ROADMAP.md](docs/ROADMAP.md) · 发布说明：[docs/GITHUB.md](docs/GITHUB.md)

## 它解决什么问题

DSH 的插件一装就是全局：每个插件的工具 schema 都会进入每一次请求，哪怕这次对话根本用不到它。
**Plugin Scope** 给 DSH 加一层「插件预算」：

- **全局**：所有对话常驻，例如市场、技能管理器。
- **按需**：只在选了它的对话/模板里出现；不选就不占工具声明 token。
- **关闭**：从 profile 禁用，彻底不加载。
- **对话级**：在会话 chip 里切换本次对话的作用域。

同时提供：

- 作用域模板（All / Minimal / Coding / 自定义）；
- 每个插件的工具数量与 token 估算；
- 与 **dsh-market / 原生 Plugins 页** 结合：插件详情显示作用域徽章，并可直接设置全局/按需/关闭；
- 映射抽屉：把工具、技能和 prompt section 归到插件下；未映射插件保持全局、不会被静默隐藏。
- 中英文界面切换，默认中文；选择保存在 profile 设置里。
- 对话框右上角插件选择器：显示全局插件、本次对话已启用、可选按需插件和已关闭插件，支持按名称/说明模糊搜索，并在对话内一键启停按需插件。
- 工作区级配置：每个工作目录可以选择一个作用域模板；对话没有单独设置时自动继承工作区，设置过则优先使用会话配置。

![总体架构](docs/assets/architecture.png)

## 状态

- **v0.1.0**：已发布到 GitHub Release 与 npm（Gate 引擎、全局开关、市场集成）。
- **main / v0.2.0-dev**：M4a 已完成——技能映射、prompt section 手动映射、映射弹窗技能列表、只对实际可见技能做遮蔽、中英文切换（默认中文），以及深色模式修复。
- **M4b / Preset 完全隔离**：尚未开始。

## 安装

### GitHub 源码（当前可用）

    dsh plugin --profile desktop add github:UserShi/dsh-plugin-scope

### 本地目录（开发）

    dsh plugin --profile desktop add link:/absolute/path/to/dsh-plugin-scope

或在 **Plugins → Add plugin** 里选择本目录。

### GitHub Release（v0.1.0）

    dsh plugin --profile desktop add https://github.com/UserShi/dsh-plugin-scope/releases/download/v0.1.0/dsh-plugin-scope-0.1.0.tgz

### npm（已发布）

    dsh plugin --profile desktop add dsh-plugin-scope

npm 页面：https://www.npmjs.com/package/dsh-plugin-scope

## 使用

1. 打开 **Settings → Plugin Scope**，或 **Plugins → Scopes**。
2. 每个插件选 **全局 / 按需 / 关闭**。
3. 在 **作用域模板** 里把按需插件加入 Coding / Minimal 等模板；在 **工作区** 里给当前工作目录选择模板。
4. 在对话底部输入框上方用 **Plugin Scope** chip 切换当前对话的模板；也可以点对话框右上角的 **插件** 按钮，搜索并勾选本次对话要启用的按需插件。
5. 点插件的 **Map contributions**，勾选该插件的工具和技能，并可按需填写 prompt section 名称；未映射的插件保持全局，不节省但不会破坏会话。

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
