import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {stubRenderer} from '../../src/engine/stub.js'
import {DEFAULT_CONFIG} from '../../src/types/config.js'

describe('stub renderer meta', () => {
  it('uses #! as the HTML title',
    () => {
      const output = stubRenderer.render({
        markdown: '#! Hello\n#~ Preview line\n# Title\n',
        inputPath: 'source/source.md',
        config: DEFAULT_CONFIG,
        meta: {subject: 'Hello', preview: 'Preview line', title: 'Title'},
      })
      assert.match(output.body, /<title>Hello<\/title>/)
      assert.match(output.body, /Preview line/)
    },
  )
})
