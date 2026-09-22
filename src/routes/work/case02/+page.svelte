<script lang="ts">
	import { onMount } from "svelte";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import Swiper from "swiper";
	import type { SwiperOptions } from "swiper/types";
	import { Autoplay, Controller, EffectCreative, EffectFade, Pagination } from "swiper/modules";
	import "swiper/css";
	import "swiper/css/autoplay";
	import "swiper/css/effect-creative";
	import "swiper/css/effect-fade";
	import "swiper/css/pagination";
	// import { Button } from "$lib/components/ui/button/index.js";
	import { ArrowRight, CirclePause, CirclePlay } from '@lucide/svelte';

	const DEFAULT_HEADER_HEIGHT = 144;
	const DEFAULT_HERO_HEIGHT = 588;

	let scrollY = $state(0);
	let caseBodyEl = $state<HTMLElement | null>(null);
	let activeSectionId = $state("01");
	let isScrollingTo = false;
	let activeFocusing = $state(1);
	let mockupSwiper = $state<Swiper | null>(null);
	let headerHeight = $state(DEFAULT_HEADER_HEIGHT);
	let heroHeight = $state(DEFAULT_HERO_HEIGHT);

	let maxScroll = $derived(heroHeight - headerHeight);

	const aiSteps = [
		{
			id: 0,
			seconds: 1,
			timestamp: "00:01",
			label: "대화 시작",
			accumulatedInfo: "차량·타이어 사이즈"
		},
		{
			id: 1,
			seconds: 23,
			timestamp: "00:23",
			label: "상품추천",
			accumulatedInfo: "선호 조건·추천 상품"
		},
		{
			id: 2,
			seconds: 52,
			timestamp: "00:52",
			label: "상품 비교",
			accumulatedInfo: "비교·상품 선택"
		},
		{
			id: 3,
			seconds: 87,
			timestamp: "01:27",
			label: "매장·일정",
			accumulatedInfo: "장착점·날짜·시간"
		},
		{
			id: 4,
			seconds: 135,
			timestamp: "02:15",
			label: "주문 확인",
			accumulatedInfo: "최종 가격·주문 정보"
		}
	];

	let aiVideoEl = $state<HTMLVideoElement | null>(null);
	let currentAiStep = $state(-1);
	let isAiVideoPlaying = $state(false);

	function handleAiTimeUpdate() {
		if (!aiVideoEl) return;
		const time = aiVideoEl.currentTime;
		let activeIdx = -1;
		for (let i = aiSteps.length - 1; i >= 0; i--) {
			if (time >= aiSteps[i].seconds) {
				activeIdx = i;
				break;
			}
		}
		currentAiStep = activeIdx;
	}

	function handleAiStepClick(index: number) {
		if (!aiVideoEl) return;
		if (currentAiStep === index) {
			if (aiVideoEl.paused) {
				if (aiVideoEl.ended) {
					aiVideoEl.currentTime = aiSteps[index].seconds;
				}
				aiVideoEl.play().catch(() => {});
			} else {
				aiVideoEl.pause();
			}
		} else {
			currentAiStep = index;
			aiVideoEl.currentTime = aiSteps[index].seconds;
			aiVideoEl.play().catch(() => {});
		}
	}

	let questionSwiper = $state<Swiper | null>(null);
	let answerSwiper = $state<Swiper | null>(null);

	const sections = [
		{ id: "01", label: "01. OVERVIEW" },
		{ id: "02", label: "02. CONTEXT & CHALLENGE" },
		{ id: "03", label: "03. STRATEGY" },
		{ id: "04", label: "04. SERVICE DEFINITION" },
		{ id: "05", label: "05. EXPERIENCE DESIGN" },
		{ id: "06", label: "06. VALIDATION" },
		{ id: "07", label: "07. OUTCOME" },
		{ id: "08", label: "08. REFLECTION" }
	];

	function updateLayoutDimensions() {
		if (typeof window !== "undefined") {
			const style = getComputedStyle(document.documentElement);
			
			const headerVal = parseInt(style.getPropertyValue('--header-height').trim(), 10);
			headerHeight = headerVal || DEFAULT_HEADER_HEIGHT;
			
			const heroVal = parseInt(style.getPropertyValue('--case-hero-height').trim(), 10);
			heroHeight = heroVal || DEFAULT_HERO_HEIGHT;
		}
	}

	function scrollToSection(id: string) {
		const element = document.getElementById(id);
		if (element) {
			isScrollingTo = true;
			activeSectionId = id;
			element.scrollIntoView({ behavior: "smooth" });
			
			setTimeout(() => {
				isScrollingTo = false;
			}, 800);
		}
	}

	// Calculate parallax progress (0 to 1) until case-body reaches the top (scrollY = maxScroll)
	let progress = $derived(maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0);
	// Translate the image upwards by up to 100px as the user scrolls
	let translateY = $derived(progress * -100);

	let bodyScrollProgress = $derived.by(() => {
		if (typeof window === "undefined" || !caseBodyEl) return 0;
		const start = caseBodyEl.offsetTop - headerHeight;
		const totalHeight = caseBodyEl.offsetHeight - window.innerHeight + headerHeight;
		if (totalHeight <= 0) return 0;
		const progressVal = Math.round(((scrollY - start) / totalHeight) * 100);
		return Math.min(Math.max(progressVal, 0), 100);
	});

	function swiper(node: HTMLElement, options: SwiperOptions = {}) {
		const isOverflowVisibleSwiper = node.classList.contains('overflow-visible-swiper');
		const defaultOptions: SwiperOptions = {
			slidesPerView: isOverflowVisibleSwiper ? "auto" : 1,
			spaceBetween: isOverflowVisibleSwiper ? 24 : 0,
			slideToClickedSlide: isOverflowVisibleSwiper ? true : false,
			allowTouchMove: true
		};
		const finalOptions = { ...defaultOptions, ...options };
		if (finalOptions.pagination && typeof finalOptions.pagination === 'object' && typeof finalOptions.pagination.el === 'string') {
			const localEl = node.querySelector(finalOptions.pagination.el);
			if (localEl) {
				finalOptions.pagination = {
					...finalOptions.pagination,
					el: localEl as HTMLElement
				};
			}
		}
		const s = new Swiper(node, finalOptions);
		return {
			destroy() {
				s.destroy();
			}
		};
	}

	onMount(() => {
		updateLayoutDimensions();

		let observer: IntersectionObserver | null = null;

		const setupObserver = () => {
			if (observer) observer.disconnect();

			const topMargin = -Math.round(headerHeight + 6);

			const observerOptions = {
				root: null,
				rootMargin: `${topMargin}px 0px -60% 0px`,
				threshold: 0
			};

			observer = new IntersectionObserver((entries) => {
				if (isScrollingTo) return;
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSectionId = entry.target.id;
					}
				});
			}, observerOptions);

			const sectionElements = document.querySelectorAll(".case-section");
			sectionElements.forEach((sec) => observer?.observe(sec));
		};

		setupObserver();

		const handleResize = () => {
			updateLayoutDimensions();
			setupObserver();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			if (observer) observer.disconnect();
		};
	});

