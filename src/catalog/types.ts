/**
 * Named template catalog.
 * Mirrors the generate-template / Postmark defineEmail shape without importing those packages.
 *
 * @packageDocumentation
 */

/**
 * Kind of email the catalog entry produces.
 */
export type TemplateKind = 'transactional' | 'newsletter' | 'lead'

/**
 * One catalog entry. Ids are CamelCase; aliases are kebab-case CLI names.
 */
export interface CatalogEntry {
  readonly ids: readonly string[]
  readonly aliases?: readonly string[]
  readonly kind: TemplateKind
  readonly description: string
  readonly samplePayload: Readonly<Record<string, unknown>>
  readonly fileName: string
}

/**
 * Resolved lookup result.
 */
export interface ResolvedTemplate {
  readonly entry: CatalogEntry
  readonly matchedId: string
}
