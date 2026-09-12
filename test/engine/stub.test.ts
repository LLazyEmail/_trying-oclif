import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {createConfig} from '../../src/types/config.js'
import {stubRenderer} from '../../src/engine/stub.js'

describe('stubRenderer', () => {
  it('renders html by default',
    () => {
      const output = stubRenderer.render({
        markdown: '# Hello',
        inputPath: '/tmp/source.md',
        config: createConfig(),
      })
      assert.equal(output.extension, 'html')
      assert.match(output.body, /<!DOCTYPE html>/)
      assert.match(output.body, /# Hello/)
    },
  )

  it('renders react when format is react',
    () => {
      const output = stubRenderer.render({
        markdown: 'hi',
        inputPath: '/tmp/source.md',
        config: createConfig({format: 'react'}),
      })
      assert.equal(output.extension, 'jsx')
      assert.match(output.body, /export default function Email/)
    },
  )

  it('renders json when format is json',
    () => {
      const output = stubRenderer.render({
        markdown: 'hi',
        inputPath: '/tmp/source.md',
        config: createConfig({format: 'json'}),
      })
      assert.equal(output.extension, 'json')
      const parsed = JSON.parse(output.body) as {engine: string; markdown: string}
      assert.equal(parsed.engine, 'stub')
      assert.equal(parsed.markdown, 'hi')
    },
  )
})
