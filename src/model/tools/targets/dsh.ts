import path from 'node:path';
import type { ToolSelection, ToolTarget } from '../shared/types.js';
import { configDirExists, resolveDir } from '../shared/paths.js';
import { asRecord, isKnownProvider, readToolConfig, stringAt, uniqueModels } from '../shared/read.js';

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.DSH_HOME, path.join(home, '.dsh'), home),
    'settings.yaml',
  );
}

export const dsh: ToolTarget = {
  name: 'dsh',
  format: 'yaml',
  template: 'dsh',
  preferredEndpoint: 'openai',
  // DSH's settings.yaml uses the openai-completions API; keep it on openai.
  forceEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
  readSelections(home) {
    const doc = asRecord(readToolConfig('yaml', configPath(home)));
    const providers = asRecord(asRecord(doc['llm-pi-ai']).providers);
    const active = asRecord(doc['agent-default-model']);
    const activeProvider = stringAt(active, 'provider');
    const activeModel = stringAt(active, 'model');
    const selections: ToolSelection[] = [];
    for (const provider of Object.keys(providers)) {
      if (!isKnownProvider(provider)) continue;
      const list = asRecord(providers[provider]).models;
      const models = Array.isArray(list)
        ? list.map((item) => stringAt(asRecord(item), 'id')).filter((id): id is string => !!id)
        : [];
      const selected = activeProvider === provider ? activeModel : undefined;
      selections.push({
        provider,
        models: uniqueModels(selected ? [...models, selected] : models),
        ...(selected ? { defaultModel: selected } : {}),
      });
    }
    return selections;
  },
};
