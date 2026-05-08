import { RIYAL_ARABIC_ABBREVIATION, RIYAL_CURRENCY_CODE, RIYAL_SYMBOL_TEXT } from "./constants";

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/**
 * Convert Arabic-Indic (٠-٩) and Persian-Indic (۰-۹) digits to ASCII 0-9.
 * Non-digit characters pass through unchanged.
 */
export function normalizeRiyalDigits(input: string): string {
	let out = "";
	for (const ch of input) {
		const ai = ARABIC_INDIC_DIGITS.indexOf(ch);
		if (ai >= 0) {
			out += String(ai);
			continue;
		}
		const pi = PERSIAN_DIGITS.indexOf(ch);
		if (pi >= 0) {
			out += String(pi);
			continue;
		}
		out += ch;
	}
	return out;
}

const STRIP_PATTERN = new RegExp(
	[RIYAL_SYMBOL_TEXT, RIYAL_CURRENCY_CODE, RIYAL_ARABIC_ABBREVIATION.replace(/\./g, "\\.")].join(
		"|",
	),
	"gi",
);

/**
 * Strip currency markers, RTL/LTR control marks, and whitespace from a
 * Riyal-formatted string. Does NOT normalize digits or separators — call
 * `normalizeRiyalDigits` first if needed.
 */
export function cleanRiyalString(input: string): string {
	return input.replace(STRIP_PATTERN, "").replace(/[‎‏‪-‮  \s]/g, "");
}

export interface MaskRiyalOptions {
	/** Number of decimal places permitted. Defaults to `2`. */
	decimals?: number;
	/** Allow a leading `-` sign. Defaults to `false`. */
	allowNegative?: boolean;
}

export interface MaskRiyalResult {
	/** Numeric value (NaN if the input is empty or not a number). */
	value: number;
	/** The formatted display string to put back into the input. */
	display: string;
	/** Suggested caret position within `display`. */
	caret: number;
}

/**
 * Mask a free-form input string into a clean number plus a formatted display
 * string. Handles paste of `"⃁ 1,234.56"`, `"SAR 1,234.56"`, Arabic
 * (`"٢٤٩٩٫٩٩"`) and Persian digits, RTL marks, and partial typing.
 *
 * @param input    The raw value the user typed or pasted.
 * @param caret    Caret position in `input` (default: end of string).
 * @param options  Decimals / negative settings.
 *
 * @example
 * maskRiyal("SAR 2,499.99");          // { value: 2499.99, display: "2,499.99", caret: 8 }
 * maskRiyal("٢٤٩٩٫٩٩"); // { value: 2499.99, ... }
 * maskRiyal("12345");                  // { value: 12345, display: "12,345", caret: 6 }
 */
export function maskRiyal(
	input: string,
	caret?: number,
	options: MaskRiyalOptions = {},
): MaskRiyalResult {
	const { decimals = 2, allowNegative = false } = options;
	const caretIndex = Math.min(caret ?? input.length, input.length);

	const normalized = normalizeRiyalDigits(input).replace(/٫/g, ".").replace(/٬/g, ",");

	let digitsLeft = 0;
	for (let i = 0; i < caretIndex; i++) {
		const ch = normalized[i];
		if (ch && ch >= "0" && ch <= "9") digitsLeft++;
	}

	const negative = allowNegative && /-/.test(normalized);

	let body = cleanRiyalString(normalized).replace(/[^0-9.]/g, "");

	const firstDot = body.indexOf(".");
	if (firstDot >= 0) {
		body = body.slice(0, firstDot + 1) + body.slice(firstDot + 1).replace(/\./g, "");
	}

	if (firstDot >= 0 && decimals >= 0) {
		const [intPart = "", fracPart = ""] = body.split(".");
		body = `${intPart}.${fracPart.slice(0, decimals)}`;
	}

	body = body.replace(/^0+(?=\d)/, "");

	if (body === "" || body === ".") {
		const display = body === "." ? "0." : "";
		return { value: Number.NaN, display, caret: display.length };
	}

	const trailingDot = body.endsWith(".");
	const [intStr = "", fracStr] = body.split(".");
	const intNumeric = intStr === "" ? 0 : Number(intStr);
	const intFormatted = intNumeric.toLocaleString("en-US");

	let display = intFormatted;
	if (trailingDot) display += ".";
	else if (fracStr !== undefined) display += `.${fracStr}`;
	if (negative) display = `-${display}`;

	const numericValue = Number(`${negative ? "-" : ""}${body}`);

	let seen = 0;
	let nextCaret = display.length;
	for (let i = 0; i < display.length; i++) {
		const ch = display[i];
		if (ch && ch >= "0" && ch <= "9") {
			if (seen === digitsLeft) {
				nextCaret = i;
				break;
			}
			seen++;
		}
	}

	return {
		value: Number.isFinite(numericValue) ? numericValue : Number.NaN,
		display,
		caret: nextCaret,
	};
}
