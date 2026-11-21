# Proposal

## Why

`dmtn-main` 当前基于 fork 的 `origin/main`（`6e4d8dcf`），而官方 `Tencent/teamai-cli` 的 `main` 已前进到 `030c2c77`，领先 351 个提交。本地 `main` 更旧（`eeb1bd74`，落后 260 个提交）。需要在不丢失 `dmtn-main` 本地功能（model provider、hooks、OpenCode、tool-roots、slash commands 等）的前提下，同步官方最新成果。

## What Changes

- 新增 `upstream` remote 指向 `https://github.com/Tencent/teamai-cli.git`，`origin` 仍指向个人 fork。
- 拉取 `upstream/main`，将本地 `main` 更新到官方最新提交（`main` 是官方 main 的祖先，可安全重置；本地 `main` 的旧提交已全部包含在 `dmtn-main` 中）。
- 将更新后的 `main` 合并进 `dmtn-main`，保留 `dmtn-main` 的功能特性，同时采纳官方的实现与修复。
- 解决预演出的 56 个冲突文件，按“本地功能语义优先、官方非冲突改动照常采纳”的原则逐文件三方合并。
- 合并结果先保留在本地，不自动推送。

## Capabilities

### New Capabilities

无。本变更是 Git 历史同步与冲突解决，不引入新的产品能力。

### Modified Capabilities

无。`skip_specs: true`：官方提交带来的行为由上游规格与实现承载，本变更不新增或改写本仓库的能力规格。

## Impact

- Git 配置：新增 `upstream` remote；本地 `main` 指向 `030c2c77`
- 合并提交：`dmtn-main` 新增一个 merge commit
- 冲突文件 56 个，主要类别：
  - 包与锁：`package.json`、`package-lock.json`
  - 核心流程：`src/pull.ts`、`src/push.ts`、`src/init.ts`、`src/uninstall.ts`、`src/hooks.ts`、`src/index.ts`
  - 资源层：`src/resources/*.ts`、`src/project-agent-root.ts`、`src/known-agents.ts`
  - 工具适配：`src/opencode-hooks.ts`、`src/omp-hooks.ts`、`src/cursor-user-rules.ts`
  - 文档与生成文件：`AGENTS.md`、`CHANGELOG.md`、`docs/**`、`skill-data/core/references/commands.md`
  - 测试：`src/__tests__/*.test.ts` 约 10 个
- 验证：`npm run build`、`npx tsc --noEmit`、`npm run lint`、相关单元测试与一次真实 CLI 运行
