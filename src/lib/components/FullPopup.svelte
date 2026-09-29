<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';
	import { CircleX } from '@lucide/svelte';

	interface Props {
		open?: boolean;
		onclose?: () => void;
		header?: Snippet;
		children?: Snippet;
	}

	let {
		open = $bindable(false),
		onclose,
		header,
		children
	}: Props = $props();

	function close() {
		open = false;
		onclose?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && open) {
			close();
		}
	}

	// 팝업 열릴 때 배경(body) 스크롤 방지
	$effect(() => {
		if (open) {
			const originalOverflow = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-50 flex flex-col bg-background text-foreground overflow-y-auto"
		in:fly={{ y: 36, duration: 300, easing: cubicOut }}
		out:fly={{ y: 36, duration: 240, easing: cubicIn }}
		role="dialog"
		aria-modal="true"
	>
		<!-- 상단 고정 헤더 -->
		<header class="sticky top-0 z-20 w-full bg-background/90 backdrop-blur-md py-6">
			<div class="w-[1200px] max-w-full mx-auto flex items-center justify-between">
				<div class="flex items-center gap-4">
					{#if header}
						{@render header()}
					{/if}
				</div>

				<button
					type="button"
					class="w-10 h-10 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
					onclick={close}
					aria-label="팝업 닫기"
				>
					<CircleX class="size-10 stroke-[1.5]" />
				</button>
			</div>
		</header>

		<!-- 본문: 풀사이즈 팝업 내에서 독립 스크롤, w-[1200px] 컨텐츠 -->
		<main class="flex-1 w-full">
			<div class="w-[1200px] max-w-full mx-auto pt-16 pb-14 flex flex-col">
				{#if children}
					{@render children()}
				{/if}

				<!-- 하단 닫기 버튼 -->
				<div class="flex justify-center mt-12">
					<button
						type="button"
						class="inline-flex items-center h-12 gap-2 pl-4 pr-1 rounded-full bg-background hover:bg-muted/80 text-foreground font-medium text-sm transition-colors cursor-pointer"
						onclick={close}
					>
						<span class="sys-text-sm">Close</span>
						<CircleX class="size-10 stroke-[1.5]" />
					</button>
				</div>
			</div>
		</main>
	</div>
{/if}
