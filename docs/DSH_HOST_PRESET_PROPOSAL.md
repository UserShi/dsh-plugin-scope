# DSH Host 变更提案：Profile-bundle / Preset 能力

状态：**Proposal / 阻塞**
目标版本：DSH Host（当前本地 0.2.2-rc.5）
关联：[M4b Preset Engine](ROADMAP.md#m4b-preset-engine阻塞未开始)

## 1. 为什么 Plugin Scope 自己做不了

当前 DSH 启动顺序：

```text
profile package.json
  dsh.profile.bundles
        │
        ▼
profile root loader
  ├─ @deepseek-ai/dsh-base
  ├─ @deepseek-ai/dsh-web-app
  ├─ dsh-ai-diagrams          ← 整个 bundle 在 root 加载
  ├─ browser-skill
  └─ dsh-plugin-scope
        │
        ▼
Agent
  └─ agentPresets.select(preset)
        └─ preset child composition
```

`agentPresets` 只能组合 **Agent 子图**；profile bundle 已经在 root 加载。
`pluginManager.setBundleEnabled()` 是 **profile 全局**操作，无法只对某个会话生效。

因此插件侧无法实现：

- 未选中插件零加载；
- 同一 profile 不同会话挂载不同 bundle；
- 按会话恢复/切换 preset。

强行在插件里注册 synthetic preset，只会重复挂载 root 已加载的 row，触发 service 泄漏/冲突。

## 2. 建议的 Host API

### 2.1 bundle 声明 preset 支持

在插件 package.json 增加：

```json
{
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml",
      "presetSafe": true,
      "presetRows": ["./cordis.patch.yml"]
    }
  }
}
```

- `presetSafe`：允许该 bundle 从 root 移到 preset；
- `presetRows`：可选的 rows 来源，缺省读取 bundle patch 的 insert 行。

### 2.2 Profile 加载策略

新增 profile 设置：

```json
{
  "dsh": {
    "profile": {
      "presetBundles": ["dsh-ai-diagrams", "browser-skill"]
    }
  }
}
```

Host 启动时：

1. 对 `presetBundles` 中的 bundle **不插入 profile root**；
2. 读取其 patch rows；
3. 把 rows 暴露给 `agentPresets`；
4. 未列入的 bundle 保持当前 root 行为。

### 2.3 AgentPreset Registry

新增（或扩展）：

```ts
interface ProfilePresetSource {
  /** Rows parsed from profile-level bundle patches, not mounted at root. */
  profileRows(): Promise<EntryOptions[]>
}

// 注册:
await ctx.agentPresets.register({
  id: 'scope:workspace:/path',
  name: 'Scope — /path',
  plugins: [...baseRows, ...selectedProfileRows],
})
```

`register` 必须保证：

- 只挂载一次；
- 不重复 root rows；
- 失败时保留 broken 诊断，不阻止其他 preset；
- unregister 清理子作用域。

### 2.4 会话生命周期

- 新建空白会话：在首轮前 `select(presetId)`；
- 已开始会话：锁定，返回 `agent-preset/locked`；
- resume/fork：沿用记录；
- 子代理：继承父 preset；
- preset 定义丢失：回退默认 preset，并显示原因。

### 2.5 Gate 兼容

- 如果 Host 不支持某个 bundle 的 preset 化，Plugin Scope 保持 Gate；
- 一个会话要么 preset、要么 Gate，不能同时对同一插件双挂；
- 诊断 API 必须暴露 `mode: gate|preset` 和 broken rows。

## 3. 验收

1. profile 中两个 preset-safe bundle 不在 root inventory；
2. 选中 preset 的 Agent 能看到其工具；未选中 Agent 看不到且进程无该 row；
3. 两个会话使用不同 preset 时互不泄漏；
4. resume/fork/子代理一致；
5. broken preset 不影响其他 Agent；
6. Gate 回退可用；
7. 卸载/重装插件后 preset 行恢复。

## 4. 可选的最小版本

先只支持：

- `presetSafe: true` 的 **host-only** bundle；
- 固定 preset（不做运行时编辑）；
- 仅新会话；
- 不支持的 bundle 继续走 Gate。

这已足够让 Plugin Scope 的 on-demand 工具插件从「声明级节省」进入「零加载」，同时不碰 UI/client bundle。

## 5. 当前结论

在 Host 提供上述能力前，M4b 不应在 Plugin Scope 内部伪造实现。
