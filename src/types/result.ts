/**
 * Discriminated result type used across the CLI for success / failure.
 * Avoids throwing for expected operational errors.
 *
 * @packageDocumentation
 */

/**
 * Successful outcome carrying a value of type `T`.
 */
export interface Ok<T> {
  readonly ok: true
  readonly value: T
}

/**
 * Failed outcome carrying an error message and optional cause.
 */
export interface Err {
  readonly ok: false
  readonly error: string
  readonly cause?: unknown
}

/**
 * Result monad used by pure domain functions.
 */
export type Result<T> = Ok<T> | Err

/**
 * Creates a successful Result.
 *
 * @param value - The success payload
 * @returns Ok result
 *
 * @example
 * ```ts
 * const r = ok(42)
 * if (r.ok) console.log(r.value) // 42
 * ```
 */
export function ok<T>(value: T): Ok<T> {
  return {ok: true, value}
}

/**
 * Creates a failed Result.
 *
 * @param error - Human-readable error message
 * @param cause - Optional underlying error
 * @returns Err result
 *
 * @example
 * ```ts
 * const r = err('file not found', new Error('ENOENT'))
 * if (!r.ok) console.error(r.error)
 * ```
 */
export function err(error: string, cause?: unknown): Err {
  return {ok: false, error, cause}
}

/**
 * Type predicate for Ok results.
 */
export function isOk<T>(result: Result<T>): result is Ok<T> {
  return result.ok === true
}

/**
 * Type predicate for Err results.
 */
export function isErr<T>(result: Result<T>): result is Err {
  return result.ok === false
}
