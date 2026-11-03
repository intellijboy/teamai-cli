# Spec Delta

## MODIFIED Requirements

### Requirement: 在 Windows 上写入 Git Bash 路径

在 Windows 上执行 `teamai model inject` 时，若某个工具在本次运行中成功写入了模型配置、其注册表声明了命令解释器配置项，且该工具用户级配置中的对应键缺失，teamai MUST 把本机解析到的 Git Bash 绝对路径写入该键。

#### Scenario: 写入 Claude Code

- **WHEN** 在 Windows 上执行 `teamai model inject` 且 Claude Code 在本次目标中、模型配置写入成功、本机找到 Git Bash
- **THEN** 用户级 `settings.json` 的 `env.CLAUDE_CODE_GIT_BASH_PATH` 等于该 Git Bash 的绝对路径

#### Scenario: 写入 CodeBuddy

- **WHEN** 在 Windows 上执行 `teamai model inject` 且 CodeBuddy 在本次目标中、模型配置写入成功、本机找到 Git Bash
- **THEN** 用户级 `settings.json` 的 `env.CODEBUDDY_CODE_GIT_BASH_PATH` 等于该 Git Bash 的绝对路径

#### Scenario: 写入 OpenCode

- **WHEN** 在 Windows 上执行 `teamai model inject` 且 OpenCode 在本次目标中、模型配置写入成功、本机找到 Git Bash
- **THEN** 用户级 `opencode.json` 的顶层 `shell` 键等于该 Git Bash 的绝对路径

#### Scenario: 模型配置写入失败的工具不写

- **WHEN** `teamai model inject` 对某个工具写入模型配置失败
- **THEN** teamai 不为该工具写入命令解释器配置

#### Scenario: 非目标工具不写

- **WHEN** `teamai model inject --tool opencode` 只以 OpenCode 为目标
- **THEN** Claude Code 与 CodeBuddy 的配置不因本次运行改变

#### Scenario: 非 Windows 平台不写入

- **WHEN** 在 macOS 或 Linux 上执行 `teamai model inject`
- **THEN** teamai 不因该能力写入任何命令解释器配置，也不输出相关告警

#### Scenario: 其他命令不再触发

- **WHEN** 在 Windows 上执行 `teamai pull`、`teamai init` 或 `teamai hooks inject`
- **THEN** teamai 不因该能力写入命令解释器配置

### Requirement: 缺少 Git Bash 时告警并跳过

在 Windows 上执行 `teamai model inject` 且找不到 Git Bash 时，teamai MUST 输出一条可读告警并跳过写入，且 MUST NOT 因此使该命令失败。

#### Scenario: 未安装 Git for Windows

- **WHEN** Windows 上找不到任何 Git Bash 可执行文件时执行 `teamai model inject`
- **THEN** 该次运行不写入命令解释器配置，输出告警，且命令仍按其原有结果结束

## ADDED Requirements

### Requirement: 清理本次 model inject 目标的陈旧值

当 `teamai model inject` 处理某个工具且找不到 Git Bash 时，若该工具配置中的值仍等于 teamai 记录的值，teamai MUST 删除该键；若值已被用户改动，MUST 保留。本次未处理的工具 MUST 保持原样。

#### Scenario: 找不到 Git Bash 时清理本次目标

- **WHEN** 某工具在本次 `teamai model inject` 目标中，其上仍保留 teamai 写入的值，而本次找不到 Git Bash
- **THEN** 该键被删除，对应记录一并清除

#### Scenario: 用户改动后不再清理

- **WHEN** 某工具在本次目标中，但该键的值已不等于 teamai 记录的值
- **THEN** 该键保留不变

#### Scenario: 本次未处理的工具不动

- **WHEN** 某工具存在 teamai 写入的记录，但不在本次 `teamai model inject` 的目标中
- **THEN** 该工具的配置与记录都保持不变

## REMOVED Requirements

### Requirement: 清理 teamai 写入的陈旧值

**Reason**: 触发点收窄到 `teamai model inject` 后，不再存在一次运行覆盖「全部已启用工具」的清扫时机；清理改为只覆盖本次目标。

**Migration**: 行为由新增的「清理本次 model inject 目标的陈旧值」承接；工具上残留的 teamai 值会在下一次包含该工具的 `teamai model inject` 中被处理。
