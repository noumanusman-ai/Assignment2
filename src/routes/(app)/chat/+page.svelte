<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import ChatWindow from '$lib/components/chat/ChatWindow.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { browser } from '$app/environment';

	let { data } = $props();

	let chat = new Chat({});
	let input = $state('');
	let conversationId = $state(data.activeConversation?.id || '');

	// Load conversation ID from localStorage on mount
	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem('currentConversationId');
			if (saved && !conversationId) {
				conversationId = saved;
			}
		}
	});

	async function handleSubmit() {
		if (!input.trim()) return;
		const text = input;
		input = '';

		try {
			// Ensure we have a conversation ID
			if (!conversationId) {
				const response = await fetch('/api/conversations/get-or-create', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' }
				});
				const result = await response.json();
				if (result.id) {
					conversationId = result.id;
					if (browser) {
						localStorage.setItem('currentConversationId', result.id);
					}
					console.log('Conversation ID set:', conversationId);
				}
			}

			// Create a wrapper around fetch for this specific call
			const originalFetch = globalThis.fetch;
			let fetchUsed = false;

			(globalThis as any).fetch = async (input: any, init?: any) => {
				// Add conversationId to chat API calls
				if (typeof input === 'string' && input.includes('/api/chat') && !fetchUsed) {
					fetchUsed = true;
					console.log('Intercepting /api/chat request, adding conversationId:', conversationId);
					try {
						const body = init?.body ? JSON.parse(init.body as string) : {};
						body.conversationId = conversationId;
						init = { ...init, body: JSON.stringify(body) };
						console.log('Modified request body:', body);
					} catch (e) {
						console.error('Error modifying request:', e);
					}
				}
				return originalFetch(input, init);
			};

			console.log('Sending message:', text);
			// Send the message
			await chat.sendMessage({ text });

			// Restore original fetch after a short delay to ensure it completes
			setTimeout(() => {
				(globalThis as any).fetch = originalFetch;
			}, 100);
		} catch (error) {
			console.error('Error sending message:', error);
		}
	}

	function handleClear() {
		chat.messages = [];
		conversationId = '';
		if (browser) {
			localStorage.removeItem('currentConversationId');
		}
	}

	async function loadConversationMessages() {
		if (!conversationId) return;

		try {
			const response = await fetch(`/api/chat/messages?conversationId=${conversationId}`);
			const data = await response.json();

			if (data.messages) {
				chat.messages = data.messages.map((msg: any) => ({
					role: msg.role,
					content: msg.content
				}));
			}
		} catch (error) {
			console.error('Failed to load messages:', error);
		}
	}

	$effect.pre(() => {
		if (conversationId && conversationId !== data.activeConversation?.id) {
			loadConversationMessages();
		}
	});
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
					>Langchain + Memory</span
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
					>v2.5.0-prod</span
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
