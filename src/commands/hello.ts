/**
 * Example command that greets the user.
 * Demonstrates flags, args, and the BaseCommand pattern.
 *
 * @packageDocumentation
 */

import {Args, Flags} from '@oclif/core'
import {BaseCommand} from './base.js'

/**
 * `llazy hello [NAME]`
 *
 * Prints a friendly greeting. Useful as a smoke-test command.
 *
 * @example
 * ```
 * $ llazy hello
 * hello world from @llazyemail/cli!
 *
 * $ llazy hello Alice --force
 * hello Alice from @llazyemail/cli! (force)
 * ```
 */
export default class Hello extends BaseCommand {
  static override description = 'Say hello (smoke-test command)'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> Alice',
    '<%= config.bin %> <%= command.id %> --force',
  ]

  static override flags = {
    force: Flags.boolean({
      char: 'f',
      description: 'Force the greeting even if the user is shy',
      default: false,
    }),
  }

  static override args = {
    name: Args.string({
      description: 'Person to say hello to',
      required: false,
      default: 'world',
    }),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Hello)
    const name = args.name ?? 'world'
    const forceSuffix = flags.force ? ' (force)' : ''
    this.log(`hello ${name} from @llazyemail/cli!${forceSuffix}`)
  }
}
