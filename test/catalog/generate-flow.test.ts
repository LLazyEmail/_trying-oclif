import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {listCatalog, resolveTemplate} from '../../src/catalog/lookup.js'
import {loadPayloadFile} from '../../src/catalog/payload.js'
import {renderCatalogEntry} from '../../src/catalog/render-entry.js'
import {assertHtml} from '../../src/utils/assert-html.js'
import {writeTextFile, readTextFile} from '../../src/utils/fs.js'
import os from 'node:os'
import path from 'node:path'

describe('catalog generate flow', () => {
  it('renders every built-in template as an HTML document',
    () => {
      for (const entry of listCatalog()) {
        const html = renderCatalogEntry(entry)
        const checked = assertHtml(entry.fileName, html)
        assert.equal(checked.ok, true, entry.ids[0])
      }
    },
  )

  it('rejects HTML that is not a document',
    () => {
      const checked = assertHtml('bad.html', '<p>nope</p>')
      assert.equal(checked.ok, false)
    },
  )

  it('flags files over the size limit',
    () => {
      const html = `<!DOCTYPE html><html>${'x'.repeat(2000)}</html>`
      const checked = assertHtml('big.html', html, 1)
      assert.equal(checked.ok, true)
      if (checked.ok) {
        assert.equal(checked.value.overLimit, true)
      }
    },
  )

  it('overrides the sample payload from a JSON file',
    async () => {
      const dir = await import('node:fs/promises').then((fs) => fs.mkdtemp(path.join(os.tmpdir(), 'llazy-')))
      const payloadPath = path.join(dir, 'payload.json')
      await writeTextFile(payloadPath, JSON.stringify({name: 'Sam', amount: '$1'}))

      const loaded = await loadPayloadFile(payloadPath)
      assert.equal(loaded.ok, true)
      if (!loaded.ok) return

      const resolved = resolveTemplate('welcome')
      assert.equal(resolved.ok, true)
      if (!resolved.ok) return

      const html = renderCatalogEntry(resolved.value.entry, loaded.value)
      assert.match(html, /Sam/)
      assert.doesNotMatch(html, />Alex</)

      const written = await readTextFile(payloadPath)
      assert.equal(written.ok, true)
    },
  )
})
