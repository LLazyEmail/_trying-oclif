/**
 * Asserts generated email HTML is usable.
 * Inspired by generate-template-assert and the email-template-workflows
 * Gmail clipping check (default 102 KB).
 *
 * @packageDocumentation
 */

import {err, ok, type Result} from '../types/result.js'

export const DEFAULT_SIZE_LIMIT_KB = 102

export interface HtmlAssert {
  readonly path: string
  readonly bytes: number
  readonly hasDocument: boolean
  readonly overLimit: boolean
}

/**
 * Checks one HTML string.
 *
 * @param path - File path (for the report)
 * @param html - File contents
 * @param sizeLimitKb - Soft size limit in kilobytes
 */
export function assertHtml(
  path: string,
  html: string,
  sizeLimitKb = DEFAULT_SIZE_LIMIT_KB,
): Result<HtmlAssert> {
  const hasDocument = /<html/i.test(html) || /<!doctype/i.test(html)
  if (!hasDocument) {
    return err(`${path} is not an HTML document (missing <html or <!doctype)`)
  }
  const bytes = Buffer.byteLength(html, 'utf8')
  const overLimit = bytes > sizeLimitKb * 1024
  return ok({
    path,
    bytes,
    hasDocument,
    overLimit,
  })
}
