import { type VariantProps, cva } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-40",
	{
		variants: {
			variant: {
				default: "bg-foreground text-background hover:bg-foreground/85 border border-foreground",
				outline:
					"border border-white/15 text-foreground hover:border-white/40 hover:bg-white/[0.03]",
				ghost: "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
				link: "text-foreground underline-offset-4 hover:underline",
			},
			size: {
				default: "h-11 px-6",
				sm: "h-8 px-3",
				lg: "h-12 px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, ...props }, ref) => {
		return (
			<button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
		);
	},
);
Button.displayName = "Button";

export { buttonVariants };
