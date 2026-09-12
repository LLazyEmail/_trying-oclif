/**
 * Tiny debounce helper for `parse --watch`.
 * No external dependency.
 *
 * @packageDocumentation
 */

/**
 * Returns a function that invokes `fn` after `delayMs` of quiet time.
 *
 * @param delayMs - Quiet window in milliseconds
 * @param fn - Callback to fire
 * @returns Debounced trigger + a cancel() helper
 */
export function createDebouncer(
  delayMs: number,
  fn: () => void,
): {trigger: () => void; cancel: () => void} {
  let timer: ReturnType<typeof setTimeout> | undefined

  return {
    trigger(): void {
      if (timer !== undefined) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        timer = undefined
        fn()
      }, delayMs)
    },
    cancel(): void {
      if (timer !== undefined) {
        clearTimeout(timer)
        timer = undefined
      }
    },
  }
}
