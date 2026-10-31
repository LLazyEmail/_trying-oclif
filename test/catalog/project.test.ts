import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {mergeCatalogs, parseCatalogFile} from '../../src/catalog/project.js'
import type {CatalogEntry} from '../../src/catalog/types.js'

const builtin: CatalogEntry = {
  ids: ['WelcomeEmail'],
  aliases: ['welcome'],
  kind: 'transactional',
  description: 'built-in',
  fileName: 'welcome.html',
  samplePayload: {name: 'Alex'},
}

describe('parseCatalogFile', () => {
  it('accepts a templates wrapper',
    () => {
      const result = parseCatalogFile({
        templates: [
          {
            ids: ['ReceiptEmail'],
            aliases: ['receipt'],
            kind: 'transactional',
            description: 'Receipt',
            fileName: 'receipt.html',
            samplePayload: {amount: '$10'},
          },
        ],
      })
      assert.equal(result.ok, true)
      if (result.ok) {
        assert.equal(result.value[0]?.ids[0], 'ReceiptEmail')
      }
    },
  )

  it('rejects a missing ids array',
    () => {
      const result = parseCatalogFile({templates: [{kind: 'lead'}]})
      assert.equal(result.ok, false)
    },
  )
})

describe('mergeCatalogs', () => {
  it('lets a project entry override a built-in id',
    () => {
      const project: CatalogEntry = {
        ids: ['WelcomeEmail'],
        aliases: ['welcome'],
        kind: 'transactional',
        description: 'project',
        fileName: 'welcome.html',
        samplePayload: {name: 'Sam'},
      }
      const merged = mergeCatalogs([project], [builtin])
      assert.equal(merged.length, 1)
      assert.equal(merged[0]?.description, 'project')
    },
  )

  it('keeps built-in entries that do not overlap',
    () => {
      const project: CatalogEntry = {
        ids: ['ReceiptEmail'],
        kind: 'transactional',
        description: 'project',
        fileName: 'receipt.html',
        samplePayload: {},
      }
      const merged = mergeCatalogs([project], [builtin])
      assert.deepEqual(
        merged.map((entry) => entry.ids[0]),
        ['ReceiptEmail', 'WelcomeEmail'],
      )
    },
  )
})
