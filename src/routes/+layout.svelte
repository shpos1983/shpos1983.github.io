<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button/index.js';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>SangSquare</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
		<div class="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
			<Button href="{base}/" variant="ghost" class="text-xl font-bold tracking-tight px-2 hover:bg-transparent">SangSquare</Button>
			<nav class="flex items-center space-x-2 text-sm font-medium">
				<Button href="{base}/" variant="ghost" class="transition-colors hover:text-primary {$page.url.pathname === base + '/' || $page.url.pathname === '/' || $page.url.pathname.startsWith(base + '/detail') || $page.url.pathname.startsWith('/detail') ? 'text-primary font-semibold bg-muted/50' : 'text-muted-foreground'}">Work</Button>
				<Button href="{base}/about" variant="ghost" class="transition-colors hover:text-primary {$page.url.pathname === base + '/about' || $page.url.pathname === '/about' ? 'text-primary font-semibold bg-muted/50' : 'text-muted-foreground'}">About</Button>
				<Button href="{base}/contact" variant="ghost" class="transition-colors hover:text-primary {$page.url.pathname === base + '/contact' || $page.url.pathname === '/contact' ? 'text-primary font-semibold bg-muted/50' : 'text-muted-foreground'}">Contact</Button>
			</nav>
		</div>
	</header>

	<main class="flex-1 grid grid-cols-1 grid-rows-1 overflow-x-hidden">
		{#key $page.url.pathname}
			<div 
				class="col-start-1 row-start-1 w-full h-full"
				in:fade={{ duration: 250, delay: 150 }}
				out:fade={{ duration: 150 }}
			>
				{@render children()}
			</div>
		{/key}
	</main>
</div>
