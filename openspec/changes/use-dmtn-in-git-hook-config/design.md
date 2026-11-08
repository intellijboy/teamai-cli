# Design

## Context

Git 2.54 及以上的 config hook 由 `src/git-hook.ts` 的 `gitHookCommand(event)` 生成并写入仓库本地 config。Git 2.54 以下则由 `scriptBlock(event)` 写进 `.git/hooks/<event>`。两者都通过 `PATH="$HOME/.teamai/bin:$PATH"` 查找 CLI，而该目录目前只有 `ensureTeamaiWrapper()` 生成的 `teamai` 包装器（`src/builtin-hooks.ts`）。`package.json` 的 `bin` 只暴露 `dmtn`，所以现有命令在只有本包的环境中无法解析。

`eventsToWrite()` 会把当前 command 与期望 command 比较，不匹配即视为过期；`installGitHook()` 在写入前调用 `ensureTeamaiWrapper()`。这为旧配置迁移提供了现成机制，不需要额外的迁移版本号。hook section 名称仍为 `hook.teamai-<event>`，`removeGitHook()` 按这些名字清理。

## Goals / Non-Goals

**Goals:**

- 让 Git config hook、旧版脚本块和 `doctor` 建议行统一调用 `dmtn hook-dispatch`。
- 保持 hook 的静默、退出 0 和参数透传行为不变。
- 让已安装的旧命令在下一次 pull 时自动重写，并保留显式禁用设置。
- 在受限 PATH 下仍能解析 `dmtn`，不依赖全局 npm bin 是否可见。

**Non-Goals:**

- 不重命名 `hook.teamai-<event>` section、`.teamai` 数据目录或 `teamai_git_hook` 函数名。
- 不修改其他 AI 工具（Claude、Codex、Cursor 等）的内置 hook 命令；它们仍使用 `teamai` 和现有包装器。
- 不进行全仓库的 `teamai` → `dmtn` 品牌重命名。
- 不改变 hook 触发时机、同步内容或失败记录格式。

## Decisions

### 1. 只替换调度可执行文件，保留内部标识

`gitHookCommand()`、`scriptBlock()` 和 `guardedGitHookLine()` 中的 `teamai hook-dispatch` 改为 `dmtn hook-dispatch`；`teamai_git_hook` 函数名、`hook.teamai-<event>` section 名和 `$HOME/.teamai/bin` 路径保持不变。

理由：section 名是 `removeGitHook()`、`eventsToWrite()` 和 `gitHookStatus()` 的匹配键，重命名会让已安装 hook 变成无人清理的孤儿，并需要额外的双名迁移逻辑。函数名只是 shell 局部标识，不影响外部行为。

替代方案：把所有 `teamai` 标识一并改成 `dmtn`。放弃原因是迁移面过大，且与本请求的行为目标无关。

### 2. 在现有包装目录中同时生成 dmtn 包装器

`ensureTeamaiWrapper()` 继续生成 `teamai` 与 `teamai.cmd`，并额外生成 `dmtn` 与 Windows 的 `dmtn.cmd`，两者都指向 `resolveTeamaiEntryScript()` 并透传参数。

理由：其他工具的内置 hook 仍调用 `teamai`，不能移除旧包装器；Git hook 改为 `dmtn` 后，受限 PATH 场景需要一个同名包装器才能兑现命令里的 PATH 前缀。`~/.teamai/bin` 在 PATH 最前面，同名文件会优先于全局 bin，但两者最终指向同一个 CLI 入口。

替代方案：Git hook 直接使用绝对路径 `$HOME/.teamai/bin/teamai`。放弃原因是这与请求的 `dmtn` 命令形式不符，且绝对路径在跨机器配置中更脆弱。

### 3. 配置 hook、旧版脚本块和建议行一起改

三处渲染共用同一语义。若只改 config hook，Git 2.54 以下用户和 `core.hooksPath` 用户仍会拿到 `teamai` 命令，问题会以版本/环境差异的形式残留。

替代方案：只改 `.git/config` 路径。放弃原因是会造成同一产品在不同 Git 版本下行为不一致。

### 4. 复用现有 command 比较完成迁移

不新增迁移标记。`installGitHook()` 在下一次 pull 时发现 `hook.teamai-<event>.command` 与 `dmtn` 版本不一致，即重写该条目；`enabled=false` 等未参与比较的键保持不变。

替代方案：引入一次性迁移函数。放弃原因是现有幂等比较已经覆盖，额外状态只会增加维护面。

## Risks / Trade-offs

- **旧 hook 在下一次 pull 前仍调用 `teamai`** → 这是现状的延续；下一次 pull 会重写命令并生成 `dmtn` 包装器。文档和 doctor 已提示失败后运行 pull。
- **包装目录同时存在 `teamai` 与 `dmtn`** → 两者都指向同一入口，不会分叉行为；代价是目录里多一个文件。
- **hook section 仍显示 `teamai`** → 用户可能误以为仍调用 `teamai`；本次只改变 command，section 名保留是为迁移安全。可在后续独立变更中处理品牌统一。
- **其他工具的 hook 命令仍可能找不到 `teamai`** → 本变更不覆盖该范围；如果实际环境只安装 `dmtn`，需要后续变更统一内置 hook 的可执行文件。
- **测试假实现需要同时提供 `dmtn` 包装器** → 更新 `git-hook.test.ts` 中的 `fakeTeamai`，否则测试会误判命令未执行。

## Migration Plan

1. 发布包含新命令与 `dmtn` 包装器的版本。
2. 成员下一次执行 `teamai pull` / `dmtn pull` 时，`installGitHook()` 比较 command 并重写三个 `hook.teamai-<event>` 条目。
3. `ensureTeamaiWrapper()` 在同一轮写入 `dmtn` 与 `dmtn.cmd`。
4. 若需回滚，旧版本 CLI 的 pull 会把 command 改回 `teamai`；hook section 和数据目录不受影响，但要重新确认旧包装器存在。

## Open Questions

无。
