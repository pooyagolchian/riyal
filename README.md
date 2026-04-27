# riyal

> The Saudi Riyal (﷼) currency symbol — `U+20C1` — as a web font, CSS
> utilities, React / React Native components, Web Components, a Tailwind
> plugin, Next.js font helpers, OG image cards, a CLI, VAT helpers, and
> currency conversion utilities. Sister project of [`dirham`](https://www.npmjs.com/package/dirham).

```bash
pnpm add riyal
```

```ts
import { formatRiyal, RIYAL_UNICODE, addVAT } from "riyal";

formatRiyal(1234.5); // "\u20C1 1,234.50"
formatRiyal(1234.5, { locale: "ar-SA" }); // "\u00d9\u00a1\u00d9\u00ac\u00d9\u00a2\u00d9\u00a3\u00d9\u00a4\u00d9\u00ab\u00d9\u00a5\u00d9\u00a0 \u20C1"
addVAT(100); // 115  (Saudi VAT = 15%)
```

```tsx
import { RiyalSymbol, RiyalPrice } from "riyal/react";
import "riyal/css";

<RiyalSymbol />
<RiyalPrice amount={1234.5} locale="ar-SA" />
```

## Highlights

- Drop-in support for **U+20C1** with a bundled web font (until OS fonts ship Unicode 17.0)
- Framework adapters: `riyal/react`, `riyal/react-native`, `riyal/web-component`, `riyal/next`, `riyal/tailwind`, `riyal/og`
- Locale-aware `Intl.NumberFormat` formatting with Arabic-numeral and RTL support
- VAT helpers tuned for Saudi Arabia (`addVAT`, `removeVAT`, `getVAT`)
- Live currency conversion (`fetchExchangeRates`, `convertFromSAR`, `convertToSAR`)
- CLI: `riyal`, `riyal copy [unicode|html|css]`

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
pnpm changeset    # author a changeset before releasing
```

## License

MIT © Pooya Golchian
