import { describe, expect, it } from "vitest";
import { SAUDI_VAT_RATE, addVAT, getVAT, removeVAT } from "./vat";

describe("VAT helpers", () => {
	it("uses the 15% Saudi rate by default", () => {
		expect(SAUDI_VAT_RATE).toBe(0.15);
	});

	it("addVAT computes a gross amount", () => {
		expect(addVAT(100)).toBe(115);
	});

	it("removeVAT computes a net amount", () => {
		expect(removeVAT(115)).toBe(100);
	});

	it("getVAT returns the tax portion", () => {
		expect(getVAT(100)).toBe(15);
	});

	it("supports custom rates", () => {
		expect(addVAT(100, { rate: 0.05 })).toBe(105);
	});
});
