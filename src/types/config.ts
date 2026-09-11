/**
 * Core configuration types for the LLazyEmail CLI.
 * All configurations are immutable after creation.
 *
 * @packageDocumentation
 */

/**
 * Supported parse modes for the Markdown → email pipeline.
 */
export type ParseMode = 'full' | 'reactFull' | 'recipesFull' | 'hackernoonFront'

/**
 * Output target for rendering.
 */
export type OutputFormat = 'html' | 'react' | 'json'

/**
 * Runtime configuration for a single CLI invocation.
 * Frozen after construction – never mutate.
 */
export interface CliConfig {
  readonly sourceDir: string
  readonly outputDir: string
  readonly parseMode: ParseMode
  readonly format: OutputFormat
  readonly verbose: boolean
  readonly dryRun: boolean
}

/**
 * Default configuration values applied when flags/args are omitted.
 */
export const DEFAULT_CONFIG: Readonly<CliConfig> = Object.freeze({
  sourceDir: './source',
  outputDir: './generated',
  parseMode: 'full',
  format: 'html',
  verbose: false,
  dryRun: false,
})

/**
 * Creates a frozen CliConfig by merging user overrides with defaults.
 *
 * @param overrides - Partial configuration to merge
 * @returns A fully frozen, immutable CliConfig
 *
 * @example
 * ```ts
 * const cfg = createConfig({ parseMode: 'reactFull', verbose: true })
 * // cfg.parseMode === 'reactFull'
 * // cfg.sourceDir === './source' (default)
 * ```
 */
export function createConfig(overrides: Partial<CliConfig> = {}): Readonly<CliConfig> {
  return Object.freeze({
    ...DEFAULT_CONFIG,
    ...overrides,
  })
}

/**
 * Type guard for ParseMode.
 *
 * @param value - Unknown value to test
 * @returns `true` if value is a valid ParseMode
 */
export function isParseMode(value: unknown): value is ParseMode {
  return (
    value === 'full' ||
    value === 'reactFull' ||
    value === 'recipesFull' ||
    value === 'hackernoonFront'
  )
}

/**
 * Type guard for OutputFormat.
 *
 * @param value - Unknown value to test
 * @returns `true` if value is a valid OutputFormat
 */
export function isOutputFormat(value: unknown): value is OutputFormat {
  return value === 'html' || value === 'react' || value === 'json'
}
