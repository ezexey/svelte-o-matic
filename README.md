# svelte-o-matic

Experimental monorepo containing a collection of Platformatic plugins and SvelteKit adapters for running SvelteKit applications inside the Platformatic runtime.

## Packages

- `@platformatic/sveltekit` – Platformatic plugin that runs a SvelteKit app in the runtime and proxies requests to it. See `packages/@platformatic/sveltekit/examples/platformatic-sveltekit` for a real-world example.
- `@sveltejs/adapter-platformatic` – SvelteKit adapter that outputs a build suited for the Platformatic runtime. Example projects live in `packages/@sveltejs/adapter-platformatic/examples/`.
- `platformatic-sveltekit-service` – Platformatic service demonstrating how to wire a SvelteKit app into a Platformatic service. Example services are in `packages/platformatic-sveltekit-service/examples/`.
- `sveltekit-adapter-platformatic` – Unscoped alternative SvelteKit adapter for Platformatic. An example is provided in `packages/sveltkit-adapter-platformatic/examples/adapter-sveltekit`.

## Examples

Each package ships with example projects that can be used as starting points:

- `platformatic-sveltekit` – Demonstrates `@platformatic/sveltekit` with `/api/add` and `/api/random-number` endpoints.
- `adapter-platformatic` – Uses `@sveltejs/adapter-platformatic` to build a SvelteKit app for Platformatic.
- `sveltekit-basic` – Minimal project showing how to enable the adapter in a bare SvelteKit app.
- `platformatic-basic` – Small Platformatic service defined in `platformatic-sveltekit-service`.
- `platformatic-sveltekit-service` – Example service combining the Platformatic runtime with a bundled SvelteKit application.
- `adapter-sveltekit` – Demonstrates the unscoped `sveltekit-adapter-platformatic`.
