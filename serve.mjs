import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.PORT || process.env.BR_PORT || 3018)

const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
}

const resolveFile = (pathname) => {
  if (pathname === '/') return path.join(root, 'index.html')
  const clean = pathname.replace(/^\/+|\/+$/g, '')
  const direct = path.join(root, clean)
  const candidates = [direct, `${direct}.html`, path.join(direct, 'index.html')]
  return candidates.find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`)
  const pathname = decodeURIComponent(url.pathname)
  const legacy = pathname.match(/^\/service-areas\/([^/]+)\/([^/]+)$/)
  if (legacy && legacy[2] !== 'index.html') {
    response.writeHead(308, { Location: `/service-areas/${legacy[1]}` })
    response.end()
    return
  }
  const file = resolveFile(pathname)
  if (!file || !file.startsWith(root)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Not found')
    return
  }
  response.writeHead(200, { 'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' })
  fs.createReadStream(file).pipe(response)
})

server.listen(port, '127.0.0.1', () => console.log(`BR Lawn Care site running at http://127.0.0.1:${port}`))
