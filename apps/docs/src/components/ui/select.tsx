import { type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
	({ className, children, ...props }, ref) => (
		<div
			className={cn(
				"group relative flex h-12 items-center border border-white/10 bg-white/[0.015] transition-colors focus-within:border-white/40 hover:border-white/25",
				className,
			)}
		>
			<select
				ref={ref}
				className="peer h-full w-full appearance-none bg-transparent pl-4 pr-10 font-mono-tight text-sm text-foreground outline-none"
				{...props}
			>
				{children}
			</select>
			<svg
				aria-hidden="true"
				viewBox="0 0 12 8"
				className="pointer-events-none absolute right-4 h-2 w-3 text-white/50 transition-colors peer-focus:text-foreground group-hover:text-white/80"
			>
				<path
					d="M1 1.5L6 6.5L11 1.5"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.25"
					strokeLinecap="square"
				/>
			</svg>
		</div>
	),
);
Select.displayName = "Select";
