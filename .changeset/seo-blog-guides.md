---
"riyal": patch
---

Ship six SEO-targeted "How to display the Saudi Riyal symbol (U+20C1) in &lt;framework&gt;" guides as static, individually-indexable HTML pages on the docs site.

- `riyal.js.org/blog/` — guide index.
- `riyal.js.org/blog/saudi-riyal-symbol-in-react/`
- `riyal.js.org/blog/saudi-riyal-symbol-in-vue/`
- `riyal.js.org/blog/saudi-riyal-symbol-in-svelte/`
- `riyal.js.org/blog/saudi-riyal-symbol-in-tailwind/`
- `riyal.js.org/blog/saudi-riyal-symbol-in-nextjs/`
- `riyal.js.org/blog/saudi-riyal-symbol-in-angular-and-html/`

Each post is a real, fully-rendered HTML document — not a SPA hash route — with its own `<title>`, meta description, canonical URL, OG/Twitter tags, and a `TechArticle` JSON-LD block. Posts cover install, render, masked input, VAT/cart, and link back to the live demo + npm package.

Infrastructure:

- `apps/docs/blog/build.mjs` — owns post sources + an HTML layout template + `blog.css`. Wired into the `dev` and `build` scripts so guide HTML stays in sync.
- `apps/docs/public/sitemap.xml` — extended with `/blog/`, all six post URLs, and `/r/registry.json`. Lastmod bumped to today.
- Demo topbar (`apps/docs/src/App.tsx`) — new "Guides" link.
