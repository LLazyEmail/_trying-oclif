/**
 * Result-based filesystem helpers.
 * Commands should use these instead of raw fs so errors stay typed.
 *
 * @packageDocumentation
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import {err, ok, type Result} from '../types/result.js'

/**
 * Reads a UTF-8 text file.
 *
 * @param filePath - Absolute or relative path
 * @returns Ok with file contents, or Err if the file cannot be read
 */
export async function readTextFile(filePath: string): Promise<Result<string>> {
  try {
    const contents = await fs.readFile(filePath, 'utf8')
    return ok(contents)
  } catch (cause) {
    return err(`Unable to read file: ${filePath}`, cause)
  }
}

/**
 * Writes a UTF-8 text file, creating parent directories if needed.
 *
 * @param filePath - Destination path
 * @param contents - File body
 * @returns Ok(true) on success
 */
export async function writeTextFile(
  filePath: string,
  contents: string,
): Promise<Result<true>> {
  try {
    await fs.mkdir(path.dirname(filePath), {recursive: true})
    await fs.writeFile(filePath, contents, 'utf8')
    return ok(true)
  } catch (cause) {
    return err(`Unable to write file: ${filePath}`, cause)
  }
}

/**
 * Creates a directory (and parents) if it does not already exist.
 *
 * @param dirPath - Directory to create
 * @returns Ok(true) on success
 */
export async function ensureDir(dirPath: string): Promise<Result<true>> {
  try {
    await fs.mkdir(dirPath, {recursive: true})
    return ok(true)
  } catch (cause) {
    return err(`Unable to create directory: ${dirPath}`, cause)
  }
}

/**
 * Returns true when a path exists.
 *
 * @param targetPath - File or directory path
 */
export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await fs.access(targetPath)
    return true
  } catch {
    return false
  }
}
