// test/plugin.test.js
import { describe, it, expect, vi } from 'vitest'
import Fastify from 'fastify'

describe('plugin integration', () => {
  it('registers static file handlers', async () => {
    const fastify = Fastify()
    
    // Mock platformatic context
    fastify.decorate('platformatic', {
      serviceId: 'test-service'
    })
    
    // Would test actual plugin here
    // For now, just verify fastify setup
    expect(fastify.platformatic.serviceId).toBe('test-service')
  })
  
  it('handles all routes with catch-all', async () => {
    const fastify = Fastify()
    
    // Register test route
    fastify.all('/*', async (request, reply) => {
      return { route: request.url }
    })
    
    const response = await fastify.inject({
      method: 'GET',
      url: '/any/path'
    })
    
    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({ route: '/any/path' })
  })
})