// test/stackable.test.js
import test from 'node:test'
import assert from 'node:assert/strict'
import Fastify from 'fastify'
import { join } from 'path'
import { mkdtempSync, writeFileSync, mkdirSync } from 'fs'
import { tmpdir } from 'os'
import sveltekitStackable from '../lib/stackable.js'

test('stackable production mode', async () => {
  const fastify = Fastify()
  fastify.decorate('platformatic', {
    config: {
      sveltekit: {
        dev: false,
        buildDir: '.svelte-kit'
      }
    },
    serviceId: 'test-service'
  })

  const tmpDir = mkdtempSync(join(tmpdir(), 'plt-sk-test-'))
  const buildDir = join(tmpDir, '.svelte-kit', 'platformatic')
  mkdirSync(buildDir, { recursive: true })

  const handlerCode = `
    export async function handler(request) {
      return new Response('Hello from SvelteKit', {
        status: 200,
        headers: { 'content-type': 'text/plain' }
      })
    }
  `
  writeFileSync(join(buildDir, 'handler.js'), handlerCode)
  process.chdir(tmpDir)

  await fastify.register(sveltekitStackable)
  const response = await fastify.inject({ method: 'GET', url: '/' })
  assert.equal(response.statusCode, 200)
  assert.match(response.payload, /Hello from SvelteKit/)
  await fastify.close()
})

test('stackable dev mode', { skip: 'requires mocking child_process.spawn' }, async () => {})
