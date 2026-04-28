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
import { NumberField } from "./components/ui/number-field";
import { Select } from "./components/ui/select";
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
			<h2 className="mt-5 font-display text-3xl font-light leading-[1.04] tracking-[-0.02em] text-foreground sm:mt-6 sm:text-4xl md:text-5xl lg:text-[56px]">
				{title}
			</h2>
			<p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-muted-foreground sm:mt-5 sm:text-[15px]">
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
			className="grid gap-10 border-t border-white/[0.06] py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-20 lg:py-24"
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

			<div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10">
				{/* Topbar */}
				<header className="sticky top-0 z-50 -mx-4 flex items-center justify-between gap-3 border-b border-white/[0.06] bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:gap-4 sm:px-6 sm:py-5 lg:-mx-10 lg:px-10">
					<div className="flex shrink-0 items-center gap-2.5 font-display text-[12px] font-medium uppercase tracking-[0.28em] text-foreground sm:text-[15px] sm:tracking-[0.32em]">
						<RiyalSymbol size={16} /> Riyal
					</div>
					<nav className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:gap-6 sm:tracking-[0.22em] md:gap-8">
						<a className="transition-colors hover:text-foreground" href="#install">
							Install
						</a>
						<a className="transition-colors hover:text-foreground" href="#samples">
							Samples
						</a>
						<a className="hidden transition-colors hover:text-foreground sm:inline" href="#api">
							API
						</a>
						<a
							className="hidden transition-colors hover:text-foreground md:inline"
							href="https://github.com/pooyagolchian/riyal"
						>
							GitHub
						</a>
					</nav>
					<div className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground sm:block sm:text-[10px]">
						v1.0 · MIT
					</div>
				</header>

				{/* Hero */}
				<section className="grid items-center gap-10 py-12 sm:gap-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:py-32">
					<div className="min-w-0">
						<div className="inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground sm:text-[10px] sm:tracking-[0.32em]">
							<span className="h-px w-8 bg-white/30" />
							The Saudi Riyal · U+20C1
						</div>
						<h1 className="mt-5 font-display text-[36px] font-light leading-[0.96] tracking-[-0.03em] text-foreground sm:mt-8 sm:text-[64px] sm:leading-[0.94] sm:tracking-[-0.035em] md:text-[88px] lg:text-[112px]">
							The currency
							<br />
							of <span className="italic text-white/70">tomorrow,</span>
							<br />
							rendered today.
						</h1>
						<p className="mt-6 max-w-[58ch] text-[14px] leading-relaxed text-muted-foreground sm:mt-10 sm:text-[17px]">
							A complete typographic toolkit for the official Saudi Riyal sign — font, React, Web
							Components, Tailwind, OG cards, VAT &amp; FX. Pixel-precise. Locale-aware. Effortless.
						</p>
						<div className="mt-8 flex flex-wrap gap-3 sm:mt-12">
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
						className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center overflow-hidden border border-white/[0.07] bg-[#040404] sm:max-w-[520px] lg:max-w-none"
						aria-hidden="true"
					>
						<span className="absolute left-0 top-0 p-4 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground sm:p-5">
							U+20C1
						</span>
						<span className="absolute right-0 top-0 p-4 text-right font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground sm:p-5">
							SAR · ر.س
						</span>
						<span className="absolute bottom-0 left-0 p-4 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground sm:p-5">
							SAMA · 2025
						</span>
						<span className="absolute bottom-0 right-0 p-4 text-right font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground sm:p-5">
							Unicode 17.0
						</span>
						<RiyalIcon className="h-[55%] w-[55%]" />
					</div>
				</section>

				{/* Stats */}
				<div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06] border-y border-white/[0.06] md:grid-cols-4 md:divide-y-0">
					{[
						{ v: "U+20C1", l: "Codepoint" },
						{ v: "11", l: "Entry points" },
						{ v: "15%", l: "VAT default" },
						{ v: "2", l: "RTL · LTR" },
					].map((s) => (
						<div key={s.l} className="px-6 py-10 sm:px-8 sm:py-12">
							<div className="font-display text-3xl font-light leading-none text-foreground sm:text-4xl lg:text-5xl">
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
						<div className="-mx-5 flex items-center gap-6 overflow-x-auto border-y border-white/[0.06] px-5 py-8 sm:mx-0 sm:gap-8 sm:px-0">
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

			<div className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-10">
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
						<div className="grid gap-5 sm:grid-cols-2">
							<div className="flex flex-col gap-2">
								<label
									htmlFor="fmt-amount"
									className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
								>
									Amount
								</label>
								<NumberField
									value={amount}
									onValueChange={setAmount}
									step={0.01}
									min={0}
									prefix={<RiyalSymbol size={12} />}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label
									htmlFor="fmt-decimals"
									className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
								>
									Decimals
								</label>
								<Select
									id="fmt-decimals"
									value={decimals}
									onChange={(e) => setDecimals(Number.parseInt(e.target.value, 10))}
								>
									{[0, 1, 2, 3, 4].map((d) => (
										<option key={d} value={d} className="bg-black">
											{d}
										</option>
									))}
								</Select>
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
						<div className="group flex h-14 w-full items-stretch border border-white/10 bg-white/[0.015] transition-colors focus-within:border-white/40 hover:border-white/25">
							<span className="flex items-center border-r border-white/10 px-4 text-white/55">
								<RiyalSymbol size={14} />
							</span>
							<RiyalInput
								className="hide-spinner h-full min-w-0 flex-1 bg-transparent px-4 font-display text-2xl text-foreground outline-none placeholder:text-white/25"
								value={amount}
								onValueChange={(v) => setAmount(v)}
								placeholder="0.00"
							/>
						</div>
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
								className="group relative flex min-h-[160px] flex-col gap-3 border-b border-r border-white/[0.06] p-6 transition-colors hover:bg-white/[0.02] sm:min-h-[200px] sm:p-8"
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

				{/* 11 — Next.js + OG */}
				<Section
					num="11 — Next.js & OG"
					title="Server-rendered, edge-ready."
					description="A first-class next/font helper for zero-CLS embedding, and Satori-ready JSX so your share images carry the SAMA glyph too."
				>
					<Card>
						<CardHeader>
							<CardTitle>app/layout.tsx</CardTitle>
							<Badge>next/font</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">import</span> <span className="tok-n">{"{ riyal }"}</span>{" "}
							<span className="tok-k">from</span> <span className="tok-s">"riyal/next"</span>;{"\n"}
							<span className="tok-k">import</span> <span className="tok-s">"riyal/css"</span>
							{";"}
							{"\n\n"}
							<span className="tok-k">const</span> riyalFont = <span className="tok-f">riyal</span>(
							{"{"} display: <span className="tok-s">"swap"</span> {"}"});{"\n\n"}
							<span className="tok-k">export default function</span>{" "}
							<span className="tok-f">RootLayout</span>({"{"} children {"}"}) {"{"}
							{"\n  "}
							<span className="tok-k">return</span> ({"\n    "}
							<span className="tok-k">&lt;html</span> <span className="tok-n">className</span>=
							<span className="tok-n">{"{riyalFont.className}"}</span>
							<span className="tok-k">&gt;</span>
							{"\n      "}
							<span className="tok-k">&lt;body&gt;</span>
							{"{children}"}
							<span className="tok-k">&lt;/body&gt;</span>
							{"\n    "}
							<span className="tok-k">&lt;/html&gt;</span>
							{"\n  "});{"\n"}
							{"}"}
						</pre>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>app/og/route.tsx</CardTitle>
							<Badge>satori · next/og</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ ImageResponse }"}</span>{" "}
							<span className="tok-k">from</span> <span className="tok-s">"next/og"</span>;{"\n"}
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ RiyalOGCard }"}</span> <span className="tok-k">from</span>{" "}
							<span className="tok-s">"riyal/og"</span>;{"\n\n"}
							<span className="tok-k">export async function</span>{" "}
							<span className="tok-f">GET</span>() {"{"}
							{"\n  "}
							<span className="tok-k">return new</span> <span className="tok-f">ImageResponse</span>
							({"\n    "}(<span className="tok-k">&lt;RiyalOGCard</span>
							{"\n      "}
							<span className="tok-n">title</span>=<span className="tok-s">"Pricing"</span>
							{"\n      "}
							<span className="tok-n">amount</span>=<span className="tok-n">{"{2499.99}"}</span>
							{"\n      "}
							<span className="tok-n">locale</span>=<span className="tok-s">"ar-SA"</span>
							{"\n    "}/&gt;{"\n  "}),{"\n  "}
							{"{"} width: <span className="tok-n">1200</span>, height:{" "}
							<span className="tok-n">630</span> {"}"},{"\n  "}
							);{"\n"}
							{"}"}
						</pre>
					</Card>
				</Section>

				{/* 12 — Hooks & live FX */}
				<Section
					num="12 — Hooks & FX"
					title="Live rates, suspense-ready."
					description="useRiyalRate caches in-memory and exposes loading/error/refresh. Pair with formatRiyal in the same render to get a localised, converted number."
				>
					<Card>
						<CardHeader>
							<CardTitle>useRiyalRate</CardTitle>
							<Badge>react</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ useRiyalRate }"}</span>{" "}
							<span className="tok-k">from</span> <span className="tok-s">"riyal/react"</span>
							{";"}
							{"\n\n"}
							<span className="tok-k">function</span> <span className="tok-f">UsdPrice</span>({"{"}{" "}
							sar {"}"}: {"{"} sar: <span className="tok-k">number</span> {"}"}) {"{"}
							{"\n  "}
							<span className="tok-k">const</span> {"{"} rate, loading, error, refresh {"}"} ={" "}
							<span className="tok-f">useRiyalRate</span>(<span className="tok-s">"USD"</span>);
							{"\n  "}
							<span className="tok-k">if</span> (loading) <span className="tok-k">return</span>{" "}
							<span className="tok-s">"\u2026"</span>;{"\n  "}
							<span className="tok-k">if</span> (error || !rate){" "}
							<span className="tok-k">return</span> <span className="tok-s">"\u2014"</span>;{"\n  "}
							<span className="tok-k">return</span> <span className="tok-k">&lt;span&gt;</span>
							{"$"}
							{"{"}(sar * rate).toFixed(<span className="tok-n">2</span>){"}"}
							<span className="tok-k">&lt;/span&gt;</span>;{"\n"}
							{"}"}
						</pre>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>parseRiyal · tolerant</CardTitle>
							<Badge>RTL · compact · code</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-f">parseRiyal</span>(
							<span className="tok-s">"\u20C1 1,234.50"</span>){"        "}
							<span className="tok-c">{"// → 1234.5"}</span>
							{"\n"}
							<span className="tok-f">parseRiyal</span>(
							<span className="tok-s">"SAR 2,500.00"</span>){"     "}
							<span className="tok-c">{"// → 2500"}</span>
							{"\n"}
							<span className="tok-f">parseRiyal</span>(<span className="tok-s">"1.5M \u20C1"</span>
							){"           "}
							<span className="tok-c">{"// → 1500000"}</span>
							{"\n"}
							<span className="tok-f">parseRiyal</span>(
							<span className="tok-s">
								"\u0661\u066c\u0662\u0663\u0664\u066b\u0665\u0660 \u20c1"
							</span>
							){"        "}
							<span className="tok-c">{"// → 1234.5"}</span>
							{"\n"}
							<span className="tok-f">parseRiyal</span>(<span className="tok-s">"99.90 ر.س"</span>)
							{"        "}
							<span className="tok-c">{"// → 99.9"}</span>
						</pre>
					</Card>
				</Section>

				{/* 13 — Clipboard, CSS, CLI */}
				<Section
					num="13 — Clipboard · CSS · CLI"
					title="Every channel, covered."
					description="Copy the glyph in Unicode, HTML or CSS form. Drop in pure CSS/SCSS without JavaScript. Generate fonts and OG cards from the terminal."
				>
					<Card>
						<CardHeader>
							<CardTitle>copyRiyalSymbol &amp; copyRiyalAmount</CardTitle>
							<Badge>browser</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ copyRiyalSymbol, copyRiyalAmount }"}</span>{" "}
							<span className="tok-k">from</span> <span className="tok-s">"riyal"</span>;{"\n\n"}
							<span className="tok-k">await</span> <span className="tok-f">copyRiyalSymbol</span>();
							{"          "}
							<span className="tok-c">{`// "\u20C1"`}</span>
							{"\n"}
							<span className="tok-k">await</span> <span className="tok-f">copyRiyalSymbol</span>(
							<span className="tok-s">"html"</span>);{"    "}
							<span className="tok-c">{'// "&#x20C1;"'}</span>
							{"\n"}
							<span className="tok-k">await</span> <span className="tok-f">copyRiyalSymbol</span>(
							<span className="tok-s">"css"</span>);
							{"     "}
							<span className="tok-c">{'// "\\\\20C1"'}</span>
							{"\n"}
							<span className="tok-k">await</span> <span className="tok-f">copyRiyalAmount</span>(
							<span className="tok-n">2499.99</span>,{" "}
							<span className="tok-n">{'{ locale: "ar-SA" }'}</span>);
						</pre>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Pure CSS · SCSS</CardTitle>
							<Badge>no JS</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">@import</span> <span className="tok-s">"riyal/css"</span>
							{";"}
							{"\n\n"}
							.price::before {"{"}
							{"\n  "}content: <span className="tok-s">"\\20C1\\00a0"</span>;{"\n  "}font-family:{" "}
							<span className="tok-s">"Riyal", system-ui</span>;{"\n"}
							{"}"}
							{"\n\n"}
							<span className="tok-c">{"/* SCSS */"}</span>
							{"\n"}
							<span className="tok-k">@use</span> <span className="tok-s">"riyal/scss"</span>{" "}
							<span className="tok-k">as</span> riyal;{"\n"}
							.total {"{"} <span className="tok-k">@include</span> riyal.symbol-prefix; {"}"}
						</pre>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>CLI</CardTitle>
							<Badge>npx riyal</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-c"># print info & codepoint table</span>
							{"\n"}
							<span className="tok-f">npx</span> riyal{"\n\n"}
							<span className="tok-c"># pipe the symbol straight to your clipboard</span>
							{"\n"}
							<span className="tok-f">npx</span> riyal copy unicode{"\n"}
							<span className="tok-f">npx</span> riyal copy html{"\n"}
							<span className="tok-f">npx</span> riyal copy css
						</pre>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>React Native</CardTitle>
							<Badge>Expo · bare</Badge>
						</CardHeader>
						<pre className="code-block">
							<span className="tok-k">import</span>{" "}
							<span className="tok-n">{"{ RiyalSymbol, RiyalPrice }"}</span>{" "}
							<span className="tok-k">from</span>{" "}
							<span className="tok-s">"riyal/react-native"</span>;{"\n\n"}
							<span className="tok-k">&lt;View&gt;</span>
							{"\n  "}
							<span className="tok-k">&lt;RiyalSymbol</span> <span className="tok-n">size</span>=
							<span className="tok-n">{"{32}"}</span> <span className="tok-k">/&gt;</span>
							{"\n  "}
							<span className="tok-k">&lt;RiyalPrice</span> <span className="tok-n">amount</span>=
							<span className="tok-n">{"{1234.5}"}</span> <span className="tok-n">locale</span>=
							<span className="tok-s">"ar-SA"</span>
							<span className="tok-k">/&gt;</span>
							{"\n"}
							<span className="tok-k">&lt;/View&gt;</span>
						</pre>
					</Card>
				</Section>

				{/* Footer */}
				<footer className="grid items-end gap-10 border-t border-white/[0.06] py-16 sm:grid-cols-2 sm:py-24">
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
