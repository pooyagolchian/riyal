// Render og.svg → og.png at build time so Twitter/X and other crawlers that
// don't accept SVG OG images still get a high-quality social card.
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const here = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(here, "..", "public");

const svg = await readFile(resolve(publicDir, "og.svg"), "utf8");
const resvg = new Resvg(svg, {
	fitTo: { mode: "width", value: 1200 },
	font: { loadSystemFonts: true },
	background: "#000000",
});
const png = resvg.render().asPng();
await writeFile(resolve(publicDir, "og.png"), png);
console.log(`og.png written (${png.length} bytes)`);
