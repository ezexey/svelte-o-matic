# Example: sveltekit-adapter-platformatic

Uses the `sveltekit-adapter-platformatic` package to create a build that runs on the Platformatic runtime. The app contains two demonstration APIs:

- `POST /api/add` – adds two numbers sent in the request body
- `GET /api/random-number` – returns a random number between optional `min` and `max` query parameters

## Usage

```bash
npm install
npm run build
```

The generated `.svelte-kit/platformatic` directory can be served by the `@platformatic/sveltekit` plugin.
