<script lang="ts">
import type { FormatRiyalOptions } from "../format";
import RiyalPrice from "./RiyalPrice.svelte";

type Props = FormatRiyalOptions & {
	amount: number;
	durationMs?: number;
	class?: string;
};

const {
	amount,
	durationMs = 600,
	locale = undefined,
	decimals = undefined,
	useCode = undefined,
	notation = undefined,
	currency = undefined,
	class: className = "",
}: Props = $props();

let display = $state(amount);
let from = amount;
let raf = 0;

$effect(() => {
	const to = amount;
	if (typeof window === "undefined") {
		display = to;
		return;
	}
	const start = performance.now();
	const step = (now: number) => {
		const t = Math.min(1, (now - start) / durationMs);
		const eased = 1 - (1 - t) ** 3;
		display = from + (to - from) * eased;
		if (t < 1) {
			raf = window.requestAnimationFrame(step);
		} else {
			from = to;
		}
	};
	raf = window.requestAnimationFrame(step);
	return () => {
		window.cancelAnimationFrame(raf);
	};
});
</script>

<RiyalPrice
	amount={display}
	{locale}
	{decimals}
	{useCode}
	{notation}
	{currency}
	class={className}
/>
