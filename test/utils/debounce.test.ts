import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {createDebouncer} from '../../src/utils/debounce.js'

describe('createDebouncer', () => {
  it('fires once after the quiet window',
    async () => {
      let count = 0
      const {trigger, cancel} = createDebouncer(20, () => {
        count += 1
      })
      trigger()
      trigger()
      trigger()
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
      assert.equal(count, 1)
      cancel()
    },
  )

  it('cancel prevents a pending call',
    async () => {
      let count = 0
      const {trigger, cancel} = createDebouncer(30, () => {
        count += 1
      })
      trigger()
      cancel()
      await new Promise((resolve) => {
        setTimeout(resolve, 50)
      })
      assert.equal(count, 0)
    },
  )
})
