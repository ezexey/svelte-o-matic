// test/generator.test.js
import { test } from 'tap'
import { Generator } from '../lib/generator.js'
import { mkdtempSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

test('Generator creates project structure', async (t) => {
  const targetDir = mkdtempSync(join(tmpdir(), 'plt-sk-gen-'))
  
  const generator = new Generator({
    config: {
      name: 'test-app',
      targetDirectory: targetDir
    }
  })
  
  await generator._generateProject()
  
  // Check generated files
  t.ok(existsSync(join(targetDir, 'package.json')))
  t.ok(existsSync(join(targetDir, 'svelte.config.js')))
  t.ok(existsSync(join(targetDir, 'platformatic.sveltekit.json')))
  t.ok(existsSync(join(targetDir, 'src', 'routes', '+page.svelte')))
  
  // Verify package.json content
  const pkg = JSON.parse(readFileSync(join(targetDir, 'package.json'), 'utf-8'))
  t.equal(pkg.name, 'test-app')
  t.ok(pkg.scripts.dev)
  t.ok(pkg.scripts.build)
  t.ok(pkg.scripts.start)
  t.ok(pkg.devDependencies['@sveltejs/kit'])
  t.ok(pkg.devDependencies['@platformatic/sveltekit'])
  
  // Verify config content
  const config = JSON.parse(
    readFileSync(join(targetDir, 'platformatic.sveltekit.json'), 'utf-8')
  )
  t.equal(config.$schema, 'https://schemas.platformatic.dev/sveltekit/1.0.0.json')
  t.ok(config.server)
  t.ok(config.sveltekit)
})