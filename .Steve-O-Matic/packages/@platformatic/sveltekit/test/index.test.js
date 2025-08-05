// test/index.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import platformaticSvelteKit from '../index.js'

test('exports required properties', () => {
  assert.equal(platformaticSvelteKit.configType, 'sveltekit')
  assert.ok(platformaticSvelteKit.configManagerConfig)
  assert.ok(platformaticSvelteKit.schema)
  assert.ok(platformaticSvelteKit.Generator)
  assert.ok(platformaticSvelteKit.buildStackable)
  assert.ok(platformaticSvelteKit.stackable)
})
