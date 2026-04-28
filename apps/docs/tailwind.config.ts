import type { Config } from "tailwindcss";

export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
		container: {
			center: true,
			padding: "1rem",
			screens: { "2xl": "1280px" },
		},
		extend: {
			colors: {
				border: "hsl(0 0% 100% / 0.08)",
				input: "hsl(0 0% 100% / 0.10)",
				ring: "hsl(0 0% 100% / 0.40)",
				background: "#000000",
				foreground: "#fafafa",
				muted: {
					DEFAULT: "#0a0a0a",
					foreground: "hsl(0 0% 100% / 0.55)",
				},
				accent: {
					DEFAULT: "hsl(0 0% 100% / 0.05)",
					foreground: "#fafafa",
				},
				card: {
					DEFAULT: "#070707",
					foreground: "#fafafa",
				},
				primary: {
					DEFAULT: "#fafafa",
					foreground: "#000000",
				},
				secondary: {
					DEFAULT: "hsl(0 0% 100% / 0.06)",
					foreground: "#fafafa",
				},
			},
			fontFamily: {
				sans: ["Geist", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
				display: ["Space Grotesk", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
				mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
			},
			borderRadius: {
				lg: "0.625rem",
				md: "0.5rem",
				sm: "0.375rem",
			},
			keyframes: {
				marquee: {
					from: { transform: "translateX(0)" },
					to: { transform: "translateX(-50%)" },
				},
			},
			animation: {
				marquee: "marquee 40s linear infinite",
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
