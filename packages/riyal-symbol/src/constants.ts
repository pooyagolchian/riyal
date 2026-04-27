/**
 * Saudi Riyal Sign — U+20C1 — proposed for Unicode 17.0 (September 2025).
 *
 * Until OS fonts ship native support, this package renders the symbol via a
 * bundled web font / inline SVG.
 */
export const RIYAL_UNICODE = "\u20C1";
export const RIYAL_CODEPOINT = 0x20c1;
export const RIYAL_HTML_ENTITY = "&#x20C1;";
export const RIYAL_CSS_CONTENT = "\\20C1";

/** Plain-text fallback used in formatted strings (matches RIYAL_UNICODE). */
export const RIYAL_SYMBOL_TEXT = RIYAL_UNICODE;

/** ISO 4217 currency code for the Saudi Riyal. */
export const RIYAL_CURRENCY_CODE = "SAR" as const;

/** Common Arabic abbreviation used for the riyal in everyday typography. */
export const RIYAL_ARABIC_ABBREVIATION = "ر.س";

/** Default English locale targeting Saudi Arabia (LTR). */
export const RIYAL_DEFAULT_LOCALE = "en-SA";

/** Default Arabic / RTL locale. */
export const RIYAL_RTL_LOCALE = "ar-SA";
