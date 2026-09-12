/**
 * Typed base class for all LLazyEmail CLI commands.
 *
 * @packageDocumentation
 */

import {Command, Flags} from '@oclif/core'
import {
  createConfig,
  isOutputFormat,
  isParseMode,
  mergeConfig,
  type CliConfig,
  type OutputFormat,
  type ParseMode,
} from '../types/config.js'
import {loadProjectConfig} from '../utils/config-file.js'

/**
 * Sparse, mutable overrides collected from CLI flags.
 */
interface ConfigOverlay {
  sourceDir?: string
  outputDir?: string
  parseMode?: ParseMode
  format?: OutputFormat
  verbose?: boolean
  dryRun?: boolean
}

/**
 * Shared flags available to every command that needs configuration.
 * String flags have no hard default so a config file can supply values.
 */
export const sharedFlags = {
  source: Flags.string({
    char: 's',
    description: 'Source directory containing Markdown files (default: ./source or config file)',
  }),
  output: Flags.string({
    char: 'o',
    description: 'Output directory for generated artifacts (default: ./generated or config file)',
  }),
  mode: Flags.string({
    char: 'm',
    description: 'Parse mode (full | reactFull | recipesFull | hackernoonFront)',
  }),
  format: Flags.string({
    char: 'f',
    description: 'Output format (html | react | json)',
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
 * Resolution order: defaults → .llazyrc.json → explicit CLI flags.
 */
export abstract class BaseCommand extends Command {
  /**
   * Resolves a frozen CliConfig from the project config file and flags.
   * Invalid mode/format flags warn and fall back to the current value.
   */
  protected async resolveConfig(): Promise<Readonly<CliConfig>> {
    const {flags} = await this.parse(this.constructor as typeof BaseCommand)

    const loaded = await loadProjectConfig(process.cwd())
    const fromFile = loaded.ok ? loaded.value : createConfig()
    if (!loaded.ok) {
      this.warn(`Could not load project config: ${loaded.error}`)
    }

    const overlay: ConfigOverlay = {}

    if (typeof flags.source === 'string') {
      overlay.sourceDir = flags.source
    }
    if (typeof flags.output === 'string') {
      overlay.outputDir = flags.output
    }

    if (typeof flags.mode === 'string') {
      if (isParseMode(flags.mode)) {
        overlay.parseMode = flags.mode
      } else {
        this.warn(`Invalid parse mode "${flags.mode}", keeping "${fromFile.parseMode}"`)
      }
    }

    if (typeof flags.format === 'string') {
      if (isOutputFormat(flags.format)) {
        overlay.format = flags.format
      } else {
        this.warn(`Invalid format "${flags.format}", keeping "${fromFile.format}"`)
      }
    }

    if (flags.verbose === true) {
      overlay.verbose = true
    }
    if (flags['dry-run'] === true) {
      overlay.dryRun = true
    }

    return mergeConfig(fromFile, overlay)
  }
}
