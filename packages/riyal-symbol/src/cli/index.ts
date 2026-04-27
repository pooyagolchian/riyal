#!/usr/bin/env node
/**
 * `riyal` CLI — quick reference + clipboard helper.
 *
 *   $ riyal                  # prints info table
 *   $ riyal copy             # copies the unicode char to clipboard
 *   $ riyal copy html        # copies "&#x20C1;"
 *   $ riyal copy css         # copies "\\20C1"
 */
import { spawnSync } from "node:child_process";
import {
	RIYAL_CODEPOINT,
	RIYAL_CSS_CONTENT,
	RIYAL_CURRENCY_CODE,
	RIYAL_HTML_ENTITY,
	RIYAL_UNICODE,
} from "../constants";

function info(): void {
	const rows: [string, string][] = [
		["Symbol", RIYAL_UNICODE],
		["Currency", RIYAL_CURRENCY_CODE],
		["Codepoint", `U+${RIYAL_CODEPOINT.toString(16).toUpperCase().padStart(4, "0")}`],
		["HTML entity", RIYAL_HTML_ENTITY],
		["CSS content", `"\\${"20C1"}"`],
		["CSS escape", RIYAL_CSS_CONTENT],
	];
	const width = Math.max(...rows.map(([k]) => k.length));
	for (const [k, v] of rows) {
		console.log(`${k.padEnd(width)}  ${v}`);
	}
}

function copyToClipboard(value: string): void {
	const platform = process.platform;
	if (platform === "darwin") {
		const r = spawnSync("pbcopy", [], { input: value });
		if (r.status === 0) return;
	} else if (platform === "win32") {
		const r = spawnSync("clip", [], { input: value });
		if (r.status === 0) return;
	} else {
		for (const cmd of ["wl-copy", "xclip", "xsel"]) {
			const args =
				cmd === "xclip" ? ["-selection", "clipboard"] : cmd === "xsel" ? ["-b", "-i"] : [];
			const r = spawnSync(cmd, args, { input: value });
			if (r.status === 0) return;
		}
	}
	console.error("riyal: no clipboard utility found. Falling back to stdout.");
	process.stdout.write(value);
}

function main(): void {
	const [, , cmd, arg] = process.argv;

	if (!cmd) {
		info();
		return;
	}

	if (cmd === "copy") {
		const which = (arg ?? "unicode").toLowerCase();
		const value =
			which === "html" ? RIYAL_HTML_ENTITY : which === "css" ? RIYAL_CSS_CONTENT : RIYAL_UNICODE;
		copyToClipboard(value);
		console.error(`copied ${which}: ${value}`);
		return;
	}

	if (cmd === "--help" || cmd === "-h" || cmd === "help") {
		console.log("Usage: riyal [copy [unicode|html|css]]");
		return;
	}

	console.error(`riyal: unknown command "${cmd}"`);
	process.exit(1);
}

main();
