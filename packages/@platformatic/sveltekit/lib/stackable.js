import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import fp from 'fastify-plugin'
import { spawn } from 'child_process'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function sveltekitStackable (fastify, opts) {
  const { config } = fastify.platformatic
  const sveltekitConfig = config.sveltekit || {}
  
  if (sveltekitConfig.dev) {
    // Development mode - run SvelteKit dev server
    await setupDevServer(fastify, sveltekitConfig)
  } else {
    // Production mode - serve built app
    await setupProductionServer(fastify, sveltekitConfig)
  }
}

async function setupDevServer(fastify, config) {
  const devProcess = spawn('npm', ['run', 'dev'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...config.env,
      PORT: 0 // Let SvelteKit choose a random port
    }
  })
  
  // Parse the actual port from dev server output
  const port = await new Promise((resolve) => {
    devProcess.stdout.on('data', (data) => {
      const match = data.toString().match(/Local:\s+http:\/\/localhost:(\d+)/)
      if (match) resolve(match[1])
    })
  })
  
  // Proxy all requests to SvelteKit dev server
  fastify.all('/*', async (request, reply) => {
    const response = await fetch(`http://localhost:${port}${request.url}`, {
      method: request.method,
      headers: request.headers,
      body: request.body
    })
    
    reply.code(response.status)
    response.headers.forEach((value, key) => {
      reply.header(key, value)
    })
    reply.send(await response.text())
  })
  
  fastify.addHook('onClose', () => {
    devProcess.kill()
  })
}

async function setupProductionServer(fastify, config) {
  const buildDir = join(process.cwd(), config.buildDir || '.svelte-kit', 'platformatic')
  
  if (!existsSync(buildDir)) {
    throw new Error(`Build directory not found: ${buildDir}. Run 'npm run build' first.`)
  }
  
  // Import the built handler
  const { handler } = await import(join(buildDir, 'handler.js'))
  
  // Serve static assets
  await fastify.register(import('@fastify/static'), {
    root: join(buildDir, 'client'),
    prefix: '/_app/'
  })
  
  // Handle all SvelteKit routes
  fastify.all('/*', async (request, reply) => {
    const response = await handler(request.raw, {
      platform: {
        runtime: 'platformatic',
        serviceId: fastify.platformatic.serviceId
      }
    })
    
    reply.code(response.status)
    for (const [key, value] of response.headers) {
      reply.header(key, value)
    }
    reply.type(response.headers.get('content-type'))
    reply.send(Buffer.from(await response.arrayBuffer()))
  })
}

export default fp(sveltekitStackable)
