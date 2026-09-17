const PLACEHOLDER = /^\$\{([A-Za-z_][A-Za-z0-9_]*)\}$/;

/**
 * Value object for a provider's API-key declaration.
 *
 * A key is either a literal secret or a `${ENV_VAR}` placeholder. Centralizing
 * placeholder detection here keeps the "resolve from the environment" rule in
 * one place, so callers never re-implement the regex.
 */
export class ApiKey {
  readonly #raw: string;
  readonly #envName: string | undefined;

  constructor(raw: string) {
    if (typeof raw !== 'string' || raw.length === 0) {
      throw new Error('apiKey must be a non-empty string');
    }
    this.#raw = raw;
    this.#envName = PLACEHOLDER.exec(raw)?.[1];
  }

  /** True when the key is a `${ENV_VAR}` placeholder rather than a literal. */
  get isPlaceholder(): boolean {
    return this.#envName !== undefined;
  }

  /** Placeholder's environment-variable name; undefined for a literal. */
  get envName(): string | undefined {
    return this.#envName;
  }

  /** Resolve the real secret, reading placeholders from the environment. */
  resolve(env: NodeJS.ProcessEnv = process.env): string {
    return this.isPlaceholder ? (env[this.#envName as string] ?? '') : this.#raw;
  }

  toString(): string {
    return this.#raw;
  }
}
