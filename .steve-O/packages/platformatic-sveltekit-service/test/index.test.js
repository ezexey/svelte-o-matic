const test = require('node:test')
const assert = require('node:assert/strict')
const { join } = require('path')
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require('fs')
const { tmpdir } = require('os')
const service = require('..')

test('exports schema and plugin', () => {
  assert.ok(service.schema.endsWith('schema.json'))
  assert.equal(typeof service.plugin, 'function')
})

test('plugin registers hooks', () => {
  const added = []
  const runtime = {
    hooks: { add (name, fn) { added.push({ name, fn }) } },
    on () {}
  }
  service.plugin(runtime)
  assert.ok(added.find(h => h.name === 'dev:start'))
  assert.ok(added.find(h => h.name === 'start'))
})

test('start hook loads build output and sets port', async () => {
  const hooks = {}
  const runtime = {
    hooks: { add (name, fn) { hooks[name] = fn } },
    on () {}
  }
  service.plugin(runtime)

  const dir = mkdtempSync(join(tmpdir(), 'plt-svc-test-'))
  const buildDir = join(dir, 'build')
  mkdirSync(buildDir)
  writeFileSync(join(buildDir, 'index.js'), "module.exports.listen = () => { global.started = true }")

  const cwd = process.cwd()
  process.chdir(dir)
  global.started = false
  try {
    await hooks['start']({ config: { port: 4321 } })
    assert.equal(process.env.PORT, '4321')
    assert.equal(global.started, true)
  } finally {
    process.chdir(cwd)
    rmSync(dir, { recursive: true, force: true })
    delete global.started
  }
})
