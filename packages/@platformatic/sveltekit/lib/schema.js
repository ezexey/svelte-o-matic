export const schema = {
  $id: 'https://schemas.platformatic.dev/sveltekit/1.0.0.json',
  type: 'object',
  properties: {
    server: {
      type: 'object',
      properties: {
        hostname: { type: 'string' },
        port: { type: 'integer' },
        logger: { type: 'object' }
      }
    },
    sveltekit: {
      type: 'object',
      properties: {
        buildDir: {
          type: 'string',
          default: '.svelte-kit'
        },
        adapter: {
          type: 'string',
          default: 'platformatic'
        },
        env: {
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        dev: {
          type: 'boolean',
          default: false
        }
      }
    }
  },
  required: ['server'],
  additionalProperties: {
    watch: true,
    plugins: true
  }
}