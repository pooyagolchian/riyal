import {
	type PropType,
	type Ref,
	computed,
	defineComponent,
	h,
	nextTick,
	onBeforeUnmount,
	onMounted,
	ref,
	watch,
} from "vue";
import { RIYAL_DEFAULT_LOCALE, RIYAL_SYMBOL_TEXT } from "../constants";
import { convertFromSAR, fetchExchangeRates } from "../conversion";
import { type FormatRiyalOptions, formatRiyal } from "../format";
import { maskRiyal } from "../mask";

export const RIYAL_GLYPH_VIEWBOX = "0 0 1124.14 1256.39";

const GLYPH_PATH_1 =
	"M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z";
const GLYPH_PATH_2 =
	"M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z";

function renderGlyphSvg(extraAttrs: Record<string, unknown> = {}) {
	return h(
		"svg",
		{
			xmlns: "http://www.w3.org/2000/svg",
			viewBox: RIYAL_GLYPH_VIEWBOX,
			fill: "currentColor",
			"aria-hidden": "true",
			focusable: "false",
			...extraAttrs,
		},
		[h("path", { d: GLYPH_PATH_1 }), h("path", { d: GLYPH_PATH_2 })],
	);
}

/** Saudi Riyal symbol — inline SVG, font-independent. */
export const RiyalSymbol = defineComponent({
	name: "RiyalSymbol",
	props: {
		size: { type: [Number, String] as PropType<number | string>, default: "1em" },
		color: { type: String, default: undefined },
	},
	setup(props, { attrs }) {
		const dim = computed(() => (typeof props.size === "number" ? `${props.size}px` : props.size));
		return () =>
			h(
				"span",
				{
					"aria-label": "Saudi Riyal",
					role: "img",
					class: "riyal-symbol",
					style: {
						display: "inline-flex",
						alignItems: "center",
						justifyContent: "center",
						width: dim.value,
						height: dim.value,
						color: props.color,
						lineHeight: 1,
						verticalAlign: "-0.125em",
					},
					...attrs,
				},
				[
					renderGlyphSvg({ width: "100%", height: "100%" }),
					h(
						"span",
						{
							style: {
								position: "absolute",
								width: "1px",
								height: "1px",
								overflow: "hidden",
								clip: "rect(0 0 0 0)",
							},
						},
						RIYAL_SYMBOL_TEXT,
					),
				],
			);
	},
});

/** Standalone SVG icon variant. */
export const RiyalIcon = defineComponent({
	name: "RiyalIcon",
	props: {
		size: { type: [Number, String] as PropType<number | string>, default: 24 },
		title: { type: String, default: "Saudi Riyal" },
	},
	setup(props, { attrs }) {
		return () =>
			h(
				"svg",
				{
					xmlns: "http://www.w3.org/2000/svg",
					viewBox: RIYAL_GLYPH_VIEWBOX,
					width: props.size,
					height: props.size,
					fill: "currentColor",
					role: "img",
					"aria-label": props.title,
					...attrs,
				},
				[
					h("title", null, props.title),
					h("path", { d: GLYPH_PATH_1 }),
					h("path", { d: GLYPH_PATH_2 }),
				],
			);
	},
});

const formatOptionProps = {
	locale: { type: String, default: undefined },
	decimals: { type: Number, default: undefined },
	useCode: { type: Boolean, default: undefined },
	notation: { type: String as PropType<"standard" | "compact">, default: undefined },
	currency: { type: String, default: undefined },
} as const;

function buildFormatOptions(props: {
	locale?: string;
	decimals?: number;
	useCode?: boolean;
	notation?: "standard" | "compact";
	currency?: string;
}): FormatRiyalOptions {
	const out: FormatRiyalOptions = {};
	if (props.locale !== undefined) out.locale = props.locale;
	if (props.decimals !== undefined) out.decimals = props.decimals;
	if (props.useCode !== undefined) out.useCode = props.useCode;
	if (props.notation !== undefined) out.notation = props.notation;
	if (props.currency !== undefined) out.currency = props.currency;
	return out;
}

/** Formatted Riyal price block. */
export const RiyalPrice = defineComponent({
	name: "RiyalPrice",
	props: {
		amount: { type: Number, required: true },
		...formatOptionProps,
	},
	setup(props, { attrs }) {
		const text = computed(() => formatRiyal(props.amount, buildFormatOptions(props)));
		const isRtl = computed(() =>
			(props.locale ?? RIYAL_DEFAULT_LOCALE).toLowerCase().startsWith("ar"),
		);
		return () => {
			const parts = text.value.split(RIYAL_SYMBOL_TEXT);
			const children: ReturnType<typeof h>[] = [];
			parts.forEach((part, i) => {
				if (i > 0) {
					children.push(
						h(RiyalSymbol, {
							key: `s-${i}`,
							size: "0.9em",
							style: {
								margin: isRtl.value ? "0 0 0 0.15em" : "0 0.15em 0 0",
							},
						}),
					);
				}
				if (part) children.push(h("span", { key: `t-${i}` }, part));
			});
			return h(
				"span",
				{
					class: "riyal-price",
					style: { display: "inline-flex", alignItems: "baseline", gap: 0 },
					...attrs,
				},
				children,
			);
		};
	},
});

