import fs from 'node:fs';
import { join } from 'node:path';

/**
 * SvelteKit adapter that outputs a build compatible with the Platformatic
 * runtime. The generated build contains an `index.js` file that listens on the
 * port provided via the `PORT` environment variable and a `handler.js` that
 * exposes the request handler.
 */
export default function adapter (options = {}) {
  const out = options.out ?? 'build';

  return {
    name: '@sveltejs/adapter-platformatic',
    async adapt (builder) {
      const buildDir = join(builder.getBuildDirectory(), out);
      fs.rmSync(buildDir, { recursive: true, force: true });

      const clientDir = join(buildDir, 'client');
      const serverDir = join(buildDir, 'server');
      const prerenderedDir = join(buildDir, 'prerendered');

      builder.log.minor('writing client');
      await builder.writeClient(clientDir);

      builder.log.minor('writing server');
      await builder.writeServer(serverDir);

      builder.log.minor('writing prerendered');
      await builder.writePrerendered(prerenderedDir);

      const handlerCode = `import { Server } from './server/index.js';
import { manifest } from './server/manifest.js';

const server = new Server(manifest);
export async function handler (req, res) {
  const result = await server.respond(req, { getClientAddress: () => req.socket.remoteAddress });
  await server.handle(result, res);
}`;
      fs.writeFileSync(join(buildDir, 'handler.js'), handlerCode);

      const indexCode = `import { handler } from './handler.js';
import http from 'node:http';

const server = http.createServer((req, res) => handler(req, res));
const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
  console.log('listening on', port);
});`;
      fs.writeFileSync(join(buildDir, 'index.js'), indexCode);
    }
  };
}
