# 模型 Provider 配置注入（`teamai model inject`）设计方案

> 目标：一条命令把本地已安装的 AI 工具指向某个 provider 的 OpenAI/Anthropic 兼容端点与模型列表。
> 参考实现：`dry-martine-harness/scripts/model`（provider 中立的 `*.model.json` → 各工具原生配置）。
> 范围：10 个工具；Cursor 不支持。

## 1. 背景

团队各成员的 AI 工具需要统一指向团队约定的模型网关（如 deepseek）。目前 teamai 已能分发 skills/rules/hooks/mcp/env，但模型配置仍靠手工编辑各工具配置文件。本特性把“provider 中立定义 → 各工具原生模型配置”的渲染/合并/落盘固化为 CLI 能力。

## 2. 命令面

```bash
teamai model inject [--provider <id>] [--tool <name>]... [--endpoint anthropic|openai] [--dry-run]
teamai model list
teamai model set-default [<provider>/<model>]
```

- `--provider` 缺省为 `deepseek`。
- `--tool` 可重复或逗号分隔；省略时对所有“配置目录已存在”（即已安装）的受支持工具注入。
- provider 的 API Key 环境变量必须已设置，否则报错并列出变量名。
- 单个工具失败不影响其他工具；只要有失败，进程退出码非 0。

## 3. Provider 目录（内置 7 个）

`deepseek`（默认）、`glm`、`kimi`、`minimax`、`ollama`、`qwen`、`volcengine`。内置数据定义在 `src/model/providers.json`（格式化 JSON，2 空格缩进），字段与参考实现一致：`provider`/`name`/`nameZh`(可选中文名)/`apiKey`(`${VAR}` 占位符)/`defaultEndpoint`/`endpoints.{anthropic,openai}.baseUrl`/`models[]`（每项 `id` + `contextWindow`（必填）/ 可选 `outputWindow` / `modalities.{input,output}` / `tiers[]` / `thinkingDisablable`）。`name` 保持英文（用于生成配置的标识性字段与 CLI 输出），`nameZh` 仅用于面向人的展示名。`tiers` 可多值、可缺省——缺省表示该模型只进各工具的扁平模型列表；`default` 档位决定工具的默认模型（缺省回退到 `fast`，再回退到首个模型）。`thinkingDisablable` 为可选布尔：声明该 provider 允许通过请求关闭此模型的思考（如 `thinking: {"type": "disabled"}`）；省略表示模型始终思考或完全不思考，工具不得请求其停止思考。内置数据以 zod schema 校验，避免运行期出现半成品。

## 4. 工具目标

| 工具 | 配置文件（env 覆盖） | 格式 | 端点 | Key 存储 |
|---|---|---|---|---|
| claude | `~/.claude/settings.json`（`CLAUDE_CONFIG_DIR`） | json | anthropic | 明文 |
| codex | `~/.codex/config.toml`（`CODEX_HOME`） | toml | openai | `env_key`（仅变量名） |
| opencode | `~/.config/opencode/opencode.json(c)`（`XDG_CONFIG_HOME`） | json（容忍注释） | openai | 明文 |
| dsh | `~/.dsh/settings.yaml`（`DSH_HOME`） | yaml | openai | `apiKeyEnv`（仅变量名） |
| codebuddy | `~/.codebuddy/models.json` | json | openai | 明文 |
| workbuddy | `~/.workbuddy/models.json` | json | openai | 明文 |
| openclaw | `~/.openclaw/openclaw.json`（`OPENCLAW_STATE_DIR`/`OPENCLAW_CONFIG_PATH`） | json5 | openai/anthropic | 明文 |
| hermes | `~/.hermes/config.yaml`（`HERMES_HOME`） | yaml | openai | 明文 |
| qoder | `~/.qoder/settings.json`（`QODER_CONFIG_DIR`） | json（容忍注释） | openai/anthropic | 明文 |
| zcode | `~/.zcode/cli/config.json` | json | openai/anthropic | 明文 |

- “已安装”判定 = 配置文件所在目录存在。
- codex/dsh 的格式没有明文字段，只能写环境变量名；其余写解析后的明文（按用户决策）。
- claude 强制 anthropic 端点，codebuddy/workbuddy 强制 openai 端点（格式限制）。

