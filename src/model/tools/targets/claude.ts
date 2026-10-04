import path from 'node:path';
import type { ToolTarget } from '../shared/types.js';
import { configDirExists, resolveDir } from '../shared/paths.js';
import { asRecord, providerForBaseUrl, readToolConfig, stripContextSuffix, uniqueModels } from '../shared/read.js';

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.CLAUDE_CONFIG_DIR, path.join(home, '.claude'), home),
    'settings.json',
  );
}

export const claude: ToolTarget = {
  name: 'claude',
  format: 'json',
  template: 'claude',
  preferredEndpoint: 'anthropic',
  forceEndpoint: 'anthropic',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
  readSelections(home) {
    const env = asRecord(asRecord(readToolConfig('json', configPath(home))).env);
    const provider = providerForBaseUrl(env.ANTHROPIC_BASE_URL);
    if (!provider) return [];
    const fields = [
      'ANTHROPIC_DEFAULT_HAIKU_MODEL',
      'ANTHROPIC_DEFAULT_SONNET_MODEL',
      'ANTHROPIC_DEFAULT_OPUS_MODEL',
    ];
    const models = fields
      .map((key) => (typeof env[key] === 'string' ? stripContextSuffix(env[key] as string) : ''))
      .filter((model) => model.length > 0);
    const sonnet = typeof env.ANTHROPIC_DEFAULT_SONNET_MODEL === 'string'
      ? stripContextSuffix(env.ANTHROPIC_DEFAULT_SONNET_MODEL as string)
      : undefined;
    return [{
      provider,
      models: uniqueModels(sonnet ? [...models, sonnet] : models),
      ...(sonnet ? { defaultModel: sonnet } : {}),
    }];
  },
};
