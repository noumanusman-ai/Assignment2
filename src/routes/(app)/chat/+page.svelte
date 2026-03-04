<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import ChatWindow from '$lib/components/chat/ChatWindow.svelte';

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

	async function logout() {
		await authClient.signOut();
		goto('/login');
	}
</script>

<svelte:head>
	<title>NexusID | Enterprise AI Chat</title>
</svelte:head>

<div
	class="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display"
>
	<!-- Top Navigation Bar -->
	<header
		class="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
	>
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<a href="/" class="flex items-center gap-3">
					<div class="p-2 bg-primary rounded-lg flex items-center justify-center">
						<span class="material-symbols-outlined text-white">shield</span>
					</div>
					<span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white"
						>Nexus<span class="text-primary">ID</span></span
					>
				</a>
				<div class="hidden md:flex items-center gap-6">
					<nav class="flex gap-4">
						<a
							class="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
							href="/profile">Dashboard</a
						>
						<a
							class="px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md"
							href="/chat">AI Assistant</a
						>
					</nav>
					<div class="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
					<div class="flex items-center gap-3">
						<div class="text-right hidden sm:block">
							<p class="text-xs font-semibold text-slate-900 dark:text-slate-100">
								{data.user.name}
							</p>
							<p class="text-[10px] text-slate-500">{data.user.email}</p>
						</div>
						<button onclick={logout} class="relative group">
							<div
								class="size-9 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden"
							>
								<img
									alt="User profile"
									src={data.user.image ||
										`https://avatar.vercel.sh/${data.user.email}`}
									class="h-full w-full object-cover"
								/>
							</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	</header>

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
