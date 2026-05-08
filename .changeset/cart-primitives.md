---
"riyal": minor
---

Add `riyal/cart` — receipt-grade checkout primitives for Saudi e-commerce.

- **`lineItem({ unit, qty, vatIncluded?, discount? }, { vatRate? })`** — computes per-line `net`, `vat`, and `gross`. Supports both VAT-net catalogue prices (default) and VAT-inclusive prices (`vatIncluded: true`). Per-line discount and over-discount clamping built in.
- **`cartTotal(items, { discount?, shipping?, shippingIncludesVat?, vatRate? })`** — rolls lines up into `subtotal`, `vatSubtotal`, `discount`, `netTotal`, `vat`, `shipping`, `total`, and `itemCount`. Cart-level discount is applied proportionally to net + VAT (matching Saudi receipt convention). Shipping is added with VAT-on-top by default; pass `shippingIncludesVat: true` if your shipping fee is already gross. Discount is capped at the gross subtotal.
- **`formatLineItem(item, { format? })`** — renders every numeric field of a `LineItem` through `formatRiyal`. Useful for receipts, OG cards, and tabular renders.
- Demo (`apps/docs`): new "15 — Checkout" section with a live cart (qty steppers, discount, shipping, totals) wired to `RiyalPrice` and the new helpers. Topbar gets a Checkout link.
- README: new "Cart & checkout primitives — `riyal/cart`" subsection under Core API.

The new entry adds `riyal/cart` to the `exports` map (ESM + CJS + types). All math defaults to `SAUDI_VAT_RATE` (15%) and is overridable per call.
