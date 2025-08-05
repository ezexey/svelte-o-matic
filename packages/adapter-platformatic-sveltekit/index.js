const fs = require('fs-extra');
const path = require('path');

function platformaticAdapter(options = {}) {
  return {
    name: 'adapter-platformatic',
    async adapt(builder) {
      const out = builder.getBuildDirectory();
      await fs.emptyDir(out);

      // write client and server
      await builder.writeClient(out);
      await builder.writeServer(out);

      // create index.js to launch under Platformatic
      const indexJs = `#!/usr/bin/env node
const { createServer } = require('http');
const { handler } = require('./handler');
const port = process.env.PORT || 3000;
const server = createServer(handler);
server.listen(port, '0.0.0.0', () => {
  console.log('SvelteKit running under Platformatic on port ' + port);
});`;
      await fs.writeFile(path.join(out, 'index.js'), indexJs);

      // export handler.js
      const handlerJs = `const { Server } = require('@sveltejs/kit/node');
const { manifest } = require('./manifest');
const server = new Server({ manifest });

module.exports.handler = (req, res) => {
  server.respond(req, res).catch(err => {
    console.error(err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  });`;
      await fs.writeFile(path.join(out, 'handler.js'), handlerJs);
    }
  };
}

module.exports = platformaticAdapter;
