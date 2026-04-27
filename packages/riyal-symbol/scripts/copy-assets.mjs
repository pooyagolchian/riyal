// Copies CSS and font assets into dist/ after tsup build.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

function ensureDir(p) {
	mkdirSync(p, { recursive: true });
}

function copyIfExists(src, dest) {
	if (existsSync(src)) {
		ensureDir(dirname(dest));
		copyFileSync(src, dest);
	}
}

// Copy CSS
copyIfExists(join(root, "src/css/riyal.css"), join(dist, "css/riyal.css"));

// Copy fonts (whatever is in src/fonts/)
const fontDir = join(root, "src/fonts");
if (existsSync(fontDir)) {
	ensureDir(join(dist, "fonts"));
	for (const file of readdirSync(fontDir)) {
		copyFileSync(join(fontDir, file), join(dist, "fonts", file));
	}
}

console.log("[riyal] copy-assets: done");
