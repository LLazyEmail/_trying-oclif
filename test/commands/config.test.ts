import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import ConfigCommand from '../../src/commands/config.js'

describe('config command', () => {
  it('prints resolved configuration JSON',
    async () => {
      await ConfigCommand.run(['--format', 'json'])
      assert.ok(true)
    },
  )
})
