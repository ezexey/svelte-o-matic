// test/schema.test.js
import { test } from 'tap'
import { schema } from '../lib/schema.js'
import Ajv from 'ajv'

test('schema validation', async (t) => {
  const ajv = new Ajv()
  const validate = ajv.compile(schema)
  
  t.test('valid config', async (t) => {
    const config = {
      server: {
        hostname: 'localhost',
        port: 3000
      },
      sveltekit: {
        buildDir: '.svelte-kit',
        dev: false
      }
    }
    
    t.ok(validate(config))
    t.notOk(validate.errors)
  })
  
  t.test('missing required server', async (t) => {
    const config = {
      sveltekit: {
        buildDir: '.svelte-kit'
      }
    }
    
    t.notOk(validate(config))
    t.ok(validate.errors)
  })
  
  t.test('with plugins', async (t) => {
    const config = {
      server: {
        hostname: 'localhost',
        port: 3000
      },
      plugins: {
        paths: ['./plugins/custom.js']
      }
    }
    
    t.ok(validate(config))
  })
})