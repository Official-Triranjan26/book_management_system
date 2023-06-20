const http = require('http');

const port = 8081;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('Hello World');
});

server.listen(port, () => {
  console.log(`Server running at http://${port}/`);
});
// http//localhost:8081