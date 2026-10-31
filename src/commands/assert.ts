/**
 * Asserts generated HTML files are real documents and under the size limit.
 * Default limit is 102 KB (Gmail clipping threshold used by email-template-workflows).
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import {Args, Command, Flags} from '@oclif/core'
import {assertHtml, DEFAULT_SIZE_LIMIT_KB} from '../utils/assert-html.js'
import {resolveCwd} from '../utils/paths.js'

export default class Assert extends Command {
  static override description = 'Assert generated HTML documents and size limit'

  static override examples = [
    '<%= config.bin %> assert',
    '<%= config.bin %> assert ./generated --size-limit-kb 102',
  ]

  static override args = {
    dir: Args.string({
      description: 'Directory of generated HTML',
      required: false,
    }),
  }

  static override flags = {
    'size-limit-kb': Flags.integer({
      description: 'Warn when a file is larger than this many KB',
      default: DEFAULT_SIZE_LIMIT_KB,
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Assert)
    const dir = resolveCwd(args.dir ?? './generated')

    let names: string[]
    try {
      names = await fs.readdir(dir)
    } catch {
      this.error(`Cannot read ${dir}. Run \`llazy generate\` first.`)
    }

    const htmlFiles = names.filter((name) => name.endsWith('.html'))
    if (htmlFiles.length === 0) {
      this.error(`No HTML files in ${dir}`)
    }

    let failed = 0
    for (const name of htmlFiles) {
      const filePath = path.join(dir, name)
      const html = await fs.readFile(filePath, 'utf8')
      const result = assertHtml(filePath, html, flags['size-limit-kb'])
      if (!result.ok) {
        failed += 1
        this.log(`FAIL ${result.error}`)
        continue
      }
      const kb = (result.value.bytes / 1024).toFixed(1)
      if (result.value.overLimit) {
        this.log(`WARN ${name} is ${kb} KB (limit ${flags['size-limit-kb']} KB)`)
      } else {
        this.log(`OK   ${name} ${kb} KB`)
      }
    }

    if (failed > 0) {
      this.error(`${failed} file(s) failed assertion`)
    }
  }
}
