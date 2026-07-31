<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/images/bi.svg';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
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
	<header class="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-50">
		<div class="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
			<Button href="{base}/" variant="ghost" class="p-0 hover:bg-transparent h-auto">
				<img src={logo} alt="SangSquare" class="size-8 sm:size-10 md:size-12 lg:size-14" />
			</Button>
			<nav class="flex items-center space-x-2 text-sm font-medium">
				<Button href="{base}/" variant="ghost" class="transition-colors font-semibold hover:text-primary {$page.url.pathname === base + '/' || $page.url.pathname === '/' || $page.url.pathname.startsWith(base + '/detail') || $page.url.pathname.startsWith('/detail') ? 'text-accent-foreground' : 'text-muted-foreground'}">WORK</Button>
				<Button href="{base}/about" variant="ghost" class="transition-colors font-semibold hover:text-primary {$page.url.pathname === base + '/about' || $page.url.pathname === '/about' ? 'text-accent-foreground' : 'text-muted-foreground'}">ABOUT</Button>
				<Button href="{base}/contact" variant="ghost" class="transition-colors font-semibold hover:text-primary {$page.url.pathname === base + '/contact' || $page.url.pathname === '/contact' ? 'text-accent-foreground' : 'text-muted-foreground'}">CONTACT</Button>
			</nav>
		</div>
	</header>

	<main class="flex-1 overflow-x-hidden">
		{@render children()}
	</main>
</div>
