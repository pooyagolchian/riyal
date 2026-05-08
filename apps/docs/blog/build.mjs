// Build the SEO-targeted "How to display the Saudi Riyal symbol in <stack>"
// guides as static HTML pages. Each post becomes its own URL so it can rank
// individually on Google, Perplexity, and AI search engines.
//
// Run: `node apps/docs/blog/build.mjs`. Outputs:
//   apps/docs/public/blog/<slug>/index.html  — one per guide
//   apps/docs/public/blog/index.html         — the listing page
//
// Wired into the docs `dev` and `build` scripts so HTML stays in sync.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outRoot = path.resolve(here, "../public/blog");
fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

const SITE = "https://riyal.js.org";
const AUTHOR = "Pooya Golchian";
const TODAY = "2026-05-08";

/** @type {{ slug: string; title: string; metaTitle: string; description: string; readingMinutes: number; body: string }[]} */
const posts = [
	{
		slug: "saudi-riyal-symbol-in-react",
		title: "How to display the Saudi Riyal symbol (U+20C1) in React",
		metaTitle: "How to display the Saudi Riyal symbol (U+20C1) in React — riyal/react",
		description:
			"Drop the official SAMA Saudi Riyal sign into any React app with riyal/react. Install once, import RiyalPrice or RiyalSymbol, render anywhere — no font setup, SSR-safe, with an optional masked input that handles SAR / ⃁ / Arabic-numeral paste.",
		readingMinutes: 4,
		body: `<p>The Saudi Riyal got an <strong>official Unicode codepoint, U+20C1</strong>, in Unicode 17.0 (September 2025). Most operating-system fonts haven&rsquo;t shipped the new glyph yet, so showing it in a React app means either embedding the font or rendering inline SVG. The <code>riyal</code> package does both for you.</p>

<h2 id="install">Install</h2>
<pre><code>npm install riyal
# or
pnpm add riyal
yarn add riyal
bun add riyal</code></pre>
<p><code>react &ge; 18</code> is the only peer dependency for <code>riyal/react</code>; everything else is optional.</p>

<h2 id="render">Render the symbol</h2>
<pre><code>import { RiyalSymbol, RiyalIcon } from &quot;riyal/react&quot;;

&lt;RiyalSymbol size={24} /&gt;
&lt;RiyalIcon width={32} height={32} /&gt;
</code></pre>
<p>Both render the SAMA glyph as inline SVG, so they work in Server Components and before any web font has loaded — no &ldquo;tofu&rdquo; (rectangular fallback boxes) ever.</p>

<h2 id="format">Format a price</h2>
<pre><code>import { RiyalPrice } from &quot;riyal/react&quot;;

&lt;RiyalPrice amount={2499.99} /&gt;            // ⃁ 2,499.99
&lt;RiyalPrice amount={2499.99} locale=&quot;ar-SA&quot; /&gt; // ⃁ ٢٬٤٩٩٫٩٩
&lt;RiyalPrice amount={1500000} notation=&quot;compact&quot; /&gt; // ⃁ 1.5M
</code></pre>
<p><code>RiyalPrice</code> wraps <code>Intl.NumberFormat</code>, so it speaks every BCP-47 locale and respects RTL placement automatically.</p>

<h2 id="masked-input">Masked currency input</h2>
<p>Form inputs are where most React-and-SAR projects bog down. <code>riyal/react</code> ships a controlled <code>&lt;RiyalInput&gt;</code> with an opt-in <code>mask</code> prop that delivers format-as-you-type editing, paste cleanup, Arabic-numeral normalisation, and caret preservation:</p>
<pre><code>import { useState } from &quot;react&quot;;
import { RiyalInput } from &quot;riyal/react&quot;;

function PriceField() {
  const [value, setValue] = useState&lt;number | &quot;&quot;&gt;(0);
  return &lt;RiyalInput mask value={value} onValueChange={setValue} /&gt;;
}
</code></pre>
<p>Pasting <code>&quot;SAR 2,499.99&quot;</code>, <code>&quot;⃁ 2,499.99&quot;</code>, or <code>&quot;٢٤٩٩٫٩٩&quot;</code> all yield <code>2499.99</code> with a <code>2,499.99</code> display. That&rsquo;s the input behaviour that drives <a href="https://www.npmjs.com/package/react-number-format">react-number-format</a>&rsquo;s ~2.4M weekly downloads — without bringing in a 100&nbsp;kB dependency.</p>

<h2 id="vat">Saudi VAT &amp; conversion</h2>
<pre><code>import { addVAT, removeVAT, getVAT, convertFromSAR } from &quot;riyal&quot;;

addVAT(1000);              // 1150  (15% Saudi VAT)
removeVAT(1150);           // 1000
await convertFromSAR(1000, &quot;USD&quot;);  // SAR → USD via cached rates
</code></pre>

<h2 id="next-steps">Next steps</h2>
<ul>
  <li>Quick install: <a href="${SITE}/#install">${SITE}/#install</a></li>
  <li>API reference: <a href="${SITE}/#reference">${SITE}/#reference</a></li>
  <li>shadcn registry: <code>npx shadcn@latest add ${SITE}/r/riyal-amount-input.json</code></li>
  <li>Source on GitHub: <a href="https://github.com/pooyagolchian/riyal">pooyagolchian/riyal</a></li>
</ul>`,
	},

	{
		slug: "saudi-riyal-symbol-in-vue",
		title: "How to display the Saudi Riyal symbol (U+20C1) in Vue 3",
		metaTitle: "How to display the Saudi Riyal symbol (U+20C1) in Vue 3 / Nuxt — riyal/vue",
		description:
			"First-class Vue 3 components for the official SAMA Saudi Riyal sign. Install once, render with <RiyalPrice>, edit with <RiyalInput v-model mask>, and read live SAR exchange rates with the useRiyalRate composable. SSR-safe, Nuxt-ready.",
		readingMinutes: 4,
		body: `<p>If you&rsquo;re building a Saudi e-commerce or fintech app on Vue 3 (or Nuxt), the <code>riyal/vue</code> entry gives you idiomatic components for the official Saudi Riyal symbol — no Web-Component wrapper required.</p>

<h2 id="install">Install</h2>
<pre><code>pnpm add riyal vue
# or npm install riyal vue
</code></pre>
<p><code>vue &ge; 3.4</code> is an optional peer dependency. The components are render-function based (<code>defineComponent</code> + <code>h()</code>), so no Vue compiler plugin is needed in your app.</p>

<h2 id="basic">Basic usage</h2>
<pre><code>&lt;script setup lang=&quot;ts&quot;&gt;
import { ref } from &quot;vue&quot;;
import {
  RiyalSymbol, RiyalIcon, RiyalPrice,
  AnimatedRiyalPrice, RiyalInput, useRiyalRate,
} from &quot;riyal/vue&quot;;

const amount = ref&lt;number | &quot;&quot;&gt;(2499.99);
const usd = useRiyalRate(&quot;USD&quot;);
&lt;/script&gt;

&lt;template&gt;
  &lt;RiyalSymbol :size=&quot;24&quot; /&gt;
  &lt;RiyalIcon :width=&quot;32&quot; :height=&quot;32&quot; /&gt;
  &lt;RiyalPrice :amount=&quot;2499.99&quot; locale=&quot;ar-SA&quot; /&gt;
  &lt;AnimatedRiyalPrice :amount=&quot;amount&quot; :duration-ms=&quot;600&quot; /&gt;
  &lt;RiyalInput v-model=&quot;amount&quot; mask /&gt;
  &lt;span v-if=&quot;usd.rate.value&quot;&gt;
    {{ (Number(amount) * usd.rate.value).toFixed(2) }} USD
  &lt;/span&gt;
&lt;/template&gt;
</code></pre>

<h2 id="masked">Masked input — paste anything</h2>
<p>Pass <code>mask</code> to <code>&lt;RiyalInput&gt;</code> and the input becomes a format-as-you-type field that handles paste of every common SAR string format:</p>
<ul>
  <li><code>&quot;SAR 2,499.99&quot;</code> → <code>2499.99</code></li>
  <li><code>&quot;⃁ 2,499.99&quot;</code> → <code>2499.99</code></li>
  <li><code>&quot;٢٤٩٩٫٩٩&quot;</code> → <code>2499.99</code> (Arabic-Indic digits)</li>
  <li><code>&quot;99.90 ر.س&quot;</code> → <code>99.9</code></li>
</ul>
<p>It also strips RTL marks, normalises Arabic decimal/grouping characters, enforces a max-decimals window, and preserves caret position via a digit-counting algorithm — so cursor placement during edits stays where the user expects.</p>

<h2 id="ssr">SSR &amp; Nuxt</h2>
<p>Every component is SSR-safe. <code>RiyalPrice</code> and <code>RiyalSymbol</code> render the same markup on the server and client, so they don&rsquo;t cause hydration mismatches inside <code>&lt;ClientOnly&gt;</code> blocks. The <code>useRiyalRate</code> composable defers the fetch to <code>onMounted</code>, so it stays server-render-safe.</p>

<h2 id="vat">Cart, VAT, conversion</h2>
<pre><code>import { lineItem, cartTotal } from &quot;riyal/cart&quot;;

const items = [
  lineItem({ unit: 75, qty: 1 }),
  lineItem({ unit: 45, qty: 2 }),
];
const totals = cartTotal(items, { shipping: 20, discount: 10 });
// → { subtotal, vat, shipping, total, ... }
</code></pre>
<p>The cart helpers default to Saudi 15% VAT and apply discounts proportionally to net + VAT, matching how Saudi receipts present them.</p>

<h2 id="next-steps">Next steps</h2>
<ul>
  <li>Live demo: <a href="${SITE}/">${SITE}</a></li>
  <li>API reference: <a href="${SITE}/#reference">${SITE}/#reference</a></li>
  <li>npm: <a href="https://www.npmjs.com/package/riyal">npmjs.com/package/riyal</a></li>
</ul>`,
	},

	{
		slug: "saudi-riyal-symbol-in-svelte",
		title: "How to display the Saudi Riyal symbol (U+20C1) in Svelte 5",
		metaTitle:
			"How to display the Saudi Riyal symbol (U+20C1) in Svelte 5 / SvelteKit — riyal/svelte",
		description:
			"Native Svelte 5 components using runes for the official SAMA Saudi Riyal sign. RiyalPrice, RiyalInput with mask, and a rune-based useRiyalRate composable. Compiles directly with your Vite or SvelteKit bundler — no extra config.",
		readingMinutes: 3,
		body: `<p>Svelte 5 introduced runes (<code>$state</code>, <code>$derived</code>, <code>$effect</code>, <code>$bindable</code>) and broke compatibility with most older Svelte component libraries. The <code>riyal/svelte</code> entry was built rune-first, so it drops straight into Svelte 5 / SvelteKit projects without any runes-vs-stores juggling.</p>

<h2 id="install">Install</h2>
<pre><code>pnpm add riyal svelte
# or npm install riyal svelte
</code></pre>
<p><code>svelte &ge; 5</code> is an optional peer dependency. The package ships <code>.svelte</code> source so your bundler (Vite, SvelteKit) compiles it natively.</p>

<h2 id="basic">Basic usage</h2>
<pre><code>&lt;script lang=&quot;ts&quot;&gt;
  import {
    RiyalSymbol, RiyalIcon, RiyalPrice,
    AnimatedRiyalPrice, RiyalInput, useRiyalRate,
  } from &quot;riyal/svelte&quot;;

  let amount: number | &quot;&quot; = $state(2499.99);
  const usd = useRiyalRate(&quot;USD&quot;);
&lt;/script&gt;

&lt;RiyalSymbol size={24} /&gt;
&lt;RiyalIcon width={32} height={32} /&gt;
&lt;RiyalPrice amount={2499.99} locale=&quot;ar-SA&quot; /&gt;
&lt;AnimatedRiyalPrice amount={amount} durationMs={600} /&gt;
&lt;RiyalInput bind:value={amount} mask /&gt;

{#if usd.rate}
  &lt;span&gt;{((amount as number) * usd.rate).toFixed(2)} USD&lt;/span&gt;
{/if}
</code></pre>

<h2 id="masked">Masked input — paste-friendly</h2>
<p>The <code>mask</code> prop on <code>&lt;RiyalInput&gt;</code> turns the field into a format-as-you-type input. Pasting any of these into the field yields a clean number plus a perfectly grouped display:</p>
<ul>
  <li><code>&quot;SAR 2,499.99&quot;</code></li>
  <li><code>&quot;⃁ 2,499.99&quot;</code></li>
  <li><code>&quot;٢٤٩٩٫٩٩&quot;</code> (Arabic-Indic digits)</li>
</ul>
<p>Two-way binding via <code>bind:value</code> exposes the parsed numeric value to your component state.</p>

<h2 id="rate">Live SAR exchange rate (rune-based)</h2>
<p><code>useRiyalRate</code> is a factory that returns read-only rune getters plus a <code>refresh()</code> method:</p>
<pre><code>const usd = useRiyalRate(&quot;USD&quot;);
// usd.rate     → number | null  (read-only)
// usd.loading  → boolean
// usd.error    → Error | null
// usd.refresh() → void
</code></pre>
<p>The first invocation kicks off a 1-hour-cached fetch. Subsequent components share the same in-memory cache.</p>

<h2 id="next-steps">Next steps</h2>
<ul>
  <li>Live demo: <a href="${SITE}/">${SITE}</a></li>
  <li>API reference: <a href="${SITE}/#reference">${SITE}/#reference</a></li>
  <li>shadcn registry: <code>npx shadcn@latest add ${SITE}/r/riyal-checkout-summary.json</code></li>
</ul>`,
	},

	{
		slug: "saudi-riyal-symbol-in-tailwind",
		title: "How to display the Saudi Riyal symbol (U+20C1) with Tailwind CSS",
		metaTitle: "How to display the Saudi Riyal symbol (U+20C1) with Tailwind CSS — riyal/tailwind",
		description:
			"A first-class Tailwind plugin that ships the SAMA Saudi Riyal glyph plus utility classes for prices, weights, and theme tokens. Works with Tailwind v3 and v4, and pairs with the bundled WOFF2 font from riyal/css.",
		readingMinutes: 3,
		body: `<p>If your stack is Tailwind-first, the <code>riyal/tailwind</code> plugin gives you the official SAMA Saudi Riyal glyph as a set of utility classes — <code>riyal-symbol</code>, <code>riyal-price</code>, <code>font-riyal</code>, plus weight and size variants — without writing any custom CSS.</p>

<h2 id="install">Install</h2>
<pre><code>pnpm add riyal tailwindcss
</code></pre>
<p>Add the plugin to your <code>tailwind.config.{js,ts}</code>:</p>
<pre><code>import riyal from &quot;riyal/tailwind&quot;;

export default {
  content: [&quot;./src/**/*.{ts,tsx,vue,svelte,html}&quot;],
  plugins: [riyal()],
};
</code></pre>

<h2 id="font">Load the bundled font</h2>
<p>The Tailwind plugin assumes the <code>Riyal</code> font is registered. Either import the bundled CSS or set it up yourself:</p>
<pre><code>/* Easiest — adds @font-face for all weights */
@import &quot;riyal/css&quot;;
</code></pre>
<p>Real WOFF2/WOFF/TTF files (Regular 400, Medium 500, Bold 700) ship inside the package, generated from the SAMA master SVG via opentype.js + wawoff2. The <code>@font-face</code> declarations have <code>unicode-range: U+20C1</code> set, so the font only loads when a page actually renders the glyph.</p>

<h2 id="utilities">Utility classes</h2>
<pre><code>&lt;span class=&quot;riyal-symbol text-3xl&quot;&gt;&lt;/span&gt;

&lt;p class=&quot;riyal-price text-foreground&quot;&gt;2,499.99&lt;/p&gt;

&lt;span class=&quot;font-riyal&quot;&gt;⃁ 99.90&lt;/span&gt;
</code></pre>
<ul>
  <li><code>riyal-symbol</code> — renders the U+20C1 glyph via <code>::before</code>; pair with size utilities (<code>text-sm</code>, <code>text-3xl</code>, etc.).</li>
  <li><code>riyal-price</code> — prefixes the symbol on any element, with a small inline-end margin for readability.</li>
  <li><code>font-riyal</code> — sets <code>font-family: &quot;Riyal&quot;, system-ui</code> for raw text where you&rsquo;ve typed the U+20C1 codepoint directly.</li>
</ul>

<h2 id="combine">Combine with riyal/react components</h2>
<pre><code>import { RiyalPrice } from &quot;riyal/react&quot;;

&lt;RiyalPrice
  amount={2499.99}
  className=&quot;text-3xl font-semibold tabular-nums tracking-tight&quot;
/&gt;
</code></pre>
<p>The React component renders inline SVG, so it doesn&rsquo;t depend on the Tailwind plugin. Mix and match as needed.</p>

<h2 id="shadcn">Tailwind + shadcn registry</h2>
<p>Drop production-ready components into your project with one command:</p>
<pre><code>npx shadcn@latest add ${SITE}/r/riyal-price-tag.json
npx shadcn@latest add ${SITE}/r/riyal-amount-input.json
npx shadcn@latest add ${SITE}/r/riyal-checkout-summary.json
</code></pre>

<h2 id="next-steps">Next steps</h2>
<ul>
  <li>Plugin source: <a href="https://github.com/pooyagolchian/riyal/tree/main/packages/riyal-symbol/src/tailwind">github.com/pooyagolchian/riyal — src/tailwind</a></li>
  <li>Live demo: <a href="${SITE}/">${SITE}</a></li>
</ul>`,
	},

	{
		slug: "saudi-riyal-symbol-in-nextjs",
		title: "How to display the Saudi Riyal symbol (U+20C1) in Next.js",
		metaTitle:
			"How to display the Saudi Riyal symbol (U+20C1) in Next.js (App Router) — riyal/next",
		description:
			"Use riyal/next + riyal/react for zero-CLS embedding of the official SAMA Saudi Riyal sign in Next.js 13+ apps. Server Components, Client Components, OG image cards, and a checkout-grade masked input all in one package.",
		readingMinutes: 4,
		body: `<p>Next.js 13+ moved type rendering to <code>next/font</code> and split components into Server vs Client. <code>riyal/next</code> wires the bundled SAMA glyph into <code>next/font/local</code> for zero CLS, and <code>riyal/react</code> exposes Server-Component-safe and Client-Component-only primitives so you pick the right one.</p>

<h2 id="install">Install</h2>
<pre><code>pnpm add riyal next react react-dom
</code></pre>
<p><code>next &ge; 13</code> and <code>react &ge; 18</code> are optional peer dependencies.</p>

<h2 id="font">Wire the font once in app/layout.tsx</h2>
<pre><code>import { riyalFont } from &quot;riyal/next&quot;;
import &quot;riyal/css&quot;;

const font = riyalFont({ display: &quot;swap&quot; });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    &lt;html lang=&quot;en&quot; className={font.className}&gt;
      &lt;body&gt;{children}&lt;/body&gt;
    &lt;/html&gt;
  );
}
</code></pre>
<p><code>riyalFont</code> wraps <code>next/font/local</code> with the bundled WOFF2 + Regular/Medium/Bold weights, served self-host (no third-party request) with <code>font-display: swap</code> by default.</p>

<h2 id="server">Server Components</h2>
<p>Render prices anywhere — they&rsquo;re SSR-safe, hydration-clean, and work in async Server Components:</p>
<pre><code>// app/(shop)/[product]/page.tsx — Server Component, no &quot;use client&quot;
import { RiyalPrice } from &quot;riyal/react&quot;;

export default async function ProductPage({ params }: { params: { product: string } }) {
  const product = await fetchProduct(params.product);
  return (
    &lt;article&gt;
      &lt;h1&gt;{product.title}&lt;/h1&gt;
      &lt;p&gt;&lt;RiyalPrice amount={product.priceSAR} /&gt;&lt;/p&gt;
    &lt;/article&gt;
  );
}
</code></pre>

<h2 id="client">Client Components — masked input</h2>
<p><code>RiyalInput</code>, <code>AnimatedRiyalPrice</code>, and <code>useRiyalRate</code> use <code>useState</code> / <code>requestAnimationFrame</code> and need a <code>&quot;use client&quot;</code> directive:</p>
<pre><code>&quot;use client&quot;;
import { useState } from &quot;react&quot;;
import { RiyalInput } from &quot;riyal/react&quot;;

export function CheckoutForm() {
  const [amount, setAmount] = useState&lt;number | &quot;&quot;&gt;(0);
  return &lt;RiyalInput mask value={amount} onValueChange={setAmount} /&gt;;
}
</code></pre>

<h2 id="og">OG image cards</h2>
<p>Pair <code>riyal/og</code> with <code>next/og</code> to bake the SAMA glyph into share images for social platforms:</p>
<pre><code>// app/og/route.tsx
import { ImageResponse } from &quot;next/og&quot;;
import { RiyalPriceCard } from &quot;riyal/og&quot;;

export async function GET() {
  return new ImageResponse(
    &lt;RiyalPriceCard title=&quot;Pricing&quot; amount={2499.99} locale=&quot;ar-SA&quot; /&gt;,
    { width: 1200, height: 630 },
  );
}
</code></pre>
<p>The card is Satori-ready and renders the glyph inline, so Twitter / LinkedIn / etc. don&rsquo;t need to load any font.</p>

<h2 id="checkout">Cart math &amp; VAT</h2>
<pre><code>import { lineItem, cartTotal } from &quot;riyal/cart&quot;;

const totals = cartTotal(items, { shipping: 20, discount: 10 });
// totals.netTotal, totals.vat, totals.total — Saudi-15%-VAT defaults
</code></pre>

<h2 id="next-steps">Next steps</h2>
<ul>
  <li>shadcn registry — drop production components in: <code>npx shadcn@latest add ${SITE}/r/riyal-checkout-summary.json</code></li>
  <li>Live demo: <a href="${SITE}/">${SITE}</a></li>
  <li>npm: <a href="https://www.npmjs.com/package/riyal">npmjs.com/package/riyal</a></li>
</ul>`,
	},

	{
		slug: "saudi-riyal-symbol-in-angular-and-html",
		title: "How to display the Saudi Riyal symbol (U+20C1) in Angular, Solid, or vanilla HTML",
		metaTitle:
			"How to display the Saudi Riyal symbol (U+20C1) in Angular, Solid, or vanilla HTML — riyal/web-component",
		description:
			"Web Components for the official SAMA Saudi Riyal sign work in every framework: Angular, Solid, Qwik, Astro, vanilla HTML — anywhere Custom Elements run. <riyal-symbol>, <riyal-price>, <riyal-animated-price>, and <riyal-input> are all reactive, SSR-friendly, and shadow-DOM styled.",
		readingMinutes: 3,
		body: `<p>Not on React, Vue, or Svelte? <code>riyal/web-component</code> ships the same primitives as standard <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components">Custom Elements</a>. They work in Angular, Solid, Qwik, Astro, plain HTML — anywhere Custom Elements run.</p>

<h2 id="install">Install</h2>
<pre><code>pnpm add riyal
</code></pre>

<h2 id="register">Register the elements once</h2>
<pre><code>import { defineRiyalElements } from &quot;riyal/web-component&quot;;
defineRiyalElements();
</code></pre>
<p>Call this once at app boot. <code>defineRiyalElements</code> guards <code>typeof customElements</code> so it&rsquo;s safe to import in SSR environments — the element registration just no-ops on the server.</p>

<h2 id="markup">Use the elements</h2>
<pre><code>&lt;riyal-symbol size=&quot;1.5em&quot;&gt;&lt;/riyal-symbol&gt;

&lt;riyal-icon width=&quot;32&quot; height=&quot;32&quot;&gt;&lt;/riyal-icon&gt;

&lt;riyal-price amount=&quot;2499.99&quot; locale=&quot;ar-SA&quot; decimals=&quot;0&quot; compact&gt;&lt;/riyal-price&gt;

&lt;riyal-animated-price amount=&quot;1234&quot; duration=&quot;600&quot;&gt;&lt;/riyal-animated-price&gt;

&lt;riyal-input value=&quot;0&quot;&gt;&lt;/riyal-input&gt;
</code></pre>
<p>Every attribute is observed via <code>attributeChangedCallback</code>, so <code>setAttribute()</code> from any framework binding triggers a re-render with no extra boilerplate.</p>

<h2 id="angular">Angular</h2>
<p>Allow custom elements in your module config and bind via property/event syntax:</p>
<pre><code>// app.module.ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from &quot;@angular/core&quot;;

@NgModule({ schemas: [CUSTOM_ELEMENTS_SCHEMA] })
export class AppModule {}
</code></pre>
<pre><code>&lt;!-- component template --&gt;
&lt;riyal-price [attr.amount]=&quot;product.price&quot; locale=&quot;ar-SA&quot;&gt;&lt;/riyal-price&gt;
&lt;riyal-input [attr.value]=&quot;amount&quot; (riyal-change)=&quot;onChange($event.detail.value)&quot;&gt;&lt;/riyal-input&gt;
</code></pre>

<h2 id="events">riyal-input events</h2>
<p>The masked-style input dispatches a <code>CustomEvent(&quot;riyal-change&quot;, { detail: { value: number } })</code> on every change:</p>
<pre><code>document.querySelector(&quot;riyal-input&quot;).addEventListener(&quot;riyal-change&quot;, (e) =&gt; {
  console.log(e.detail.value); // number
});
</code></pre>

<h2 id="shadow-dom">Shadow DOM styling</h2>
<p>Each element uses a closed shadow root. Override the symbol colour and size with CSS custom properties on the host:</p>
<pre><code>riyal-price {
  --riyal-color: #006c35;   /* Saudi green */
  --riyal-size: 1.25rem;
}
</code></pre>

<h2 id="next-steps">Next steps</h2>
<ul>
  <li>Live demo: <a href="${SITE}/">${SITE}</a></li>
  <li>Web Component reference: <a href="${SITE}/#api">${SITE}/#api</a></li>
  <li>npm: <a href="https://www.npmjs.com/package/riyal">npmjs.com/package/riyal</a></li>
</ul>`,
	},
];

