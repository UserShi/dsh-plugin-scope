# 改造待办（Backlog）

更新时间：2026-11-23  
当前版本：**0.4.4**  
关联：[ROADMAP](ROADMAP.md) · [M4b 实现](../DETAIL.md) · [Host 提案](DSH_HOST_PRESET_PROPOSAL.md)

本文件登记「当前无法安全完成、需要上游/架构改造」的 M4b 剩余项。已能改造的项会在代码中完成，不登记在这里。

## 状态说明

- **Can modify now**：Plugin Scope 内可完成。
- **Blocked (Host)**：需要修改 DSH Host。
- **Blocked (Upstream)**：需要 DSH 上游发布/合并。
- **Partial**：插件内可做一部分，但无法达到验收。

---

## M4B-TODO-01：client-half bundle 的 UI 保留

**状态：Blocked (Host)**  
**能否现在改造：不能**

### 问题

preset bundle 从 profile root 移出后，Host 侧工具可以挂载，但包内 `dsh.client` 的客户端 half 可能：
- 不加载；
- 或加载后找不到 root 侧的 client registry。

当前只能警告：

```
preset bundle has a client half; its UI may need a root mount: <name>
```

### 需要 Host 提供

- 允许 bundle 的 **host half 进 preset、client half 保持 root**；
- 或 client module loader 支持按 preset 注册/卸载；
- 或 bundle 声明可拆分的 `presetHostPatch` / `presetClientPatch`。

### 验收

- 带 client half 的 bundle 进入 preset 后，工具可用且 UI 正常；
- 不出现重复 client 注册；
- 退出/切换 preset 后 client 资源释放。

---

## M4B-TODO-02：Host `presetBundles` 补丁合入上游

**状态：Blocked (Upstream)**  
**能否现在改造：不能**

### 当前

- 本地补丁：[host-patch/app-boot-preset-bundles.patch](host-patch/app-boot-preset-bundles.patch)
- 只在本地解包运行时验证；标准 DSH 安装包没有该能力。

### 需要

1. DSH 上游接受 `dsh.profile.presetBundles`；
2. 发布包含该能力的 Host 版本；
3. Plugin Scope 检测 Host 版本/能力，而不是仅尝试挂载。

### 验收

- 官方 DSH 安装包直接支持 profile presetBundles；
- 插件不需要本地 patch；
- 升级/回滚兼容。

---

## M4B-TODO-03：多子集进程级单加载

**状态：Partial / Blocked (Lifecycle)**  
**能否现在改造：部分可做，但不建议现在做**

### 当前

- 每个使用中的 workspace/session 子集会注册一个 preset；
- 多个子集并发时，注册过的 preset 代码会各自挂载；
- 会话可见工具正确，但不是「进程内只加载一个子集」。

### 可做方案

- 给每个 preset 记账使用中的 Agent；
- 无 Agent 使用时调用 `register` 返回的 disposer 卸载；
- 切换子集后回收旧 preset；
- 需要处理 registry generation、恢复/fork、并发创建。

### 验收

- 同一时刻只有一个 active subset 的插件代码；
- 切换后旧插件 fiber 释放；
- 无 service leak；
- 恢复/fork 不丢工具。

---

## M4B-TODO-04：全量池失败自动回退 Gate

**状态：Blocked (Host)**  
**能否现在改造：不能**

### 当前

- 子集注册失败会回退到全量池；
- 全量池也失败时只写诊断/日志；
- Host 已经把 bundle 跳过 root 加载，无法在运行时补回；
- 用户需在 UI 清空 preset 并重启。

### 需要 Host 提供

- Host 启动时先尝试 preset 消费者，失败再 root 挂载；或
- 提供运行时 `loadProfileBundleAtRoot(name)` 的恢复 API；
- 或 boot 阶段 fallback 策略。

### 验收

- 全量池 preset 注册失败时，插件工具仍可用；
- 状态显示 fallback 原因；
- 不产生重复服务。

---

## M4B-TODO-05：会话级自定义子集 UI

**状态：Can modify now / 未排期**  
**能否现在改造：可以**

### 当前

- 工作区弹窗支持多选子集；
- 会话表格下拉只支持：跟随 / 不使用 / 全部；
- 自定义子集只能通过 API `POST /session/migrate`。

### 方案

- 复用工作区多选弹窗；
- 会话级保存 `presetBundles` 数组；
- 保存后对开始会话走 migrate。

### 验收

- UI 可以选择任意会话子集；
- 已开始会话确认后迁移；
- 状态显示 custom。

---

## M4B-TODO-06：会话迁移的更多边界测试

**状态：Partial**  
**能否现在改造：可以继续补测试**

### 当前

已实现并通过一个从磁盘恢复的已开始会话迁移：

```text
before: 40 tools, no diagram
after:  47 tools, 7 diagram
preset: scope:profile
```

仍需覆盖：

- 打开 turn 时拒绝迁移（`turn-open`）；
- 子代理会话；
- fork/resume；
- 迁移中途失败回滚；
- 迁移后历史工具卡/统计一致性。

---

## 处理顺序建议

1. M4B-TODO-02：Host 上游合入（阻塞面最大）；
2. M4B-TODO-01：client-half 拆分；
3. M4B-TODO-04：Host fallback；
4. M4B-TODO-03：preset 生命周期回收；
5. M4B-TODO-05 / 06：插件侧收尾。
