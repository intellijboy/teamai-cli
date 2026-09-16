import { afterEach, describe, expect, it } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fse from 'fs-extra';
import { ConfigFile, parseConfig, stringifyConfig } from '../model/config-file.js';
import { getFormatCodec } from '../model/config-format.js';

const SAMPLE = { name: 'demo', nested: { enabled: true }, list: [1, 2, 3] };

let dir: string | undefined;

afterEach(async () => {
  if (dir) await fse.remove(dir);
  dir = undefined;
});

describe('config format codecs', () => {
  it('round-trips every supported format', () => {
    for (const format of ['json', 'json5', 'yaml', 'toml'] as const) {
      const text = stringifyConfig(format, SAMPLE);
      expect(parseConfig(format, text)).toEqual(SAMPLE);
    }
  });

  it('parses JSON5 comments and trailing commas on read', () => {
    const text = '{\n  // a comment\n  "name": "demo",\n  "list": [1, 2, 3,],\n}\n';
    expect(parseConfig('json5', text)).toEqual({ name: 'demo', list: [1, 2, 3] });
  });

  it('writes strict JSON for the json5 format', () => {
    const text = stringifyConfig('json5', SAMPLE);
    expect(text).toBe(`${JSON.stringify(SAMPLE, null, 2)}\n`);
    expect(() => JSON.parse(text)).not.toThrow();
  });

  it('emits a trailing newline for json, json5 and toml', () => {
    expect(stringifyConfig('json', SAMPLE).endsWith('\n')).toBe(true);
    expect(stringifyConfig('json5', SAMPLE).endsWith('\n')).toBe(true);
    expect(stringifyConfig('toml', SAMPLE).endsWith('\n')).toBe(true);
  });

  it('throws for an unsupported format name', () => {
    expect(() => getFormatCodec('xml' as never)).toThrow('Unsupported config format: xml');
  });

  it('resolves a codec by name with the matching codec name', () => {
    expect(getFormatCodec('json').name).toBe('json');
    expect(getFormatCodec('json5').name).toBe('json5');
    expect(getFormatCodec('yaml').name).toBe('yaml');
    expect(getFormatCodec('toml').name).toBe('toml');
  });
});

describe('ConfigFile format composition', () => {
  it('keeps the public format field as the string union', () => {
    const file = new ConfigFile(path.join(os.tmpdir(), 'whatever.toml'), 'toml');
    expect(file.format).toBe('toml');
  });

  it('reads and writes through its composed codec', async () => {
    dir = await fse.mkdtemp(path.join(os.tmpdir(), 'teamai-config-format-'));
    const file = new ConfigFile(path.join(dir, 'config.toml'), 'toml');
    await file.write(SAMPLE);
    expect(file.read()).toEqual(SAMPLE);
  });
});
