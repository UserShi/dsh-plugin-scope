# Roadmap

> 关联设计：[docs/DESIGN.md](DESIGN.md)  
> 版本目标：v0.1 = Gate Engine + 全局开关 + 市场展示；v0.2 = 技能/prompt 门控 + Preset 隔离。  
> 阶段验证：[docs/VALIDATION.md](VALIDATION.md)  
> 当前：**v0.4.2 已发布**（映射诊断 + 文档收尾）；M4a/M4c/M4d 已完成，M4b / Preset 完全隔离因 DSH profile-level bundle 加载而阻塞。

---

## M0 — 设计（当前）

**产出**

- [x] `docs/DESIGN.md`
- [x] 架构图（HTML/PNG）
- [x] 仓库骨架与发布说明
- [x] 用户确认核心语义 / 仓库授权（public 仓库、SSH、GitHub Release、npm 均已授权并发布）

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

**M4a 技能/prompt 门控（已完成，v0.2.0）**

- [x] 技能 stub 遮蔽：只对当前 scope 实际可见的技能做遮蔽，避免伪造未安装技能。
- [x] `GET /api/dsh-plugin-scope/skills`：按会话 scope 返回技能列表。
- [x] 映射弹窗新增 **Skills** 勾选和 **Prompt sections** 手动输入。
- [x] 中英文切换（默认中文），内置模板名/描述/计数本地化，选择持久化到 settings.language。
- [x] 对话框右上角插件选择器：全局/已启用/可选/关闭分组，名称+说明模糊搜索，按需插件在对话内启停。
- [x] 工作区级 scope：按 cwd 选择模板并配置工作区插件列表；无会话覆盖时继承工作区，会话覆盖优先，可恢复默认。
- [x] prompt section 空文本遮蔽：与工具/技能共用 contribution。
- [x] 映射保存后重新应用 gate；技能列表 5 秒缓存。
- [x] 深色模式修复：改用 `--dsw-alias-bg-layer-1`、`--dsw-alias-border-l2`、`--dsw-alias-label-*` 等真实 token。
- [x] 会话对象新增 `gatedSkills` / `gatedSections` 计数；`GET /gates` 诊断。
- [x] 冲突检测：同名本地技能、受保护 section（实现为 mappingDiagnostics 警告，不自动删除映射）。
- [x] 映射过期检测：工具/技能已不存在时标记 staleTools/staleSkills。
- [x] 技能列表的 provider/source 过滤 UI。

**M4c 用量统计 + 标签组（已完成，v0.2.0）**

- [x] `lib/stats.js`：从 session log 折叠调用次数、工具 token 估算、模型 usage；支持 `tool/call`、`tool/result`、`tool/ptc-dispatch`。
- [x] `GET /stats?session=`：当前会话、按插件、按工作区、全部会话累计。
- [x] 对话右上角插件面板显示本次调用/工具 tokens/模型 tokens；插件行显示单插件用量。
- [x] Scopes 插件列表增加调用/Token 列；工作区行显示累计。
- [x] 插件自定义标签；标签组界面按组配置关键词和自动开关。
- [x] `agent/pre-step` 关键词匹配：自动启用未启用的按需标签组插件，复用 session overrides 和 Gate。
- [x] 全局 `settings.autoMatchTags` 开关 + 每组自动开关。
- [x] 中英文文案、测试和 API 文档。
- [x] 对话插件面板分类折叠；说明改为 hover title，减少纵向占用。
- [x] 费用估算：settings.pricePerMillion（默认 ¥2/1M），在对话、插件列表、工作区、插件详情追加费用。
- [x] 插件作用域图标重新设计（透明渐变 + 分层 + 状态点）。
- [x] 分组折叠箭头改为可读的 SVG chevron，字号与分组标题协调。
- [x] 插件标题 hover 自定义 tooltip；已知插件说明中英文跟随切换，未知插件回退 manifest 描述。
- [x] 按需插件默认隐藏，移除插件列表/详情/工作区的模板复选框；由对话手动启用或标签自动匹配触发（v0.2.1）。

