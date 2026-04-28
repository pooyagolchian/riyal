import { type ReactNode, useEffect, useMemo, useState } from "react";
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
import { AnimatedRiyalPrice, RiyalIcon, RiyalInput, RiyalPrice, RiyalSymbol } from "riyal/react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Card, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Tabs } from "./components/ui/tabs";

type Locale = "en-SA" | "ar-SA" | "en-US";

const LOCALES: readonly { value: Locale; label: string }[] = [
	{ value: "en-SA", label: "en-SA" },
	{ value: "ar-SA", label: "ar-SA" },
	{ value: "en-US", label: "en-US" },
] as const;

/**
 * Renders text and replaces every U+20C1 with an inline `<RiyalSymbol />`
 * so the SAMA glyph displays even when system fonts lack the codepoint.
 */
function renderWithGlyph(text: string): ReactNode {
	if (!text) return null;
	const parts = text.split(RIYAL_SYMBOL_TEXT);
	const nodes: ReactNode[] = [];
	parts.forEach((part, i) => {
		if (i > 0) nodes.push(<RiyalSymbol key={`g-${i}-${part}`} size="0.9em" />);
		if (part) nodes.push(<span key={`p-${i}-${part}`}>{part}</span>);
	});
	return nodes;
}

function SectionHead({
	num,
	title,
	children,
}: {
	num: string;
	title: ReactNode;
	children: ReactNode;
}) {
	return (
		<div className="lg:sticky lg:top-24 self-start">
			<div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
				{num}
			</div>
			<h2 className="mt-6 font-display text-4xl font-light leading-[1.04] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-[56px]">
				{title}
			</h2>
			<p className="mt-5 max-w-[34ch] text-[15px] leading-relaxed text-muted-foreground">
				{children}
			</p>
		</div>
	);
}

function Section({
	id,
	num,
	title,
	description,
	children,
}: {
	id?: string;
	num: string;
	title: ReactNode;
	description: ReactNode;
	children: ReactNode;
}) {
	return (
		<section
			id={id}
			className="grid gap-12 border-t border-white/[0.06] py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20"
		>
			<SectionHead num={num} title={title}>
				{description}
			</SectionHead>
			<div className="flex flex-col gap-6">{children}</div>
		</section>
	);
}

