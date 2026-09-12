import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {DEFAULT_CONFIG, createConfig, mergeConfig} from '../../src/types/config.js'

describe('mergeConfig', () => {
  it('keeps base values when overlay is empty',
    () => {
      const merged = mergeConfig(DEFAULT_CONFIG, {})
      assert.deepEqual(merged, DEFAULT_CONFIG)
    },
  )

  it('applies only defined overlay keys',
    () => {
      const base = createConfig({parseMode: 'recipesFull', verbose: true})
      const merged = mergeConfig(base, {format: 'json'})
      assert.equal(merged.parseMode, 'recipesFull')
      assert.equal(merged.verbose, true)
      assert.equal(merged.format, 'json')
      assert.equal(merged.sourceDir, './source')
    },
  )

  it('lets flags override a config-file base',
    () => {
      const fromFile = createConfig({
        sourceDir: './mail',
        parseMode: 'reactFull',
        format: 'react',
      })
      const fromFlags = mergeConfig(fromFile, {format: 'html', dryRun: true})
      assert.equal(fromFlags.sourceDir, './mail')
      assert.equal(fromFlags.parseMode, 'reactFull')
      assert.equal(fromFlags.format, 'html')
      assert.equal(fromFlags.dryRun, true)
    },
  )

  it('returns a frozen object',
    () => {
      const merged = mergeConfig(DEFAULT_CONFIG, {verbose: true})
      assert.equal(Object.isFrozen(merged), true)
    },
  )
})
