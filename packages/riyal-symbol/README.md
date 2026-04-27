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
- [Core API](#core-api) — formatting, parsing, VAT, conversion, clipboard
- [React](#react) — `RiyalSymbol`, `RiyalIcon`, `RiyalPrice`,
  `AnimatedRiyalPrice`, `RiyalInput`, `useRiyalRate`
- [Web Components](#web-components) — framework-agnostic
- [React Native](#react-native)
- [CSS / SCSS](#css--scss)
- [Tailwind plugin](#tailwind-plugin)
- [Next.js font helper](#nextjs-font-helper)
- [OG image cards](#og-image-cards)
- [CLI](#cli)
- [Constants & locales](#constants--locales)
- [Browser support](#browser-support)
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

Adds:

- `font-riyal`, `font-riyal-arabic`, `font-riyal-mono`
- `riyal-symbol::before` utility
- `text-riyal-*` tokens for Saudi green (`#006c35`)

```html
<span class="font-riyal text-riyal-700">2,499.99</span>
<span class="riyal-symbol"></span>
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

---

## OG image cards

Generate Open Graph share images on the fly (Edge / Node / `@vercel/og`).

```tsx
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

Or render to standalone SVG:

```ts
import { generatePriceCardSVG } from "riyal/og";

const svg = generatePriceCardSVG({ amount: 2499.99, title: "Cart total" });
```

---

## CLI

Installed automatically as a `riyal` bin.

```bash
$ riyal symbol             # prints U+20C1
$ riyal copy               # copies the glyph to clipboard
$ riyal format 2499.99     # formatted SAR
$ riyal vat add 100        # 115
$ riyal convert 100 USD    # SAR → USD
$ riyal --help
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
