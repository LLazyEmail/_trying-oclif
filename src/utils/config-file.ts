/**
 * Loads optional project config from disk.
 * Supported filenames (first match wins):
 *   .llazyrc.json
 *   llazy.config.json
 *
 * @packageDocumentation
 */

import path from 'node:path'
import {
  createConfig,
  isOutputFormat,
  isParseMode,
  type CliConfig,
  type OutputFormat,
  type ParseMode,
} from '../types/config.js'
import {err, ok, type Result} from '../types/result.js'
import {pathExists, readTextFile} from './fs.js'

const CONFIG_FILENAMES = ['.llazyrc.json', 'llazy.config.json'] as const

/**
 * Shape of the optional on-disk config file.
 * All fields are optional; missing values fall back to defaults.
 */
export interface ConfigFileShape {
  readonly sourceDir?: string
  readonly outputDir?: string
  readonly parseMode?: ParseMode
  readonly format?: OutputFormat
  readonly verbose?: boolean
  readonly dryRun?: boolean
}

/**
 * Resolves the first existing config file under `root`.
 *
 * @param root - Project root (usually cwd)
 * @returns Absolute path, or `undefined` if none exists
 */
export async function findConfigFile(root: string): Promise<string | undefined> {
  for (const name of CONFIG_FILENAMES) {
    const candidate = path.resolve(root, name)
    if (await pathExists(candidate)) {
      return candidate
    }
  }
  return undefined
}

/**
 * Parses a raw JSON value into a ConfigFileShape.
 * Unknown keys are ignored. Invalid enum values are rejected.
 *
 * @param value - Parsed JSON
 * @returns Ok with a sanitized shape, or Err
 */
export function parseConfigFile(value: unknown): Result<ConfigFileShape> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return err('Config file must be a JSON object')
  }

  const raw = value as Record<string, unknown>
  const next: {
    sourceDir?: string
    outputDir?: string
    parseMode?: ParseMode
    format?: OutputFormat
    verbose?: boolean
    dryRun?: boolean
  } = {}

  if (raw.sourceDir !== undefined) {
    if (typeof raw.sourceDir !== 'string') {
      return err('sourceDir must be a string')
    }
    next.sourceDir = raw.sourceDir
  }

  if (raw.outputDir !== undefined) {
    if (typeof raw.outputDir !== 'string') {
      return err('outputDir must be a string')
    }
    next.outputDir = raw.outputDir
  }

  if (raw.parseMode !== undefined) {
    if (!isParseMode(raw.parseMode)) {
      return err(`Invalid parseMode: ${String(raw.parseMode)}`)
    }
    next.parseMode = raw.parseMode
  }

  if (raw.format !== undefined) {
    if (!isOutputFormat(raw.format)) {
      return err(`Invalid format: ${String(raw.format)}`)
    }
    next.format = raw.format
  }

  if (raw.verbose !== undefined) {
    if (typeof raw.verbose !== 'boolean') {
      return err('verbose must be a boolean')
    }
    next.verbose = raw.verbose
  }

  if (raw.dryRun !== undefined) {
    if (typeof raw.dryRun !== 'boolean') {
      return err('dryRun must be a boolean')
    }
    next.dryRun = raw.dryRun
  }

  return ok(next)
}

/**
 * Loads and validates a config file, then merges it into a frozen CliConfig.
 * Missing file is not an error — defaults are used.
 *
 * @param root - Project root to search
 * @returns Frozen CliConfig
 */
export async function loadProjectConfig(root: string): Promise<Result<Readonly<CliConfig>>> {
  const filePath = await findConfigFile(root)
  if (filePath === undefined) {
    return ok(createConfig())
  }

  const raw = await readTextFile(filePath)
  if (!raw.ok) {
    return raw
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw.value) as unknown
  } catch (cause) {
    return err(`Invalid JSON in ${filePath}`, cause)
  }

  const shape = parseConfigFile(parsed)
  if (!shape.ok) {
    return err(`${filePath}: ${shape.error}`, shape.cause)
  }

  return ok(createConfig(shape.value))
}
