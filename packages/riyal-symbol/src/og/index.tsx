import { RIYAL_RTL_LOCALE, RIYAL_SYMBOL_TEXT } from "../constants";
import { type FormatRiyalOptions, formatRiyal } from "../format";

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
						style: { fontSize: 160, fontWeight: 700, color: accent },
						children: text,
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

	const anchor = "middle";
	const cx = width / 2;

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
	<rect width="100%" height="100%" fill="${background}"/>
	${title ? `<text x="${cx}" y="${height / 2 - 140}" fill="${color}" font-size="48" text-anchor="${anchor}" opacity="0.8" font-family="Riyal, system-ui, sans-serif" direction="${isRtl ? "rtl" : "ltr"}">${escapeXml(title)}</text>` : ""}
	<text x="${cx}" y="${height / 2 + 40}" fill="${accent}" font-size="160" font-weight="700" text-anchor="${anchor}" font-family="Riyal, system-ui, sans-serif" direction="${isRtl ? "rtl" : "ltr"}">${escapeXml(text)}</text>
	${subtitle ? `<text x="${cx}" y="${height / 2 + 140}" fill="${color}" font-size="32" text-anchor="${anchor}" opacity="0.6" font-family="Riyal, system-ui, sans-serif" direction="${isRtl ? "rtl" : "ltr"}">${escapeXml(subtitle)}</text>` : ""}
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
