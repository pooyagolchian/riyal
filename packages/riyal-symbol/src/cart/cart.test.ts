import { describe, expect, it } from "vitest";
import { cartTotal, formatLineItem, lineItem } from "./index";

describe("lineItem", () => {
	it("computes net + vat + gross from a net unit price", () => {
		const li = lineItem({ unit: 100, qty: 2 });
		expect(li.net).toBe(200);
		expect(li.vat).toBe(30);
		expect(li.gross).toBe(230);
		expect(li.vatRate).toBe(0.15);
	});

	it("treats unit as VAT-inclusive when vatIncluded=true", () => {
		const li = lineItem({ unit: 115, qty: 1, vatIncluded: true });
		expect(li.gross).toBe(115);
		expect(li.net).toBe(100);
		expect(li.vat).toBe(15);
	});

	it("applies a per-line discount to the net path", () => {
		const li = lineItem({ unit: 100, qty: 2, discount: 50 });
		expect(li.net).toBe(150);
		expect(li.vat).toBeCloseTo(22.5, 2);
		expect(li.gross).toBeCloseTo(172.5, 2);
	});

	it("applies a per-line discount on the gross path", () => {
		const li = lineItem({ unit: 115, qty: 2, vatIncluded: true, discount: 30 });
		expect(li.gross).toBe(200);
		expect(li.net).toBeCloseTo(173.91, 2);
		expect(li.vat).toBeCloseTo(26.09, 2);
	});

	it("never produces a negative line", () => {
		const li = lineItem({ unit: 50, qty: 1, discount: 999 });
		expect(li.net).toBe(0);
		expect(li.gross).toBe(0);
		expect(li.vat).toBe(0);
	});

	it("respects an override VAT rate (UAE 5%)", () => {
		const li = lineItem({ unit: 100, qty: 1 }, { vatRate: 0.05 });
		expect(li.net).toBe(100);
		expect(li.vat).toBe(5);
		expect(li.gross).toBe(105);
	});
});

describe("cartTotal", () => {
	const items = [lineItem({ id: "a", unit: 100, qty: 2 }), lineItem({ id: "b", unit: 50, qty: 3 })];

	it("sums net, vat, and gross across lines", () => {
		const t = cartTotal(items);
		expect(t.subtotal).toBe(350);
		expect(t.vatSubtotal).toBe(52.5);
		expect(t.netTotal).toBe(350);
		expect(t.vat).toBe(52.5);
		expect(t.total).toBe(402.5);
		expect(t.itemCount).toBe(5);
	});

	it("applies a cart-level discount proportionally to net + vat", () => {
		const t = cartTotal(items, { discount: 80.5 });
		expect(t.discount).toBe(80.5);
		// 80.5 / 402.5 = 20% off; net 350 → 280, vat 52.5 → 42
		expect(t.netTotal).toBeCloseTo(280, 2);
		expect(t.vat).toBeCloseTo(42, 2);
		expect(t.total).toBeCloseTo(322, 2);
	});

	it("caps discount at the gross subtotal", () => {
		const t = cartTotal(items, { discount: 9999 });
		expect(t.discount).toBe(402.5);
		expect(t.netTotal).toBe(0);
		expect(t.vat).toBe(0);
		expect(t.total).toBe(0);
	});

	it("adds shipping with VAT on top by default", () => {
		const t = cartTotal(items, { shipping: 20 });
		expect(t.shipping).toBe(20);
		// shipping VAT 3, total = 350 + 52.5 + 20 + 3
		expect(t.vat).toBe(55.5);
		expect(t.total).toBe(425.5);
	});

	it("treats shipping as VAT-inclusive when shippingIncludesVat=true", () => {
		const t = cartTotal(items, { shipping: 23, shippingIncludesVat: true });
		expect(t.shipping).toBe(20);
		expect(t.vat).toBe(55.5);
		expect(t.total).toBe(425.5);
	});

	it("returns zeros for an empty cart", () => {
		const t = cartTotal([]);
		expect(t.subtotal).toBe(0);
		expect(t.total).toBe(0);
		expect(t.itemCount).toBe(0);
	});
});

describe("formatLineItem", () => {
	it("renders every numeric field through formatRiyal", () => {
		const li = lineItem({ name: "Coffee", unit: 25, qty: 4 });
		const f = formatLineItem(li);
		expect(f.name).toBe("Coffee");
		expect(f.qty).toBe("4");
		expect(f.unit).toContain("25");
		expect(f.gross).toMatch(/115/);
	});

	it("forwards format options (e.g. ar-SA)", () => {
		const li = lineItem({ unit: 1234.5, qty: 1 });
		const f = formatLineItem(li, { format: { locale: "ar-SA" } });
		expect(f.gross).toMatch(/[٠-٩]/);
	});
});
