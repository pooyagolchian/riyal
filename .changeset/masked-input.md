---
"riyal": minor
---

Add format-as-you-type masking to `RiyalInput` across React, Vue, and Svelte.

- New core helpers in `riyal`: `maskRiyal(input, caret?, options?)`, `normalizeRiyalDigits`, and `cleanRiyalString`. They normalise Arabic-Indic (٠–٩) and Persian-Indic (۰–۹) digits, strip currency markers (`⃁`, `SAR`, `ر.س`), normalise Arabic decimal/grouping marks (`٫` `٬`), enforce a max decimals window, preserve caret position via a digit-counting algorithm, and emit a clean numeric value plus a grouped display string.
- New `mask` prop on `RiyalInput` (React, Vue, Svelte). When `true`, the input switches to a text field with `inputmode="decimal"`, masked editing, and paste cleanup. Defaults to `false` so existing usage is unchanged.
- New `allowNegative` prop (only honoured when `mask` is `true`).

This closes the input-handling gap with `react-number-format`: pasting `"SAR 2,499.99"`, `"⃁ 2,499.99"`, or `"٢٤٩٩٫٩٩"` all yield `2499.99` plus a clean `"2,499.99"` display.
