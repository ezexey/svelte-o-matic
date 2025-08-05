# @platformatic/adapter-sveltekit

SvelteKit adapter that produces output tailored for the Platformatic runtime.

## Usage

Add the adapter to your `svelte.config.js`:

```js
import adapter from '@platformatic/adapter-sveltekit';

export default {
  kit: {
    adapter: adapter()
  }
};
```

After running `svelte-kit build` the generated `build/` directory can be served
by the `@platformatic/sveltekit` plugin.

This adapter is experimental and mirrors the behaviour of `@sveltejs/adapter-node`.
