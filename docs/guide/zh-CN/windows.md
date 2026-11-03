# Windows：让钩子生效

> 本文是 [TeamAI CLI 使用指南](../../usage-guide.zh-CN.md) 的一部分。

> TeamAI 的 Agent 钩子在 Windows 上不触发时该查什么。

## 摘要

钩子写的是 Git Bash 的绝对路径，不会走到 WSL。WorkBuddy 用自带的 shell，ZCode 用 Node。找不到 shell 的工具会被跳过。`teamai doctor` 通过，钩子就会触发。

## 验证

```powershell
teamai doctor                       # 每个已安装工具的钩子都应报告健康
teamai hooks list                   # 各工具的内置钩子集合

# 手动跑一个钩子；退出码 0 表示派发正常
& "C:\Program Files\Git\bin\bash.exe" -lc "teamai hook-dispatch session-start --tool claude 2>/dev/null"; $LASTEXITCODE
```

每个事件做什么，见[基础 Harness](sharing.md#hooks)。

## 工具自己的 shell

在 Windows 上，工具默认用 PowerShell 或 cmd 执行命令，团队钩子和按 POSIX shell
编写的技能命令会因此失败。所以 `teamai model inject` 会把本机的 Git Bash 写入
本次刚注入过模型配置、且支持显式指定解释器的工具的用户级配置：

| 工具 | 配置项 |
| --- | --- |
| Claude Code | `~/.claude/settings.json` 的 `env.CLAUDE_CODE_GIT_BASH_PATH` |
| CodeBuddy | `~/.codebuddy/settings.json` 的 `env.CODEBUDDY_CODE_GIT_BASH_PATH` |
| OpenCode | `~/.config/opencode/opencode.json` 的 `shell` |

路径按本机解析，不会提交到团队仓库。你自己设置的值会原样保留，teamai 只更新自己写过的值；
找不到 Git Bash 时只告警，并删除本次范围内 teamai 写过的值。`teamai pull`、`teamai init`
与 `teamai hooks inject` 不会写这个配置；需要写入或刷新时运行 `teamai model inject`。
其他工具仍使用自己的 shell 探测。

## 钩子仍不触发

- **没装 Git for Windows。** 没有它时派发命令退化为裸 `bash`，Windows 会解析到 WSL 启动器；
  安装 Git for Windows 后运行 `teamai hooks inject`。
- **`teamai doctor` 说 `gh` 未登录**，而 `gh auth status` 显示已登录。`doctor` 启动 `gh` 时可能
  没带 `APPDATA`，所以看不到登录态。其他检查都通过时可以忽略。
