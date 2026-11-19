# Roadmap

> 关联设计：[docs/DESIGN.md](DESIGN.md)  
> 版本目标：v0.1 = Gate Engine + 全局开关 + 市场展示；v0.2 = 技能/prompt 门控 + Preset 隔离。  
> 当前：**v0.1.0 已发布**；main 为 **v0.2.0-dev**，M4a 已完成，M4b 未开始。

---

## M0 — 设计（当前）

**产出**

- [x] `docs/DESIGN.md`
- [x] 架构图（HTML/PNG）
- [x] 仓库骨架与发布说明
- [ ] 用户确认核心语义 / 仓库授权

**退出标准**

- 确认 v0.1 先做 Gate（门控）而不是 Preset（完全隔离）。
- 确认仓库名、可见性、License、是否 npm 发布。
- 确认 GitHub 推送方式（SSH 或 PAT）。

---

## M1 — 可安装的行走骨架

**目标**：能在真实 profile 里安装、看到、卸载；不改变任何行为。

**Host**

- `apply(ctx, config)`，`Config` schema（mode/defaultProfileId/…）。
- 状态文件：`<profile>/.dsh-plugin-scope/state.json`，原子写、schema 校验、备份。
- Inventory：`pluginManager.listBundles()` + `listPlugins()`，归一化成 `PluginRecord`。
- HTTP：`GET /api/dsh-plugin-scope/state`、`GET /diagnostics`。
- 受保护插件列表。

**Client**

- Scope Manager 页面（`sidebar.panellist`）：只读表格（插件、状态、工具数、映射状态）。
- 入口注册、locale（zh/en）、icon。
- 错误/空/加载状态。

**验收**

- 安装到 desktop profile 后，Plugins 页出现 bundle，侧边栏出现入口。
- 页面列出当前 4 个已安装 bundle + 内置 plugin rows。
- 不产生任何工具/提示词变更；`GET /state` 返回稳定 JSON。
- 卸载后无残留（除用户数据目录，可手动清理）。

---

## M2 — Gate Engine + 会话 chip

**目标**：真正省工具 token；单对话筛选可用。

**Host**

- ContributionMap：
  - 内置官方工具映射表（bash/fs/web/office/diagram/...）。
  - 读取 `package.json.dsh.scope`（如果存在）。
  - 手动映射的读写 API。
  - heuristic 建议（不自动应用）。
- Resolver：global / on-demand / off / session / 工具级 include/exclude。
- GateEngine：
  - `agent/created` 应用默认/已存作用域。
  - `agent.ctx.tools.restrict({deny})`；校验未知工具名。
  - 旧 restriction 的 dispose；agent 销毁清理。
  - 失败 fail-open + 诊断。
- Session API：`POST /session/:id/scope`。
- TokenEstimator：`ctx.tools.schemas(scope)` + JSON 长度 / 4。

**Client**

- 会话 chip（`conversation.session.header.utilities`）：
  - 当前模板 / 自定义；
  - 勾选按需插件；
  - token 估算；
  - 应用 / 管理链接。
- Scope Manager 表格可编辑作用域（Global/On-demand/Off）。
- 映射抽屉：把工具拖到插件；显示映射来源。

**验收**

- 两个会话 A/B，A 排除 diagram，B 保留。
- A 的下一轮 tool declarations 不含 diagram 工具；session log 有 `tool-removal`。
- 切回后 `tool-addition` 出现。
- 刷新/重启/恢复后作用域保持。
- 未知工具名不会导致 agent 失败。
- token 估算显示相对下降。

---

## M3 — 全局开关 + 市场集成

**目标**：全局/按需/关闭三种状态都能从 UI 和市场页操作。

**Host**

- GlobalEngine：
  - `setBundleEnabled` / `setPluginEnabled`。
  - 尊重 `readOnlyReason` / 受保护列表。
  - `ChangeResult.application` 原样返回；不把 saved 说成 applied。
  - HMR 不可用时提示 restart-required。
