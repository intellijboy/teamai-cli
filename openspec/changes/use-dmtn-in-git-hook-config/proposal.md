# Proposal

## Why

当前 npm 包只暴露 `dmtn` 这个可执行文件（`package.json` 的 `bin` 字段），但 Git hook 的配置命令仍然调用 `teamai hook-dispatch ...`。在只安装本包的环境里 `teamai` 并不存在，`post-checkout`、`post-merge`、`post-rewrite` hook 会静默失败，团队资源无法通过 Git 操作自动同步。

## What Changes

- Git config hook 的 `command` 改为调用 `dmtn hook-dispatch <event> --tool git`，不再调用 `teamai`。
- Git 2.54 之前的 `.git/hooks/<event>` 标记块使用同一套 `dmtn` 调度命令。
- `doctor` 在 `core.hooksPath` 或非 shell hook 场景给出的手工安装建议行改为 `dmtn`。
- `~/.teamai/bin` 的包装目录同时提供 `dmtn` 包装器（Windows 额外提供 `dmtn.cmd`），保证 Git 在缺少登录 PATH 时仍能解析该命令。
- 已安装的旧配置在下一次 `teamai pull` / `dmtn pull` 时被识别为过期并重写；显式禁用 hook 的配置保持不变。
- 更新 Git hook 单元测试与相关端到端断言。

## Capabilities

### New Capabilities

- `git-hook-sync`: 定义 Git hook 安装时生成的调度命令使用哪个 CLI 可执行文件、受限 PATH 下如何解析该命令，以及旧配置如何迁移。

### Modified Capabilities

<!-- 现有 project-gitignore 能力只涉及 .gitignore 忽略块，本变更不改变其需求。 -->

## Impact

- `src/git-hook.ts`：配置 hook、旧版脚本块、`doctor` 建议行和状态判定。
- `src/builtin-hooks.ts`：`~/.teamai/bin` 包装器需要新增 `dmtn` 可执行文件。
- `src/__tests__/git-hook.test.ts`：命令字符串、包装器假实现和 `doctor` 建议断言。
- `src/__tests__/e2e/git-hook-new-worktree.test.ts`：如断言了完整命令，需要跟随更新。
- 不需要修改 `.gitignore`、资源下发或团队仓库内容。
