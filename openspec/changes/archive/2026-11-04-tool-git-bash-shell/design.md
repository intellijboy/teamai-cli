# Design

## Context

动机见 `proposal.md`，行为契约见 `specs/tool-shell/spec.md`。

现有约束：

- `src/bundled-runtime.ts` 已有 `findGitBashWindows()`：按标准安装位置、注册表 `GitForWindows\InstallPath`、`PATH` 顺序查找 `bash.exe`，返回绝对路径或 `null`。它已被 Windows 钩子渲染复用，本变更直接复用，不改动查找逻辑。
- `src/tools.ts` 的 `TOOLS` 是工具能力的唯一注册表；`src/tool-home.ts` 的 `toolHome(tool)` 负责工具 home 的解析（工具 home 记录、环境变量迁移、XDG 等）。
- `pull` / `init` / `hooks inject` 都汇聚到 `hooks.ts` 的 `reconcileHooksToAllTools`（`init` 的 `reconcileHooksForInit` 亦经 `reconcileTeamHooksForConfig` 进入），该函数已经按启用集合与已安装状态遍历工具，并拿到 `toolPaths`、`filterAgents`、`toolRoots`。
- 工具能力在仓库里用 `evidence: 'verified' | 'source' | 'docs' | 'assumed'` 标注依据等级。

## Goals / Non-Goals

**Goals:**

- 用一条注册表记录即可让一个新工具接入本能力，不在同步代码里逐个写工具分支。
- 写入只发生在用户级配置，且只碰 teamai 拥有的那个键；任何用户已有值都原样保留。
- 在 Git Bash 不存在或配置不可解析时安全降级，不阻断同步。
- 同一份配置在重复 pull 下保持幂等（值已一致时不写文件）。

**Non-Goals:**

- 不新增 CLI 命令或参数；不暴露让用户手动指定 shell 的开关。
- 不接管 Windows 上自带 shell 的工具（WorkBuddy），也不为没有公开配置项的工具臆造键名。
- 不修改 `findGitBashWindows()` 的查找顺序与候选位置。
- 不改动项目级配置（避免把机器路径写进团队仓库）。

## Decisions

### 决策 1：能力声明放在 `TOOLS` 注册表，而不是独立映射表

在 `TOOLS` 的每个条目上新增可选字段：

```ts
type ShellSetting =
  | { readonly kind: 'env'; readonly file: string; readonly key: string; readonly evidence: Evidence }
  | { readonly kind: 'key'; readonly file: string; readonly key: string; readonly evidence: Evidence };
```

- `file` 相对该工具解析后的 home（如 `settings.json`、`opencode.json`）。
- `kind: 'env'` 写入 `env.<key>`；`kind: 'key'` 写入顶层 `<key>`。
- `key` 是工具侧的真实键名（Claude/CodeBuddy 的 `*_GIT_BASH_PATH`，OpenCode 的 `shell`）。

理由：工具能力本来就集中在 `TOOLS`，doctor、`tool-home`、`tools.ts` 的读者已经在消费它；新增一处独立映射会让「哪些工具支持什么」出现第二个事实来源。备选方案是新建 `TOOL_SHELL_CONFIGS` 映射表，被否决。

首批记录（附依据）：

| 工具 | 文件 | 写入 | 依据 |
| --- | --- | --- | --- |
| `claude` | `settings.json` | `env.CLAUDE_CODE_GIT_BASH_PATH` | Claude Code 官方文档：Windows 上 Git Bash 找不到时在 `settings.json` 的 `env` 设置该变量 |
| `codebuddy` | `settings.json` | `env.CODEBUDDY_CODE_GIT_BASH_PATH` | CodeBuddy 官方环境变量文档：显式指定 Windows Git Bash 路径，且所有环境变量可写入 `settings.json` 的 `env` |
| `opencode` | `opencode.json` | 顶层 `shell` | OpenCode 官方配置文档：`shell` 指定终端与 agent 命令使用的解释器，接受绝对路径 |

`claude-internal`、`tclaude` 等同源工具未列入：没有独立文档能证明它们读取同一变量，按「有依据才声明」的原则留给后续验证。`codex`、`cursor`、`copilot`、`joycode`、`kiro`、`trae`、`dsh`、`pi`、`omp`、`hermes`、`openclaw`、`muse` 没有公开的命令解释器配置项；`workbuddy` 自带 PortableGit，不需要该配置。

### 决策 2：所有权记录放在机器本地文件 `~/.teamai/tool-shell.json`

记录形状：

```json
{
  "claude": { "file": "C:\\Users\\me\\.claude\\settings.json", "value": "C:\\Program Files\\Git\\bin\\bash.exe" }
}
```

