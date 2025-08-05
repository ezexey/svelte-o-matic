import platformaticAdapter from 'sveltekit-adapter-platformatic';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: platformaticAdapter({
      out: '.svelte-kit/platformatic'
    })
  }
};

export default config;
