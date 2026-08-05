<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
</script>

<svelte:head>
	<title>Contact | SangSquare</title>
</svelte:head>

<section class="container max-w-full mx-auto px-4 py-12 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
	<div class="border border-border rounded-2xl p-8 bg-card shadow-sm">
		<h1 class="text-4xl font-extrabold tracking-tight mb-6">Contact</h1>
		
		<p class="text-muted-foreground leading-relaxed mb-8">
			This is the static <strong>Contact Page</strong>. 
			Feel free to design this page with a dynamic form mapping to services like Formspree, Web3Forms, or just simple mailto links since there is no server running.
		</p>
		
		<form onsubmit={(e) => e.preventDefault()} class="space-y-4 max-w-md mx-auto sm:mx-0">
			<div>
				<label class="block text-sm font-semibold mb-1" for="name">Name</label>
				<input class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm" id="name" type="text" placeholder="John Doe" />
			</div>
			<div>
				<label class="block text-sm font-semibold mb-1" for="email">Email</label>
				<input class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm" id="email" type="email" placeholder="john@example.com" />
			</div>
			<div>
				<label class="block text-sm font-semibold mb-1" for="message">Message</label>
				<textarea class="w-full px-3 py-2 border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-sm" id="message" rows="4" placeholder="Hello..."></textarea>
			</div>
			<Button type="submit" class="w-full">Send Message</Button>
		</form>
	</div>
</section>
