import { fetchExchangeRates } from "../conversion";

export interface RiyalRateState {
	readonly rate: number | null;
	readonly loading: boolean;
	readonly error: Error | null;
	refresh(): void;
}

/**
 * Svelte 5 rune-based composable for SAR→target exchange rates.
 *
 * @example
 * ```svelte
 * <script lang="ts">
 *   import { useRiyalRate } from "riyal/svelte";
 *   const usd = useRiyalRate("USD");
 * </script>
 * {usd.loading ? "…" : usd.rate?.toFixed(4)}
 * ```
 */
export function useRiyalRate(targetCurrency: string): RiyalRateState {
	let rate = $state<number | null>(null);
	let loading = $state(false);
	let error = $state<Error | null>(null);

	async function load() {
		loading = true;
		try {
			const rates = await fetchExchangeRates();
			const r = rates[targetCurrency.toUpperCase()];
			rate = typeof r === "number" ? r : null;
			error = null;
		} catch (e) {
			error = e instanceof Error ? e : new Error(String(e));
		} finally {
			loading = false;
		}
	}

	void load();

	return {
		get rate() {
			return rate;
		},
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		refresh() {
			void load();
		},
	};
}
