import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { cities, services, site } from './site-data.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const html = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

const json = (value) => JSON.stringify(value).replaceAll('<', '\\u003c')
const absolute = (pathname) => `${site.origin}${pathname}`

const iconArrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></svg>'
const iconChevron = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'
const iconPhone = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.95.37 1.87.72 2.75a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.33-1.33a2 2 0 0 1 2.11-.45c.88.35 1.8.59 2.75.72A2 2 0 0 1 22 16.92z"/></svg>'

const header = () => `
<header class="fixed top-0 inset-x-0 z-50 navblur">
  <div class="max-w-[1400px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
    <a href="/" class="flex items-center gap-3 group" aria-label="BR Lawn Care home">
      <img src="/logo.JPG" alt="" width="36" height="36" class="h-9 w-9 rounded-full object-cover ring-1 ring-white/10" />
      <div class="leading-none"><div class="display text-[17px]">BR Lawn Care</div><div class="text-[10px] tracking-[0.22em] uppercase text-muted mt-1">Jacksonville, NC</div></div>
    </a>
    <nav class="hidden md:flex items-center gap-8 text-sm text-white/80" aria-label="Primary">
      <div class="nav-item">
        <a href="/#services" class="nav-trigger">Services ${iconChevron}</a>
        <div class="nav-dropdown" aria-label="Service pages">
          ${services.map((service) => `<a href="/services/${service.slug}"><span>${html(service.name)}</span><small>${html(service.navSummary)}</small></a>`).join('\n          ')}
        </div>
      </div>
      <a href="/service-areas" class="hover:text-white transition-colors">Service Areas</a>
      <a href="/#work" class="hover:text-white transition-colors">Our Work</a>
      <a href="/#about" class="hover:text-white transition-colors">About</a>
      <a href="/contact" class="hover:text-white transition-colors">Contact</a>
    </nav>
    <div class="flex items-center gap-2">
      <a href="/contact" class="hidden md:inline-flex btn btn-primary !py-2 !px-4 text-sm">Free Estimate ${iconArrow}</a>
      <a href="tel:${site.phoneHref}" class="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-full bg-brand text-[#06101E]" aria-label="Call BR Lawn Care">${iconPhone}</a>
      <button id="menu-btn" class="hamburger md:hidden inline-flex flex-col justify-center items-center w-11 h-11 rounded-full border border-white/15" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
    </div>
  </div>
  <div id="mobile-menu" class="md:hidden fixed top-16 inset-x-0 mx-4 rounded-2xl bg-elevated/95 backdrop-blur border border-white/10 shadow-2xl p-5" role="dialog" aria-label="Mobile navigation">
    <nav class="flex flex-col divide-y divide-white/6">
      <a href="/" class="py-4 text-white/85 flex items-center justify-between"><span>Home</span><span class="text-brand">→</span></a>
      <div class="mobile-services py-1">
        <button type="button" class="mobile-services-toggle w-full py-4 text-white/85 flex items-center justify-between text-left" aria-expanded="false"><span>Services</span>${iconChevron}</button>
        <div class="mobile-services-list pb-3 pl-4 gap-1">
          ${services.map((service) => `<a href="/services/${service.slug}" class="py-2 text-white/70 flex items-center justify-between"><span>${html(service.name)}</span><span class="text-brand">→</span></a>`).join('\n          ')}
        </div>
      </div>
      <a href="/service-areas" class="py-4 text-white/85 flex items-center justify-between"><span>Service Areas</span><span class="text-brand">→</span></a>
      <a href="/#work" class="py-4 text-white/85 flex items-center justify-between"><span>Our Work</span><span class="text-brand">→</span></a>
      <a href="/#about" class="py-4 text-white/85 flex items-center justify-between"><span>About</span><span class="text-brand">→</span></a>
      <a href="/contact" class="py-4 text-white/85 flex items-center justify-between"><span>Contact</span><span class="text-brand">→</span></a>
    </nav>
    <a href="/contact" class="btn btn-primary w-full justify-center mt-4">Get Your Free Estimate</a>
  </div>
</header>`

