<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import ChatWindow from '$lib/components/chat/ChatWindow.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	let { data } = $props();

	const chat = new Chat({});

	let input = $state('');

	function handleSubmit() {
		if (!input.trim()) return;
		const text = input;
		input = '';
		chat.sendMessage({ text });
	}

	function handleClear() {
		chat.messages = [];
	}
</script>

<svelte:head>
	<title>NexusID | Enterprise AI Chat</title>
</svelte:head>

<div
	class="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display"
>
	<Navbar user={data.user} />

	<!-- Main Content Area -->
	<main class="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
		<div class="w-full max-w-4xl">
			<ChatWindow
				messages={chat.messages}
				bind:input
				onsubmit={handleSubmit}
				onclear={handleClear}
				status={chat.status}
				error={chat.error}
			/>
		</div>

		<!-- Footer Stats -->
		<div class="mt-6 flex flex-wrap justify-center gap-6 opacity-60">
			<div class="flex items-center gap-2">
				<div class="size-2 bg-primary rounded-full"></div>
				<span class="text-xs font-semibold text-slate-500 uppercase tracking-widest"
					>Svelte 5 Engine Ready</span
				>
			</div>
			<div class="flex items-center gap-2">
				<div class="size-2 bg-slate-400 rounded-full"></div>
				<span class="text-xs font-semibold text-slate-500 uppercase tracking-widest"
					>AES-256 Encrypted</span
				>
			</div>
			<div class="flex items-center gap-2">
				<div class="size-2 bg-slate-400 rounded-full"></div>
				<span class="text-xs font-semibold text-slate-500 uppercase tracking-widest"
					>v2.4.0-prod</span
				>
			</div>
		</div>
	</main>

	<!-- Background Decorative Elements -->
	<div
		class="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none opacity-20 dark:opacity-40"
	>
		<div
			class="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full"
		></div>
		<div
			class="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-500/10 blur-[100px] rounded-full"
		></div>
	</div>
</div>
