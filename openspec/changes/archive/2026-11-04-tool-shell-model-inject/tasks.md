# Tasks

## 1. 触发点迁移到 model inject

- [x] 1.1 在 `src/model-cmd.ts` 的 `modelInject` 逐工具循环结束后调用 shell 同步：以本次成功的 `written`（工具 + 配置文件）为输入；`--dry-run` 直接跳过；同步异常只 `log.warn`，不影响退出码。验证：新增 `model-cmd` 单测覆盖「注入成功调用一次且参数正确」「dry-run 不调用」「同步抛错仍注入成功」，`npx tsc --noEmit` 通过。
- [x] 1.2 删除 `src/hooks.ts` 中 `reconcileHooksToAllTools` 末尾的 shell 同步块，并删除 `src/__tests__/hooks-tool-shell.test.ts`。验证：`npx tsc --noEmit` 通过，且全局搜索不再有 hooks 侧调用。

## 2. 收窄 tool-shell 的 API 与清理范围

- [x] 2.1 把 `syncToolShellSettings` 改为接收 `targets: { tool, file }[]`：shell 文件路径按 `dirname(file) + 注册表 shell.file` 解析，删除 `tools` / `enabled` / `write` / `toolRoots` 参数及 `toolHome` / `resolveToolRootDir` 依赖。验证：`tool-shell` 单测覆盖同目录路径解析、无声明工具跳过，`npx tsc --noEmit` 通过。
- [x] 2.2 清理只覆盖本次目标：找不到 Git Bash 时只删除 `targets` 中仍属于 teamai 的值；记录里本次未涉及的工具不改配置、不改记录。验证：单测覆盖「目标内清理」「用户改动保留」「非目标工具不动」。

## 3. 测试与文档

- [x] 3.1 恢复 `src/__tests__/hooks-reconcile-scope.test.ts` 中为上一变更放宽的断言：self 模式重新断言 HOME 下没有 `settings.json`。验证：该文件跑通（本机既有的环境相关失败除外）。
- [x] 3.2 更新 `docs/guide/windows.md`：触发命令改为 `teamai model inject`，说明只对本次成功注入的工具生效、`pull`/`init`/`hooks inject` 不再写入、缺失 Git Bash 时告警并清理本次范围内的旧值。验证：文档命令与注册表工具名一致。
- [x] 3.3 同步更新 `docs/guide/zh-CN/windows.md`，与英文版语义一致。验证：两版章节结构一致，`git grep -n "model inject" docs/guide/windows.md docs/guide/zh-CN/windows.md` 覆盖新说明。

## 4. 集成验证

- [x] 4.1 运行 `npm run build`、`npx tsc --noEmit`、`npm run lint` 通过，并跑本次目标单测（`tool-shell`、`model-cmd`）。
- [x] 4.2 真实 CLI 端到端（隔离 HOME 的临时 workspace）：设置一个占位 provider API key，执行 `teamai model inject --provider deepseek --tool claude,codebuddy,opencode`，确认三个配置写入 Git Bash、`~/.teamai/tool-shell.json` 记录三项；再执行 `teamai hooks inject` 并确认它不再改动这些值；确认 `model inject --dry-run` 被 CLI 拒绝且文件未变化（该命令没有 CLI 预览；dry-run 不写的逻辑由单测覆盖）。验证：记录命令与输出，附到 PR 描述。

## Workflow follow-up

- 代码评审通过后归档该变更（`openspec archive`），并确认 `specs/tool-shell/spec.md` 的 MODIFIED 需求合并进主规格。
