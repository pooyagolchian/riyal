# riyal

[![npm version](https://img.shields.io/npm/v/riyal.svg?color=2e7d32)](https://www.npmjs.com/package/riyal)
[![npm downloads](https://img.shields.io/npm/dm/riyal.svg?color=2e7d32)](https://www.npmjs.com/package/riyal)
[![license](https://img.shields.io/npm/l/riyal.svg?color=2e7d32)](./LICENSE)
[![bundle](https://img.shields.io/bundlephobia/minzip/riyal?color=2e7d32)](https://bundlephobia.com/package/riyal)

The **Saudi Riyal currency symbol (U+20C1) toolkit** — a web font, CSS, React
components, React Native, Web Components, a Tailwind plugin, Next.js font
helpers, OG image cards, and a CLI. Written in TypeScript, ships ESM + CJS +
type defs.

> Built around **U+20C1** (Saudi Riyal Sign) — the codepoint scheduled for
> Unicode 17.0 (September 2025). Until OS fonts ship native support, this
> package renders the symbol via a bundled web font derived from the
> **SAMA** (Saudi Central Bank) glyph released in February 2025. Once
> Unicode 17.0 lands, the font becomes optional with no API changes.

- 🌐 **Live demo:** [riyal.js.org](https://riyal.js.org)
- 📦 **npm:** [npmjs.com/package/riyal](https://www.npmjs.com/package/riyal)
- 🐙 **GitHub:** [pooyagolchian/riyal](https://github.com/pooyagolchian/riyal)

---

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Core API](#core-api) — formatting, parsing, VAT, conversion, clipboard, error handling
- [React](#react) — `RiyalSymbol`, `RiyalIcon`, `RiyalPrice`,
  `AnimatedRiyalPrice`, `RiyalInput`, `useRiyalRate`
- [Web Components](#web-components) — attribute reference, events, shadow DOM styling
- [React Native](#react-native)
- [CSS / SCSS](#css--scss)
- [Tailwind plugin](#tailwind-plugin)
- [Next.js font helper](#nextjs-font-helper) — Server vs Client Components
- [OG image cards](#og-image-cards)
- [CLI](#cli)
- [Constants & locales](#constants--locales)
- [Browser support](#browser-support)
- [Why riyal?](#why-riyal)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- ⚡ **Tiny** — tree-shakable ESM, ~58 kB packed (font included).
- 🎨 **Multiple weights & families** — sans, serif, mono, arabic.
- 🧮 **VAT helpers** — Saudi 15% default, configurable.
- 💱 **Currency conversion** — SAR-based, in-memory cached.
- 🔤 **`Intl.NumberFormat`** — `en-SA` and `ar-SA` (RTL) out of the box.
- ⚛️ **React + React Native + Web Components** — pick your stack.
- 🎯 **Tailwind v3 & v4 plugin**, **Next.js `next/font`** integration.
- 🖼️ **OG cards** for share images.
- 🛠️ **CLI** for quick lookups & copy-to-clipboard.

---

## Installation

```bash
# pnpm
pnpm add riyal

# npm
npm install riyal

# yarn
yarn add riyal

# bun
bun add riyal
```

Peer deps (all optional, only required for the entry you import):

| Entry                | Peer                                           |
| -------------------- | ---------------------------------------------- |
| `riyal/react`        | `react ≥ 18`, `react-dom ≥ 18`                 |
| `riyal/react-native` | `react-native ≥ 0.72`, `react-native-svg ≥ 13` |
| `riyal/tailwind`     | `tailwindcss ≥ 3`                              |
| `riyal/next`         | `next ≥ 13`                                    |

Node ≥ 20 is required (for full ICU / `Intl` support).

---

## Quick start

```ts
import { formatRiyal, addVAT, RIYAL_UNICODE } from "riyal";

formatRiyal(2499.99);
// → "ŝ 2,499.99"  (en-SA, U+20C1 + thin space)

formatRiyal(2499.99, { locale: "ar-SA" });
// → "٢٬٤٩٩٫٩٩ ŝ"  (ar-SA, RTL)

addVAT(100); // 115     (15% Saudi VAT)
RIYAL_UNICODE; // "ŝ"     (U+20C1)
```

---

## Core API

Imported from the root entry: `import { ... } from "riyal";`

### `formatRiyal(amount, options?)`

Format a number as a Riyal-prefixed/suffixed string using
`Intl.NumberFormat`.

```ts
import { formatRiyal } from "riyal";

formatRiyal(1234.5);
formatRiyal(1234.5, {
  locale: "ar-SA",
  decimals: 0,
  symbol: "ر.س", // override the glyph
  position: "suffix", // "prefix" | "suffix"
  compact: true, // 1.2K-style notation
});
```

`FormatRiyalOptions`:

| Option                                | Type                   | Default          |
| ------------------------------------- | ---------------------- | ---------------- |
| `locale`                              | `string`               | `"en-SA"`        |
| `decimals`                            | `number`               | `2`              |
| `symbol`                              | `string`               | `"\u20C1"`       |
| `position`                            | `"prefix" \| "suffix"` | locale-dependent |
| `compact`                             | `boolean`              | `false`          |
| `groupSeparator` / `decimalSeparator` | `string`               | locale defaults  |

### `parseRiyal(input)`

Strict reverse of `formatRiyal` — supports compact (`1.2K`), grouped, and
Arabic-Indic digits.

```ts
parseRiyal("ŝ 2,499.99"); // 2499.99
parseRiyal("١٬٢٣٤٫٥٠ ŝ"); // 1234.5
parseRiyal("1.2K"); // 1200
```

### VAT helpers

```ts
import { addVAT, removeVAT, getVAT, SAUDI_VAT_RATE } from "riyal";

addVAT(100); // 115
removeVAT(115); // 100
getVAT(100); // 15
addVAT(100, { rate: 0.05 }); // 105
SAUDI_VAT_RATE; // 0.15
```

### Currency conversion (SAR base)

```ts
import { fetchExchangeRates, convertFromSAR, convertToSAR } from "riyal";

const rates = await fetchExchangeRates(); // cached 1h in-memory
await convertFromSAR(1000, "USD"); // SAR → USD
await convertToSAR(100, "USD"); // USD → SAR
await convertFromSAR(100, "USD", { rate: 0.27 }); // bypass network
```

### Clipboard

```ts
import { copyRiyal } from "riyal";

await copyRiyal(); // "\u20C1"
await copyRiyal({ format: "html" }); // "&#x20C1;"
await copyRiyal({ format: "css" }); // "\\20C1"
```

### Error handling

`fetchExchangeRates` throws a `TypeError` when the network is unavailable.
`convertFromSAR` / `convertToSAR` throw a `RangeError` when the target currency
is not in the rate table. Always wrap in `try/catch` in production:

```ts
import { convertFromSAR } from "riyal";

let usd: number;
try {
  usd = await convertFromSAR(1000, "USD");
} catch {
  usd = 1000 * 0.267; // last-known SAR/USD fallback
}
```

`useRiyalRate` surfaces the error in its return value — no extra `try/catch` needed:

```tsx
const { convert, loading, error } = useRiyalRate("EUR");

if (error) return <span>Rates unavailable</span>;
if (loading) return <span>Loading…</span>;
return <span>{convert(cartTotal)} EUR</span>;
```

---

## React

```bash
pnpm add riyal react react-dom
```

```tsx
import "riyal/css";
import {
  RiyalSymbol,
  RiyalIcon,
  RiyalPrice,
  AnimatedRiyalPrice,
  RiyalInput,
  useRiyalRate,
} from "riyal/react";
```

### `<RiyalSymbol />`

Inline span using the bundled font — sized via CSS `em`.

```tsx
<RiyalSymbol size={24} />
<RiyalSymbol size="1.25em" weight={600} />
```

### `<RiyalIcon />`

Standalone SVG icon (no font required).

```tsx
<RiyalIcon width={32} height={32} aria-label="SAR" />
```

### `<RiyalPrice />`

Formatted price, locale-aware.

```tsx
<RiyalPrice amount={2499.99} />
<RiyalPrice amount={2499.99} locale="ar-SA" decimals={0} />
<RiyalPrice amount={1_200_000} compact />
```

### `<AnimatedRiyalPrice />`

Spring-animated counter for live totals.

```tsx
<AnimatedRiyalPrice amount={cartTotal} duration={400} />
```

### `<RiyalInput />`

Controlled numeric input that displays `formatRiyal` while preserving the
underlying number.

```tsx
const [value, setValue] = useState<number | "">(0);

<RiyalInput value={value} onValueChange={setValue} locale="ar-SA" />;
```

### `useRiyalRate(target)`

Tiny hook around `convertFromSAR`. Caches per target, refreshes hourly.

```tsx
const { rate, convert, loading, error } = useRiyalRate("USD");

return <span>{convert(2499.99)} USD</span>;
```

---

## Web Components

Framework-agnostic — works with **Vue**, **Angular**, **Svelte**, **Solid**,
and vanilla HTML. Registers `<riyal-symbol>`, `<riyal-icon>`, and
`<riyal-price>`.

```ts
import { defineRiyalElements } from "riyal/web-component";
import "riyal/css";

defineRiyalElements();
```

```html
<riyal-symbol size="1.25em"></riyal-symbol>
<riyal-icon width="24" height="24"></riyal-icon>
<riyal-price amount="2499.99" locale="ar-SA" compact></riyal-price>
```

### Attribute reference

| Element | Attribute | Type | Default | Reactive |
| --- | --- | --- | --- | --- |
| `<riyal-symbol>` | `size` | CSS length | `1em` | yes |
| `<riyal-icon>` | `width` / `height` | number (px) | `24` | yes |
| `<riyal-icon>` | `aria-label` | string | `"Saudi Riyal"` | yes |
| `<riyal-price>` | `amount` | number string | required | yes |
| `<riyal-price>` | `locale` | `"en-SA"` \| `"ar-SA"` | `"en-SA"` | yes |
| `<riyal-price>` | `decimals` | number | `2` | yes |
| `<riyal-price>` | `compact` | boolean attribute | `false` | yes |
| `<riyal-animated-price>` | `amount` | number string | required | yes |
| `<riyal-animated-price>` | `duration` | number (ms) | `600` | yes |
| `<riyal-input>` | `value` | number string | `""` | yes |

All attributes are observed — setting them via `setAttribute` or a framework
binding triggers a re-render with no extra boilerplate.

### Events

`<riyal-input>` dispatches a `riyal-change` CustomEvent when the value changes:

```js
document.querySelector("riyal-input").addEventListener("riyal-change", (e) => {
  console.log(e.detail.value); // number
});
```

### Shadow DOM styling

Each element uses a closed shadow root. Override the symbol color and size with
CSS custom properties exposed on the host:

```css
riyal-price {
  --riyal-color: #006c35; /* Saudi green */
  --riyal-size: 1.25rem;
}
```

---

## React Native

```ts
import { RiyalSymbol, RiyalPrice } from "riyal/react-native";

// Renders via react-native-svg — no font installation required.
<RiyalPrice amount={2499.99} />;
```

---

## CSS / SCSS

Self-host the font + utility classes:

```css
/* CSS */
@import "riyal/css";
```

```scss
// SCSS
@use "riyal/scss" as riyal;
```

Or pull a single weight:

```css
@font-face {
  font-family: "Riyal";
  src: url("riyal/font/woff2") format("woff2");
}
```

Available font subpaths:

- `riyal/font/woff2`
- `riyal/font/woff`
- `riyal/font/ttf`
- `riyal/font/sans/woff2`
- `riyal/font/serif/woff2`
- `riyal/font/mono/woff2`
- `riyal/font/arabic/woff2`

---

## Tailwind plugin

Works with **Tailwind v3** and **v4**.

```ts
// tailwind.config.ts
import riyal from "riyal/tailwind";

export default {
  plugins: [riyal()],
};
```

Adds these utilities:

| Class | Effect |
| --- | --- |
| `font-riyal` | `font-family: "Riyal", system-ui` |
| `font-riyal-arabic` | Arabic variant of the Riyal font |
| `font-riyal-mono` | Monospace variant |
| `riyal-symbol` | `::before` with U+20C1 glyph |
| `riyal-price` | `::before` glyph + `margin-inline-end: 0.25em` |
| `text-riyal-{50…900}` | Saudi green palette (`#006c35` base) |
| `riyal-{xs,sm,base,lg,xl,2xl}` | Symbol size utilities |

```html
<span class="font-riyal text-riyal-700">2,499.99</span>
<span class="riyal-symbol text-riyal-500 riyal-lg"></span>
```

**Tailwind v4** — use the CSS-first config:

```css
/* app.css */
@import "tailwindcss";
@plugin "riyal/tailwind";
```

---

## Next.js font helper

```ts
// app/layout.tsx
import { riyalFont } from "riyal/next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={riyalFont.variable}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* globals.css */
:root {
  --font-riyal: var(--font-riyal-sans);
}
```

### Server vs Client Components (Next.js App Router)

`RiyalPrice` and `RiyalSymbol` have no client-side state — use them directly in
Server Components. `AnimatedRiyalPrice` and `RiyalInput` require
`requestAnimationFrame` / React state, so they must be Client Components:

```tsx
// app/product/page.tsx — Server Component, no directive needed
import { RiyalPrice } from "riyal/react";

export default function ProductPage() {
  return <RiyalPrice amount={2499.99} />;
}
```

```tsx
// components/cart-total.tsx — must be a Client Component
"use client";
import { AnimatedRiyalPrice } from "riyal/react";

export function CartTotal({ total }: { total: number }) {
  return <AnimatedRiyalPrice amount={total} duration={400} />;
}
```

---

## OG image cards

Generate Open Graph share images on the fly. Two APIs — pick one:

| API | Use when |
| --- | --- |
| `RiyalPriceCard(opts)` | You're using `@vercel/og` or `next/og` — returns a JSX element tree |
| `generatePriceCardSVG(opts)` | Any backend / serverless function — returns an SVG string, no JSX runtime needed |

**With `@vercel/og` or Next.js App Router:**

```tsx
// app/og/route.tsx
import { ImageResponse } from "next/og";
import { RiyalPriceCard } from "riyal/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    <RiyalPriceCard amount={2499.99} title="iPhone 16 Pro" locale="ar-SA" />,
    { width: 1200, height: 630 }
  );
}
```

**With any backend (returns SVG string):**

```ts
import { generatePriceCardSVG } from "riyal/og";

const svg = generatePriceCardSVG({
  amount: 2499.99,
  title: "Cart total",
  subtitle: "3 items",
  locale: "ar-SA",
  width: 1200,
  height: 630,
  background: "#006c35",
  color: "#ffffff",
});
// → <svg xmlns="http://www.w3.org/2000/svg" ...>…</svg>
```

Both functions accept the same options: `amount`, `title`, `subtitle`,
`locale`, `width`, `height`, `background`, `color`, and all `FormatRiyalOptions`.

---

## CLI

Installed automatically as a `riyal` bin.

```bash
riyal symbol             # prints U+20C1
riyal copy               # copies the glyph to clipboard
riyal format 2499.99     # formatted SAR
riyal vat add 100        # 115
riyal convert 100 USD    # SAR → USD
riyal --help
```

---

## Constants & locales

```ts
import {
  RIYAL_UNICODE, // "\u20C1"
  RIYAL_CODEPOINT, // 0x20C1
  RIYAL_HTML_ENTITY, // "&#x20C1;"
  RIYAL_CSS_CONTENT, // "\\20C1"
  RIYAL_CURRENCY_CODE, // "SAR"
  RIYAL_ARABIC_ABBREVIATION, // "ر.س"
  RIYAL_DEFAULT_LOCALE, // "en-SA"
  RIYAL_RTL_LOCALE, // "ar-SA"
} from "riyal";
```

---

## Browser support

- Modern evergreen browsers (Chrome, Edge, Firefox, Safari).
- Safari ≥ 16, Chrome ≥ 110, Firefox ≥ 110 (uses `Intl.NumberFormat` with
  `notation: "compact"`).
- Node ≥ 20 for non-browser usage.

The bundled font ships as **WOFF2** (preferred), **WOFF**, and **TTF**.

---

## Why riyal?

**vs plain `Intl.NumberFormat`**

`Intl.NumberFormat` formats numbers but does not know about U+20C1 — you'd
still need to append the symbol manually, handle RTL placement, and build VAT
and conversion helpers yourself. `riyal` wraps all of that in one package.

**What `riyal` includes**

| Feature | `riyal` |
| --- | --- |
| Web font (WOFF2/WOFF/TTF) | yes |
| U+20C1 + U+E900 (legacy) | yes |
| `formatRiyal` / `parseRiyal` | yes |
| VAT helpers | yes |
| Currency conversion | yes |
| React components | yes |
| Web Components | yes |
| TypeScript types | yes |
| CDN / no-build usage | via jsDelivr |

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](https://github.com/pooyagolchian/riyal/blob/main/CONTRIBUTING.md)
and the [Code of Conduct](https://github.com/pooyagolchian/riyal/blob/main/CODE_OF_CONDUCT.md).

```bash
pnpm install
pnpm --filter riyal dev    # watch builds
pnpm test                  # vitest
pnpm lint && pnpm format   # biome
```

Releases ship via [Changesets](https://github.com/changesets/changesets):

```bash
pnpm changeset
```

---

## License

[MIT](./LICENSE) © [Pooya Golchian](https://github.com/pooyagolchian)

> The Saudi Riyal symbol glyph is based on the **SAMA** (Saudi Central Bank)
> design released in February 2025 and mapped to **U+20C1**.
