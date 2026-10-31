# Proposal

## Why

`dmtn/teamai pull`(project 作用域)会把 teamai 管理的一批忽略目录写进项目根 `.gitignore`,
包裹在 `# >>> teamai tool dirs (managed by teamai) >>>` … `# <<< teamai tool dirs <<<` 标记块中,
理想行为是检测到块已存在就**就地重写**。当前实际行为是**没有识别已存在块,每次 pull 都往末尾追加一个新块**,
导致相同块越积越多。

根因有二:
1. `.gitignore` 在磁盘上是 CRLF(仓库 `core.autocrlf=true` 时 git 检出会把 LF 转成 CRLF),代码用
   `text.split('\n')` 后每行仍带尾部 `\r`,而标记常量不含 `\r`,导致整行精确匹配失败,旧块永远"看不见"。
2. 删除块时只用一次 `indexOf` 移除**第一个**匹配块,对已重复的文件无法收敛回单块。

同时需要一个默认忽略目录 `.worktree/`。

## What Changes

- **容忍 CRLF**:块匹配(`readToolDirsBlock` / `withoutToolDirsBlock`)改用 `split(/\r?\n/)`,使 CRLF 文件下的标记块能被识别并重写,而非重复追加。
- **收敛重复块**:`withoutToolDirsBlock` 循环删除所有匹配的标记块,多块文件收敛为单块;输出统一归一化为 LF,使 `next === current` 幂等成立,后续 pull 不再写。
- **新增默认忽略项**:`teamaiGitignoreEntries` 无条件追加默认忽略目录 `.worktree/`(紧跟可选的 `.teamai/` 之后,不受 `isSelfMode` 限制)。
- **测试**:既有断言随 `.worktree/` 新增而更新;新增 CRLF 容忍、重复块收敛、二次同步幂等的用例。

## Capabilities

### New Capabilities
- `project-gitignore`: 管理项目根 `.gitignore` 中 teamai 持有的"工具目录"忽略块——识别、就地重写、去重收敛,并维护默认忽略目录集合(`.teamai/`、`.worktree/`、启用工具根)。

### Modified Capabilities
- (无:项目当前无既有规格)

## Impact

- **代码**:`src/tool-gitignore.ts`(`readToolDirsBlock`、`withoutToolDirsBlock` 的行尾与多块处理,`teamaiGitignoreEntries` 默认项)。
- **测试**:`src/__tests__/tool-gitignore.test.ts`。
- **调用方**:`init.ts`、`pull.ts`、`uninstall.ts` 均通过 `syncProjectToolGitignore`/`removeProjectToolGitignore` 复用,签名不变,无需改动。
- **CLI 命令/输出**:不新增命令,不改对外输出文案。