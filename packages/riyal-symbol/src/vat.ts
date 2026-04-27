/** Standard Saudi Arabia VAT rate (15%, effective since 1 Jul 2020). */
export const SAUDI_VAT_RATE = 0.15;

export interface VATOptions {
	/** Override the rate (e.g. `0.05` for 5%). Defaults to `SAUDI_VAT_RATE`. */
	rate?: number;
	/** Decimal places for the result. Defaults to `2`. */
	decimals?: number;
}

function round(value: number, decimals: number): number {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
}

/** Add VAT to a net amount. */
export function addVAT(net: number, options: VATOptions = {}): number {
	const { rate = SAUDI_VAT_RATE, decimals = 2 } = options;
	return round(net * (1 + rate), decimals);
}

/** Remove VAT from a gross (VAT-inclusive) amount. */
export function removeVAT(gross: number, options: VATOptions = {}): number {
	const { rate = SAUDI_VAT_RATE, decimals = 2 } = options;
	return round(gross / (1 + rate), decimals);
}

/** Get the VAT portion of a net amount. */
export function getVAT(net: number, options: VATOptions = {}): number {
	const { rate = SAUDI_VAT_RATE, decimals = 2 } = options;
	return round(net * rate, decimals);
}
