import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {listCatalog, resolveTemplate} from '../../src/catalog/lookup.js'
import {renderCatalogEntry} from '../../src/catalog/render-entry.js'
import {extractEmailMeta} from '../../src/utils/email-meta.js'
import {assertHtml} from '../../src/utils/assert-html.js'

describe('catalog', () => {
  it('lists the built-in templates',
    () => {
      const ids = listCatalog().map((entry) => entry.ids[0])
      assert.ok(ids.includes('WelcomeEmail'))
      assert.ok(ids.includes('LeadNurtureEmail'))
    },
  )

  it('resolves aliases',
    () => {
      const found = resolveTemplate('password-reset')
      assert.equal(found.ok, true)
      if (found.ok) {
        assert.equal(found.value.matchedId, 'PasswordResetEmail')
      }
    },
  )

  it('rejects unknown templates',
    () => {
      assert.equal(resolveTemplate('nope').ok, false)
    },
  )

  it('renders an HTML document',
    () => {
      const found = resolveTemplate('welcome')
      assert.equal(found.ok, true)
      if (found.ok) {
        const html = renderCatalogEntry(found.value.entry)
        const checked = assertHtml('welcome.html', html)
        assert.equal(checked.ok, true)
      }
    },
  )
})

describe('extractEmailMeta', () => {
  it('reads subject, preview, and title',
    () => {
      const meta = extractEmailMeta('#! Hello\n#~ Preview line\n# Title\n\nbody')
      assert.equal(meta.subject, 'Hello')
      assert.equal(meta.preview, 'Preview line')
      assert.equal(meta.title, 'Title')
    },
  )
})
