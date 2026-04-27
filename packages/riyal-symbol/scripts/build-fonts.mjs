#!/usr/bin/env node
/**
 * Font build pipeline (placeholder).
 *
 * Converts the master `riyal.svg` glyph (sourced from SAMA — Saudi Central Bank
 * official asset release, Feb 2025) into WOFF2 / WOFF / TTF font files mapped
 * to U+20C1 (SAUDI RIYAL SIGN). Intended to be run with FontForge or
 * `opentype.js` + `wawoff2` available on PATH.
 *
 * Today this script only prints what it WOULD do so the build does not fail
 * when run in CI without the toolchain. Replace with a real implementation
 * once the SAMA glyph is committed to the repo.
 */
const weights = [
	"thin",
	"extralight",
	"light",
	"regular",
	"medium",
	"semibold",
	"bold",
	"extrabold",
	"black",
];
const variants = ["sans", "serif", "mono", "arabic"];

console.log("[riyal] build-fonts: pipeline placeholder.");
console.log("[riyal] would emit weights:", weights.join(", "));
console.log("[riyal] would emit variants:", variants.join(", "));
console.log("[riyal] target codepoint: U+20C1 (SAUDI RIYAL SIGN)");
console.log("[riyal] source glyph: <repo-root>/riyal.svg");
