import { buildStackable } from '@platformatic/service'
import { schema } from './lib/schema.js'
import { Generator } from './lib/generator.js'
import sveltekitStackable from './lib/stackable.js'

export default {
  configType: 'sveltekit',
  configManagerConfig: {
    schema,
    allowToWatch: [
      '.env',
      'platformatic.sveltekit.json',
      'platformatic.sveltekit.yml',
      'platformatic.sveltekit.yaml',
      'platformatic.sveltekit.toml'
    ]
  },
  buildStackable,
  stackable: sveltekitStackable,
  Generator,
  schema
}