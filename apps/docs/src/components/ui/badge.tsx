import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Badge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
	({ className, ...props }, ref) => (
		<span
			ref={ref}
			className={cn(
				"inline-flex items-center gap-1.5 border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
				className,
			)}
			{...props}
		/>
	),
);
Badge.displayName = "Badge";
