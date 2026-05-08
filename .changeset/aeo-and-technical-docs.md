---
"riyal": patch
---

AEO + technical-docs polish for v1.2.

- **`apps/docs/public/llms.txt`** rewritten for v1.2.0: new entry-points table row for `riyal/vue`, `riyal/svelte`, and `riyal/cart`; new sections covering the masked-input helpers, cart primitives, and idiomatic Vue/Svelte usage; updated discovery keywords.
- **`apps/docs/public/llms-full.txt`** updated with full reference sections for Vue 3 (`8a`), Svelte 5 (`8b`), and cart primitives (`8c`), plus a `maskRiyal` block in the Formatting section and a Masked-mode subsection for `<RiyalInput>` with a paste-input → numeric-output table.
- **`apps/docs/index.html`**: title and description bumped to v1.2.0; new keywords (`vue 3`, `svelte 5`, `masked currency input`, `react-number-format alternative`, `lineItem`, `cartTotal`, `maskRiyal`, `parseRiyal`, `normalizeRiyalDigits`); OG/Twitter copy refreshed; expanded JSON-LD `SoftwareSourceCode` description; three new FAQ entries (Vue 3 / Svelte 5 / Angular & Solid coverage, masked currency input vs `react-number-format`, cart totals with VAT).
- **Demo design polish** (more technical chrome): hero gets a v1.2 chip strip listing `riyal/vue`, `riyal/svelte`, `<RiyalInput mask />`, `riyal/cart`, `maskRiyal()`, `lineItem · cartTotal`. Stats strip now reads `13 entry points · 5 frameworks`. Surfaces grid expanded with `/VUE`, `/SVELTE`, and `/CART` cards plus per-entry `stable` / `v1.2` status pills. Section 10 retitled "Vue · Svelte · Web Component · Tailwind" and gets two new code-snippet cards for Vue 3 `<script setup>` and Svelte 5 runes. Topbar version pill bumped to `v1.2.0`. API-reference table notes the new `mask` and `allowNegative` props on `<RiyalInput>`.
