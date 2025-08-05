// test/adapter.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import adapter from '../index.js'
import { join } from 'path'

// Mock builder API
const createMockBuilder = () => ({
  log: {
    success: vi.fn()
  },
  routes: [],
  getBuildDirectory: vi.fn((name) => `/tmp/build/${name}`),
  getServerDirectory: vi.fn(() => '/tmp/server'),
  rimraf: vi.fn(),
  mkdirp: vi.fn(),
  writeClient: vi.fn(),
  writeServer: vi.fn(),
  writePrerendered: vi.fn(),
  generateManifest: vi.fn(({ relativePath }) => 
    JSON.stringify({ version: 1, relativePath })
  ),
  copy: vi.fn()
})

describe('adapter-platformatic', () => {
  let mockBuilder
  
  beforeEach(() => {
    mockBuilder = createMockBuilder()
    vi.clearAllMocks()
  })
  
  it('returns correct adapter interface', () => {
    const adapterInstance = adapter()
    
    expect(adapterInstance.name).toBe('@sveltejs/adapter-platformatic')
    expect(typeof adapterInstance.adapt).toBe('function')
    expect(typeof adapterInstance.supports.read).toBe('function')
    expect(adapterInstance.supports.read()).toBe(true)
  })
  
  it('uses default options', async () => {
    const adapterInstance = adapter()
    await adapterInstance.adapt(mockBuilder)
    
    expect(mockBuilder.rimraf).toHaveBeenCalledWith('.svelte-kit/platformatic')
    expect(mockBuilder.mkdirp).toHaveBeenCalledWith('.svelte-kit/platformatic')
  })
  
  it('respects custom options', async () => {
    const adapterInstance = adapter({
      out: 'custom-build',
      serviceId: 'my-service'
    })
    await adapterInstance.adapt(mockBuilder)
    
    expect(mockBuilder.rimraf).toHaveBeenCalledWith('custom-build')
    expect(mockBuilder.mkdirp).toHaveBeenCalledWith('custom-build')
  })
  
  it('writes all required files', async () => {
    const adapterInstance = adapter()
    await adapterInstance.adapt(mockBuilder)
    
    // Check client assets
    expect(mockBuilder.writeClient).toHaveBeenCalledWith(
      '.svelte-kit/platformatic/client'
    )
    
    // Check server files
    expect(mockBuilder.writeServer).toHaveBeenCalledWith(
      '/tmp/build/adapter-platformatic/server'
    )
    
    // Check prerendered pages
    expect(mockBuilder.writePrerendered).toHaveBeenCalledWith(
      '.svelte-kit/platformatic/prerendered'
    )
    
    // Check copy operation
    expect(mockBuilder.copy).toHaveBeenCalledWith(
      '/tmp/build/adapter-platformatic/server',
      '.svelte-kit/platformatic/server'
    )
  })
  
  it('logs success message', async () => {
    const adapterInstance = adapter()
    await adapterInstance.adapt(mockBuilder)
    
    expect(mockBuilder.log.success).toHaveBeenCalledWith(
      'Platformatic adapter complete'
    )
  })
})