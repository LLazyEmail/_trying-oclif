/**
 * Validates that the expected project folder structure exists.
 * Conceptually ported from the original `checkFolders.js` script
 * in the markdown-to-email repository.
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import {Flags} from '@oclif/core'
import {BaseCommand, sharedFlags} from '../base.js'
import {ok, err, type Result} from '../../types/result.js'
import {resolveCwd} from '../../utils/paths.js'

/**
 * Required directories that must exist for a healthy LLazyEmail project.
 */
const REQUIRED_DIRS = ['source', 'generated'] as const

/**
 * Optional but recommended directories.
 */
const RECOMMENDED_DIRS = ['src', 'tests', 'bash'] as const

interface FolderCheckReport {
  readonly missingRequired: readonly string[]
  readonly missingRecommended: readonly string[]
  readonly present: readonly string[]
}

/**
 * Checks existence of a single directory.
 *
 * @param dirPath - Absolute path to check
 * @returns Result indicating whether the path is a directory
 */
async function isDirectory(dirPath: string): Promise<Result<boolean>> {
  try {
    const stat = await fs.stat(dirPath)
    return ok(stat.isDirectory())
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === 'ENOENT') {
      return ok(false)
    }
    return err(`Unable to stat ${dirPath}`, cause)
  }
}

/**
 * Builds a report of present / missing folders relative to a root.
 *
 * @param root - Absolute project root
 * @returns FolderCheckReport
 */
async function buildReport(root: string): Promise<Result<FolderCheckReport>> {
  const missingRequired: string[] = []
  const missingRecommended: string[] = []
  const present: string[] = []

  for (const dir of REQUIRED_DIRS) {
    const full = path.join(root, dir)
    const result = await isDirectory(full)
    if (!result.ok) return result
    if (result.value) {
      present.push(dir)
    } else {
      missingRequired.push(dir)
    }
  }

  for (const dir of RECOMMENDED_DIRS) {
    const full = path.join(root, dir)
    const result = await isDirectory(full)
    if (!result.ok) return result
    if (result.value) {
      present.push(dir)
    } else {
      missingRecommended.push(dir)
    }
  }

  return ok({
    missingRequired,
    missingRecommended,
    present,
  })
}

/**
 * `llazy check folders`
 *
 * Validates that the expected project folder structure is present.
 *
 * @example
 * ```
 * $ llazy check folders
 * ✓ source
 * ✓ generated
 * ⚠ tests (recommended, missing)
 *
 * $ llazy check folders --root ./my-project --strict
 * ```
 */
export default class CheckFolders extends BaseCommand {
  static override description = 'Validate that required project folders exist'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --root ./my-project',
    '<%= config.bin %> <%= command.id %> --strict',
  ]

  static override flags = {
    ...sharedFlags,
    root: Flags.string({
      char: 'r',
      description: 'Project root to inspect (defaults to cwd)',
      default: process.cwd(),
    }),
    strict: Flags.boolean({
      description: 'Treat missing recommended folders as errors',
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(CheckFolders)
    const root = resolveCwd(flags.root as string)

    this.log(`Checking folders under: ${root}`)

    const reportResult = await buildReport(root)
    if (!reportResult.ok) {
      this.error(reportResult.error)
    }

    const report = reportResult.value

    for (const dir of report.present) {
      this.log(`  ✓ ${dir}`)
    }
    for (const dir of report.missingRequired) {
      this.log(`  ✗ ${dir} (required, missing)`)
    }
    for (const dir of report.missingRecommended) {
      this.log(`  ⚠ ${dir} (recommended, missing)`)
    }

    if (report.missingRequired.length > 0) {
      this.error(
        `Missing required folders: ${report.missingRequired.join(', ')}. ` +
          'Create them or adjust --root.',
      )
    }

    if (flags.strict && report.missingRecommended.length > 0) {
      this.error(
        `Missing recommended folders (strict mode): ${report.missingRecommended.join(', ')}`,
      )
    }

    this.log('Folder check passed.')
  }
}
