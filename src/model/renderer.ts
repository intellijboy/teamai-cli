import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';

/**
 * Render a token count as a Claude Code context suffix: `m` = million, `k` = thousand
 * (1000000 → `[1m]`, 128000 → `[128k]`); non-round values fall back to the raw count.
 */
export function contextSuffix(tokens?: number): string {
  if (tokens === undefined || !Number.isInteger(tokens) || tokens <= 0) return '';
  if (tokens % 1_000_000 === 0) return `[${tokens / 1_000_000}m]`;
  if (tokens % 1_000 === 0) return `[${tokens / 1_000}k]`;
  return `[${tokens}]`;
}

/** Templates sit next to this module in source (`src/model/templates`) and in `dist`. */
const DEFAULT_TEMPLATES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'templates');

/**
 * Render a Handlebars template into a tool's native config text.
 *
 * Helpers are registered on a private Handlebars environment, so importing this
 * module never mutates the global one:
 *   - `json`          JSON-escapes a value (SafeString skips HTML escaping);
 *   - `concat`        joins its arguments, ignoring Handlebars' trailing options;
 *   - `contextSuffix` token count → Claude Code context suffix (`[1m]`/`[128k]`);
 *   - `eq`            strict equality, for endpoint-dependent branches;
 *   - `trimSlash`     strips trailing slashes from a URL.
 */
export class Renderer {
  readonly #handlebars: ReturnType<typeof Handlebars.create>;
  readonly #templatesDir: string;

  constructor(templatesDir: string = DEFAULT_TEMPLATES_DIR) {
    this.#templatesDir = templatesDir;
    this.#handlebars = Handlebars.create();
    this.#handlebars.registerHelper(
      'json',
      (value: unknown) => new Handlebars.SafeString(JSON.stringify(value)),
    );
    this.#handlebars.registerHelper('concat', (...args: unknown[]) => args.slice(0, -1).join(''));
    this.#handlebars.registerHelper('contextSuffix', (value: unknown) =>
      contextSuffix(typeof value === 'number' ? value : undefined),
    );
    this.#handlebars.registerHelper('eq', (a: unknown, b: unknown) => a === b);
    this.#handlebars.registerHelper('trimSlash', (value: unknown) =>
      typeof value === 'string' ? value.replace(/\/+$/, '') : '',
    );
  }

  render(templateName: string, data: unknown): string {
    const file = path.join(this.#templatesDir, `${templateName}.hbs`);
    const source = readFileSync(file, 'utf8');
    return this.#handlebars.compile(source, { noEscape: true })(data);
  }
}
