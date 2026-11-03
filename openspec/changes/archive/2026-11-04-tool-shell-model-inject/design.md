# Design

## Context

动机见 `proposal.md`，行为约定见 `specs/tool-shell/spec.md`。

现状（上一变更落地后）：

- `src/tool-shell.ts` 的 `syncToolShellSettings({ tools, enabled, write, toolRoots })` 自行解析工具用户级 home（`toolHome` / `resolveToolRootDir`）、维护 `~/.teamai/tool-shell.json`、写入/更新/清理。
- 触发点在 `src/hooks.ts` 的 `reconcileHooksToAllTools` 末尾，覆盖 `pull` / `init` / `hooks inject`。
- `src/model-cmd.ts` 的 `modelInject` 逐工具调用 `ModelConfigService.apply()`，把成功的 `{ tool, file }` 收进 `written`；尚未与 shell 写入发生关系。
- 当前声明 shell 配置的三个工具，其 shell 文件与模型配置文件同名同址：Claude Code / CodeBuddy 是 `settings.json`，OpenCode 是 `opencode.json`。

## Goals / Non-Goals

**Goals:**

- 触发点唯一：`teamai model inject`。
- 写入对象精确等于本次成功注入模型配置的工具，不扩大到其他已安装工具。
- 复用本次注入解析出的配置文件位置，避免两套路径解析（`CLAUDE_CONFIG_DIR`、tool-root 记录）得出不同结果。
- 让 `tool-shell.ts` 的 API 与「本次运行」模型一致，删除已无调用方的参数与分支。

**Non-Goals:**

- 不改变 `~/.teamai/tool-shell.json` 的记录格式与位置。
- 不为 `model set-default` 或其他命令增加触发。
- 不提供全局清扫：本次未触及的工具不在本模块职责内。
- 不改 `model inject` 的 CLI 参数、输出与退出码。

## Decisions

### 决策 1：在 `modelInject` 的逐工具循环之后同步，输入是 `written`

`modelInject` 已把成功的工具与文件收进 `written: { tool, file }[]`；循环结束后以它为输入调用 shell 同步。

- 只处理成功项：模型配置写失败的工具自动排除（符合规格的「写入失败的工具不写」）。
- `--dry-run` 直接跳过：dry run 的输出是配置预览，不应产生任何磁盘写入。
- 同步包在 try/catch 内，失败只 `log.warn`，不影响 `model inject` 的 `process.exitCode`。
- 备选方案是在每个工具成功后立即同步：与 `written` 汇总逻辑重复，且错误处理要嵌进循环；在循环后统一处理更简单。

### 决策 2：`syncToolShellSettings` 接受「目标工具 + 其配置文件」

新形状：

```ts
syncToolShellSettings({
  targets: readonly { tool: string; file: string }[],
  environment?: Partial<ToolShellEnvironment>,
}): Promise<ToolShellSyncResult>
```

- `file` 是本次模型注入实际写入的配置文件绝对路径。
- shell 文件路径改为 `path.join(path.dirname(file), TOOLS[tool].shell.file)`：三个工具的 `shell.file` 与模型文件同名，因此结果就是同一个文件；未来若某工具的 shell 文件与之不同，仍在同一目录下按注册表名字定位。
- 删除 `tools` / `enabled` / `write` / `toolRoots` 参数，以及 `toolShellConfigFile` 对 `toolHome` / `resolveToolRootDir` 的依赖。备选方案是保留旧 API 并在调用方拼参数，但那会留下无人使用的「启用集合」与「移除路径」语义。

### 决策 3：清理只覆盖本次目标

- Git Bash 存在：逐个目标写入/更新（用户值保留、记录值更新）。
- Git Bash 缺失：输出一次告警，并只删除本次目标中仍归属于 teamai 的值。
- 记录文件里本次未涉及的工具：原样保留，不读其配置、不改其记录。
- 备选方案是保留全局清扫（读取所有记录并删除不在目标中的项）：那会让 `model inject --tool opencode` 顺手清掉 Claude Code 的值，违反用户选择。

### 决策 4：注册表保持 `shell` 声明不变

`src/tools.ts` 的 `ShellSetting`（`kind` / `file` / `key` / `evidence`）继续作为唯一能力声明；本变更只改调用方与路径拼装方式。这样以后新增工具仍是「加一条注册表记录」。

### 决策 5：测试按层拆分

- `tool-shell` 单测：新 API、目标范围、用户值保留、记录值更新、缺失 Git Bash 清理、解析失败跳过。
- `model-cmd` 单测：成功注入后调用一次、参数为本次 `written`；`--dry-run` 不调用；shell 同步抛错不影响注入成功。
- 删除 `hooks-tool-shell.test.ts`（触发点已移除）。
- 修改 `hooks-reconcile-scope.test.ts` 中为上一变更放宽的断言：self 模式不再有 HOME 写入，恢复「HOME 无 settings.json」的原断言。

## Risks / Trade-offs

- [用户升级后不再于 pull/init 写入，必须主动跑一次 `model inject` 才生效] → 文档明确写触发命令；这是本次变更的预期行为。
- [`model inject` 每次都会先重写模型配置，再判断 shell 是否需要写] → shell 值已一致时不写文件，正常情况下每个工具一次额外写入都省掉；首次注入多一次原子写，可接受。
- [工具/卸载后 teamai 的值可能残留] → 记录仍在，下一次对该工具的 `model inject`（或 Git Bash 缺失时）会按记录清理；不自动扫全部工具是本次明确的范围取舍。
- [`model inject --tool` 指定未安装但可写的工具时，模型写入成功后仍会写 shell 配置] → 与模型配置一致：注入目标由用户显式指定，等价于用户认为该工具在用。
- [`service.apply` 与 shell 写入之间若用户同时改文件，后者可能覆盖其改动] → 写入仍是点键替换 + 原子写，只碰自己的键；非 JSON 文件直接跳过并告警。

## Migration Plan

- 升级后：`pull` / `init` / `hooks inject` 不再写该配置；工具上已有的值原样保留。
- 用户执行一次 `teamai model inject`（不带 `--tool` 时覆盖所有已安装且支持的模型工具）即可写入或更新。
- 回滚到上一版本：旧版本会在下一次 pull/init 继续写入，记录格式兼容，无需数据迁移。

## Open Questions

无。
