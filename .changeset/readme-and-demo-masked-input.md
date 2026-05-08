---
"riyal": patch
---

Update README and live demo to showcase the new framework wrappers and the
masked input:

- README: new framework matrix table, expanded feature list (Vue 3 + Svelte 5
  + masked input), updated peer-dep table, and a dedicated "Masked mode"
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
