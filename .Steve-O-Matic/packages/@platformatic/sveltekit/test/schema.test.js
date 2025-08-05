// test/schema.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import { schema } from '../lib/schema.js'

test('schema includes server and sveltekit sections', () => {
  assert.equal(schema.type, 'object')
  assert.ok(schema.properties.server)
  assert.ok(schema.properties.sveltekit)
})
