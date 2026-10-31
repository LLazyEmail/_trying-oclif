/**
 * Renders a catalog entry to HTML using its sample (or override) payload.
 * Stub document — same contract a future Postmark / generate-template adapter will fill.
 *
 * @packageDocumentation
 */

import type {CatalogEntry} from './types.js'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function rows(payload: Readonly<Record<string, unknown>>): string {
  return Object.entries(payload)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapeHtml(key)}</td><td>${escapeHtml(String(value))}</td></tr>`,
    )
    .join('\n')
}

/**
 * Renders one catalog entry to an XHTML-ish email document.
 *
 * @param entry - Catalog entry
 * @param payload - Payload (defaults to the entry sample)
 */
export function renderCatalogEntry(
  entry: CatalogEntry,
  payload: Readonly<Record<string, unknown>> = entry.samplePayload,
): string {
  const id = entry.ids[0] ?? 'Template'
  const subject = String(payload.subject ?? id)
  const preview = String(payload.preview ?? entry.description)
  return [
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
    '<html xmlns="http://www.w3.org/1999/xhtml">',
    '<head>',
    '  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />',
    `  <title>${escapeHtml(subject)}</title>`,
    '</head>',
    '<body>',
    `  <span style="display:none;font-size:1px;color:#fff">${escapeHtml(preview)}</span>`,
    `  <h1>${escapeHtml(id)}</h1>`,
    `  <p>${escapeHtml(entry.description)}</p>`,
    '  <table role="presentation">',
    rows(payload),
    '  </table>',
    '  <p><!-- stub catalog renderer — replace with generate-template later --></p>',
    '</body>',
    '</html>',
    '',
  ].join('\n')
}
