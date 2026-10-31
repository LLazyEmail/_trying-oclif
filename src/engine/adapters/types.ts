/**
 * Adapter boundary.
 *
 * These types describe what a future sibling-package adapter must satisfy.
 * Nothing in this file imports those packages. Do not add those imports here.
 *
 * markdown-to-email (later):
 *   entry to call: the parse pipeline that today is `npm run dev:parseFull`
 *   input: `source/source.md` (or the path `runParseOnce` already resolved)
 *   output: HTML string, written by the CLI, not by the adapter
 *
 * generate-template (later):
 *   entry to call: `createGenerator` + `run` / `writeAll`
 *   input: a catalog the project already owns
 *   output: HTML string per template id; the CLI still owns the write
 *
 * @packageDocumentation
 */

import type {CatalogEntry} from '../../catalog/types.js'
import type {RenderRequest, RenderOutput} from '../types.js'

/**
 * A Markdown engine adapter. Implements `RendererEngine` and may
 * additionally expose the raw HTML it produced.
 */
export interface MarkdownEngineAdapter {
  readonly name: string
  render(request: RenderRequest): RenderOutput
}

/**
 * A catalog engine adapter. Turns one catalog entry + payload into HTML.
 * The CLI remains responsible for writing the file.
 */
export interface CatalogEngineAdapter {
  readonly name: string
  render(
    entry: CatalogEntry,
    payload: Readonly<Record<string, unknown>>,
  ): string
}

/**
 * Names reserved for the first real adapters. Do not register a stub under these.
 */
export const RESERVED_ENGINE_NAMES = ['markdown', 'generate-template'] as const
