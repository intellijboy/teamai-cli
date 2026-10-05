import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';

/**
 * Claude Code's only context suffix is `[1m]` (a 1,000,000-token window); it has
 * no `[Nk]`/`[N]` form, and any other bracket is forwarded to the provider as
 * part of the model id and rejected. Emit `[1m]` for a 1M-or-larger window and
 * nothing otherwise.
 */
export function contextSuffix(tokens?: number): string {
  return tokens !== undefined && Number.isInteger(tokens) && tokens >= 1_000_000 ? '[1m]' : '';
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
 *   - `contextSuffix` token count → Claude Code context suffix (`[1m]` for a 1M window, else empty);
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