const footer = () => `
<footer class="border-t border-white/8 py-12 bg-[#080B10]">
  <div class="max-w-[1400px] mx-auto px-6 md:px-10 grid gap-8 md:grid-cols-[1.3fr_1fr_1fr] text-sm text-white/55">
    <div><div class="display text-xl text-white">BR Lawn Care</div><p class="mt-3 max-w-[38ch] leading-relaxed">Jacksonville-based lawn, landscape, clearing, tree, exterior-cleaning, and grounds services across 19 verified Eastern North Carolina cities.</p></div>
    <div><div class="font-bold text-white mb-3">Explore</div><div class="grid gap-2"><a href="/" class="hover:text-white">Home</a><a href="/#services" class="hover:text-white">Services</a><a href="/service-areas" class="hover:text-white">Service Areas</a><a href="/contact" class="hover:text-white">Free Estimate</a><a href="/privacy" class="hover:text-white">Privacy</a></div></div>
    <div><div class="font-bold text-white mb-3">Contact</div><div class="grid gap-2"><a href="tel:${site.phoneHref}" class="hover:text-white">${site.phoneDisplay}</a><span>Monday–Saturday, 7 AM–7 PM</span><a href="/service-areas" class="hover:text-white">19 verified service areas</a></div></div>
  </div>
</footer>`

const navigationScript = `
<script>
  const menuButton=document.getElementById('menu-btn');
  const menu=document.getElementById('mobile-menu');
  const servicesGroup=document.querySelector('.mobile-services');
  const servicesButton=document.querySelector('.mobile-services-toggle');
  function setServices(open){if(!servicesGroup||!servicesButton)return;servicesGroup.classList.toggle('open',open);servicesButton.setAttribute('aria-expanded',open?'true':'false')}
  function setMenu(open){if(!menuButton||!menu)return;menu.classList.toggle('open',open);menuButton.classList.toggle('open',open);document.documentElement.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',open?'true':'false');menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');if(!open)setServices(false)}
  menuButton?.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
  servicesButton?.addEventListener('click',event=>{event.preventDefault();setServices(!servicesGroup.classList.contains('open'))});
  menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){setMenu(false);menuButton?.focus()}});
</script>
<script src="/assets/chatbot.js" defer></script>`

const pageShell = ({ title, description, canonicalPath, image = '/assets/photos/IMG_0301.webp', schema, body }) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#0B0E14" />
<title>${html(title)}</title>
<meta name="description" content="${html(description)}" />
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
<link rel="canonical" href="${absolute(canonicalPath)}" />
<link rel="icon" href="/logo.JPG" type="image/jpeg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&f[]=cabinet-grotesk@500,700,800,900&display=swap" rel="stylesheet" />
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{colors:{ink:'#0B0E14',elevated:'#12161F',brand:'#2AA5FF',muted:'#A4AEBD'}}}}</script>
<link rel="stylesheet" href="/assets/service-pages.css?v=20260811" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="BR Lawn Care" />
<meta property="og:title" content="${html(title)}" />
<meta property="og:description" content="${html(description)}" />
<meta property="og:url" content="${absolute(canonicalPath)}" />
<meta property="og:image" content="${absolute(image)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${html(title)}" />
<meta name="twitter:description" content="${html(description)}" />
<meta name="twitter:image" content="${absolute(image)}" />
<script type="application/ld+json">${json(schema)}</script>
<script src="/assets/site-analytics.js" defer></script>
</head>
<body>
${header()}
${body}
${footer()}
${navigationScript}
</body>
</html>
`

const serviceSchema = (service) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      '@id': `${absolute(`/services/${service.slug}`)}#service`,
      name: service.name,
      description: service.description,
      url: absolute(`/services/${service.slug}`),
      image: absolute(service.image),
      provider: { '@id': `${site.origin}/#business` },
      areaServed: cities.map((city) => ({ '@type': 'City', name: `${city.name}, NC` })),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.name} scope`,
        itemListElement: service.bullets.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${site.origin}/#services` },
        { '@type': 'ListItem', position: 3, name: service.name, item: absolute(`/services/${service.slug}`) },
      ],
    },
  ],
})

