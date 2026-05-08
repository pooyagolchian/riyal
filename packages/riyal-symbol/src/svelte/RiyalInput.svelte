<script lang="ts">
import { tick } from "svelte";
import { RIYAL_DEFAULT_LOCALE } from "../constants";
import { maskRiyal } from "../mask";
import RiyalSymbol from "./RiyalSymbol.svelte";

type Props = {
	value?: number | "";
	locale?: string;
	decimals?: number;
	placeholder?: string;
	class?: string;
	mask?: boolean;
	allowNegative?: boolean;
	onValueChange?: (value: number) => void;
};

let {
	value = $bindable(""),
	locale = RIYAL_DEFAULT_LOCALE,
	decimals = 2,
	placeholder = undefined,
	class: className = "",
	mask = false,
	allowNegative = false,
	onValueChange = undefined,
	...rest
}: Props = $props();

const isRtl = $derived(locale.toLowerCase().startsWith("ar"));
const step = $derived(1 / 10 ** decimals);

// biome-ignore lint/style/useConst: bind:this reassigns the variable
let inputEl: HTMLInputElement | null = $state(null);
let display = $state("");

$effect(() => {
	if (!mask) return;
	if (value === "" || !Number.isFinite(value as number)) {
		display = "";
		return;
	}
	const formatted = maskRiyal(String(value), undefined, {
		decimals,
		allowNegative,
	}).display;
	if (display !== formatted) display = formatted;
});

function handleNumericInput(event: Event) {
	const v = Number.parseFloat((event.target as HTMLInputElement).value);
	value = v;
	onValueChange?.(v);
}

async function handleMaskedInput(event: Event) {
	const target = event.target as HTMLInputElement;
	const raw = target.value;
	const caretAt = target.selectionStart ?? raw.length;
	const result = maskRiyal(raw, caretAt, { decimals, allowNegative });
	display = result.display;
	value = result.value;
	onValueChange?.(result.value);
	await tick();
	if (inputEl) inputEl.setSelectionRange(result.caret, result.caret);
}
</script>

<span
	class="riyal-input {className}"
	style:display="inline-flex"
	style:align-items="center"
	style:gap="0.25rem"
	style:direction={isRtl ? "rtl" : "ltr"}
>
	<RiyalSymbol />
	{#if mask}
		<input
			bind:this={inputEl}
			type="text"
			inputmode="decimal"
			autocomplete="off"
			dir={isRtl ? "rtl" : "ltr"}
			{placeholder}
			value={display}
			oninput={handleMaskedInput}
			{...rest}
		/>
	{:else}
		<input
			type="number"
			{step}
			{placeholder}
			value={value === "" ? "" : value}
			oninput={handleNumericInput}
			{...rest}
		/>
	{/if}
</span>
