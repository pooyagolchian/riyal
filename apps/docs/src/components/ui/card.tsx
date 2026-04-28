import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex min-w-0 flex-col gap-5 overflow-hidden border border-white/[0.07] bg-[#070707] p-5 transition-colors duration-300 hover:border-white/15 sm:p-8",
				className,
			)}
			{...props}
		/>
	),
);
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-muted-foreground",
				className,
			)}
			{...props}
		/>
	),
);
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
	({ className, ...props }, ref) => (
		<span
			ref={ref}
			className={cn(
				"font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground",
				className,
			)}
			{...props}
		/>
	),
);
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("flex flex-col gap-4", className)} {...props} />
	),
);
CardContent.displayName = "CardContent";
