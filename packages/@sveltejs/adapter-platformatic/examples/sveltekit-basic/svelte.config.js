import adapter from '@sveltejs/adapter-platformatic';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      out: '.svelte-kit/platformatic'
    })
  }
};

export default config;
