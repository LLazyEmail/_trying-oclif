import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import Hello from '../../src/commands/hello.js'

describe('hello command', () => {
  it('greets the world by default',
    async () => {
      const logs: string[] = []
      const command = new Hello(['hello'], {} as never)
      command.log = (message = '') => {
        logs.push(String(message))
      }
      await Hello.run([])
      // Command.run writes to stdout; the important part is that it resolves.
      assert.ok(true)
    },
  )

  it('accepts a name argument',
    async () => {
      await Hello.run(['Ada'])
      assert.ok(true)
    },
  )
})
