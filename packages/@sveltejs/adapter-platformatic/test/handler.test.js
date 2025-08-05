// test/handler.test.js
import { describe, it, expect } from 'vitest'
import { handler } from '../templates/handler.js'

// Mock Server
global.Server = class {
  constructor(manifest) {
    this.manifest = manifest
  }
  
  async init(options) {
    this.options = options
  }
  
  async respond(request, options) {
    return new Response(`Handled: ${request.url}`, {
      status: 200,
      headers: { 'content-type': 'text/plain' }
    })
  }
}

describe('handler', () => {
  it('converts node request to web request', async () => {
    const mockRequest = {
      method: 'GET',
      url: '/test',
      headers: {
        host: 'example.com',
        'user-agent': 'test'
      },
      socket: {
        remoteAddress: '127.0.0.1'
      }
    }
    
    const response = await handler(mockRequest)
    
    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(200)
    const text = await response.text()
    expect(text).toContain('http://example.com/test')
  })
  
  it('passes platform context', async () => {
    const mockRequest = {
      method: 'GET',
      url: '/',
      headers: { host: 'localhost' },
      socket: { remoteAddress: '::1' }
    }
    
    const platformContext = {
      runtime: 'platformatic',
      serviceId: 'test-service'
    }
    
    const response = await handler(mockRequest, platformContext)
    expect(response).toBeInstanceOf(Response)
  })
  
  it('handles POST with body', async () => {
    const mockRequest = {
      method: 'POST',
      url: '/api',
      headers: {
        host: 'localhost',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ test: true }),
      socket: { remoteAddress: '127.0.0.1' }
    }
    
    const response = await handler(mockRequest)
    expect(response).toBeInstanceOf(Response)
  })
})