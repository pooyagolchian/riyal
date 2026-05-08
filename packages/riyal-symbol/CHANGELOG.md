# riyal

## 1.2.0

### Minor Changes

- c4b3bfa: Add `riyal/cart` — receipt-grade checkout primitives for Saudi e-commerce.

  - **`lineItem({ unit, qty, vatIncluded?, discount? }, { vatRate? })`** — computes per-line `net`, `vat`, and `gross`. Supports both VAT-net catalogue prices (default) and VAT-inclusive prices (`vatIncluded: true`). Per-line discount and over-discount clamping built in.
  - **`cartTotal(items, { discount?, shipping?, shippingIncludesVat?, vatRate? })`** — rolls lines up into `subtotal`, `vatSubtotal`, `discount`, `netTotal`, `vat`, `shipping`, `total`, and `itemCount`. Cart-level discount is applied proportionally to net + VAT (matching Saudi receipt convention). Shipping is added with VAT-on-top by default; pass `shippingIncludesVat: true` if your shipping fee is already gross. Discount is capped at the gross subtotal.
  - **`formatLineItem(item, { format? })`** — renders every numeric field of a `LineItem` through `formatRiyal`. Useful for receipts, OG cards, and tabular renders.
  - Demo (`apps/docs`): new "15 — Checkout" section with a live cart (qty steppers, discount, shipping, totals) wired to `RiyalPrice` and the new helpers. Topbar gets a Checkout link.
  - README: new "Cart & checkout primitives — `riyal/cart`" subsection under Core API.

  The new entry adds `riyal/cart` to the `exports` map (ESM + CJS + types). All math defaults to `SAUDI_VAT_RATE` (15%) and is overridable per call.

- 8d7ce20: Add format-as-you-type masking to `RiyalInput` across React, Vue, and Svelte.

  - New core helpers in `riyal`: `maskRiyal(input, caret?, options?)`, `normalizeRiyalDigits`, and `cleanRiyalString`. They normalise Arabic-Indic (٠–٩) and Persian-Indic (۰–۹) digits, strip currency markers (`⃁`, `SAR`, `ر.س`), normalise Arabic decimal/grouping marks (`٫` `٬`), enforce a max decimals window, preserve caret position via a digit-counting algorithm, and emit a clean numeric value plus a grouped display string.
  - New `mask` prop on `RiyalInput` (React, Vue, Svelte). When `true`, the input switches to a text field with `inputmode="decimal"`, masked editing, and paste cleanup. Defaults to `false` so existing usage is unchanged.
  - New `allowNegative` prop (only honoured when `mask` is `true`).

  This closes the input-handling gap with `react-number-format`: pasting `"SAR 2,499.99"`, `"⃁ 2,499.99"`, or `"٢٤٩٩٫٩٩"` all yield `2499.99` plus a clean `"2,499.99"` display.

- 8d7ce20: Add `riyal/svelte` entry — first-class Svelte 5 support using runes (`$props`, `$state`, `$derived`, `$effect`, `$bindable`). Ships `RiyalSymbol`, `RiyalIcon`, `RiyalPrice`, `AnimatedRiyalPrice`, `RiyalInput`, and the `useRiyalRate` composable. The entry is shipped as `.svelte` source so consumers' Svelte tooling (Vite, SvelteKit) compiles it natively. Adds `svelte` (>=5) as an optional peer dependency, plus `svelte`, `svelte5`, and `sveltekit` keywords.
- 8d7ce20: Add `riyal/vue` entry — first-class Vue 3 support. Ships `RiyalSymbol`, `RiyalIcon`, `RiyalPrice`, `AnimatedRiyalPrice`, `RiyalInput`, and the `useRiyalRate` composable, all reusing the same core `formatRiyal` / `convertFromSAR` helpers as the React entry. Adds `vue` (>=3.4) as an optional peer dependency. Includes `vue`, `vue3`, and `nuxt` in the package keywords for npm discoverability.

### Patch Changes

- c4b3bfa: AEO + technical-docs polish for v1.2.

  - **`apps/docs/public/llms.txt`** rewritten for v1.2.0: new entry-points table row for `riyal/vue`, `riyal/svelte`, and `riyal/cart`; new sections covering the masked-input helpers, cart primitives, and idiomatic Vue/Svelte usage; updated discovery keywords.
  - **`apps/docs/public/llms-full.txt`** updated with full reference sections for Vue 3 (`8a`), Svelte 5 (`8b`), and cart primitives (`8c`), plus a `maskRiyal` block in the Formatting section and a Masked-mode subsection for `<RiyalInput>` with a paste-input → numeric-output table.
  - **`apps/docs/index.html`**: title and description bumped to v1.2.0; new keywords (`vue 3`, `svelte 5`, `masked currency input`, `react-number-format alternative`, `lineItem`, `cartTotal`, `maskRiyal`, `parseRiyal`, `normalizeRiyalDigits`); OG/Twitter copy refreshed; expanded JSON-LD `SoftwareSourceCode` description; three new FAQ entries (Vue 3 / Svelte 5 / Angular & Solid coverage, masked currency input vs `react-number-format`, cart totals with VAT).
  - **Demo design polish** (more technical chrome): hero gets a v1.2 chip strip listing `riyal/vue`, `riyal/svelte`, `<RiyalInput mask />`, `riyal/cart`, `maskRiyal()`, `lineItem · cartTotal`. Stats strip now reads `13 entry points · 5 frameworks`. Surfaces grid expanded with `/VUE`, `/SVELTE`, and `/CART` cards plus per-entry `stable` / `v1.2` status pills. Section 10 retitled "Vue · Svelte · Web Component · Tailwind" and gets two new code-snippet cards for Vue 3 `<script setup>` and Svelte 5 runes. Topbar version pill bumped to `v1.2.0`. API-reference table notes the new `mask` and `allowNegative` props on `<RiyalInput>`.

- c4b3bfa: Update README and live demo to showcase the new framework wrappers and the
  masked input:

  - README: new framework matrix table, expanded feature list (Vue 3 + Svelte 5
    - masked input), updated peer-dep table, and a dedicated "Masked mode"
      subsection on `RiyalInput` with paste examples that map straight to numeric
      values (`"SAR 2,499.99"`, `"⃁ 2,499.99"`, `"٢٤٩٩٫٩٩"`, `"99.90 ر.س"`).
  - README: new top-level "Vue 3" and "Svelte 5" sections with idiomatic usage
    snippets.
  - Demo (`apps/docs`): "05 — Input" now shows two cards side-by-side — the
    controlled numeric input plus a `<RiyalInput mask />` with one-click
    copy buttons for the marquee paste examples and a live numeric/reformatted
    read-out below.
  - Fixes a pre-existing JSX-semicolon issue in the demo so `pnpm lint` passes
    cleanly across the workspace.

- 7c449fb: - Removed third-party package comparison from README; the feature table now focuses solely on what `riyal` includes.

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
