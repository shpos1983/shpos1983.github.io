<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { base } from "$app/paths";
</script>

<svelte:head>
	<title>Work | SangSquare</title>
</svelte:head>

<section class="container mx-auto px-4 py-12 max-w-5xl">
	<div class="mb-12">
		<h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">Who I am</h1>
		<p class="text-xl text-muted-foreground leading-relaxed">
			I bring teams, user needs, and business goals together<br/>to build products people value.
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		<!-- Project 1 -->
		<div class="border border-border rounded-xl p-6 bg-card hover:shadow-md transition-shadow flex flex-col justify-between">
			<div>
				<span class="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Project 01</span>
				<h2 class="text-2xl font-bold mt-2 mb-4">First Static Project</h2>
				<p class="text-muted-foreground mb-6">A showcase of static UI development using SvelteKit and Tailwind CSS v4.</p>
			</div>
			<Button href="{base}/detail/project-1" variant="outline" size="sm" class="w-full">View Project</Button>
		</div>

		<!-- Project 2 -->
		<div class="border border-border rounded-xl p-6 bg-card hover:shadow-md transition-shadow flex flex-col justify-between">
			<div>
				<span class="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Project 02</span>
				<h2 class="text-2xl font-bold mt-2 mb-4">Interactive Web App</h2>
				<p class="text-muted-foreground mb-6">Premium client interfaces with smooth micro-animations and custom theme systems.</p>
			</div>
			<Button href="{base}/detail/project-2" variant="outline" size="sm" class="w-full">View Project</Button>
		</div>

		<!-- Project 3 -->
		<div class="border border-border rounded-xl p-6 bg-card hover:shadow-md transition-shadow flex flex-col justify-between">
			<div>
				<span class="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Project 03</span>
				<h2 class="text-2xl font-bold mt-2 mb-4">Creative Portfolio</h2>
				<p class="text-muted-foreground mb-6">A minimal and clean design pattern optimized for performance and SEO.</p>
			</div>
			<Button href="{base}/detail/project-3" variant="outline" size="sm" class="w-full">View Project</Button>
		</div>
	</div>
</section>
