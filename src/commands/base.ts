/**
 * Typed base class for all LLazyEmail CLI commands.
 * Extends `@oclif/core` Command with shared configuration helpers
 * and strict typing.
 *
 * @packageDocumentation
 */

import {Command, Flags} from '@oclif/core'
import {createConfig, type CliConfig, type ParseMode, type OutputFormat, isParseMode, isOutputFormat} from '../types/config.js'

/**
 * Shared flags available to every command that needs configuration.
 */
export const sharedFlags = {
  source: Flags.string({
    char: 's',
    description: 'Source directory containing Markdown files',
    default: './source',
  }),
  output: Flags.string({
    char: 'o',
    description: 'Output directory for generated artifacts',
    default: './generated',
  }),
  mode: Flags.string({
    char: 'm',
    description: 'Parse mode (full | reactFull | recipesFull | hackernoonFront)',
    default: 'full',
  }),
  format: Flags.string({
    char: 'f',
    description: 'Output format (html | react | json)',
    default: 'html',
  }),
  verbose: Flags.boolean({
    char: 'v',
    description: 'Enable verbose logging',
    default: false,
  }),
  'dry-run': Flags.boolean({
    description: 'Perform a dry run without writing files',
    default: false,
  }),
} as const

/**
 * Abstract base command providing typed config resolution.
 *
 * @example
 * ```ts
 * export default class Parse extends BaseCommand {
 *   static override description = 'Parse Markdown to email HTML'
 *   static override flags = { ...sharedFlags }
 *
 *   public async run(): Promise<void> {
 *     const config = await this.resolveConfig()
 *     this.log(`Parsing with mode=${config.parseMode}`)
 *   }
 * }
 * ```
 */
export abstract class BaseCommand extends Command {
  /**
   * Resolves a frozen CliConfig from parsed flags.
   * Validates mode and format; falls back to defaults on invalid values.
   *
   * @returns Immutable CliConfig
   * @throws {Error} Never – invalid values are coerced to defaults with a warning
   */
  protected async resolveConfig(): Promise<Readonly<CliConfig>> {
    const {flags} = await this.parse(this.constructor as typeof BaseCommand)

    const mode = isParseMode(flags.mode) ? (flags.mode as ParseMode) : 'full'
    if (!isParseMode(flags.mode)) {
      this.warn(`Invalid parse mode "${String(flags.mode)}", falling back to "full"`)
    }

    const format = isOutputFormat(flags.format) ? (flags.format as OutputFormat) : 'html'
    if (!isOutputFormat(flags.format)) {
      this.warn(`Invalid format "${String(flags.format)}", falling back to "html"`)
    }

    return createConfig({
      sourceDir: flags.source as string,
      outputDir: flags.output as string,
      parseMode: mode,
      format,
      verbose: Boolean(flags.verbose),
      dryRun: Boolean(flags['dry-run']),
    })
  }
}
