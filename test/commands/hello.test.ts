import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import Hello from '../../src/commands/hello.js'

describe('hello command', () => {
  it('runs with the default name',
    async () => {
      await Hello.run([])
      assert.ok(true)
    },
  )

  it('runs with a custom name and --force',
    async () => {
      await Hello.run(['Ada', '--force'])
      assert.ok(true)
    },
  )
})
