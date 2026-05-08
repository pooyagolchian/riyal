import { fireEvent, render, screen } from "@testing-library/react";
import * as React from "react";
import { describe, expect, it } from "vitest";
import { RIYAL_SYMBOL_TEXT } from "../constants";
import { RiyalIcon, RiyalInput, RiyalPrice, RiyalSymbol } from "./index";

describe("RiyalSymbol", () => {
	it("renders the U+20C1 glyph", () => {
		render(<RiyalSymbol />);
		expect(screen.getByRole("img", { name: /saudi riyal/i }).textContent).toContain(
			RIYAL_SYMBOL_TEXT,
		);
	});

	it("applies size and color", () => {
		render(<RiyalSymbol size={32} color="#f00" data-testid="s" />);
		const el = screen.getByTestId("s");
		expect(el.style.width).toBe("32px");
		expect(el.style.height).toBe("32px");
		expect(el.style.color).toMatch(/#f00|rgb\(255, 0, 0\)/);
	});
});

describe("RiyalIcon", () => {
	it("renders an inline svg with title", () => {
		render(<RiyalIcon title="Riyal" data-testid="ico" />);
		const svg = screen.getByTestId("ico");
		expect(svg.tagName.toLowerCase()).toBe("svg");
	});
});

describe("RiyalPrice", () => {
	it("formats a number with the symbol", () => {
		render(<RiyalPrice amount={1234.5} data-testid="p" />);
		expect(screen.getByTestId("p").textContent).toContain(RIYAL_SYMBOL_TEXT);
		expect(screen.getByTestId("p").textContent).toMatch(/1[,٬]?234/);
	});

	it("respects useCode", () => {
		render(<RiyalPrice amount={100} useCode data-testid="p" />);
		expect(screen.getByTestId("p").textContent).toContain("SAR");
	});
});

describe("RiyalInput · mask", () => {
	function Harness({ initial = "" as number | "" }: { initial?: number | "" }) {
		const [v, setV] = React.useState<number | "">(initial);
		return <RiyalInput mask value={v} onValueChange={setV} data-testid="m" />;
	}

	it("formats typing as you go", () => {
		render(<Harness />);
		const el = screen.getByTestId("m") as HTMLInputElement;
		fireEvent.change(el, { target: { value: "1234" } });
		expect(el.value).toBe("1,234");
	});

	it("normalizes a paste of 'SAR 2,499.99'", () => {
		render(<Harness />);
		const el = screen.getByTestId("m") as HTMLInputElement;
		fireEvent.change(el, { target: { value: "SAR 2,499.99" } });
		expect(el.value).toBe("2,499.99");
	});

	it("converts Arabic digits to ASCII", () => {
		render(<Harness />);
		const el = screen.getByTestId("m") as HTMLInputElement;
		fireEvent.change(el, { target: { value: "٢٤٩٩٫٩٩" } });
		expect(el.value).toBe("2,499.99");
	});
});
