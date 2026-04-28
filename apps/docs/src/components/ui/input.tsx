import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className, type = "text", ...props }, ref) => (
		<input
			ref={ref}
			type={type}
			className={cn(
				"w-full border-0 border-b border-white/15 bg-transparent px-0 py-3 font-display text-2xl text-foreground outline-none transition-colors focus:border-foreground placeholder:text-white/30",
				className,
			)}
			{...props}
		/>
	),
);
Input.displayName = "Input";
