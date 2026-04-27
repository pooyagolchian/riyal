# Saudi Riyal font binaries

This directory holds the WOFF2 / WOFF / TTF artefacts produced by
`pnpm --filter riyal build:fonts`.

The build pipeline maps the official SAMA glyph (Saudi Central Bank, Feb 2025)
to **U+20C1 (SAUDI RIYAL SIGN)** with the following families/weights:

- `riyal-regular.{woff2,woff,ttf}`
- `riyal-medium.woff2`
- `riyal-semibold.woff2`
- `riyal-bold.woff2`
- `riyal-{sans,serif,mono,arabic}.woff2`

Until the master glyph is committed and the toolchain (FontForge or
`opentype.js` + `wawoff2`) is wired up, this folder ships empty placeholders
so paths in `package.json` `exports` resolve. See `scripts/build-fonts.mjs`.
