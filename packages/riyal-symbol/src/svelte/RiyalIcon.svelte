<script lang="ts">
import { RIYAL_GLYPH_PATHS, RIYAL_GLYPH_VIEWBOX } from "./glyph";

type Props = {
	size?: number | string;
	title?: string;
	class?: string;
};

const { size = 24, title = "Saudi Riyal", class: className = "", ...rest }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox={RIYAL_GLYPH_VIEWBOX}
	width={size}
	height={size}
	fill="currentColor"
	role="img"
	aria-label={title}
	class={className}
	{...rest}
>
	<title>{title}</title>
	{#each RIYAL_GLYPH_PATHS as d (d)}
		<path {d} />
	{/each}
</svg>
