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
  let { pathname } = url.parse(req.url)
  pathname = decodeURIComponent(pathname)
  const filePath = path.join(__dirname, pathname)
  try {
    if (pathname === '/') {
      res.setHeader('Content-Type', 'text/html;charset=utf-8')
      const r = await ejs.render(template, { async: true })
      return res.end(r)
    }
    const stats = await fs.stat(filePath)
    if (stats.isDirectory()) throw new error('路径为文件夹路径')
    res.setHeader('Content-Type', mime.getType(filePath)+';charset=utf-8')
    createReadStream(filePath).pipe(res) 
  } catch (e) {
    res.statusCode = 404
    res.end('Not Found')
  }
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
