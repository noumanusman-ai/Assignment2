<script lang="ts">
	import type { UIMessage } from 'ai';

	let { message }: { message: UIMessage } = $props();

	function getTextContent(msg: UIMessage): string {
		return msg.parts
			.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
			.map((p) => p.text)
			.join('');
	}
</script>

{#if message.role === 'user'}
	<!-- User Message -->
	<div class="flex items-start justify-end gap-3 ml-auto max-w-[85%]">
		<div class="flex flex-col items-end gap-1.5">
			<div
				class="px-4 py-3 bg-primary text-white rounded-2xl rounded-tr-none shadow-lg shadow-primary/20"
			>
				<p class="text-sm leading-relaxed">{getTextContent(message)}</p>
			</div>
			<div class="flex items-center gap-1.5 px-1">
				<span class="material-symbols-outlined text-[10px] text-primary">done_all</span>
			</div>
		</div>
	</div>
{:else}
	<!-- AI Message -->
	<div class="flex items-start gap-3 max-w-[85%]">
		<div
			class="size-8 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary"
		>
			<span class="material-symbols-outlined text-sm">smart_toy</span>
		</div>
		<div class="flex flex-col gap-1.5">
			<div
				class="px-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700/50 shadow-sm"
			>
				<p class="text-sm leading-relaxed whitespace-pre-wrap">{getTextContent(message)}</p>
			</div>
		</div>
	</div>
{/if}