const servicePage = (service) => {
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3)
  const body = `<main class="pt-28 md:pt-36">
  <section class="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-10 items-center">
    <div class="col-span-12 lg:col-span-6"><div class="eyebrow mb-5">${html(service.eyebrow)}</div><h1 class="display text-5xl md:text-7xl lg:text-[88px]">${html(service.h1)}</h1><p class="mt-7 text-white/65 text-lg leading-relaxed max-w-[58ch]">${html(service.lede)}</p><div class="mt-8 flex flex-wrap gap-4"><a href="/contact" class="btn btn-primary">Request ${html(service.name)} Estimate</a><a href="tel:${site.phoneHref}" class="btn btn-ghost">Call ${site.phoneDisplay}</a></div></div>
    <div class="col-span-12 lg:col-span-6"><img src="${service.image}" alt="${html(service.imageAlt)}" width="1350" height="1800" fetchpriority="high" class="service-photo" /></div>
  </section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 py-20 copy"><div class="service-card p-8 md:p-12 grid md:grid-cols-3 gap-8"><div><div class="eyebrow mb-3">What is included</div><h2 class="display text-3xl">${html(service.scopeHeading)}</h2></div><div class="md:col-span-2"><p>${html(service.scope)}</p><ul class="mt-6 grid sm:grid-cols-2 gap-3">${service.bullets.map((item) => `<li>${html(item)}</li>`).join('')}</ul></div></div></section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-20"><div class="eyebrow mb-4">How the estimate works</div><h2 class="display text-4xl md:text-5xl">A clear scope before scheduling.</h2><div class="mt-8 grid md:grid-cols-3 gap-4">${service.process.map(([name, detail], index) => `<article class="service-card p-6"><div class="eyebrow mb-3">0${index + 1}</div><h3 class="display text-2xl">${html(name)}</h3><p class="mt-4 text-white/60 leading-relaxed">${html(detail)}</p></article>`).join('')}</div></section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-20 copy"><div class="grid md:grid-cols-2 gap-6"><div class="service-card p-8"><div class="eyebrow mb-3">A practical fit for</div><h2 class="display text-3xl">Properties that need a defined outdoor scope.</h2><ul class="mt-6 grid gap-3">${service.suitedFor.map((item) => `<li>${html(item)}</li>`).join('')}</ul></div><div class="service-card p-8"><div class="eyebrow mb-3">Before you request</div><h2 class="display text-3xl">Send enough detail for a useful reply.</h2><p class="mt-5">Include the property address, clear photos, the requested result, access notes, and timing. BR Lawn Care confirms final availability, pricing, and scope after reviewing the property.</p></div></div></section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-20"><div class="flex flex-col md:flex-row md:items-end md:justify-between gap-5"><div><div class="eyebrow mb-3">Service coverage</div><h2 class="display text-4xl md:text-5xl">19 verified Eastern North Carolina service areas.</h2></div><a href="/service-areas" class="btn btn-ghost">View all service areas</a></div><div class="area-link-grid mt-8">${cities.map((city) => `<a class="area-link-card" href="/service-areas/${city.slug}"><span>${html(service.name)} in ${html(city.name)}</span><small>View ${html(city.name)}, NC coverage and estimate guidance</small></a>`).join('')}</div></section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-20 copy"><div class="eyebrow mb-4">Questions before the estimate</div><div class="grid md:grid-cols-2 gap-4">${service.faqs.map(([question, answer]) => `<article class="service-card p-7"><h2 class="display text-2xl">${html(question)}</h2><p class="mt-4">${html(answer)}</p></article>`).join('')}</div></section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-24"><div class="eyebrow mb-4">Related services</div><div class="area-link-grid">${related.map((item) => `<a class="area-link-card" href="/services/${item.slug}"><span>${html(item.name)}</span><small>${html(item.navSummary)}</small></a>`).join('')}</div></section>
  <section class="border-t border-white/8 bg-[#10151E]"><div class="max-w-[1100px] mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6"><div><div class="eyebrow mb-3">Free estimate</div><h2 class="display text-4xl md:text-5xl">Tell BR what the property needs.</h2></div><a href="/contact" class="btn btn-primary">Start Your Estimate ${iconArrow}</a></div></section>
</main>`
  return pageShell({ title: service.title, description: service.description, canonicalPath: `/services/${service.slug}`, image: service.image, schema: serviceSchema(service), body })
}

