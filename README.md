# BR Lawn Care

Marketing site for **BR Lawn Care** — locally owned lawn and landscape services across Eastern North Carolina.

**Live:** https://brlawncare.com (pending)
**Phone:** 252.503.0984

## Stack

Static HTML + Tailwind (CDN). No build step. Deploys straight to Vercel as a static site.

## Structure

```
.
├── index.html          Home — hero, services, gallery, FAQ, CTA
├── contact.html        Free estimate form (Formspree)
├── logo.JPG            Brand logo
├── assets/photos/      Site photography
├── llms.txt            AI crawler summary (ChatGPT, Claude, Perplexity, Gemini)
├── llms-full.txt       Expanded AI profile with full service details
├── robots.txt          Crawl rules — explicitly allows AI crawlers
├── sitemap.xml         Search engine sitemap
└── vercel.json         Vercel config (clean URLs, cache headers)
```

## Deploying to Vercel

1. Log in at https://vercel.com
2. Click **Add New → Project**
3. Import this GitHub repo (`rajats2022-coder/BR-Lawn-Care`)
4. Framework preset: **Other** (static)
5. Build command: *(leave blank)*
6. Output directory: *(leave blank — root)*
7. Click **Deploy**

Vercel will serve the site directly from the repo root.

## Contact form

`contact.html` posts to Formspree. Replace `REPLACE_WITH_YOUR_FORMSPREE_ID` with the live form ID from https://formspree.io before going live.

## SEO

- LocalBusiness, WebSite, and FAQPage JSON-LD schemas embedded in `index.html`
- ContactPage schema in `contact.html`
- Open Graph + Twitter card tags for link sharing
- Canonical URLs assume domain `brlawncare.com` — update in the `<head>` if the final domain differs

## AI Discovery

The `llms.txt` and `llms-full.txt` files follow the proposed [llms.txt standard](https://llmstxt.org/) for helping ChatGPT, Claude, Perplexity, Google AI Overviews, and other LLM-based search engines understand the business. `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, CCBot, Bing, Meta-ExternalAgent, and others.

## License

All rights reserved. © BR Lawn Care.
