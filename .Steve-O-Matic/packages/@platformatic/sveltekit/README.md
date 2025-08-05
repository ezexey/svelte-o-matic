# @platformatic/sveltekit

Platformatic plugin that allows running a SvelteKit application inside the
Platformatic runtime.

## Usage

1. Install the package and add a `platformatic.sveltekit.json` file referencing
   `@platformatic/sveltekit`.
2. During development the plugin spawns `svelte-kit dev` on a random port.
3. In production it serves the SvelteKit build output generated with the
   `@sveltejs/adapter-platformatic` adapter.

This package is experimental and only implements a minimal feature set.
