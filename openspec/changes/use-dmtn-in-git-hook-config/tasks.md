# Tasks

## 1. 生成 dmtn 调度命令

- [ ] 1.1 修改 `src/git-hook.ts`：`gitHookCommand()`、`scriptBlock()`、`guardedGitHookLine()` 的可执行文件由 `teamai` 改为 `dmtn`，保留 `teamai_git_hook` 函数名、`hook.teamai-<event>` section 名和 `$HOME/.teamai/bin` 路径；验证方式：`grep -n "teamai hook-dispatch" src/git-hook.ts` 无匹配，且 `gitHookCommand('post-merge')` 包含 `dmtn hook-dispatch post-merge --tool git`。
- [ ] 1.2 更新 `src/__tests__/git-hook.test.ts`：把假包装器从 `~/.teamai/bin/teamai` 改为 `dmtn`，更新命令串和 `doctor` 建议断言；验证方式：`npx vitest run src/__tests__/git-hook.test.ts` 通过且覆盖 config hook、旧版脚本块、guarded line。
- [ ] 1.3 检查 `src/__tests__/e2e/git-hook-new-worktree.test.ts` 及其他 Git hook 端到端断言，只在断言完整命令或包装器名称时更新；验证方式：`npx vitest run src/__tests__/e2e/git-hook-new-worktree.test.ts` 通过。

## 2. 受限 PATH 的 dmtn 包装器

- [ ] 2.1 修改 `src/builtin-hooks.ts` 的 `ensureTeamaiWrapper()`：在现有 `teamai`、`teamai.cmd` 之外生成 `dmtn` 与 Windows 的 `dmtn.cmd`，两者都调用 `resolveTeamaiEntryScript()` 并透传参数；验证方式：新增或更新 `src/__tests__/hooks-wrapper.test.ts`，断言两个包装器都存在且内容包含 `exec`/`index.js`。
- [ ] 2.2 保留 `teamai` 包装器以支持其他工具仍在使用的内置 hook，避免本变更影响非 Git hook 路径；验证方式：现有 `hooks-wrapper.test.ts` 与 `hooks-shell-check.test.ts` 通过。
- [ ] 2.3 新增或扩展用例：Git 以只含 `git` 的最小 PATH 运行 config hook 时仍能找到 `dmtn`；验证方式：`npx vitest run src/__tests__/git-hook.test.ts` 中对应用例通过。

## 3. 旧配置迁移与诊断

- [ ] 3.1 确认 `installGitHook()` 在已有 `teamai hook-dispatch` 命令时将其识别为过期，并在下一次 pull 重写为 `dmtn`；验证方式：新增用例先写入旧命令，再调用 `installGitHook()`，断言命令已更新。
- [ ] 3.2 验证迁移保留 `hook.teamai-<event>.enabled=false` 和其他非 teamai hook；验证方式：`src/__tests__/git-hook.test.ts` 的禁用与移除用例通过。
- [ ] 3.3 确认 `doctor` 在不写 hook 的场景输出 `dmtn hook-dispatch` 建议行；验证方式：`npx vitest run src/__tests__/git-hook.test.ts` 中 `describeMissingGitHook` 用例通过。

## 4. 文档与真实 CLI 验证

- [ ] 4.1 用 `grep -rn "teamai hook-dispatch" docs skill-data README*` 检查是否有需要更新的文档；只有直接展示 Git hook 生成命令的内容才修改，并保持中英文文档同步。
- [ ] 4.2 运行 `npm run build`、`npx tsc --noEmit`、`npm run lint`，验证编译、类型和 lint 通过。
- [ ] 4.3 运行 `npx vitest run src/__tests__/git-hook.test.ts src/__tests__/hooks-wrapper.test.ts`，验证相关单元测试通过。
- [ ] 4.4 用真实 CLI 做一次端到端验证：在临时 Git 仓库中安装 hook，执行 `git config --get hook.teamai-post-merge.command` 确认调用 `dmtn`，确认 `~/.teamai/bin/dmtn` 存在，并用最小 PATH 运行 `git hook run post-merge -- 0`；把实际通过的记录附到 PR。

## Workflow follow-up

- 按项目评审要求完成变更后归档本 change。
- 归档后确认 `openspec/specs/git-hook-sync/spec.md` 已生成且内容与实现一致。