- 库存刷新：全局变更后重新读取；live agent 的 deny 集合重算。
- Orphan/冲突：市场 preset 禁用、包被移除、重新安装。

**Client**

- 原生 Plugins 页：
  - `plugins.detail.badge`：Global/On-demand/Off/Unmapped。
  - `plugins.detail.actions`：Scope 按钮。
  - `plugins.detail.section`：作用域 radio + 模板多选 + 应用。
- `plugins.tab` 与 `settings.plugins.tab`：Scopes 页，和 dsh-market 的 Discover tab 并列。
- 全局开关的确认/错误/重启提示。

**验收**

- 在插件详情页切 Off：pluginManager 返回 applied/restart-required；市场与 Plugins 页状态一致。
- 受保护插件开关禁用并显示原因。
- 市场安装新插件后，Scopes 页出现该插件；未映射标记正确。
- 市场卸载后 orphan 标记；重装后恢复作用域。

---

## M4 — 技能/prompt 门控 + Preset 隔离（v0.2）

**目标**：从「省工具 token」升级到「省技能/prompt token」和「完全不加载」。

**M4a 技能/prompt 门控（已完成，v0.2.0-dev）**

- [x] 技能 stub 遮蔽：只对当前 scope 实际可见的技能做遮蔽，避免伪造未安装技能。
- [x] `GET /api/dsh-plugin-scope/skills`：按会话 scope 返回技能列表。
- [x] 映射弹窗新增 **Skills** 勾选和 **Prompt sections** 手动输入。
- [x] 中英文切换（默认中文），内置模板名/描述/计数本地化，选择持久化到 settings.language。
- [x] prompt section 空文本遮蔽：与工具/技能共用 contribution。
- [x] 映射保存后重新应用 gate；技能列表 5 秒缓存。
- [x] 深色模式修复：改用 `--dsw-alias-bg-layer-1`、`--dsw-alias-border-l2`、`--dsw-alias-label-*` 等真实 token。
- [x] 会话对象新增 `gatedSkills` / `gatedSections` 计数；`GET /gates` 诊断。
- [ ] 冲突检测：同名本地技能、受保护 section。
- [ ] 映射过期检测。
- [ ] 技能列表的 provider/source 过滤 UI（当前全部可见技能都可映射）。

**M4b Preset Engine（未开始）**

- [ ] `presetSafe` 白名单。
- [ ] 从基础 preset / bundle patch 解析 rows。
- [ ] `agentPresets.register` / `select`；scope preset 的启动重建。
- [ ] 空白会话选择；已开始会话锁定提示。
- [ ] 失败/泄漏诊断；回退到 Gate。

**验收**

- 选中 preset 的会话只挂载所需插件；未选中插件零加载（通过 inventory/日志验证）。
- 恢复/fork 正常；子代理继承。
- 挂载失败不影响其他会话；UI 显示 broken 原因。
- 技能从模型目录消失；prompt section 不渲染。

---

## M5 — 发布

- README 截图/GIF、DETAIL.md、示例。
- CI（typecheck/test/build/pack）、Release 工作流。
- GitHub Release `.tgz`；可选 npm。
- 发布后回归：全新 profile 安装 → 首次配置 → 两会话验证。
- 文档：安装、快速开始、作用域语义、限制、FAQ、故障排查。

---

## 优先级 / 依赖

```text
M0 ──▶ M1 ──▶ M2 ──▶ M3 ──▶ M5
                 └──▶ M4a ──▶ M4b ──▶ M5
```

- M2 依赖 M1 的 inventory/state。
- M3 可与 M2 并行（共享 inventory，但写不同文件/不同 UI 区域）。
- M4a 依赖 M2 的映射。
- M4b 依赖 M3 的全局状态（要确保插件不被 Host 双重加载）。

---

## 风险缓冲

- 每个里程碑结束都做一次真实 profile 回归；不为赶进度跳过。
- M2 如果映射覆盖率太低，先把「手动映射 + 官方表」做扎实，再谈自动化。
- M4b 如果 preset 兼容性太差，降级为「实验特性」，默认关闭。