const citySchema = (city) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${absolute(`/service-areas/${city.slug}`)}#page`,
      name: `${city.name}, NC Lawn Care and Outdoor Services`,
      url: absolute(`/service-areas/${city.slug}`),
      description: cityDescription(city),
      about: { '@id': `${site.origin}/#business` },
      spatialCoverage: { '@type': 'City', name: `${city.name}, NC`, containedInPlace: { '@type': 'AdministrativeArea', name: city.county } },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` },
        { '@type': 'ListItem', position: 2, name: 'Service Areas', item: absolute('/service-areas') },
        { '@type': 'ListItem', position: 3, name: `${city.name}, NC`, item: absolute(`/service-areas/${city.slug}`) },
      ],
    },
  ],
})

const cityDescription = (city) => `Request lawn, landscape, tree, clearing, pressure-washing, and grounds estimates in ${city.name}, NC from BR Lawn Care. Call ${site.phoneDisplay}.`

const focusAreasSection = (city) => city.focusAreas.length ? `
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-20"><div class="service-card p-8 md:p-12"><div class="eyebrow mb-4">Jacksonville area context</div><h2 class="display text-4xl md:text-5xl">Neighborhood names help describe the property—not create separate doorway pages.</h2><p class="mt-5 text-white/60 max-w-[72ch] leading-relaxed">BR can use the Jacksonville place names below to understand the request and nearby route context. Final availability is confirmed from the property address.</p><div class="mt-7 flex flex-wrap gap-3">${city.focusAreas.map((area) => `<span class="rounded-full border border-white/12 px-4 py-2 text-sm text-white/70">${html(area)}</span>`).join('')}</div></div></section>` : ''

