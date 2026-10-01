<script lang="ts">
	// import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
</script>

<svelte:head>
	<title>Contact | SangSquare</title>
</svelte:head>


<section class="max-w-[1420px] w-[1420px] mx-auto px-none pt-10 pb-15 flex flex-col min-h-[calc(100vh-4rem)]">
	<div class="">
		<h1 class="text-[100px] font-bold">Sang Hun Lee</h1>
		<div class="mt-6">
			<p class="sys-text-sm">Always up for a good conversation.</p>
			<div class="flex gap-4 mt-4">
				<a href="https://kr.linkedin.com/" target="_blank" class="flex-none block size-12 p-none rounded-full cursor-pointer group">
					<img src="/images/contact/icon_social1.svg" alt="" class="w-full h-full object-cover group-hover:hidden" />
					<img src="/images/contact/icon_social1_hover.svg" alt="" class="w-full h-full object-cover hidden group-hover:block" />
				</a>
				<a href="mailto:shpos1983@gmail.com" target="_blank" class="flex-none block size-12 p-none rounded-full cursor-pointer group">
					<img src="/images/contact/icon_social2.svg" alt="email" class="w-full h-full object-cover group-hover:hidden" />
					<img src="/images/contact/icon_social2_hover.svg" alt="email" class="w-full h-full object-cover hidden group-hover:block" />
				</a>
			</div>
		</div>
	</div>

	<div class="flex mt-20">
		<div class="flex-none w-[564px]">
			<h2 class="sys-title-lg">Experience</h2>
		</div>
		<div class="flex-1 min-w-0 flex flex-col gap-8">
			<div class="w-full">
				<p class="sys-caption">Oct 2019 ~ Present</p>
				<p class="sys-text-lg mt-1 mb-4">UX/UI Design Lead</p>
				<p class="sys-caption">Hankook Tire & Technology</p>
			</div>
			<Separator class="w-full" />
			<div class="w-full">
				<p class="sys-caption">Oct 2016 ~ Feb 2019</p>
				<p class="sys-text-lg mt-1 mb-4">Digital Designer</p>
				<p class="sys-caption">Deutsch · New York</p>
			</div>
			<Separator class="w-full" />
			<div class="w-full">
				<p class="sys-caption">Aug 2015 ~ Oct 2016</p>
				<p class="sys-text-lg mt-1 mb-4">Interactive Designer</p>
				<p class="sys-caption">Vinyl I</p>
			</div>
			<Separator class="w-full" />
			<div class="w-full">
				<p class="sys-caption">Jan 2015 ~ Jun 2015</p>
				<p class="sys-text-lg mt-1 mb-4">Junior Designer</p>
				<p class="sys-caption">Deutsch · New York</p>
			</div>
			<Separator class="w-full" />
			<div class="w-full">
				<p class="sys-caption">Aug 2009 ~ May 2012</p>
				<p class="sys-text-lg mt-1 mb-4">Graphic Designer</p>
				<p class="sys-caption">TME Corp.</p>
			</div>
			<Separator class="w-full" />
		</div>
	</div>
	<div class="flex mt-30">
		<div class="flex-none w-[564px]">
			<h2 class="sys-title-lg">Skill</h2>
		</div>
		<div class="flex-1 min-w-0 flex gap-6">
			<img src="/images/contact/icon_skill_pr.svg" alt="" class="size-14" />
			<img src="/images/contact/icon_skill_ai.svg" alt="" class="size-14" />
			<img src="/images/contact/icon_skill_ps.svg" alt="" class="size-14" />
			<img src="/images/contact/icon_skill_id.svg" alt="" class="size-14" />
			<img src="/images/contact/icon_skill_lr.svg" alt="" class="size-14" />
		</div>
	</div>
</section>
