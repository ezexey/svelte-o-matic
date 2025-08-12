/// <reference path="../global.d.ts" />
import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
  // Add CORS headers to all responses
  fastify.addHook('onSend', async (request, reply, payload) => {
    reply.header('Access-Control-Allow-Origin', '*')
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Accept')
    reply.header('Access-Control-Allow-Credentials', 'true')
    return payload
  })

  // Handle preflight OPTIONS requests
  // fastify.options('/*', async (request, reply) => {
  //   reply
  //     .header('Access-Control-Allow-Origin', 'http://localhost:5173')
  //     .header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  //     .header('Access-Control-Allow-Headers', 'Content-Type, Accept')
  //     .header('Access-Control-Allow-Credentials', 'true')
  //     .header('Access-Control-Max-Age', '86400')
  //     .status(204)
  //     .send()
  // })

  // Your existing decorator
  fastify.decorate('example', 'foobar')
}
