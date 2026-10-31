/**
 * Built-in stub renderer.
 * Produces a valid placeholder document so `llazy parse` can write
 * real files before the markdown-to-email engine is wired in.
 *
 * @packageDocumentation
 */

import type {RendererEngine, RenderOutput, RenderRequest} from './types.js'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function toHtml(request: RenderRequest): string {
  const title = request.meta?.subject ?? 'LLazyEmail stub output'
  const preview = request.meta?.preview
  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    `  <title>${escapeHtml(title)}</title>`,
    '</head>',
    '<body>',
    preview === undefined
      ? ''
      : `  <span style="display:none">${escapeHtml(preview)}</span>`,
    '  <p><!-- stub renderer — replace with markdown-to-email later --></p>',
    `  <p>Source: ${escapeHtml(request.inputPath)}</p>`,
    '  <pre>',
    escapeHtml(request.markdown),
    '  </pre>',
    '</body>',
    '</html>',
    '',
  ].filter((line) => line !== '').join('\n')
}

function toReact(markdown: string, inputPath: string): string {
  return [
    'export default function Email() {',
    '  return (',
    '    <html>',
    '      <body>',
    `        <p>{\`${inputPath.replaceAll('`', '\\`')}\`}</p>`,
    `        <pre>{\`${markdown.replaceAll('`', '\\`')}\`}</pre>`,
    '      </body>',
    '    </html>',
    '  )',
    '}',
    '',
  ].join('\n')
}

function toJson(request: RenderRequest): string {
  return `${JSON.stringify(
    {
      engine: 'stub',
      inputPath: request.inputPath,
      subject: request.meta?.subject,
      preview: request.meta?.preview,
      markdown: request.markdown,
    },
    null,
    2,
  )}\n`
}

/**
 * Default engine used until a real adapter is registered.
 */
export const stubRenderer: RendererEngine = {
  name: 'stub',
  render(request: RenderRequest): RenderOutput {
    switch (request.config.format) {
      case 'react':
        return {body: toReact(request.markdown, request.inputPath), extension: 'jsx'}
      case 'json':
        return {body: toJson(request), extension: 'json'}
      default:
        return {body: toHtml(request), extension: 'html'}
    }
  },
}