/** Animated counter that tweens between amount changes via `requestAnimationFrame`. */
export const AnimatedRiyalPrice = defineComponent({
	name: "AnimatedRiyalPrice",
	props: {
		amount: { type: Number, required: true },
		durationMs: { type: Number, default: 600 },
		...formatOptionProps,
	},
	setup(props, { attrs }) {
		const display = ref(props.amount);
		let raf = 0;
		let from = props.amount;

		const animate = (to: number) => {
			if (typeof window === "undefined") {
				display.value = to;
				return;
			}
			const start = performance.now();
			const step = (now: number) => {
				const t = Math.min(1, (now - start) / props.durationMs);
				const eased = 1 - (1 - t) ** 3;
				display.value = from + (to - from) * eased;
				if (t < 1) raf = window.requestAnimationFrame(step);
				else from = to;
			};
			raf = window.requestAnimationFrame(step);
		};

		watch(
			() => props.amount,
			(next) => {
				if (typeof window !== "undefined") window.cancelAnimationFrame(raf);
				animate(next);
			},
		);

		onBeforeUnmount(() => {
			if (typeof window !== "undefined") window.cancelAnimationFrame(raf);
		});

		return () =>
			h(RiyalPrice, {
				amount: display.value,
				locale: props.locale,
				decimals: props.decimals,
				useCode: props.useCode,
				notation: props.notation,
				currency: props.currency,
				...attrs,
			});
	},
});

/** Numeric input with Riyal symbol prefix. Pass `mask` to enable masked editing. */
export const RiyalInput = defineComponent({
	name: "RiyalInput",
	props: {
		modelValue: { type: [Number, String] as PropType<number | "">, default: "" },
		locale: { type: String, default: RIYAL_DEFAULT_LOCALE },
		decimals: { type: Number, default: 2 },
		placeholder: { type: String, default: undefined },
		mask: { type: Boolean, default: false },
		allowNegative: { type: Boolean, default: false },
	},
	emits: {
		"update:modelValue": (_value: number) => true,
		change: (_value: number) => true,
	},
	setup(props, { emit, attrs }) {
		const isRtl = computed(() => props.locale.toLowerCase().startsWith("ar"));
		const inputRef = ref<HTMLInputElement | null>(null);

		const initialDisplay =
			props.modelValue === "" || !Number.isFinite(props.modelValue as number)
				? ""
				: maskRiyal(String(props.modelValue), undefined, {
						decimals: props.decimals,
						allowNegative: props.allowNegative,
					}).display;
		const display = ref(initialDisplay);

		watch(
			() => [props.modelValue, props.decimals, props.allowNegative] as const,
			([v]) => {
				if (!props.mask) return;
				if (v === "" || !Number.isFinite(v as number)) {
					display.value = "";
					return;
				}
				const formatted = maskRiyal(String(v), undefined, {
					decimals: props.decimals,
					allowNegative: props.allowNegative,
				}).display;
				if (display.value !== formatted) display.value = formatted;
			},
		);

		return () => {
			const wrapperStyle = {
				display: "inline-flex",
				alignItems: "center",
				gap: "0.25rem",
				direction: isRtl.value ? "rtl" : "ltr",
			};

			if (!props.mask) {
				return h("span", { class: "riyal-input", style: wrapperStyle }, [
					h(RiyalSymbol),
					h("input", {
						type: "number",
						step: 1 / 10 ** props.decimals,
						value: props.modelValue,
						placeholder: props.placeholder,
						onInput: (e: Event) => {
							const v = Number.parseFloat((e.target as HTMLInputElement).value);
							emit("update:modelValue", v);
							emit("change", v);
						},
						...attrs,
					}),
				]);
			}

			return h("span", { class: "riyal-input", style: wrapperStyle }, [
				h(RiyalSymbol),
				h("input", {
					ref: inputRef,
					type: "text",
					inputmode: "decimal",
					autocomplete: "off",
					dir: isRtl.value ? "rtl" : "ltr",
					value: display.value,
					placeholder: props.placeholder,
					onInput: (e: Event) => {
						const target = e.target as HTMLInputElement;
						const raw = target.value;
						const caretAt = target.selectionStart ?? raw.length;
						const result = maskRiyal(raw, caretAt, {
							decimals: props.decimals,
							allowNegative: props.allowNegative,
						});
						display.value = result.display;
						emit("update:modelValue", result.value);
						emit("change", result.value);
						void nextTick(() => {
							const el = inputRef.value;
							if (el) el.setSelectionRange(result.caret, result.caret);
						});
					},
					...attrs,
				}),
			]);
		};
	},
});

export interface UseRiyalRateResult {
	rate: Ref<number | null>;
	loading: Ref<boolean>;
	error: Ref<Error | null>;
	refresh: () => void;
}

/** Vue composable that fetches and caches a SAR→target exchange rate. */
export function useRiyalRate(targetCurrency: string): UseRiyalRateResult {
	const rate = ref<number | null>(null);
	const loading = ref(false);
	const error = ref<Error | null>(null);

	const load = async () => {
		loading.value = true;
		try {
			const rates = await fetchExchangeRates();
			const r = rates[targetCurrency.toUpperCase()];
			rate.value = typeof r === "number" ? r : null;
			error.value = null;
		} catch (e) {
			error.value = e instanceof Error ? e : new Error(String(e));
		} finally {
			loading.value = false;
		}
	};

	onMounted(() => {
		void load();
	});

	return {
		rate,
		loading,
		error,
		refresh: () => {
			void load();
		},
	};
}

export { convertFromSAR };
