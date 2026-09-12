import {describe, it, afterEach} from 'node:test'
import assert from 'node:assert/strict'
import {getEngine, listEngines, registerEngine, resetEnginesForTests} from '../../src/engine/registry.js'
import type {RendererEngine} from '../../src/engine/types.js'
import {createConfig} from '../../src/types/config.js'

afterEach(() => {
  resetEnginesForTests()
})

describe('engine registry', () => {
  it('registers the stub engine by default',
    () => {
      assert.deepEqual(listEngines(), ['stub'])
      const found = getEngine('stub')
      assert.equal(found.ok, true)
    },
  )

  it('returns an error for unknown engines',
    () => {
      const found = getEngine('markdown-to-email')
      assert.equal(found.ok, false)
    },
  )

  it('can register an additional engine',
    () => {
      const extra: RendererEngine = {
        name: 'preview',
        render: () => ({body: 'ok', extension: 'html'}),
      }
      registerEngine(extra)
      assert.deepEqual(listEngines(), ['preview', 'stub'])
      const found = getEngine('preview')
      assert.equal(found.ok, true)
      if (found.ok) {
        const output = found.value.render({
          markdown: 'x',
          inputPath: '/tmp/x.md',
          config: createConfig(),
        })
        assert.equal(output.body, 'ok')
      }
    },
  )
})
