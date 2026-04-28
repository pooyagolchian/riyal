import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface TabsProps<T extends string> {
	value: T;
	onValueChange: (value: T) => void;
	options: readonly { value: T; label: ReactNode }[];
	className?: string;
}

export function Tabs<T extends string>({ value, onValueChange, options, className }: TabsProps<T>) {
	return (
		<div
			role="tablist"
			className={cn("inline-flex items-center gap-0.5 border border-white/10 p-0.5", className)}
		>
			{options.map((opt) => {
				const isActive = opt.value === value;
				return (
					<button
						key={opt.value}
						type="button"
						role="tab"
						aria-selected={isActive}
						onClick={() => onValueChange(opt.value)}
						className={cn(
							"px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-200",
							isActive
								? "bg-foreground text-background"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{opt.label}
					</button>
				);
			})}
		</div>
	);
}
