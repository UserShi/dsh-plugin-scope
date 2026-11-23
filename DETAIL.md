# Plugin Scope — 详细实现与运维

本文是 [README.zh.md](README.zh.md) 和 [docs/IMPLEMENTATION.md](IMPLEMENTATION.md) 的展开版，面向排查和二次开发。

## 1. 它解决什么问题

DSH 插件默认在 profile 级加载，工具 schema、技能和 Prompt section 会进入每次请求。Plugin Scope 做两件事：

1. **声明级节省（Gate）**：插件仍加载，但把未选中插件的工具/技能/Prompt 从当前 Agent 移除。
2. **使用统计**：按会话、插件、工作区、单轮聚合调用次数、工具 token、模型 usage 和费用。

> 当前默认是 Gate，不是完全隔离。M4b / Preset Engine 仍待 DSH Host 支持。

## 2. 作用域语义

### 2.1 三层结构

- 插件 scope：`global` / `on-demand` / `off`
- 工作区 mode：`global` / `on-demand` / `off`
- 会话 mode：`global` / `on-demand` / `off`

解析优先级：

```text
插件 off
  > 插件 global
  > 显式 remove
  > 显式 add
  > 会话 mode
  > 工作区 mode
```

- `on-demand` 默认隐藏；
- 显式 `add`（对话按钮、工作区插件列表、标签自动匹配）可见；
- 显式 `remove` 隐藏；
- `global` mode 让所有未 remove 的按需插件可见；
- `off` mode 只是默认关闭，显式 add 仍可覆盖。

### 2.2 继承

- 会话没有记录 → 使用 cwd 对应工作区；
- 工作区没有配置 → 使用 on-demand 默认；
- 会话有记录 → 会话 mode + overrides 优先；
- 恢复默认 = 删除会话记录，重新继承工作区。

## 3. 数据流

### 3.1 Gate

1. `buildState` 读取 inventory 和 state；
2. `resolveSessionScope` 计算 mode/overrides；
3. `resolveVisibility` 判断每个插件；
4. `collectDeniedTools / collectHiddenSkills / collectHiddenSections` 汇总要隐藏的贡献；
5. `applyGate` 调 `agent.ctx.tools.restrict({ deny })`，并用空文本 stub 遮蔽技能/section；
6. agent 销毁时 dispose gate。

### 3.2 标签自动匹配

1. `state.pluginTags`：插件 → 标签；
2. `state.tagRules`：标签 → 关键词/开关；
3. `state.tagOrder`：标签列表顺序；
4. 用户消息进入 `agent/pre-step`；
5. `matchTags` 命中后，把对应 on-demand 插件写入 session `overrides.add`；
6. 立即 `applyGate`。

### 3.3 用量

- 读 session events（`sessionQuery.readSession`）；
- `foldSessionStats` 统计全会话；
- `foldSessionTurns` 按 `data.turn` 分轮；
- `attributeStats` 通过 contribution 把工具归到插件；
- `buildStats` 为请求的会话返回 `turnDetails`；
- 客户端按 `pricePerMillion` 换算费用。

统计口径：

- 调用次数 = `tool/call` + `tool/ptc-dispatch`；
- 工具 token = 参数字符串/结果消息 JSON 长度 / 4；
- 模型 token = provider usage，含 cacheRead；
- 费用 = token / 1,000,000 × 单价；
- 单轮历史只展示已映射插件调用。

## 4. 状态文件

`~/.dsh/profiles/<profile>/.dsh-plugin-scope/state.json`

主要字段：

```json
{
  "version": 1,
  "settings": {
    "mode": "gate",
    "language": "zh",
    "pricePerMillion": 2,
    "autoMatchTags": false
  },
  "plugins": {
    "dsh-ai-diagrams": {
      "scope": "on-demand",
      "contribution": {
        "tools": ["diagram_save"],
        "skills": ["diagram-design"],
        "sections": []
      },
      "mappedBy": "manual"
    }
  },
  "workspaces": {},
  "sessions": {},
  "pluginTags": {},
  "tagRules": {},
  "tagOrder": []
}
```

旧 `profiles` / `profileId` 字段保留用于兼容，但不再影响可见性。

## 5. HTTP API

前缀：`/api/dsh-plugin-scope`

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/state` | inventory、scope、mode、mapping diagnostics、估算 |
| GET | `/stats?session=` | 会话/插件/工作区/全部累计 + `turnDetails` |
| GET | `/tools?session=` | 当前会话工具 |
| GET | `/skills?session=` | 当前会话技能（含 provider/source） |
| GET | `/gates` | Gate 诊断 |
| POST | `/plugin` | `{name, scope, profiles?}` |
| POST | `/session` | `{sessionId, mode, overrides?}` |
| POST | `/session/plugin` | `{sessionId, name, enabled}` |
| POST | `/session/reset` | `{sessionId}` |
| POST | `/workspace` | `{cwd, profileId, mode, overrides?}` |
| POST | `/workspace/delete` | `{cwd}` |
| POST | `/tags` | `{name, tags}` |
| POST | `/tag` | `{action: create/rename/delete/move}` |
| POST | `/tag-rule` | `{tag, keywords, enabled}` |
| POST | `/auto-match` | `{sessionId, text}` 诊断 |
| POST | `/mapping` | `{name, contribution}` |

## 6. 映射诊断

`/state` 的每个插件带 `mappingDiagnostics`：

```json
{
  "staleTools": [],
  "staleSkills": [],
  "duplicateTools": [],
  "duplicateSkills": [],
  "protectedSections": []
}
```

含义：

- stale：映射里的工具/技能已不存在；
- duplicate：同一工具/技能被多个插件声明；
- protected：映射了 `harness:identity` 等受保护 section。

UI 在插件行和映射弹窗显示警告；只提示，不自动删除映射。

## 7. 侧栏与主面板

- `sidebar.panellist` id `plugin-scope`
- `main` key `plugin-scope`
- 点击侧栏入口调用 layout 选中主面板
- 主面板复用 `ScopePage`

## 8. 排查

### 插件没生效

1. 看 `GET /gates` 是否有 gate；
2. 看 `/state` 的 `visible/visibilityReason`；
3. 受保护插件只能 global；
4. 映射为空时 Gate 无法移除工具，补映射。

### 按需插件不显示

- 当前 mode 是否 on-demand/off；
- 是否有 `remove` override；
- 标签组是否启用、关键词是否命中；
- 对话面板手动启用。

### 调用卡/历史为空

- 只显示已映射插件的调用；
- 只显示 `status=closed` 的轮次；
- core 工具（run_code/bash）不算插件调用；
- 刷新页面；必要时 `/stats?refresh=1`。

### 侧栏入口不显示

- 插件版本是否含 `sidebar.panellist` 注册；
- 重启 DSH 让 client 重新注入；
- 检查浏览器 console 的 slot registration 警告。

## 9. 测试

```bash
npm test
npm run check
npm pack --dry-run
```

当前：26 个纯函数测试。

## 10. M4b 阻塞说明

M4b 的目标是「未选中插件完全不加载」。当前 DSH 的 profile bundles 在 **profile root** 加载；`agentPresets` 只能组合 Agent 子图，不能卸载 root 已经加载的 bundle。插件侧无法安全实现 per-session 零加载，需 DSH Host 提供：

- profile bundle → preset row 的按会话组合；或
- pluginManager 的 per-agent bundle 加载。

在此之前，Plugin Scope 保持 Gate 模式；强行注册 synthetic preset 可能造成重复服务/泄漏，不建议。
