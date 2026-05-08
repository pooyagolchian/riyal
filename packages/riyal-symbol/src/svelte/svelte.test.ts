import { fireEvent, render } from "@testing-library/svelte";
import { describe, expect, it } from "vitest";
import { RIYAL_SYMBOL_TEXT } from "../constants";
import RiyalIcon from "./RiyalIcon.svelte";
import RiyalInput from "./RiyalInput.svelte";
import RiyalPrice from "./RiyalPrice.svelte";
import RiyalSymbol from "./RiyalSymbol.svelte";

describe("Svelte · RiyalSymbol", () => {
	it("renders the U+20C1 glyph", () => {
		const { container, getByRole } = render(RiyalSymbol);
		expect(getByRole("img", { name: /saudi riyal/i })).toBeTruthy();
		expect(container.textContent).toContain(RIYAL_SYMBOL_TEXT);
	});

	it("applies size and color", () => {
		const { container } = render(RiyalSymbol, { props: { size: 32, color: "#f00" } });
		const span = container.querySelector(".riyal-symbol") as HTMLElement;
		expect(span.style.width).toBe("32px");
		expect(span.style.height).toBe("32px");
		expect(span.style.color.toLowerCase()).toMatch(/#f00|rgb\(255, 0, 0\)/);
	});
});

describe("Svelte · RiyalIcon", () => {
	it("renders an SVG with title", () => {
		const { container } = render(RiyalIcon, { props: { title: "Riyal" } });
		const svg = container.querySelector("svg");
		expect(svg).toBeTruthy();
		expect(svg?.querySelector("title")?.textContent).toBe("Riyal");
	});
});

describe("Svelte · RiyalPrice", () => {
	it("formats a number with the symbol", () => {
		const { container } = render(RiyalPrice, { props: { amount: 1234.5 } });
		const text = container.textContent ?? "";
		expect(text).toContain(RIYAL_SYMBOL_TEXT);
		expect(text).toMatch(/1[,٬]?234/);
	});

	it("respects useCode", () => {
		const { container } = render(RiyalPrice, { props: { amount: 100, useCode: true } });
		expect(container.textContent).toContain("SAR");
	});
});

describe("Svelte · RiyalInput", () => {
	it("emits a numeric value via onValueChange", async () => {
		const calls: number[] = [];
		const { container } = render(RiyalInput, {
			props: {
				value: "" as const,
				onValueChange: (v: number) => {
					calls.push(v);
				},
			},
		});
		const input = container.querySelector("input") as HTMLInputElement;
		await fireEvent.input(input, { target: { value: "250.5" } });
		expect(calls).toContain(250.5);
	});

	it("masks pasted 'SAR 2,499.99' when mask=true", async () => {
		const calls: number[] = [];
		const { container } = render(RiyalInput, {
			props: {
				value: "" as const,
				mask: true,
				onValueChange: (v: number) => {
					calls.push(v);
				},
			},
		});
		const input = container.querySelector("input") as HTMLInputElement;
		await fireEvent.input(input, { target: { value: "SAR 2,499.99" } });
		expect(input.value).toBe("2,499.99");
		expect(calls.at(-1)).toBe(2499.99);
	});

	it("normalises Arabic digits when mask=true", async () => {
		const { container } = render(RiyalInput, {
			props: { value: "" as const, mask: true },
		});
		const input = container.querySelector("input") as HTMLInputElement;
		await fireEvent.input(input, { target: { value: "٢٤٩٩٫٩٩" } });
		expect(input.value).toBe("2,499.99");
	});
});
