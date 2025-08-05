// test/index.test.js
import { test } from 'tap'
import { join } from 'path'
import { fileURLToPath } from 'url'
import platformaticSvelteKit from '../index.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

test('exports required properties', async (t) => {
  t.ok(platformaticSvelteKit.configType)
  t.equal(platformaticSvelteKit.configType, 'sveltekit')
  t.ok(platformaticSvelteKit.configManagerConfig)
  t.ok(platformaticSvelteKit.schema)
  t.ok(platformaticSvelteKit.Generator)
  t.ok(platformaticSvelteKit.buildStackable)
  t.ok(platformaticSvelteKit.stackable)
})