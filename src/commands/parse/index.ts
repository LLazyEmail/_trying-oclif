/**
 * Primary parse command – Markdown → email-ready HTML / React.
 * Uses the stub renderer until a real engine adapter is registered.
 *
 * @packageDocumentation
 */

import {Args} from '@oclif/core'
import {BaseCommand, sharedFlags} from '../base.js'
import {stubRenderer} from '../../engine/stub.js'
import {readTextFile, writeTextFile} from '../../utils/fs.js'
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

    const markdownResult = await readTextFile(inputPath)
    if (!markdownResult.ok) {
      this.error(
        `${markdownResult.error}. Run \`llazy init\` to create a sample source file.`,
      )
    }

    const rendered = stubRenderer.render({
      markdown: markdownResult.value,
      inputPath,
      config,
    })

    const outputPath = resolveCwd(config.outputDir, `newEmail.${rendered.extension}`)

    if (config.verbose) {
      this.log(`Engine: ${stubRenderer.name}`)
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

    const written = await writeTextFile(outputPath, rendered.body)
    if (!written.ok) {
      this.error(written.error)
    }

    this.log(`Wrote ${outputPath} with the ${stubRenderer.name} renderer.`)
  }
}
