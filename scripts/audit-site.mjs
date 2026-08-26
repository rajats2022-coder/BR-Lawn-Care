import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cities, services, site } from './site-data.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const findings = []
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8')
const exists = (relative) => fs.existsSync(path.join(root, relative))

const sitemap = read('sitemap.xml')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
const expectedPaths = [
  '/',
  '/contact',
  '/service-areas',
  ...services.map((service) => `/services/${service.slug}`),
  ...cities.map((city) => `/service-areas/${city.slug}`),
]

const fileForPath = (pathname) => {
  if (pathname === '/') return 'index.html'
  if (pathname === '/contact') return 'contact.html'
  if (pathname === '/service-areas') return 'service-areas.html'
  if (pathname.startsWith('/services/')) return `${pathname.slice(1)}.html`
  if (pathname.startsWith('/service-areas/')) return `${pathname.slice(1)}/index.html`
  return `${pathname.replace(/^\//, '')}.html`
}

const visibleWords = (markup) => markup
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z0-9#]+;/gi, ' ')
  .trim()
  .split(/\s+/)
  .filter(Boolean).length

if (urls.length !== expectedPaths.length) findings.push(`sitemap expected ${expectedPaths.length} URLs, found ${urls.length}`)
for (const pathname of expectedPaths) {
  const expectedUrl = `${site.origin}${pathname}`
  if (!urls.includes(expectedUrl)) findings.push(`sitemap missing ${expectedUrl}`)
}
for (const url of urls) {
  if (!url.startsWith(site.origin)) findings.push(`unexpected sitemap origin: ${url}`)
  const pathname = new URL(url).pathname
  if (/^\/service-areas\/[^/]+\/[^/]+$/.test(pathname)) findings.push(`legacy service-by-city URL remains in sitemap: ${pathname}`)
  const file = fileForPath(pathname)
  if (!exists(file)) {
    findings.push(`${pathname}: missing ${file}`)
    continue
  }
  const markup = read(file)
  const title = markup.match(/<title>([^<]+)<\/title>/i)?.[1]?.trim() || ''
  const description = markup.match(/<meta name="description" content="([^"]+)"/i)?.[1]?.trim() || ''
  const canonical = markup.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]?.trim() || ''
  const h1Count = (markup.match(/<h1(?:\s|>)/gi) || []).length
  if (!title || title.length > 65) findings.push(`${pathname}: title length ${title.length}`)
  if (!description || description.length > 165) findings.push(`${pathname}: description length ${description.length}`)
  if (canonical !== url) findings.push(`${pathname}: canonical ${canonical || 'missing'}; expected ${url}`)
  if (h1Count !== 1) findings.push(`${pathname}: expected one h1, found ${h1Count}`)
  if (/noindex/i.test(markup)) findings.push(`${pathname}: sitemap page contains noindex`)
  if (!markup.includes('meta property="og:title"')) findings.push(`${pathname}: missing Open Graph metadata`)
  if (!markup.includes('application/ld+json')) findings.push(`${pathname}: missing JSON-LD`)
  for (const match of markup.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(match[1]) } catch (error) { findings.push(`${pathname}: invalid JSON-LD (${error.message})`) }
  }
  if (pathname.startsWith('/services/') && visibleWords(markup) < 430) findings.push(`${pathname}: service page has fewer than 430 visible words`)
  if (/^\/service-areas\/[^/]+$/.test(pathname) && visibleWords(markup) < 300) findings.push(`${pathname}: city hub has fewer than 300 visible words`)
  for (const match of markup.matchAll(/<img\b[^>]*\bsrc="([^"]+)"[^>]*>/gi)) {
    const source = match[1]
    if (source.startsWith('/') && !/^\/\//.test(source) && !exists(source.slice(1).split('?')[0])) findings.push(`${pathname}: missing image ${source}`)
    if (!/\balt="[^"]*"/i.test(match[0])) findings.push(`${pathname}: image ${source} has no alt attribute`)
  }
  for (const match of markup.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
    const href = match[1]
    if (!href.startsWith('/') || href.startsWith('//')) continue
    const targetPath = href.split(/[?#]/)[0] || '/'
    if (targetPath.startsWith('/assets/') || targetPath.startsWith('/llms')) continue
    if (!expectedPaths.includes(targetPath)) findings.push(`${pathname}: internal link targets noncanonical or missing route ${href}`)
  }
}

for (const required of ['logo.JPG', 'assets/service-pages.css', 'assets/chatbot.js', 'robots.txt', 'llms.txt', 'llms-full.txt', 'vercel.json']) {
  if (!exists(required)) findings.push(`missing required file ${required}`)
}

const vercel = JSON.parse(read('vercel.json'))
if (vercel.outputDirectory !== '.') findings.push('Vercel output directory must remain the generated site root')
const legacyRedirect = vercel.redirects?.find((item) => item.source === '/service-areas/:city/:service')
if (!legacyRedirect || legacyRedirect.destination !== '/service-areas/:city' || legacyRedirect.permanent !== true) {
  findings.push('missing permanent legacy service-by-city consolidation redirect')
}

const home = read('index.html')
if (!home.includes('id="services"')) findings.push('homepage missing services link target')
if (!home.includes('id="work"')) findings.push('homepage missing work link target')
if (!home.includes('id="about"')) findings.push('homepage missing about link target')
if (!home.includes('href="/service-areas"')) findings.push('homepage missing canonical service-area hub link')
if (/assets\/(?:before-after|photos)\/[^"']+\.jpe?g/i.test(home)) findings.push('homepage references full-resolution JPG work photos instead of optimized display assets')
if (!home.includes('role="slider"') || !home.includes("card.addEventListener('keydown'")) findings.push('before-and-after comparisons are missing keyboard slider controls')
if (/same[- ]week scheduling/i.test(home)) findings.push('homepage contains an unqualified same-week scheduling claim')

const contact = read('contact.html')
if (!contact.includes('action="https://formspree.io/f/mzdybokj"')) findings.push('contact form destination changed or missing')
for (const field of ['name', 'phone', 'email', 'address', 'message']) {
  if (!new RegExp(`name="${field}"`).test(contact)) findings.push(`contact form missing ${field}`)
}
if (!contact.includes('id="form-status"') || !contact.includes('role="alert"') || !contact.includes('aria-live="assertive"')) {
  findings.push('contact form is missing an accessible failure status')
}
if (!contact.includes('id="form-privacy"') || !contact.includes('transmitted through Formspree')) {
  findings.push('contact form is missing its privacy and processor disclosure')
}
if (!contact.includes("recordConversionEvent('br_estimate_form_success'") || !contact.includes("recordConversionEvent('br_estimate_form_error'")) {
  findings.push('contact form is missing measurement-ready success and error events')
}
if (/catch\s*\([^)]*\)\s*\{\s*\/\*\s*silent\s*\*\//i.test(contact)) findings.push('contact form still suppresses submission failures')

if (/service-area keyword pages/i.test(read('llms.txt')) || /service-area keyword pages/i.test(read('llms-full.txt'))) {
  findings.push('LLM discovery files use keyword-page language')
}

if (findings.length) {
  console.error(`Site audit failed with ${findings.length} finding${findings.length === 1 ? '' : 's'}:`)
  findings.forEach((finding) => console.error(`- ${finding}`))
  process.exit(1)
}

console.log(`Site audit passed: ${urls.length} canonical pages, focused city architecture, metadata, schema, assets, links, and lead path verified.`)
