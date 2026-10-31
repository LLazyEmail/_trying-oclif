/**
 * Loads a project catalog and merges it with the built-in catalog.
 * First match wins: `.llazy/catalog.json`, then `llazy.catalog.json`.
 * Project entries override built-in entries that share an id or alias.
 *
 * @packageDocumentation
 */

import path from 'node:path'
import {err, ok, type Result} from '../types/result.js'
import {pathExists, readTextFile} from '../utils/fs.js'
import {BUILTIN_CATALOG} from './builtin.js'
import type {CatalogEntry, TemplateKind} from './types.js'

const CATALOG_FILES = ['.llazy/catalog.json', 'llazy.catalog.json'] as const
const KINDS: readonly TemplateKind[] = ['transactional', 'newsletter', 'lead']

function isKind(value: unknown): value is TemplateKind {
  return typeof value === 'string' && (KINDS as readonly string[]).includes(value)
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isPayload(value: unknown): value is Readonly<Record<string, unknown>> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Parses a raw JSON value into catalog entries.
 * Accepts `{ "templates": [...] }` or a bare array.
 *
 * @param value - Parsed JSON
 */
export function parseCatalogFile(value: unknown): Result<readonly CatalogEntry[]> {
  const list = Array.isArray(value)
    ? value
    : isPayload(value) && Array.isArray(value.templates)
      ? value.templates
      : undefined

  if (list === undefined) {
    return err('Catalog file must be an array or { "templates": [...] }')
  }

  const entries: CatalogEntry[] = []
  for (const item of list) {
    if (!isPayload(item)) {
      return err('Each catalog entry must be an object')
    }
    if (!isStringArray(item.ids) || item.ids.length === 0) {
      return err('Each catalog entry needs a non-empty ids array')
    }
    if (!isKind(item.kind)) {
      return err(`Invalid kind for ${item.ids[0]}: ${String(item.kind)}`)
    }
    if (typeof item.description !== 'string') {
      return err(`description must be a string for ${item.ids[0]}`)
    }
    if (typeof item.fileName !== 'string' || item.fileName.length === 0) {
      return err(`fileName must be a string for ${item.ids[0]}`)
    }
    if (!isPayload(item.samplePayload)) {
      return err(`samplePayload must be an object for ${item.ids[0]}`)
    }

    const aliases = item.aliases === undefined
      ? undefined
      : isStringArray(item.aliases)
        ? item.aliases
        : null
    if (aliases === null) {
      return err(`aliases must be a string array for ${item.ids[0]}`)
    }

    entries.push({
      ids: item.ids,
      ...(aliases === undefined ? {} : {aliases}),
      kind: item.kind,
      description: item.description,
      samplePayload: item.samplePayload,
      fileName: item.fileName,
    })
  }

  return ok(entries)
}

/**
 * Finds the first existing catalog file under `root`.
 */
export async function findCatalogFile(root: string): Promise<string | undefined> {
  for (const name of CATALOG_FILES) {
    const candidate = path.resolve(root, name)
    if (await pathExists(candidate)) {
      return candidate
    }
  }
  return undefined
}

/**
 * Loads the project catalog. Missing file is not an error — returns `[]`.
 */
export async function loadProjectCatalog(root: string): Promise<Result<readonly CatalogEntry[]>> {
  const filePath = await findCatalogFile(root)
  if (filePath === undefined) {
    return ok([])
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

  const entries = parseCatalogFile(parsed)
  if (!entries.ok) {
    return err(`${filePath}: ${entries.error}`, entries.cause)
  }
  return entries
}

function keysOf(entry: CatalogEntry): string[] {
  return [...entry.ids, ...(entry.aliases ?? [])].map((key) => key.toLowerCase())
}

/**
 * Merges project entries over the built-in catalog.
 * A project entry replaces a built-in entry when any id or alias overlaps.
 */
export function mergeCatalogs(
  project: readonly CatalogEntry[],
  builtin: readonly CatalogEntry[] = BUILTIN_CATALOG,
): readonly CatalogEntry[] {
  const claimed = new Set(project.flatMap(keysOf))
  const remaining = builtin.filter((entry) => !keysOf(entry).some((key) => claimed.has(key)))
  return Object.freeze([...project, ...remaining])
}
