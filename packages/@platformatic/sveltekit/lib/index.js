import { spawn } from 'node:child_process';
import { join } from 'node:path';

/**
 * Platformatic plugin to run a SvelteKit application.
 *
 * In development it spawns the `svelte-kit dev` command on a random port.
 * In production it loads the SvelteKit Node adapter output and proxies all
 * requests to it.
 *
 * @param {import('fastify').FastifyInstance} app
 * @param {{ root?: string }} opts
 */
export default async function platformaticSvelteKit (app, opts = {}) {
  const root = opts.root || process.cwd();
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const devPort = 0; // random port
    const proc = spawn('npx', ['svelte-kit', 'dev', '--port', String(devPort)], {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, PORT: String(devPort) }
    });

    app.addHook('onClose', async () => {
      proc.kill();
    });

    return;
  }

  // production: use build/handler.js from adapter-node output
  const { handler } = await import(join(root, 'build', 'handler.js'));

  app.all('*', async (request, reply) => {
    await handler(request.raw, reply.raw);
    reply.sent = true;
  });
}
