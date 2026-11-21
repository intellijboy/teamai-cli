# Spec Delta

## Purpose

定义团队 CLI 对外发布的包名、可执行文件名，以及内置 recall 子代理、规则与提示所使用的品牌命名，确保 fork 与上游保持一致的 `teamai` 品牌。

## ADDED Requirements

### Requirement: 发布包与可执行文件使用 teamai 品牌

npm 包 MUST 命名为 `teamai-cli`，其 `bin` MUST 只暴露 `teamai`。安装后 MUST NOT 提供 `dmtn` 命令，也 MUST NOT 把 `dmtn` 识别为 CLI 可执行文件。

#### Scenario: 安装后调用 CLI

- **WHEN** 用户安装该 npm 包
- **THEN** `teamai` 可执行文件存在并可运行
- **AND** `dmtn` 不再是该包提供的命令

#### Scenario: recall 归因识别调用方

- **WHEN** 解析一次 recall 运行是由哪个可执行文件发起的
- **THEN** `teamai` 被识别为 CLI 调用方
- **AND** `dmtn` 不再被识别为 CLI 调用方

### Requirement: 内置 recall 资产使用 teamai 命名

系统 MUST 以 `teamai-recall` 名称部署内置 recall 子代理与规则，并在注入提示和 TodoWrite 提示中调用 `teamai-recall` 或 `teamai recall`。部署结果 MUST NOT 包含 `dmtn-recall` 文件或规则。

#### Scenario: pull 部署 recall 资产

- **WHEN** 用户运行 `teamai pull`
- **THEN** 内置子代理文件名为 `teamai-recall.md`
- **AND** 内置规则名为 `teamai-recall`
- **AND** 目标目录不新增 `dmtn-recall` 文件或规则

#### Scenario: 工具没有 recall 子代理

- **WHEN** 目标工具不支持 `teamai-recall` 子代理
- **THEN** 注入的提示让 agent 直接运行 `teamai recall`

#### Scenario: TodoWrite 提示

- **WHEN** TodoWrite 后触发提示
- **THEN** 提示建议调用 `teamai-recall` 子代理

### Requirement: 旧 dmtn 命名自动清理

系统 MUST 在 pull、recall toggle 与 uninstall 时识别并移除旧版本部署的 `dmtn-recall` 子代理文件与规则，同时 MUST NOT 删除或改写其他 agent、rule 及用户内容。

#### Scenario: 从 dmtn 版本升级

- **WHEN** 目标目录已有旧版本部署的 `dmtn-recall` 子代理或规则
- **THEN** 下一次 pull 或 recall toggle 会移除该旧资产
- **AND** 当前 `teamai-recall` 资产已就位

#### Scenario: 卸载清理

- **WHEN** 用户卸载 CLI
- **THEN** 旧 `dmtn-recall` 资产与当前 `teamai-recall` 资产一并移除
- **AND** 其他 agent 与 rule 保持不变

### Requirement: 内部 recall 契约保持不变

品牌还原 MUST NOT 改变 recall 的检索行为、缓存格式、`teamai:recalled-doc-ids` 标记、`teamai:recall:start` 运行 ID、`[teamai:recall-rules:*]` 块标记与 `~/.teamai` 路径。

#### Scenario: 升级后继续使用已有 recall 数据

- **WHEN** 用户从 `dmtn` 版本升级并运行 recall
- **THEN** 已有 recall 缓存与运行记录仍可读取
- **AND** 注入块的标记格式与升级前一致
