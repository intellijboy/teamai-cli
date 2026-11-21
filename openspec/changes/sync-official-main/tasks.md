# Tasks

## 1. 接入官方仓库并更新 main

- [x] 1.1 添加 `upstream` remote（`https://github.com/Tencent/teamai-cli.git`）并执行 `git fetch upstream`；验证：`git remote -v` 同时列出 `origin` 与 `upstream`，`git rev-parse upstream/main` 等于官方 main 的 `030c2c77`。
- [x] 1.2 执行 `git branch -f main upstream/main` 更新本地 `main`；验证：`git rev-parse main` 与 `git rev-parse upstream/main` 一致，且 `git branch -vv` 显示 `dmtn-main` 未变。

## 2. 合并与冲突解决

- [x] 2.1 记录回滚点 `54034111`，在 `dmtn-main` 上执行 `git merge main`；验证：`git status` 列出预期的 56 个冲突文件，`git merge --abort` 可用作回滚。
- [x] 2.2 解决核心业务代码冲突（`src/pull.ts`、`src/push.ts`、`src/init.ts`、`src/uninstall.ts`、`src/hooks.ts`、`src/index.ts`、`src/team-scripts.ts` 等），保留 `dmtn-main` 功能语义并采纳官方结构调整；验证：`npx tsc --noEmit` 无语法/类型错误。
- [x] 2.3 解决资源层与工具适配冲突（`src/resources/*.ts`、`src/opencode-hooks.ts`、`src/omp-hooks.ts`、`src/cursor-user-rules.ts`、`src/project-agent-root.ts` 等）；验证：`npx tsc --noEmit` 通过，且 `grep -rn "<<<<<<<\|>>>>>>>" src/` 无残留。
- [x] 2.4 解决 `package.json` 冲突并以官方为基线保留本地依赖/脚本，删除冲突标记后运行 `npm install` 重新生成 `package-lock.json`；验证：`node -p "require('./package.json').name + ' ' + Object.keys(require('./package.json').bin)"` 输出 `teamai-cli teamai`，`npm ls --depth=0` 无缺失依赖。
- [x] 2.5 解决文档与生成文件冲突（`AGENTS.md`、`CHANGELOG.md`、`docs/**`、`skill-data/setup/references/join-member.md`），并运行 `node scripts/check-docs.mjs --write` 重新生成 `skill-data/core/references/commands.md`；验证：`grep -rn "<<<<<<<\|>>>>>>>" AGENTS.md CHANGELOG.md docs/ skill-data/` 无残留。
- [x] 2.6 解决测试文件冲突（`src/__tests__/*.test.ts`），保留本地功能用例并按合并后的实现调整断言；验证：`grep -rn "<<<<<<<\|>>>>>>>" src/__tests__/` 无残留。
- [x] 2.7 完成合并提交（`git add -A && git commit`）；验证：`git log --oneline -1` 为 merge commit，`git status` 干净。

## 3. 验证与自查

- [x] 3.1 运行 `npm run build`、`npx tsc --noEmit`、`npm run lint`，验证全部通过。
- [ ] 3.2 运行与本地功能相关的单元测试（至少 `src/__tests__/agents.test.ts`、`builtin-agents.test.ts`、`builtin-rules.test.ts`、`recall-toggle.test.ts`、`rules.test.ts`、`uninstall.test.ts`、`pull-agents-cleanup.test.ts`），确认本地功能未回归；记录与本合并无关的既有环境失败。**未完成**：本机 Node 24 下 vitest 4 在加载官方 `setupFiles`（`helpers/teardown-writers.ts`）时即失败，测试无法执行；本机无 Node 22。已用 build、tsc、lint 与真实 CLI 验证替代，单测留给 CI（Node 22）执行。
- [x] 3.3 用真实 CLI 做一次端到端验证：构建后运行 `node dist/index.js --help` 与 `node dist/index.js recall enable`（临时 HOME），确认 `teamai` 命令与 recall 资产正常；把实际通过的记录附到 PR/说明。
- [x] 3.4 自查合并 diff：逐项确认 `dmtn-main` 的本地功能（model provider、OpenCode/omp hooks、tool-roots、team scripts、slash commands、project-gitignore、cli-branding）仍然存在，且共享状态（配置、锁文件、交付记录）的 reader/writer 一致。

## Workflow follow-up

- 由用户决定是否推送到 `origin/dmtn-main`。
- 合并稳定后归档本 change。
