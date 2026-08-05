<script lang="ts">
	// import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { resolve } from "$app/paths";
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Autoplay } from 'swiper/modules';
	import 'swiper/css';
	import 'swiper/css/autoplay';

	let swiperContainer: HTMLElement;

	onMount(() => {
		const swiper = new Swiper(swiperContainer, {
			modules: [Autoplay],
			loop: true,
			speed: 6000,
			autoplay: {
				delay: 0,
				disableOnInteraction: false,
			},
			slidesPerView: 'auto',
			spaceBetween: 0,
			allowTouchMove: false,
		});

		return () => {
			swiper.destroy();
		};
	});
</script>

<svelte:head>
	<title>Work | SangSquare</title>
</svelte:head>

<section class="container max-w-full mx-auto pl-4 xl:pl-14 pt-22 pb-12">
	<div class="mb-40">
		<h1 class="text-lg text-accent-foreground font-extrabold tracking-tight">WHO I AM</h1>
		<div class="flex flex-col gap-8 mt-10">
			<h2 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">
				I bring teams, user needs, and business goals together to build products people value.<br/>
				I turn complex problems into simple experiences.
			</h2>
			<h3 class="text-lg font-light">복잡한 정보와 경험은 명료하게. 고객이 상품을 쉽게 이해하고, 선택의 순간에 확신을 가질 수 있도록.</h3>
		</div>
	</div>
	<div class="mb-40">
		<h1 class="text-lg text-accent-foreground font-extrabold tracking-tight mb-16">CASE STUDIES</h1>
		<div class="flex flex-col gap-12">
			<!-- case01 -->
			<div class="scale-104bg-card flex justify-between gap-10 last:border-b-0">
				<div class="self-start w-10 text-[20px]/12 font-bold">01</div>
				<div class="self-stretch flex-1 flex flex-col justify-between gap-10">
					<div class="flex flex-col gap-8">
						<h2 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">T’Station.com UX Renewal & growth</h2>
						<h3 class="text-lg font-light">타이어는 중요하지만, 대부분의 고객은 타이어를 잘 모른다.<br/>그 간극을 이해하고, 데이터로 검증하며 더 나은 구매 경험을 만들어간 과정.</h3>
					</div>
					<ul class="list-none flex flex-col gap-5 w-full">
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Focus</div>
							<div class="text-sm flex-1">B2C 플랫폼, UX</div>
						</li>
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Impact</div>
							<div class="text-sm flex-1"><em class="not-italic font-bold text-primary">208% 판매성장, 2배의 구매전환율 성장</em></div>
						</li>
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Role</div>
							<div class="text-sm flex-1"><em class="not-italic text-primary">UX Lead</em> / PO / UI / QA</div>
						</li>
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Period</div>
							<div class="text-sm flex-1">‘21 - ‘25</div>
						</li>
					</ul>
				</div>
				<a href={resolve('/work/case01')} class="group/item block self-stretch aspect-2/1 w-[45%] bg-border overflow-hidden">
					<img src="/images/case01/thumb.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
				</a>
			</div>

			<Separator />

			<!-- case02 -->
			<div class="scale-104bg-card flex justify-between gap-10 last:border-b-0">
				<div class="self-start w-10 text-[20px]/12 font-bold">02</div>
				<div class="self-stretch flex-1 flex flex-col justify-between gap-10">
					<div class="flex flex-col gap-8">
						<h2 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">T’Station.com AI Product Launch</h2>
						<h3 class="text-lg font-light">더 이상 타이어 쇼핑이 막막하지 않게.<br/>고객이 확신을 가지고 구매할 수 있도록 AI 경험을 설계한 과정</h3>
					</div>
					<ul class="list-none flex flex-col gap-5 w-full">
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Focus</div>
							<div class="text-sm flex-1">AI, UX</div>
						</li>
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Impact</div>
							<div class="text-sm flex-1"><em class="not-italic font-bold text-primary">고객센터 FAQ 40% 감소, 30% 구매전환 증가</em></div>
						</li>
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Role</div>
							<div class="text-sm flex-1"><em class="not-italic text-primary">UX Lead</em> / PO / UI / QA</div>
						</li>
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Period</div>
							<div class="text-sm flex-1">‘26. JANuary - JULy</div>
						</li>
					</ul>
				</div>
				<a href={resolve('/work/case02')} class="group/item block self-stretch aspect-2/1 w-[45%] bg-border overflow-hidden">
					<img src="/images/case02/thumb.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
				</a>
			</div>

			<Separator />

			<!-- case03 -->
			<div class="scale-104bg-card flex justify-between gap-10 last:border-b-0">
				<div class="self-start w-10 text-[20px]/12 font-bold">03</div>
				<div class="self-stretch flex-1 flex flex-col justify-between gap-10">
					<div class="flex flex-col gap-8">
						<h2 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">T’Station Smart Guide</h2>
						<h3 class="text-lg font-light">좋은 상담은 무엇에서 시작되는지 고민하고, 매장의 실제 업무 흐름 속에서<br/>더 나은 서비스 경험을 만들어온 과정</h3>
					</div>
					<ul class="list-none flex flex-col gap-5 w-full">
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Focus</div>
							<div class="text-sm flex-1">B2B 고객 상담 플랫폼, UX</div>
						</li>
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Impact</div>
							<div class="text-sm flex-1"><em class="not-italic font-bold text-primary">AI, 상담 패러다임의 변화</em></div>
						</li>
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Role</div>
							<div class="text-sm flex-1"><em class="not-italic text-primary">UX Lead</em> / PO / UI / QA</div>
						</li>
						<li class="flex items-start gap-4 text-muted-foreground">
							<div class="text-sm font-extrabold w-12">Period</div>
							<div class="text-sm flex-1">‘25 October - ‘26. May</div>
						</li>
					</ul>
				</div>
				<a href={resolve('/work/case03')} class="group/item block self-stretch aspect-2/1 w-[45%] bg-border overflow-hidden">
					<img src="/images/case03/thumb.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
				</a>
			</div>
		</div>
	</div>
	<div class="mb-15">
		<h1 class="text-lg text-accent-foreground font-extrabold tracking-tight mb-16">FOUNDATIONS</h1>
		<div class="flex flex-col gap-8">
			<h2 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">COMPLEX EXPERIENCES, MADE SIMPLE</h2>
			<h3 class="text-lg font-light">사람들은 제품(Product)보다 먼저 브랜드를 경험한다.<br/>다양한 산업의 복잡한 정보를 쉽고 직관적인 경험으로 바꾸며 다져온 디자인의 출발점.</h3>
		</div>
		<div class="-ml-body-x mt-14 overflow-hidden">
			<div class="swiper" bind:this={swiperContainer}>
				<div class="swiper-wrapper">
					<div class="swiper-slide w-[28%]! min-w-65">
						<a href={resolve("/work/foundations")} class="group/item block aspect-520/420 h-auto w-full bg-border rounded-none">
							<img src="/images/foundations/thumb1.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
						</a>
					</div>
					<div class="swiper-slide w-[28%]! min-w-65">
						<a href={resolve("/work/foundations")} class="group/item block aspect-520/420 h-auto w-full bg-border rounded-none">
							<img src="/images/foundations/thumb2.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
						</a>
					</div>
					<div class="swiper-slide w-[28%]! min-w-65">
						<a href={resolve("/work/foundations")} class="group/item block aspect-520/420 h-auto w-full bg-border rounded-none">
							<img src="/images/foundations/thumb3.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
						</a>
					</div>
					<div class="swiper-slide w-[28%]! min-w-65">
						<a href={resolve("/work/foundations")} class="group/item block aspect-520/420 h-auto w-full bg-border rounded-none">
							<img src="/images/foundations/thumb4.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
						</a>
					</div>
					<div class="swiper-slide w-[28%]! min-w-65">
						<a href={resolve("/work/foundations")} class="group/item block aspect-520/420 h-auto w-full bg-border rounded-none">
							<img src="/images/foundations/thumb5.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
						</a>
					</div>
					<div class="swiper-slide w-[28%]! min-w-65">
						<a href={resolve("/work/foundations")} class="group/item block aspect-520/420 h-auto w-full bg-border rounded-none">
							<img src="/images/foundations/thumb6.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
						</a>
					</div>
					<div class="swiper-slide w-[28%]! min-w-65">
						<a href={resolve("/work/foundations")} class="group/item block aspect-520/420 h-auto w-full bg-border rounded-none">
							<img src="/images/foundations/thumb7.png" alt="" class="object-cover w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	:global(.swiper-wrapper) {
		transition-timing-function: linear !important;
	}
</style>
