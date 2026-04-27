import { describe, expect, it } from "vitest";
import {
	RIYAL_CODEPOINT,
	RIYAL_CURRENCY_CODE,
	RIYAL_HTML_ENTITY,
	RIYAL_UNICODE,
} from "./constants";

describe("constants", () => {
	it("exposes U+20C1 as the Riyal symbol", () => {
		expect(RIYAL_CODEPOINT).toBe(0x20c1);
		expect(RIYAL_UNICODE.codePointAt(0)).toBe(0x20c1);
		expect(RIYAL_HTML_ENTITY).toBe("&#x20C1;");
	});

	it("uses ISO 4217 SAR for the currency code", () => {
		expect(RIYAL_CURRENCY_CODE).toBe("SAR");
	});
});
