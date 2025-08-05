import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('handler template', () => {
  it('contains server and manifest placeholders', () => {
    const template = readFileSync(
      join(__dirname, '../templates/handler.js'),
      'utf-8'
    )
    expect(template).toContain('{{SERVER_DIR}}')
    expect(template).toContain('{{MANIFEST}}')
  })
})
