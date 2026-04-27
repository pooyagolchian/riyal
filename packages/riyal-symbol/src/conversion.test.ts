import { describe, expect, it } from "vitest";
import { _clearRateCache, convertFromSAR, convertToSAR, fetchExchangeRates } from "./conversion";

function makeFetcher(rates: Record<string, number>) {
	return async () =>
		({
			ok: true,
			status: 200,
			json: async () => ({ rates }),
		}) as Response;
}

describe("conversion", () => {
	it("fetchExchangeRates returns rates from the upstream payload", async () => {
		_clearRateCache();
		const rates = await fetchExchangeRates({ fetcher: makeFetcher({ USD: 0.27, EUR: 0.25 }) });
		expect(rates.USD).toBe(0.27);
	});

	it("convertFromSAR multiplies by the target rate", async () => {
		const out = await convertFromSAR(100, "USD", { rate: 0.27 });
		expect(out).toBe(27);
	});

	it("convertToSAR divides by the source rate", async () => {
		const out = await convertToSAR(27, "USD", { rate: 0.27 });
		expect(out).toBe(100);
	});

	it("rejects unknown currencies", async () => {
		_clearRateCache();
		await expect(
			convertFromSAR(100, "ZZZ", { fetcher: makeFetcher({ USD: 0.27 }) }),
		).rejects.toThrow(/no exchange rate/);
	});
});
