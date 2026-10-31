/**
 * Loads a JSON payload file used to override a template's sample payload.
 *
 * @packageDocumentation
 */

import {err, ok, type Result} from '../types/result.js'
import {readTextFile} from '../utils/fs.js'

/**
 * Reads and parses a JSON object payload.
 *
 * @param filePath - Path to a JSON file
 */
export async function loadPayloadFile(
  filePath: string,
): Promise<Result<Readonly<Record<string, unknown>>>> {
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

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return err(`${filePath}: payload must be a JSON object`)
  }

  return ok(parsed as Readonly<Record<string, unknown>>)
}
