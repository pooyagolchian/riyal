import {
	RIYAL_ARABIC_ABBREVIATION,
	RIYAL_CODEPOINT,
	RIYAL_CSS_CONTENT,
	RIYAL_CURRENCY_CODE,
	RIYAL_HTML_ENTITY,
	RIYAL_SYMBOL_TEXT,
	RIYAL_UNICODE,
	SAUDI_VAT_RATE,
	addVAT,
	formatRiyal,
	getVAT,
	parseRiyal,
	removeVAT,
} from "riyal";
import {
	AnimatedRiyalPrice,
	RiyalIcon,
	RiyalInput,
	RiyalPrice,
	RiyalSymbol,
} from "riyal/react";
import { useEffect, useMemo, useState } from "react";

type Locale = "en-SA" | "ar-SA" | "en-US";

export function App() {
	const [amount, setAmount] = useState<number | "">(2499.99);
	const [locale, setLocale] = useState<Locale>("en-SA");
	const [decimals, setDecimals] = useState(2);
	const [animAmount, setAnimAmount] = useState(1234.5);
	const [parseInput, setParseInput] = useState(
		`${RIYAL_SYMBOL_TEXT} 2,500.00`,
	);
	const [copyState, setCopyState] = useState<string>("");

	const numeric =
		typeof amount === "number" && Number.isFinite(amount) ? amount : 0;

	const parsed = useMemo(() => {
		try {
			return parseRiyal(parseInput);
		} catch {
			return Number.NaN;
		}
	}, [parseInput]);

	useEffect(() => {
		if (!copyState) return;
		const id = window.setTimeout(() => setCopyState(""), 1600);
		return () => window.clearTimeout(id);
	}, [copyState]);

	const handleCopy = async (value: string, label: string) => {
		try {
			await navigator.clipboard.writeText(value);
			setCopyState(`Copied ${label}`);
		} catch {
			setCopyState("Copy failed");
		}
	};

	return (
		<main>
			<div className="topbar">
				<div className="brand">
					<RiyalSymbol size={18} /> RIYAL
				</div>
				<nav>
					<a href="#install">Install</a>
					<a href="#samples">Samples</a>
					<a href="#api">API</a>
					<a href="https://github.com/pooyagolchian/riyal">GitHub</a>
				</nav>
				<div className="muted">v1.0 · MIT</div>
			</div>

			<section className="hero">
				<div>
					<div className="eyebrow">The Saudi Riyal · U+20C1</div>
					<h1>
						The currency
						<br />
						of <em>tomorrow,</em>
						<br />
						rendered today.
					</h1>
					<p className="lead">
						A complete typographic toolkit for the official Saudi Riyal sign —
						font, React, Web Components, Tailwind, OG cards, VAT &amp; FX.
						Pixel-precise. Locale-aware. Effortless.
					</p>
					<div className="hero-actions">
						<button
							type="button"
							className="btn"
							onClick={() =>
								handleCopy(
									"npm install riyal",
									"install command",
								)
							}
						>
							npm install riyal
						</button>
						<a className="btn ghost" href="#samples">
							View samples
						</a>
					</div>
					<div style={{ marginTop: "1rem", minHeight: "1rem" }}>
						<span
							className="muted"
							style={{
								fontSize: "0.78rem",
								letterSpacing: "0.18em",
								textTransform: "uppercase",
							}}
						>
							{copyState || "\u00A0"}
						</span>
					</div>
				</div>

				<div className="hero-glyph" aria-hidden="true">
					<span className="corner tl">U+20C1</span>
					<span className="corner tr">SAR · ر.س</span>
					<span className="corner bl">SAMA · 2025</span>
					<span className="corner br">Unicode 17.0</span>
					<RiyalIcon size={420} />
				</div>
			</section>

			<div className="stats">
				<div className="stat">
					<div className="v">U+20C1</div>
					<div className="l">Codepoint</div>
				</div>
				<div className="stat">
					<div className="v">11</div>
					<div className="l">Entry points</div>
				</div>
				<div className="stat">
					<div className="v">15%</div>
					<div className="l">VAT default</div>
				</div>
				<div className="stat">
					<div className="v">2</div>
					<div className="l">RTL · LTR</div>
				</div>
			</div>

			<section className="feature" id="install">
				<div className="section-head">
					<span className="num">01 — Install</span>
					<h2>Drop in, ship anywhere.</h2>
					<p>
						One package. ESM &amp; CJS. Strict types. Works in Node, Vite,
						Next, Remix, React Native and the browser.
					</p>
				</div>
				<div className="section-body">
					<div className="card">
						<div className="card-label">
							<span>Package · npm</span>
							<span className="tag">v1</span>
						</div>
						<pre className="code">
							<span className="tok-c"># the only dependency you need</span>
							{"\n"}
							<span className="tok-f">pnpm</span> add riyal
							{"\n"}
							<span className="tok-f">npm</span> install riyal
							{"\n"}
							<span className="tok-f">yarn</span> add riyal
						</pre>
					</div>
					<div className="card">
						<div className="card-label">
							<span>Imports</span>
							<span className="tag">11 entries</span>
						</div>
						<pre className="code">
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{`{ formatRiyal, addVAT }`}</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">"riyal"</span>;{"\n"}
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{`{ RiyalPrice, RiyalInput }`}</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">"riyal/react"</span>;
							{"\n"}
							<span className="tok-k">import</span>{" "}
							<span className="tok-s">"riyal/font.css"</span>;
							{"\n"}
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{`{ defineRiyalElements }`}</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">
								"riyal/web-component"
							</span>
							;{"\n"}
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">riyalPlugin</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">"riyal/tailwind"</span>;
						</pre>
					</div>
				</div>
			</section>

			<section className="feature" id="samples">
				<div className="section-head">
					<span className="num">02 — The Symbol</span>
					<h2>One glyph. Every surface.</h2>
					<p>
						The official SAMA Saudi Riyal mark — vector-perfect, public domain,
						mapped to U+20C1. Renders inline as SVG; never tofu.
					</p>
				</div>
				<div className="section-body">
					<div className="card">
						<div className="card-label">
							<span>Live · React</span>
							<span className="tag">{"<RiyalSymbol />"}</span>
						</div>
						<div className="preview" style={{ alignItems: "center" }}>
							<RiyalSymbol size={96} />
							<RiyalSymbol size={64} />
							<RiyalSymbol size={40} />
							<RiyalSymbol size={24} />
							<RiyalIcon size={48} aria-label="riyal icon" />
						</div>
						<div className="row">
							<button
								type="button"
								className="minimal"
								onClick={() => handleCopy(RIYAL_UNICODE, "Unicode")}
							>
								Copy Unicode
							</button>
							<button
								type="button"
								className="minimal"
								onClick={() => handleCopy(RIYAL_HTML_ENTITY, "HTML entity")}
							>
								Copy HTML
							</button>
							<button
								type="button"
								className="minimal"
								onClick={() =>
									handleCopy(`\\${RIYAL_CSS_CONTENT}`, "CSS escape")
								}
							>
								Copy CSS
							</button>
						</div>
					</div>
					<div className="card">
						<div className="card-label">
							<span>Constants</span>
							<span className="tag">"riyal"</span>
						</div>
						<pre className="code">
							RIYAL_UNICODE{"        "}
							<span className="tok-s">{`"${RIYAL_UNICODE}"`}</span>
							{"\n"}
							RIYAL_CODEPOINT{"      "}
							<span className="tok-n">{`0x${RIYAL_CODEPOINT.toString(16).toUpperCase()}`}</span>
							{"\n"}
							RIYAL_HTML_ENTITY{"    "}
							<span className="tok-s">{`"${RIYAL_HTML_ENTITY}"`}</span>
							{"\n"}
							RIYAL_CSS_CONTENT{"    "}
							<span className="tok-s">{`"${RIYAL_CSS_CONTENT}"`}</span>
							{"\n"}
							RIYAL_CURRENCY_CODE{"  "}
							<span className="tok-s">{`"${RIYAL_CURRENCY_CODE}"`}</span>
							{"\n"}
							RIYAL_ARABIC_ABBR{"    "}
							<span className="tok-s">{`"${RIYAL_ARABIC_ABBREVIATION}"`}</span>
							{"\n"}
							SAUDI_VAT_RATE{"       "}
							<span className="tok-n">{`${SAUDI_VAT_RATE}`}</span>
						</pre>
					</div>
				</div>
			</section>

			<div className="marquee" aria-hidden="true">
				<div className="marquee-track">
					{Array.from({ length: 2 }).map((_, i) => (
						<span key={`m-${i}`}>
							<RiyalSymbol size={36} /> precision
							<span className="dot" /> typography
							<span className="dot" /> rtl &amp; ltr
							<span className="dot" /> SAR &amp; FX
							<span className="dot" /> VAT 15%
							<span className="dot" /> SSR-safe
							<span className="dot" />
						</span>
					))}
				</div>
			</div>

			<section className="feature">
				<div className="section-head">
					<span className="num">03 — Formatting</span>
					<h2>Numbers, with manners.</h2>
					<p>
						Locale-aware via <code>Intl.NumberFormat</code>. Choose decimals,
						currency code, the symbol position — RTL handled.
					</p>
				</div>
				<div className="section-body">
					<div className="card">
						<div className="card-label">
							<span>Live · formatRiyal</span>
							<div className="tabs" role="tablist">
								{(["en-SA", "ar-SA", "en-US"] as Locale[]).map((l) => (
									<button
										key={l}
										type="button"
										role="tab"
										aria-selected={locale === l}
										className={locale === l ? "active" : ""}
										onClick={() => setLocale(l)}
									>
										{l}
									</button>
								))}
							</div>
						</div>
						<div className="preview-row">
							<div>
								<span className="lbl">Amount</span>
								<input
									type="number"
									value={amount}
									step={0.01}
									onChange={(e) => {
										const v = e.target.value;
										setAmount(v === "" ? "" : Number.parseFloat(v));
									}}
								/>
							</div>
							<div>
								<span className="lbl">Decimals</span>
								<select
									value={decimals}
									onChange={(e) =>
										setDecimals(Number.parseInt(e.target.value, 10))
									}
								>
									{[0, 1, 2, 3, 4].map((d) => (
										<option key={d} value={d}>
											{d}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="preview">
							<span className="preview-large">
								<RiyalPrice
									amount={numeric}
									locale={locale}
									decimals={decimals}
								/>
							</span>
						</div>
						<pre className="code">
							<span className="tok-f">formatRiyal</span>(
							<span className="tok-n">{numeric}</span>,{" "}
							<span className="tok-n">{`{ locale: "${locale}", decimals: ${decimals} }`}</span>
							){"\n"}
							<span className="tok-c">{`// → ${formatRiyal(numeric, {
								locale,
								decimals,
							})}`}</span>
						</pre>
					</div>
					<div className="card">
						<div className="card-label">
							<span>Variants</span>
							<span className="tag">useCode · LTR · RTL</span>
						</div>
						<div className="preview-row">
							<div>
								<span className="lbl">en-SA</span>
								<span className="val">
									<RiyalPrice amount={numeric} locale="en-SA" />
								</span>
							</div>
							<div>
								<span className="lbl">ar-SA</span>
								<span className="val" style={{ direction: "rtl" }}>
									<RiyalPrice amount={numeric} locale="ar-SA" />
								</span>
							</div>
							<div>
								<span className="lbl">SAR code</span>
								<span className="val">
									<RiyalPrice amount={numeric} useCode />
								</span>
							</div>
							<div>
								<span className="lbl">Compact</span>
								<span className="val">
									<RiyalPrice amount={numeric} notation="compact" />
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="feature">
				<div className="section-head">
					<span className="num">04 — Animated</span>
					<h2>Prices, in motion.</h2>
					<p>
						Tween smoothly between values. Ideal for dashboards, checkout
						totals and live FX surfaces.
					</p>
				</div>
				<div className="section-body">
					<div className="card">
						<div className="card-label">
							<span>Live · {"<AnimatedRiyalPrice />"}</span>
							<span className="tag">duration · 600ms</span>
						</div>
						<div className="preview">
							<span className="preview-large">
								<AnimatedRiyalPrice
									amount={animAmount}
									durationMs={600}
									locale={locale}
								/>
							</span>
						</div>
						<div className="row">
							<button
								type="button"
								className="minimal"
								onClick={() => setAnimAmount(Math.random() * 100000)}
							>
								Randomise
							</button>
							<button
								type="button"
								className="minimal"
								onClick={() => setAnimAmount(0)}
							>
								Reset
							</button>
							<button
								type="button"
								className="minimal"
								onClick={() => setAnimAmount(animAmount + 999)}
							>
								+ 999
							</button>
						</div>
					</div>
				</div>
			</section>

			<section className="feature">
				<div className="section-head">
					<span className="num">05 — Input</span>
					<h2>The pricing field, refined.</h2>
					<p>
						Numeric input that prefixes the symbol and emits clean numbers via{" "}
						<code>onValueChange</code>. SSR-safe.
					</p>
				</div>
				<div className="section-body">
					<div className="card">
						<div className="card-label">
							<span>Live · {"<RiyalInput />"}</span>
							<span className="tag">controlled</span>
						</div>
						<RiyalInput
							className="riyal-input"
							value={amount}
							onValueChange={(v) => setAmount(v)}
							placeholder="0.00"
						/>
						<div className="preview-row">
							<div>
								<span className="lbl">Value</span>
								<span className="val">{numeric.toFixed(2)}</span>
							</div>
							<div>
								<span className="lbl">Formatted</span>
								<span className="val">
									<RiyalPrice amount={numeric} locale={locale} />
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="feature">
				<div className="section-head">
					<span className="num">06 — VAT 15%</span>
					<h2>Saudi VAT, by default.</h2>
					<p>
						Add, remove and isolate the 15% VAT line. Override the rate per
						call when the regulation moves.
					</p>
				</div>
				<div className="section-body">
					<div className="card">
						<div className="card-label">
							<span>Live · addVAT / removeVAT / getVAT</span>
							<span className="tag">net → gross</span>
						</div>
						<div className="preview-row">
							<div>
								<span className="lbl">Net</span>
								<span className="val">
									<RiyalPrice amount={numeric} locale={locale} />
								</span>
							</div>
							<div>
								<span className="lbl">+ VAT</span>
								<span className="val">
									<RiyalPrice amount={getVAT(numeric)} locale={locale} />
								</span>
							</div>
							<div>
								<span className="lbl">Gross</span>
								<span className="val">
									<RiyalPrice amount={addVAT(numeric)} locale={locale} />
								</span>
							</div>
							<div>
								<span className="lbl">Reverse</span>
								<span className="val">
									<RiyalPrice
										amount={removeVAT(addVAT(numeric))}
										locale={locale}
									/>
								</span>
							</div>
						</div>
						<pre className="code">
							<span className="tok-f">addVAT</span>(
							<span className="tok-n">{numeric}</span>){" "}
							<span className="tok-c">{`// → ${addVAT(numeric).toFixed(2)}`}</span>
							{"\n"}
							<span className="tok-f">removeVAT</span>(
							<span className="tok-n">{addVAT(numeric).toFixed(2)}</span>){" "}
							<span className="tok-c">{`// → ${removeVAT(addVAT(numeric)).toFixed(2)}`}</span>
							{"\n"}
							<span className="tok-f">getVAT</span>(
							<span className="tok-n">{numeric}</span>,{" "}
							<span className="tok-n">{"{ rate: 0.05 }"}</span>){" "}
							<span className="tok-c">{`// → ${getVAT(numeric, { rate: 0.05 }).toFixed(2)}`}</span>
						</pre>
					</div>
				</div>
			</section>

			<section className="feature">
				<div className="section-head">
					<span className="num">07 — Parse</span>
					<h2>Strings, demystified.</h2>
					<p>
						Convert any printed Riyal price — symbol, code, abbreviation,
						Arabic — back into a plain JavaScript number.
					</p>
				</div>
				<div className="section-body">
					<div className="card">
						<div className="card-label">
							<span>Live · parseRiyal</span>
							<span className="tag">tolerant</span>
						</div>
						<input
							type="text"
							value={parseInput}
							onChange={(e) => setParseInput(e.target.value)}
							spellCheck={false}
						/>
						<div className="preview-row">
							<div>
								<span className="lbl">Input</span>
								<span
									className="val"
									style={{
										fontFamily: "var(--font-mono)",
										fontSize: "1rem",
									}}
								>
									{parseInput || "—"}
								</span>
							</div>
							<div>
								<span className="lbl">Parsed</span>
								<span className="val">
									{Number.isFinite(parsed) ? parsed.toString() : "—"}
								</span>
							</div>
							<div>
								<span className="lbl">Reformatted</span>
								<span className="val">
									{Number.isFinite(parsed) ? (
										<RiyalPrice amount={parsed} locale={locale} />
									) : (
										"—"
									)}
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section className="feature">
				<div className="section-head">
					<span className="num">08 — FX</span>
					<h2>SAR, in any tongue.</h2>
					<p>
						In-memory cached exchange rates with SAR as the base. Pass{" "}
						<code>rate</code> to skip the network entirely; swap the fetcher
						in tests.
					</p>
				</div>
				<div className="section-body">
					<div className="card">
						<div className="card-label">
							<span>Sample · convertFromSAR</span>
							<span className="tag">SAR base</span>
						</div>
						<pre className="code">
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ convertFromSAR }"}</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">"riyal"</span>;{"\n\n"}
							<span className="tok-k">const</span> usd ={" "}
							<span className="tok-k">await</span>{" "}
							<span className="tok-f">convertFromSAR</span>(
							<span className="tok-n">{numeric}</span>,{" "}
							<span className="tok-s">"USD"</span>);{"\n"}
							<span className="tok-k">const</span> aed ={" "}
							<span className="tok-k">await</span>{" "}
							<span className="tok-f">convertFromSAR</span>(
							<span className="tok-n">{numeric}</span>,{" "}
							<span className="tok-s">"AED"</span>,{" "}
							<span className="tok-n">{"{ rate: 0.98 }"}</span>);{"\n\n"}
							<span className="tok-c">
								// React: const {"{"} convert, loading {"}"} = useRiyalRate("USD")
							</span>
						</pre>
					</div>
				</div>
			</section>

			<section className="feature" id="api">
				<div className="section-head">
					<span className="num">09 — Surfaces</span>
					<h2>Wherever pixels live.</h2>
					<p>
						Open Graph cards, framework-agnostic Web Components, a Tailwind
						plugin, a CLI, and Next.js helpers.
					</p>
				</div>
				<div className="section-body">
					<div className="feature-grid">
						<div className="cell">
							<span className="n">/REACT</span>
							<span className="t">Components &amp; hooks</span>
							<span className="d">
								Symbol, Icon, Price, AnimatedPrice, Input, useRiyalRate.
							</span>
						</div>
						<div className="cell">
							<span className="n">/WEB-COMPONENT</span>
							<span className="t">Custom elements</span>
							<span className="d">
								&lt;riyal-symbol&gt;, &lt;riyal-price&gt;, framework-free.
							</span>
						</div>
						<div className="cell">
							<span className="n">/TAILWIND</span>
							<span className="t">Plugin</span>
							<span className="d">
								Utilities, components and theme tokens for Tailwind v3+.
							</span>
						</div>
						<div className="cell">
							<span className="n">/OG</span>
							<span className="t">Open Graph cards</span>
							<span className="d">
								Satori-ready JSX and a string-SVG generator for share images.
							</span>
						</div>
						<div className="cell">
							<span className="n">/NEXT</span>
							<span className="t">Next.js font</span>
							<span className="d">
								First-class <code>next/font</code> integration, zero CLS.
							</span>
						</div>
						<div className="cell">
							<span className="n">/REACT-NATIVE</span>
							<span className="t">Mobile</span>
							<span className="d">
								Same API, browser-free imports — safe for Expo &amp; bare RN.
							</span>
						</div>
						<div className="cell">
							<span className="n">/CLI</span>
							<span className="t">Toolkit</span>
							<span className="d">
								Generate fonts, OG images and constants from the CLI.
							</span>
						</div>
						<div className="cell">
							<span className="n">/FONT.CSS</span>
							<span className="t">Pure CSS</span>
							<span className="d">
								Drop-in stylesheet that maps U+20C1 to the SAMA glyph.
							</span>
						</div>
					</div>
				</div>
			</section>

			<section className="feature">
				<div className="section-head">
					<span className="num">10 — Web Component &amp; Tailwind</span>
					<h2>Standards-first, always.</h2>
					<p>
						The same glyph and price renderer, but as native custom elements
						and as a first-class Tailwind plugin.
					</p>
				</div>
				<div className="section-body">
					<div className="card">
						<div className="card-label">
							<span>HTML</span>
							<span className="tag">no framework</span>
						</div>
						<pre className="code">
							<span className="tok-k">&lt;script</span>{" "}
							<span className="tok-n">type</span>=
							<span className="tok-s">"module"</span>&gt;{"\n  "}
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ defineRiyalElements }"}</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">
								"riyal/web-component"
							</span>
							;{"\n  "}
							<span className="tok-f">defineRiyalElements</span>();{"\n"}
							<span className="tok-k">&lt;/script&gt;</span>
							{"\n\n"}
							<span className="tok-k">&lt;riyal-symbol</span>{" "}
							<span className="tok-n">size</span>=
							<span className="tok-s">"48"</span>
							<span className="tok-k">&gt;&lt;/riyal-symbol&gt;</span>
							{"\n"}
							<span className="tok-k">&lt;riyal-price</span>{" "}
							<span className="tok-n">amount</span>=
							<span className="tok-s">"2499.99"</span>{" "}
							<span className="tok-n">locale</span>=
							<span className="tok-s">"ar-SA"</span>
							<span className="tok-k">&gt;&lt;/riyal-price&gt;</span>
						</pre>
					</div>
					<div className="card">
						<div className="card-label">
							<span>Tailwind plugin</span>
							<span className="tag">tailwind.config</span>
						</div>
						<pre className="code">
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">riyal</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">"riyal/tailwind"</span>;
							{"\n\n"}
							<span className="tok-k">export default</span>{" "}
							<span className="tok-n">{"{"}</span>
							{"\n  "}plugins: [<span className="tok-f">riyal</span>()],{"\n"}
							<span className="tok-n">{"}"}</span>;{"\n\n"}
							<span className="tok-c">{`// <span class="riyal-price">2,499.99</span>`}</span>
						</pre>
					</div>
				</div>
			</section>

			<footer className="foot">
				<div className="mark">
					<RiyalSymbol size={64} />
				</div>
				<div className="meta">
					<span>Made for the Saudi web</span>
					<span>
						<a href="https://github.com/pooyagolchian/riyal">github</a> ·{" "}
						<a href="https://www.npmjs.com/package/riyal">
							npm
						</a>{" "}
						· <a href="https://riyal.js.org">riyal.js.org</a>
					</span>
					<span className="muted">© {new Date().getFullYear()} · MIT</span>
				</div>
			</footer>
		</main>
	);
}
