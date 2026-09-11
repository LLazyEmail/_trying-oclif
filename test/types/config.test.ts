/**
 * Unit tests for config types and helpers.
 * Uses Node.js native test runner (node:test) and strict assertions.
 */

import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_CONFIG,
  createConfig,
  isParseMode,
  isOutputFormat,
  type CliConfig,
} from '../../src/types/config.js'

describe('DEFAULT_CONFIG', () => {
  it('is frozen',
    () => {
      assert.equal(Object.isFrozen(DEFAULT_CONFIG), true)
    },
  )

  it('has expected default values',
    () => {
      assert.equal(DEFAULT_CONFIG.sourceDir, './source')
      assert.equal(DEFAULT_CONFIG.outputDir, './generated')
      assert.equal(DEFAULT_CONFIG.parseMode, 'full')
      assert.equal(DEFAULT_CONFIG.format, 'html')
      assert.equal(DEFAULT_CONFIG.verbose, false)
      assert.equal(DEFAULT_CONFIG.dryRun, false)
    },
  )
})

describe('createConfig', () => {
  it('returns a frozen object',
    () => {
      const cfg = createConfig()
      assert.equal(Object.isFrozen(cfg), true)
    },
  )

  it('applies defaults when no overrides are given',
    () => {
      const cfg = createConfig()
      assert.deepEqual(cfg, DEFAULT_CONFIG)
    },
  )

  it('merges partial overrides while preserving remaining defaults',
    () => {
      const cfg = createConfig({
        parseMode: 'reactFull',
        verbose: true,
      })

      assert.equal(cfg.parseMode, 'reactFull')
      assert.equal(cfg.verbose, true)
      assert.equal(cfg.sourceDir, './source')
      assert.equal(cfg.outputDir, './generated')
      assert.equal(cfg.format, 'html')
      assert.equal(cfg.dryRun, false)
    },
  )

  it('produces a new object (no shared mutable state)',
    () => {
      const a = createConfig({verbose: true})
      const b = createConfig({verbose: false})
      assert.notEqual(a, b)
      assert.equal(a.verbose, true)
      assert.equal(b.verbose, false)
    },
  )
})

describe('isParseMode', () => {
  it('accepts valid modes',
    () => {
      assert.equal(isParseMode('full'), true)
      assert.equal(isParseMode('reactFull'), true)
      assert.equal(isParseMode('recipesFull'), true)
      assert.equal(isParseMode('hackernoonFront'), true)
    },
  )

  it('rejects invalid values',
    () => {
      assert.equal(isParseMode('invalid'), false)
      assert.equal(isParseMode(''), false)
      assert.equal(isParseMode(42), false)
      assert.equal(isParseMode(null), false)
      assert.equal(isParseMode(undefined), false)
      assert.equal(isParseMode({}), false)
    },
  )
})

describe('isOutputFormat', () => {
  it('accepts valid formats',
    () => {
      assert.equal(isOutputFormat('html'), true)
      assert.equal(isOutputFormat('react'), true)
      assert.equal(isOutputFormat('json'), true)
    },
  )

  it('rejects invalid values',
    () => {
      assert.equal(isOutputFormat('xml'), false)
      assert.equal(isOutputFormat(123), false)
      assert.equal(isOutputFormat(undefined), false)
    },
  )
})

describe('CliConfig immutability', () => {
  it('does not allow mutation of returned config',
    () => {
      const cfg: CliConfig = createConfig()
      assert.throws(() => {
        // @ts-expect-error – intentionally testing runtime freeze
        ;(cfg as {verbose: boolean}).verbose = true
      })
    },
  )
})
