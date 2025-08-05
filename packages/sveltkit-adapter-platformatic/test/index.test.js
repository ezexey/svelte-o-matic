const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs-extra')
const platformaticAdapter = require('..')

test('exports name and adapt function', () => {
  const adapter = platformaticAdapter()
  assert.equal(adapter.name, 'adapter-platformatic')
  assert.equal(typeof adapter.adapt, 'function')
})

test('adapt writes build output', async (t) => {
  const emptyDir = t.mock.method(fs, 'emptyDir', async () => {})
  const writeFile = t.mock.method(fs, 'writeFile', async () => {})
  const builder = {
    getBuildDirectory () { return '/tmp/build' },
    writeClient: t.mock.fn(async () => {}),
    writeServer: t.mock.fn(async () => {})
  }
  const adapter = platformaticAdapter()
  await adapter.adapt(builder)
  assert.equal(emptyDir.mock.calls.length, 1)
  assert.equal(builder.writeClient.mock.calls.length, 1)
  assert.equal(builder.writeServer.mock.calls.length, 1)
  assert.equal(writeFile.mock.calls.length, 2)
})
