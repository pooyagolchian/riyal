/**
 * Framework-agnostic Web Components for the Saudi Riyal symbol.
 *
 *   <riyal-symbol></riyal-symbol>
 *   <riyal-price amount="1234.5" locale="ar-SA"></riyal-price>
 *   <riyal-animated-price amount="100" duration="600"></riyal-animated-price>
 *   <riyal-input></riyal-input>
 */
import { RIYAL_SYMBOL_TEXT } from "../constants";
import { formatRiyal } from "../format";
import { parseRiyal } from "../format";

const FONT_STYLE = `
	:host { font-family: 'Riyal', 'Riyal Sans', system-ui, sans-serif; }
	.riyal-symbol { font-family: inherit; line-height: 1; }
`;

class RiyalSymbolElement extends HTMLElement {
	connectedCallback() {
		const root = this.attachShadow({ mode: "open" });
		root.innerHTML = `<style>${FONT_STYLE}</style><span class="riyal-symbol" role="img" aria-label="Saudi Riyal">${RIYAL_SYMBOL_TEXT}</span>`;
	}
}

class RiyalPriceElement extends HTMLElement {
	static get observedAttributes() {
		return ["amount", "locale", "decimals", "use-code", "notation"];
	}
	private root!: ShadowRoot;
	connectedCallback() {
		this.root = this.attachShadow({ mode: "open" });
		this.render();
	}
	attributeChangedCallback() {
		if (this.root) this.render();
	}
	private render() {
		const amount = Number.parseFloat(this.getAttribute("amount") ?? "0");
		const locale = this.getAttribute("locale") ?? undefined;
		const decimalsAttr = this.getAttribute("decimals");
		const decimals = decimalsAttr != null ? Number.parseInt(decimalsAttr, 10) : undefined;
		const useCode = this.hasAttribute("use-code");
		const notation = (this.getAttribute("notation") ?? undefined) as
			| "standard"
			| "compact"
			| undefined;
		const text = formatRiyal(amount, { locale, decimals, useCode, notation });
		this.root.innerHTML = `<style>${FONT_STYLE}</style><span class="riyal-price">${text}</span>`;
	}
}

class RiyalAnimatedPriceElement extends HTMLElement {
	static get observedAttributes() {
		return ["amount", "duration", "locale", "decimals"];
	}
	private root!: ShadowRoot;
	private current = 0;
	private raf = 0;
	connectedCallback() {
		this.root = this.attachShadow({ mode: "open" });
		this.current = Number.parseFloat(this.getAttribute("amount") ?? "0");
		this.render(this.current);
	}
	disconnectedCallback() {
		cancelAnimationFrame(this.raf);
	}
	attributeChangedCallback(name: string) {
		if (!this.root) return;
		if (name === "amount") this.animateTo(Number.parseFloat(this.getAttribute("amount") ?? "0"));
		else this.render(this.current);
	}
	private animateTo(to: number) {
		const from = this.current;
		const duration = Number.parseFloat(this.getAttribute("duration") ?? "600");
		const start = performance.now();
		const step = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			const eased = 1 - (1 - t) ** 3;
			this.current = from + (to - from) * eased;
			this.render(this.current);
			if (t < 1) this.raf = requestAnimationFrame(step);
		};
		cancelAnimationFrame(this.raf);
		this.raf = requestAnimationFrame(step);
	}
	private render(value: number) {
		const locale = this.getAttribute("locale") ?? undefined;
		const decimalsAttr = this.getAttribute("decimals");
		const decimals = decimalsAttr != null ? Number.parseInt(decimalsAttr, 10) : undefined;
		const text = formatRiyal(value, { locale, decimals });
		this.root.innerHTML = `<style>${FONT_STYLE}</style><span class="riyal-price">${text}</span>`;
	}
}

class RiyalInputElement extends HTMLElement {
	private root!: ShadowRoot;
	private input!: HTMLInputElement;
	connectedCallback() {
		this.root = this.attachShadow({ mode: "open" });
		this.root.innerHTML = `
			<style>
				${FONT_STYLE}
				.wrap { display: inline-flex; align-items: center; gap: 0.25rem; }
				input { font: inherit; padding: 0.25rem 0.5rem; }
			</style>
			<span class="wrap">
				<span class="riyal-symbol">${RIYAL_SYMBOL_TEXT}</span>
				<input type="number" step="0.01" />
			</span>
		`;
		this.input = this.root.querySelector("input") as HTMLInputElement;
		this.input.addEventListener("input", () => {
			this.dispatchEvent(
				new CustomEvent("riyal-change", {
					detail: { value: Number.parseFloat(this.input.value) },
				}),
			);
		});
	}
	get value(): number {
		return Number.parseFloat(this.input.value);
	}
	set value(v: number | string) {
		this.input.value = typeof v === "number" ? String(v) : String(parseRiyal(v));
	}
}

export function defineRiyalElements(): void {
	if (typeof customElements === "undefined") return;
	if (!customElements.get("riyal-symbol")) customElements.define("riyal-symbol", RiyalSymbolElement);
	if (!customElements.get("riyal-price")) customElements.define("riyal-price", RiyalPriceElement);
	if (!customElements.get("riyal-animated-price"))
		customElements.define("riyal-animated-price", RiyalAnimatedPriceElement);
	if (!customElements.get("riyal-input")) customElements.define("riyal-input", RiyalInputElement);
}

// Auto-register on side-effect import in browser environments.
if (typeof window !== "undefined") {
	defineRiyalElements();
}
