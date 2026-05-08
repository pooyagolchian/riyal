<script lang="ts">
import { RIYAL_SYMBOL_TEXT } from "../constants";
import { RIYAL_GLYPH_PATHS, RIYAL_GLYPH_VIEWBOX } from "./glyph";

type Props = {
	size?: number | string;
	color?: string;
	class?: string;
};

const { size = "1em", color = undefined, class: className = "", ...rest }: Props = $props();
const dim = $derived(typeof size === "number" ? `${size}px` : size);
</script>

<span
	aria-label="Saudi Riyal"
	role="img"
	class="riyal-symbol {className}"
	style:display="inline-flex"
	style:align-items="center"
	style:justify-content="center"
	style:width={dim}
	style:height={dim}
	style:color
	style:line-height="1"
	style:vertical-align="-0.125em"
	{...rest}
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={RIYAL_GLYPH_VIEWBOX}
		width="100%"
		height="100%"
		fill="currentColor"
		aria-hidden="true"
		focusable="false"
	>
		{#each RIYAL_GLYPH_PATHS as d (d)}
			<path {d} />
		{/each}
	</svg>
	<span
		style:position="absolute"
		style:width="1px"
		style:height="1px"
		style:overflow="hidden"
		style:clip="rect(0 0 0 0)"
	>
		{RIYAL_SYMBOL_TEXT}
	</span>
</span>
