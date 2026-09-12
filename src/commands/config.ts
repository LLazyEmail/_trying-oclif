/**
 * Prints the resolved CLI configuration.
 * Useful for debugging flag vs config-file precedence.
 *
 * @packageDocumentation
 */

import {BaseCommand, sharedFlags} from './base.js'
import {listEngines} from '../engine/registry.js'
import {findConfigFile} from '../utils/config-file.js'

/**
 * `llazy config`
 */
export default class ConfigCommand extends BaseCommand {
  static override description = 'Print the resolved CLI configuration'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --format json --verbose',
  ]

  static override flags = {
    ...sharedFlags,
  }

  public async run(): Promise<void> {
    const resolved = await this.resolveConfig()
    const configFile = await findConfigFile(process.cwd())

    this.log(
      JSON.stringify(
        {
          configFile: configFile ?? null,
          engines: listEngines(),
          config: resolved,
        },
        null,
        2,
      ),
    )
  }
}
