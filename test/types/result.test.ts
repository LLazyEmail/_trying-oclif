/**
 * Unit tests for the Result discriminated union.
 */

import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {ok, err, isOk, isErr, type Result} from '../../src/types/result.js'

describe('ok', () => {
  it('creates a successful result',
    () => {
      const r = ok(42)
      assert.equal(r.ok, true)
      assert.equal(r.value, 42)
    },
  )

  it('preserves complex values',
    () => {
      const payload = {a: 1, b: ['x']}
      const r = ok(payload)
      assert.equal(r.ok, true)
      assert.deepEqual(r.value, payload)
    },
  )
})

describe('err', () => {
  it('creates a failed result with message',
    () => {
      const r = err('something went wrong')
      assert.equal(r.ok, false)
      assert.equal(r.error, 'something went wrong')
      assert.equal(r.cause, undefined)
    },
  )

  it('optionally carries a cause',
    () => {
      const cause = new Error('root')
      const r = err('wrapper', cause)
      assert.equal(r.ok, false)
      assert.equal(r.cause, cause)
    },
  )
})

describe('isOk / isErr type predicates', () => {
  it('narrows Ok correctly',
    () => {
      const r: Result<number> = ok(7)
      assert.equal(isOk(r), true)
      assert.equal(isErr(r), false)
      if (isOk(r)) {
        // TypeScript knows r.value exists here
        assert.equal(r.value, 7)
      }
    },
  )

  it('narrows Err correctly',
    () => {
      const r: Result<number> = err('fail')
      assert.equal(isOk(r), false)
      assert.equal(isErr(r), true)
      if (isErr(r)) {
        assert.equal(r.error, 'fail')
      }
    },
  )
})
