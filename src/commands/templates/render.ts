/**
 * Renders one catalog template to HTML.
 *
 * @packageDocumentation
 */

import {Args, Command, Flags} from '@oclif/core'
import {renderCatalogEntry} from '../../catalog/render-entry.js'
import {resolveTemplate} from '../../catalog/lookup.js'
import {writeTextFile} from '../../utils/fs.js'
import {resolveCwd} from '../../utils/paths.js'

export default class TemplatesRender extends Command {
  static override description = 'Render one catalog template to HTML'

  static override examples = [
    '<%= config.bin %> templates render WelcomeEmail',
    '<%= config.bin %> templates render password-reset --out ./generated',
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
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(TemplatesRender)
    const resolved = resolveTemplate(args.template)
    if (!resolved.ok) {
      this.error(resolved.error)
    }
    const html = renderCatalogEntry(resolved.value.entry)
    const outputPath = resolveCwd(flags.out, resolved.value.entry.fileName)
    const written = await writeTextFile(outputPath, html)
    if (!written.ok) {
      this.error(written.error)
    }
    this.log(`Wrote ${outputPath} (${resolved.value.matchedId})`)
  }
}
