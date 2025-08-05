// test/adapter.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import adapter from '../index.js'
import { join } from 'path'
import { mkdtempSync } from 'fs'
import { tmpdir } from 'os'
import * as fs from 'fs'

// Mock builder API
const createMockBuilder = () => {
  const tmp = mkdtempSync(join(tmpdir(), 'adapter-build-'))
  return {
    tmp,
    log: {
      success: vi.fn()
    },
    routes: [],
    getBuildDirectory: vi.fn((name) => join(tmp, name)),
    getServerDirectory: vi.fn(() => join(tmp, 'server')),
    rimraf: vi.fn((dir) => fs.rmSync(dir, { recursive: true, force: true })),
    mkdirp: vi.fn((dir) => fs.mkdirSync(dir, { recursive: true })),
    writeClient: vi.fn((dir) => fs.mkdirSync(dir, { recursive: true })),
    writeServer: vi.fn((dir) => fs.mkdirSync(dir, { recursive: true })),
    writePrerendered: vi.fn((dir) => fs.mkdirSync(dir, { recursive: true })),
    generateManifest: vi.fn(({ relativePath }) =>
      JSON.stringify({ version: 1, relativePath })
    ),
    copy: vi.fn((src, dest) => fs.mkdirSync(dest, { recursive: true }))
  }
}

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
      join(mockBuilder.tmp, 'adapter-platformatic', 'server')
    )
    
    // Check prerendered pages
    expect(mockBuilder.writePrerendered).toHaveBeenCalledWith(
      '.svelte-kit/platformatic/prerendered'
    )
    
    // Check copy operation
    expect(mockBuilder.copy).toHaveBeenCalledWith(
      join(mockBuilder.tmp, 'adapter-platformatic', 'server'),
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