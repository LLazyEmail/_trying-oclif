/**
 * Single "is this project ok?" command.
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import {Flags} from '@oclif/core'
import {BaseCommand} from './base.js'
import {listEngines} from '../engine/registry.js'
import {assertHtml, DEFAULT_SIZE_LIMIT_KB} from '../utils/assert-html.js'
import {pathExists} from '../utils/fs.js'
import {resolveCwd} from '../utils/paths.js'

const REQUIRED = ['source', 'generated'] as const

export default class Doctor extends BaseCommand {
  static override description = 'Check folders, config, engines, and generated HTML'

  static override examples = [
    '<%= config.bin %> doctor',
    '<%= config.bin %> doctor --strict',
  ]

  static override flags = {
    ...BaseCommand.sharedFlags,
    strict: Flags.boolean({
      description: 'Fail if a required folder is missing',
      default: false,
    }),
    'size-limit-kb': Flags.integer({
      description: 'HTML size warning threshold',
      default: DEFAULT_SIZE_LIMIT_KB,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Doctor)
    const config = await this.resolveConfig()
    let failed = 0

    this.log('Folders')
    for (const name of REQUIRED) {
      const dir = resolveCwd(name === 'source' ? config.sourceDir : config.outputDir)
      const exists = await pathExists(dir)
      if (exists) {
        this.log(`  ok   ${dir}`)
      } else {
        failed += 1
        this.log(`  miss ${dir}`)
      }
    }

    this.log('Config')
    this.log(`  sourceDir  ${config.sourceDir}`)
    this.log(`  outputDir  ${config.outputDir}`)
    this.log(`  format     ${config.format}`)
    this.log(`  parseMode  ${config.parseMode}`)
    this.log(`  dryRun     ${String(config.dryRun)}`)

    this.log('Engines')
    for (const engine of listEngines()) {
      this.log(`  ${engine.name}`)
    }

    const generated = resolveCwd(config.outputDir)
    if (await pathExists(generated)) {
      const names = await fs.readdir(generated)
      const html = names.filter((name) => name.endsWith('.html') && name !== 'index.html')
      this.log(`Generated HTML (${html.length})`)
      for (const name of html) {
        const filePath = path.join(generated, name)
        const body = await fs.readFile(filePath, 'utf8')
        const checked = assertHtml(filePath, body, flags['size-limit-kb'])
        if (!checked.ok) {
          failed += 1
          this.log(`  fail ${checked.error}`)
          continue
        }
        const kb = (checked.value.bytes / 1024).toFixed(1)
        this.log(`  ${checked.value.overLimit ? 'warn' : 'ok  '} ${name} ${kb} KB`)
      }
    }

    if (failed > 0 && flags.strict) {
      this.error(`${failed} check(s) failed`)
    }
    if (failed > 0) {
      this.log(`${failed} issue(s). Re-run with --strict to fail.`)
    } else {
      this.log('ok')
    }
  }
}
