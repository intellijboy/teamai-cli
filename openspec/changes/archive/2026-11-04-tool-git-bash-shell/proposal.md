# Proposal

## Why

teamai 的团队钩子、技能命令和文档示例都按 POSIX shell 编写，但 Windows 上各 AI 工具默认用 PowerShell 或 cmd 执行命令，导致同一条命令在 Windows 成员机器上失败。teamai 已经在渲染钩子命令时改用 Git Bash 的绝对路径来绕开 WSL 启动器，但工具自身执行命令所用的 shell 仍不受 teamai 控制；而 Git Bash 的安装位置因机器而异，无法在团队仓库里写死。支持显式指定命令解释器的工具需要一个按机器动态解析并写入的路径。

## What Changes

- 在工具注册表（`src/tools.ts`）中为「支持显式指定命令解释器」的工具声明 shell 配置能力，包括配置文件的相对位置、写入方式（`env` 键或顶层键）与证据级别。
- 首批覆盖有公开配置依据的工具：
  - Claude Code（`claude`）：`settings.json` 的 `env.CLAUDE_CODE_GIT_BASH_PATH`。
  - CodeBuddy（`codebuddy`）：`settings.json` 的 `env.CODEBUDDY_CODE_GIT_BASH_PATH`。
  - OpenCode（`opencode`）：用户配置 `opencode.json` 的顶层 `shell` 键。
- 新增一个同步步骤：仅当 `process.platform === 'win32'` 时，复用已有的 `findGitBashWindows()` 解析本机 Git Bash 路径，并写入上述工具的用户级配置。
- 该步骤挂在 `pull` / `init` 已有的「遍历已启用工具」流程中执行，不新增 CLI 命令，也不新增命令行参数。
- 所有权与冲突处理：
  - 记录 teamai 写入的值；值与记录一致时随 Git Bash 迁移而更新。
  - 用户已自行设置该配置时保留用户值，teamai 不覆盖。
  - 找不到 Git Bash 时输出一条告警并跳过写入，不阻断 pull/init。
  - 工具从启用集合中移除时，仅删除 teamai 记录且仍未被用户改动的值。
- 非 Windows 平台不写入、不告警。
- 同步更新 `docs/guide/windows.md` 与 `docs/guide/zh-CN/windows.md`。

不在本变更范围内：没有公开配置项的工具（如 Codex、Cursor、Copilot、JoyCode、Kiro、Trae、DSH、Pi、OMP、Hermes、OpenClaw、Muse），以及在 Windows 上自带 shell 的 WorkBuddy；它们保持现状，等有可验证的配置项后再以一条注册表记录接入。

## Capabilities

### New Capabilities

- `tool-shell`: 在 Windows 上把 teamai 动态解析到的 Git Bash 路径写入支持显式命令解释器配置的 AI 工具，同时尊重用户已有配置、记录 teamai 的所有权，并在 Git Bash 缺失时安全降级。

### Modified Capabilities

无。

## Impact

- 代码：
  - `src/tools.ts`：工具注册表新增可选的 shell 配置声明。
  - 新模块（暂定 `src/tool-shell.ts`）：解析、写入、所有权记录与清理。
  - `src/hooks.ts`：`injectHooksToAllTools` / `reconcileHooksToAllTools` 这两个已启用工具遍历入口调用新同步步骤，覆盖 `pull` 与 `init`。
  - `src/bundled-runtime.ts`：复用 `findGitBashWindows()`，预计不改动。
- 配置产物：各工具用户级配置文件中新增一个键（Claude Code、CodeBuddy 的 `env` 条目，OpenCode 的 `shell` 键），以及 teamai 机器本地的所有权记录文件。
- 测试：注册表单元测试、写入/保留/更新/清理的单元测试；Windows 真实 CLI 端到端验证一次。
- 文档：`docs/guide/windows.md`、`docs/guide/zh-CN/windows.md`。
- 兼容性：非 Windows 无行为变化；Windows 上不覆盖用户已有值；不新增命令与参数。