export function App() {
	const [amount, setAmount] = useState<number | "">(2499.99);
	const [locale, setLocale] = useState<Locale>("en-SA");
	const [decimals, setDecimals] = useState(2);
	const [animAmount, setAnimAmount] = useState(1234.5);
	const [parseInput, setParseInput] = useState("SAR 2,500.00");
	const [copyState, setCopyState] = useState<string>("");

	const numeric = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;

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
		<div className="relative min-h-screen bg-background text-foreground bg-noir-radial">
			<div className="pointer-events-none fixed inset-0 bg-noir-grid opacity-40" />

			<div className="relative mx-auto w-full max-w-[1240px] px-6 sm:px-10">
				{/* Topbar */}
				<header className="sticky top-0 z-50 -mx-6 flex items-center justify-between border-b border-white/[0.06] bg-background/80 px-6 py-5 backdrop-blur-md sm:-mx-10 sm:px-10">
					<div className="flex items-center gap-2.5 font-display text-[15px] font-medium uppercase tracking-[0.32em] text-foreground">
						<RiyalSymbol size={16} /> Riyal
					</div>
					<nav className="hidden items-center gap-8 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground md:flex">
						<a className="transition-colors hover:text-foreground" href="#install">
							Install
						</a>
						<a className="transition-colors hover:text-foreground" href="#samples">
							Samples
						</a>
						<a className="transition-colors hover:text-foreground" href="#api">
							API
						</a>
						<a
							className="transition-colors hover:text-foreground"
							href="https://github.com/pooyagolchian/riyal"
						>
							GitHub
						</a>
					</nav>
					<div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
						v1.0 · MIT
					</div>
				</header>

				{/* Hero */}
				<section className="grid items-center gap-16 py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:py-32">
					<div>
						<div className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
							<span className="h-px w-8 bg-white/30" />
							The Saudi Riyal · U+20C1
						</div>
						<h1 className="mt-8 font-display text-[56px] font-light leading-[0.94] tracking-[-0.035em] text-foreground sm:text-[80px] lg:text-[112px]">
							The currency
							<br />
							of <span className="italic text-white/70">tomorrow,</span>
							<br />
							rendered today.
						</h1>
						<p className="mt-10 max-w-[58ch] text-[17px] leading-relaxed text-muted-foreground">
							A complete typographic toolkit for the official Saudi Riyal sign — font, React, Web
							Components, Tailwind, OG cards, VAT &amp; FX. Pixel-precise. Locale-aware. Effortless.
						</p>
						<div className="mt-12 flex flex-wrap gap-3">
							<Button onClick={() => handleCopy("npm install riyal", "install command")}>
								npm install riyal
							</Button>
							<a
								href="#samples"
								className="inline-flex h-11 items-center justify-center border border-white/15 px-6 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground transition-colors hover:border-white/40 hover:bg-white/[0.03]"
							>
								View samples
							</a>
						</div>
						<div className="mt-6 h-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
							{copyState || "\u00A0"}
						</div>
					</div>

					<div
						className="relative flex aspect-square min-h-[420px] items-center justify-center border border-white/[0.07] bg-[#040404]"
						aria-hidden="true"
					>
						<span className="absolute left-0 top-0 p-5 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
							U+20C1
						</span>
						<span className="absolute right-0 top-0 p-5 text-right font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
							SAR · ر.س
						</span>
						<span className="absolute bottom-0 left-0 p-5 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
							SAMA · 2025
						</span>
						<span className="absolute bottom-0 right-0 p-5 text-right font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
							Unicode 17.0
						</span>
						<RiyalIcon size={400} />
					</div>
				</section>

				{/* Stats */}
				<div className="grid grid-cols-2 border-t border-white/[0.06] md:grid-cols-4">
					{[
						{ v: "U+20C1", l: "Codepoint" },
						{ v: "11", l: "Entry points" },
						{ v: "15%", l: "VAT default" },
						{ v: "2", l: "RTL · LTR" },
					].map((s, i) => (
						<div
							key={s.l}
							className={`px-6 py-12 ${i < 3 ? "md:border-r md:border-white/[0.06]" : ""} ${i % 2 === 0 ? "border-r border-white/[0.06] md:border-r" : ""} ${i < 2 ? "border-b border-white/[0.06] md:border-b-0" : ""}`}
						>
							<div className="font-display text-4xl font-light leading-none text-foreground sm:text-5xl">
								{s.v}
							</div>
							<div className="mt-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
								{s.l}
							</div>
						</div>
					))}
				</div>

				{/* 01 — Install */}
				<Section
					id="install"
					num="01 — Install"
					title="Drop in, ship anywhere."
					description="One package. ESM & CJS. Strict types. Works in Node, Vite, Next, Remix, React Native and the browser."
				>
					<Card>
						<CardHeader>
							<CardTitle>Package · npm</CardTitle>
							<Badge>v1</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-c"># the only dependency you need</span>
							{"\n"}
							<span className="tok-f">pnpm</span> add riyal
							{"\n"}
							<span className="tok-f">npm</span> install riyal
							{"\n"}
							<span className="tok-f">yarn</span> add riyal
						</pre>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Imports</CardTitle>
							<Badge>11 entries</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ formatRiyal, addVAT }"}</span>{" "}
							<span className="tok-k">from</span> <span className="tok-s">"riyal"</span>;{"\n"}
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ RiyalPrice, RiyalInput }"}</span>{" "}
							<span className="tok-k">from</span> <span className="tok-s">"riyal/react"</span>
							{";"}
							{"\n"}
							<span className="tok-k">import</span> <span className="tok-s">"riyal/font.css"</span>
							{";"}
							{"\n"}
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ defineRiyalElements }"}</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">"riyal/web-component"</span>;{"\n"}
							<span className="tok-k">import</span> <span className="tok-n">riyalPlugin</span>{" "}
							<span className="tok-k">from</span> <span className="tok-s">"riyal/tailwind"</span>
							{";"}
						</pre>
					</Card>
				</Section>

				{/* 02 — Symbol */}
				<Section
					id="samples"
					num="02 — The Symbol"
					title="One glyph. Every surface."
					description="The official SAMA Saudi Riyal mark — vector-perfect, public domain, mapped to U+20C1. Renders inline as SVG; never tofu."
				>
					<Card>
						<CardHeader>
							<CardTitle>Live · React</CardTitle>
							<Badge>{"<RiyalSymbol />"}</Badge>
						</CardHeader>
						<div className="flex items-center gap-8 border-y border-white/[0.06] py-8">
							<RiyalSymbol size={96} />
							<RiyalSymbol size={64} />
							<RiyalSymbol size={40} />
							<RiyalSymbol size={24} />
							<RiyalIcon size={48} aria-label="riyal icon" />
						</div>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleCopy(RIYAL_UNICODE, "Unicode")}
							>
								Copy Unicode
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleCopy(RIYAL_HTML_ENTITY, "HTML entity")}
							>
								Copy HTML
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleCopy(`\\${RIYAL_CSS_CONTENT}`, "CSS escape")}
							>
								Copy CSS
							</Button>
						</div>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Constants</CardTitle>
							<Badge>"riyal"</Badge>
						</CardHeader>
						<pre className="code-block">
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
					</Card>
				</Section>
			</div>

			{/* Marquee – full bleed */}
			<div className="overflow-hidden border-y border-white/[0.06] py-6" aria-hidden="true">
				<div className="flex animate-marquee gap-12 whitespace-nowrap font-display text-3xl font-light italic text-foreground/80">
					{["a", "b"].map((rowKey) => (
						<span key={`marquee-${rowKey}`} className="inline-flex items-center gap-12">
							<RiyalSymbol size={32} /> precision
							<span className="inline-block h-1 w-1 rounded-full bg-white/40" />
							typography
							<span className="inline-block h-1 w-1 rounded-full bg-white/40" />
							rtl &amp; ltr
							<span className="inline-block h-1 w-1 rounded-full bg-white/40" />
							SAR &amp; FX
							<span className="inline-block h-1 w-1 rounded-full bg-white/40" />
							VAT 15%
							<span className="inline-block h-1 w-1 rounded-full bg-white/40" />
							SSR-safe
							<span className="inline-block h-1 w-1 rounded-full bg-white/40" />
						</span>
					))}
				</div>
			</div>

			<div className="relative mx-auto w-full max-w-[1240px] px-6 sm:px-10">
				{/* 03 — Formatting */}
				<Section
					num="03 — Formatting"
					title="Numbers, with manners."
					description={
						<>
							Locale-aware via{" "}
							<code className="font-mono-tight text-foreground">Intl.NumberFormat</code>. Choose
							decimals, currency code, the symbol position — RTL handled.
						</>
					}
				>
					<Card>
						<CardHeader>
							<CardTitle>Live · formatRiyal</CardTitle>
							<Tabs<Locale> value={locale} onValueChange={setLocale} options={LOCALES} />
						</CardHeader>
						<div className="grid gap-6 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
									Amount
								</span>
								<Input
									type="number"
									value={amount}
									step={0.01}
									onChange={(e) => {
										const v = e.target.value;
										setAmount(v === "" ? "" : Number.parseFloat(v));
									}}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
									Decimals
								</span>
								<select
									value={decimals}
									onChange={(e) => setDecimals(Number.parseInt(e.target.value, 10))}
									className="w-full border-0 border-b border-white/15 bg-transparent py-3 font-mono-tight text-base text-foreground outline-none focus:border-foreground"
								>
									{[0, 1, 2, 3, 4].map((d) => (
										<option key={d} value={d} className="bg-black">
											{d}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="border-y border-white/[0.06] py-8">
							<span className="font-display text-5xl font-light leading-none tracking-[-0.02em] sm:text-6xl">
								<RiyalPrice amount={numeric} locale={locale} decimals={decimals} />
							</span>
						</div>
						<pre className="code-block">
							<span className="tok-f">formatRiyal</span>(<span className="tok-n">{numeric}</span>,{" "}
							<span className="tok-n">{`{ locale: "${locale}", decimals: ${decimals} }`}</span>)
							{"\n"}
							<span className="tok-c">{`// → ${formatRiyal(numeric, {
								locale,
								decimals,
							})}`}</span>
						</pre>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Variants</CardTitle>
							<Badge>useCode · LTR · RTL</Badge>
						</CardHeader>
						<div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
							{(
								[
									{ lbl: "en-SA", node: <RiyalPrice amount={numeric} locale="en-SA" /> },
									{
										lbl: "ar-SA",
										node: (
											<span dir="rtl">
												<RiyalPrice amount={numeric} locale="ar-SA" />
											</span>
										),
									},
									{
										lbl: "SAR code",
										node: <RiyalPrice amount={numeric} useCode />,
									},
									{
										lbl: "Compact",
										node: <RiyalPrice amount={numeric} notation="compact" />,
									},
								] as const
							).map((row) => (
								<div
									key={row.lbl}
									className="flex items-baseline justify-between gap-6 border-b border-white/[0.04] py-3"
								>
									<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
										{row.lbl}
									</span>
									<span className="font-display text-xl">{row.node}</span>
								</div>
							))}
						</div>
					</Card>
				</Section>

				{/* 04 — Animated */}
				<Section
					num="04 — Animated"
					title="Prices, in motion."
					description="Tween smoothly between values. Ideal for dashboards, checkout totals and live FX surfaces."
				>
					<Card>
						<CardHeader>
							<CardTitle>Live · {"<AnimatedRiyalPrice />"}</CardTitle>
							<Badge>duration · 600ms</Badge>
						</CardHeader>
						<div className="border-y border-white/[0.06] py-10">
							<span className="font-display text-5xl font-light leading-none tracking-[-0.02em] sm:text-6xl">
								<AnimatedRiyalPrice amount={animAmount} durationMs={600} locale={locale} />
							</span>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => setAnimAmount(Math.random() * 100000)}
							>
								Randomise
							</Button>
							<Button variant="outline" size="sm" onClick={() => setAnimAmount(0)}>
								Reset
							</Button>
							<Button variant="outline" size="sm" onClick={() => setAnimAmount(animAmount + 999)}>
								+ 999
							</Button>
						</div>
					</Card>
				</Section>

				{/* 05 — Input */}
				<Section
					num="05 — Input"
					title="The pricing field, refined."
					description={
						<>
							Numeric input that prefixes the symbol and emits clean numbers via{" "}
							<code className="font-mono-tight text-foreground">onValueChange</code>. SSR-safe.
						</>
					}
				>
					<Card>
						<CardHeader>
							<CardTitle>Live · {"<RiyalInput />"}</CardTitle>
							<Badge>controlled</Badge>
						</CardHeader>
						<RiyalInput
							className="w-full border-0 border-b border-white/15 bg-transparent py-3 font-display text-2xl text-foreground outline-none focus:border-foreground"
							value={amount}
							onValueChange={(v) => setAmount(v)}
							placeholder="0.00"
						/>
						<div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-2">
							<div className="flex items-baseline justify-between gap-6 border-b border-white/[0.04] py-3">
								<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
									Value
								</span>
								<span className="font-display text-xl">{numeric.toFixed(2)}</span>
							</div>
							<div className="flex items-baseline justify-between gap-6 border-b border-white/[0.04] py-3">
								<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
									Formatted
								</span>
								<span className="font-display text-xl">
									<RiyalPrice amount={numeric} locale={locale} />
								</span>
							</div>
						</div>
					</Card>
				</Section>

				{/* 06 — VAT */}
				<Section
					num="06 — VAT 15%"
					title="Saudi VAT, by default."
					description="Add, remove and isolate the 15% VAT line. Override the rate per call when the regulation moves."
				>
					<Card>
						<CardHeader>
							<CardTitle>Live · addVAT / removeVAT / getVAT</CardTitle>
							<Badge>net → gross</Badge>
						</CardHeader>
						<div className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-4">
							{(
								[
									{ lbl: "Net", v: numeric },
									{ lbl: "+ VAT", v: getVAT(numeric) },
									{ lbl: "Gross", v: addVAT(numeric) },
									{ lbl: "Reverse", v: removeVAT(addVAT(numeric)) },
								] as const
							).map((row) => (
								<div
									key={row.lbl}
									className="flex flex-col gap-2 border-b border-white/[0.04] py-3"
								>
									<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
										{row.lbl}
									</span>
									<span className="font-display text-xl">
										<RiyalPrice amount={row.v} locale={locale} />
									</span>
								</div>
							))}
						</div>
						<pre className="code-block">
							<span className="tok-f">addVAT</span>(<span className="tok-n">{numeric}</span>){" "}
							<span className="tok-c">{`// → ${addVAT(numeric).toFixed(2)}`}</span>
							{"\n"}
							<span className="tok-f">removeVAT</span>(
							<span className="tok-n">{addVAT(numeric).toFixed(2)}</span>){" "}
							<span className="tok-c">{`// → ${removeVAT(addVAT(numeric)).toFixed(2)}`}</span>
							{"\n"}
							<span className="tok-f">getVAT</span>(<span className="tok-n">{numeric}</span>,{" "}
							<span className="tok-n">{"{ rate: 0.05 }"}</span>){" "}
							<span className="tok-c">{`// → ${getVAT(numeric, { rate: 0.05 }).toFixed(2)}`}</span>
						</pre>
					</Card>
				</Section>

				{/* 07 — Parse */}
				<Section
					num="07 — Parse"
					title="Strings, demystified."
					description="Convert any printed Riyal price — symbol, code, abbreviation, Arabic — back into a plain JavaScript number."
				>
					<Card>
						<CardHeader>
							<CardTitle>Live · parseRiyal</CardTitle>
							<Badge>tolerant</Badge>
						</CardHeader>
						<Input
							type="text"
							value={parseInput}
							onChange={(e) => setParseInput(e.target.value)}
							spellCheck={false}
							className="font-mono-tight text-lg"
						/>
						<div className="grid grid-cols-1 gap-x-10 gap-y-3 sm:grid-cols-3">
							<div className="flex flex-col gap-2 border-b border-white/[0.04] py-3">
								<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
									Input
								</span>
								<span className="font-mono-tight text-base">
									{renderWithGlyph(parseInput) ?? "—"}
								</span>
							</div>
							<div className="flex flex-col gap-2 border-b border-white/[0.04] py-3">
								<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
									Parsed
								</span>
								<span className="font-display text-xl">
									{Number.isFinite(parsed) ? parsed.toString() : "—"}
								</span>
							</div>
							<div className="flex flex-col gap-2 border-b border-white/[0.04] py-3">
								<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
									Reformatted
								</span>
								<span className="font-display text-xl">
									{Number.isFinite(parsed) ? <RiyalPrice amount={parsed} locale={locale} /> : "—"}
								</span>
							</div>
						</div>
					</Card>
				</Section>

				{/* 08 — FX */}
				<Section
					num="08 — FX"
					title="SAR, in any tongue."
					description={
						<>
							In-memory cached exchange rates with SAR as the base. Pass{" "}
							<code className="font-mono-tight text-foreground">rate</code> to skip the network
							entirely; swap the fetcher in tests.
						</>
					}
				>
					<Card>
						<CardHeader>
							<CardTitle>Sample · convertFromSAR</CardTitle>
							<Badge>SAR base</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ convertFromSAR }"}</span>{" "}
							<span className="tok-k">from</span> <span className="tok-s">"riyal"</span>;{"\n\n"}
							<span className="tok-k">const</span> usd = <span className="tok-k">await</span>{" "}
							<span className="tok-f">convertFromSAR</span>(<span className="tok-n">{numeric}</span>
							, <span className="tok-s">"USD"</span>);{"\n"}
							<span className="tok-k">const</span> aed = <span className="tok-k">await</span>{" "}
							<span className="tok-f">convertFromSAR</span>(<span className="tok-n">{numeric}</span>
							, <span className="tok-s">"AED"</span>,{" "}
							<span className="tok-n">{"{ rate: 0.98 }"}</span>);{"\n\n"}
							<span className="tok-c">
								{"// React: const "}
								{"{"} convert, loading {"}"} = useRiyalRate("USD")
							</span>
						</pre>
					</Card>
				</Section>

				{/* 09 — Surfaces */}
				<Section
					id="api"
					num="09 — Surfaces"
					title="Wherever pixels live."
					description="Open Graph cards, framework-agnostic Web Components, a Tailwind plugin, a CLI, and Next.js helpers."
				>
					<div className="grid grid-cols-1 border-l border-t border-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
						{[
							{
								n: "/REACT",
								t: "Components & hooks",
								d: "Symbol, Icon, Price, AnimatedPrice, Input, useRiyalRate.",
							},
							{
								n: "/WEB-COMPONENT",
								t: "Custom elements",
								d: "<riyal-symbol>, <riyal-price>, framework-free.",
							},
							{
								n: "/TAILWIND",
								t: "Plugin",
								d: "Utilities, components and theme tokens for Tailwind v3+.",
							},
							{
								n: "/OG",
								t: "Open Graph cards",
								d: "Satori-ready JSX and a string-SVG generator for share images.",
							},
							{
								n: "/NEXT",
								t: "Next.js font",
								d: "First-class next/font integration, zero CLS.",
							},
							{
								n: "/REACT-NATIVE",
								t: "Mobile",
								d: "Same API, browser-free imports — safe for Expo & bare RN.",
							},
							{
								n: "/CLI",
								t: "Toolkit",
								d: "Generate fonts, OG images and constants from the CLI.",
							},
							{
								n: "/FONT.CSS",
								t: "Pure CSS",
								d: "Drop-in stylesheet that maps U+20C1 to the SAMA glyph.",
							},
						].map((c) => (
							<div
								key={c.n}
								className="group relative flex min-h-[200px] flex-col gap-3 border-b border-r border-white/[0.06] p-8 transition-colors hover:bg-white/[0.02]"
							>
								<span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
									{c.n}
								</span>
								<span className="font-display text-2xl font-light leading-tight text-foreground">
									{c.t}
								</span>
								<span className="text-[13px] leading-relaxed text-muted-foreground">{c.d}</span>
							</div>
						))}
					</div>
				</Section>

				{/* 10 — Web Component & Tailwind */}
				<Section
					num="10 — Web Component & Tailwind"
					title="Standards-first, always."
					description="The same glyph and price renderer, but as native custom elements and as a first-class Tailwind plugin."
				>
					<Card>
						<CardHeader>
							<CardTitle>HTML</CardTitle>
							<Badge>no framework</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">&lt;script</span> <span className="tok-n">type</span>=
							<span className="tok-s">"module"</span>&gt;{"\n  "}
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ defineRiyalElements }"}</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">"riyal/web-component"</span>;{"\n  "}
							<span className="tok-f">defineRiyalElements</span>();{"\n"}
							<span className="tok-k">&lt;/script&gt;</span>
							{"\n\n"}
							<span className="tok-k">&lt;riyal-symbol</span> <span className="tok-n">size</span>=
							<span className="tok-s">"48"</span>
							<span className="tok-k">&gt;&lt;/riyal-symbol&gt;</span>
							{"\n"}
							<span className="tok-k">&lt;riyal-price</span> <span className="tok-n">amount</span>=
							<span className="tok-s">"2499.99"</span> <span className="tok-n">locale</span>=
							<span className="tok-s">"ar-SA"</span>
							<span className="tok-k">&gt;&lt;/riyal-price&gt;</span>
						</pre>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Tailwind plugin</CardTitle>
							<Badge>tailwind.config</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">import</span> <span className="tok-n">riyal</span>{" "}
							<span className="tok-k">from</span> <span className="tok-s">"riyal/tailwind"</span>
							{";"}
							{"\n\n"}
							<span className="tok-k">export default</span> <span className="tok-n">{"{"}</span>
							{"\n  "}plugins: [<span className="tok-f">riyal</span>()],{"\n"}
							<span className="tok-n">{"}"}</span>;{"\n\n"}
							<span className="tok-c">{`// <span class="riyal-price">2,499.99</span>`}</span>
						</pre>
					</Card>
				</Section>

				{/* Footer */}
				<footer className="grid items-end gap-12 border-t border-white/[0.06] py-24 sm:grid-cols-2">
					<div className="flex items-center gap-6">
						<RiyalSymbol size={56} />
						<span className="font-display text-2xl font-light italic text-muted-foreground">
							Made for the Saudi web.
						</span>
					</div>
					<div className="flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:items-end sm:text-right">
						<span className="flex flex-wrap gap-x-4 gap-y-2">
							<a
								className="transition-colors hover:text-foreground"
								href="https://github.com/pooyagolchian/riyal"
							>
								github
							</a>
							<span>·</span>
							<a
								className="transition-colors hover:text-foreground"
								href="https://www.npmjs.com/package/riyal"
							>
								npm
							</a>
							<span>·</span>
							<a className="transition-colors hover:text-foreground" href="https://riyal.js.org">
								riyal.js.org
							</a>
						</span>
						<span>© {new Date().getFullYear()} · MIT</span>
					</div>
				</footer>
			</div>
		</div>
	);
}
