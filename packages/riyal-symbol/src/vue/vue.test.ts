import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { RIYAL_SYMBOL_TEXT } from "../constants";
import { RiyalIcon, RiyalInput, RiyalPrice, RiyalSymbol } from "./index";

describe("Vue · RiyalSymbol", () => {
	it("renders the U+20C1 glyph", () => {
		const wrapper = mount(RiyalSymbol);
		expect(wrapper.attributes("aria-label")).toMatch(/saudi riyal/i);
		expect(wrapper.text()).toContain(RIYAL_SYMBOL_TEXT);
	});

	it("applies size and color", () => {
		const wrapper = mount(RiyalSymbol, { props: { size: 32, color: "#f00" } });
		const style = wrapper.attributes("style") ?? "";
		expect(style).toContain("32px");
		expect(style.toLowerCase()).toMatch(/#f00|rgb\(255, 0, 0\)/);
	});
});

describe("Vue · RiyalIcon", () => {
	it("renders an SVG with title", () => {
		const wrapper = mount(RiyalIcon, { props: { title: "Riyal" } });
		expect(wrapper.element.tagName.toLowerCase()).toBe("svg");
		expect(wrapper.find("title").text()).toBe("Riyal");
	});
});

describe("Vue · RiyalPrice", () => {
	it("formats a number with the symbol", () => {
		const wrapper = mount(RiyalPrice, { props: { amount: 1234.5 } });
		expect(wrapper.text()).toContain(RIYAL_SYMBOL_TEXT);
		expect(wrapper.text()).toMatch(/1[,٬]?234/);
	});

	it("respects useCode", () => {
		const wrapper = mount(RiyalPrice, { props: { amount: 100, useCode: true } });
		expect(wrapper.text()).toContain("SAR");
	});
});

describe("Vue · RiyalInput", () => {
	it("emits update:modelValue when the input changes", async () => {
		const wrapper = mount(RiyalInput, { props: { modelValue: "" } });
		const input = wrapper.find("input");
		await input.setValue("250.5");
		const emitted = wrapper.emitted("update:modelValue");
		expect(emitted).toBeTruthy();
		expect(emitted?.[0]).toEqual([250.5]);
	});

	it("masks pasted 'SAR 2,499.99' when mask=true", async () => {
		const wrapper = mount(RiyalInput, { props: { modelValue: "", mask: true } });
		const input = wrapper.find("input");
		await input.setValue("SAR 2,499.99");
		expect((input.element as HTMLInputElement).value).toBe("2,499.99");
		expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([2499.99]);
	});

	it("normalises Arabic digits when mask=true", async () => {
		const wrapper = mount(RiyalInput, { props: { modelValue: "", mask: true } });
		const input = wrapper.find("input");
		await input.setValue("٢٤٩٩٫٩٩");
		expect((input.element as HTMLInputElement).value).toBe("2,499.99");
	});
});
