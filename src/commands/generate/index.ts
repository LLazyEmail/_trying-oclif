/**
 * generate-template-style entry point.
 * `--all` (default) writes every catalog template. `--template` writes one.
 * `--data` overrides the sample payload for a single template.
 *
 * @packageDocumentation
 */

import {Command, Flags} from '@oclif/core'
import type {CatalogEntry} from '../../catalog/types.js'
import {loadMergedCatalog, resolveTemplate} from '../../catalog/lookup.js'
import {loadPayloadFile} from '../../catalog/payload.js'
import {renderCatalogEntry} from '../../catalog/render-entry.js'
import {writeTextFile} from '../../utils/fs.js'
import {resolveCwd} from '../../utils/paths.js'

export default class Generate extends Command {
  static override description = 'Generate catalog templates (one or all)'

  static override examples = [
    '<%= config.bin %> generate',
    '<%= config.bin %> generate --all --out ./generated',
    '<%= config.bin %> generate --template WelcomeEmail',
    '<%= config.bin %> generate --template lead --data ./payload.json',
  ]

  static override flags = {
    all: Flags.boolean({
      description: 'Generate every catalog template (default when --template is omitted)',
      default: false,
    }),
    template: Flags.string({
      description: 'Single template id or alias',
    }),
    data: Flags.string({
      description: 'JSON payload file (overrides the sample payload; requires --template)',
    }),
    out: Flags.string({
      description: 'Output directory',
      default: './generated',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Generate)

    if (typeof flags.data === 'string' && typeof flags.template !== 'string') {
      this.error('--data requires --template')
    }

    const loaded = await loadMergedCatalog(process.cwd())
    if (!loaded.ok) {
      this.error(loaded.error)
    }
    const catalog = loaded.value

    const payload = typeof flags.data === 'string'
      ? await loadPayloadFile(resolveCwd(flags.data))
      : undefined
    if (payload && !payload.ok) {
      this.error(payload.error)
    }

    if (typeof flags.template === 'string') {
      const resolved = resolveTemplate(flags.template, catalog)
      if (!resolved.ok) {
        this.error(resolved.error)
      }
      await this.writeOne(flags.out, resolved.value.entry, payload?.ok ? payload.value : undefined)
      return
    }

    for (const entry of catalog) {
      await this.writeOne(flags.out, entry)
    }
  }

  private async writeOne(
    out: string,
    entry: CatalogEntry,
    payload?: Readonly<Record<string, unknown>>,
  ): Promise<void> {
    const html = payload === undefined
      ? renderCatalogEntry(entry)
      : renderCatalogEntry(entry, payload)
    const outputPath = resolveCwd(out, entry.fileName)
    const written = await writeTextFile(outputPath, html)
    if (!written.ok) {
      this.error(written.error)
    }
    this.log(`Wrote ${outputPath}`)
  }
}