- 记录绝对文件路径与 teamai 写入的值，用于判断「这个键现在是不是 teamai 的」。
- 放在 `~/.teamai/`（与 `managed-hooks.json`、`managed-mcp.json` 同级）而不是 checkout 的 `state.json`：Git Bash 路径是机器事实，user scope 与多个 worktree 共享同一条记录。
- 值等于记录 → teamai 拥有，可更新或删除；值不等于记录 → 用户拥有，保留。
- 备选方案（比较当前进程环境变量、或与默认安装路径比对）都不可靠：进程环境的继承与「用户显式选择同一路径」无法区分。

### 决策 3：同步入口收敛到 `reconcileHooksToAllTools`

在该函数完成工具遍历后调用新模块的 `syncToolShellSettings({ toolPaths, filterAgents, toolRoots, ... })`，并遵守：

- `opts.removeAll` 或卸载/移除路径下不写入（只清理本模块记录里的陈旧值）。
- 与钩子注入共用同一份启用集合 `filterAgents` 与已安装判断，因此 `pull`、`init`、`hooks inject` 自动覆盖，不需要在 `pull.ts` / `init.ts` 增加调用点。
- 模块内部幂等，即使同一进程内多 scope 各调用一次也不会重复写。

理由：这是所有会写工具配置的流程的唯一汇合点；在 `pull.ts` 与 `init.ts` 分头加调用点会在新增流程时漂移。备选方案是新增 `teamai shell` 命令，违反仓库「不轻易新增命令」的约定，被否决。

### 决策 4：写入语义是「点键替换」，不是整体重写

- 读取目标文件（JSON）：文件不存在 → 创建；存在但解析失败 → 告警并跳过该工具，绝不覆盖用户文件。
- 只设置目标键，其余顶层键与同层其他键原样保留；用 `writeJsonAtomic` 落盘。
- 目标值已等于期望值时不写文件（保持 mtime，便于测试与用户观察）。
- 写入的值是 Windows 原生绝对路径（`C:\...`）。OpenCode 的 `shell` 与 Claude/CodeBuddy 的 `env` 都按要求接受原生路径；JSON 序列化会负责转义。

### 决策 5：平台与缺失处理

- `process.platform !== 'win32'` 直接返回，不读文件、不告警。
- `findGitBashWindows()` 返回 `null` 时输出一条告警（说明装 Git for Windows，或让 `teamai doctor` 复查），跳过写入；不抛错、不影响 `pull`/`init` 的退出码。
- 平台与查找函数可注入，便于单元测试在非 Windows CI 上验证 Windows 分支。

### 决策 6：文件位置解析复用 `toolHome`

- 有 `toolRoots[tool]` 覆盖时，按 `resolveToolRootDir(tool, TOOLS[tool].home.dir, toolRoots)` 解析（与 `claudeUserRoot` 同口径）。
- 否则用 `toolHome(tool)`，从而继承工具 home 记录、`CLAUDE_CONFIG_DIR` 类环境变量与 XDG 迁移。
- OpenCode 的目标文件取用户配置 `opencode.json`（`toolHome('opencode')` + `opencode.json`），与 MCP/rules 写入的是同一文件，必须同样做键级手术。

## Risks / Trade-offs

- [写入值与用户显式选择相同 → 记录缺失时会被当作用户值保留] → 可接受：保留用户值就是安全的一侧；下次用户改动后 teamai 也永远不会抢回。
- [与 MCP / rules 写入同一 `opencode.json` 并发] → 都是读-改-写 + 原子写，且键不重叠；最坏结果是其中一个键被后写者覆盖为旧值，下一次 pull 会收敛。
- [Git Bash 被卸载或移动后，工具启动报错（Claude/CodeBuddy 对无效路径会失败）] → 每次同步会重新解析并更新 teamai 拥有的值；找不到时删除 teamai 拥有的值，恢复工具的默认探测。
- [OpenCode 同时存在 `opencode.json` 与 `opencode.jsonc`] → 我们只写 `opencode.json`，`jsonc` 中用户显式设置仍优先；这符合「尊重用户配置」。
- [把机器路径写进用户级配置会让多台机器不同步] → 这正是预期：路径按机器解析，团队仓库里不出现任何路径。
- [Windows 上 Git Bash 缺失时，写入被跳过，团队钩子/技能仍可能失败] → 告警明确指出原因与修复方向；`docs/guide/windows.md` 同步说明。

## Migration Plan

- 升级后第一次 `pull`/`init` 自动写入，无需迁移脚本；记录文件缺失时按「键不存在 → 写入」处理。
- 回滚到旧版本：旧版本不认识这些键，会原样保留；用户可手动删除对应键，teamai 在下次同步会按记录重新写入。
- 卸载：`uninstall` 走 `removeAll` 时按记录清理 teamai 拥有的值。

## Open Questions

无。
