/**
 * Primary parse command – Markdown → email-ready HTML / React.
 * Uses the registered renderer (stub by default).
 *
 * @packageDocumentation
 */

import fs from 'node:fs'
import {Args, Flags} from '@oclif/core'
import {BaseCommand, sharedFlags} from '../base.js'
import {runParseOnce} from '../../parse/run-parse.js'
import {createDebouncer} from '../../utils/debounce.js'

/**
 * `llazy parse [FILE]`
 */
export default class Parse extends BaseCommand {
  static override description =
    'Parse Markdown into email-ready HTML or React trees'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> ./source/source.md',
    '<%= config.bin %> <%= command.id %> --mode reactFull --format react',
    '<%= config.bin %> <%= command.id %> --dry-run --verbose',
    '<%= config.bin %> <%= command.id %> --watch',
    '<%= config.bin %> <%= command.id %> --engine stub',
  ]

  static override flags = {
    ...sharedFlags,
    engine: Flags.string({
      description: 'Renderer engine name (default: stub)',
    }),
    watch: Flags.boolean({
      char: 'w',
      description: 'Re-parse when the source file changes',
      default: false,
    }),
  }

  static override args = {
    file: Args.string({
      description: 'Specific Markdown file to parse (defaults to source/source.md)',
      required: false,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Parse)
    const config = await this.resolveConfig()

    const once = async (): Promise<void> => {
      const result = await runParseOnce({
        config,
        file: args.file,
        engineName: flags.engine,
      })
      if (!result.ok) {
        this.error(result.error)
      }
      if (config.verbose) {
        this.log(`Engine: ${result.value.engine}`)
        this.log(`Input : ${result.value.inputPath}`)
        this.log(`Output: ${result.value.outputPath}`)
      }
      if (result.value.wrote) {
        this.log(`Wrote ${result.value.outputPath} with the ${result.value.engine} renderer.`)
      } else {
        this.log(
          `[dry-run] Would parse ${result.value.inputPath} → ${result.value.outputPath}`,
        )
      }
    }

    await once()

    if (!flags.watch) {
      return
    }

    const target = (await runParseOnce({
      config: {...config, dryRun: true},
      file: args.file,
      engineName: flags.engine,
    })).ok
      ? undefined
      : undefined

    const preview = await runParseOnce({
      config: {...config, dryRun: true},
      file: args.file,
      engineName: flags.engine,
    })
    if (!preview.ok) {
      this.error(preview.error)
    }

    this.log(`Watching ${preview.value.inputPath} (Ctrl+C to stop)`)
    const debounced = createDebouncer(150, () => {
      void once()
    })
    fs.watch(preview.value.inputPath, () => {
      debounced.trigger()
    })
    await new Promise<void>(() => {
      /* keep the process alive until SIGINT */
    })
    void target
  }
}
