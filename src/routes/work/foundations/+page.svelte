<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<svelte:head>
	<title>Foundations | SangSquare</title>
</svelte:head>

<section class="container max-w-full mx-auto px-4 py-12 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
	<div class="border border-border rounded-2xl p-8 bg-card shadow-sm">
		<span class="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Project Detail</span>
		<h1 class="text-4xl font-extrabold tracking-tight mt-2 mb-6">Creative Portfolio</h1>
		
		<p class="text-muted-foreground leading-relaxed mb-8">
			This is the statically rendered page for <strong>Project 03 (Creative Portfolio)</strong>. 
			This route is physically created in the routes directory as a dedicated folder structure.
		</p>
		
		<div class="border-t border-border pt-6 flex justify-between items-center">
			<Button variant="outline" onclick={() => history.back()}>← Back to Projects</Button>
			<span class="text-sm text-muted-foreground">Dedicated Route</span>
		</div>
	</div>
</section>
