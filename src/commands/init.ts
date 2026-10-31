/**
 * Scaffolds a minimal LLazyEmail working directory.
 *
 * @packageDocumentation
 */

import path from 'node:path'
import {Flags} from '@oclif/core'
import {BaseCommand} from './base.js'
import {ensureDir, pathExists, writeTextFile} from '../utils/fs.js'

const SAMPLE_MARKDOWN = [
  '#! Sample newsletter',
  '',
  '#~ A short preview line',
  '',
  '# Hello from LLazyEmail',
  '',
  'This is a starter Markdown file created by `llazy init`.',
  '',
  'Replace this content, then run:',
  '',
  '```',
  'llazy parse',
  '```',
  '',
].join('\n')

const SAMPLE_CONFIG = `${JSON.stringify(
  {
    sourceDir: './source',
    outputDir: './generated',
    parseMode: 'full',
    format: 'html',
    verbose: false,
    dryRun: false,
  },
  null,
  2,
)}\n`

const SAMPLE_CATALOG = `${JSON.stringify(
  {
    templates: [
      {
        ids: ['ReceiptEmail'],
        aliases: ['receipt'],
        kind: 'transactional',
        description: 'Example project template. Overrides nothing built-in.',
        fileName: 'receipt.html',
        samplePayload: {name: 'Alex', amount: '$10.00'},
      },
    ],
  },
  null,
  2,
)}\n`

/**
 * `llazy init`
 *
 * Creates `source/`, `generated/`, a sample Markdown file, `.llazyrc.json`,
 * and `.llazy/catalog.json`.
 */
export default class Init extends BaseCommand {
  static override description = 'Scaffold source/, generated/, sample Markdown, config, and catalog'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --force',
  ]

  static override flags = {
    force: Flags.boolean({
      description: 'Overwrite existing sample files',
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Init)
    const root = process.cwd()
    const sourceDir = path.join(root, 'source')
    const outputDir = path.join(root, 'generated')
    const catalogDir = path.join(root, '.llazy')
    const markdownPath = path.join(sourceDir, 'source.md')
    const configPath = path.join(root, '.llazyrc.json')
    const catalogPath = path.join(catalogDir, 'catalog.json')

    const sourceDirResult = await ensureDir(sourceDir)
    if (!sourceDirResult.ok) this.error(sourceDirResult.error)

    const outputDirResult = await ensureDir(outputDir)
    if (!outputDirResult.ok) this.error(outputDirResult.error)

    const catalogDirResult = await ensureDir(catalogDir)
    if (!catalogDirResult.ok) this.error(catalogDirResult.error)

    await this.writeUnlessExists(markdownPath, SAMPLE_MARKDOWN, flags.force)
    await this.writeUnlessExists(configPath, SAMPLE_CONFIG, flags.force)
    await this.writeUnlessExists(catalogPath, SAMPLE_CATALOG, flags.force)

    this.log('Project scaffolded.')
    this.log(`  ${sourceDir}`)
    this.log(`  ${outputDir}`)
    this.log(`  ${markdownPath}`)
    this.log(`  ${configPath}`)
    this.log(`  ${catalogPath}`)
    this.log('Next: llazy parse   or   llazy templates list')
  }

  private async writeUnlessExists(
    filePath: string,
    contents: string,
    force: boolean,
  ): Promise<void> {
    if (!force && (await pathExists(filePath))) {
      this.log(`Skipping existing file: ${filePath}`)
      return
    }

    const written = await writeTextFile(filePath, contents)
    if (!written.ok) {
      this.error(written.error)
    }
  }
}
