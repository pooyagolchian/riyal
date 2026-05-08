<script lang="ts">
import { RIYAL_DEFAULT_LOCALE, RIYAL_SYMBOL_TEXT } from "../constants";
import { type FormatRiyalOptions, formatRiyal } from "../format";
import RiyalSymbol from "./RiyalSymbol.svelte";

type Props = FormatRiyalOptions & {
	amount: number;
	class?: string;
};

const {
	amount,
	locale = undefined,
	decimals = undefined,
	useCode = undefined,
	notation = undefined,
	currency = undefined,
	class: className = "",
	...rest
}: Props = $props();

const text = $derived(
	formatRiyal(amount, {
		...(locale !== undefined && { locale }),
		...(decimals !== undefined && { decimals }),
		...(useCode !== undefined && { useCode }),
		...(notation !== undefined && { notation }),
		...(currency !== undefined && { currency }),
	}),
);
const isRtl = $derived((locale ?? RIYAL_DEFAULT_LOCALE).toLowerCase().startsWith("ar"));
const parts = $derived(text.split(RIYAL_SYMBOL_TEXT));
</script>

<span
	class="riyal-price {className}"
	style:display="inline-flex"
	style:align-items="baseline"
	style:gap="0"
	{...rest}
>
	{#each parts as part, i (`${i}-${part}`)}
		{#if i > 0}
			<RiyalSymbol
				size="0.9em"
				style="margin: {isRtl ? '0 0 0 0.15em' : '0 0.15em 0 0'}"
			/>
		{/if}
		{#if part}
			<span>{part}</span>
		{/if}
	{/each}
</span>
