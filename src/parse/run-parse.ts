/**
 * Single-shot parse pipeline used by `llazy parse`.
 * Kept separate from the oclif command so it can be unit-tested
 * and later reused by --watch without duplicating I/O logic.
 *
 * @packageDocumentation
 */

import type {CliConfig} from '../types/config.js'
import {err, ok, type Result} from '../types/result.js'
import {getEngine} from '../engine/registry.js'
import {readTextFile, writeTextFile} from '../utils/fs.js'
import {resolveCwd} from '../utils/paths.js'

/**
 * Result of one parse pass.
 */
export interface ParsePass {
  readonly engine: string
  readonly inputPath: string
  readonly outputPath: string
  readonly wrote: boolean
}

export interface RunParseOptions {
  readonly config: Readonly<CliConfig>
  readonly file?: string | undefined
  readonly engineName?: string | undefined
}

/**
 * Reads Markdown, renders through the selected engine, optionally writes.
 *
 * @param options - Config, optional file path, optional engine name
 */
export async function runParseOnce(options: RunParseOptions): Promise<Result<ParsePass>> {
  const engineResult = getEngine(options.engineName ?? 'stub')
  if (!engineResult.ok) {
    return engineResult
  }

  const inputPath = options.file
    ? resolveCwd(options.file)
    : resolveCwd(options.config.sourceDir, 'source.md')

  const markdown = await readTextFile(inputPath)
  if (!markdown.ok) {
    return err(`${markdown.error}. Run \`llazy init\` to create a sample source file.`)
  }

  const rendered = engineResult.value.render({
    markdown: markdown.value,
    inputPath,
    config: options.config,
  })

  const outputPath = resolveCwd(options.config.outputDir, `newEmail.${rendered.extension}`)

  if (options.config.dryRun) {
    return ok({
      engine: engineResult.value.name,
      inputPath,
      outputPath,
      wrote: false,
    })
  }

  const written = await writeTextFile(outputPath, rendered.body)
  if (!written.ok) {
    return written
  }

  return ok({
    engine: engineResult.value.name,
    inputPath,
    outputPath,
    wrote: true,
  })
}
