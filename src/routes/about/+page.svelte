<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { base } from "$app/paths";
</script>

<svelte:head>
	<title>About | SangSquare</title>
</svelte:head>

<section class="container mx-auto px-4 py-12 max-w-3xl flex flex-col justify-center min-h-[calc(100vh-4rem)]">
	<div class="border border-border rounded-2xl p-8 bg-card shadow-sm">
		<h1 class="text-4xl font-extrabold tracking-tight mb-6">About Me</h1>
		
		<p class="text-muted-foreground leading-relaxed mb-6">
			This is the static <strong>About Page</strong> for SangSquare portfolio website. 
			Everything in this project is hardcoded for maximum speed, security, and hosting flexibility.
		</p>
		
		<p class="text-muted-foreground leading-relaxed mb-8">
			It utilizes SvelteKit 2, Svelte 5, Tailwind CSS v4, and `@sveltejs/adapter-static` to generate pure HTML/JS files that can be deployed to any hosting platform (like GitHub Pages, Cloudflare Pages, or Netlify).
		</p>
		
		<Button href="{base}/contact" class="w-full sm:w-auto">Get In Touch</Button>
	</div>
</section>
