import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const port = 4198
const base = `http://127.0.0.1:${port}`
const server = spawn(process.execPath, ['serve.mjs'], { cwd: root, env: { ...process.env, BR_PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] })

const waitForServer = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { if ((await fetch(base)).ok) return } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error('Local BR server did not start')
}

try {
  await waitForServer()
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8')
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]))
  let assertions = 0
  for (const url of urls) {
    const response = await fetch(`${base}${url.pathname}`)
    const markup = await response.text()
    if (response.status !== 200) throw new Error(`${url.pathname} returned ${response.status}`)
    if (!markup.includes('<h1')) throw new Error(`${url.pathname} is missing an h1`)
    if (!markup.includes(`rel="canonical" href="${url.href}"`)) throw new Error(`${url.pathname} has the wrong canonical`)
    assertions += 3
  }
  for (const asset of ['/assets/service-pages.css', '/assets/chatbot.js', '/assets/site-analytics.js', '/assets/photos/IMG_0301.webp', '/logo.JPG', '/robots.txt', '/llms.txt']) {
    const response = await fetch(`${base}${asset}`)
    if (!response.ok) throw new Error(`${asset} returned ${response.status}`)
    assertions += 1
  }
  const legacy = await fetch(`${base}/service-areas/greenville/lawn-care`, { redirect: 'manual' })
  if (legacy.status !== 308 || legacy.headers.get('location') !== '/service-areas/greenville') throw new Error('legacy service-by-city redirect failed')
  assertions += 2
  const missing = await fetch(`${base}/missing-page-for-test`)
  if (missing.status !== 404) throw new Error('missing route did not return 404')
  assertions += 1
  const contact = await (await fetch(`${base}/contact`)).text()
  for (const contract of ['id="form-status"', 'role="alert"', 'id="form-privacy"', 'br_estimate_form_success', 'br_estimate_form_error', 'generate_lead']) {
    if (!contact.includes(contract)) throw new Error(`contact conversion contract missing ${contract}`)
    assertions += 1
  }
  console.log(`HTTP smoke tests passed: ${urls.length} pages and ${assertions} assertions.`)
} finally {
  server.kill('SIGTERM')
}
