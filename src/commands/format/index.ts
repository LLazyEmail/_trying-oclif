/**
 * Format command – runs Prettier over the project sources.
 * Replaces the old `bash/prettier-fix.sh` / `npm run prettier:fix` workflow.
 *
 * @packageDocumentation
 */

import {spawn} from 'node:child_process'
import {Flags} from '@oclif/core'
import {BaseCommand} from '../base.js'

/**
 * `llazy format`
 *
 * Formats TypeScript sources with Prettier.
 * Use `--check` for CI (exits non-zero if files need formatting).
 *
 * @example
 * ```
 * $ llazy format
 * $ llazy format --check
 * $ llazy format --path src
 * ```
 */
export default class Format extends BaseCommand {
  static override description = 'Format TypeScript sources with Prettier'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --check',
    '<%= config.bin %> <%= command.id %> --path src',
  ]

  static override flags = {
    check: Flags.boolean({
      description: 'Check formatting without writing files (CI-friendly)',
      default: false,
    }),
    path: Flags.string({
      description: 'Path or glob to format (defaults to src and test)',
      default: 'src/**/*.ts test/**/*.ts',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Format)

    const prettierArgs = flags.check
      ? ['--check', flags.path as string]
      : ['--write', flags.path as string]

    this.log(`Running Prettier${flags.check ? ' (check only)' : ''}…`)

    const exitCode = await this.runPrettier(prettierArgs)
    if (exitCode !== 0) {
      this.error(`Prettier exited with code ${exitCode}`, {exit: exitCode})
    }

    this.log(flags.check ? 'Formatting check passed.' : 'Formatting complete.')
  }

  /**
   * Spawns the local prettier binary and returns its exit code.
   */
  private runPrettier(args: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
      const child = spawn('npx', ['prettier', ...args], {
        stdio: 'inherit',
        shell: true,
      })

      child.on('error', (err) => reject(err))
      child.on('close', (code) => resolve(code ?? 1))
    })
  }
}
