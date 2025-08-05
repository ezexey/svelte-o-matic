// test/config.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { readFileSync, writeFileSync } from 'fs'
import adapter from '../index.js'

vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn()
}))

describe('config generation', () => {
  let mockBuilder
  
  beforeEach(() => {
    mockBuilder = {
      log: { success: vi.fn() },
      routes: [],
      getBuildDirectory: vi.fn(() => '/tmp/build'),
      getServerDirectory: vi.fn(() => '/tmp/server'),
      rimraf: vi.fn(),
      mkdirp: vi.fn(),
      writeClient: vi.fn(),
      writeServer: vi.fn(),
      writePrerendered: vi.fn(),
      generateManifest: vi.fn(() => '{}'),
      copy: vi.fn()
    }
    
    // Mock template files
    readFileSync.mockImplementation((path) => {
      if (path.includes('handler.js')) {
        return 'handler template {{SERVER_DIR}} {{MANIFEST}}'
      }
      if (path.includes('plugin.js')) {
        return 'plugin template {{CLIENT_DIR}} {{PRERENDERED_DIR}}'
      }
      return ''
    })
  })
  
  it('generates config by default', async () => {
    const adapterInstance = adapter()
    await adapterInstance.adapt(mockBuilder)
    
    const configCalls = writeFileSync.mock.calls.filter(
      call => call[0].includes('platformatic.sveltekit.json')
    )
    
    expect(configCalls).toHaveLength(1)
    const config = JSON.parse(configCalls[0][1])
    expect(config.$schema).toBe('https://schemas.platformatic.dev/sveltekit/1.0.0.json')
    expect(config.server).toBeDefined()
    expect(config.sveltekit).toBeDefined()
  })
  
  it('skips config when includeConfig is false', async () => {
    const adapterInstance = adapter({ includeConfig: false })
    await adapterInstance.adapt(mockBuilder)
    
    const configCalls = writeFileSync.mock.calls.filter(
      call => call[0].includes('platformatic.sveltekit.json')
    )
    
    expect(configCalls).toHaveLength(0)
  })
  
  it('uses custom config path', async () => {
    const adapterInstance = adapter({ configPath: 'custom.json' })
    await adapterInstance.adapt(mockBuilder)
    
    const configCalls = writeFileSync.mock.calls.filter(
      call => call[0].includes('custom.json')
    )
    
    expect(configCalls).toHaveLength(1)
  })
})