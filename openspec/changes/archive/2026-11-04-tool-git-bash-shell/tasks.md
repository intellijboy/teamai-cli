# Tasks

## 1. 注册表与类型

- [x] 1.1 在 `src/tools.ts` 增加 `ShellSetting` 类型（`kind: 'env' | 'key'`、`file`、`key`、`evidence`），并给 `TOOLS` 条目加可选 `shell` 字段；为 `claude`、`codebuddy`、`opencode` 填入设计表里的记录。验证：`npx tsc --noEmit` 通过，且新增单测断言只有这三个工具声明了 `shell`、键名分别为 `CLAUDE_CODE_GIT_BASH_PATH`、`CODEBUDDY_CODE_GIT_BASH_PATH`、`shell`。
- [x] 1.2 在 `src/tool-shell.ts` 实现目标文件解析：`toolRoots` 有覆盖时按 `resolveToolRootDir`，否则用 `toolHome(tool)` 再拼 `shell.file`。验证：单测覆盖默认 home、工具 home 被记录/环境变量迁移、`toolRoots` 覆盖三种情况。

## 2. 所有权记录与配置写入

- [x] 2.1 实现 `~/.teamai/tool-shell.json` 的读取与原子写入，容忍缺失/损坏记录（按空记录处理）。验证：单测覆盖首次写入、记录损坏、写入后可回读。
- [x] 2.2 实现点键写入与删除：`env` 形式写 `env.<key>`，`key` 形式写顶层键；只改目标键，其余内容保持；值已一致时不写文件；JSON 解析失败时不覆盖并告警。验证：单测覆盖 `settings.json` 与 `opencode.json` 两种形态、未知键保留、解析失败跳过。
- [x] 2.3 实现所有权判断：值等于记录 → 更新或删除；值不等于记录 → 保留并告警（debug 级别即可）。验证：单测覆盖「用户先设值 → teamai 不写」「teamai 写过 → 路径变化后更新」「teamai 写过 → 工具退出启用集合后删除」「用户改过 → 不删除」。

## 3. 平台与缺失处理

- [x] 3.1 实现平台与查找函数注入：非 `win32` 立即返回且不读写文件；`findGitBashWindows()` 返回 `null` 时输出一条告警并跳过，不抛错。验证：单测在 Linux/macOS CI 上通过注入平台跑通 Windows 分支，并断言缺失时告警且同步结果不失败。

## 4. 接入同步流程

- [x] 4.1 在 `src/hooks.ts` 的 `reconcileHooksToAllTools` 完成工具遍历后调用新模块，传入 `toolPaths`、`filterAgents`、`toolRoots`；`removeAll`/卸载路径只做清理、不写入。验证：单测覆盖正常同步会调用、`removeAll` 不写入；`npx tsc --noEmit` 通过。
- [x] 4.2 确认 `pull`、`init`、`hooks inject` 实际都经该入口（`init` 的 `reconcileHooksForInit` → `reconcileTeamHooksForConfig`），不需要在 `pull.ts` / `init.ts` 新增调用点。验证：代码路径复核 + 现有 pull/init 相关单测全绿（`npx vitest run`）。

## 5. 文档

- [x] 5.1 更新 `docs/guide/windows.md`：说明 Windows 上 `pull`/`init` 会把 Git Bash 写入支持该配置的工具（Claude Code、CodeBuddy、OpenCode），用户已有值不被覆盖，找不到 Git Bash 时告警跳过。验证：文档中的工具名与实际注册表一致。
- [x] 5.2 同步更新 `docs/guide/zh-CN/windows.md`，与英文版语义一致。验证：两版章节结构一致，`grep -n "Git Bash" docs/guide/windows.md docs/guide/zh-CN/windows.md` 均覆盖新说明。

## 6. 集成验证

- [x] 6.1 运行 `npm run build`、`npx tsc --noEmit`、`npm run lint` 通过，并跑本次新增/受影响的目标单测（`tool-shell`、`hooks-tool-shell`）；全量单测按用户要求本次不跑。
- [x] 6.2 真实 CLI 端到端（Windows）：在临时 workspace 执行一次 `teamai init` / `teamai pull`，确认 `~/.claude/settings.json`、`~/.codebuddy/settings.json`、`~/.config/opencode/opencode.json` 中写入的 Git Bash 路径符合预期，并确认用户预先设置的值不被覆盖。验证：记录命令与输出，附到 PR 描述。

## Workflow follow-up

- 代码评审通过后归档该变更（`openspec archive`），并确认 `specs/tool-shell/spec.md` 进入主规格。
