# Proposal

## Why

上一变更把「把 Git Bash 写入 AI 工具」挂在 `pull` / `init` / `hooks inject` 的工具遍历里，这会让普通同步顺带改动工具配置，也把一条机器级设置和钩子注入耦合在一起。用户希望它只在 `dmtn model inject` 时触发——模型配置本来就是逐工具、显式写入的，Git Bash 路径与它同址、同生命周期最自然。

## What Changes

- **BREAKING**（行为变更，无 CLI 兼容影响）：移除 `pull`、`init`、`hooks inject` 触发 Git Bash 写入的路径；改为只在 `teamai model inject` 中触发。
- 写入范围：仅本次 `model inject` 实际成功写入模型配置、且工具注册表声明了命令解释器配置项的工具（当前为 Claude Code、CodeBuddy、OpenCode）；`--tool` 指定子集时同样只处理该子集。
- 写入位置：复用本次模型配置文件所在的目录，再拼接注册表声明的文件名，保证 shell 路径与模型配置同文件（`settings.json` / `opencode.json`）。
- 用户已有值仍不覆盖；teamai 记录的值仍随 Git Bash 位置变化更新。
- 清理范围收窄到「本次处理的工具」：找不到 Git Bash 时告警并删除这些工具上仍属于 teamai 的值；本次未处理的工具保持原样。
- `model inject --dry-run` 不写入 Git Bash 相关配置。
- shell 写入失败不改变 `model inject` 的退出结果，只输出告警。
- 更新 `docs/guide/windows.md` 与 `docs/guide/zh-CN/windows.md` 的触发说明。

不在本变更范围内：`model set-default` 等其他模型命令的触发；新增 CLI 命令或参数；工具被移除/卸载时的自动清理（记录保留，等下一次 `model inject` 在范围内处理）。

## Capabilities

### New Capabilities

无。

### Modified Capabilities

- `tool-shell`: 触发时机从 `pull` / `init` / `hooks inject` 改为 `teamai model inject`；写入对象限定为本次成功注入的工具；清理范围限定为本次处理的工具。

## Impact

- 代码：
  - `src/model-cmd.ts`：`modelInject` 在逐工具写入成功后触发 shell 同步，并把该工具解析后的模型配置文件名传下去。
  - `src/tool-shell.ts`：API 收窄为「本次处理的工具 + 各工具的配置文件」，移除启用集合/移除路径参数与 `toolHome` 解析。
  - `src/hooks.ts`：删除 `reconcileHooksToAllTools` 里的触发块。
  - `src/tools.ts`：注册表 `shell` 声明保持不变。
- 测试：`tool-shell` 单测按新 API 调整；删除 hooks 集成测试；新增 `modelInject` 触发/`--dry-run` 不触发/缺失 Git Bash 的单测。
- 文档：`docs/guide/windows.md`、`docs/guide/zh-CN/windows.md`。
- 兼容性：不再于 `pull`/`init` 时写入；工具上已有的 teamai 值保留到下一次 `model inject` 才更新或清理。
