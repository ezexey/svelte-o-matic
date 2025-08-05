import { Generator as ServiceGenerator } from '@platformatic/service'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'

export class Generator extends ServiceGenerator {
  constructor(opts) {
    super(opts)
    this.name = '@platformatic/sveltekit'
  }
  
  async _generateProject() {
    // Create base structure
    await super._generateProject()
    
    // Add SvelteKit-specific files
    const packageJson = {
      name: this.config.name,
      version: '0.1.0',
      type: 'module',
      scripts: {
        dev: 'vite dev',
        build: 'vite build',
        preview: 'vite preview',
        start: 'platformatic start'
      },
      devDependencies: {
        '@sveltejs/adapter-platformatic': '^1.0.0',
        '@sveltejs/kit': '^2.0.0',
        '@platformatic/sveltekit': '^1.0.0',
        'svelte': '^5.0.0',
        'vite': '^7.0.0'
      }
    }
    
    await writeFile(
      join(this.targetDirectory, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    )
    
    // Create svelte.config.js
    const svelteConfig = `
import adapter from '@sveltejs/adapter-platformatic';
import { vitePreprocess } from '@sveltejs/kit/vite';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
  }
};
`
    
    await writeFile(
      join(this.targetDirectory, 'svelte.config.js'),
      svelteConfig
    )
    
    // Create platformatic.sveltekit.json
    const platformaticConfig = {
      $schema: 'https://schemas.platformatic.dev/sveltekit/1.0.0.json',
      server: {
        hostname: '{PLT_SERVER_HOSTNAME}',
        port: '{PORT}'
      },
      sveltekit: {
        buildDir: '.svelte-kit'
      }
    }
    
    await writeFile(
      join(this.targetDirectory, 'platformatic.sveltekit.json'),
      JSON.stringify(platformaticConfig, null, 2)
    )
    
    // Create basic route structure
    await mkdir(join(this.targetDirectory, 'src', 'routes'), { recursive: true })
    
    const indexRoute = `
<script>
  export let data;
</script>

<h1>Welcome to SvelteKit on Platformatic!</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn more about SvelteKit.</p>
`
    
    await writeFile(
      join(this.targetDirectory, 'src', 'routes', '+page.svelte'),
      indexRoute
    )
  }
}