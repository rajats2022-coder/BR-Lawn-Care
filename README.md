# BR Lawn Care

Marketing site for **BR Lawn Care** — locally owned lawn and landscape services across Eastern North Carolina.

**Live:** https://brlawncarenc.com
**Phone:** 252.503.0984

## Stack

Generated static HTML + Tailwind (CDN). Shared service and city data produces the local SEO pages, sitemap, and redirect configuration. Vercel serves the generated files as a static site.

## Structure

```
.
├── index.html             Home — hero, services, gallery, FAQ, CTA
├── contact.html           Free estimate form (Formspree)
├── services/              Six generated, complete service pages
├── service-areas/         Seventeen generated city hubs
├── service-areas.html     Crawlable service-area index
├── scripts/               Page builder, site data, audit, and smoke tests
├── assets/                Shared styles, interactions, and photography
├── llms.txt               Concise machine-readable business summary
├── llms-full.txt          Expanded machine-readable business profile
├── robots.txt             Crawl rules and sitemap pointer
├── sitemap.xml            Canonical 26-page search sitemap
└── vercel.json            Clean URLs, headers, and legacy redirects
```

## Deploying to Vercel

1. Log in at https://vercel.com
2. Click **Add New → Project**
3. Import this GitHub repo (`rajats2022-coder/BR-Lawn-Care`)
4. Framework preset: **Other**
5. Build command: `npm run build`
6. Output directory: `.` (the generated site root)
7. Click **Deploy**

Vercel will serve the site directly from the repo root.

## Contact form

`contact.html` posts to the configured BR Lawn Care Formspree endpoint. Verify delivery with a safe test before each major release; do not replace the endpoint with another client’s form.

## Local verification

```bash
npm run verify
```

This rebuilds the shared pages, audits the sitemap/metadata/schema/assets/links/form contract, and runs HTTP smoke tests for every canonical route plus the legacy redirects.

## SEO

- LocalBusiness, WebSite, and FAQPage JSON-LD schemas embedded in `index.html`
- Service and BreadcrumbList schema on service pages
- CollectionPage and BreadcrumbList schema on service-area pages
- One city hub per listed service area instead of a repeated service-by-city grid
- Permanent redirects from the 102 legacy combination URLs to their city hubs
- ContactPage schema in `contact.html`
- Open Graph + Twitter card tags for link sharing
- Canonical URLs assume domain `brlawncarenc.com` — update in the `<head>` if the final domain differs

## AI Discovery

The `llms.txt` and `llms-full.txt` files follow the proposed [llms.txt standard](https://llmstxt.org/) for helping ChatGPT, Claude, Perplexity, Google AI Overviews, and other LLM-based search engines understand the business. `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Bing, Meta-ExternalAgent, and others.

## License

All rights reserved. © BR Lawn Care.
