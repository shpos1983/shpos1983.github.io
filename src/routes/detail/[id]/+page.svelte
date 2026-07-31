<script lang="ts">
	import { page } from "$app/stores";
	import { Button } from "$lib/components/ui/button/index.js";
	import { base } from "$app/paths";

	let projectId = $derived($page.params.id ?? '');
	let projectTitle = $derived(projectId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
</script>

<svelte:head>
	<title>{projectTitle} | SangSquare</title>
</svelte:head>

<section class="container mx-auto px-4 py-12 max-w-3xl flex flex-col justify-center min-h-[calc(100vh-4rem)]">
	<div class="border border-border rounded-2xl p-8 bg-card shadow-sm">
		<span class="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Project Detail</span>
		<h1 class="text-4xl font-extrabold tracking-tight mt-2 mb-6">{projectTitle}</h1>
		
		<p class="text-muted-foreground leading-relaxed mb-8">
			This is a statically prerendered detail page for the project: <strong>{projectId}</strong>. 
			All content is hardcoded and served statically without any server requirement.
		</p>
		
		<div class="border-t border-border pt-6 flex justify-between items-center">
			<Button href="{base}/" variant="outline">← Back to Projects</Button>
			<span class="text-sm text-muted-foreground">Statically Generated</span>
		</div>
	</div>
</section>
