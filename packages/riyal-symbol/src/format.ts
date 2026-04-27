import { RIYAL_CURRENCY_CODE, RIYAL_DEFAULT_LOCALE, RIYAL_SYMBOL_TEXT } from "./constants";

export interface FormatRiyalOptions {
	/** BCP-47 locale tag. Defaults to `"en-SA"`. */
	locale?: string;
	/** Number of decimal places. Defaults to `2`. */
	decimals?: number;
	/** When true, prefix with the ISO code (`SAR`) instead of the symbol. */
	useCode?: boolean;
	/** `Intl.NumberFormat` notation: `"standard"` (default) or `"compact"`. */
	notation?: "standard" | "compact";
	/** Override the currency code (defaults to `"SAR"`). */
	currency?: string;
}

/**
 * Format a numeric amount as a Saudi Riyal string.
 *
 * @example
 * formatRiyal(1234.5);                              // "\u20C1 1,234.50"
 * formatRiyal(1234.5, { locale: "ar-SA" });         // "١٬٢٣٤٫٥٠ \u20C1"
 * formatRiyal(100, { useCode: true });              // "SAR 100.00"
 * formatRiyal(1500000, { notation: "compact" });    // "\u20C1 1.5M"
 */
export function formatRiyal(amount: number, options: FormatRiyalOptions = {}): string {
	const {
		locale = RIYAL_DEFAULT_LOCALE,
		decimals = 2,
		useCode = false,
		notation = "standard",
		currency = RIYAL_CURRENCY_CODE,
	} = options;

	const formatter = new Intl.NumberFormat(locale, {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
		notation,
	});
	const number = formatter.format(amount);

	const label = useCode ? currency : RIYAL_SYMBOL_TEXT;
	const isRtl = locale.toLowerCase().startsWith("ar");
	return isRtl ? `${number} ${label}` : `${label} ${number}`;
}

/** Western-arabic <-> eastern-arabic digit map. */
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

function normalizeDigits(input: string): string {
	let out = "";
	for (const ch of input) {
		const idx = ARABIC_DIGITS.indexOf(ch);
		out += idx >= 0 ? String(idx) : ch;
	}
	return out;
}

/**
 * Parse a Riyal-formatted string back to a number.
 *
 * Strips the currency symbol/code, normalizes Arabic digits, and tolerates
 * compact suffixes (`K`, `M`, `B`, `T`).
 */
export function parseRiyal(input: string): number {
	if (!input) return Number.NaN;

	let str = normalizeDigits(input).trim();

	// Strip the symbol or currency code
	str = str.replace(RIYAL_SYMBOL_TEXT, "");
	str = str.replace(/SAR|ر\.س/gi, "");

	// Normalize Arabic decimal/thousand marks to ASCII equivalents.
	str = str.replace(/\u066C/g, ",").replace(/\u066B/g, ".");

	// Compact notation suffixes
	const compactMatch = str.match(/([\d.,\-\u202F\u00A0\s]+)([KMBT])\b/i);
	let multiplier = 1;
	if (compactMatch) {
		const suffix = compactMatch[2]?.toUpperCase();
		multiplier = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 }[suffix] ?? 1;
		str = compactMatch[1]!;
	}

	// Normalize separators: keep last "." or "," as decimal, strip the rest.
	const cleaned = str.replace(/[\u202F\u00A0\s]/g, "").replace(/[^\d.,\-]/g, "");
	const lastDot = cleaned.lastIndexOf(".");
	const lastComma = cleaned.lastIndexOf(",");
	let normalized = cleaned;
	if (lastDot >= 0 && lastComma >= 0) {
		const decimalIdx = Math.max(lastDot, lastComma);
		const decimalChar = cleaned[decimalIdx]!;
		const other = decimalChar === "." ? "," : ".";
		normalized = cleaned.split(other).join("").replace(decimalChar, ".");
	} else if (lastComma >= 0 && lastDot < 0) {
		normalized = cleaned.replace(",", ".");
	}

	const value = Number(normalized);
	if (Number.isNaN(value)) return Number.NaN;
	return value * multiplier;
}
