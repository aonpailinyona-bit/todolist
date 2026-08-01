import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(3000, 'localhost', () => {
  console.log('Listening on localhost:3000');
});