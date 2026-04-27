import { RIYAL_CURRENCY_CODE } from "./constants";

export interface ExchangeRateMap {
	[currencyCode: string]: number;
}

export interface FetchRatesOptions {
	/** Override the upstream URL. Defaults to a free API base scoped to SAR. */
	baseUrl?: string;
	/** Custom fetcher (useful for tests / non-browser runtimes). */
	fetcher?: typeof fetch;
	/** Cache TTL in milliseconds. Defaults to 1 hour. */
	cacheTtlMs?: number;
}

interface CacheEntry {
	rates: ExchangeRateMap;
	expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

const DEFAULT_BASE_URL = "https://open.er-api.com/v6/latest";
const DEFAULT_TTL_MS = 60 * 60 * 1000;

/**
 * Fetch live exchange rates with SAR as the base currency. Results are cached
 * in-memory for `cacheTtlMs` (default 1 hour).
 */
export async function fetchExchangeRates(
	options: FetchRatesOptions = {},
): Promise<ExchangeRateMap> {
	const {
		baseUrl = DEFAULT_BASE_URL,
		fetcher = typeof fetch !== "undefined" ? fetch : undefined,
		cacheTtlMs = DEFAULT_TTL_MS,
	} = options;

	if (!fetcher) {
		throw new Error(
			"riyal: no global fetch is available. Pass `options.fetcher` explicitly.",
		);
	}

	const cacheKey = `${baseUrl}/${RIYAL_CURRENCY_CODE}`;
	const cached = cache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) {
		return cached.rates;
	}

	const url = `${baseUrl.replace(/\/$/, "")}/${RIYAL_CURRENCY_CODE}`;
	const res = await fetcher(url);
	if (!res.ok) {
		throw new Error(`riyal: exchange rate request failed (HTTP ${res.status})`);
	}
	const json = (await res.json()) as { rates?: ExchangeRateMap };
	const rates = json.rates ?? {};

	cache.set(cacheKey, { rates, expiresAt: Date.now() + cacheTtlMs });
	return rates;
}

/** Internal: clear the rate cache (exposed for tests). */
export function _clearRateCache(): void {
	cache.clear();
}

export interface ConvertOptions extends FetchRatesOptions {
	/** Inject a known rate to skip the network round-trip. */
	rate?: number;
	/** Decimal places for the result. Defaults to `4`. */
	decimals?: number;
}

function round(value: number, decimals: number): number {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
}

/** Convert an amount in SAR to another currency. */
export async function convertFromSAR(
	amountInSar: number,
	targetCurrency: string,
	options: ConvertOptions = {},
): Promise<number> {
	const { rate, decimals = 4, ...rest } = options;
	const code = targetCurrency.toUpperCase();
	const r = rate ?? (await fetchExchangeRates(rest))[code];
	if (typeof r !== "number") {
		throw new Error(`riyal: no exchange rate available for ${code}`);
	}
	return round(amountInSar * r, decimals);
}

/** Convert an amount denominated in another currency back to SAR. */
export async function convertToSAR(
	amount: number,
	sourceCurrency: string,
	options: ConvertOptions = {},
): Promise<number> {
	const { rate, decimals = 4, ...rest } = options;
	const code = sourceCurrency.toUpperCase();
	const r = rate ?? (await fetchExchangeRates(rest))[code];
	if (typeof r !== "number" || r === 0) {
		throw new Error(`riyal: no exchange rate available for ${code}`);
	}
	return round(amount / r, decimals);
}
