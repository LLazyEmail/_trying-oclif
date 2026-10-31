/**
 * Renderer engine contract.
 * Future markdown-to-email adapters will implement this interface.
 * The CLI itself only depends on this surface.
 *
 * @packageDocumentation
 */

import type {CliConfig} from '../types/config.js'

/**
 * Subject and preview pulled from Markdown (`#!` / `#~`).
 * Optional under exactOptionalPropertyTypes, so callers may omit them.
 */
export interface EmailMetaFields {
  readonly subject?: string | undefined
  readonly preview?: string | undefined
  readonly title?: string | undefined
}

/**
 * Input passed to a renderer.
 */
export interface RenderRequest {
  readonly markdown: string
  readonly inputPath: string
  readonly config: Readonly<CliConfig>
  readonly meta?: EmailMetaFields | undefined
}

/**
 * Successful render payload.
 */
export interface RenderOutput {
  readonly body: string
  readonly extension: 'html' | 'jsx' | 'json'
}

/**
 * Pluggable renderer. Implementations must be side-effect free
 * except for the returned output (no implicit disk writes).
 */
export interface RendererEngine {
  readonly name: string
  render(request: RenderRequest): RenderOutput
}
