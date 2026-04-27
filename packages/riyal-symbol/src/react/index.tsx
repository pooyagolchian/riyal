import * as React from "react";
import { RIYAL_DEFAULT_LOCALE, RIYAL_SYMBOL_TEXT } from "../constants";
import { convertFromSAR, fetchExchangeRates } from "../conversion";
import { type FormatRiyalOptions, formatRiyal } from "../format";

export type RiyalSymbolProps = React.HTMLAttributes<HTMLSpanElement> & {
	size?: number | string;
	color?: string;
};

/** Renders the Saudi Riyal symbol in the bundled web font. */
export const RiyalSymbol: React.FC<RiyalSymbolProps> = ({
	size,
	color,
	style,
	className,
	...rest
}) => {
	return (
		<span
			aria-label="Saudi Riyal"
			role="img"
			className={["riyal-symbol", className].filter(Boolean).join(" ")}
			style={{
				fontFamily: "'Riyal', 'Riyal Sans', system-ui, sans-serif",
				fontSize: typeof size === "number" ? `${size}px` : size,
				color,
				lineHeight: 1,
				...style,
			}}
			{...rest}
		>
			{RIYAL_SYMBOL_TEXT}
		</span>
	);
};

export type RiyalIconProps = React.SVGAttributes<SVGSVGElement> & {
	size?: number | string;
	title?: string;
};

/** Inline SVG fallback (resolution-independent). */
export const RiyalIcon: React.FC<RiyalIconProps> = ({
	size = 24,
	title = "Saudi Riyal",
	...rest
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			width={size}
			height={size}
			fill="currentColor"
			role="img"
			aria-label={title}
			{...rest}
		>
			<title>{title}</title>
			<text
				x="12"
				y="18"
				textAnchor="middle"
				fontSize="20"
				fontFamily="'Riyal', 'Riyal Sans', system-ui, sans-serif"
			>
				{RIYAL_SYMBOL_TEXT}
			</text>
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
	return (
		<span className={["riyal-price", className].filter(Boolean).join(" ")} {...rest}>
			{text}
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
