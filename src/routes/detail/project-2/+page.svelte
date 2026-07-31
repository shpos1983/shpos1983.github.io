<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { base } from "$app/paths";
</script>

<svelte:head>
	<title>Interactive Web App | SangSquare</title>
</svelte:head>

<section class="container mx-auto px-4 py-12 max-w-3xl flex flex-col justify-center min-h-[calc(100vh-4rem)]">
	<div class="border border-border rounded-2xl p-8 bg-card shadow-sm">
		<span class="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Project Detail</span>
		<h1 class="text-4xl font-extrabold tracking-tight mt-2 mb-6">Interactive Web App</h1>
		
		<p class="text-muted-foreground leading-relaxed mb-8">
			This is the statically rendered page for <strong>Project 02 (Interactive Web App)</strong>. 
			This route is physically created in the routes directory as a dedicated folder structure.
		</p>
		
		<div class="border-t border-border pt-6 flex justify-between items-center">
			<Button href="{base}/" variant="outline">← Back to Projects</Button>
			<span class="text-sm text-muted-foreground">Dedicated Route</span>
		</div>
	</div>
</section>
