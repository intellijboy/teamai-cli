# Windows: Getting Hooks to Fire

> Part of the [TeamAI CLI Usage Guide](../usage-guide.md).

> What to check when TeamAI's agent hooks do not run on Windows.

## TL;DR

Hook commands use Git Bash by absolute path, so they do not land on WSL. WorkBuddy uses the shell it ships. ZCode uses Node. A tool with no shell is skipped. When `teamai doctor` passes, the hooks fire.

## Verify

```powershell
teamai doctor                       # every installed tool should report healthy hooks
teamai hooks list                   # the built-in hook set per tool

# run one hook by hand; exit code 0 means the dispatch works
& "C:\Program Files\Git\bin\bash.exe" -lc "teamai hook-dispatch session-start --tool claude 2>/dev/null"; $LASTEXITCODE
```

What each event does is in [Core Harness](sharing.md#hooks).

## The tool's own shell

On Windows a tool starts its command runner as PowerShell or cmd unless it is
told otherwise, so team hooks and skill commands written for a POSIX shell fail.
`teamai model inject` therefore writes the machine's Git Bash into the
user-level config of every tool it just injected a model config into, when that
tool accepts an explicit shell path:

| Tool | Setting |
| --- | --- |
| Claude Code | `env.CLAUDE_CODE_GIT_BASH_PATH` in `~/.claude/settings.json` |
| CodeBuddy | `env.CODEBUDDY_CODE_GIT_BASH_PATH` in `~/.codebuddy/settings.json` |
| OpenCode | `shell` in `~/.config/opencode/opencode.json` |

The path is resolved on this machine and never committed to the team repo. A
value you set yourself is left alone; teamai only updates what it wrote. When
Git Bash cannot be found, teamai warns and removes the value it wrote for the
tools in that run. `teamai pull`, `teamai init` and `teamai hooks inject` do not
write this setting; run `teamai model inject` to apply or refresh it. Other
tools keep their own shell detection.

## If hooks still do not fire

- **Git for Windows is missing.** Without it the dispatch commands degrade to a
  bare `bash`, which Windows resolves to the WSL launcher; install Git for
  Windows and run `teamai hooks inject`.
- **`teamai doctor` says `gh` is not logged in** although `gh auth status` says
  it is. `doctor` may spawn `gh` without `APPDATA`, so it cannot see the login.
  Ignore it when the other checks pass.
