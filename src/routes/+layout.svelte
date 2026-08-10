<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/images/bi.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import { onNavigate } from '$app/navigation';
	import { Menu } from '@lucide/svelte';
	import {
		Sheet,
		SheetContent,
		SheetHeader,
		SheetTitle
	} from '$lib/components/ui/sheet/index.js';

	let { children } = $props();
	let y = $state(0);
	let isOpen = $state(false);

	// Automatically close the sheet when switching to medium (desktop) screen size
	$effect(() => {
		const mediaQuery = window.matchMedia('(min-width: 768px)');
		const handler = (e: MediaQueryListEvent) => {
			if (e.matches) {
				isOpen = false;
			}
		};
		if (mediaQuery.matches) {
			isOpen = false;
		}
		mediaQuery.addEventListener('change', handler);
		return () => {
			mediaQuery.removeEventListener('change', handler);
		};
	});

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

<svelte:window bind:scrollY={y} />

<div class="min-h-screen flex flex-col item-stretch">
	<header class="sticky top-0 z-50 global-header">
		<div class="container max-w-full mx-auto px-body-x h-header flex items-center justify-between">
			<Button href={resolve('/')} variant="ghost" class="p-0  hover:bg-transparent! h-auto flex items-center justify-start relative">
				<div class="flex items-center transition-opacity ease-linear duration-400 {y <= 8 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}">
					<img src={logo} alt="SangSquare" class="size-7 md:size-10 xl:size-14 transition-all" />
				</div>
				<div class="flex items-center transition-opacity ease-linear duration-400 {y > 8 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}">
					<p class="font-extrabold text-sm md:text-base xl:text-lg whitespace-nowrap">SENSE & STRATEGY</p>
				</div>
			</Button>
			<nav class="hidden md:flex items-center gap-2 xl:flex-col xl:items-end xl:gap-0 text-sm font-medium ">
				<Button href={resolve('/')} variant="ghost" size="xs" class="transition-colors text-sm font-semibold hover:text-accent-foreground hover:bg-transparent! {page.url.pathname === resolve('/') || page.url.pathname.startsWith(resolve('/work')) ? 'text-accent-foreground' : 'text-primary'}">WORK</Button>
				<Button href={resolve('/about')} variant="ghost" size="xs" class="transition-colors text-sm font-semibold hover:text-accent-foreground hover:bg-transparent! {page.url.pathname === resolve('/about') ? 'text-accent-foreground' : 'text-primary'}">ABOUT</Button>
				<Button href={resolve('/contact')} variant="ghost" size="xs" class="transition-colors text-sm font-semibold hover:text-accent-foreground hover:bg-transparent! {page.url.pathname === resolve('/contact') ? 'text-accent-foreground' : 'text-primary'}">CONTACT</Button>
			</nav>

			<Sheet bind:open={isOpen}>
				<Button
					variant="ghost"
					size="icon-lg"
					class="md:hidden active:bg-foreground/20!"
					onclick={() => isOpen = true}
				>
					<Menu class="size-5" />
					<span class="sr-only">Menu Open</span>
				</Button>
				<SheetContent side="right" class="w-full! p-6 flex flex-col justify-start data-[side=right]:data-closed:slide-out-to-right-0!">
					<SheetHeader>
						<SheetTitle class="text-left font-extrabold text-lg">SENSE & STRATEGY</SheetTitle>
					</SheetHeader>
					<nav class="flex flex-col mt-8">
						<Button
							href={resolve('/')}
							onclick={() => isOpen = false}
							variant="ghost"
							class="justify-start text-lg font-light hover:bg-muted! px-4 py-2 rounded-md {page.url.pathname === resolve('/') || page.url.pathname.startsWith(resolve('/work')) ? 'text-accent-foreground bg-muted' : 'text-primary'}"
						>
							WORK
						</Button>
						<Button
							href={resolve('/about')}
							onclick={() => isOpen = false}
							variant="ghost"
							class="justify-start text-lg font-light hover:bg-muted! px-4 py-2 rounded-md {page.url.pathname === resolve('/about') ? 'text-accent-foreground bg-muted' : 'text-primary'}"
						>
							ABOUT
						</Button>
						<Button
							href={resolve('/contact')}
							onclick={() => isOpen = false}
							variant="ghost"
							class="justify-start text-lg font-light hover:bg-muted! px-4 py-2 rounded-md {page.url.pathname === resolve('/contact') ? 'text-accent-foreground bg-muted' : 'text-primary'}"
						>
							CONTACT
						</Button>
					</nav>
				</SheetContent>
			</Sheet>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="py-6">
		<p class="text-base font-extralight text-center">2026 Sanghun.Lee © all right reserved</p>
	</footer>
</div>
