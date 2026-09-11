/**
 * Path utilities for the CLI. Pure functions, no side effects.
 *
 * @packageDocumentation
 */

import path from 'node:path'
import {fileURLToPath} from 'node:url'

/**
 * Resolves a path relative to the current working directory.
 *
 * @param segments - Path segments to join
 * @returns Absolute path
 *
 * @example
 * ```ts
 * resolveCwd('source', 'source.md') // /abs/cwd/source/source.md
 * ```
 */
export function resolveCwd(...segments: string[]): string {
  return path.resolve(process.cwd(), ...segments)
}

/**
 * Returns the directory of the current module (ESM equivalent of `__dirname`).
 *
 * @param importMetaUrl - `import.meta.url` from the calling module
 * @returns Absolute directory path
 */
export function dirnameFromImportMeta(importMetaUrl: string): string {
  return path.dirname(fileURLToPath(importMetaUrl))
}

/**
 * Ensures a path ends with a trailing separator (platform-aware).
 *
 * @param p - Input path
 * @returns Path with trailing separator
 */
export function ensureTrailingSep(p: string): string {
  return p.endsWith(path.sep) ? p : p + path.sep
}
