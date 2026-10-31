# Tasks

## 1. 实现行尾鲁棒与多块收敛(src/tool-gitignore.ts)

- [x] 1.1 `readToolDirsBlock` 改为 `text.split(/\r?\n/)` 解行,使 CRLF 下标记块可被识别;验证:对 `buildToolDirsBlock` 产出的文本再套一次 `\r\n` 转换后传入,`readToolDirsBlock` 仍返回相同条目
- [x] 1.2 `withoutToolDirsBlock` 改为 `split(/\r?\n/)` 且循环删除所有 `START…END` 匹配块,保留块外内容与相邻空行分隔线处理;验证:传入含两个相同块的文本,返回仅保留块外内容且只剩单块的期望结果
- [x] 1.3 确认 `withToolDirsBlock`/`syncProjectToolGitignore` 输出统一为 LF 后幂等成立;验证:`npx vitest run src/__tests__/tool-gitignore.test.ts` 中既有 idempotent/no-op 用例仍通过

## 2. 默认忽略目录 .worktree

- [x] 2.1 `teamaiGitignoreEntries` 在可选 `.teamai/` 之后无条件 `push('.worktree/')`;验证:`teamaiGitignoreEntries` 返回值始终含 `.worktree/`(含 self 模式)

## 3. 测试(tool-gitignore.test.ts)

- [x] 3.1 更新既有断言以纳入 `.worktree/`(fire 组同步用例 L110/L115/L120/L128/L154 期望数组);验证:更新后 `npx vitest run src/__tests__/tool-gitignore.test.ts` 全绿
- [x] 3.2 新增 CRLF 用例:`withToolDirsBlock`/`readToolDirsBlock` 在 CRLF 输入下识别并重写既有块而非重复追加;验证:新增用例在测试运行中通过
- [x] 3.3 新增多块收敛用例:含两个相同块的文本经 `withToolDirsBlock` 后折叠为单块,且二次调用幂等;`syncProjectToolGitignore` 对预置重复块同步后只剩单块、二次返回 `false`;验证:新增用例通过

## 4. 集成与端到端验证

- [x] 4.1 `npm run build` + `npx tsc --noEmit` + `npm run lint` 通过;验证:三条命令退出码为 0
- [x] 4.2 用真实 CLI 对当前工作区 `.gitignore`(2 个 CRLF+LF 混合块)执行一次 project 作用域同步,收敛为单个块且含 `.worktree/`;立即再执行一次确认不再写入;验证:`git diff .gitignore` 仅显示收敛差异、第二次运行无变更

## Workflow follow-up

- 验收通过后,对本次 change 运行 `/opsx:archive` 归档,并同步 delta spec 到主规格。
- 归档后确认 `openspec/specs/project-gitignore/spec.md` 含完整 Purpose 与各 requirement。