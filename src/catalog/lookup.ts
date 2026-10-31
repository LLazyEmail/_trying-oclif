/**
 * Catalog lookup with id and alias resolution.
 *
 * @packageDocumentation
 */

import {err, ok, type Result} from '../types/result.js'
import {BUILTIN_CATALOG} from './builtin.js'
import {loadProjectCatalog, mergeCatalogs} from './project.js'
import type {CatalogEntry, ResolvedTemplate} from './types.js'

/**
 * Returns the built-in catalog.
 */
export function listCatalog(): readonly CatalogEntry[] {
  return BUILTIN_CATALOG
}

/**
 * Loads the project catalog (if present) and merges it over the built-in one.
 *
 * @param root - Project root, usually cwd
 */
export async function loadMergedCatalog(root: string): Promise<Result<readonly CatalogEntry[]>> {
  const project = await loadProjectCatalog(root)
  if (!project.ok) {
    return project
  }
  return ok(mergeCatalogs(project.value))
}

/**
 * Resolves an id or alias against a catalog.
 * Matching is case-insensitive.
 *
 * @param name - CamelCase id or kebab alias
 * @param catalog - Catalog to search (defaults to the built-in catalog)
 */
export function resolveTemplate(
  name: string,
  catalog: readonly CatalogEntry[] = BUILTIN_CATALOG,
): Result<ResolvedTemplate> {
  const needle = name.trim().toLowerCase()
  for (const entry of catalog) {
    const ids = entry.ids.map((id) => id.toLowerCase())
    const aliases = (entry.aliases ?? []).map((alias) => alias.toLowerCase())
    if (ids.includes(needle) || aliases.includes(needle)) {
      return ok({entry, matchedId: entry.ids[0] ?? name})
    }
  }
  const known = catalog.flatMap((entry) => entry.ids).join(', ') || '(none)'
  return err(`Unknown template "${name}". Known: ${known}`)
}
