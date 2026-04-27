/**
 * `next/font/local` integration for the bundled Riyal font.
 *
 *   import { riyalFont } from "@pooyagolchian/riyal/next";
 *   <html className={riyalFont.variable}>...</html>
 *
 * Note: the actual font binaries are produced by `pnpm build:fonts`. Until
 * that pipeline runs, the file paths below resolve to empty placeholders so
 * `next dev` does not crash, but glyphs will not render.
 */
import localFont from "next/font/local";

export const riyalFont = localFont({
	src: [
		{ path: "../../fonts/riyal-regular.woff2", weight: "400", style: "normal" },
		{ path: "../../fonts/riyal-medium.woff2", weight: "500", style: "normal" },
		{ path: "../../fonts/riyal-semibold.woff2", weight: "600", style: "normal" },
		{ path: "../../fonts/riyal-bold.woff2", weight: "700", style: "normal" },
	],
	variable: "--font-riyal",
	display: "swap",
	fallback: ["system-ui", "sans-serif"],
});

export const riyalFontConfig = {
	variable: "--font-riyal",
	className: "font-riyal",
} as const;
