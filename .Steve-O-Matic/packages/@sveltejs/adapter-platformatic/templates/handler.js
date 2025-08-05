import { Server } from '{{SERVER_DIR}}/index.js';
import { manifest } from '{{MANIFEST}}';

// Initialize SvelteKit server
const server = new Server(manifest);
await server.init({ env: process.env });

// Export handler for Fastify integration
export async function handler(request, platformContext = {}) {
  // Convert Node.js request to Web Request
  const url = `http://${request.headers.host || 'localhost'}${request.url}`;
  
  const headers = new Headers();
  for (const [key, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      value.forEach(v => headers.append(key, v));
    } else {
      headers.set(key, value);
    }
  }
  
  const webRequest = new Request(url, {
    method: request.method,
    headers,
    body: request.method !== 'GET' && request.method !== 'HEAD' 
      ? request.body 
      : undefined
  });
  
  // Call SvelteKit server
  return server.respond(webRequest, {
    getClientAddress: () => request.socket.remoteAddress,
    platform: platformContext
  });
}