</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>CASE 02 | SangSquare</title>
</svelte:head>

<section class="case-hero">
	<img 
		src="/images/case02/hero_bg.png" 
		alt="" 
		class="bg-image" 
		style="transform: translateY({translateY}px);"
	/>
	<div class="text-container">
		<h1>T’Station AI Commerce Launch</h1>
		<p class="sys-title-lg">대화는 자유롭게, 구매에 필요한 조건과 정보는 정확하게.<br/>AI는 고객의 질문으로 시작해 어디까지 구매를 이어갈 수 있을까?</p>
	</div>
</section>
<section bind:this={caseBodyEl} class="case-body flex flex-col xl:flex-row items-start justify-start mx-auto px-body-x pt-30 pb-15">
	<aside class="case-sidebar self-stretch flex-none">
		<div class="summary-wrapper">
			<ul class="case-summary list-none flex flex-col gap-4 w-full">
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Project</div>
					<div class="sys-caption text-primary flex-1">T’Bot AI Commerce Launch</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Duration</div>
					<div class="sys-caption text-primary flex-1">2026.01–07 · 7개월</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Role</div>
					<div class="sys-caption text-primary flex-1">UX Lead / Product Design</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Scope</div>
					<div class="sys-caption text-primary flex-1">AI Service Definition · Scenario Design · UX/UI · Launch QA</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Team</div>
					<div class="sys-caption text-primary flex-1 inline-flex flex-wrap gap-x-3">
						<span>PO <em class="text-accent-blue">1</em></span>
						<span>Service Planner <em class="text-accent-blue">1</em></span>
						<span>Product Designer <em class="text-accent-blue">1</em></span>
						<span>Publisher <em class="text-accent-blue">1</em></span>
						<span>AI Engineers <em class="text-accent-blue">3</em></span>
					</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Goal</div>
					<div class="sys-caption text-primary flex-1">기존 UI 중심 탐색의 한계를 넘어,<br/>상품 탐색부터 주문까지 하나의 대화로 연결하는<br/>AI 커머스 경험 구축</div>
				</li>
			</ul>
		</div>

		<div class="case-lnb">
			<p class="progress flex-none font-thin text-muted-foreground text-[40px]">{bodyScrollProgress}%</p>
			<nav class="indicator flex-1">
				{#each sections as section (section.id)}
					<button 
						type="button"
						class:active={activeSectionId === section.id}
						onclick={() => scrollToSection(section.id)}
					>
						<Separator class="bar" />
						<span class="sys-caption whitespace-nowrap">{section.label}</span>
					</button>
				{/each}
			</nav>
		</div>
	</aside>
	<div class="case-main self-stretch flex-1 min-w-0 flex flex-col gap-50">
		<section class="case-section" id="01">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">01. OVERVIEW</em>
				/ 복잡한 타이어 구매를 하나의 대화로
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					질문에서 구매까지.
				</h3>
				<h4 class="sys-text-sm">고객이 여러 화면을 이동하며 직접 판단하던 타이어 구매 과정을,<br/>구매 조건 확인과 상품 추천부터 매장·일정·주문서 작성까지 이어지는 <em class="font-semibold">하나의 대화형 경험으로 UX의 한계를 넘고자 하였습니다.</em></h4>
			</div>

			<div class="flex flex-col gap-10 mt-16">
				<div class="flex items-center justify-start gap-23">
					<div class="sys-text-md w-[520px]">
						<span class="self-start inline-flex items-center sys-caption font-bold rounded-full bg-foreground text-background h-8 px-3">01</span>
						<p class="mt-2 font-bold">FLEXIBLE START</p>
						<p>정해진 탐색 순서를 벗어나, 아는 것부터 시작하는 대화</p>
						<p class="description-paragraph sys-text-sm mt-7">등록 차량, 차량번호, 차종, 타이어 사이즈 중 고객이 가진 정보에서 시작하고 부족한 조건은 추가 질문으로 확인합니다.</p>
					</div>
					<div class="flex-none flex items-center justify-start gap-4">
						<div class="flex-none flex flex-col items-center gap-2">
							<span class="sys-caption">UI-BASED JOURNEY</span>
							<img src="/images/case02/01_1_before.png" alt="" class="w-[300px] rounded-2xl" />
						</div>
						<ArrowRight class="size-6 flex-none mt-4"/>
						<div class="flex-none flex flex-col items-center gap-2">
							<span class="sys-caption text-accent-foreground font-medium">AI CONVERSATION</span>
							<img src="/images/case02/01_1_after.png" alt="" class="w-[300px] rounded-2xl outline-1 outline-border -outline-offset-1" />
						</div>
					</div>
				</div>
				<div class="flex items-center justify-start gap-23">
					<div class="sys-text-md w-[520px]">
						<span class="self-start inline-flex items-center sys-caption font-bold rounded-full bg-foreground text-background h-8 px-3">02</span>
						<p class="mt-2 font-bold">GUIDED DECISION</p>
						<p>상품 탐색에서, 고객의 니즈를 만족하는 구매 상담으로</p>
						<p class="description-paragraph sys-text-sm mt-7">차량에 맞는 규격 뿐 아니라 승차감, 정숙성, 가격 등 구매 조건을 대화 속에서 구체화하고 적합한 상품을 비교·추천합니다.</p>
					</div>
					<div class="flex-none flex items-center justify-start gap-4">
						<div class="flex-none flex flex-col items-center gap-2">
							<span class="sys-caption">UI-BASED JOURNEY</span>
							<img src="/images/case02/01_2_before.png" alt="" class="w-[300px] rounded-2xl outline-1 outline-border -outline-offset-1" />
						</div>
						<ArrowRight class="size-6 flex-none mt-4"/>
						<div class="flex-none flex flex-col items-center gap-2">
							<span class="sys-caption text-accent-foreground font-medium">AI CONVERSATION</span>
							<img src="/images/case02/01_2_after.png" alt="" class="w-[300px] rounded-2xl outline-1 outline-border -outline-offset-1" />
						</div>
					</div>
				</div>
				<div class="flex items-center justify-start gap-23">
					<div class="sys-text-md w-[520px]">
						<span class="self-start inline-flex items-center sys-caption font-bold rounded-full bg-foreground text-background h-8 px-3">03</span>
						<p class="mt-2 font-bold">CONNECTED ACTION</p>
						<p>정보 안내에서, 결제 전 주문서 작성까지</p>
						<p class="description-paragraph sys-text-sm mt-7">확인된 타이어 사이즈를 기반으로 상품과 매장, 장착 일정을 연결해 주문 가능한 상태까지 이어갑니다.</p>
					</div>
					<div class="flex-none flex items-center justify-start gap-4">
						<div class="flex-none flex flex-col items-center gap-2">
							<span class="sys-caption text-accent-foreground font-medium">AI CONVERSATION</span>
							<img src="/images/case02/01_3_after.png" alt="" class="w-[360px] rounded-2xl outline-1 outline-border -outline-offset-1" />
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="case-section" id="02">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">02. CONTEXT & CHALLENGE</em>
				/ 기존 타이어 구매 여정의 한계
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					고객의 판단과 탐색에 의존한 타이어 구매 여정
				</h3>
				<h4 class="sys-text-sm">이전까지의 UX 개선으로 상품 탐색과 구매 단계는 단순해졌지만,<br/>고객은 차량 호환성·성능·가격·재고·장착점·혜택을 <em class="font-semibold">여러 화면에서 확인하고 직접 판단</em>해야 했습니다.</h4>
			</div>

			<div class="full-width mt-20">
				<img 
					src="/images/case02/02_infographic.png" 
					alt="" 
					class="block w-full h-auto" 
				/>
			</div>

			<div class="flex flex-col gap-10 mt-10">
				<p class="sys-text-lg">
					구매 여정에서 드러난 세 가지 문제
				</p>
				<ol class="ordered-list">
					<li class="sys-text-md">
						<p>구매 조건이 화면 사이에서 연결되지 않았다</p>
						<p class="description-paragraph sys-text-sm text-ts-n1 mt-2">차량 적합성, 상품 특성, 할인, 매장과 일정 정보를 고객이 각각의 화면에서 기억하고, 확인해야 했습니다.</p>
					</li>
					<li class="sys-text-md mt-10">
						<p>상품-장착-가격을 오가며 비교를 반복할 필요가 있었다</p>
						<p class="description-paragraph sys-text-sm text-ts-n1 mt-2">가격과 혜택을 확인한 뒤 다시 상품을 비교하고, 원하는 매장이나 장착 일정이 없으면 상품 탐색부터 같은 과정을 반복해야 했습니다.</p>
					</li>
					<li class="sys-text-md mt-10">
						<p>구매 기준뿐 아니라, 구매 경로도 고객이 스스로 찾아야 했다</p>
						<p class="description-paragraph sys-text-sm text-ts-n1 mt-2">필터와 정렬은 선택지를 좁혀주었지만, 어떤 상품이 자신에게 적합한지 판단하고<br/>구매를 이어가기 위해 무엇을 해야 하는지는 고객이 직접 파악해야 했습니다.</p>
					</li>
				</ol>
			</div>

			<p class="sys-text-lg font-light mt-30 leading-[1.8]">
				화면은 다음 단계를 열어주었지만, 고객을 다음 결정으로 이끌어주지는 못했습니다.<br/>
				<em class="font-semibold">‘고객이 구매 여정을 스스로 찾아가는 대신, 서비스가 상황에 맞는 다음 선택과 행동을 안내할 수는 없을까?’</em>
			</p>
		</section>
		<section class="case-section" id="03">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">03. STRATEGY</em>
				/ 구매 맥락과 다음 행동을 연결하는 대화 전략
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					T’Bot의 역할 정의와 대화 설계 원칙
				</h3>
				<h4 class="sys-text-sm">티봇이 고객의 현재 조건과 앞선 선택을 기억하고, 필요한 정보와 함께 다음에 해야 할 행동을 제안하도록 했습니다.<br/><em class="font-semibold">여러 화면에 흩어진 상품·가격·매장 정보를 하나의 대화 흐름으로 연결</em>해 주문 가능한 상태까지 이어지도록 설계합니다.</h4>
			</div>
			<div class="flex flex-col mt-20">
				<p class="sys-text-lg">03-1. AI의 역할 재정의</p>
				<img 
					src="/images/case02/03_1_infographic.png" 
					alt="" 
					class="flex-none block w-[1016px] aspect-1016/425 rounded-sm mt-4" 
				/>
			</div>
			<div class="flex flex-col mt-20">
				<p class="sys-text-lg">03-2. 응답 구성의 세 가지 기준</p>
				<div class="flex items-center gap-25 mt-15">
					<div class="flex-none iphone-frame">
						<div class="screen swiper" use:swiper={{
							grabCursor: true,
							direction: "vertical",
							slidesPerView: "auto",
							spaceBetween: 8,
							modules: [Pagination],
							pagination: {
								el: ".swiper-pagination.mockup1-pagination",
								clickable: true
							},
							on: {
								init: (swiper) => {
									mockupSwiper = swiper;
								},
								slideChange: (swiper) => {
									activeFocusing = swiper.activeIndex + 1;
								}
							}
						}}>
							<div class="swiper-wrapper">
								<div class="swiper-slide h-auto! mt-15! relative">
									<img src="/images/case02/03_2_screenshot_mo1.png" alt="" class="block w-full" />
									<button 
										onclick={() => mockupSwiper?.slideTo(0)} 
										class="absolute h-[17.85%] left-[2.857%] right-[2.857%] top-[12.05%] border-2 rounded-2xl transition-all duration-300 bg-transparent cursor-pointer focus:outline-hidden {activeFocusing === 1 ? 'border-accent-purple' : 'border-transparent'}"
										aria-label="Slide 1 highlight"
									></button>
								</div>
								<div class="swiper-slide h-auto! relative">
									<img src="/images/case02/03_2_screenshot_mo2.png" alt="" class="block w-full" />
									<button 
										onclick={() => mockupSwiper?.slideTo(1)} 
										class="absolute h-[35.39%] left-[2.857%] right-[2.857%] top-[43.8%] border-2 rounded-2xl transition-all duration-300 bg-transparent cursor-pointer focus:outline-hidden {activeFocusing === 2 ? 'border-accent-purple' : 'border-transparent'}"
										aria-label="Slide 2 highlight"
									></button>
								</div>
								<div class="swiper-slide h-auto! relative">
									<img src="/images/case02/03_2_screenshot_mo3.png" alt="" class="block w-full" />
									<button 
										onclick={() => mockupSwiper?.slideTo(2)} 
										class="absolute h-[14.16%] left-[2.857%] right-[2.857%] top-[73.97%] border-2 rounded-2xl transition-all duration-300 bg-transparent cursor-pointer focus:outline-hidden {activeFocusing === 3 ? 'border-accent-purple' : 'border-transparent'}"
										aria-label="Slide 3 highlight"
									></button>
								</div>
							</div>
						</div>
						<div class="swiper-pagination mockup1-pagination -right-5!"></div>
					</div>
					<div class="screenshot-focusing-detail">
						{#if activeFocusing === 1}
							<div class="detail-item">
								<img src="/images/case02/03_2_screenshot_focusing1.png" alt="" class="block w-[528px] drop-shadow-lg" />
								<div class="pl-8 mt-10">
									<p class="sys-text-md">❶ 고객이 이미 전달한 정보를 이어받는다</p>
									<p class="description-paragraph sys-text-sm mt-6">등록 차량, 차량번호, 차종, 타이어 사이즈 등 고객이 이미 전달한<br/>내용을 기억하고 그 전제로 추천·상담을 이어갑니다.</p>
								</div>
							</div>
						{:else if activeFocusing === 2}
							<div class="detail-item">
								<img src="/images/case02/03_2_screenshot_focusing2.png" alt="" class="block w-[528px] drop-shadow-lg" />
								<div class="pl-8 mt-10">
									<p class="sys-text-md">❷ 선택의 이유와 기준을 함께 설명한다</p>
									<p class="description-paragraph sys-text-sm mt-6">상품만 제시하지 않고, 차량 적합성과 정숙성·승차감·가격 등<br/>고객의 조건을 기준으로 추천과 비교의 이유를 설명합니다.</p>
								</div>
							</div>
						{:else if activeFocusing === 3}
							<div class="detail-item">
								<img src="/images/case02/03_2_screenshot_focusing3.png" alt="" class="block w-[528px] drop-shadow-lg" />
								<div class="pl-8 mt-10">
									<p class="sys-text-md">❸ 다음 행동을 구체적으로 안내한다</p>
									<p class="description-paragraph sys-text-sm mt-6">정보를 제공하고 끝내지 않고 상품 선택, 매장 확인, 일정 선택 등<br/>현재 상황에서 필요한 다음 행동을 질문과 UI로 제안합니다.</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<div class="full-width mt-20 py-6 bg-[#f9f9fa]">
				<p class="sys-text-lg font-light text-center">
					T’Bot과의 대화가 그럴듯한 도움이 아니라 진짜 상담이 되려면,<br/>
					<em class="font-semibold">이제 필요한 건 실제 정보의 ‘정확성’.</em>
				</p>
			</div>
		</section>
		<section class="case-section" id="04">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">04. SERVICE DEFINITION</em>
				/ T’Station 데이터 기반 AI 상담 구조
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					고객 의도를 T’Station 데이터와 연결하는 AI 상담 구조
				</h3>
				<h4 class="sys-text-sm">T’Bot은 고객의 의도와 조건을 해석하고, 상품·가격·재고·매장·일정 정보는 T’Station 시스템에서 조회합니다.<br/><em class="font-semibold">AI는 의도 판단과 설명을, 시스템은 데이터 조회와 확인</em>을 담당하도록 역할을 구분하였습니다.</h4>
			</div>

			<div class="flex mt-20">
				<div class="flex flex-col gap-4">
					<p class="sys-text-lg">04-1. 하나의 상담 창구, 세 가지 서비스 영역 (Domain)</p>
					<p class="sys-text-md">고객은 하나의 T’Bot과 대화하고, T’Bot은 질문의 목적에 따라 필요한 업무를 찾습니다.</p>
				</div>
			</div>
			<p class="description-paragraph sys-text-sm mt-8">고객의 요청을 탐색·비교, 구매 실행, 문의·예외 대응의 <em class="font-semibold">세 개 Domain으로 분류하고, 현재 대화에 필요한 기능을 선택</em>합니다.<br/>복합 요청은 여러 Domain의 기능을 순차적으로 실행합니다.</p>
			<img src="/images/case02/04_1_infographic.png" alt="" class="flex-none block w-[1145px] aspect-1145/310 mt-20" />

			<div class="flex mt-27">
				<div class="flex flex-col gap-4">
					<p class="sys-text-lg">04-2. 전문 기능 호출과 데이터 기반 응답 생성</p>
					<p class="sys-text-md">질문에 필요한 기능만 연결해, 실제 데이터로 답합니다</p>
				</div>
			</div>
			<p class="description-paragraph sys-text-sm mt-8">T’Bot은 대화에 누적된 차량과 선호 조건을 기준으로 <em class="font-semibold">질문의 목적을 판단하고, 필요한 전문 기능을 선택합니다.</em><br/>각 기능이 조회한 정보를 응답 내용과 대조한 뒤, 하나의 답변과 다음 행동으로 구성합니다.</p>
			<div class="full-width mt-16">
				<img src="/images/case02/04_2_infographic.png" alt="" class="flex-none block w-full aspect-1920/696" />
			</div>
			<p class="sys-text-md mt-10">ONE CONVERSATION, MULTIPLE SERVICES.</p>
			<p class="description-paragraph sys-text-sm mt-8">고객 요청을 분류해 필요한 전문 기능을 호출하고, 실제 데이터를 조회·검증한 뒤 응답을 생성합니다.</p>
		</section>
		<section class="case-section" id="05">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">05. EXPERIENCE DESIGN</em>
				/ 자연어 대화와 선택 UI를 결합한 구매 경험
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					대화와 선택 UI를 결합한 타이어 구매 플로우
				</h3>
				<h4 class="sys-text-sm">고객은 자연어로 차량과 필요한 조건을 설명하고, T’Bot은 확인된 상품·가격·매장·일정을 카드와 선택 UI로 제시합니다.<br/><em class="font-semibold">자유로운 탐색이 필요한 순간에는 대화로, 정확한 선택과 확인이 필요한 순간에는 구조화된 UI로</em> 연결해 주문 가능한 상태를 완성합니다.</h4>
			</div>
			<div class="flex gap-12 mt-30">
				<div class="relative w-[372px] aspect-372/673 bg-foreground outline-1 outline-border rounded-2xl overflow-hidden isolate">
					<video
						bind:this={aiVideoEl}
						src="/images/case02/05_1_AI_video.mp4"
						muted
						playsinline
						ontimeupdate={handleAiTimeUpdate}
						onplay={() => (isAiVideoPlaying = true)}
						onpause={() => (isAiVideoPlaying = false)}
						onended={() => (isAiVideoPlaying = false)}
						class="w-full h-full object-cover object-center block"
					>
						<track kind="captions" />
					</video>
				</div>
				<div class="flex-1">
					<div class="flex">
						<div class="flex flex-col gap-4">
							<p class="sys-text-lg">05-1. 단계별 구매 조건 확인 및 누적</p>
							<p class="sys-text-md">대화에서 확인한 조건과 선택값을 유지해 주문서 작성에 활용합니다.</p>
						</div>
					</div>
					<p class="description-paragraph sys-text-sm mt-8">T’Bot은 차량과 타이어 규격을 확인하고, 고객의 선호에 맞는 상품 추천과 비교를 거쳐<br/>상품·수량·매장·일정을 순서대로 연결합니다. 앞선 대화에서 선택한 조건은 다음 단계로 이어지며,<br/>마지막에는 주문에 필요한 정보가 하나의 주문서로 정리됩니다.</p>

					<div class="mt-24 flex gap-9">
						<div class="w-[180px] flex-none flex flex-col gap-4">
							<span class="self-start inline-flex sys-caption font-semibold rounded-full bg-accent py-1 px-11 text-nowrap">영상 단계</span>

							<div class="timestamp-wrap flex flex-col">
								{#each aiSteps as step, idx (step.id)}
									<Button
										variant="ghost"
										size="sm"
										class="flex justify-start gap-2 hover:bg-transparent! sys-caption px-0 group transition-all text-left"
										onclick={() => handleAiStepClick(idx)}
									>
										{#if currentAiStep === idx}
											<Separator class="flex-none bg-accent-foreground w-6! mr-2" />
											<span class="sys-caption font-semibold text-accent-foreground">{step.timestamp}</span>
											<span class="sys-caption font-semibold text-accent-foreground">{step.label}</span>
											{#if isAiVideoPlaying}
												<CirclePause class="size-6 text-accent-foreground" />
											{:else}
												<CirclePlay class="size-6 text-accent-foreground" />
											{/if}
										{:else}
											<Separator class="flex-none bg-primary w-6! mr-2 group-hover:bg-accent-foreground transition-colors" />
											<span class="sys-caption group-hover:text-accent-foreground transition-colors">{step.timestamp}</span>
											<span class="sys-caption group-hover:text-accent-foreground transition-colors">{step.label}</span>
										{/if}
									</Button>
								{/each}
							</div>
						</div>
						<div class="flex flex-col gap-4">
							<span class="self-start inline-flex sys-caption font-semibold rounded-full bg-accent py-1 px-11 text-nowrap">누적정보</span>

							<div class="timestamp-wrap flex flex-col">
								{#each aiSteps as step, idx (step.id)}
									<span
										class="ml-2 sys-caption leading-8 transition-opacity duration-300 {currentAiStep >= idx ? 'opacity-100' : 'opacity-0'} {currentAiStep === idx ? 'font-semibold text-accent-foreground' : ''}"
									>
										{step.accumulatedInfo}
									</span>
								{/each}
							</div>
						</div>
					</div>
					<p class="sys-caption-sm text-ts-n3 mt-4">*영상 단계를 선택해 각 단계로 이동할 수 있습니다</p>
				</div>
			</div>
			<div class="mt-30">
				<p class="sys-text-lg">
					05-2. 자연어 대화와 선택 UI의 역할 구분
				</p>
				<ol class="ordered-list flex gap-40 mt-10">
					<li class="sys-text-md max-w-[376px]">
						<p>요청하기</p>
						<p class="description-paragraph sys-text-sm mt-2">자연어로 상황과 필요한 조건을 전달합니다.</p>

						<div
							class="swiper question-swiper w-full h-[74px] mt-30 select-none overflow-visible!"
							use:swiper={{
								direction: "vertical",
								loop: true,
								speed: 600,
								allowTouchMove: false,
								effect: "creative",
								creativeEffect: {
									prev: {
										translate: [0, "-120%", 0],
										opacity: 0
									},
									next: {
										translate: [0, "120%", 0],
										opacity: 0
									}
								},
								autoplay: {
									delay: 3500,
									disableOnInteraction: false
								},
								modules: [Autoplay, EffectCreative, Controller],
								on: {
									init: (s) => {
										questionSwiper = s;
										if (answerSwiper) {
											s.controller.control = answerSwiper;
										}
									}
								}
							}}
						>
							<div class="swiper-wrapper">
								<div class="swiper-slide flex items-center justify-center">
									<img src="/images/case02/05_2_question1.png" alt="" class="block w-[264px] aspect-264/74" />
								</div>
								<div class="swiper-slide flex items-center justify-center">
									<img src="/images/case02/05_2_question2.png" alt="" class="block w-[220px] aspect-220/74" />
								</div>
								<div class="swiper-slide flex items-center justify-center">
									<img src="/images/case02/05_2_question3.png" alt="" class="block w-[217px] aspect-217/74" />
								</div>
								<div class="swiper-slide flex items-center justify-center">
									<img src="/images/case02/05_2_question4.png" alt="" class="block w-[237px] aspect-237/74" />
								</div>
								<div class="swiper-slide flex items-center justify-center">
									<img src="/images/case02/05_2_question5.png" alt="" class="block w-[225px] aspect-225/74" />
								</div>
							</div>
						</div>
					</li>
					<li class="sys-text-md flex-none w-fit">
						<p>선택하기</p>
						<p class="description-paragraph sys-text-sm mt-2">상품과 거래 조건은 구조화된 UI에서 선택합니다.</p>

						<div
							class="swiper answer-swiper w-[512px] mt-10 select-none overflow-visible!"
							use:swiper={{
								loop: true,
								effect: "fade",
								fadeEffect: {
									crossFade: true
								},
								speed: 600,
								allowTouchMove: false,
								modules: [EffectFade, Controller],
								on: {
									init: (s) => {
										answerSwiper = s;
										if (questionSwiper) {
											questionSwiper.controller.control = s;
										}
									}
								}
							}}
						>
							<div class="swiper-wrapper">
								<div class="swiper-slide">
									<img src="/images/case02/05_2_answer1.png" alt="" class="block w-full aspect-512/324" />
								</div>
								<div class="swiper-slide">
									<img src="/images/case02/05_2_answer2.png" alt="" class="block w-full aspect-512/557" />
								</div>
								<div class="swiper-slide">
									<img src="/images/case02/05_2_answer3.png" alt="" class="block w-full aspect-512/366" />
								</div>
								<div class="swiper-slide">
									<img src="/images/case02/05_2_answer4.png" alt="" class="block w-full aspect-512/411" />
								</div>
								<div class="swiper-slide">
									<img src="/images/case02/05_2_answer5.png" alt="" class="block w-full aspect-512/537" />
								</div>
							</div>
						</div>
					</li>
				</ol>
			</div>
		</section>
		<section class="case-section -mt-20" id="06">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">06. VALIDATION</em>
				/ 운영 시나리오 기반 서비스 완성도 검증
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					정확성, 맥락 유지, 다음 행동을 기준으로 한 서비스 검증
				</h3>
				<h4 class="sys-text-sm">개발·QA 단계의 기능 검증 이후, <em class="font-semibold">질문과 조건이 달라지는 100개 운영 시나리오를 웹·모바일·앱 7개 환경에서 반복 테스트</em>했습니다.<br/>정확성, 맥락 유지, 다음 행동 연결을 공통 기준으로 적용했습니다.</h4>
			</div>
			<div class="mt-20">
				<p class="sys-text-lg">
					06-1. 100개 시나리오, 7개 환경, 700번의 테스트
				</p>
				<img src="/images/case02/06_1_infographic.png" alt="" class="w-[1070px] aspect-1070/377 mt-10" />
			</div>
			<div class="mt-30">
				<div class="flex flex-col gap-4">
					<p class="sys-text-lg">06-2. 조건 변경·주제 전환 시 맥락 유지 테스트</p>
					<p class="sys-text-md">조건 추가·변경, 주제 전환, 이전 단계 복귀 상황에서 앞선 조건과 선택값이 유지되고 구매 단계가 이어지는지 검증</p>
				</div>

				<ol class="ordered-list flex gap-20 mt-10">
					<li class="sys-text-md w-[360px]">
						<p>조건을 추가한다</p>
						<p class="description-paragraph sys-text-sm mt-2"><em class="font-semibold">확인 기준 :</em> 차량·추천 상품·가격대 유지</p>
						<img src="/images/case02/06_2_screenshot1.png" alt="" class="w-full aspect-360/330 rounded-lg outline-1 outline-border -outline-offset-1 drop-shadow-lg mt-10" />
					</li>
					<li class="sys-text-md w-[360px]">
						<p>다른 질문을 끼워 넣는다</p>
						<p class="description-paragraph sys-text-sm mt-2"><em class="font-semibold">확인 기준 :</em> 예약 단계·선택 매장 유지</p>
						<img src="/images/case02/06_2_screenshot2.png" alt="" class="w-full aspect-360/330 rounded-lg outline-1 outline-border -outline-offset-1 drop-shadow-lg mt-10" />
					</li>
					<li class="sys-text-md w-[360px]">
						<p>선택을 바꾼다</p>
						<p class="description-paragraph sys-text-sm mt-2"><em class="font-semibold">확인 기준 :</em> 선택 상품 유지·수량 갱신</p>
						<img src="/images/case02/06_2_screenshot3.png" alt="" class="w-full aspect-360/330 rounded-lg outline-1 outline-border -outline-offset-1 drop-shadow-lg mt-10" />
					</li>
				</ol>
			</div>
		</section>
		<section class="case-section" id="07">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">07. OUTCOME</em>
				/ 정식 오픈 이후 초기 운영 데이터
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					T’Bot 이용 패턴 및 구매 전환 성과
				</h3>
				<h4 class="sys-text-sm">정식 오픈 후 6주간 중복 제거 기준 3,242명이 T’Bot을 이용했으며, 84.5%가 두 차례 이상 질문했습니다.<br/><em class="font-semibold">전체 Agent Flow 실행의 68.5%는 상품·매장·혜택 등 구매 관련</em> 영역이었고, 같은 기간 <em class="font-semibold">전체 주문의 13.1%가 T’Bot을 통해 구매</em>로 이어졌습니다.</h4>
			</div>
			<div class="mt-20">
				<p class="sys-text-lg">
					07-1. 고객별 질문 횟수 분포
				</p>
				<img src="/images/case02/07_1_infographic1.png" alt="" class="w-[398px] aspect-398/102 mt-7" />
				<img src="/images/case02/07_1_infographic2.png" alt="" class="w-[1251px] aspect-1251/101 mt-6" />
			</div>
			<div class="mt-30">
				<p class="sys-text-lg">
					07-2. 문의 유형별 비중 및 구매 전환 지표
				</p>
				<div class="flex items-start gap-14 mt-20">
					<img src="/images/case02/07_2_infographic1.png" alt="" class="w-[593px] aspect-593/450" />
					<img src="/images/case02/07_2_infographic2.png" alt="" class="w-[616px] aspect-616/262" />
				</div>
			</div>
		</section>
		<section class="case-section" id="08">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">08. REFLECTION</em>
				/ 운영 결과와 후속 개선 방향
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					T’Bot 운영 품질 및 후속 개선 과제
				</h3>
				<h4 class="sys-text-sm">초기 운영 데이터를 기준으로 <em class="font-semibold">응답 속도, 재고 안내 정합성, 구매 단계 추적을 후속 개선</em> 과제로 정의했습니다.</h4>
			</div>

			<div class="full-width flex items-center justify-center gap-6 mt-10 px-body-x py-8 relative">
				<img src="/images/case02/08_infographic1.png" alt="" class="w-full min-w-0 max-w-[552px] aspect-552/342" />
				<img src="/images/case02/08_infographic2.png" alt="" class="w-full min-w-0 max-w-[552px] aspect-552/342" />
				<img src="/images/case02/08_infographic3.png" alt="" class="w-full min-w-0 max-w-[552px] aspect-552/342" />
			</div>


			<div class="full-width flex flex-col items-center justify-center mt-30 text-background text-center h-93 relative">
				<img src="/images/case02/closing_bg.png" alt="" class="absolute inset-0 w-full h-full object-cover" />
				<p class="sys-title-md relative">FROM QUESTION TO PURCHASE</p>
				<p class="sys-text-md relative mt-6">구매 과정의 피로를 줄이고, 결제 전까지 구매 확신이 이어지는 흐름을 만들 수 있도록.<br/><br/>고객의 여정 탐색을 돕고 다음 선택의 근거를 제공하는 일을 T’Bot의 역할로 정의했습니다.<br/>고객이 아는 정보에서 시작해 상품·가격·일정을 확인하고, 주문 가능한 상태까지 이어지도록 대화와 선택 UI를 설계했습니다.</p>
			</div>
		</section>
	</div>
</section>

<style>
	.iphone-frame :global(.swiper-pagination-vertical) {
		right: 12px !important;
	}

	.iphone-frame :global(.swiper-slide),
	.ipad-frame :global(.swiper-slide) {
		width: 100% !important;
		height: 100% !important;
	}

	.iphone-frame :global(.swiper-slide img),
	.ipad-frame :global(.swiper-slide img) {
		width: 100% !important;
		height: 100% !important;
		object-fit: cover;
		display: block;
	}

	.screenshot-focusing-detail .detail-item {
		animation: detail-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.timestamp-wrap {
		display: flex;
		flex-direction: column;
	}

	/* :global(.question-swiper) {
		width: 100%;
		height: 74px;
		overflow: visible !important;
	}

	:global(.question-swiper .swiper-slide) {
		width: 100% !important;
		height: 74px !important;
		overflow: visible !important;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.answer-swiper) {
		width: 100%;
		overflow: visible !important;
	}

	:global(.answer-swiper .swiper-slide) {
		width: 100% !important;
	}

	:global(.answer-swiper .swiper-slide img) {
		width: 100%;
		display: block;
		opacity: 0 !important;
	} */

	@keyframes detail-fade-in {
		from {
			opacity: 0;
			transform: translateY(32px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

</style>
