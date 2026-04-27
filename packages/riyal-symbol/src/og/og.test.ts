import { describe, expect, it } from "vitest";
import { RiyalPriceCard, generatePriceCardSVG } from "./index";

describe("RiyalPriceCard", () => {
	it("returns a JSX-like tree with the formatted amount", () => {
		const tree = RiyalPriceCard({ amount: 2500, title: "Plan", subtitle: "monthly" }) as {
			type: string;
			props: { children: unknown[] };
		};
		expect(tree.type).toBe("div");
		expect(JSON.stringify(tree)).toContain("2,500");
		expect(JSON.stringify(tree)).toContain("Plan");
	});

	it("supports custom dimensions and colors", () => {
		const tree = RiyalPriceCard({
			amount: 100,
			width: 800,
			height: 400,
			background: "#fff",
			color: "#000",
		}) as { props: { style: { width: number; height: number; background: string } } };
		expect(tree.props.style.width).toBe(800);
		expect(tree.props.style.height).toBe(400);
		expect(tree.props.style.background).toBe("#fff");
	});
});

describe("generatePriceCardSVG", () => {
	it("returns a self-contained SVG string", () => {
		const svg = generatePriceCardSVG({ amount: 99, title: "Pro" });
		expect(svg).toMatch(/^<\?xml/);
		expect(svg).toContain("<svg");
		expect(svg).toContain("Pro");
		expect(svg).toContain("99");
	});

	it("escapes XML in user-provided strings", () => {
		const svg = generatePriceCardSVG({ amount: 1, title: "<script>" });
		expect(svg).toContain("&lt;script&gt;");
		expect(svg).not.toContain("<script>");
	});
});
