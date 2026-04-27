import http from 'node:http';

const port = Number.parseInt(process.env.PORT || '3001', 10);

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'GET' && req.url === '/health') {
    res.statusCode = 200;
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.statusCode = 200;
  res.end(
    JSON.stringify({
      message: 'Server is running',
      path: req.url,
      method: req.method,
    })
  );
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});