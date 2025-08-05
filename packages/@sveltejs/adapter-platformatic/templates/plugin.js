import fp from 'fastify-plugin';
import fastifyStatic from '@fastify/static';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { handler } from './handler.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function platformaticSvelteKitPlugin(fastify, opts) {
  // Serve client assets
  await fastify.register(fastifyStatic, {
    root: join(__dirname, '{{CLIENT_DIR}}'),
    prefix: '/_app/',
    decorateReply: false,
    maxAge: '1y',
    immutable: true
  });
  
  // Serve prerendered pages
  await fastify.register(fastifyStatic, {
    root: join(__dirname, '{{PRERENDERED_DIR}}'),
    decorateReply: false
  });
  
  // Handle all routes with SvelteKit
  fastify.all('/*', async (request, reply) => {
    try {
      const response = await handler(request.raw, {
        runtime: 'platformatic',
        serviceId: fastify.platformatic?.serviceId,
        ...opts.platform
      });
      
      // Send response
      reply.code(response.status);
      
      for (const [key, value] of response.headers) {
        // Skip transfer-encoding as Fastify handles it
        if (key.toLowerCase() !== 'transfer-encoding') {
          reply.header(key, value);
        }
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType) {
        reply.type(contentType);
      }
      
      // Handle response body
      if (response.body) {
        const buffer = Buffer.from(await response.arrayBuffer());
        reply.send(buffer);
      } else {
        reply.send();
      }
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: 'Internal Server Error' });
    }
  });
}

export default fp(platformaticSvelteKitPlugin, {
  fastify: '5.x',
  name: '@sveltejs/adapter-platformatic'
});