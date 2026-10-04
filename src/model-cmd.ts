import path from 'node:path';
import { log } from './utils/logger.js';
import { pathExists } from './utils/fs.js';
import { getUserHome } from './utils/home.js';
import { isInteractive, askSelection } from './utils/prompt.js';
import { ModelConfigService } from './model/service.js';
import { DEFAULT_PROVIDER, getProvider, listProviders, resolveApiKey } from './model/providers.js';
import {
  candidatesFrom,
  collectToolSelections,
  loadDefaultModel,
  providersFrom,
  saveDefaultModel,
  validateSelection,
  type StoredDefaultModel,
  type ToolSelections,
} from './model/default-model.js';
import {
  getToolTarget,
  supportedToolNames,
  unsupportedTools,
} from './model/tool-targets.js';
import type { GlobalOptions } from './types.js';

export interface ModelInjectCliOptions extends GlobalOptions {
  provider?: string;
  tool?: string | string[];
  endpoint?: string;
}

/** Normalize a repeatable/comma-separated `--tool` option into a deduplicated id list. */
function normalizeToolList(tool?: string | string[]): string[] {
  if (tool === undefined) return [];
  const raw = Array.isArray(tool) ? tool : [tool];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const part of raw) {
    for (const piece of String(part).split(',')) {
      const id = piece.trim();
      if (id && !seen.has(id)) {
        seen.add(id);
        out.push(id);
      }
    }
  }
  return out;
}

/**
 * Whether the user actually supplied `--tool`.
 *
 * Commander seeds the collecting option with `[]`, so an omitted flag arrives as
 * an empty array rather than `undefined`; both mean "auto-detect installed tools".
 */
function toolOptionProvided(tool?: string | string[]): boolean {
  if (tool === undefined) return false;
  if (Array.isArray(tool)) return tool.length > 0;
  return true;
}

/** Collapse the user's home prefix to `~` for display. */
function displayPath(filePath: string): string {
  const home = getUserHome();
  if (filePath === home || filePath.startsWith(home + path.sep)) {
    return `~${filePath.slice(home.length)}`;
  }
  return filePath;
}

/** Whether a persisted default still names a provider+model in the built-in catalog. */
function storedModelAvailable(stored: StoredDefaultModel): boolean {
  try {
    return getProvider(stored.provider).models.some((model) => model.id === stored.model);
  } catch {
    return false;
  }
}

/** Parse a `<provider>/<model>` argument; the model may itself contain `/`. */
function parseProviderModel(spec: string): { provider: string; model: string } {
  const separator = spec.indexOf('/');
  if (separator <= 0 || separator === spec.length - 1) {
    throw new Error(`Expected <provider>/<model> (e.g. deepseek/deepseek-v4-pro), got "${spec}"`);
  }
  return { provider: spec.slice(0, separator), model: spec.slice(separator + 1) };
}

/** Tools whose config directory already exists (i.e. the tool is installed). */
async function detectInstalledTools(home: string): Promise<string[]> {
  const installed: string[] = [];
  for (const name of supportedToolNames()) {
    if (getToolTarget(name).isInstalled(home)) installed.push(name);
  }
  return installed;
}

/**
 * Inject a provider's model config into one or more AI tools.
 *
 * `--provider` defaults to deepseek. With no `--tool`, every installed supported
 * tool is targeted. The provider's API-key env var must be set. On failure for a
 * tool, the remaining tools are still processed and the process exits non-zero.
 */
export async function modelInject(options: ModelInjectCliOptions): Promise<void> {
  try {
    // A provided-but-empty `--tool` is a usage error, not a request to auto-detect.
    const requested = normalizeToolList(options.tool);
    if (toolOptionProvided(options.tool) && requested.length === 0) {
      throw new Error('--tool requires at least one tool id');
    }

    // With no --provider, a persisted default (from `team model set-default`)
    // picks the provider and its default model; otherwise the built-in default.
    let providerId = options.provider;
    let defaultModelId: string | undefined;
    if (providerId === undefined) {
      const stored = await loadDefaultModel();
      if (stored && storedModelAvailable(stored)) {
        providerId = stored.provider;
        defaultModelId = stored.model;
      } else if (stored) {
        log.warn(
          `Stored default model "${stored.provider}/${stored.model}" is no longer in the catalog; using "${DEFAULT_PROVIDER}".`,
        );
      }
      providerId ??= DEFAULT_PROVIDER;
    }
    getProvider(providerId); // validate early; throws with the available provider list

    const home = getUserHome();
    const tools = requested.length > 0 ? requested : await detectInstalledTools(home);
    if (tools.length === 0) {
      throw new Error(`No installed AI tools detected among: ${supportedToolNames().join(', ')}`);
    }

    const service = new ModelConfigService();
    const written: Array<{ tool: string; file: string }> = [];
    let failed = 0;

    for (const tool of tools) {
      try {
        if (options.dryRun) {
          const plan = service.render({ providerId, tool, endpoint: options.endpoint, defaultModelId });
          process.stdout.write(`--- ${tool} (${displayPath(plan.configFile.filePath)}) ---\n`);
          const apiKey = plan.context.apiKey;
          const text = plan.text ?? '';
          process.stdout.write(apiKey ? text.replaceAll(apiKey, '***') : text);
          written.push({ tool, file: plan.configFile.filePath });
        } else {
          const plan = await service.apply({ providerId, tool, endpoint: options.endpoint, defaultModelId });
          written.push({ tool, file: plan.configFile.filePath });
        }
      } catch (error) {
        log.error(`${tool}: ${(error as Error).message}`);
        failed += 1;
      }
    }

    if (written.length > 0) {
      if (options.dryRun) {
        log.info(`Dry run: provider "${providerId}" would be written to ${written.length} tool(s).`);
      } else {
        log.success(`Injected provider "${providerId}" into ${written.length} tool(s):`);
        for (const item of written) log.info(`  ${item.tool.padEnd(10)} ${displayPath(item.file)}`);
        log.info('Restart your AI tool session to load the new model config.');
      }
    }
    if (failed > 0) process.exitCode = 1;
  } catch (error) {
    // Surface common input errors (unknown provider, no installed tools) as a
    // clean message; the async action's rejection would otherwise print a raw
    // Node stack trace from `program.parse()`.
    log.error((error as Error).message);
    process.exitCode = 1;
  }
}

