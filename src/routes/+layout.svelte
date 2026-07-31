<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/images/bi.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onNavigate } from '$app/navigation';

	let { children } = $props();

	// Enable browser native View Transitions on SvelteKit navigation
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>SangSquare</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="border-b border-border bg-background/95 backdrop-blur-md fixed top-0 z-50">
		<div class="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
			<Button href={resolve('/')} variant="ghost" class="p-0 hover:bg-transparent h-auto">
				<img src={logo} alt="SangSquare" class="size-8 sm:size-10 md:size-12 lg:size-14" />
			</Button>
			<nav class="flex items-center space-x-2 text-sm font-medium">
				<Button href={resolve('/')} variant="ghost" class="transition-colors font-semibold hover:text-primary {page.url.pathname === resolve('/') || page.url.pathname.startsWith(resolve('/detail')) ? 'text-accent-foreground' : 'text-muted-foreground'}">WORK</Button>
				<Button href={resolve('/about')} variant="ghost" class="transition-colors font-semibold hover:text-primary {page.url.pathname === resolve('/about') ? 'text-accent-foreground' : 'text-muted-foreground'}">ABOUT</Button>
				<Button href={resolve('/contact')} variant="ghost" class="transition-colors font-semibold hover:text-primary {page.url.pathname === resolve('/contact') ? 'text-accent-foreground' : 'text-muted-foreground'}">CONTACT</Button>
			</nav>
		</div>
	</header>

	<main class="flex-1 overflow-x-hidden">
		{@render children()}
	</main>
</div>
