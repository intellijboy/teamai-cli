import path from 'node:path';
import type { ToolSelection, ToolTarget } from '../shared/types.js';
import { configDirExists, resolveDir } from '../shared/paths.js';
import { asRecord, isKnownProvider, readToolConfig, stringAt, uniqueModels } from '../shared/read.js';
import { mergeQoderModels } from '../merges/qoder.js';

function configPath(home: string): string {
  return path.join(
    resolveDir(process.env.QODER_CONFIG_DIR, path.join(home, '.qoder'), home),
    'settings.json',
  );
}

export const qoder: ToolTarget = {
  name: 'qoder',
  format: 'json5',
  template: 'qoder',
  preferredEndpoint: 'openai',
  configPath,
  isInstalled: (home) => configDirExists(configPath(home)),
  merge: mergeQoderModels,
  readSelections(home) {
    const doc = asRecord(readToolConfig('json5', configPath(home)));
    const list = asRecord(doc.modelConfigs).customModels;
    const active = stringAt(asRecord(doc.model), 'name');
    const byProvider = new Map<string, string[]>();
    if (Array.isArray(list)) {
      for (const item of list) {
        const entry = asRecord(item);
        const provider = stringAt(entry, 'provider');
        const model = stringAt(entry, 'model');
        if (!provider || !model || !isKnownProvider(provider)) continue;
        const models = byProvider.get(provider) ?? [];
        models.push(model);
        byProvider.set(provider, models);
      }
    }
    const selections: ToolSelection[] = [];
    for (const [provider, models] of byProvider) {
      const selected = active && models.includes(active) ? active : undefined;
      selections.push({
        provider,
        models: uniqueModels(selected ? [...models, selected] : models),
        ...(selected ? { defaultModel: selected } : {}),
      });
    }
    return selections;
  },
};
