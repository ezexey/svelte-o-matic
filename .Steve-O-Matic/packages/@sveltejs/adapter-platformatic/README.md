# @sveltejs/adapter-platformatic

SvelteKit adapter that produces output tailored for the Platformatic runtime.

## Usage

Add the adapter to your `svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-platformatic';

export default {
  kit: {
    adapter: adapter()
  }
};
```

After running `svelte-kit build`, the generated `.svelte-kit/platformatic`
directory (or the directory specified by the `out` option) can be served by the
`@platformatic/sveltekit` plugin.

This adapter is experimental and mirrors the behaviour of `@sveltejs/adapter-node`.
