/**
 * Lists the built-in template catalog.
 *
 * @packageDocumentation
 */

import {Command} from '@oclif/core'
import {listCatalog} from '../../catalog/lookup.js'

export default class TemplatesList extends Command {
  static override description = 'List catalog templates (ids, aliases, kind)'

  static override examples = ['<%= config.bin %> templates list']

  public async run(): Promise<void> {
    for (const entry of listCatalog()) {
      const id = entry.ids[0] ?? 'unknown'
      const aliases = entry.aliases?.join(', ') ?? ''
      this.log(`${id}\t${entry.kind}\t${aliases}\t${entry.description}`)
    }
  }
}
