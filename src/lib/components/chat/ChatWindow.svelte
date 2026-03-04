<script lang="ts">
	import type { UIMessage, ChatStatus } from 'ai';
	import ChatMessage from './ChatMessage.svelte';
	import ChatInput from './ChatInput.svelte';

	let {
		messages,
		input = $bindable(''),
		onsubmit,
		onclear,
		status = 'ready',
		error = undefined
	}: {
		messages: UIMessage[];
		input: string;
		onsubmit: () => void;
		onclear?: () => void;
		status?: ChatStatus;
		error?: Error | undefined;
	} = $props();

	let isLoading = $derived(status === 'submitted' || status === 'streaming');

	let scrollContainer: HTMLDivElement;

	$effect(() => {
		if (messages.length && scrollContainer) {
			scrollContainer.scrollTop = scrollContainer.scrollHeight;
		}
	});
</script>

<div
	class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] md:max-h-[700px]"
>
	<!-- Agent Header -->
	<div
		class="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50"
	>
		<div class="flex items-center gap-3">
			<div class="relative">
				<div
					class="size-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary"
				>
					<span class="material-symbols-outlined">memory</span>
				</div>
				<div
					class="absolute -bottom-0.5 -right-0.5 size-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"
				></div>
			</div>
			<div>
				<h2 class="text-sm font-bold text-slate-900 dark:text-white leading-none">
					Nexus AI Agent
				</h2>
				<p class="text-[11px] text-green-500 font-medium mt-1 uppercase tracking-wider">
					Online &bull; Enterprise Grade
				</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			{#if onclear}
				<button
					onclick={onclear}
					class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs font-semibold"
				>
					<span class="material-symbols-outlined text-sm">delete</span>
					Clear Chat
				</button>
			{/if}
		</div>
	</div>

	<!-- Messages Area -->
	<div
		bind:this={scrollContainer}
		class="flex-1 overflow-y-auto p-6 space-y-6"
		style="scrollbar-width: thin; scrollbar-color: #334155 transparent;"
	>
		{#if messages.length === 0}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
				<div
					class="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"
				>
					<span class="material-symbols-outlined text-3xl">smart_toy</span>
				</div>
				<div>
					<p class="font-semibold text-slate-900 dark:text-slate-300">
						How can I help you today?
					</p>
					<p class="mt-1 text-sm text-slate-500">
						Send a message to start the conversation.
					</p>
				</div>
			</div>
		{:else}
			{#each messages as message (message.id)}
				<ChatMessage {message} />
			{/each}
		{/if}

		<!-- Thinking indicator -->
		{#if isLoading}
			<div class="flex items-start gap-3">
				<div
					class="size-8 rounded-lg bg-primary/10 flex-shrink-0 flex items-center justify-center text-primary"
				>
					<span class="material-symbols-outlined text-sm">smart_toy</span>
				</div>
				<div class="flex flex-col gap-1.5">
					<div
						class="px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700/50 flex items-center gap-1.5"
					>
						<div
							class="size-1.5 bg-primary/60 rounded-full animate-bounce"
							style="animation-delay: 0ms;"
						></div>
						<div
							class="size-1.5 bg-primary/60 rounded-full animate-bounce"
							style="animation-delay: 200ms;"
						></div>
						<div
							class="size-1.5 bg-primary/60 rounded-full animate-bounce"
							style="animation-delay: 400ms;"
						></div>
						<span class="ml-2 text-xs font-medium text-slate-500 italic"
							>Nexus is thinking...</span
						>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Error display -->
	{#if error}
		<div class="mx-4 mb-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
			<p class="text-sm text-red-400">Something went wrong. Please try again.</p>
		</div>
	{/if}

	<!-- Input area -->
	<ChatInput bind:value={input} onsubmit={onsubmit} loading={isLoading} />
</div>
