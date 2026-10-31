import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {renderIndexPage} from '../../src/catalog/index-page.js'

describe('renderIndexPage', () => {
  it('links every written file',
    () => {
      const html = renderIndexPage([
        {fileName: 'welcome.html', label: 'WelcomeEmail', kind: 'transactional'},
        {fileName: 'lead-nurture.html', label: 'LeadNurtureEmail', kind: 'lead'},
      ])
      assert.match(html, /<!DOCTYPE html>/)
      assert.match(html, /href="welcome.html"/)
      assert.match(html, /WelcomeEmail/)
      assert.match(html, /2 files/)
    },
  )

  it('escapes file names',
    () => {
      const html = renderIndexPage([
        {fileName: 'a&b.html', label: 'A<B>', kind: 'newsletter'},
      ])
      assert.match(html, /a&amp;b.html/)
      assert.match(html, /A&lt;B&gt;/)
      assert.match(html, /1 file</)
    },
  )
})
