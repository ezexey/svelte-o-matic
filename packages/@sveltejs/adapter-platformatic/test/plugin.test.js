import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('plugin template', () => {
  it('contains client and prerendered placeholders', () => {
    const template = readFileSync(
      join(__dirname, '../templates/plugin.js'),
      'utf-8'
    )
    expect(template).toContain('{{CLIENT_DIR}}')
    expect(template).toContain('{{PRERENDERED_DIR}}')
  })
})
