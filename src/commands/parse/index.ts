/**
 * Primary parse command – Markdown → email-ready HTML / React.
 * This is the main entry point that will later wire into the
 * typography & layout engines of the LLazyEmail ecosystem.
 *
 * @packageDocumentation
 */

import {Args} from '@oclif/core'
import {BaseCommand, sharedFlags} from '../base.js'
import {resolveCwd} from '../../utils/paths.js'

/**
 * `llazy parse [FILE]`
 *
 * Parses a Markdown source file (or the default source directory)
 * into the configured output format.
 *
 * @example
 * ```
 * $ llazy parse
 * $ llazy parse ./source/source.md --mode reactFull --format react
 * $ llazy parse --dry-run --verbose
 * ```
 */
export default class Parse extends BaseCommand {
  static override description =
    'Parse Markdown into email-ready HTML or React trees'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> ./source/source.md',
    '<%= config.bin %> <%= command.id %> --mode reactFull --format react',
    '<%= config.bin %> <%= command.id %> --dry-run --verbose',
  ]

  static override flags = {
    ...sharedFlags,
  }

  static override args = {
    file: Args.string({
      description: 'Specific Markdown file to parse (defaults to source/source.md)',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args} = await this.parse(Parse)
    const config = await this.resolveConfig()

    const inputPath = args.file
      ? resolveCwd(args.file)
      : resolveCwd(config.sourceDir, 'source.md')

    const outputPath = resolveCwd(
      config.outputDir,
      config.format === 'react' ? 'newEmail.jsx' : 'newEmail.html',
    )

    if (config.verbose) {
      this.log(`Config: ${JSON.stringify(config, null, 2)}`)
      this.log(`Input : ${inputPath}`)
      this.log(`Output: ${outputPath}`)
    }

    if (config.dryRun) {
      this.log(
        `[dry-run] Would parse ${inputPath} → ${outputPath} (mode=${config.parseMode}, format=${config.format})`,
      )
      return
    }

    // Placeholder for the real rendering engine integration.
    this.log(
      `Parsing ${inputPath} with mode=${config.parseMode}, format=${config.format}…`,
    )
    this.log(`(Engine integration pending – skeleton only)`)
    this.log(`Would write → ${outputPath}`)
  }
}
