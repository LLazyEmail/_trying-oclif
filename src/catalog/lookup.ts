/**
 * Catalog lookup with id and alias resolution.
 *
 * @packageDocumentation
 */

import {err, ok, type Result} from '../types/result.js'
import {BUILTIN_CATALOG} from './builtin.js'
import type {CatalogEntry, ResolvedTemplate} from './types.js'

/**
 * Returns the built-in catalog.
 */
export function listCatalog(): readonly CatalogEntry[] {
  return BUILTIN_CATALOG
}

/**
 * Resolves an id or alias to a catalog entry.
 * Matching is case-insensitive.
 *
 * @param name - CamelCase id or kebab alias
 */
export function resolveTemplate(name: string): Result<ResolvedTemplate> {
  const needle = name.trim().toLowerCase()
  for (const entry of BUILTIN_CATALOG) {
    const ids = entry.ids.map((id) => id.toLowerCase())
    const aliases = (entry.aliases ?? []).map((alias) => alias.toLowerCase())
    if (ids.includes(needle) || aliases.includes(needle)) {
      return ok({entry, matchedId: entry.ids[0] ?? name})
    }
  }
  const known = BUILTIN_CATALOG.flatMap((entry) => entry.ids).join(', ')
  return err(`Unknown template "${name}". Known: ${known}`)
}
