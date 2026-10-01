<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import logo from '$lib/assets/images/bi.svg';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { Button } from '$lib/components/ui/button/index.js';
	import { afterNavigate, onNavigate } from '$app/navigation';
	// import { Menu } from '@lucide/svelte';
	// import {
	// 	Sheet,
	// 	SheetContent,
	// 	SheetHeader,
	// 	SheetTitle
	// } from '$lib/components/ui/sheet/index.js';

	let { children } = $props();
	let y = $state(0);
	// let isOpen = $state(false);

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

	afterNavigate(() => {
		if (typeof window !== 'undefined') {
			window.dispatchEvent(new CustomEvent('app:after-navigate'));
		}
	});
	// Keep document zoom in sync with client width (min 1280, max 1920)
	$effect(() => {
		const updateZoom = () => {
			const w = document.documentElement.clientWidth || window.innerWidth;
			if (w >= 1920) {
				document.documentElement.style.setProperty('--doc-zoom', '1');
			} else if (w >= 1280) {
				// 1280px ~ 1920px: 서브픽셀 반올림 넘침 방지(-1px)로 가로스크롤 방지 (overflow-x 잠금 금지)
				const scale = (w - 1) / 1920;
				document.documentElement.style.setProperty('--doc-zoom', String(scale));
			} else {
				// 1280px 미만: 최소 1280px 고정 스케일 (가로 스크롤 허용)
				const scale = 1280 / 1920;
				document.documentElement.style.setProperty('--doc-zoom', String(scale));
			}
		};
		updateZoom();
		window.addEventListener('resize', updateZoom, { passive: true });

		return () => {
			window.removeEventListener('resize', updateZoom);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>SangSquare</title>
</svelte:head>

<svelte:window bind:scrollY={y} />

<div class="doc-zoom-wrapper min-h-screen flex flex-col item-stretch">
	<header class="sticky top-0 z-50 global-header">
		<div class="container max-w-full mx-auto px-body-x h-header flex items-center justify-between">
			<Button href={resolve('/')} variant="ghost" class="p-0  hover:bg-transparent! h-auto flex items-center justify-start relative">
				<div class="flex items-center transition-opacity ease-linear duration-400 {y <= 0 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}">
					<img src={logo} alt="SangSquare" class="size-14 transition-all" />
				</div>
				<div class="flex items-center transition-opacity ease-linear duration-400 {y > 0 ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}">
					<p class="font-extrabold text-lg whitespace-nowrap text-foreground">SENSE & STRATEGY</p>
				</div>
			</Button>
			<nav class="flex flex-col items-end gap-0 text-sm font-medium ">
				<Button href={resolve('/')} variant="ghost" size="xs" class="transition-colors text-sm font-semibold hover:text-accent-foreground hover:bg-transparent! {page.url.pathname === resolve('/') || page.url.pathname.startsWith(resolve('/work')) ? 'text-accent-foreground' : 'text-primary'}">WORK</Button>
				<Button href={resolve('/my-story')} variant="ghost" size="xs" class="transition-colors text-sm font-semibold hover:text-accent-foreground hover:bg-transparent! {page.url.pathname === resolve('/my-story') ? 'text-accent-foreground' : 'text-primary'}">MY STORY</Button>
				<Button href={resolve('/contact')} variant="ghost" size="xs" class="transition-colors text-sm font-semibold hover:text-accent-foreground hover:bg-transparent! {page.url.pathname === resolve('/contact') ? 'text-accent-foreground' : 'text-primary'}">CONTACT</Button>
			</nav>
		</div>
	</header>

	<main class="flex-1">
		{@render children()}
	</main>

	<footer class="py-6">
		<p class="text-base font-extralight text-center"><em class="font-medium">2026 Sanghun.Lee</em> © all right reserved</p>
	</footer>
</div>
