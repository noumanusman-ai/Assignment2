<script lang="ts">
	let {
		value = $bindable(''),
		onsubmit,
		loading = false
	}: {
		value: string;
		onsubmit: () => void;
		loading?: boolean;
	} = $props();

	let maxLength = 2000;

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onsubmit();
		}
	}
</script>

<div class="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
	<form
		onsubmit={(e) => {
			e.preventDefault();
			onsubmit();
		}}
		class="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
	>
		<textarea
			bind:value
			onkeydown={handleKeydown}
			placeholder="Type a message to the AI assistant..."
			rows={1}
			maxlength={maxLength}
			disabled={loading}
			class="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-900 dark:text-white py-2 px-3 resize-none max-h-32 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50"
		></textarea>
		<div class="flex items-center gap-1 pb-1 pr-1">
			<button
				type="button"
				class="size-9 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
			>
				<span class="material-symbols-outlined">attach_file</span>
			</button>
			<button
				type="submit"
				disabled={loading || !value.trim()}
				class="size-9 flex items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
			>
				{#if loading}
					<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle
							class="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				{:else}
					<span class="material-symbols-outlined">send</span>
				{/if}
			</button>
		</div>
	</form>
	<div class="mt-2 flex justify-between items-center px-2">
		<span class="text-[10px] text-slate-500 flex items-center gap-1">
			<span class="material-symbols-outlined text-xs">info</span>
			Enterprise privacy enabled
		</span>
		<span class="text-[10px] text-slate-500 font-mono">{value.length} / {maxLength}</span>
	</div>
</div>
