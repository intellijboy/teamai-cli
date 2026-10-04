import path from 'node:path';
import type { ToolTarget } from '../shared/types.js';
import { configDirExists, resolveDir } from '../shared/paths.js';
import { asRecord, providerForBaseUrl, readToolConfig, stringAt } from '../shared/read.js';

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.HERMES_HOME, path.join(home, '.hermes'), home),
    'config.yaml',
  );
}

export const hermes: ToolTarget = {
  name: 'hermes',
  format: 'yaml',
  template: 'hermes',
  preferredEndpoint: 'openai',
  // Hermes custom endpoints are OpenAI-compatible; keep it on the openai endpoint.
  forceEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
  readSelections(home) {
    const model = asRecord(asRecord(readToolConfig('yaml', configPath(home))).model);
    const provider = providerForBaseUrl(model.base_url);
    if (!provider) return [];
    const selected = stringAt(model, 'default');
    return [{ provider, models: selected ? [selected] : [], ...(selected ? { defaultModel: selected } : {}) }];
  },
};
