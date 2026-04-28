# riyal

[![npm version](https://img.shields.io/npm/v/riyal.svg?color=2e7d32)](https://www.npmjs.com/package/riyal)
[![npm downloads](https://img.shields.io/npm/dm/riyal.svg?color=2e7d32)](https://www.npmjs.com/package/riyal)
[![license](https://img.shields.io/npm/l/riyal.svg?color=2e7d32)](./LICENSE)
[![bundle](https://img.shields.io/bundlephobia/minzip/riyal?color=2e7d32)](https://bundlephobia.com/package/riyal)

> The **Saudi Riyal currency symbol** — `U+20C1` — as a web font, CSS
> utilities, React / React Native components, Web Components, a Tailwind
> plugin, Next.js font helpers, OG image cards, a CLI, VAT helpers, and
> currency conversion utilities. Pixel-precise. Locale-aware. Effortless.
>
> Sister project of [`dirham`](https://www.npmjs.com/package/dirham).

- 🌐 **Live demo** — [riyal.js.org](https://riyal.js.org)
- 📦 **npm** — [npmjs.com/package/riyal](https://www.npmjs.com/package/riyal)
- 🐙 **GitHub** — [pooyagolchian/riyal](https://github.com/pooyagolchian/riyal)
- 📚 **Full API docs** — [packages/riyal-symbol/README.md](./packages/riyal-symbol/README.md)

---

## Highlights

- ⚡ **Tiny** — tree-shakable ESM, ~58 kB packed (font included).
- 🅵 **Bundled web font** — renders `U+20C1` until OS fonts ship Unicode 17.0.
- 🌍 **Locale-aware** formatting via `Intl.NumberFormat` (LTR + RTL, Arabic
  digits, compact notation).
- 🧮 **VAT helpers** tuned for Saudi Arabia (`addVAT`, `removeVAT`, `getVAT`).
- 💱 **Live FX** — cached SAR-base exchange rates, `convertFromSAR`,
  `convertToSAR`, `useRiyalRate` hook.
- ⚛️ **React** — `RiyalSymbol`, `RiyalIcon`, `RiyalPrice`,
  `AnimatedRiyalPrice`, `RiyalInput`.
- 🧱 **Web Components** — `<riyal-symbol>`, `<riyal-price>`, framework-free.
- 📱 **React Native** — same API, browser-free imports.
- 🎨 **Tailwind plugin** — utilities, components and theme tokens.
- 🅽 **Next.js** — first-class `next/font` integration, zero CLS.
- 🖼️ **OG image cards** — Satori-ready JSX + string-SVG generator.
- ⌨️ **CLI** — `riyal`, `riyal copy [unicode|html|css]`.
- 📋 **Clipboard helpers** — `copyRiyalSymbol`, `copyRiyalAmount`.
- 🛡️ **SSR-safe**, strict TypeScript, ships ESM + CJS + type defs.

---

## Install

```bash
pnpm add riyal     # or: npm i riyal · yarn add riyal · bun add riyal
```

## Quick start

```ts
import {
  formatRiyal,
  parseRiyal,
  addVAT,
  removeVAT,
  getVAT,
  convertFromSAR,
  copyRiyalSymbol,
  RIYAL_UNICODE,
  SAUDI_VAT_RATE,
} from "riyal";

formatRiyal(1234.5);                              // "\u20C1 1,234.50"
formatRiyal(1234.5, { locale: "ar-SA" });         // "١٬٢٣٤٫٥٠ \u20C1"
formatRiyal(100, { useCode: true });              // "SAR 100.00"
formatRiyal(1_500_000, { notation: "compact" }); // "\u20C1 1.5M"

parseRiyal("\u20C1 2,499.99");                    // 2499.99
parseRiyal("SAR 1.5M");                            // 1500000
parseRiyal("١٬٢٣٤٫٥٠ \u20C1");                    // 1234.5

addVAT(100);                                       // 115
removeVAT(115);                                    // 100
getVAT(100);                                       // 15
SAUDI_VAT_RATE;                                    // 0.15

await convertFromSAR(100, "USD");                  // 26.6...
await copyRiyalSymbol("html");                     // copies "&#x20C1;"
```

## React

```tsx
import {
  RiyalSymbol,
  RiyalIcon,
  RiyalPrice,
  AnimatedRiyalPrice,
  RiyalInput,
  useRiyalRate,
} from "riyal/react";
import "riyal/css";

<RiyalSymbol size={32} />
<RiyalIcon size={48} aria-label="Saudi Riyal" />
<RiyalPrice amount={2499.99} locale="ar-SA" />
<AnimatedRiyalPrice amount={total} durationMs={600} />

<RiyalInput
  value={amount}
  onValueChange={setAmount}
  decimals={2}
  placeholder="0.00"
/>;

// Live FX
const { rate, loading, error, refresh } = useRiyalRate("USD");
```

## Web Components

```html
<script type="module">
  import { defineRiyalElements } from "riyal/web-component";
  defineRiyalElements();
</script>

<riyal-symbol size="48"></riyal-symbol>
<riyal-price amount="2499.99" locale="ar-SA"></riyal-price>
```

## React Native

```tsx
import { RiyalSymbol, RiyalPrice } from "riyal/react-native";

<View>
  <RiyalSymbol size={32} />
  <RiyalPrice amount={1234.5} locale="ar-SA" />
</View>;
```

## Tailwind plugin

```ts
// tailwind.config.ts
import riyal from "riyal/tailwind";

export default {
  plugins: [riyal()],
};
```

```html
<span class="riyal-price">2,499.99</span>
<span class="riyal-symbol"></span>
```

## Next.js

```tsx
// app/layout.tsx
import { riyal } from "riyal/next";
import "riyal/css";

const riyalFont = riyal({ display: "swap" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={riyalFont.className}>
      <body>{children}</body>
    </html>
  );
}
```

## OG image cards

```tsx
// app/og/route.tsx
import { ImageResponse } from "next/og";
import { RiyalOGCard } from "riyal/og";

export async function GET() {
  return new ImageResponse(
    <RiyalOGCard title="Pricing" amount={2499.99} locale="ar-SA" />,
    { width: 1200, height: 630 },
  );
}
```

## Pure CSS / SCSS

```css
@import "riyal/css";

.price::before {
  content: "\20C1\00a0";
  font-family: "Riyal", system-ui;
}
```

```scss
@use "riyal/scss" as riyal;

.total {
  @include riyal.symbol-prefix;
}
```

## CLI

```bash
npx riyal                     # print info & codepoint table
npx riyal copy unicode        # → \u20C1
npx riyal copy html           # → &#x20C1;
npx riyal copy css            # → \20C1
```

## Constants

```ts
import {
  RIYAL_UNICODE,             // "\u20C1"
  RIYAL_CODEPOINT,           // 0x20C1
  RIYAL_HTML_ENTITY,         // "&#x20C1;"
  RIYAL_CSS_CONTENT,         // "\\20C1"
  RIYAL_CURRENCY_CODE,       // "SAR"
  RIYAL_ARABIC_ABBREVIATION, // "ر.س"
  RIYAL_DEFAULT_LOCALE,      // "en-SA"
  RIYAL_RTL_LOCALE,          // "ar-SA"
  SAUDI_VAT_RATE,            // 0.15
} from "riyal";
```

## Repository layout

```
.
├── apps/
│   └── docs/              # Vite + React demo (riyal.js.org)
├── packages/
│   ├── riyal-symbol/      # Published as `riyal`
│   └── tsconfig/          # Shared TS configs
├── .changeset/            # Changesets for releases
└── turbo.json             # Turborepo pipeline
```

## Develop

```bash
pnpm install
pnpm dev          # tsup --watch on the package
pnpm test         # vitest
pnpm build        # turbo run build
pnpm lint         # biome check
pnpm changeset    # author a changeset before releasing
```

## Browser & runtime support

- Modern evergreen browsers (Chrome, Edge, Safari, Firefox).
- Node ≥ 18 (uses global `fetch` for FX; pass `options.fetcher` to override).
- React ≥ 18 for the hook surface.
- React Native: import from `riyal/react-native` to skip browser-only paths.

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). Be kind:
[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md).

## License

MIT © Pooya Golchian
