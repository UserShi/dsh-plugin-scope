# GitHub 发布指南

> 目标仓库：`https://github.com/shihaozhan/dsh-plugin-scope`  
> 当前状态：本地仓库已初始化并提交；**尚未推送**（本机没有可用的 GitHub 凭据）。

---

## 1. 当前环境检查结果

| 项 | 结果 |
|---|---|
| `gh` CLI | 未安装 |
| Git 用户名/邮箱 | `shihaozhan` / `247611737@qq.com` |
| HTTPS 凭据 | 无（`git credential fill` 失败） |
| SSH key | `~/.ssh/id_rsa` 存在 |
| SSH 到 GitHub | `Permission denied (publickey)`，公钥未添加到 GitHub |
| 目标仓库 | 404，尚未创建 |

因此：**推送需要先完成一次授权**。二选一即可。

---

## 2. 方式 A：SSH（推荐）

1. 复制本机公钥：
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```
2. 打开 GitHub → Settings → SSH and GPG keys → New SSH key，粘贴并保存。
3. 验证：
   ```bash
   ssh -T git@github.com
   # Hi shihaozhan! You've successfully authenticated...
   ```
4. 在 GitHub 创建空仓库 `dsh-plugin-scope`（不要勾 README、.gitignore、License）。
5. 推送：
   ```bash
   cd /Users/haozhanshi/WorkSpace/deepseek-work/plugin-scope
   git remote add origin git@github.com:shihaozhan/dsh-plugin-scope.git
   git push -u origin main
   ```

---

## 3. 方式 B：HTTPS + Personal Access Token

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens。
2. 选择目标仓库 `dsh-plugin-scope`；权限：
   - Contents: Read and write
   - Metadata: Read
   - （可选）Pull requests: Read and write
3. 创建空仓库（同上）。
4. 推送：
   ```bash
   cd /Users/haozhanshi/WorkSpace/deepseek-work/plugin-scope
   git remote add origin https://github.com/shihaozhan/dsh-plugin-scope.git
   git push -u origin main
   # Username: shihaozhan
   # Password: <粘贴 PAT>
   ```
5. 建议开启 macOS keychain 缓存：
   ```bash
   git config --global credential.helper osxkeychain
   ```

> 不要把 PAT 写进仓库、聊天记录或 shell history。用 `git credential` 或系统钥匙串。

---

## 4. 首次发布清单

- [ ] 仓库创建（public/private）
- [ ] `README.md` / `README.zh.md` 首屏可读
- [ ] `LICENSE`（MIT）
- [ ] `docs/DESIGN.md`、`docs/ROADMAP.md`、`docs/GITHUB.md`
- [ ] 架构图 `docs/assets/architecture.png`（已在文档中引用）
- [ ] `package.json` 的 name/version/engines/files 正确
- [ ] `cordis.patch.yml` 只插入一个 row
- [ ] `lib/` 已提交（如果采用 git 安装）
- [ ] CI 通过
- [ ] 在临时 profile 安装并跑通 M1 验收
- [ ] 打 tag `v0.1.0`
- [ ] GitHub Release 附 `.tgz`
- [ ] （可选）npm publish

---

## 5. 建议的仓库设置

- Default branch：`main`
- Branch protection：要求 CI 通过、至少 1 个 review（个人项目可只要求 CI）
- Issues：开启
- Discussions：可选
- Topics：`dsh`、`dsh-plugin`、`deepseek-harness`、`plugin-manager`、`scope`、`token-saving`
- Description：`Per-conversation plugin scopes for DeepSeek Harness — global, on-demand, off, with token estimates and dsh-market integration.`

---

## 6. CI 工作流

`.github/workflows/ci.yml`：

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [22, 24]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
      - run: npm pack --dry-run
```

> 如果 `lib/` 提交到仓库，再加一步「构建后 git diff --exit-code lib」确保产物与源码一致。

---

## 7. Release 工作流

`.github/workflows/release.yml`：

```yaml
name: Release
on:
  push:
    tags: ['v*']

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: npm pack
      - uses: softprops/action-gh-release@v2
        with:
          files: '*.tgz'
      # 可选 npm
      # - run: npm publish --access public
      #   env:
      #     NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 8. 安装方式（发布后）

### 8.1 GitHub Release tarball（推荐，最稳）

```bash
dsh plugin --profile desktop add \
  https://github.com/shihaozhan/dsh-plugin-scope/releases/download/v0.1.0/dsh-plugin-scope-0.1.0.tgz
```

或在 **Plugins → Add plugin** 的 spec 里粘贴上面的 URL。

### 8.2 GitHub 源码

```bash
dsh plugin --profile desktop add github:shihaozhan/dsh-plugin-scope
```

要求：

- 仓库里已提交构建产物 `lib/`；
- 没有需要运行的 `prepare` 构建脚本（否则 pnpm 11 可能要求 build-script 审批）。

### 8.3 npm

```bash
npm publish --access public
dsh plugin --profile desktop add dsh-plugin-scope
```

### 8.4 本地开发

```bash
dsh plugin --profile desktop add link:/Users/haozhanshi/WorkSpace/deepseek-work/plugin-scope
```

或在 **Plugins → Add plugin** 选择目录。

---

## 9. 发布后的验证

1. 全新 profile（或在 desktop profile 备份后）安装。
2. **Plugins** 页出现 `Plugin Scope`，图标/标题/描述正确。
3. 侧边栏出现 Plugin Scope；页面能列出已安装插件。
4. 打开一个空白会话，chip 显示默认作用域。
5. 关掉一个按需插件的工具，发送消息，确认 tool 列表变化、session log 有记录。
6. 重启 DSH，状态保持。
7. 卸载，确认没有残留的 scope 配置影响其他插件。

---

## 10. 常见问题

**Push 被拒：`Permission denied (publickey)`**  
→ 公钥没加到 GitHub，或 ssh-agent 没加载。执行 `ssh-add ~/.ssh/id_rsa` 后重试。

**HTTPS push 反复要密码**  
→ 用 PAT 作为密码；配置 `credential.helper osxkeychain`。

**`github:` 安装失败，提示 build script**  
→ 改用 Release tarball，或确保 `lib/` 已提交且没有 `prepare`。

**安装后 DSH 启动失败**  
→ 在 Plugins 的恢复界面取消勾选本插件；或从 profile 的 `cordis.patch.yml` 移除 row（仅在无法进入 UI 时）。保留日志。

**市场看不到 Scopes tab**  
→ 确认 dsh 版本 ≥ 0.2.2-rc.5；确认 client bundle 已注册 `plugins.tab` / `settings.plugins.tab`；检查浏览器控制台是否有 slot 注册错误。