/** Print the built-in providers and the model-inject support status of each known tool. */
export async function modelList(_options: GlobalOptions): Promise<void> {
  const home = getUserHome();
  const providers = listProviders();
  console.log(`Providers (${providers.length}):`);
  for (const provider of providers) {
    const key = resolveApiKey(provider);
    const env = key.isPlaceholder ? key.envName : '(literal)';
    const suffix = provider.provider === DEFAULT_PROVIDER ? ' (default)' : '';
    console.log(`  ${provider.provider.padEnd(12)} ${provider.name.padEnd(18)} ${env}${suffix}`);
  }

  console.log('');
  console.log('Tools:');
  for (const name of supportedToolNames()) {
    const file = getToolTarget(name).configPath(home);
    const installed = await pathExists(path.dirname(file));
    const status = installed ? 'installed' : 'not installed';
    console.log(`  ${name.padEnd(12)} supported    ${status.padEnd(14)} ${displayPath(file)}`);
  }
  for (const { name, reason } of unsupportedTools()) {
    console.log(`  ${name.padEnd(12)} unsupported  ${reason}`);
  }

  const defaultModel = await loadDefaultModel();
  console.log('');
  console.log(
    defaultModel
      ? `Default model: ${defaultModel.provider}/${defaultModel.model}`
      : 'Default model: (none)',
  );
}

/**
 * Set the default model across tools that already contain its provider.
 *
 * With no argument on a terminal, the candidate list is read back from every
 * installed tool's config; a `<provider>/<model>` argument selects directly.
 * The choice is persisted for later `team model inject` runs and immediately
 * re-injected into the tools holding that provider. Tools without a
 * default-model field (CodeBuddy/WorkBuddy) are reported and left alone.
 */
export async function modelSetDefault(spec?: string): Promise<void> {
  try {
    const home = getUserHome();
    const groups = collectToolSelections(home);
    const candidates = candidatesFrom(groups);
    const available = providersFrom(groups);

    let target: StoredDefaultModel;
    if (spec !== undefined && spec.trim() !== '') {
      const parsed = parseProviderModel(spec.trim());
      validateSelection(parsed.provider, parsed.model, available);
      target = parsed;
    } else if (!isInteractive()) {
      const current = await loadDefaultModel();
      console.log(
        current ? `Default model: ${current.provider}/${current.model}` : 'Default model: (none)',
      );
      return;
    } else {
      if (candidates.length === 0) {
        throw new Error('No model providers found in installed tools. Run `team model inject` first.');
      }
      console.log('Select a default model:');
      candidates.forEach((candidate, index) => {
        console.log(
          `  ${String(index + 1).padStart(3)}. ${candidate.provider}/${candidate.model}  (${candidate.tools.join(', ')})`,
        );
      });
      const picked = await askSelection('Enter a number (or "none" to cancel): ', candidates.length);
      if (!picked || picked.length === 0) {
        log.info('No default model selected.');
        return;
      }
      target = { provider: candidates[picked[0]].provider, model: candidates[picked[0]].model };
    }

    await saveDefaultModel(target);
    const result = await applyDefaultModel(groups, target);
    log.success(`Default model set to "${target.provider}/${target.model}".`);
    if (result.updated.length > 0) log.info(`Updated: ${result.updated.join(', ')}`);
    if (result.noDefaultField.length > 0) {
      log.info(`No default-model field, model list unchanged: ${result.noDefaultField.join(', ')}`);
    }
    if (result.skipped.length > 0) {
      log.info(`Skipped, provider not configured: ${result.skipped.join(', ')}`);
    }
    for (const failure of result.failed) log.error(failure);
    if (result.failed.length > 0) process.exitCode = 1;
  } catch (error) {
    log.error((error as Error).message);
    process.exitCode = 1;
  }
}

/** Re-inject the chosen default into every tool that already holds the provider. */
async function applyDefaultModel(
  groups: readonly ToolSelections[],
  target: StoredDefaultModel,
): Promise<{ updated: string[]; noDefaultField: string[]; skipped: string[]; failed: string[] }> {
  const service = new ModelConfigService();
  const updated: string[] = [];
  const noDefaultField: string[] = [];
  const skipped: string[] = [];
  const failed: string[] = [];
  for (const { tool, selections } of groups) {
    if (!selections.some((selection) => selection.provider === target.provider)) {
      skipped.push(tool);
      continue;
    }
    if (getToolTarget(tool).supportsDefaultModel === false) {
      noDefaultField.push(tool);
      continue;
    }
    try {
      await service.apply({ providerId: target.provider, tool, defaultModelId: target.model });
      updated.push(tool);
    } catch (error) {
      failed.push(`${tool}: ${(error as Error).message}`);
    }
  }
  return { updated, noDefaultField, skipped, failed };
}
