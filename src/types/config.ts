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
 */
export function createConfig(overrides: Partial<CliConfig> = {}): Readonly<CliConfig> {
  return mergeConfig(DEFAULT_CONFIG, overrides)
}

/**
 * Merges an overlay onto a base config.
 * Only defined overlay keys replace the base. Result is frozen.
 *
 * Precedence used by the CLI:
 *   defaults → config file → explicit flags
 *
 * @param base - Existing frozen config
 * @param overlay - Sparse overrides
 * @returns New frozen CliConfig
 */
export function mergeConfig(
  base: Readonly<CliConfig>,
  overlay: Partial<CliConfig>,
): Readonly<CliConfig> {
  return Object.freeze({
    sourceDir: overlay.sourceDir ?? base.sourceDir,
    outputDir: overlay.outputDir ?? base.outputDir,
    parseMode: overlay.parseMode ?? base.parseMode,
    format: overlay.format ?? base.format,
    verbose: overlay.verbose ?? base.verbose,
    dryRun: overlay.dryRun ?? base.dryRun,
  })
}

/**
 * Type guard for ParseMode.
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
 */
export function isOutputFormat(value: unknown): value is OutputFormat {
  return value === 'html' || value === 'react' || value === 'json'
}
