<script lang="ts">
	import type { UIMessage } from 'ai';
	import { marked } from 'marked';

	let { message }: { message: UIMessage } = $props();

	// Configure marked for clean output
	marked.setOptions({
		gfm: true,
		breaks: true
	});

	function getTextContent(msg: UIMessage): string {
		return msg.parts
			.filter((p): p is { type: 'text'; text: string } => p.type === 'text')
			.map((p) => p.text)
			.join('');
	}

	let renderedHtml = $derived(marked.parse(getTextContent(message)) as string);
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
	<!-- AI Message with Markdown -->
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
				<div class="prose prose-sm dark:prose-invert max-w-none chat-markdown">
					{@html renderedHtml}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Chat-specific markdown overrides for a clean ChatGPT/Gemini-like look */
	.chat-markdown :global(p) {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
		line-height: 1.6;
	}
	.chat-markdown :global(p:first-child) {
		margin-top: 0;
	}
	.chat-markdown :global(p:last-child) {
		margin-bottom: 0;
	}

	/* Headings */
	.chat-markdown :global(h1),
	.chat-markdown :global(h2),
	.chat-markdown :global(h3) {
		margin-top: 0.75em;
		margin-bottom: 0.25em;
		font-weight: 700;
		line-height: 1.3;
	}
	.chat-markdown :global(h1:first-child),
	.chat-markdown :global(h2:first-child),
	.chat-markdown :global(h3:first-child) {
		margin-top: 0;
	}

	/* Lists */
	.chat-markdown :global(ul),
	.chat-markdown :global(ol) {
		margin-top: 0.25em;
		margin-bottom: 0.25em;
		padding-left: 1.25em;
	}
	.chat-markdown :global(li) {
		margin-top: 0.15em;
		margin-bottom: 0.15em;
	}
	.chat-markdown :global(li p) {
		margin: 0;
	}

	/* Code blocks */
	.chat-markdown :global(pre) {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
		border-radius: 0.5rem;
		padding: 0.75rem 1rem;
		overflow-x: auto;
		font-size: 0.8125rem;
		line-height: 1.5;
	}
	:global(.dark) .chat-markdown :global(pre) {
		background-color: #0f172a;
		border: 1px solid rgba(51, 65, 85, 0.5);
	}
	.chat-markdown :global(:not(pre) > code) {
		padding: 0.15em 0.35em;
		border-radius: 0.25rem;
		font-size: 0.85em;
		font-weight: 500;
	}
	:global(.dark) .chat-markdown :global(:not(pre) > code) {
		background-color: rgba(51, 65, 85, 0.5);
		color: #e2e8f0;
	}

	/* Tables */
	.chat-markdown :global(table) {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
		font-size: 0.8125rem;
		width: 100%;
		border-collapse: collapse;
	}
	.chat-markdown :global(th),
	.chat-markdown :global(td) {
		padding: 0.4em 0.75em;
		text-align: left;
	}
	:global(.dark) .chat-markdown :global(th) {
		background-color: rgba(51, 65, 85, 0.4);
		border-bottom: 1px solid rgba(71, 85, 105, 0.5);
		font-weight: 600;
	}
	:global(.dark) .chat-markdown :global(td) {
		border-bottom: 1px solid rgba(51, 65, 85, 0.3);
	}

	/* Blockquotes */
	.chat-markdown :global(blockquote) {
		margin-top: 0.5em;
		margin-bottom: 0.5em;
		padding-left: 0.75em;
		font-style: italic;
	}
	:global(.dark) .chat-markdown :global(blockquote) {
		border-left: 3px solid rgba(55, 19, 236, 0.5);
		color: #94a3b8;
	}

	/* Horizontal rules */
	.chat-markdown :global(hr) {
		margin-top: 0.75em;
		margin-bottom: 0.75em;
	}

	/* Strong / Bold */
	.chat-markdown :global(strong) {
		font-weight: 700;
	}

	/* Links */
	:global(.dark) .chat-markdown :global(a) {
		color: #818cf8;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	:global(.dark) .chat-markdown :global(a:hover) {
		color: #a5b4fc;
	}
</style>
