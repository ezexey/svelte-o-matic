const http = require('http');

module.exports.listen = function () {
  const port = process.env.PORT || 3000;
  http.createServer((req, res) => {
    res.end('Hello from SvelteKit!');
  }).listen(port, () => {
    console.log(`Mock SvelteKit server listening on ${port}`);
  });
};