function articleJsonLd(post) {
	return {
		"@context": "https://schema.org",
		"@type": "TechArticle",
		headline: post.title,
		description: post.description,
		articleSection: "Guides",
		inLanguage: "en",
		datePublished: TODAY,
		dateModified: TODAY,
		author: { "@type": "Person", name: AUTHOR, url: "https://github.com/pooyagolchian" },
		publisher: { "@type": "Person", name: AUTHOR },
		mainEntityOfPage: `${SITE}/blog/${post.slug}/`,
		image: `${SITE}/og.png`,
		about: ["Saudi Riyal", "U+20C1", "SAR", "Currency formatting"],
		keywords: post.title,
	};
}

function htmlPage({ slug, metaTitle, description, body, readingMinutes, title }) {
	const canonical = `${SITE}/blog/${slug}/`;
	const ld = JSON.stringify(articleJsonLd({ slug, title, description }), null, 2);
	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="theme-color" content="#000000" />
		<meta name="color-scheme" content="dark" />
		<title>${escapeHtml(metaTitle)}</title>
		<meta name="description" content="${escapeHtml(description)}" />
		<meta name="author" content="${AUTHOR}" />
		<meta name="robots" content="index, follow, max-image-preview:large" />
		<link rel="canonical" href="${canonical}" />

		<meta property="og:type" content="article" />
		<meta property="og:title" content="${escapeHtml(metaTitle)}" />
		<meta property="og:description" content="${escapeHtml(description)}" />
		<meta property="og:url" content="${canonical}" />
		<meta property="og:image" content="${SITE}/og.png" />
		<meta property="article:author" content="${AUTHOR}" />
		<meta property="article:published_time" content="${TODAY}" />

		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content="${escapeHtml(metaTitle)}" />
		<meta name="twitter:description" content="${escapeHtml(description)}" />
		<meta name="twitter:image" content="${SITE}/og.png" />

		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt — concise LLM context" />
		<link rel="alternate" type="text/plain" href="/llms-full.txt" title="llms-full.txt — full LLM context" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" />
		<link rel="stylesheet" href="/blog/blog.css" />

		<script type="application/ld+json">${ld}</script>
	</head>
	<body>
		<header class="topbar">
			<a class="brand" href="/">⃁ Riyal</a>
			<nav>
				<a href="/">Home</a>
				<a href="/blog/">Guides</a>
				<a href="https://github.com/pooyagolchian/riyal">GitHub</a>
				<a href="https://www.npmjs.com/package/riyal">npm</a>
			</nav>
		</header>

		<main>
			<article>
				<p class="kicker">Guide · ${readingMinutes} min read · Updated ${TODAY}</p>
				<h1>${escapeHtml(title)}</h1>
				<p class="lead">${escapeHtml(description)}</p>
				${body}
				<hr />
				<p class="cta">Built by <a href="https://github.com/pooyagolchian">Pooya Golchian</a> · <a href="https://www.npmjs.com/package/riyal">riyal on npm</a> · <a href="${SITE}/">live demo</a></p>
			</article>
		</main>
	</body>
</html>
`;
}

function indexPage(posts) {
	const items = posts
		.map(
			(p) =>
				`			<li class="post">
				<a href="/blog/${p.slug}/">
					<h2>${escapeHtml(p.title)}</h2>
					<p>${escapeHtml(p.description)}</p>
					<span class="meta">${p.readingMinutes} min read · ${TODAY}</span>
				</a>
			</li>`,
		)
		.join("\n");
	return `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="theme-color" content="#000000" />
		<meta name="color-scheme" content="dark" />
		<title>Riyal guides — display the Saudi Riyal symbol in any framework</title>
		<meta name="description" content="Step-by-step guides for adding the official Saudi Riyal symbol (U+20C1) to React, Vue 3, Svelte 5, Tailwind, Next.js, Angular, Solid, and vanilla HTML. Each post is a self-contained walkthrough with install, render, and masked-input snippets." />
		<link rel="canonical" href="${SITE}/blog/" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" />
		<link rel="stylesheet" href="/blog/blog.css" />
	</head>
	<body>
		<header class="topbar">
			<a class="brand" href="/">⃁ Riyal</a>
			<nav>
				<a href="/">Home</a>
				<a href="/blog/" aria-current="page">Guides</a>
				<a href="https://github.com/pooyagolchian/riyal">GitHub</a>
				<a href="https://www.npmjs.com/package/riyal">npm</a>
			</nav>
		</header>
		<main>
			<header class="page-head">
				<p class="kicker">Guides</p>
				<h1>Display the Saudi Riyal symbol in any framework</h1>
				<p class="lead">Six self-contained walkthroughs — install in under 60 seconds, render in any stack, and ship a checkout-grade masked input on day one.</p>
			</header>
			<ul class="post-list">
${items}
			</ul>
		</main>
	</body>
</html>
`;
}

function blogCss() {
	return `*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
	background: #000;
	color: #fafafa;
	font-family: "Geist", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
	font-size: 16px;
	line-height: 1.65;
	-webkit-font-smoothing: antialiased;
}
a { color: #fafafa; text-decoration: underline; text-decoration-color: rgba(255,255,255,0.25); text-underline-offset: 3px; }
a:hover { text-decoration-color: rgba(255,255,255,0.85); }
.topbar {
	display: flex; align-items: center; justify-content: space-between; gap: 1rem;
	padding: 1rem 1.25rem;
	border-bottom: 1px solid rgba(255,255,255,0.06);
	font-family: "Geist Mono", ui-monospace, monospace;
	font-size: 11px;
	text-transform: uppercase;
	letter-spacing: 0.22em;
}
.topbar .brand { text-decoration: none; font-weight: 600; }
.topbar nav { display: flex; gap: 1.25rem; }
.topbar nav a { text-decoration: none; color: rgba(250,250,250,0.6); }
.topbar nav a:hover, .topbar nav a[aria-current="page"] { color: #fafafa; }
main { max-width: 720px; margin: 0 auto; padding: 3rem 1.25rem 6rem; }
.kicker { font-family: "Geist Mono", ui-monospace, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.24em; color: rgba(250,250,250,0.45); margin: 0 0 1.5rem; }
article h1, .page-head h1 {
	font-family: "Space Grotesk", "Geist", sans-serif;
	font-weight: 300;
	font-size: clamp(2rem, 4.5vw, 3rem);
	line-height: 1.05;
	letter-spacing: -0.02em;
	margin: 0 0 1rem;
}
article .lead, .page-head .lead { font-size: 1.0625rem; color: rgba(250,250,250,0.78); margin: 0 0 2.25rem; max-width: 60ch; }
article h2 { font-family: "Space Grotesk", sans-serif; font-weight: 400; font-size: 1.5rem; letter-spacing: -0.01em; margin: 2.5rem 0 0.75rem; }
article p, article ul, article ol { margin: 0 0 1.25rem; color: rgba(250,250,250,0.85); max-width: 64ch; }
article ul { padding-left: 1.25rem; }
article li { margin-bottom: 0.4rem; }
article hr { border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 3rem 0 1.5rem; }
article .cta { font-family: "Geist Mono", ui-monospace, monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(250,250,250,0.55); }
code {
	font-family: "Geist Mono", ui-monospace, monospace;
	font-size: 0.85em;
	background: rgba(255,255,255,0.05);
	padding: 0.1rem 0.35rem;
	border-radius: 3px;
	color: rgba(250,250,250,0.95);
}
pre {
	background: #050505;
	border: 1px solid rgba(255,255,255,0.06);
	padding: 1rem 1.1rem;
	overflow-x: auto;
	margin: 0 0 1.5rem;
}
pre code { background: transparent; padding: 0; font-size: 12.5px; line-height: 1.7; }
.post-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.post-list .post a {
	display: block; text-decoration: none;
	padding: 1.25rem 1.25rem; margin: 0;
	border: 1px solid rgba(255,255,255,0.06);
	transition: border-color 120ms ease, background 120ms ease;
}
.post-list .post a:hover { border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.015); }
.post-list .post h2 { margin: 0 0 0.35rem; font-family: "Space Grotesk", sans-serif; font-weight: 400; font-size: 1.25rem; letter-spacing: -0.005em; color: #fafafa; }
.post-list .post p { margin: 0 0 0.75rem; color: rgba(250,250,250,0.7); font-size: 0.9375rem; line-height: 1.55; max-width: 64ch; }
.post-list .post .meta { font-family: "Geist Mono", monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.22em; color: rgba(250,250,250,0.4); }
.page-head { margin-bottom: 3rem; }
@media (max-width: 600px) {
	.topbar nav { gap: 0.75rem; font-size: 10px; }
	main { padding: 2rem 1rem 4rem; }
}
`;
}

function escapeHtml(s) {
	return String(s)
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

for (const post of posts) {
	const dir = path.join(outRoot, post.slug);
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(path.join(dir, "index.html"), htmlPage(post));
}

fs.writeFileSync(path.join(outRoot, "index.html"), indexPage(posts));
fs.writeFileSync(path.join(outRoot, "blog.css"), blogCss());

console.log(
	`[blog] wrote ${posts.length} guide(s) + index.html + blog.css to ${path.relative(process.cwd(), outRoot)}`,
);
