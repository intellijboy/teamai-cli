# Proposal

## Why

本地 fork 曾把 npm 包改名为 `dry-martine-cli`、把 CLI 可执行文件改为 `dmtn`，并把内置 recall 子代理、规则与提示词从 `teamai-recall` 改名为 `dmtn-recall`。这些品牌改动与上游 `Tencent/teamai-cli` 的 `teamai-cli` / `teamai` 命名长期冲突，导致每次同步上游都要手工处理同一批文件。现在恢复上游品牌，让后续合并只面对真实功能差异。

## What Changes

- **BREAKING**：npm 包名由 `dry-martine-cli` 恢复为 `teamai-cli`，`bin` 由 `dmtn` 恢复为 `teamai`；CLI 不再提供 `dmtn` 命令。
- 内置 recall 子代理、规则、注入提示与 TodoWrite 提示由 `dmtn-recall` / `dmtn recall` 恢复为 `teamai-recall` / `teamai recall`。
- `agents/dmtn-recall.md` 重命名回 `agents/teamai-recall.md`，bundle 内文件名、frontmatter `name` 与正文品牌一并恢复。
- 迁移逻辑反转：`LEGACY_*` 集合改为清理旧版本部署的 `dmtn-recall` 文件与规则；显式禁用与团队自有 hook 不受影响。
- 文档、`skill-data` 与测试断言中的 `dmtn` 字样恢复为 `teamai`；`CHANGELOG.md` 的历史发布记录保持原样。
- 不改变 recall 的检索行为、缓存格式、`teamai:` 内部标记与 `~/.teamai` 路径。

## Capabilities

### New Capabilities

- `cli-branding`：定义 CLI 发布的 npm 包名、可执行文件名、内置 recall 资产的命名，以及旧 `dmtn` 命名的迁移清理。

### Modified Capabilities

无。

## Impact

- `package.json`、`package-lock.json`
- `agents/dmtn-recall.md` → `agents/teamai-recall.md`
- `src/builtin-agents.ts`、`src/builtin-rules.ts`、`src/pull.ts`、`src/index.ts`、`src/instruction-targets.ts`、`src/local-agent.ts`、`src/recall-adoption.ts`、`src/recall-toggle.ts`、`src/recall.ts`、`src/recall-log.ts`、`src/recall-quality.ts`、`src/resources/rules.ts`、`src/todowrite-hint.ts`、`src/transcript-parser.ts`、`src/types.ts`、`src/uninstall.ts`
- `skill-data/core/references/commands.md`、`skill-data/core/references/troubleshooting.md`
- 文档：`docs/usage-guide*.md`、`docs/product-overview*.md`、`docs/designs/git-native-memory.md`
- 测试：`src/__tests__/` 下约 20 个断言 recall 名称的文件
- 不涉及团队仓库内容、`.gitignore` 或 Git hook 安装逻辑
