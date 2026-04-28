# riyal

## 1.1.0

### Minor Changes

- Implement font pipeline and ship real WOFF2/WOFF/TTF files for U+20C1.

  - **Font pipeline**: `scripts/build-fonts.mjs` now generates real font files from the SAMA master glyph (`riyal.svg`) using `opentype.js` + `wawoff2`. `dist/fonts/` ships WOFF2, WOFF, and TTF for Regular, Bold, and Medium weights plus sans/serif/mono/arabic variants. Previously this was a placeholder that emitted nothing.
  - **CSS pipeline**: `riyal/css` and `riyal/font/*` subpath exports now serve non-empty files after every build.
  - **Documentation**: added Error Handling section, Web Component attribute/event reference table, OG cards decision guide, SSR/Server Components guidance for Next.js App Router, Tailwind v4 CSS-first config, and a "Why riyal?" comparison section.
  - **Keywords**: added `e-commerce`, `ecommerce`, `checkout`, `next.js font`, `og image`, `saudi green`, `sama` for npm discoverability.

## 1.0.0

### Major Changes

- Initial stable release of the `riyal` package on npm.
