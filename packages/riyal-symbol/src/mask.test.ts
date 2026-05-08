import { describe, expect, it } from "vitest";
import { cleanRiyalString, maskRiyal, normalizeRiyalDigits } from "./mask";

describe("normalizeRiyalDigits", () => {
	it("converts Arabic-Indic digits to ASCII", () => {
		expect(normalizeRiyalDigits("٢٤٩٩٫٩٩")).toBe("2499٫99");
	});

	it("converts Persian-Indic digits to ASCII", () => {
		expect(normalizeRiyalDigits("۲۴۹۹")).toBe("2499");
	});

	it("leaves ASCII digits unchanged", () => {
		expect(normalizeRiyalDigits("1,234.50")).toBe("1,234.50");
	});
});

describe("cleanRiyalString", () => {
	it("strips the symbol, code, and Arabic abbreviation", () => {
		expect(cleanRiyalString("⃁ 1,234")).toBe("1,234");
		expect(cleanRiyalString("SAR 1,234")).toBe("1,234");
		expect(cleanRiyalString("1,234 ر.س")).toBe("1,234");
	});

	it("strips RTL marks and whitespace", () => {
		expect(cleanRiyalString("‏1,234‎")).toBe("1,234");
	});
});

describe("maskRiyal", () => {
	it("formats a clean number with grouping", () => {
		const r = maskRiyal("12345");
		expect(r.value).toBe(12345);
		expect(r.display).toBe("12,345");
		expect(r.caret).toBe(6);
	});

	it("handles a paste of '⃁ 2,499.99'", () => {
		const r = maskRiyal("⃁ 2,499.99");
		expect(r.value).toBe(2499.99);
		expect(r.display).toBe("2,499.99");
	});

	it("handles a paste of 'SAR 2,499.99'", () => {
		const r = maskRiyal("SAR 2,499.99");
		expect(r.value).toBe(2499.99);
		expect(r.display).toBe("2,499.99");
	});

	it("handles a paste of Arabic digits with Arabic decimal mark", () => {
		const r = maskRiyal("٢٤٩٩٫٩٩");
		expect(r.value).toBe(2499.99);
		expect(r.display).toBe("2,499.99");
	});

	it("handles ر.س suffix", () => {
		const r = maskRiyal("99.90 ر.س");
		expect(r.value).toBe(99.9);
		expect(r.display).toBe("99.90");
	});

	it("truncates excess decimals", () => {
		const r = maskRiyal("1.23456", undefined, { decimals: 2 });
		expect(r.value).toBe(1.23);
		expect(r.display).toBe("1.23");
	});

	it("strips leading zeros", () => {
		const r = maskRiyal("00007");
		expect(r.display).toBe("7");
		expect(r.value).toBe(7);
	});

	it("preserves a partial decimal during typing", () => {
		const r = maskRiyal("12.");
		expect(r.display).toBe("12.");
		expect(Number.isNaN(r.value)).toBe(false);
	});

	it("returns NaN for empty input", () => {
		const r = maskRiyal("");
		expect(Number.isNaN(r.value)).toBe(true);
		expect(r.display).toBe("");
		expect(r.caret).toBe(0);
	});

	it("rejects negatives by default", () => {
		const r = maskRiyal("-100");
		expect(r.value).toBe(100);
		expect(r.display).toBe("100");
	});

	it("allows negatives when opted in", () => {
		const r = maskRiyal("-1234", undefined, { allowNegative: true });
		expect(r.value).toBe(-1234);
		expect(r.display).toBe("-1,234");
	});

	it("places caret after the inserted digit when typing", () => {
		// User typed '1234', caret was at end of raw input
		const r = maskRiyal("1234", 4);
		expect(r.display).toBe("1,234");
		expect(r.caret).toBe(5);
	});

	it("places caret correctly after backspace mid-string", () => {
		// User has '1,234' and cursor was after '3' (position 3 in raw '123')
		const r = maskRiyal("123", 3);
		expect(r.display).toBe("123");
		expect(r.caret).toBe(3);
	});
});
