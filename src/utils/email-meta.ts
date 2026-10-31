/**
 * Extracts subject and preview text from LLazyEmail Markdown syntax.
 * `#!` is the subject, `#~` is the preview / preheader (from markdown-to-email).
 *
 * @packageDocumentation
 */

export interface EmailMeta {
  readonly subject?: string
  readonly preview?: string
  readonly title?: string
}

/**
 * Pulls `#!`, `#~`, and the first `#` title out of a Markdown source.
 *
 * @param markdown - Source text
 */
export function extractEmailMeta(markdown: string): EmailMeta {
  const lines = markdown.split(/\r?\n/)
  let subject: string | undefined
  let preview: string | undefined
  let title: string | undefined

  for (const line of lines) {
    const trimmed = line.trim()
    if (subject === undefined && trimmed.startsWith('#!')) {
      subject = trimmed.slice(2).trim()
      continue
    }
    if (preview === undefined && trimmed.startsWith('#~')) {
      preview = trimmed.slice(2).trim()
      continue
    }
    if (title === undefined && /^#\s+/.test(trimmed) && !trimmed.startsWith('#!') && !trimmed.startsWith('#~')) {
      title = trimmed.replace(/^#\s+/, '').trim()
    }
  }

  const meta: {subject?: string; preview?: string; title?: string} = {}
  if (subject !== undefined) meta.subject = subject
  if (preview !== undefined) meta.preview = preview
  if (title !== undefined) meta.title = title
  return meta
}
