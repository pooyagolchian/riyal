import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	base: "./",
	server: { port: 3000 },
	build: { outDir: "dist", emptyOutDir: true },
});
