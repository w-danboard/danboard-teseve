const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs').promises
const { createReadStream, readFileSync } = require('fs')
const ejs = require('ejs')
const mime = require('mime')
const chalk = require('chalk')

const template = readFileSync(path.join(__dirname, 'templates', '/index.ejs'), 'utf8')

const server = http.createServer(async (req, res) => {
  const filePath = path.join(__dirname, 'templates', '/index.ejs')
  const r = await ejs.render(template, { async: true })
  res.setHeader('Content-Type', mime.getType(filePath)+';charset=utf-8')
  res.end(r)
})

let port = 3000
server.listen(port, () => {
  console.log(chalk.blueBright('server start'), `http://localhost:` + port)
})

server.on('error', err => {
  if (err.errno === 'EADDRINUSE') {
    server.listen(++port)
  }
})
