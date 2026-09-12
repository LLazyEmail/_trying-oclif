import {describe, it, before, after} from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import Init from '../../src/commands/init.js'
import Parse from '../../src/commands/parse/index.js'
import {pathExists, readTextFile} from '../../src/utils/fs.js'

describe('init + parse commands', () => {
  let tmp = ''
  let previousCwd = ''

  before(async () => {
    previousCwd = process.cwd()
    tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'llazy-cli-'))
    process.chdir(tmp)
  })

  after(async () => {
    process.chdir(previousCwd)
    await fs.rm(tmp, {recursive: true, force: true})
  })

  it('llazy init creates folders, sample markdown, and config',
    async () => {
      await Init.run([])
      assert.equal(await pathExists(path.join(tmp, 'source')), true)
      assert.equal(await pathExists(path.join(tmp, 'generated')), true)
      assert.equal(await pathExists(path.join(tmp, 'source', 'source.md')), true)
      assert.equal(await pathExists(path.join(tmp, '.llazyrc.json')), true)
    },
  )

  it('llazy parse --dry-run does not write output',
    async () => {
      await Parse.run(['--dry-run'])
      assert.equal(await pathExists(path.join(tmp, 'generated', 'newEmail.html')), false)
    },
  )

  it('llazy parse writes stub html from the sample markdown',
    async () => {
      await Parse.run([])
      const outputPath = path.join(tmp, 'generated', 'newEmail.html')
      assert.equal(await pathExists(outputPath), true)
      const body = await readTextFile(outputPath)
      assert.equal(body.ok, true)
      if (body.ok) {
        assert.match(body.value, /<!DOCTYPE html>/)
        assert.match(body.value, /llazy init/)
      }
    },
  )
})
