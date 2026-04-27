import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		"react/index": "src/react/index.tsx",
		"react-native/index": "src/react-native/index.tsx",
		"web-component/index": "src/web-component/index.ts",
		"tailwind/index": "src/tailwind/index.ts",
		"next/index": "src/next/index.ts",
		"og/index": "src/og/index.tsx",
		"cli/index": "src/cli/index.ts",
	},
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	sourcemap: true,
	splitting: false,
	target: "es2022",
	external: [
		"react",
		"react-dom",
		"react-native",
		"react-native-svg",
		"next",
		"next/font/local",
		"tailwindcss",
		"tailwindcss/plugin",
	],
});
