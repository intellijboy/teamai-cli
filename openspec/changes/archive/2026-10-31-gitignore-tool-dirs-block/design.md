# Design

## Context

动机见 `proposal.md - Why`。当前实现集中在单一模块 `src/tool-gitignore.ts`,所有块读写入口(`syncProjectToolGitignore` / `removeProjectToolGitignore`)都复用里的纯函数 `readToolDirsBlock` / `withoutToolDirsBlock` / `withToolDirsBlock`。磁盘上的 `.gitignore` 在 Windows + 仓库 `core.autocrlf=true` 下以 CRLF 检出;`readFileSafe` / `writeFile` 均原样读写,不吞 `\r`。调用方仅 `init.ts` / `pull.ts` / `uninstall.ts` 三个,均走 `syncProjectToolGitignore` / `removeProjectToolGitignore`,签名不变。

## Goals / Non-Goals

**Goals:**
- 让块检测在 LF 与 CRLF 下行尾下均可靠,已存在则就地重写而非重复追加。
- 对已重复(多块)文件能一次性收敛为单块。
- 同步幂等:内容未变时不重写。
- 默认忽略集合加入 `.worktree/`。

**Non-Goals:**
- 不引入新 CLI 命令,不改对外输出文案。
- 不改动 `init/pull/uninstall` 的调用点。
- 不处理其他工具的 `.gitignore` 管理(仅项目根)。

## Decisions

- **Decisions: 行尾鲁棒性——`split(/\r?\n/)` 而非 `split('\n')`。** 把 `readToolDirsBlock` / `withoutToolDirsBlock` 的分行改为按 `/\r?\n/` 切分,天然剥掉每行尾部 `\r`,使 CRLF 下的标记块能被整行匹配到。备选「仅在匹配时去 `\r`、写盘保留原行尾」:更外科,但需在 IO 边界检测并重放 EOL,徒增复杂度;且无论如何 git 的 `autocrlf` 都会再规范行尾,收益被抵消。故选简易统一的 LF 归一化。
- **Decision: 多块收敛——`withoutToolDirsBlock` 循环删除**所有匹配的 `START…END` 块,而非只取第一个 `indexOf`。单块删除改造成循环后,任意 N 块文件一次同步即回到单块;配合 `withToolDirsBlock` 末尾重构单块,`next === current` 在收敛后成立,达成幂等。
- **Decision: 默认项 `.worktree/`——在 `teamaiGitignoreEntries` 无条件 `push('.worktree/')`。** 紧跟可选的 `.teamai/` 之后,不受 `isSelfMode` 限制:`.worktree/` 是本地暂存/工作树目录,任何模式都应忽略(`.teamai/` 是需在 self 模式保留的提交知识,故保持条件)。
- **Decision: 幂等判断位置不变。** 仍由 `syncProjectToolGitignore` 以 `next === current`(公共归一化到 LF 的文本比较)决定是否 `writeFile`。由 `\r?\n` 拆分+`\n` 重连统一输出,故首写后再次读取即为 LF、幂等成立。

## Risks / Trade-offs

- **归一化写盘把整文件换行统一为 LF** → 首次修复可能把它从 CRLF 翻成 LF。缓解:仓库 `core.autocrlf=true` 下 `git diff` 对行尾差异归一化,差异仍干净;且这是幂等的一次性收敛。即便日后其他工具写回 CRLF,`\r?\n` 容忍使其仍可识别,不会复发累积。
- **循环删除所有带 teamai 标记的块** → 若用户手工撰写了同标记块,也会被收敛。缓解:标记为 teamai 私有、全新,该块本就由 teamai 持有,符合预期。
- **`split(/\r?\n/)` 对孤立 `\r`(非 CRLF)不拆行** → `.gitignore` 现实罕见且无功能影响;仍能整行匹配到标记。

## Migration Plan

- 发布后首次 `dmtn pull` 会自动把当前已重复的 `.gitignore` 收敛为单块(含 `.worktree/`),无需手工干预。
- 回滚:还原旧二进制即可;已收敛的 `.gitignore` 保留不会造成错误,只是多一行默认忽略。