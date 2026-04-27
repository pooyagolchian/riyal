import { RIYAL_RTL_LOCALE, RIYAL_SYMBOL_TEXT } from "../constants";
import { type FormatRiyalOptions, formatRiyal } from "../format";

/**
 * Official SAMA Saudi Riyal glyph (public domain).
 * Source: https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg
 */
const SAMA_VIEWBOX = "0 0 1124.14 1256.39";
const SAMA_VIEW_WIDTH = 1124.14;
const SAMA_VIEW_HEIGHT = 1256.39;
const SAMA_PATH_1 =
	"M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z";
const SAMA_PATH_2 =
	"M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z";

export interface RiyalPriceCardOptions extends FormatRiyalOptions {
	amount: number;
	title?: string;
	subtitle?: string;
	width?: number;
	height?: number;
	background?: string;
	color?: string;
	accent?: string;
}

/** Build a Satori-compatible inline SVG node for the SAMA Riyal glyph. */
function buildSamaSymbolNode(size: number, fill: string): unknown {
	return {
		type: "svg",
		props: {
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: SAMA_VIEWBOX,
			width: size,
			height: size * (SAMA_VIEW_HEIGHT / SAMA_VIEW_WIDTH),
			fill,
			children: [
				{ type: "path", props: { d: SAMA_PATH_1 } },
				{ type: "path", props: { d: SAMA_PATH_2 } },
			],
		},
	};
}

/** JSX-compatible (Vercel `@vercel/og` / Next.js OG image route) component. */
export function RiyalPriceCard(options: RiyalPriceCardOptions): unknown {
	const {
		amount,
		title = "",
		subtitle = "",
		width = 1200,
		height = 630,
		background = "#0F172A",
		color = "#FFFFFF",
		accent = "#22D3EE",
		...formatOpts
	} = options;
	const isRtl = (formatOpts.locale ?? "").toLowerCase().startsWith("ar");
	const text = formatRiyal(amount, formatOpts);
	// Per SAMA guidelines: symbol always left of the number, with a space.
	const numericText = text.split(RIYAL_SYMBOL_TEXT).join("").trim();
	const priceFontSize = 160;
	const symbolSize = Math.round(priceFontSize * 0.78);

	return {
		type: "div",
		props: {
			style: {
				width,
				height,
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				background,
				color,
				fontFamily: "Riyal, system-ui, sans-serif",
				direction: isRtl ? "rtl" : "ltr",
				gap: 24,
			},
			children: [
				title && {
					type: "div",
					props: { style: { fontSize: 48, opacity: 0.8 }, children: title },
				},
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							gap: 24,
							fontSize: priceFontSize,
							fontWeight: 700,
							color: accent,
						},
						children: [
							buildSamaSymbolNode(symbolSize, accent),
							{ type: "span", props: { children: numericText } },
						],
					},
				},
				subtitle && {
					type: "div",
					props: { style: { fontSize: 32, opacity: 0.6 }, children: subtitle },
				},
			].filter(Boolean),
		},
	};
}

/** Pure-string SVG generator for environments without a JSX runtime. */
export function generatePriceCardSVG(options: RiyalPriceCardOptions): string {
	const {
		amount,
		title = "",
		subtitle = "",
		width = 1200,
		height = 630,
		background = "#0F172A",
		color = "#FFFFFF",
		accent = "#22D3EE",
		...formatOpts
	} = options;
	const locale = formatOpts.locale ?? RIYAL_RTL_LOCALE;
	const isRtl = locale.toLowerCase().startsWith("ar");
	const text = formatRiyal(amount, formatOpts);
	const numericText = text.split(RIYAL_SYMBOL_TEXT).join("").trim();

	const cx = width / 2;
	const titleY = height / 2 - 140;
	const priceY = height / 2 + 40;
	const subtitleY = height / 2 + 140;
	const priceFontSize = 160;
	const glyphHeight = Math.round(priceFontSize * 0.85);
	const glyphWidth = Math.round(glyphHeight * (SAMA_VIEW_WIDTH / SAMA_VIEW_HEIGHT));
	// Approximate numeric text width — monospace-ish factor for OG layouts.
	const approxNumericWidth = numericText.length * priceFontSize * 0.55;
	const gap = 24;
	const totalWidth = glyphWidth + gap + approxNumericWidth;
	const groupX = cx - totalWidth / 2;
	// Per SAMA: symbol always left of number, regardless of locale.
	const glyphX = groupX;
	const numericX = groupX + glyphWidth + gap;
	const glyphY = priceY - glyphHeight + priceFontSize * 0.18;
	const glyphScale = glyphHeight / SAMA_VIEW_HEIGHT;

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
	<rect width="100%" height="100%" fill="${background}"/>
	${title ? `<text x="${cx}" y="${titleY}" fill="${color}" font-size="48" text-anchor="middle" opacity="0.8" font-family="Riyal, system-ui, sans-serif" direction="${isRtl ? "rtl" : "ltr"}">${escapeXml(title)}</text>` : ""}
	<g transform="translate(${glyphX} ${glyphY}) scale(${glyphScale})" fill="${accent}" aria-label="Saudi Riyal"><path d="${SAMA_PATH_1}"/><path d="${SAMA_PATH_2}"/></g>
	<text x="${numericX}" y="${priceY}" fill="${accent}" font-size="${priceFontSize}" font-weight="700" text-anchor="start" font-family="Riyal, system-ui, sans-serif" direction="${isRtl ? "rtl" : "ltr"}">${escapeXml(numericText)}</text>
	${subtitle ? `<text x="${cx}" y="${subtitleY}" fill="${color}" font-size="32" text-anchor="middle" opacity="0.6" font-family="Riyal, system-ui, sans-serif" direction="${isRtl ? "rtl" : "ltr"}">${escapeXml(subtitle)}</text>` : ""}
</svg>`;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export const RIYAL_OG_SYMBOL = RIYAL_SYMBOL_TEXT;
