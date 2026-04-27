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
	.riyal-symbol { display: inline-flex; align-items: center; justify-content: center; width: 1em; height: 1em; line-height: 1; vertical-align: -0.125em; }
	.riyal-symbol svg { width: 100%; height: 100%; fill: currentColor; }
	.riyal-symbol .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
`;

/**
 * Official SAMA glyph (public domain) for U+20C1 — used as a font-independent
 * inline SVG so the symbol renders even when no system font supports it yet.
 */
const RIYAL_GLYPH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1124.14 1256.39" aria-hidden="true" focusable="false"><path d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"/><path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"/></svg>`;

const RIYAL_SYMBOL_HTML = `<span class="riyal-symbol" role="img" aria-label="Saudi Riyal">${RIYAL_GLYPH_SVG}<span class="sr-only">${RIYAL_SYMBOL_TEXT}</span></span>`;

/** Replace every U+20C1 occurrence in `text` with the inline SVG glyph. */
function withInlineGlyph(text: string): string {
	return text.split(RIYAL_SYMBOL_TEXT).join(RIYAL_SYMBOL_HTML);
}

class RiyalSymbolElement extends HTMLElement {
	connectedCallback() {
		const root = this.attachShadow({ mode: "open" });
		root.innerHTML = `<style>${FONT_STYLE}</style>${RIYAL_SYMBOL_HTML}`;
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
		this.root.innerHTML = `<style>${FONT_STYLE}</style><span class="riyal-price">${withInlineGlyph(text)}</span>`;
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
		this.root.innerHTML = `<style>${FONT_STYLE}</style><span class="riyal-price">${withInlineGlyph(text)}</span>`;
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
				${RIYAL_SYMBOL_HTML}
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
