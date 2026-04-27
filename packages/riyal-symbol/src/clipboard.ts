import {
	RIYAL_CSS_CONTENT,
	RIYAL_HTML_ENTITY,
	RIYAL_UNICODE,
} from "./constants";
import { type FormatRiyalOptions, formatRiyal } from "./format";

export type RiyalCopyFormat = "unicode" | "html" | "css";

function getClipboard(): { writeText(text: string): Promise<void> } {
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		return navigator.clipboard;
	}
	throw new Error(
		"riyal: clipboard API is not available in this environment. " +
			"copyRiyalSymbol/copyRiyalAmount require a browser context (or a polyfill).",
	);
}

/**
 * Copy the Saudi Riyal symbol to the clipboard.
 *
 * @example
 * await copyRiyalSymbol();        // copies "\u20C1"
 * await copyRiyalSymbol("html");  // copies "&#x20C1;"
 * await copyRiyalSymbol("css");   // copies "\\20C1"
 */
export async function copyRiyalSymbol(format: RiyalCopyFormat = "unicode"): Promise<void> {
	const value =
		format === "html"
			? RIYAL_HTML_ENTITY
			: format === "css"
				? RIYAL_CSS_CONTENT
				: RIYAL_UNICODE;
	await getClipboard().writeText(value);
}

/** Copy a formatted Riyal amount to the clipboard. */
export async function copyRiyalAmount(
	amount: number,
	options: FormatRiyalOptions = {},
): Promise<void> {
	await getClipboard().writeText(formatRiyal(amount, options));
}
