/**
 * Renderer engine contract.
 * Future markdown-to-email adapters will implement this interface.
 * The CLI itself only depends on this surface.
 *
 * @packageDocumentation
 */

import type {CliConfig} from '../types/config.js'

/**
 * Input passed to a renderer.
 */
export interface RenderRequest {
  readonly markdown: string
  readonly inputPath: string
  readonly config: Readonly<CliConfig>
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
