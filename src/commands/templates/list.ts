/**
 * Lists the merged template catalog (project overrides + built-in).
 *
 * @packageDocumentation
 */

import {Command} from '@oclif/core'
import {loadMergedCatalog} from '../../catalog/lookup.js'
import {findCatalogFile} from '../../catalog/project.js'

export default class TemplatesList extends Command {
  static override description = 'List catalog templates (ids, aliases, kind)'

  static override examples = ['<%= config.bin %> templates list']

  public async run(): Promise<void> {
    const file = await findCatalogFile(process.cwd())
    if (file) {
      this.log(`# catalog: ${file}`)
    }

    const loaded = await loadMergedCatalog(process.cwd())
    if (!loaded.ok) {
      this.error(loaded.error)
    }

    for (const entry of loaded.value) {
      const id = entry.ids[0] ?? 'unknown'
      const aliases = entry.aliases?.join(', ') ?? ''
      this.log(`${id}\t${entry.kind}\t${aliases}\t${entry.description}`)
    }
  }
}
