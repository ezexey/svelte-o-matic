# Example: @platformatic/sveltekit

Demonstrates running a SvelteKit application inside the Platformatic runtime using the `@platformatic/sveltekit` plugin and the `@sveltejs/adapter-platformatic` adapter. The app exposes two simple APIs:

- `POST /api/add` – adds two numbers provided in the request body
- `GET /api/random-number` – returns a random number between the optional `min` and `max` query parameters

## Usage

```bash
npm install
npm run build
platformatic start
```

The server configuration is defined in `platformatic.sveltekit.json`.