const cityPage = (city, index) => {
  const nearby = [...cities.slice(index + 1), ...cities.slice(0, index)].slice(0, 4)
  const title = `${city.name}, NC Lawn Care & Outdoor Services | BR Lawn Care`
  const body = `<main class="pt-28 md:pt-36">
  <section class="max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-12 gap-10 items-center">
    <div class="col-span-12 lg:col-span-7"><div class="eyebrow mb-5">${html(city.county)} · Service Area</div><h1 class="display text-5xl md:text-7xl lg:text-[84px]">Lawn care and outdoor services in ${html(city.name)}, NC.</h1><p class="mt-7 text-white/65 text-lg leading-relaxed max-w-[62ch]">${html(city.intro)}</p><div class="mt-8 flex flex-wrap gap-4"><a href="/contact" class="btn btn-primary">Request a ${html(city.name)} Estimate</a><a href="tel:${site.phoneHref}" class="btn btn-ghost">Call ${site.phoneDisplay}</a></div></div>
    <div class="col-span-12 lg:col-span-5"><div class="service-card p-8"><div class="eyebrow mb-3">Plan a useful estimate</div><h2 class="display text-3xl">Start with the property details.</h2><p class="mt-5 text-white/60 leading-relaxed">${html(city.planning)}</p><p class="mt-5 text-white/60 leading-relaxed">BR confirms route availability and the final scope before any work is scheduled.</p></div></div>
  </section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 py-20"><div class="eyebrow mb-4">Services available to request</div><h2 class="display text-4xl md:text-5xl">One contact for the outdoor scope.</h2><p class="mt-5 text-white/60 max-w-[68ch] leading-relaxed">Choose the main service below for complete scope and process information. If the property needs more than one service, list each item in the estimate request instead of opening separate forms.</p><div class="area-link-grid mt-8">${services.map((service) => `<a class="area-link-card" href="/services/${service.slug}"><span>${html(service.name)}</span><small>${html(service.navSummary)}</small></a>`).join('')}</div></section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-20"><div class="eyebrow mb-4">Build the ${html(city.name)} request</div><h2 class="display text-4xl md:text-5xl">${html(city.requestGuide.title)}</h2><p class="mt-5 text-white/60 max-w-[70ch] leading-relaxed">${html(city.requestGuide.intro)}</p><div class="mt-8 grid md:grid-cols-3 gap-4">${city.requestGuide.items.map(([name, detail]) => `<article class="service-card p-6"><h3 class="display text-2xl">${html(name)}</h3><p class="mt-4 text-white/60 leading-relaxed">${html(detail)}</p></article>`).join('')}</div></section>
${focusAreasSection(city)}
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-20 copy"><div class="grid md:grid-cols-2 gap-6"><div class="service-card p-8"><div class="eyebrow mb-3">What to include</div><h2 class="display text-3xl">Help the crew understand the property.</h2><ul class="mt-6 grid gap-3"><li>Property address and type</li><li>Photos of the work area</li><li>Desired result and timing</li><li>Gates, tenants, pets, utilities, or access limits</li></ul></div><div class="service-card p-8"><div class="eyebrow mb-3">What happens next</div><h2 class="display text-3xl">Scope, estimate, then schedule.</h2><p class="mt-5">BR reviews the request, asks follow-up questions or arranges an on-site assessment when needed, and confirms the quoted scope before scheduling. Availability and pricing depend on the property and requested work.</p></div></div></section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-24"><div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4"><div><div class="eyebrow mb-3">More service areas</div><h2 class="display text-4xl">Other verified route options.</h2></div><a href="/service-areas" class="btn btn-ghost">View every listed city</a></div><div class="area-link-grid mt-8">${nearby.map((item) => `<a class="area-link-card" href="/service-areas/${item.slug}"><span>${html(item.name)}, NC</span><small>${html(item.county)}</small></a>`).join('')}</div></section>
  <section class="border-t border-white/8 bg-[#10151E]"><div class="max-w-[1100px] mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6"><div><div class="eyebrow mb-3">${html(city.name)} estimate</div><h2 class="display text-4xl md:text-5xl">Tell BR what needs attention.</h2></div><a href="/contact" class="btn btn-primary">Start Your Estimate ${iconArrow}</a></div></section>
</main>`
  return pageShell({ title, description: cityDescription(city), canonicalPath: `/service-areas/${city.slug}`, schema: citySchema(city), body })
}

