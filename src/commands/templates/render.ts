/**
 * Renders one catalog template to HTML.
 *
 * @packageDocumentation
 */

import {Args, Command, Flags} from '@oclif/core'
import {loadMergedCatalog, resolveTemplate} from '../../catalog/lookup.js'
import {loadPayloadFile} from '../../catalog/payload.js'
import {renderCatalogEntry} from '../../catalog/render-entry.js'
import {writeTextFile} from '../../utils/fs.js'
import {resolveCwd} from '../../utils/paths.js'

export default class TemplatesRender extends Command {
  static override description = 'Render one catalog template to HTML'

  static override examples = [
    '<%= config.bin %> templates render WelcomeEmail',
    '<%= config.bin %> templates render password-reset --out ./generated',
    '<%= config.bin %> templates render welcome --data ./payload.json',
  ]

  static override args = {
    template: Args.string({
      description: 'Template id or alias',
      required: true,
    }),
  }

  static override flags = {
    out: Flags.string({
      description: 'Output directory',
      default: './generated',
    }),
    data: Flags.string({
      description: 'JSON payload file (overrides the sample payload)',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(TemplatesRender)
    const loaded = await loadMergedCatalog(process.cwd())
    if (!loaded.ok) {
      this.error(loaded.error)
    }

    const resolved = resolveTemplate(args.template, loaded.value)
    if (!resolved.ok) {
      this.error(resolved.error)
    }

    const payload = typeof flags.data === 'string'
      ? await loadPayloadFile(resolveCwd(flags.data))
      : undefined
    if (payload && !payload.ok) {
      this.error(payload.error)
    }

    const html = payload && payload.ok
      ? renderCatalogEntry(resolved.value.entry, payload.value)
      : renderCatalogEntry(resolved.value.entry)

    const outputPath = resolveCwd(flags.out, resolved.value.entry.fileName)
    const written = await writeTextFile(outputPath, html)
    if (!written.ok) {
      this.error(written.error)
    }
    this.log(`Wrote ${outputPath} (${resolved.value.matchedId})`)
  }
}
