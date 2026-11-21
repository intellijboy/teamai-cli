# Design

## Context

- `origin` 指向个人 fork（`intellijboy/teamai-cli`），官方仓库为 `Tencent/teamai-cli`，本地尚未配置 upstream remote。
- `origin/main` = `6e4d8dcf`，官方 `main` = `030c2c77`；前者是后者的祖先，官方多 351 个提交。
- `dmtn-main` = `54034111`，包含 `origin/main` 全部 87 个本地提交，工作区干净。
- 本地 `main` = `eeb1bd74`，相对 `origin/main` 领先 65、落后 260；它的 65 个提交已全部包含在 `dmtn-main` 中，因此重置不会丢失工作。
- 上一个变更 `restore-teamai-branding` 已把包名、可执行文件与 recall 资产统一为 `teamai`，本合并不应再出现品牌冲突。
- 官方仓库拉取在本机需要代理：`ALL_PROXY=http://127.0.0.1:17980`（环境细节，不写入仓库配置）。
- `git merge-tree --write-tree dmtn-main FETCH_HEAD` 预演显示 56 个冲突文件。

## Goals / Non-Goals

**Goals:**

- 本地 `main` 与官方 `main` 一致。
- `dmtn-main` 通过一次 merge 获得官方 351 个提交。
- 保留 `dmtn-main` 的本地功能语义。
- 合并后 `npm run build`、`npx tsc --noEmit`、`npm run lint` 与相关测试通过。

**Non-Goals:**

- 不改写已推送的 `dmtn-main` 历史（使用 merge，不做 rebase）。
- 不推送合并结果；推送由用户另行决定。
- 不修复与本合并无关的既有 Windows 环境测试失败（符号链接 `EPERM`、临时目录清理等）。
- 不重新设计官方引入的功能，只做合并与适配。

## Decisions

### 1. 添加固定 upstream remote

`git remote add upstream https://github.com/Tencent/teamai-cli.git`，之后 `git fetch upstream`。保留 `origin` 为个人 fork。

理由：用户后续仍需持续同步官方；固定 remote 让 `git fetch upstream` 可直接复用。替代方案是每次用临时 URL fetch，放弃原因是无法保留远程跟踪分支。

### 2. 本地 main 直接指向官方 main

`git branch -f main upstream/main`（`main` 当前未被 checkout，且是 `upstream/main` 的祖先）。

理由：本地 `main` 的旧提交已全部在 `dmtn-main` 中；快进/重置是“更新到官方最新”的最直接方式。替代方案是在 `main` 上 merge 官方，放弃原因是会产生无必要的合并提交，且与用户选择的“更新到官方 main”不符。

### 3. 以 merge 方式合入 dmtn-main

在 `dmtn-main` 上执行 `git merge main --no-ff`（实际为一次普通 merge），产生一个 merge commit。

理由：`dmtn-main` 已推送，merge 保留既有历史；rebase 会改写 87 个已推送提交。合并前记录 `54034111` 作为回滚点。

### 4. 冲突解决按“功能语义优先、官方改动尽量保留”

逐文件三方合并（base `6e4d8dcf`、ours `dmtn-main`、theirs 官方 main）：

- **业务代码**：以 `dmtn-main` 已发布功能的语义为准，同时采纳官方对同一文件的结构调整、修复与新逻辑；两者冲突时手工融合，不整体取一侧。
- **package.json**：以官方为基线，保留本地仍需要的依赖、脚本与版本号；合并后重新生成锁定文件。
- **package-lock.json**：不手工解决，最终运行 `npm install` 重新生成。
- **CHANGELOG.md**：保留官方新增条目，并保留本地 beta 发布记录。
- **AGENTS.md / docs/**：同时保留官方新规则与本地团队约束（如中文思考与回复）。
- **skill-data/core/references/commands.md**：命令表变化后运行 `npx vitest run commands-reference -u` 重新生成。
- **测试**：保留本地功能用例，采纳官方新用例；合并后按新实现调整断言。

### 5. 合并后先不推送

合并结果留在本地 `dmtn-main`；是否推送、是否更新 fork 的 `origin/main` 由用户决定。

## Risks / Trade-offs

- **官方 351 个提交改变本地功能依赖的内部 API** → 逐文件适配，并以 build、类型检查、相关测试和一次真实 CLI 运行验证。
- **56 个冲突文件人工判断可能遗漏** → 合并后对整个 diff 做自查，重点检查共享状态的 reader/writer。
- **package-lock 手工合并易错** → 由 `npm install` 重新生成。
- **本地 main 重置后与 `origin/main` 分叉** → 不推送 `main`；需要时由用户决定是否把官方 main 推到 fork。
- **合并后测试可能暴露上游既有问题** → 区分“合并引入”与“上游既有/环境”失败，只修复前者。

## Migration Plan

1. `git remote add upstream https://github.com/Tencent/teamai-cli.git`
2. `git fetch upstream`
3. `git branch -f main upstream/main`
4. 在 `dmtn-main` 上 `git merge main`，解决 56 个冲突文件
5. 重新生成锁文件与 `commands.md`，运行构建、类型检查、lint、相关测试与真实 CLI 验证
6. 回滚：`git merge --abort`（合并中）或 `git reset --hard 54034111`（合并后、推送前）

## Open Questions

无。