## 5. 渲染

- provider 展示名：`codex`/`opencode`/`zcode` 的 provider `name` 字段写 `nameZh` 存在时的 `English(中文)`（如 `DeepSeek(深度求索)`），否则回退英文 `name`；其余工具不渲染 provider 名。
- **claude**：`env.ANTHROPIC_BASE_URL` / `ANTHROPIC_AUTH_TOKEN` / `ANTHROPIC_DEFAULT_{HAIKU,SONNET,OPUS}_MODEL`（tier + 后缀），并带参考实现的 `CLAUDE_CODE_*` 默认值；Claude Code 只认 `[1m]` 一种上下文后缀，故仅当目标窗口 ≥1M 时追加 `[1m]`（`contextWindow` 为 1M/1048576/1024k 均视为 1M），其他窗口不加任何后缀（`[Nk]`/`[N]` 非法，会被原样转发给 provider）。顶层 `model` 写默认模型（值同 SONNET，含后缀），目录中不属于三个档位的模型进入 `modelPicker.options`（每行 `{model}`，追加语义 `replaceBuiltInOptions: false`），用户未设置 `theme` 时补 `"dark"`。
- **codex**：`model` / `model_provider` / `model_context_window?` / `model_providers.<id>{name,base_url,env_key,wire_api="responses"}`。
- **opencode**：`provider.<id>{npm,name,options{baseURL,apiKey},models{...}}` + `model="<id>/<default>"`；每个模型写 `limit{context,output}`——两者在 opencode schema 中均为必填：`context` 取目录的 `contextWindow`（目录内为必填），`output` 取 `outputWindow`，未声明则回退默认 8192。
- **思考禁用（thinkingDisablable）**：目录模型声明该字段时——claude 在其 fast 档（`models.fast`，即 haiku）模型可禁用时于 `env` 写 `MAX_THINKING_TOKENS="0"`；codex 在其默认模型（`models.default`）可禁用时写顶层 `model_reasoning_effort = "none"`；opencode 为每个可禁用模型写 `variants.minimal{thinking:{type:"disabled"}}`（用户可用 `#minimal` 变种选择；opencode 的 `@ai-sdk/openai-compatible` 会把该字段透传进请求体）；codebuddy/workbuddy 为可禁用模型追加 `supportsReasoning: true`。qoder/zcode/dsh/openclaw/hermes 的模型条目无对应字段，不渲染。
- **dsh**：`llm-pi-ai.providers.<id>{apiKeyEnv,api,baseURL,models[]}` + `agent-default-model`。
- **codebuddy/workbuddy**：扁平 `models[]`（fast/default/powerful 去重），字段对齐 `local-agent.ts` 的 `buddyModelEntry`；`url` 以 `/chat/completions` 结尾；不写 `availableModels`（空=不限制）。
- **openclaw**：`models.providers.<id>{baseUrl,apiKey,api,models[]}` + `agents.defaults.model.primary`；`api` 按端点取 `openai-completions`/`anthropic-messages`；不写 `models.mode`（避免覆盖用户设置）。
- **hermes**：`model{provider: custom, default, base_url, api_key, context_length?}`；自定义端点仅支持 OpenAI 兼容，强制 openai 端点。
- **qoder**：`modelConfigs.customModels[]`（按 `key` upsert）+ `model.name`；`format` 按端点取 `openai`/`anthropic`。
- **zcode**：`provider.<id>{name,kind,options{baseURL,apiKey,apiKeyRequired},models,enabled}` + `model.main`/`model.lite`；`kind` 按端点取 `openai-compatible`/`anthropic`。

## 6. 合并与落盘

- 对象递归合并，标量覆盖。
- 带字符串 `id` 的对象数组按 id **upsert**（避免重复注入产生重复模型条目）；其余数组去重追加。
- 写入原子（临时文件 + rename），符号链接先解析到真实路径再写，保留 `.bak` 备份；新文件 `0600`。
- codebuddy/workbuddy 兼容对象包裹与旧版顶层数组两种根结构。
- 条件键清理：仅在可禁用条件成立时写入的键（claude `env.MAX_THINKING_TOKENS`、codex `model_reasoning_effort`、opencode 各模型 `variants.minimal`）在片段未包含它们时会被删除，避免切换 provider 后残留（例如 codex 残留 `effort="none"` 会让只接受 low/high/max 的模型报错）。buddy 按 id 整条替换，天然无残留。

