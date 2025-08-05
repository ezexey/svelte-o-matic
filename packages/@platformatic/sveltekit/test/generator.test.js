// test/generator.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import { Generator } from '../lib/generator.js'

// Ensure the Generator class can be instantiated
// without executing the full project generation logic.

test('Generator class instantiates', () => {
  const generator = new Generator({ config: { name: 'test-app', targetDirectory: '.' } })
  assert.ok(generator instanceof Generator)
})
