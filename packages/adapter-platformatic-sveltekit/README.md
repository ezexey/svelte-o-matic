# @platformatic/adapter-sveltekit

A SvelteKit adapter targeting the Platformatic Runtime.

## Usage

```js
// svelte.config.js
import platformaticAdapter from '@platformatic/adapter-sveltekit';

export default {
  kit: {
    adapter: platformaticAdapter()
  }
};
```

Build and deploy with Platformatic:

```bash
npm run build  # produces build/ directory
platformatic start  # runs the Platformatic Runtime
```
