# Design

## Context

品牌偏离来自两个本地提交：`a9825432` 把包名与 `bin` 改为 `dry-martine-cli` / `dmtn`，`eeb1bd74` 把内置 recall 子代理、规则、注入提示与测试从 `teamai-*` 改为 `dmtn-*`，并同时引入了 `LEGACY_*` 清理机制。此后还有多轮功能提交与一次上游合并，因此不能直接 revert：品牌字符串已与后续逻辑交织，而清理机制本身需要保留、只是方向反转。上游 `origin/main` 的 `package.json` 为 `teamai-cli` / `teamai`，`agents/teamai-recall.md` 也存在，可作为目标状态的对照。

## Goals / Non-Goals

**Goals:**

- 让 `package.json`、`bin`、内置 recall 资产命名与上游一致。
- 保留并反转升级清理机制：新版本清理旧 `dmtn-recall`。
- 让 `grep -ri dmtn` 在运行时源码、测试、skill-data 与用户文档中不再命中（`CHANGELOG.md` 与归档变更记录除外）。

**Non-Goals:**

- 不 revert 功能提交，不改动 recall 检索行为、缓存格式或 `teamai:` 内部标记。
- 不修改 `src/model/providers.json` 中与品牌无关的本地改动。
- 不为已安装 `dry-martine-cli` 的用户提供自动迁移命令；切换通过重新安装完成。
- 不改写 `CHANGELOG.md` 的历史发布记录与 `openspec/changes/archive/` 下的历史文档。

## Decisions

### 1. 在当前代码上逐处还原，而不是 revert 提交

把可执行名、资产名和提示文本直接改回 `teamai`，同时把 `LEGACY_*` 集合改为 `dmtn-recall`。

理由：`eeb1bd74` 之后还有合并与功能提交，revert 会冲突并可能丢失依赖清理机制的改动；逐处还原的 diff 更小、可逐文件审查。

替代方案：`git revert eeb1bd74 a9825432`。放弃原因是与 `cc90feda` 等后续合并冲突，且会连同清理逻辑一起回退。

### 2. 包名与 bin 直接对齐上游

`package.json` 的 `name` 改为 `teamai-cli`、`bin` 改为 `teamai`，`package-lock.json` 的根包名同步，`install:local` 脚本改为卸载 `teamai-cli`。`src/model/providers.json` 的火山引擎名称改动与品牌无关，保持现状。

理由：这是上游的既有发布身份，也是减少后续 `package.json` 冲突的最小状态。

替代方案：保留 `dry-martine-cli` 包名、只把 `bin` 增加 `teamai`。放弃原因是不满足“全面还原”，且包名仍会在每次同步时冲突。

### 3. 迁移机制反转，而不是删除

- `BUILTIN_AGENT_NAMES` / `BUILTIN_RULE_NAMES` 改为 `teamai-recall`。
- `LEGACY_BUILTIN_AGENT_NAMES` / `LEGACY_RULE_NAMES` 改为 `dmtn-recall`。
- `DEPLOYED_RECALL_RULE_HASHES` 保留历史哈希，并确认包含旧 `dmtn` 规则体的哈希，使未编辑的旧副本可被识别与清理。
- `recall-toggle.ts` 与 `resources/rules.ts` 中同时列出两个名字的清理扫描保持两名字，用于识别旧资产。
- `recall-adoption.ts` 的二进制正则去掉 `dmtn`，`RECALL_SUBAGENT` 改为 `teamai-recall`。

理由：用户从 `dmtn` 版本升级后，目标工具目录里可能已有 `dmtn-recall` 文件；保留清理逻辑才能兑现“下一次 pull 自动清理”，同时不误删用户编辑过的内容。

替代方案：直接删除 `LEGACY_*`。放弃原因是升级后会遗留旧子代理/规则，工具可能同时加载两份。

### 4. `agents/dmtn-recall.md` 重命名回 `agents/teamai-recall.md`

用 `git mv` 保留历史，frontmatter `name`、正文品牌、命令行示例与 `--caller` 一并改为 `teamai`。

理由：bundle 内文件名决定部署后的文件名与 `--skipRecall` 过滤条件，必须与代码中的常量一致。

### 5. 生成文件用既有流程更新

`skill-data/core/references/commands.md` 由 Commander 命令表生成：改完 `src/index.ts` 的命令/选项描述后，用 `npx vitest run commands-reference -u` 重新生成，不手工编辑。

### 6. 测试与文档同步

测试断言从 `dmtn-recall` 改回 `teamai-recall`，并把“清理旧命名”的用例改为清理 `dmtn-recall`。中英文文档（`docs/usage-guide*.md`、`docs/product-overview*.md`、`docs/designs/git-native-memory.md`）同步改回 `teamai`。

## Risks / Trade-offs

- **已发布包改名是破坏性变更** → 在发布说明中写明需要卸载 `dry-martine-cli` 并安装 `teamai-cli`；旧包的全局安装不会自动消失。
- **旧 `dmtn-recall` 规则被用户编辑过则保留** → 与现有 `isDeployedRecallRule` 策略一致，避免误删用户内容。
- **哈希集合遗漏旧规则体** → 实施时用旧版本规则文本计算哈希并加入集合，测试覆盖“旧 dmtn 规则被识别为已部署”。
- **仍有本地功能提交与上游差异** → 本变更只消除品牌冲突，不承诺 fork 与上游零差异；后续同步仍需按功能提交处理。

## Migration Plan

1. 发布 `teamai-cli` 新版本。
2. 已安装 `dry-martine-cli` 的用户执行 `npm uninstall -g dry-martine-cli`，再安装 `teamai-cli`。
3. 下一次 `teamai pull` / `teamai recall enable` 清理旧 `dmtn-recall` 资产并部署 `teamai-recall`。
4. 回滚：重新安装旧 `dry-martine-cli` 版本；其 `LEGACY_*` 会清理 `teamai-recall`，工具目录不残留两份。

## Open Questions

无。
