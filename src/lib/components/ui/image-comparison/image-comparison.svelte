<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Snippet } from "svelte";

	let {
		beforeImage,
		afterImage,
		beforeAlt = "개편 전 화면",
		afterAlt = "개편 후 화면",
		initialPosition = 50,
		position = $bindable(initialPosition),
		class: className = "",
		before,
		after,
		...restProps
	}: {
		beforeImage?: string;
		afterImage?: string;
		beforeAlt?: string;
		afterAlt?: string;
		initialPosition?: number;
		position?: number;
		class?: string;
		before?: Snippet;
		after?: Snippet;
		[key: string]: any;
	} = $props();

	let isDragging = $state(false);
	let containerRef = $state<HTMLDivElement | null>(null);

	function setPositionFromClientX(clientX: number) {
		if (!containerRef) return;
		const rect = containerRef.getBoundingClientRect();
		if (rect.width <= 0) return;
		const x = clientX - rect.left;
		const percentage = (x / rect.width) * 100;
		position = Math.max(0, Math.min(100, percentage));
	}

	function handlePointerDown(e: PointerEvent) {
		isDragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		setPositionFromClientX(e.clientX);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isDragging) return;
		setPositionFromClientX(e.clientX);
	}

	function handlePointerUp(e: PointerEvent) {
		if (isDragging) {
			isDragging = false;
			try {
				(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
			} catch (_) {}
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === "ArrowLeft") {
			position = Math.max(0, position - 2);
			e.preventDefault();
		} else if (e.key === "ArrowRight") {
			position = Math.min(100, position + 2);
			e.preventDefault();
		} else if (e.key === "Home") {
			position = 0;
			e.preventDefault();
		} else if (e.key === "End") {
			position = 100;
			e.preventDefault();
		}
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	bind:this={containerRef}
	class={cn(
		"relative select-none overflow-hidden touch-none cursor-ew-resize group",
		className
	)}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	onpointercancel={handlePointerUp}
	tabindex="0"
	role="slider"
	aria-valuenow={Math.round(position)}
	aria-valuemin="0"
	aria-valuemax="100"
	aria-label="Before and after comparison slider"
	onkeydown={handleKeyDown}
	{...restProps}
>
	<!-- Before (AS-IS) - Base Layer on right / full size -->
	{#if before}
		{@render before()}
	{:else if beforeImage}
		<img
			src={beforeImage}
			alt={beforeAlt}
			class="block w-full h-full object-cover pointer-events-none select-none"
			draggable="false"
		/>
	{/if}

	<!-- After (TO-BE) - Top Layer on left, masked via clip-path -->
	<div
		class="absolute inset-0 overflow-hidden pointer-events-none select-none"
		style="clip-path: inset(0 {100 - position}% 0 0);"
	>
		{#if after}
			{@render after()}
		{:else if afterImage}
			<img
				src={afterImage}
				alt={afterAlt}
				class="block w-full h-full object-cover pointer-events-none select-none"
				draggable="false"
			/>
		{/if}
	</div>

	<!-- Divider Line & Handle -->
	<div
		class="absolute top-0 bottom-0 pointer-events-none z-10 -translate-x-1/2 flex items-center justify-center"
		style="left: {position}%;"
	>
		<!-- Vertical Line -->
		<div class="w-px h-full bg-border"></div>

		<!-- Resizable Pill Handle -->
		<div
			class={cn(
				"absolute h-14 w-2 rounded-full bg-ts-n2 flex items-center justify-center border border-border transition-[transform,background-color] duration-100 text-ts-n3",
				isDragging
					? "bg-ts-n1 text-ts-n2"
					: "group-hover:bg-ts-n1 group-hover:text-ts-n2"
			)}
		>
			<div class="flex items-center justify-center gap-1">
				<!-- Left arrow -->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
					<path d="M14 18l-6-6 6-6v12z" />
				</svg>
				<!-- Right arrow -->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
					<path d="M10 6l6 6-6 6V6z" />
				</svg>
			</div>
		</div>
	</div>
</div>
