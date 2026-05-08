import { type FormatRiyalOptions, formatRiyal } from "../format";
import { SAUDI_VAT_RATE, addVAT, removeVAT } from "../vat";

function round(value: number, decimals = 2): number {
	const f = 10 ** decimals;
	return Math.round(value * f) / f;
}

export interface LineItemInput {
	/** Stable identifier (used for React keys / cart mutation). */
	id?: string;
	/** Human label (e.g. `"Coffee Mug"`). */
	name?: string;
	/** Per-unit price in SAR. */
	unit: number;
	/** Quantity. Defaults to `1`. */
	qty?: number;
	/**
	 * Whether `unit` already includes VAT. Defaults to `false` (i.e. `unit`
	 * is the net price). Saudi e-commerce typically displays VAT-inclusive
	 * catalogue prices — set this to `true` when modelling those.
	 */
	vatIncluded?: boolean;
	/** Per-line discount in SAR (subtracted after applying `qty`). */
	discount?: number;
}

export interface LineItem {
	id?: string;
	name?: string;
	unit: number;
	qty: number;
	discount: number;
	vatRate: number;
	/** Net subtotal (pre-VAT, post-discount). */
	net: number;
	/** VAT amount on `net`. */
	vat: number;
	/** Gross total (`net + vat`). */
	gross: number;
}

export interface LineItemOptions {
	/** Override the VAT rate. Defaults to `SAUDI_VAT_RATE` (15%). */
	vatRate?: number;
	/** Decimal places to round each line value to. Defaults to `2`. */
	decimals?: number;
}

/**
 * Compute net / VAT / gross for a single cart line.
 *
 * @example
 * lineItem({ unit: 100, qty: 2 });
 * // → { unit: 100, qty: 2, net: 200, vat: 30, gross: 230, ... }
 *
 * @example
 * lineItem({ unit: 115, qty: 1, vatIncluded: true });
 * // → { unit: 115, net: 100, vat: 15, gross: 115, ... }
 */
export function lineItem(input: LineItemInput, options: LineItemOptions = {}): LineItem {
	const { id, name, unit, qty = 1, vatIncluded = false, discount = 0 } = input;
	const { vatRate = SAUDI_VAT_RATE, decimals = 2 } = options;

	const subtotal = unit * qty;

	let net: number;
	let gross: number;
	if (vatIncluded) {
		gross = round(Math.max(0, subtotal - discount), decimals);
		net = round(removeVAT(gross, { rate: vatRate, decimals }), decimals);
	} else {
		net = round(Math.max(0, subtotal - discount), decimals);
		gross = round(addVAT(net, { rate: vatRate, decimals }), decimals);
	}
	const vat = round(gross - net, decimals);

	return {
		id,
		name,
		unit,
		qty,
		discount,
		vatRate,
		net,
		vat,
		gross,
	};
}

export interface CartTotalOptions {
	/** Override the VAT rate. Defaults to `SAUDI_VAT_RATE`. */
	vatRate?: number;
	/** Cart-level discount (SAR), applied to the gross subtotal. */
	discount?: number;
	/** Net shipping cost in SAR. VAT is added on top by default. */
	shipping?: number;
	/** Whether `shipping` is already VAT-inclusive. Defaults to `false`. */
	shippingIncludesVat?: boolean;
	/** Decimal places for final totals. Defaults to `2`. */
	decimals?: number;
}

export interface CartTotals {
	/** Sum of every line's `net`. */
	subtotal: number;
	/** Sum of every line's `vat`, before cart-level discount. */
	vatSubtotal: number;
	/** Cart-level discount actually applied. */
	discount: number;
	/** Net total after discount. */
	netTotal: number;
	/** Total VAT after discount + shipping VAT. */
	vat: number;
	/** Net shipping. */
	shipping: number;
	/** Grand total (`netTotal + vat + shipping`). */
	total: number;
	/** Number of line items (sum of qty). */
	itemCount: number;
	vatRate: number;
}

/**
 * Roll up an array of `LineItem`s into cart-level totals.
 *
 * Cart-level discount reduces both net and VAT proportionally (matching how
 * Saudi receipts present discounts). Shipping is treated as VAT-net by default
 * — pass `shippingIncludesVat: true` if your shipping fee is already gross.
 */
export function cartTotal(items: readonly LineItem[], options: CartTotalOptions = {}): CartTotals {
	const {
		vatRate = SAUDI_VAT_RATE,
		discount: rawDiscount = 0,
		shipping: rawShipping = 0,
		shippingIncludesVat = false,
		decimals = 2,
	} = options;

	const subtotal = round(
		items.reduce((s, i) => s + i.net, 0),
		decimals,
	);
	const vatSubtotal = round(
		items.reduce((s, i) => s + i.vat, 0),
		decimals,
	);
	const grossSubtotal = subtotal + vatSubtotal;

	const discount = Math.max(0, Math.min(rawDiscount, grossSubtotal));
	const ratio = grossSubtotal > 0 ? (grossSubtotal - discount) / grossSubtotal : 0;
	const netTotal = round(subtotal * ratio, decimals);
	const vatAfterDiscount = round(vatSubtotal * ratio, decimals);

	const shipping = shippingIncludesVat
		? round(removeVAT(rawShipping, { rate: vatRate, decimals }), decimals)
		: round(rawShipping, decimals);
	const shippingVat = round(shipping * vatRate, decimals);

	const vat = round(vatAfterDiscount + shippingVat, decimals);
	const total = round(netTotal + vat + shipping, decimals);
	const itemCount = items.reduce((s, i) => s + i.qty, 0);

	return {
		subtotal,
		vatSubtotal,
		discount,
		netTotal,
		vat,
		shipping,
		total,
		itemCount,
		vatRate,
	};
}

export interface FormatLineItemOptions {
	/** Forwarded to `formatRiyal` for printing each value. */
	format?: FormatRiyalOptions;
}

export interface FormattedLineItem {
	name: string;
	qty: string;
	unit: string;
	discount: string;
	net: string;
	vat: string;
	gross: string;
}

/**
 * Render every numeric field of a `LineItem` through `formatRiyal`, returning
 * print-ready strings. Useful for receipts, OG cards, and table rendering.
 */
export function formatLineItem(
	item: LineItem,
	options: FormatLineItemOptions = {},
): FormattedLineItem {
	const fmt = options.format;
	return {
		name: item.name ?? "",
		qty: String(item.qty),
		unit: formatRiyal(item.unit, fmt),
		discount: formatRiyal(item.discount, fmt),
		net: formatRiyal(item.net, fmt),
		vat: formatRiyal(item.vat, fmt),
		gross: formatRiyal(item.gross, fmt),
	};
}
