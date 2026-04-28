import { forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface NumberFieldProps {
	value: number | "";
	onValueChange: (v: number | "") => void;
	step?: number;
	min?: number;
	max?: number;
	placeholder?: string;
	className?: string;
	prefix?: React.ReactNode;
}

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(
	({ value, onValueChange, step = 1, min, max, placeholder, className, prefix }, ref) => {
		const current = typeof value === "number" && Number.isFinite(value) ? value : 0;

		const clamp = (n: number) => {
			let next = n;
			if (typeof min === "number" && next < min) next = min;
			if (typeof max === "number" && next > max) next = max;
			return Number.parseFloat(next.toFixed(6));
		};

		const dec = () => onValueChange(clamp(current - step));
		const inc = () => onValueChange(clamp(current + step));

		return (
			<div
				className={cn(
					"group flex h-12 w-full items-stretch border border-white/10 bg-white/[0.015] transition-colors focus-within:border-white/40 hover:border-white/25",
					className,
				)}
			>
				<button
					type="button"
					onClick={dec}
					aria-label="Decrement"
					className="flex w-11 shrink-0 items-center justify-center border-r border-white/10 font-mono text-base text-white/55 transition-colors hover:bg-white/[0.04] hover:text-foreground"
				>
					−
				</button>
				{prefix ? (
					<span className="flex items-center pl-3 pr-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
						{prefix}
					</span>
				) : null}
				<input
					ref={ref}
					type="number"
					inputMode="decimal"
					value={value}
					step={step}
					min={min}
					max={max}
					placeholder={placeholder}
					onChange={(e) => {
						const v = e.target.value;
						onValueChange(v === "" ? "" : Number.parseFloat(v));
					}}
					className="hide-spinner h-full min-w-0 flex-1 bg-transparent px-3 text-center font-mono-tight text-base text-foreground outline-none placeholder:text-white/25"
				/>
				<button
					type="button"
					onClick={inc}
					aria-label="Increment"
					className="flex w-11 shrink-0 items-center justify-center border-l border-white/10 font-mono text-base text-white/55 transition-colors hover:bg-white/[0.04] hover:text-foreground"
				>
					+
				</button>
			</div>
		);
	},
);
NumberField.displayName = "NumberField";
