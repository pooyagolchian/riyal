import * as React from "react";
import { RIYAL_DEFAULT_LOCALE, RIYAL_SYMBOL_TEXT } from "../constants";
import { convertFromSAR, fetchExchangeRates } from "../conversion";
import { type FormatRiyalOptions, formatRiyal } from "../format";

/**
 * Official SAMA (Saudi Central Bank) Saudi Riyal glyph paths, traced from the
 * public-domain master at
 * https://www.sama.gov.sa/ar-sa/Currency/Documents/Saudi_Riyal_Symbol-2.svg
 *
 * Drawn with `currentColor` so it inherits the surrounding text color. This is
 * used as a font-independent fallback so the symbol renders correctly even
 * when no system font ships U+20C1 (Unicode 17.0, Sept 2025).
 */
export const RIYAL_GLYPH_VIEWBOX = "0 0 1124.14 1256.39";
const RIYAL_GLYPH_PATHS = (
	<>
		<path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z" />
		<path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z" />
	</>
);

export type RiyalSymbolProps = React.HTMLAttributes<HTMLSpanElement> & {
	size?: number | string;
	color?: string;
};

/** Renders the Saudi Riyal symbol as an inline SVG glyph. */
export const RiyalSymbol: React.FC<RiyalSymbolProps> = ({
	size = "1em",
	color,
	style,
	className,
	...rest
}) => {
	const dim = typeof size === "number" ? `${size}px` : size;
	return (
		<span
			aria-label="Saudi Riyal"
			role="img"
			className={["riyal-symbol", className].filter(Boolean).join(" ")}
			style={{
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: dim,
				height: dim,
				color,
				lineHeight: 1,
				verticalAlign: "-0.125em",
				...style,
			}}
			{...rest}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox={RIYAL_GLYPH_VIEWBOX}
				width="100%"
				height="100%"
				fill="currentColor"
				aria-hidden="true"
				focusable="false"
			>
				{RIYAL_GLYPH_PATHS}
			</svg>
			<span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
				{RIYAL_SYMBOL_TEXT}
			</span>
		</span>
	);
};

export type RiyalIconProps = React.SVGAttributes<SVGSVGElement> & {
	size?: number | string;
	title?: string;
};

/** Inline SVG icon — same glyph as `RiyalSymbol`, with explicit `<title>`. */
export const RiyalIcon: React.FC<RiyalIconProps> = ({
	size = 24,
	title = "Saudi Riyal",
	...rest
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox={RIYAL_GLYPH_VIEWBOX}
			width={size}
			height={size}
			fill="currentColor"
			role="img"
			aria-label={title}
			{...rest}
		>
			<title>{title}</title>
			{RIYAL_GLYPH_PATHS}
		</svg>
	);
};

export type RiyalPriceProps = React.HTMLAttributes<HTMLSpanElement> &
	FormatRiyalOptions & {
		amount: number;
	};

/** Pre-formatted price block. */
export const RiyalPrice: React.FC<RiyalPriceProps> = ({
	amount,
	locale,
	decimals,
	useCode,
	notation,
	currency,
	className,
	...rest
}) => {
	const text = formatRiyal(amount, { locale, decimals, useCode, notation, currency });
	const isRtl = (locale ?? RIYAL_DEFAULT_LOCALE).toLowerCase().startsWith("ar");
	// Replace the U+20C1 text glyph with our inline SVG symbol so it renders
	// correctly without the bundled font.
	const parts = text.split(RIYAL_SYMBOL_TEXT);
	const nodes: React.ReactNode[] = [];
	parts.forEach((part, i) => {
		if (i > 0) {
			nodes.push(
				<RiyalSymbol
					key={`s${i}`}
					size="0.9em"
					style={{ margin: isRtl ? "0 0 0 0.15em" : "0 0.15em 0 0" }}
				/>,
			);
		}
		if (part) nodes.push(<React.Fragment key={`t${i}`}>{part}</React.Fragment>);
	});
	return (
		<span
			className={["riyal-price", className].filter(Boolean).join(" ")}
			style={{ display: "inline-flex", alignItems: "baseline", gap: 0 }}
			{...rest}
		>
			{nodes}
		</span>
	);
};

export type AnimatedRiyalPriceProps = RiyalPriceProps & {
	/** Animation duration in milliseconds. Defaults to 600ms. */
	durationMs?: number;
};

/** Animated counter that tweens between amount changes with `requestAnimationFrame`. */
export const AnimatedRiyalPrice: React.FC<AnimatedRiyalPriceProps> = ({
	amount,
	durationMs = 600,
	...rest
}) => {
	const [display, setDisplay] = React.useState(amount);
	const fromRef = React.useRef(amount);

	React.useEffect(() => {
		const from = fromRef.current;
		const to = amount;
		const start = performance.now();
		let raf = 0;
		const step = (now: number) => {
			const t = Math.min(1, (now - start) / durationMs);
			const eased = 1 - (1 - t) ** 3;
			setDisplay(from + (to - from) * eased);
			if (t < 1) raf = requestAnimationFrame(step);
			else fromRef.current = to;
		};
		raf = requestAnimationFrame(step);
		return () => cancelAnimationFrame(raf);
	}, [amount, durationMs]);

	return <RiyalPrice amount={display} {...rest} />;
};

export type RiyalInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"value" | "onChange" | "type"
> & {
	value: number | "";
	onValueChange: (value: number) => void;
	locale?: string;
	decimals?: number;
};

/** Numeric input with riyal symbol prefix. */
export const RiyalInput: React.FC<RiyalInputProps> = ({
	value,
	onValueChange,
	locale = RIYAL_DEFAULT_LOCALE,
	decimals = 2,
	className,
	...rest
}) => {
	const isRtl = locale.toLowerCase().startsWith("ar");
	return (
		<span
			className={["riyal-input", className].filter(Boolean).join(" ")}
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: "0.25rem",
				direction: isRtl ? "rtl" : "ltr",
			}}
		>
			<RiyalSymbol />
			<input
				type="number"
				step={1 / 10 ** decimals}
				value={value}
				onChange={(e) => onValueChange(Number.parseFloat(e.target.value))}
				{...rest}
			/>
		</span>
	);
};

export interface UseRiyalRateResult {
	rate: number | null;
	loading: boolean;
	error: Error | null;
	refresh: () => void;
}

/** React hook that fetches and caches a SAR→target exchange rate. */
export function useRiyalRate(targetCurrency: string): UseRiyalRateResult {
	const [rate, setRate] = React.useState<number | null>(null);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState<Error | null>(null);
	const [tick, setTick] = React.useState(0);

	React.useEffect(() => {
		let cancelled = false;
		setLoading(true);
		fetchExchangeRates()
			.then((rates) => {
				if (cancelled) return;
				const r = rates[targetCurrency.toUpperCase()];
				setRate(typeof r === "number" ? r : null);
				setError(null);
			})
			.catch((e: unknown) => {
				if (!cancelled) setError(e instanceof Error ? e : new Error(String(e)));
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [targetCurrency, tick]);

	return {
		rate,
		loading,
		error,
		refresh: () => setTick((n) => n + 1),
	};
}

export { convertFromSAR };
