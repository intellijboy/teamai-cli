# Tasks

## 1. 包与可执行文件还原

- [x] 1.1 修改 `package.json`：`name` 改为 `teamai-cli`，`bin` 改为 `{ "teamai": "dist/index.js" }`，`install:local` 脚本改为卸载 `teamai-cli`；同步 `package-lock.json` 的根包名。验证：`node -p "require('./package.json').name + ' ' + Object.keys(require('./package.json').bin)"` 输出 `teamai-cli teamai`，且 `grep -n '"dmtn"' package.json package-lock.json` 无匹配。
- [x] 1.2 修改 `src/recall-adoption.ts`：二进制识别正则去掉 `dmtn`，`RECALL_SUBAGENT` 改为 `teamai-recall`。验证：`npx vitest run src/__tests__/recall-attribution.test.ts` 通过，且用例覆盖 `dmtn` 不再被识别为 CLI 调用方。

## 2. 内置 recall 资产还原

- [x] 2.1 用 `git mv agents/dmtn-recall.md agents/teamai-recall.md` 重命名，并改回 frontmatter `name`、正文、命令示例与 `--caller` 中的 `teamai` 品牌。验证：`git ls-files agents` 只列出 `teamai-recall.md`，`grep -ri dmtn agents/` 无匹配，`npx vitest run src/__tests__/agents.test.ts` 通过。
- [x] 2.2 修改 `src/builtin-agents.ts`：`BUILTIN_AGENT_NAMES` 改为 `teamai-recall`，`LEGACY_BUILTIN_AGENT_NAMES` 改为 `dmtn-recall`，注释与 `--skipRecall` 过滤条件跟随。验证：`npx vitest run src/__tests__/builtin-agents.test.ts` 通过，且覆盖“部署当前名并移除旧 `dmtn-recall`”。
- [x] 2.3 修改 `src/builtin-rules.ts`：`BUILTIN_RULE_NAMES` 改为 `teamai-recall`，规则正文与中英文提示改回 `teamai-recall`，`LEGACY_RULE_NAMES` 改为 `dmtn-recall`，并确认 `DEPLOYED_RECALL_RULE_HASHES` 含旧 `dmtn` 规则体哈希（缺失时用旧文本计算后补入）。验证：`npx vitest run src/__tests__/builtin-rules.test.ts src/__tests__/recall-rules.test.ts` 通过。
- [x] 2.4 修改 `src/pull.ts`、`src/instruction-targets.ts`、`src/todowrite-hint.ts`、`src/local-agent.ts`、`src/types.ts`、`src/transcript-parser.ts`、`src/recall.ts`、`src/recall-log.ts`、`src/recall-quality.ts` 中的 `dmtn-recall` / `dmtn recall` 文案与注释，恢复 `teamai-recall` / `teamai recall`。验证：`grep -rn dmtn src/pull.ts src/instruction-targets.ts src/todowrite-hint.ts src/local-agent.ts src/types.ts src/transcript-parser.ts src/recall.ts src/recall-log.ts src/recall-quality.ts` 无匹配，且 `npx vitest run src/__tests__/pull-agents-cleanup.test.ts src/__tests__/pre-push-sync.test.ts src/__tests__/todowrite-hint.test.ts` 通过。
- [x] 2.5 修改 `src/recall-toggle.ts` 与 `src/resources/rules.ts`：清理扫描保留 `teamai-recall` 与 `dmtn-recall` 两个名字，当前名以 `teamai-recall` 为准。验证：`npx vitest run src/__tests__/recall-toggle.test.ts src/__tests__/rules.test.ts` 通过，且用例覆盖关闭 recall 时同时移除旧 `dmtn-recall`。
- [x] 2.6 修改 `src/uninstall.ts`：通过 `LEGACY_*` 集合清理 `dmtn-recall`，保留对其他 agent/rule 的保护。验证：`npx vitest run src/__tests__/uninstall.test.ts` 通过，且用例覆盖卸载移除旧 `dmtn-recall` 而保留用户内容。

## 3. 命令帮助、skill-data 与文档

- [x] 3.1 修改 `src/index.ts` 中 `--caller` 与 TodoWrite 命令描述里的 `dmtn-recall`，运行 `npx vitest run commands-reference -u` 重新生成 `skill-data/core/references/commands.md`。验证：`grep -n dmtn skill-data/core/references/commands.md` 无匹配，`npx vitest run commands-reference` 通过。
- [x] 3.2 修改 `skill-data/core/references/troubleshooting.md` 中的 `dmtn` 文案。验证：`grep -rn dmtn skill-data/` 无匹配。
- [x] 3.3 同步修改 `docs/usage-guide.md`、`docs/usage-guide.zh-CN.md`、`docs/product-overview.md`、`docs/product-overview.zh-CN.md`、`docs/designs/git-native-memory.md` 中的 `dmtn` 文案（`docs/changes/archive` 历史记录除外）。验证：`grep -rn dmtn docs/ | grep -v 'openspec\|changes/archive'` 无匹配。

## 4. 集成验收

- [x] 4.1 运行 `npm run build`、`npx tsc --noEmit`、`npm run lint`，验证编译、类型与 lint 通过。
- [x] 4.2 运行 `npx vitest run src/__tests__/agents.test.ts src/__tests__/builtin-agents.test.ts src/__tests__/builtin-rules.test.ts src/__tests__/recall-attribution.test.ts src/__tests__/recall-rules.test.ts src/__tests__/recall-toggle.test.ts src/__tests__/uninstall.test.ts`；与本变更相关的用例全部通过。剩余失败均为本机既有的 Windows 符号链接 `EPERM`、临时目录清理与 hermes 用例问题（在 HEAD 上同样失败），不计入本变更。
- [x] 4.3 用真实 CLI 做一次端到端验证：构建后在临时目录预置旧 `dmtn-recall.md` 与规则文件，运行 `node <repo>/dist/index.js recall enable`（或 `pull`），确认旧文件被移除、`teamai-recall` 资产已部署，且 `node <repo>/dist/index.js --help` 显示 `teamai` 命令；把实际通过的记录附到 PR。
- [x] 4.4 运行 `grep -ri dmtn --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=.worktree --exclude-dir=openspec .`，确认剩余命中仅为旧名迁移清理（`LEGACY_*`、`recall-toggle`/`rules` 的旧名扫描）及其测试用例，以及 `CHANGELOG.md` 与 `openspec/` 历史/规划文档。

## Workflow follow-up

- 按项目评审要求完成变更后归档本 change。
- 归档后确认 `openspec/specs/cli-branding/spec.md` 已生成且内容与实现一致。
