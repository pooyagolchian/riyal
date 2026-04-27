import plugin from "tailwindcss/plugin";
import { RIYAL_CSS_CONTENT } from "../constants";

type PluginFn = Parameters<typeof plugin>[0];
type PluginResult = ReturnType<typeof plugin>;

/**
 * Tailwind plugin exposing Riyal symbol utilities.
 *
 *   <span class="riyal" />                       // bare symbol
 *   <span class="riyal-bold riyal-2xl" />        // weighted + sized
 *   <span class="riyal-price">100</span>         // adds ::before symbol
 */
const riyalPluginFn: PluginFn = ({ addUtilities, addComponents, theme }) => {
	const fontFamily = "'Riyal', 'Riyal Sans', system-ui, sans-serif";
	const symbolContent = `"\\${"20C1"}"`;

	const sizes: Record<string, string> = {
		xs: "0.75rem",
		sm: "0.875rem",
		base: "1rem",
		lg: "1.125rem",
		xl: "1.25rem",
		"2xl": "1.5rem",
		"3xl": "1.875rem",
		"4xl": "2.25rem",
		"5xl": "3rem",
	};

	const weights: Record<string, number> = {
		thin: 100,
		extralight: 200,
		light: 300,
		regular: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
		black: 900,
	};

	addComponents({
		".riyal": {
			fontFamily,
			lineHeight: "1",
			"&::before": { content: symbolContent },
		},
		".riyal-price": {
			"&::before": {
				content: symbolContent,
				fontFamily,
				marginInlineEnd: "0.25em",
			},
		},
	});

	const utilities: Record<string, Record<string, string>> = {};
	for (const [name, value] of Object.entries(sizes)) {
		utilities[`.riyal-${name}`] = { fontSize: value };
	}
	for (const [name, value] of Object.entries(weights)) {
		utilities[`.riyal-${name}`] = { fontWeight: String(value) };
	}
	addUtilities(utilities);

	void theme;
	void RIYAL_CSS_CONTENT;
};

const riyalPlugin: PluginResult = plugin(riyalPluginFn);

export default riyalPlugin;
export { riyalPlugin };