**M4d 作用域简化 + 标签列表管理（已完成，v0.3.0）**

- [x] 删除作用域模板区域与所有 profile 下拉。
- [x] 插件、工作区、会话下拉统一为「全局 / 按需 / 关闭」。
- [x] 工作区/会话 mode：global 启用按需插件、on-demand 标签/手动、off 默认隐藏。
- [x] 标签独立有序列表 tagOrder，支持新建/重命名/删除/上下移。
- [x] 重命名同步 pluginTags / tagRules；删除从所有插件移除。
- [x] 插件打标改为从标签列表勾选，显示顺序跟随列表。
- [x] 24/24 测试通过。
- [x] 左侧栏 sidebar.panellist 入口 + 独立 main panel（plugin-scope）（v0.3.1）。
- [x] 每一轮完成后在对话下方显示插件调用卡（conversation.chat.turnTail）（v0.3.2）。
- [x] 对话插件面板「管理 / 调用历史」双 tab；历史列表 + 单轮插件/工具明细。
- [x] 统计 API 增加 turnDetails、pricePerMillion 与插件标题；25/25 测试通过。
- [x] 单轮用量按会话+轮次缓存，避免新轮次复用旧数据（v0.3.3）。

**M4b Preset Engine（Host 后端完成，实验性）**

> DSH Host 需要应用 [presetBundles 补丁](host-patch/app-boot-preset-bundles.patch)：把 profile bundle 从 root 移入 `presetLayers`。Plugin Scope 读取 `dsh.profile.presetBundles`，用基础 preset + bundle patch rows 注册 `scope:profile`，并在新会话选择。
>
> 已隔离运行时验证：root 中 `dsh-ai-diagrams` row `enabled=false`，预设会话 47 个工具含 `diagram_*`。详见 [DETAIL.md](../DETAIL.md#10-m4b-阻塞说明) 与 [Host 提案](DSH_HOST_PRESET_PROPOSAL.md)。

- [x] `presetSafe` 白名单：profile `presetBundles` 显式 opt-in；client bundle 只警告不阻断（实验性）。
- [x] 从基础 preset / bundle patch 解析 rows。
- [x] `agentPresets.register` / `select`；scope preset 的启动重建。
- [x] 空白会话选择；已开始会话保持原 preset（锁定由 registry 保证）。
- [x] 失败诊断：`diagnostics.presetIsolation` 暴露 enabled/registered/error/bundles；子集注册失败自动回退全量池。
- [x] per-workspace / per-session preset 子集：workspace 多选、session 跟随/关闭/全部，自定义子集走 API。
- [x] M4b 配置 UI：profile `presetBundles` 勾选/保存、Host 状态、client half 警告；broken 原因显示在状态行。
- [x] 懒注册 + 并发 guard：按需注册子集 preset，避免重复 ID/重复服务。
- [ ] 已开始会话迁移到 preset。
- [ ] 客户端 half bundle 的 UI 保留策略。

**验收**

- 选中 preset 的会话只挂载所需插件；未选中插件零加载（通过 inventory/日志验证）。
- 恢复/fork 正常；子代理继承。
- 挂载失败不影响其他会话；UI 显示 broken 原因。
- 技能从模型目录消失；prompt section 不渲染。

---

## M5 — 发布

- [x] README 截图（docs/assets/plugin-scope-page.png；GIF 可选，未制作）。
- [x] `DETAIL.md`：实现、状态、API、排查、M4b 阻塞说明。
- [x] 示例：[examples/README.md](../examples/README.md)。
- [x] CI（test/check/pack，Node 20/22/24）。
- [x] Release 工作流。
- [x] GitHub Release `.tgz`。
- [x] npm 发布（当前 0.4.2）。
- [x] 发布后回归：全新 web profile + npm 0.4.2 安装 + API 200 + UI 侧栏/管理页验证（桌面 profile 迁移另测）。
- [x] 文档：安装、快速开始、作用域语义、限制。
- [x] FAQ / 故障排查：README + DETAIL。

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
