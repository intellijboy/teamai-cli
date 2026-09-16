import JSON5 from 'json5';
import YAML from 'yaml';
import { parse as parseToml, stringify as stringifyToml } from 'smol-toml';

export type ConfigFormat = 'json' | 'json5' | 'yaml' | 'toml';

/** A pluggable parser/serializer for one config format. */
export interface ConfigFormatCodec {
  readonly name: ConfigFormat;
  parse(text: string): unknown;
  stringify(value: unknown): string;
}

class JsonFormatCodec implements ConfigFormatCodec {
  readonly name = 'json' as const;

  parse(text: string): unknown {
    return JSON.parse(text);
  }

  stringify(value: unknown): string {
    return `${JSON.stringify(value, null, 2)}\n`;
  }
}

class Json5FormatCodec implements ConfigFormatCodec {
  readonly name = 'json5' as const;

  parse(text: string): unknown {
    return JSON5.parse(text);
  }

  // Parse tolerantly (comments / trailing commas) but always emit strict
  // JSON: it is valid JSON5 *and* valid JSON-with-comments, so both OpenClaw
  // and Qoder accept it. A `.bak` copy preserves the original comments.
  stringify(value: unknown): string {
    return `${JSON.stringify(value, null, 2)}\n`;
  }
}

class YamlFormatCodec implements ConfigFormatCodec {
  readonly name = 'yaml' as const;

  parse(text: string): unknown {
    return YAML.parse(text);
  }

  stringify(value: unknown): string {
    return YAML.stringify(value);
  }
}

class TomlFormatCodec implements ConfigFormatCodec {
  readonly name = 'toml' as const;

  parse(text: string): unknown {
    return parseToml(text);
  }

  stringify(value: unknown): string {
    return `${stringifyToml(value)}\n`;
  }
}

const CODECS: Record<ConfigFormat, ConfigFormatCodec> = {
  json: new JsonFormatCodec(),
  json5: new Json5FormatCodec(),
  yaml: new YamlFormatCodec(),
  toml: new TomlFormatCodec(),
};

/** Resolve the codec for a config format, throwing on an unknown name. */
export function getFormatCodec(name: ConfigFormat): ConfigFormatCodec {
  const codec = CODECS[name];
  if (!codec) throw new Error(`Unsupported config format: ${name}`);
  return codec;
}
