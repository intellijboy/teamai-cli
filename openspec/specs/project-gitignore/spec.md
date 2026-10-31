# project-gitignore Specification

## Purpose
定义 teamai 对项目根 `.gitignore` 中"工具目录"忽略块的持有与维护行为:块标记、行尾鲁棒性、去重收敛、幂等重写,以及默认忽略目录集合。它确保 pulls 绝不重复追加块,并始终同步出单一、一致的忽略块。

## Requirements

### Requirement: 识别并就地重写已存在的工具目录块
系统在同步项目 `.gitignore` 时,MUST 检测到 teamai 拥有的工具目录块已存在时**就地重写**,而不是在其后再追加一个新块;块外的用户内容 MUST 保持不变。

#### Scenario: 已存在块时就地重写
- **WHEN** 项目 `.gitignore` 已含一个 `# >>> teamai tool dirs (managed by teamai) >>>` … `# <<< teamai tool dirs <<<` 块,而其条目与期望不一致
- **THEN** 同步后文件中只保留一个该块,条目与期望集合一致,且块外的其他内容未被改变

#### Scenario: CRLF 行尾下仍能识别既有块
- **WHEN** 项目 `.gitignore` 的既有块以 CRLF(`\r\n`)换行
- **THEN** 同步仍能识别该块并就地重写,不会因为行尾而产生重复追加

### Requirement: 收敛重复的工具目录块
当文件存在多个 teamai 工具目录块时(历史残留或因行尾导致的重复),同步 MUST 将其折叠为一个块。

#### Scenario: 多个相同块折叠为单块
- **WHEN** 项目 `.gitignore` 含两个及以上内容相同的工具目录块
- **THEN** 一次同步后文件中仅剩一个工具目录块,且条目与期望集合一致

### Requirement: 内容未变化时保持幂等
当头尾读数相同、块已收敛且条目与期望一致时,同步 MUST 不重写文件。

#### Scenario: 二次同步不再写入
- **WHEN** 一次同步已将 `.gitignore` 收敛为单个块且条目与期望一致
- **THEN** 紧接的第二次同步不修改文件(不触发写入)

### Requirement: 维护默认忽略目录集合
teamai 管理的默认忽略集合 MUST 包含 `.worktree/`;在非 single-repo 模式下还 MUST 包含 `.teamai/`;此外 MUST 含每个启用工具在其 checkout 下的安装根(如 `.claude/`、`.codex/` 等)。

#### Scenario: 默认集合含 .worktree/
- **WHEN** 为项目计算 teamai 管理的忽略条目
- **THEN** `.worktree/` 始终在集合内,不受 self-mode(`single-repo`)影响

#### Scenario: 非 self 模式含 .teamai/ 与启用工具根
- **WHEN** 项目处于非 single-repo 模式且启用了 `claude`、`codex`
- **THEN** 忽略集合为 `.teamai/`、`.worktree/`、`.claude/`、`.codex/`

#### Scenario: self 模式省略 .teamai/ 但保留 .worktree/
- **WHEN** 项目处于 single-repo(self)模式且启用 `claude`
- **THEN** 忽略集合为 `.worktree/`、`.claude/`(不含 `.teamai/`)
