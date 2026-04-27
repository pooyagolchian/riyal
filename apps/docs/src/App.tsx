import { useState } from "react";
import {
	RIYAL_HTML_ENTITY,
	RIYAL_SYMBOL_TEXT,
	RIYAL_UNICODE,
	addVAT,
	formatRiyal,
	parseRiyal,
} from "riyal";
import {
	AnimatedRiyalPrice,
	RiyalIcon,
	RiyalInput,
	RiyalPrice,
	RiyalSymbol,
} from "riyal/react";

export function App() {
	const [amount, setAmount] = useState<number | "">(1234.5);
	const numeric = typeof amount === "number" && Number.isFinite(amount) ? amount : 0;

	return (
		<main>
			<header>
				<h1>
					<RiyalSymbol size={48} /> riyal
				</h1>
				<p>The Saudi Riyal currency symbol (U+20C1) for the modern web.</p>
				<code>npm install riyal</code>
			</header>

			<section>
				<h2>Symbol</h2>
				<p>
					Unicode: <code>{RIYAL_UNICODE}</code> · Text:{" "}
					<code>{RIYAL_SYMBOL_TEXT}</code> · HTML: <code>{RIYAL_HTML_ENTITY}</code>
				</p>
				<p>
					<RiyalSymbol size={32} />
					<RiyalIcon size={32} />
				</p>
			</section>

			<section>
				<h2>Formatted price</h2>
				<RiyalPrice amount={numeric} /> ·{" "}
				<RiyalPrice amount={numeric} locale="ar-SA" /> ·{" "}
				<RiyalPrice amount={numeric} useCode />
			</section>

			<section>
				<h2>Animated price</h2>
				<AnimatedRiyalPrice amount={numeric} /> ·{" "}
				<button type="button" onClick={() => setAmount(Math.random() * 10000)}>
					Randomize
				</button>
			</section>

			<section>
				<h2>Input</h2>
				<RiyalInput value={amount} onValueChange={(v) => setAmount(v)} />
			</section>

			<section>
				<h2>VAT (15%)</h2>
				<p>
					{formatRiyal(numeric)} +VAT = {formatRiyal(addVAT(numeric))}
				</p>
			</section>

			<section>
				<h2>Parse</h2>
				<p>
					{`parseRiyal("${RIYAL_SYMBOL_TEXT} 2,500.00")`} →{" "}
					{String(parseRiyal(`${RIYAL_SYMBOL_TEXT} 2,500.00`))}
				</p>
			</section>

			<footer>
				<a href="https://github.com/pooyagolchian/riyal">GitHub</a> ·{" "}
				<a href="https://www.npmjs.com/package/riyal">npm</a>
			</footer>
		</main>
	);
}
