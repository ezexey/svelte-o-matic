const { spawn } = require('child_process');
const path = require('path');
const fastify = require('fastify');

module.exports = {
  schema: path.join(__dirname, 'schema.json'),
  plugin: function (runtime) {
    // Development mode: start SvelteKit dev server
    runtime.hooks.add('dev:start', async ({ config }) => {
      const dev = spawn('npx', ['svelte-kit', 'dev', '--port', config.port], {
        stdio: 'inherit',
        cwd: process.cwd(),
        env: process.env
      });
      runtime.on('close', () => dev.kill());
    });

    // Production mode: serve built app via Node adapter output
    runtime.hooks.add('start', async ({ config }) => {
      const buildDir = path.join(process.cwd(), 'build');
      const serverEntry = require(path.join(buildDir, 'index.js'));
      // NODE adapter's server listens on process.env.PORT
      process.env.PORT = config.port;
      serverEntry.listen();
    });
  }
};
