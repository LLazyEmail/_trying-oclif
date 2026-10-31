/**
 * generate-template-style entry point.
 * `--all` (default) writes every catalog template. `--template` writes one.
 *
 * @packageDocumentation
 */

import {Command, Flags} from '@oclif/core'
import {listCatalog, resolveTemplate} from '../../catalog/lookup.js'
import {renderCatalogEntry} from '../../catalog/render-entry.js'
import {writeTextFile} from '../../utils/fs.js'
import {resolveCwd} from '../../utils/paths.js'

export default class Generate extends Command {
  static override description = 'Generate catalog templates (one or all)'

  static override examples = [
    '<%= config.bin %> generate',
    '<%= config.bin %> generate --all --out ./generated',
    '<%= config.bin %> generate --template WelcomeEmail',
    '<%= config.bin %> generate --template lead',
  ]

  static override flags = {
    all: Flags.boolean({
      description: 'Generate every catalog template (default when --template is omitted)',
      default: false,
    }),
    template: Flags.string({
      description: 'Single template id or alias',
    }),
    out: Flags.string({
      description: 'Output directory',
      default: './generated',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Generate)

    if (typeof flags.template === 'string') {
      const resolved = resolveTemplate(flags.template)
      if (!resolved.ok) {
        this.error(resolved.error)
      }
      await this.writeOne(flags.out, resolved.value.entry)
      return
    }

    for (const entry of listCatalog()) {
      await this.writeOne(flags.out, entry)
    }
  }

  private async writeOne(
    out: string,
    entry: {fileName: string; ids: readonly string[]; samplePayload: Readonly<Record<string, unknown>>; kind: 'transactional' | 'newsletter' | 'lead'; description: string; aliases?: readonly string[]},
  ): Promise<void> {
    const html = renderCatalogEntry(entry)
    const outputPath = resolveCwd(out, entry.fileName)
    const written = await writeTextFile(outputPath, html)
    if (!written.ok) {
      this.error(written.error)
    }
    this.log(`Wrote ${outputPath}`)
  }
}
