# Spec Delta

## Purpose

让 Windows 上支持显式命令解释器配置的 AI 工具使用 teamai 动态解析到的 Git Bash，使团队钩子、技能和命令按 POSIX 语义执行；同时尊重用户已有的显式配置，并在缺少 Git Bash 时安全降级。

## ADDED Requirements

### Requirement: 在 Windows 上写入 Git Bash 路径

在 Windows 上，当已启用工具的注册表声明了命令解释器配置项，且该工具用户级配置中的对应键缺失时，teamai MUST 把本机解析到的 Git Bash 绝对路径写入该键。

#### Scenario: 写入 Claude Code

- **WHEN** 在 Windows 上执行 `teamai pull` 或 `teamai init`，Claude Code 处于启用集合且本机找到 Git Bash
- **THEN** 用户级 `settings.json` 的 `env.CLAUDE_CODE_GIT_BASH_PATH` 等于该 Git Bash 的绝对路径

#### Scenario: 写入 CodeBuddy

- **WHEN** 在 Windows 上执行 `teamai pull` 或 `teamai init`，CodeBuddy 处于启用集合且本机找到 Git Bash
- **THEN** 用户级 `settings.json` 的 `env.CODEBUDDY_CODE_GIT_BASH_PATH` 等于该 Git Bash 的绝对路径

#### Scenario: 写入 OpenCode

- **WHEN** 在 Windows 上执行 `teamai pull` 或 `teamai init`，OpenCode 处于启用集合且本机找到 Git Bash
- **THEN** 用户级 `opencode.json` 的顶层 `shell` 键等于该 Git Bash 的绝对路径

#### Scenario: 非 Windows 平台不写入

- **WHEN** 在 macOS 或 Linux 上执行 `teamai pull` 或 `teamai init`
- **THEN** teamai 不因该能力写入任何命令解释器配置，也不输出相关告警

### Requirement: 尊重用户已设置的命令解释器

当目标键已存在且其值不等于 teamai 上次记录的值时，teamai MUST 保持该值不变，且 MUST NOT 在该值上再写入。

#### Scenario: 用户自设 Claude 路径时保留

- **WHEN** `settings.json` 的 `env.CLAUDE_CODE_GIT_BASH_PATH` 已由用户设置，且与 teamai 的记录不同
- **THEN** 同步后该值保持不变

#### Scenario: 用户自设 OpenCode shell 时保留

- **WHEN** `opencode.json` 的 `shell` 已由用户设置为其他解释器，且与 teamai 的记录不同
- **THEN** 同步后该值保持不变

### Requirement: 更新 teamai 自己写入的值

当目标键的值等于 teamai 上次记录的值、且本次解析到的 Git Bash 路径与记录不同时，teamai MUST 把该键更新为新路径并更新记录。

#### Scenario: Git Bash 安装位置变化后更新

- **WHEN** 上次同步写入的路径仍然等于配置中的值，而本次解析到不同的 Git Bash 路径
- **THEN** 配置中的值被替换为新路径

#### Scenario: 值已一致时不重写

- **WHEN** 配置中的值已等于本次解析到的 Git Bash 路径
- **THEN** teamai 不重写该配置文件

### Requirement: 缺少 Git Bash 时告警并跳过

在 Windows 上找不到 Git Bash 时，teamai MUST 输出一条可读告警并跳过写入，且 MUST NOT 因此使 `teamai pull` 或 `teamai init` 失败。

#### Scenario: 未安装 Git for Windows

- **WHEN** Windows 上找不到任何 Git Bash 可执行文件时执行同步
- **THEN** 该次同步不写入命令解释器配置，输出告警，且命令仍按其原有结果结束

### Requirement: 清理 teamai 写入的陈旧值

当某个工具不再处于启用集合，或 teamai 不再有可写入的 Git Bash 路径时，若目标键的值仍等于 teamai 记录的值，teamai MUST 删除该键；若值已被用户改动，MUST 保留。

#### Scenario: 工具被移除后清理

- **WHEN** 某个先前由 teamai 写入该配置的工具不再处于启用集合，且该值未被用户改动
- **THEN** 该键被删除，对应记录一并清除

#### Scenario: 用户改动后不再清理

- **WHEN** 某工具不再处于启用集合，但该键的值已不等于 teamai 记录的值
- **THEN** 该键保留不变

### Requirement: 只对声明了配置项的工具写入

teamai MUST 仅向注册表中声明了命令解释器配置项的工具写入该配置；对未声明的工具 MUST NOT 新增任何相关键。

#### Scenario: 未声明能力的工具不受影响

- **WHEN** 在 Windows 上同步一个注册表未声明命令解释器配置项的工具（如 Codex、Cursor）
- **THEN** 该工具的用户级配置不出现任何 teamai 写入的命令解释器键
