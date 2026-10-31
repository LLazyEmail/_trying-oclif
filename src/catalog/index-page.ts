/**
 * Preview index written next to generated HTML.
 * Same idea as the generate-template sandbox `index.html`.
 *
 * @packageDocumentation
 */

export interface IndexEntry {
  readonly fileName: string
  readonly label: string
  readonly kind: string
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/**
 * Renders a static index that links every generated file.
 *
 * @param entries - Files written in this run
 */
export function renderIndexPage(entries: readonly IndexEntry[]): string {
  const items = entries
    .map(
      (entry) =>
        `    <li><a href="${escapeHtml(entry.fileName)}">${escapeHtml(entry.label)}</a> <span>${escapeHtml(entry.kind)}</span></li>`,
    )
    .join('\n')

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8" />',
    '  <title>Generated emails</title>',
    '  <style>body{font-family:system-ui,sans-serif;margin:2rem} li{margin:.4rem 0} span{color:#666;margin-left:.5rem}</style>',
    '</head>',
    '<body>',
    '  <h1>Generated emails</h1>',
    `  <p>${entries.length} file${entries.length === 1 ? '' : 's'}</p>`,
    '  <ul>',
    items,
    '  </ul>',
    '</body>',
    '</html>',
    '',
  ].join('\n')
}
