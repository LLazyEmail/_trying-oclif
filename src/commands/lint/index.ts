/**
 * Lint command – runs ESLint over the project sources.
 * Replaces the old `bash/lint-fix.sh` / `npm run lint` workflow.
 *
 * @packageDocumentation
 */

import {spawn} from 'node:child_process'
import {Flags} from '@oclif/core'
import {BaseCommand} from '../base.js'

/**
 * `llazy lint`
 *
 * Runs ESLint. Use `--fix` to auto-fix problems where possible.
 *
 * @example
 * ```
 * $ llazy lint
 * $ llazy lint --fix
 * $ llazy lint --path src/commands
 * ```
 */
export default class Lint extends BaseCommand {
  static override description = 'Lint TypeScript sources with ESLint'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --fix',
    '<%= config.bin %> <%= command.id %> --path src/commands',
  ]

  static override flags = {
    fix: Flags.boolean({
      description: 'Automatically fix problems where possible',
      default: false,
    }),
    path: Flags.string({
      description: 'Path or glob to lint (defaults to . )',
      default: '.',
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(Lint)

    const args = [
      flags.path as string,
      '--ext',
      '.ts',
    ]

    if (flags.fix) {
      args.push('--fix')
    }

    this.log(`Running ESLint${flags.fix ? ' (with --fix)' : ''}…`)

    const exitCode = await this.runEslint(args)
    if (exitCode !== 0) {
      this.error(`ESLint exited with code ${exitCode}`, {exit: exitCode})
    }

    this.log('Lint passed.')
  }

  /**
   * Spawns the local eslint binary and returns its exit code.
   */
  private runEslint(args: string[]): Promise<number> {
    return new Promise((resolve, reject) => {
      const child = spawn('npx', ['eslint', ...args], {
        stdio: 'inherit',
        shell: true,
      })

      child.on('error', (err) => reject(err))
      child.on('close', (code) => resolve(code ?? 1))
    })
  }
}
