# 里程碑验证（v0.4.1）

验证时间：2026-11-23  
插件版本：**0.4.1**  
DSH：0.2.2-rc.5（桌面 + 隔离 Host 运行时）

## 总览

| 里程碑 | 状态 | 说明 |
|---|---|---|
| M0 仓库 / 发布授权 | ✅ | public 仓库、GitHub Release、npm 均可用 |
| M1 Gate Engine | ✅ | 工具/技能/Prompt gate、全局/按需/关闭 |
| M2 作用域 | ✅ | 工作区、会话、继承与覆盖 |
| M3 市场 / 原生插件页 | ✅ | scope 徽章与直接设置 |
| M4a 技能/Prompt + 映射诊断 | ✅ | stale/duplicate/protected、provider/source 过滤 |
| M4b Preset Engine | ⚠️ 后端 + UI 完成，产品化未完成 | 需要 Host 补丁；当前 profile 级固定集合 |
| M4c 用量 / 标签 | ✅ | 调用次数、token、费用、标签自动匹配 |
| M4d 作用域简化 / 标签列表 | ✅ | 全局/按需/关闭、标签增删改查、侧栏入口 |
| M5 发布 / 文档 | ✅ | 截图、DETAIL、FAQ、示例、CI、Release、npm、fresh profile |

## 自动化验证

```text
npm test: 26 passed / 0 failed
node --check lib/index.js lib/client.js: passed
npm pack --dry-run: passed in CI
GitHub workflows: CI / Release / Publish npm all success
```

## M4b 实测

隔离 web profile：

```json
{
  "version": "0.4.1",
  "preset": {
    "enabled": true,
    "registered": true,
    "hostCapable": true,
    "error": null,
    "bundles": ["dsh-ai-diagrams"],
    "presetId": "scope:profile"
  },
  "root dsh-ai-diagrams row": {
    "rowId": "ai-diagrams",
    "enabled": false,
    "phase": null
  },
  "mappingDiagnostics": {
    "staleTools": [],
    "staleSkills": [],
    "duplicateTools": [],
    "duplicateSkills": [],
    "protectedSections": []
  }
}
```

新空白会话：

- preset = `scope:profile`
- tools = **47**
- diagram tools = **7**
  - `diagram_save`
  - `diagram_svg`
  - `diagram_validate`
  - `diagram_import`
  - `diagram_types`
  - `diagram_profile`
  - `diagram_png`

结论：Host 补丁生效时，root 不加载 diagram 插件；preset 会话可以正常使用。

## 桌面回归

```json
{
  "version": "0.4.1",
  "preset": {
    "enabled": false,
    "registered": false,
    "hostCapable": false,
    "bundles": []
  },
  "gates": 2
}
```

未配置 `presetBundles`，桌面继续走 Gate，行为不变。

## Release

- tag：`v0.4.1`
- GitHub Release：https://github.com/UserShi/dsh-plugin-scope/releases/tag/v0.4.1
- npm：`dsh-plugin-scope@0.4.1`
- Release asset：`dsh-plugin-scope-0.4.1.tgz`
- 代码：`9a214ac`

## M4b 已知限制

1. 需要应用 [Host 补丁](host-patch/app-boot-preset-bundles.patch)；标准 DSH 上不生效。
2. 当前是 profile 级固定 bundle 集合，不是 per-session / per-workspace 动态 preset。
3. 有 client half 的 bundle 仅警告，客户端 UI 可能缺失。
4. 注册失败只显示诊断，不自动回退 Gate；可在 UI 清空 preset bundles 后重启回退。
5. 已开始的标准会话不会迁移到 preset，继续走 Gate/原行为。

## 下一阶段

- 上游合入 Host `presetBundles`；
- 多 preset / 按工作区选择；
- 自动回退；
- 已开始会话迁移；
- 完整 M4b 验收后再关闭里程碑。
