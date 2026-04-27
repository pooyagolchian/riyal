import { describe, expect, it } from "vitest";
import { RIYAL_UNICODE } from "./constants";
import { formatRiyal, parseRiyal } from "./format";

describe("formatRiyal", () => {
	it("formats with the symbol by default", () => {
		const out = formatRiyal(1234.5);
		expect(out).toContain(RIYAL_UNICODE);
		expect(out).toMatch(/1[.,\s\u202F\u00A0]?234/);
	});

	it("uses the SAR code when useCode is true", () => {
		expect(formatRiyal(100, { useCode: true })).toMatch(/^SAR\s/);
	});

	it("places the symbol after the number for ar-SA", () => {
		const out = formatRiyal(50, { locale: "ar-SA" });
		expect(out.endsWith(RIYAL_UNICODE)).toBe(true);
	});

	it("supports compact notation", () => {
		const out = formatRiyal(1_500_000, { notation: "compact", decimals: 1 });
		expect(out).toMatch(/1\.5\s?M/);
	});
});

describe("parseRiyal", () => {
	it("round-trips with formatRiyal", () => {
		expect(parseRiyal(formatRiyal(1234.5))).toBeCloseTo(1234.5, 2);
	});

	it("parses Arabic digits", () => {
		expect(parseRiyal("١٬٢٣٤٫٥٠ \u20C1")).toBeCloseTo(1234.5, 2);
	});

	it("parses compact suffixes", () => {
		expect(parseRiyal("\u20C1 1.5M")).toBe(1_500_000);
		expect(parseRiyal("\u20C1 2K")).toBe(2_000);
	});
});
