# Spec Delta

## Purpose

定义 Git 生命周期 hook 在安装与迁移时的调度命令约定，确保项目仓库的 Git 操作始终调用当前发布包实际提供的 CLI 可执行文件，并在受限 PATH 下仍能完成团队资源同步。

## ADDED Requirements

### Requirement: Git config hook 使用 dmtn 调度

系统在 Git 2.54 及以上安装 config hook 时，`command` MUST 调用 `dmtn hook-dispatch <event> --tool git`，MUST NOT 调用 `teamai hook-dispatch`。

#### Scenario: 安装三类 config hook
- **WHEN** 在 Git 2.54 及以上，为仓库安装 `post-checkout`、`post-merge`、`post-rewrite` 三类 config hook
- **THEN** 每个 `hook.teamai-<event>.command` 都调用 `dmtn hook-dispatch <event> --tool git`
- **AND** 命令字符串中不出现 `teamai hook-dispatch`

### Requirement: 旧版脚本块与建议行同样使用 dmtn

系统在 Git 2.54 以下写入 `.git/hooks/<event>` 的标记块，以及 `doctor` 为无法自动安装 hook 的仓库给出的手工建议行，MUST 同样调用 `dmtn hook-dispatch`。

#### Scenario: 旧版 Git 的脚本块
- **WHEN** 在 Git 2.54 以下安装 hook，且目标脚本不存在
- **THEN** 新建的 `.git/hooks/<event>` 标记块执行 `dmtn hook-dispatch <event> --tool git`
- **AND** 标记块之外的内容不受影响

#### Scenario: hook 管理器占用 hooks 路径时的建议
- **WHEN** `core.hooksPath` 已设置，或 `.git/hooks/<event>` 不是可执行的 shell 脚本，导致 teamai 不写入 hook
- **THEN** `doctor` 给出的建议命令使用 `command -v dmtn` 与 `dmtn hook-dispatch`

### Requirement: 受限 PATH 下提供 dmtn 包装器

安装 Git hook 时，系统 MUST 在 `~/.teamai/bin` 提供 `dmtn` 包装器；在 Windows 上还 MUST 提供 `dmtn.cmd`。该包装器 MUST 调用当前 CLI 的入口脚本并透传参数。

#### Scenario: Git 子进程没有登录 PATH
- **WHEN** Git 以只包含 `git` 的最小 PATH 运行已安装的 hook
- **THEN** hook 仍通过 `$HOME/.teamai/bin` 找到 `dmtn` 并执行 `hook-dispatch`
- **AND** 不依赖全局 npm bin 是否在 PATH 中

### Requirement: 旧配置迁移保留禁用设置

系统在下一次 pull 时 MUST 将使用 `teamai hook-dispatch` 的旧 config hook 识别为过期并重写为 `dmtn`，同时 MUST 保留 `hook.teamai-<event>.enabled=false` 等显式禁用设置和其他非 teamai hook。

#### Scenario: 已安装旧命令后再次 pull
- **WHEN** 仓库已有调用 `teamai hook-dispatch` 的 `hook.teamai-post-merge.command`，且用户显式设置了 `hook.teamai-post-merge.enabled=false`
- **THEN** 下一次 pull 后 `command` 调用 `dmtn hook-dispatch`
- **AND** `enabled=false` 保持不变，其他命名 hook 不被删除或重写

### Requirement: 调度失败不阻塞 Git 操作

当 `dmtn` 缺失、返回非零或输出错误时，Git hook MUST 保持静默并返回 0，不得让 `git pull`、`git checkout` 或 `git worktree add` 因 hook 失败而失败。

#### Scenario: dmtn 不可用
- **WHEN** Git 运行 `post-checkout` hook 时 `dmtn` 不存在或执行失败
- **THEN** hook 不输出内容，退出码为 0
- **AND** Git 操作按自身结果结束
