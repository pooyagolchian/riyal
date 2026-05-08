// Build the shadcn-style registry JSONs that are served from
// `https://riyal.js.org/r/<name>.json`. Each component lives as a TSX string
// next to its metadata; running `node apps/docs/registry/build.mjs` writes
// the JSONs to `apps/docs/public/r/`. Re-run after editing any component
// below and commit the resulting JSONs.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "../public/r");
fs.mkdirSync(outDir, { recursive: true });

const HOMEPAGE = "https://riyal.js.org";
const SCHEMA_ITEM = "https://ui.shadcn.com/schema/registry-item.json";
const SCHEMA_REGISTRY = "https://ui.shadcn.com/schema/registry.json";

/** @type {Record<string, { title: string; description: string; type: string; dependencies?: string[]; registryDependencies?: string[]; files: { name: string; type: string; code: string }[] }>} */
const components = {
	"riyal-price-tag": {
		title: "Riyal Price Tag",
		description:
			"Styled SAR price label with size and tone variants. Wraps <RiyalPrice> from riyal/react.",
		type: "registry:component",
		dependencies: ["riyal"],
		files: [
			{
				name: "riyal-price-tag.tsx",
				type: "registry:component",
				code: `import * as React from "react";
import { RiyalPrice } from "riyal/react";
import { cn } from "@/lib/utils";

const sizeClasses = {
	sm: "text-sm",
	md: "text-base",
	lg: "text-2xl",
	xl: "text-4xl tracking-[-0.02em]",
} as const;

const toneClasses = {
	default: "text-foreground",
	muted: "text-muted-foreground",
	emerald: "text-emerald-500",
	primary: "text-primary",
} as const;

export interface RiyalPriceTagProps extends React.HTMLAttributes<HTMLSpanElement> {
	amount: number;
	size?: keyof typeof sizeClasses;
	tone?: keyof typeof toneClasses;
	locale?: string;
	decimals?: number;
	vatIncluded?: boolean;
	showVatLabel?: boolean;
}

export function RiyalPriceTag({
	amount,
	size = "md",
	tone = "default",
	locale,
	decimals,
	vatIncluded = false,
	showVatLabel = false,
	className,
	...rest
}: RiyalPriceTagProps) {
	return (
		<span
			className={cn(
				"inline-flex items-baseline gap-1.5 font-semibold tabular-nums",
				sizeClasses[size],
				toneClasses[tone],
				className,
			)}
			{...rest}
		>
			<RiyalPrice amount={amount} locale={locale} decimals={decimals} />
			{showVatLabel ? (
				<span className="text-[0.6em] font-medium uppercase tracking-wider text-muted-foreground">
					{vatIncluded ? "VAT incl." : "VAT excl."}
				</span>
			) : null}
		</span>
	);
}
`,
			},
		],
	},

	"riyal-amount-input": {
		title: "Riyal Amount Input",
		description:
			'Form-grade SAR input with label, hint, and error states. Uses the masked <RiyalInput mask /> from riyal/react so paste of \\"SAR 2,499.99\\" or \\"٢٤٩٩٫٩٩\\" yields a clean number.',
		type: "registry:component",
		dependencies: ["riyal"],
		files: [
			{
				name: "riyal-amount-input.tsx",
				type: "registry:component",
				code: `"use client";

import * as React from "react";
import { RiyalInput } from "riyal/react";
import { cn } from "@/lib/utils";

export interface RiyalAmountInputProps {
	value: number | "";
	onValueChange: (value: number) => void;
	label?: string;
	hint?: string;
	error?: string;
	locale?: string;
	decimals?: number;
	mask?: boolean;
	allowNegative?: boolean;
	placeholder?: string;
	disabled?: boolean;
	id?: string;
	className?: string;
}

export function RiyalAmountInput({
	value,
	onValueChange,
	label,
	hint,
	error,
	locale,
	decimals,
	mask = true,
	allowNegative = false,
	placeholder = "0.00",
	disabled,
	id,
	className,
}: RiyalAmountInputProps) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;
	const describedBy = error ? \`\${inputId}-error\` : hint ? \`\${inputId}-hint\` : undefined;

	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			{label ? (
				<label
					htmlFor={inputId}
					className="text-sm font-medium text-foreground data-[disabled=true]:opacity-60"
					data-disabled={disabled || undefined}
				>
					{label}
				</label>
			) : null}
			<RiyalInput
				id={inputId}
				value={value}
				onValueChange={onValueChange}
				locale={locale}
				decimals={decimals}
				mask={mask}
				allowNegative={allowNegative}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={Boolean(error) || undefined}
				aria-describedby={describedBy}
				className={cn(
					"h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground transition-colors",
					"focus-within:border-ring focus-within:ring-1 focus-within:ring-ring",
					"[&_input]:flex-1 [&_input]:min-w-0 [&_input]:bg-transparent [&_input]:outline-none [&_input]:placeholder:text-muted-foreground",
					"[&_input]:disabled:opacity-60",
					error &&
						"border-destructive focus-within:border-destructive focus-within:ring-destructive",
				)}
			/>
			{error ? (
				<p id={\`\${inputId}-error\`} className="text-xs text-destructive">
					{error}
				</p>
			) : hint ? (
				<p id={\`\${inputId}-hint\`} className="text-xs text-muted-foreground">
					{hint}
				</p>
			) : null}
		</div>
	);
}
`,
			},
		],
	},

	"riyal-checkout-summary": {
		title: "Riyal Checkout Summary",
		description:
			"Receipt-style block with subtotal, discount, shipping, VAT, and grand total. Built on cartTotal from riyal/cart and <RiyalPrice> from riyal/react.",
		type: "registry:component",
		dependencies: ["riyal"],
		files: [
			{
				name: "riyal-checkout-summary.tsx",
				type: "registry:component",
				code: `import { type LineItem, cartTotal } from "riyal/cart";
import { RiyalPrice } from "riyal/react";
import { cn } from "@/lib/utils";

export interface RiyalCheckoutSummaryProps {
	items: LineItem[];
	shipping?: number;
	shippingIncludesVat?: boolean;
	discount?: number;
	vatRate?: number;
	locale?: string;
	className?: string;
}

export function RiyalCheckoutSummary({
	items,
	shipping = 0,
	shippingIncludesVat = false,
	discount = 0,
	vatRate,
	locale,
	className,
}: RiyalCheckoutSummaryProps) {
	const totals = cartTotal(items, { shipping, shippingIncludesVat, discount, vatRate });
	const itemCount = totals.itemCount;
	const vatPct = (totals.vatRate * 100).toFixed(0);

	const rows: Array<{ label: string; value: number; negate?: boolean }> = [
		{ label: "Subtotal", value: totals.subtotal },
	];
	if (totals.discount > 0) rows.push({ label: "Discount", value: totals.discount, negate: true });
	if (totals.shipping > 0) rows.push({ label: "Shipping", value: totals.shipping });
	rows.push({ label: \`VAT (\${vatPct}%)\`, value: totals.vat });

	return (
		<div
			className={cn(
				"flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-card-foreground",
				className,
			)}
		>
			{rows.map((row) => (
				<div key={row.label} className="flex items-center justify-between text-sm">
					<span className="text-muted-foreground">{row.label}</span>
					<span className="tabular-nums text-foreground">
						{row.negate ? "−" : ""}
						<RiyalPrice amount={row.value} locale={locale} />
					</span>
				</div>
			))}
			<div className="mt-1 border-t border-border pt-3" />
			<div className="flex items-baseline justify-between">
				<span className="text-sm font-medium text-foreground">
					Total · {itemCount} {itemCount === 1 ? "item" : "items"}
				</span>
				<span className="text-2xl font-semibold tabular-nums">
					<RiyalPrice amount={totals.total} locale={locale} />
				</span>
			</div>
		</div>
	);
}
`,
			},
		],
	},
};

const items = [];

for (const [name, def] of Object.entries(components)) {
	const item = {
		$schema: SCHEMA_ITEM,
		name,
		type: def.type,
		title: def.title,
		description: def.description,
		...(def.dependencies ? { dependencies: def.dependencies } : {}),
		...(def.registryDependencies ? { registryDependencies: def.registryDependencies } : {}),
		files: def.files.map((f) => ({
			path: `components/riyal/${f.name}`,
			type: f.type,
			content: f.code,
		})),
	};
	const dest = path.join(outDir, `${name}.json`);
	fs.writeFileSync(dest, `${JSON.stringify(item, null, 2)}\n`);
	items.push({
		name,
		type: def.type,
		title: def.title,
		description: def.description,
		registryDependencies: def.registryDependencies,
		files: def.files.map((f) => f.name),
	});
}

const registry = {
	$schema: SCHEMA_REGISTRY,
	name: "riyal",
	homepage: HOMEPAGE,
	items: items.map((it) => ({
		name: it.name,
		type: it.type,
		title: it.title,
		description: it.description,
	})),
};
fs.writeFileSync(path.join(outDir, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`);

console.log(
	`[registry] wrote ${items.length} component(s) + registry.json to ${path.relative(process.cwd(), outDir)}`,
);
