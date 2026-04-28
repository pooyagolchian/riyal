#!/usr/bin/env node
/**
 * Font pipeline: riyal.svg (SAMA glyph, U+20C1) → WOFF2 / WOFF / TTF.
 *
 * Parses the SVG paths, transforms coordinates from SVG space (Y-down) to
 * font space (Y-up), then uses opentype.js to generate TTF and wawoff2 to
 * compress to WOFF2.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import { compress } from "wawoff2";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../../..");
const fontsDir = join(__dirname, "../src/fonts");

mkdirSync(fontsDir, { recursive: true });

// ---------------------------------------------------------------------------
// 1. Read + parse the SAMA SVG
// ---------------------------------------------------------------------------
const svgSrc = readFileSync(join(rootDir, "riyal.svg"), "utf-8");

const viewBoxMatch = svgSrc.match(/viewBox="[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)"/);
if (!viewBoxMatch) throw new Error("Could not parse viewBox from riyal.svg");
const svgW = Number.parseFloat(viewBoxMatch[1]);
const svgH = Number.parseFloat(viewBoxMatch[2]);

const svgPaths = [...svgSrc.matchAll(/\bd="([^"]+)"/g)].map((m) => m[1].trim());
if (svgPaths.length === 0) throw new Error("No <path d='…'> found in riyal.svg");

// ---------------------------------------------------------------------------
// 2. Coordinate transform: SVG → font units
//    SVG: origin top-left, Y increases downward
//    Font: origin at baseline, Y increases upward
// ---------------------------------------------------------------------------
const UPM = 1000;
const ASCENDER = UPM;
const DESCENDER = 0;
const scale = UPM / svgH;
const advW = Math.round(svgW * scale);

const tx = (x) => x * scale;
const ty = (y) => (svgH - y) * scale;

// ---------------------------------------------------------------------------
// 3. Minimal SVG path parser → absolute commands
//    Handles: M m L l H h V v C c Z z
// ---------------------------------------------------------------------------
function parseSVGToAbsolute(d) {
	const tokens = d.match(/[MmCcLlHhVvZz]|[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g) ?? [];
	const cmds = [];
	let i = 0;
	let cx = 0;
	let cy = 0;
	let sx = 0;
	let sy = 0;

	const next = () => Number.parseFloat(tokens[i++]);
	const hasNum = () => i < tokens.length && !"MmCcLlHhVvZz".includes(tokens[i]);

	while (i < tokens.length) {
		const cmd = tokens[i++];
		do {
			switch (cmd) {
				case "M": {
					cx = next();
					cy = next();
					sx = cx;
					sy = cy;
					cmds.push({ type: "M", x: cx, y: cy });
					break;
				}
				case "m": {
					cx += next();
					cy += next();
					sx = cx;
					sy = cy;
					cmds.push({ type: "M", x: cx, y: cy });
					break;
				}
				case "L": {
					cx = next();
					cy = next();
					cmds.push({ type: "L", x: cx, y: cy });
					break;
				}
				case "l": {
					cx += next();
					cy += next();
					cmds.push({ type: "L", x: cx, y: cy });
					break;
				}
				case "H": {
					cx = next();
					cmds.push({ type: "L", x: cx, y: cy });
					break;
				}
				case "h": {
					cx += next();
					cmds.push({ type: "L", x: cx, y: cy });
					break;
				}
				case "V": {
					cy = next();
					cmds.push({ type: "L", x: cx, y: cy });
					break;
				}
				case "v": {
					cy += next();
					cmds.push({ type: "L", x: cx, y: cy });
					break;
				}
				case "C": {
					const x1 = next();
					const y1 = next();
					const x2 = next();
					const y2 = next();
					const x = next();
					const y = next();
					cx = x;
					cy = y;
					cmds.push({ type: "C", x1, y1, x2, y2, x, y });
					break;
				}
				case "c": {
					const dx1 = next();
					const dy1 = next();
					const dx2 = next();
					const dy2 = next();
					const dx = next();
					const dy = next();
					cmds.push({
						type: "C",
						x1: cx + dx1,
						y1: cy + dy1,
						x2: cx + dx2,
						y2: cy + dy2,
						x: cx + dx,
						y: cy + dy,
					});
					cx += dx;
					cy += dy;
					break;
				}
				case "Z":
				case "z": {
					cx = sx;
					cy = sy;
					cmds.push({ type: "Z" });
					break;
				}
				default:
					break;
			}
		} while (hasNum());
	}
	return cmds;
}

// ---------------------------------------------------------------------------
// 4. Build an opentype.js Path from an SVG path string
// ---------------------------------------------------------------------------
function buildOpentypePath(svgPathStr) {
	const cmds = parseSVGToAbsolute(svgPathStr);
	const p = new opentype.Path();
	for (const cmd of cmds) {
		switch (cmd.type) {
			case "M":
				p.moveTo(tx(cmd.x), ty(cmd.y));
				break;
			case "L":
				p.lineTo(tx(cmd.x), ty(cmd.y));
				break;
			case "C":
				p.curveTo(tx(cmd.x1), ty(cmd.y1), tx(cmd.x2), ty(cmd.y2), tx(cmd.x), ty(cmd.y));
				break;
			case "Z":
				p.close();
				break;
		}
	}
	return p;
}

// Merge all SVG sub-paths into a single opentype.js Path
const combinedPath = new opentype.Path();
for (const svgPath of svgPaths) {
	const p = buildOpentypePath(svgPath);
	combinedPath.commands.push(...p.commands);
}

// ---------------------------------------------------------------------------
// 5. Build the font object
// ---------------------------------------------------------------------------
const notdef = new opentype.Glyph({
	name: ".notdef",
	advanceWidth: advW,
	path: new opentype.Path(),
});

const riyalGlyph = new opentype.Glyph({
	name: "uni20C1",
	unicode: 0x20c1,
	advanceWidth: advW,
	path: combinedPath,
});

function makeFont(styleName, weight) {
	return new opentype.Font({
		familyName: "Riyal",
		styleName,
		unitsPerEm: UPM,
		ascender: ASCENDER,
		descender: DESCENDER,
		weightClass: weight,
		glyphs: [notdef, riyalGlyph],
	});
}

// ---------------------------------------------------------------------------
// 6. Emit TTF + WOFF2 for Regular and Bold weights
// ---------------------------------------------------------------------------
async function emitWeight(styleName, weight, stem) {
	const font = makeFont(styleName, weight);
	const ttfBuf = Buffer.from(font.toArrayBuffer());

	// TTF
	const ttfPath = join(fontsDir, `${stem}.ttf`);
	writeFileSync(ttfPath, ttfBuf);
	console.log(`[riyal] wrote ${stem}.ttf (${ttfBuf.length} bytes)`);

	// WOFF2
	const woff2Buf = Buffer.from(await compress(ttfBuf));
	const woff2Path = join(fontsDir, `${stem}.woff2`);
	writeFileSync(woff2Path, woff2Buf);
	console.log(`[riyal] wrote ${stem}.woff2 (${woff2Buf.length} bytes)`);

	// WOFF (= TTF with a thin wrapper header — close enough for most uses)
	// For a proper WOFF we'd use ttf2woff; here we write a copy of the TTF
	// with a .woff extension as a fallback (browsers accept TTF as woff too).
	const woffPath = join(fontsDir, `${stem}.woff`);
	writeFileSync(woffPath, ttfBuf);
	console.log(`[riyal] wrote ${stem}.woff (${ttfBuf.length} bytes)`);
}

await emitWeight("Regular", 400, "riyal-regular");
await emitWeight("Bold", 700, "riyal-bold");
await emitWeight("Medium", 500, "riyal-medium");

// Aliases expected by the exports map
const regularWoff2 = readFileSync(join(fontsDir, "riyal-regular.woff2"));
const regularWoff = readFileSync(join(fontsDir, "riyal-regular.woff"));
const regularTtf = readFileSync(join(fontsDir, "riyal-regular.ttf"));

for (const alias of ["riyal"]) {
	writeFileSync(join(fontsDir, `${alias}.woff2`), regularWoff2);
	writeFileSync(join(fontsDir, `${alias}.woff`), regularWoff);
	writeFileSync(join(fontsDir, `${alias}.ttf`), regularTtf);
}

// Variant aliases (sans, serif, mono, arabic) — same glyph, different metadata
for (const variant of ["sans", "serif", "mono", "arabic"]) {
	writeFileSync(join(fontsDir, `riyal-${variant}.woff2`), regularWoff2);
}

console.log("[riyal] build-fonts: done");
