// test/stackable.test.js
import Fastify from 'fastify'
import { test } from 'tap'
import { join } from 'path'
import { mkdtempSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import sveltekitStackable from '../lib/stackable.js'

test('stackable production mode', async (t) => {
  const fastify = Fastify()
  
  // Mock platformatic context
  fastify.decorate('platformatic', {
    config: {
      sveltekit: {
        dev: false,
        buildDir: '.svelte-kit'
      }
    },
    serviceId: 'test-service'
  })
  
  // Create mock build directory
  const tmpDir = mkdtempSync(join(tmpdir(), 'plt-sk-test-'))
  const buildDir = join(tmpDir, '.svelte-kit', 'platformatic')
  
  // Mock handler module
  const handlerCode = `
    export async function handler(request) {
      return new Response('Hello from SvelteKit', {
        status: 200,
        headers: { 'content-type': 'text/plain' }
      })
    }
  `
  
  writeFileSync(join(buildDir, 'handler.js'), handlerCode, { recursive: true })
  
  process.chdir(tmpDir)
  
  try {
    await fastify.register(sveltekitStackable)
    
    const response = await fastify.inject({
      method: 'GET',
      url: '/'
    })
    
    t.equal(response.statusCode, 200)
    t.match(response.payload, /Hello from SvelteKit/)
  } finally {
    await fastify.close()
  }
})

test('stackable dev mode', async (t) => {
  const fastify = Fastify()
  
  fastify.decorate('platformatic', {
    config: {
      sveltekit: {
        dev: true,
        env: {
          TEST_VAR: 'test-value'
        }
      }
    }
  })
  
  // In real test, would mock the spawn process
  t.skip('requires mocking child_process.spawn')
})