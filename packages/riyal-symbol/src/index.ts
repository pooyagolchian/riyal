/**
 * `riyal` — Saudi Riyal currency symbol toolkit.
 *
 * Built around U+20C1 (SAUDI RIYAL SIGN), the codepoint scheduled for
 * Unicode 17.0 (September 2025). The package renders the symbol through a
 * custom web font today; once operating systems ship native Unicode 17.0
 * support, the font becomes optional with no API changes required.
 */
export * from "./constants";
export * from "./format";
export * from "./clipboard";
export * from "./vat";
export * from "./conversion";
