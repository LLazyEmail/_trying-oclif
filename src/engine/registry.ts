/**
 * Named registry of renderer engines.
 * Future adapters (markdown-to-email, etc.) register here.
 * The CLI never imports a concrete engine except the built-in stub.
 *
 * @packageDocumentation
 */

import {err, ok, type Result} from '../types/result.js'
import {stubRenderer} from './stub.js'
import type {RendererEngine} from './types.js'

const engines = new Map<string, RendererEngine>()

registerEngine(stubRenderer)

/**
 * Registers (or replaces) a renderer under `engine.name`.
 *
 * @param engine - Implementation to register
 */
export function registerEngine(engine: RendererEngine): void {
  engines.set(engine.name, engine)
}

/**
 * Looks up a registered renderer.
 *
 * @param name - Engine name (default: `stub`)
 */
export function getEngine(name = 'stub'): Result<RendererEngine> {
  const engine = engines.get(name)
  if (engine === undefined) {
    const known = listEngines().join(', ') || '(none)'
    return err(`Unknown engine "${name}". Registered: ${known}`)
  }
  return ok(engine)
}

/**
 * Returns the names of every registered engine, sorted.
 */
export function listEngines(): readonly string[] {
  return Object.freeze([...engines.keys()].sort())
}

/**
 * Test-only helper: remove every engine except the built-in stub.
 */
export function resetEnginesForTests(): void {
  engines.clear()
  registerEngine(stubRenderer)
}