const serviceAreasPage = () => {
  const title = 'Eastern NC Service Areas | BR Lawn Care'
  const description = 'Explore BR Lawn Care coverage across 19 verified Eastern North Carolina service areas. View city guidance and request an estimate.'
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${absolute('/service-areas')}#page`, name: title, url: absolute('/service-areas'), description, about: { '@id': `${site.origin}/#business` }, hasPart: cities.map((city) => ({ '@type': 'WebPage', name: `${city.name}, NC service area`, url: absolute(`/service-areas/${city.slug}`) })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${site.origin}/` }, { '@type': 'ListItem', position: 2, name: 'Service Areas', item: absolute('/service-areas') }] },
    ],
  }
  const body = `<main class="pt-28 md:pt-36">
  <section class="max-w-[1200px] mx-auto px-6 md:px-10 pb-14"><div class="eyebrow mb-5">Verified Service Areas</div><h1 class="display text-5xl md:text-7xl lg:text-[84px]">19 Eastern North Carolina cities.</h1><p class="mt-7 text-white/65 text-lg leading-relaxed max-w-[68ch]">BR Lawn Care serves the 19 cities listed below. Each city page explains the available service categories and the property details that help the team prepare a useful response. Final route availability is confirmed from the property address before scheduling.</p><div class="mt-8 flex flex-wrap gap-4"><a href="/contact" class="btn btn-primary">Request a Free Estimate</a><a href="tel:${site.phoneHref}" class="btn btn-ghost">Call ${site.phoneDisplay}</a></div></section>
  <section class="max-w-[1200px] mx-auto px-6 md:px-10 pb-20"><div class="area-link-grid">${cities.map((city) => `<a id="${city.slug}" class="area-link-card" href="/service-areas/${city.slug}"><span>${html(city.name)}, NC</span><small>${html(city.county)} · View coverage and estimate guidance</small></a>`).join('')}</div></section>
  <section class="max-w-[1200px] mx-auto px-6 md:px-10 pb-20"><div class="service-card p-8 md:p-12"><div class="eyebrow mb-4">Six service categories</div><h2 class="display text-4xl md:text-5xl">Start with the work the property needs.</h2><p class="mt-5 text-white/60 max-w-[68ch] leading-relaxed">The main service pages explain scope, preparation, and estimate expectations. City pages stay focused on service coverage instead of repeating six nearly identical landing pages for every location.</p><div class="area-link-grid mt-8">${services.map((service) => `<a class="area-link-card" href="/services/${service.slug}"><span>${html(service.name)}</span><small>${html(service.navSummary)}</small></a>`).join('')}</div></div></section>
  <section class="max-w-[1100px] mx-auto px-6 md:px-10 pb-24 copy"><div class="grid md:grid-cols-2 gap-6"><div class="service-card p-8"><div class="eyebrow mb-3">Outside the list?</div><h2 class="display text-3xl">Ask before assuming.</h2><p class="mt-5">Routes and availability can change. Call or submit the property address so BR Lawn Care can confirm whether the requested work fits the current service route.</p></div><div class="service-card p-8"><div class="eyebrow mb-3">Multiple services?</div><h2 class="display text-3xl">Use one estimate request.</h2><p class="mt-5">List every requested service, include photos, and describe the desired result. BR can determine whether the work belongs in one scope or separate estimates.</p></div></div></section>
</main>`
  return pageShell({ title, description, canonicalPath: '/service-areas', schema, body })
}

for (const service of services) {
  fs.writeFileSync(path.join(root, 'services', `${service.slug}.html`), servicePage(service))
}

for (const [index, city] of cities.entries()) {
  const directory = path.join(root, 'service-areas', city.slug)
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'index.html'), cityPage(city, index))
}

fs.writeFileSync(path.join(root, 'service-areas.html'), serviceAreasPage())

const urls = [
  '/',
  '/contact',
  '/privacy',
  '/service-areas',
  ...services.map((service) => `/services/${service.slug}`),
  ...cities.map((city) => `/service-areas/${city.slug}`),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${absolute(url)}</loc><lastmod>${site.lastmod}</lastmod></url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap)

const vercel = {
  cleanUrls: true,
  trailingSlash: false,
  outputDirectory: '.',
  redirects: [
    { source: '/service-areas/:city/:service', destination: '/service-areas/:city', permanent: true },
  ],
  headers: [
    { source: '/llms.txt', headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }, { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' }] },
    { source: '/llms-full.txt', headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }, { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' }] },
    { source: '/robots.txt', headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }] },
    { source: '/sitemap.xml', headers: [{ key: 'Content-Type', value: 'application/xml; charset=utf-8' }] },
    { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
  ],
}
fs.writeFileSync(path.join(root, 'vercel.json'), `${JSON.stringify(vercel, null, 2)}\n`)

console.log(`Built ${services.length} service pages, ${cities.length} city hubs, the service-area hub, and ${urls.length} sitemap URLs.`)