## 7. 非目标 / 已知限制

- **Cursor 不支持**：Cursor CLI 无 BYOK/自定义 provider 契约，仅用 Cursor 账号鉴权。
- **Codex** 仅支持 OpenAI Responses API；只提供 chat-completions 的 provider 需 Responses 兼容网关。
- YAML/TOML 序列化会丢失注释（`.bak` 保留原文件）。
- 模型配置不进入团队仓库，仅本地注入。

## 8. 文件改动

新增 `src/model/`：`providers.ts` / `providers.json` / `merge.ts` / `config-file.ts` / `tool-targets.ts` / `service.ts`；命令 `src/model-cmd.ts`；接线 `src/index.ts`。
测试：`src/__tests__/model-config.test.ts`、`src/__tests__/model-cmd.test.ts`。
文档：`README(.zh-CN).md`、`docs/usage-guide(.zh-CN).md`、本文件。

## 9. 工具特有说明

- **OpenClaw / Qoder** 的配置允许注释（JSON5），因此以容忍注释的方式解析（新增 `json5` 依赖），但一律写回严格 JSON（同时是合法 JSON5 / 带注释 JSON），并保留 `.bak`。
- **ZCode** 的无登录 TUI 路径要求 provider 键为 `zai` 或 `bigmodel` 才会被视为已配置；本实现按真实 provider id 建键（合法的模型配置），若用户未登录可能需要一次登录，或在 ZCode 中改键。
- **Hermes** 官方建议密钥放 `~/.hermes/.env`；按既定策略写入明文 `model.api_key`。
- **OpenClaw** 文档说明其写入会替换符号链接目标；本实现先解析真实路径再写，保留链接。
- **OpenCode** 全局配置按 `config.json` → `opencode.json` → `opencode.jsonc` 的顺序合并，冲突时 `.jsonc` 胜出。因此存在 `.jsonc` 时编辑它，否则退回 `.json`，两者都不存在时新建 `.jsonc`（opencode 自己也会这么建）。两种扩展名都按容忍注释的方式解析。
- **OpenCode** 的 `limit.context` 与 `limit.output` 在 schema 中都是必填的。`contextWindow` 因此也是目录内必填字段（见 §3）；`output` 在未声明 `outputWindow` 时回退默认值，模板始终写出两者。

## 10. 默认模型（`team model set-default`）

`team model inject` 不带 `--provider` 时，默认模型原本取自目录的 `default` 档位。`team model set-default` 允许把它改成用户指定的模型：

- `team model set-default <provider>/<model>` 直接指定；无参数且有终端时，回读各已安装工具配置中现有的 provider/model，去重后（附来源工具）让用户选择；非交互时只打印当前值。
- 候选来源是工具配置文件里实际存在的数据：opencode/zcode → `provider.<id>.models`，codex → `model_provider`/`model`，dsh → `llm-pi-ai.providers`/`agent-default-model`，openclaw → `models.providers`/`agents.defaults.model.primary`，qoder → `modelConfigs.customModels`，zcode 同上；CodeBuddy/WorkBuddy → `models[].vendor`；claude 与 hermes 的配置不存 provider id，用 `base_url` 反推内置 provider。匹配不到内置 provider 的（用户自建）不进入候选。
- 选择结果保存到 `~/.teamai/models/default.json`（`{provider, model}`，0600、原子写）。`team model inject` 不带 `--provider` 时采用它；目录里已无该模型时告警回退。显式 `--provider` 仍用该 provider 的 `default` 档位，忽略持久化值。
- 立即重新注入只作用于配置中已包含该 provider 的工具；其余跳过。没有默认模型字段的工具（CodeBuddy/WorkBuddy）列出但不改动。claude 把所选模型写入 `default` 槽（`ANTHROPIC_DEFAULT_SONNET_MODEL`），其余 tier 不变；顶层 `model` 同步为该模型，并把不再属于三个档位的模型写入 `modelPicker`（整表替换，清除其他 provider 的残留）。
