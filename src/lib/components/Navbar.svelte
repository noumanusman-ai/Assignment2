<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { authClient } from '$lib/auth-client';

	let {
		user = undefined,
		variant = 'default'
	}: {
		user?: { name: string; email: string; image?: string | null; role?: string } | undefined;
		variant?: 'default' | 'admin';
	} = $props();

	let showMobileMenu = $state(false);

	const pathname = $derived(page.url.pathname);

	const navLinks = $derived(
		[
			{ href: '/', label: 'Home', icon: 'home' },
			{ href: '/chat', label: 'AI Assistant', icon: 'smart_toy' },
			{ href: '/profile', label: 'Profile', icon: 'person' },
			...(user?.role === 'admin' ? [{ href: '/admin', label: 'Dashboard', icon: 'admin_panel_settings' }] : [])
		] as const
	);

	function isActive(href: string): boolean {
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}

	async function logout() {
		await authClient.signOut();
		goto('/login');
	}
</script>

<header
	class="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md
		{variant === 'admin'
		? 'border-primary/20 bg-[#16112b]/80'
		: 'border-slate-200 dark:border-slate-800 dark:bg-slate-950/80'}"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-3">
				<div class="p-2 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
					<span class="material-symbols-outlined text-white">shield</span>
				</div>
				<span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
					Nexus<span class="text-primary">ID</span>
				</span>
			</a>

			<!-- Desktop Nav -->
			<nav class="hidden md:flex items-center gap-1">
				{#each navLinks as link}
					{#if isActive(link.href)}
						<a
							href={link.href}
							class="px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md"
						>
							{link.label}
						</a>
					{:else}
						<a
							href={link.href}
							class="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
						>
							{link.label}
						</a>
					{/if}
				{/each}
			</nav>

			<!-- Right side -->
			<div class="flex items-center gap-4">
				{#if user}
					<div class="hidden md:flex items-center gap-3">
						<div class="text-right hidden sm:block">
							<p class="text-xs font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
							<p class="text-[10px] text-slate-500">{user.email}</p>
						</div>
						<button onclick={logout} class="relative group" title="Sign out">
							<div
								class="size-9 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden"
							>
								<img
									alt="User profile"
									src={user.image || `https://avatar.vercel.sh/${user.email}`}
									class="h-full w-full object-cover"
								/>
							</div>
						</button>
					</div>
				{:else}
					<a
						href="/login"
						class="hidden sm:flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
					>
						Get Started
					</a>
				{/if}

				<!-- Mobile hamburger -->
				<button
					onclick={() => (showMobileMenu = !showMobileMenu)}
					class="md:hidden rounded-lg p-1 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
				>
					<span class="material-symbols-outlined text-2xl">
						{showMobileMenu ? 'close' : 'menu'}
					</span>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if showMobileMenu}
		<div class="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4">
			<nav class="flex flex-col gap-1">
				{#each navLinks as link}
					<a
						href={link.href}
						onclick={() => (showMobileMenu = false)}
						class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
							{isActive(link.href)
							? 'bg-primary/10 text-primary'
							: 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}"
					>
						<span class="material-symbols-outlined text-lg">{link.icon}</span>
						{link.label}
					</a>
				{/each}
			</nav>
			{#if user}
				<div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
					<div class="flex items-center gap-3 px-3 mb-3">
						<div
							class="size-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden"
						>
							<img
								alt="User profile"
								src={user.image || `https://avatar.vercel.sh/${user.email}`}
								class="h-full w-full object-cover"
							/>
						</div>
						<div>
							<p class="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
							<p class="text-[10px] text-slate-500">{user.email}</p>
						</div>
					</div>
					<button
						onclick={logout}
						class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
					>
						<span class="material-symbols-outlined text-lg">logout</span>
						Sign Out
					</button>
				</div>
			{:else}
				<div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
					<a
						href="/login"
						class="flex w-full items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white"
					>
						Get Started
					</a>
				</div>
			{/if}
		</div>
	{/if}
</header>
