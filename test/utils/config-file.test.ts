import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {parseConfigFile} from '../../src/utils/config-file.js'

describe('parseConfigFile', () => {
  it('accepts an empty object',
    () => {
      const result = parseConfigFile({})
      assert.equal(result.ok, true)
      if (result.ok) {
        assert.deepEqual(result.value, {})
      }
    },
  )

  it('keeps valid fields',
    () => {
      const result = parseConfigFile({
        sourceDir: './src',
        parseMode: 'reactFull',
        format: 'json',
        verbose: true,
      })
      assert.equal(result.ok, true)
      if (result.ok) {
        assert.equal(result.value.sourceDir, './src')
        assert.equal(result.value.parseMode, 'reactFull')
        assert.equal(result.value.format, 'json')
        assert.equal(result.value.verbose, true)
      }
    },
  )

  it('rejects invalid parseMode',
    () => {
      const result = parseConfigFile({parseMode: 'nope'})
      assert.equal(result.ok, false)
    },
  )

  it('rejects arrays and primitives',
    () => {
      assert.equal(parseConfigFile([]).ok, false)
      assert.equal(parseConfigFile('x').ok, false)
      assert.equal(parseConfigFile(null).ok, false)
    },
  )
})
