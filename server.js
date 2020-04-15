const http = require('http')
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/plain'
  })
  res.end('hello world')
})

server.listen(8080, function() {
  console.log('Docker demo with Node.js is running')
})
