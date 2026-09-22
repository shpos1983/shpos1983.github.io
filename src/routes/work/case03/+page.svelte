<script lang="ts">
	import { onMount } from "svelte";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import Swiper from "swiper";
	import type { SwiperOptions } from "swiper/types";
	import { Autoplay, EffectFade, Pagination } from "swiper/modules";
	import "swiper/css";
	import "swiper/css/autoplay";
	import "swiper/css/effect-fade";
	import "swiper/css/pagination";
	import { Button } from "$lib/components/ui/button/index.js";
	import { CirclePause, CirclePlay, ArrowRight } from '@lucide/svelte';

	const DEFAULT_HEADER_HEIGHT = 144;
	const DEFAULT_HERO_HEIGHT = 588;

	let scrollY = $state(0);
	let caseBodyEl = $state<HTMLElement | null>(null);
	let activeSectionId = $state("01");
	let isScrollingTo = false;
	let activeFocusing = $state(1);
	let headerHeight = $state(DEFAULT_HEADER_HEIGHT);
	let heroHeight = $state(DEFAULT_HERO_HEIGHT);
	let playCardIndex = $state<number | null>(null);

	function togglePlayCard(index: number) {
		playCardIndex = playCardIndex === index ? null : index;
	}

	let maxScroll = $derived(heroHeight - headerHeight);

	const sections = [
		{ id: "01", label: "01. OVERVIEW" },
		{ id: "02", label: "02. CONTEXT & CHALLENGE" },
		{ id: "03", label: "03. REFRAME & DESIGN STRATEGY" },
		{ id: "04", label: "04. EXPERIENCE DESIGN" },
		{ id: "05", label: "05. EVOLUTION & AI" },
		{ id: "06", label: "06. LEARNING" }
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
			allowTouchMove: true,
			grabCursor: true,
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
	<title>CASE 03 | SangSquare</title>
</svelte:head>

<section class="case-hero">
	<img 
		src="/images/case03/hero_bg.png" 
		alt="" 
		class="bg-image" 
		style="transform: translateY({translateY}px);"
	/>
	<div class="text-container">
		<h1>T’Station 매장 상담 플랫폼 Renewal</h1>
		<p class="sys-title-lg">매장 서비스는 같아야 하지만, 고객의 방문 상황은 모두 다르다.<br/>그렇다면 어디까지 표준화하고 어디까지 정비사의 판단에 맡겨야 할까?</p>
	</div>
</section>
<section bind:this={caseBodyEl} class="case-body flex flex-col xl:flex-row items-start justify-start mx-auto px-body-x pt-30 pb-15">
	<aside class="case-sidebar self-stretch flex-none">
		<div class="summary-wrapper">
			<ul class="case-summary list-none flex flex-col gap-4 w-full">
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Project</div>
					<div class="sys-caption text-primary flex-1">Smart Guide Platform Renewal</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Duration</div>
					<div class="sys-caption text-primary flex-1">2025.10–2026.05 · 8개월</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Role</div>
					<div class="sys-caption text-primary flex-1">UX Lead / Design</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Team</div>
					<div class="sys-caption text-primary flex-1 inline-flex flex-wrap gap-x-3">
						<span>PO <em class="text-accent-blue">1</em></span>
						<span>Service Planner <em class="text-accent-blue">1</em></span>
						<span>Designer <em class="text-accent-blue">1</em></span>
						<span>Publisher <em class="text-accent-blue">1</em></span>
						<span>Developer <em class="text-accent-blue">3</em></span>
					</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Goal</div>
					<div class="sys-caption text-primary flex-1">입차부터 사후관리까지,<br/>전 매장에 표준 상담 플로우를 정착</div>
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
				/ 320개 매장의 상담 경험을 하나로
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					ONE STANDARD SERVICE, EVERY STORE
				</h3>
				<h4 class="sys-text-sm"><em class="font-semibold">SMART GUIDE</em>는 티스테이션 매장 직원이 차량 점검 결과와 상품 정보를 고객에게 설명하고,<br/><em class="font-semibold">상품 선택과 구매를 돕는 디지털 상담 플랫폼입니다.</em><br/><br/>이번 리뉴얼을 통해 각 매장이 일관된 서비스를 제공할 수 있도록,<br/>공통의 상담 기준과 이를 현장에서 활용할 수 있는 플랫폼을 안착시키는 것을 목표로 했습니다.</h4>
			</div>

			<div class="full-width flex gap-6 mt-40">
				<img 
					src="/images/case03/01_slide01.png" 
					alt="" 
					class="flex-1 min-w-0 w-full h-auto object-cover" 
				/>
				<img 
					src="/images/case03/01_slide02.png" 
					alt="" 
					class="flex-1 min-w-0 w-full h-auto object-cover" 
				/>
				<img 
					src="/images/case03/01_slide03.png" 
					alt="" 
					class="flex-1 min-w-0 w-full h-auto object-cover" 
				/>
			</div>
		</section>
		<section class="case-section" id="02">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">02. CONTEXT & CHALLENGE</em>
				/ 표준 상담과 현장 업무의 간극
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					현장 업무와 분리된 디지털 상담
				</h3>
				<h4 class="sys-text-sm">2019년, 매장 상담의 디지털 표준화를 위해 SMART GUIDE를 도입했습니다.<br/>그러나 태블릿 중심의 환경, 부족한 상담 콘텐츠, 분리된 결제로 현장 활용이 제한되면서 실시간 상담보다 또 하나의 업무에 가까워졌습니다.</h4>
			</div>

			<div class="mt-20 case-mockup1">
				<div class="swiper screen-swiper" use:swiper={{
					modules: [Autoplay, EffectFade],
					effect: "fade",
					grabCursor: true,
					fadeEffect: {
						crossFade: true
					},
					loop: true,
					speed: 1000,
					autoplay: {
						delay: 2500,
						disableOnInteraction: false
					}
				}}>
					<div class="swiper-wrapper">
						<div class="swiper-slide">
							<img src="/images/case03/02_mockup_screen1.png" alt="스마트가이드 화면 1" />
						</div>
						<div class="swiper-slide">
							<img src="/images/case03/02_mockup_screen2.png" alt="스마트가이드 화면 2" />
						</div>
						<div class="swiper-slide">
							<img src="/images/case03/02_mockup_screen3.png" alt="스마트가이드 화면 3" />
						</div>
						<div class="swiper-slide">
							<img src="/images/case03/02_mockup_screen4.png" alt="스마트가이드 화면 4" />
						</div>
					</div>
				</div>
			</div>

			<div class="full-width mt-20">
				<img 
					src="/images/case03/02_infographic.png" 
					alt="" 
					class="block w-full h-auto" 
				/>
			</div>

			<div class="flex flex-col gap-10 mt-30">
				<p class="sys-text-lg">
					현장과 시스템 사이 발견된, 세 가지 간극
				</p>
				<ol class="ordered-list">
					<li class="sys-text-md">
						<p>시스템이 현장을 따라가지 못했다</p>
						<p class="description-paragraph sys-text-sm mt-2">고정 해상도를 전제로 구축되어, 매장에서 사용하는 디바이스가 다양해질수록 화면과 사용성이 무너졌습니다.</p>
					</li>
					<li class="sys-text-md mt-10">
						<p>상담이 여러 도구와 시스템으로 끊겼다</p>
						<p class="description-paragraph sys-text-sm mt-2">Smart Guide만으로 상품을 충분히 설명하거나 결제를 진행할 수 없어, 상담 중 티스테이션닷컴과 POS를 반복해서 오가야 했습니다.</p>
					</li>
					<li class="sys-text-md mt-10">
						<p>사용률과 실제 사용이 달랐다</p>
						<p class="description-paragraph sys-text-sm mt-2">현장 업무와 맞지 않는 사용성에도 사용률이 평가 지표로 관리되면서, 일부 매장에서는 낮에 처리한 업무를 영업 종료 후 일괄 입력하는 우회 행동이 발생했습니다.</p>
					</li>
				</ol>
			</div>
			
		</section>
		<section class="case-section" id="03">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">03. REFRAME & DESIGN STRATEGY</em>
				/ 표준화의 재정의
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					사용률을 높이는 것이 아니라, 실제 업무 안에서 사용되게 할 것.
				</h3>
				<h4 class="sys-text-sm">정비사의 판단과 현장 상황을 고려해, 담당자와 기기가 바뀌어도 동일한 정보와 기준으로<br/>상담부터 결제까지 이어지도록 세 가지 설계 원칙을 정했습니다.</h4>
			</div>
			<div class="flex flex-col gap-3 mt-10 py-5 px-6 bg-attention rounded-sm">
				<p class="sys-text-lg">새롭게 정의한 표준화. Standardization ≠ Same Screen</p>
				<p class="description-paragraph sys-text-sm">표준화는 모든 직원이 같은 화면을 보는 것이 아니라, 같은 고객 정보와 업무 맥락, 상담 근거가 끊기지 않고 이어지는 것</p>
			</div>
			<div class="flex flex-col gap-7 mt-18">
				<h3 class="sys-title-sm leading-tight tracking-[-0.02em]">
					세 가지 단절을, 3개의 연결 원칙으로
				</h3>
				<div class="flex items-stretch justify-between gap-3 w-full">
					<div class="flex-1 min-w-0 flow-anim-card" data-animation-state={playCardIndex === 0 ? "play" : "pause"}>
						<img src="/images/case03/03_anim_slide1.png" alt="" />
						<div class="flex flex-col text-container">
							<p class="sys-text-md">1. Continue Anywhere</p>
							<p class="sys-text-sm">현장 어디서나 시작하고 다른 기기에서 이어서 처리한다.</p>
						</div>
						<Button onclick={() => togglePlayCard(0)} size="icon-lg" variant="ghost" class="absolute right-3 bottom-3 p-0 rounded-full! hover:text-primary-foreground cursor-pointer">
							{#if playCardIndex === 0}
								<CirclePause class="size-8" />
							{:else}
								<CirclePlay class="size-8" />
							{/if}
						</Button>
					</div>
					<div class="flex-1 min-w-0 flow-anim-card" data-animation-state={playCardIndex === 1 ? "play" : "pause"}>
						<img src="/images/case03/03_anim_slide2.png" alt="" />
						<div class="flex flex-col text-container">
							<p class="sys-text-md">2. Complete in One Flow</p>
							<p class="sys-text-sm">상담을 마친 뒤 다른 시스템에서 다시 시작하지 않는다.</p>
						</div>
						<Button onclick={() => togglePlayCard(1)} size="icon-lg" variant="ghost" class="absolute right-3 bottom-3 p-0 rounded-full! hover:text-primary-foreground cursor-pointer">
							{#if playCardIndex === 1}
								<CirclePause class="size-8" />
							{:else}
								<CirclePlay class="size-8" />
							{/if}
						</Button>
					</div>
					<div class="flex-1 min-w-0 flow-anim-card" data-animation-state={playCardIndex === 2 ? "play" : "pause"}>
						<img src="/images/case03/03_anim_slide3.png" alt="" />
						<div class="flex flex-col text-container">
							<p class="sys-text-md">3. Explain with Evidence</p>
							<p class="sys-text-sm">직원의 기억과 말에만 의존하지 않고 고객과 같은 근거를 본다.</p>
						</div>
						<Button onclick={() => togglePlayCard(2)} size="icon-lg" variant="ghost" class="absolute right-3 bottom-3 p-0 rounded-full! hover:text-primary-foreground cursor-pointer">
							{#if playCardIndex === 2}
								<CirclePause class="size-8" />
							{:else}
								<CirclePlay class="size-8" />
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</section>
		<section class="case-section" id="04">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">04. EXPERIENCE DESIGN</em>
				/ 현장 업무의 연결
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					입차부터 결제까지의 통합 상담 경험 구축
				</h3>
				<h4 class="sys-text-sm">모바일 입차 정보를 기기와 담당자에 관계없이 상담·작업·결제로 연동하고, 점검 결과와 상품 정보를 직원과 고객이 함께 확인하도록 설계했습니다.</h4>
			</div>
			
			<div class="flex flex-col gap-4 mt-8">
				<img src="/images/case03/04_blueprint.png" alt="" class="block w-full" />

				<p class="sys-caption-sm">* AI 마모도는 Smart Guide 리뉴얼 이후 상담 근거를 확장한 Phase 2 기능입니다. (본문 05 EVOLUTION & AI)</p>
			</div>

			<div class="full-width mt-20 bg-background">
				<div class="w-full px-body-x">
					<Separator class="my-0" />
					<div class="w-full pl-50">
						<div class="flex flex-col gap-4 mt-8">
							<p class="sys-text-lg">04-1. Continue Anywhere</p>
							<p class="sys-text-md">현장에서 등록한 입차 정보를 대기실 상담원이 바로 이어받는 흐름</p>
						</div>

						<div class="flex items-center gap-15 mt-18 pl-10">
							<div class="flex-none iphone-frame">
								<div class="screen swiper" use:swiper>
									<div class="swiper-wrapper">
										<div class="swiper-slide">
											<img src="/images/case03/04_1_screenshot_mo1.png" alt="" class="block w-full" />
										</div>
										<div class="swiper-slide">
											<img src="/images/case03/04_1_screenshot_mo2.png" alt="" class="block w-full" />
										</div>
										<div class="swiper-slide">
											<img src="/images/case03/04_1_screenshot_mo3.png" alt="" class="block w-full" />
										</div>
										<div class="swiper-slide">
											<img src="/images/case03/04_1_screenshot_mo4.png" alt="" class="block w-full" />
										</div>
									</div>
								</div>
								<img src="/images/case03/04_1_flow_dash.png" alt="" class="block absolute left-[72px] top-full max-w-none w-[302px]" />
							</div>

							<div class="flex flex-col gap-10">
								<span class="self-start inline-flex sys-text-sm rounded-full bg-foreground text-background py-2 px-4 -mb-6">정비사</span>
								<p class="sys-text-lg">
									고객을 처음 맞이한 정비사가 현장에서 시작하는 입차·점검
								</p>
								<ol class="ordered-list">
									<li class="sys-text-md">
										<p>현장에 맞는 방식으로 빠르게 입차</p>
										<p class="description-paragraph sys-text-sm mt-2"><em class="font-semibold">번호판 촬영·음성·직접입력을 지원해 장갑을 낀 상태에서도 차량을 빠르게 조회</em>하고 입차 등록을 시작합니다.</p>
									</li>
									<li class="sys-text-md mt-10">
										<p>차량번호 하나로 고객과 차량 정보를 연결</p>
										<p class="description-paragraph sys-text-sm mt-2"><em class="font-semibold">차량번호를 기준</em>으로 재방문 여부와 고객·차량 이력, 차량에 맞는 타이어 규격을 불러옵니다.</p>
									</li>
									<li class="sys-text-md mt-10">
										<p>점검 결과를 하나의 상담 건에 저장</p>
										<p class="description-paragraph sys-text-sm mt-2">타이어 마모도와 엔진오일, 배터리 등 기본 점검 결과를 기록해 <em class="font-semibold">다음 담당자가 동일한 정보로 상담을 이어갈 수 있게</em> 합니다.</p>
									</li>
								</ol>
							</div>
						</div>

						<div class="flex items-start gap-15">
							<div class="flex flex-col gap-10 pt-70">
								<span class="self-start inline-flex sys-text-sm rounded-full bg-foreground text-background py-2 px-4 -mb-6">상담 직원</span>
								<p class="sys-text-lg">
									고객보다 먼저 상담 화면에 도착하는 입차·점검 정보
								</p>
								<ol class="ordered-list">
									<li class="sys-text-md">
										<p>고객과 점검 결과를 한 화면에서 확인</p>
										<p class="description-paragraph sys-text-sm mt-2">상담 직원은 고객정보를 다시 묻지 않고, 모바일에서 등록한 차량정보와 점검 결과를 확인하며 상담을 시작합니다.</p>
									</li>
									<li class="sys-text-md mt-10">
										<p>점검 결과에서 적합한 상품과 설명 근거로 연결</p>
										<p class="description-paragraph sys-text-sm mt-2">차량에 맞는 타이어를 불러오고, 상품 특장점과 리뷰·영상·가격·혜택을 함께 보여주며 비교와 추천을 진행합니다.</p>
									</li>
									<li class="sys-text-md mt-10">
										<p>고객의 선택을 작업목록으로 연결</p>
										<p class="description-paragraph sys-text-sm mt-2">선택한 상품과 수량, 적용 혜택을 작업목록에 담아 상담 결과가 작업과 결제의 다음 단계로 이어지게 합니다.</p>
									</li>
								</ol>
							</div>
							
							<div class="flex-none ipad-frame">
								<div class="screen swiper" use:swiper>
									<div class="swiper-wrapper">
										<div class="swiper-slide">
											<img src="/images/case03/04_1_screenshot_tab1.png" alt="" class="block w-full" />
										</div>
										<div class="swiper-slide">
											<img src="/images/case03/04_1_screenshot_tab2.png" alt="" class="block w-full" />
										</div>
										<div class="swiper-slide">
											<img src="/images/case03/04_1_screenshot_tab3.png" alt="" class="block w-full" />
										</div>
										<div class="swiper-slide">
											<img src="/images/case03/04_1_screenshot_tab4.png" alt="" class="block w-full" />
										</div>
										<div class="swiper-slide">
											<img src="/images/case03/04_1_screenshot_tab5.png" alt="" class="block w-full" />
										</div>
									</div>
								</div>
								<img src="/images/case03/04_2_flow_dash.png" alt="" class="block absolute right-[224px] top-full max-w-none w-[252px]" />
							</div>
						</div>
					</div>
				</div>

				<div class="w-full px-body-x mt-50">
					<Separator class="my-0" />
					<div class="w-full pl-50">
						<div class="flex flex-col gap-4 mt-8">
							<p class="sys-text-lg">04-2. Complete in One Flow</p>
							<p class="sys-text-md">작업목록에 담긴 고객의 선택이 재입력 없이 작업과 결제까지 이어지는 흐름</p>
						</div>

						<div class="flex items-center gap-15 mt-15">
							<div class="flex flex-col gap-10 w-112">
								<span class="self-start inline-flex sys-text-sm rounded-full bg-foreground text-background py-2 px-4 -mb-6">정비사 · 상담 직원</span>
								<p class="sys-text-lg">
									작업목록부터 완료 내역과 결제까지<br/>연결되는 고객 기록
								</p>
								<ol class="ordered-list">
									<li class="sys-text-md">
										<p>상담에서 확정한 내역을 작업목록으로 연결</p>
										<p class="description-paragraph sys-text-sm mt-2">선택한 상품과 혜택, 고객 요청사항을 하나의 작업 건으로 정리합니다. 정비사는 모바일에서 필요한 내역을 확인하고 작업을 이어갑니다.</p>
									</li>
									<li class="sys-text-md mt-10">
										<p>작업 결과를 기록하고 담당자 간 공유</p>
										<p class="description-paragraph sys-text-sm mt-2">상담 직원은 작업 완료 여부와 정비 내역을 확인하고 고객에게 완료 내역을 안내합니다.</p>
									</li>
									<li class="sys-text-md mt-10">
										<p>확정된 작업 내역을 재입력 없이 결제로 연결</p>
										<p class="description-paragraph sys-text-sm mt-2">상품·공임·할인 내역을 바탕으로 최종 금액을 확인하고 고객폰에서 결제, 매장 결제를 선택해 마무리 합니다. </p>
									</li>
								</ol>
							</div>
							<div class="flex-1 -mr-body-x overflow-hidden">
								<div class="flex-none iphone-frame">
									<div class="screen swiper overflow-visible-swiper overflow-visible!" use:swiper>
										<div class="swiper-wrapper">
											<div class="swiper-slide">
												<img src="/images/case03/04_2_screenshot_mo1.png" alt="" class="block w-full" />
											</div>
											<div class="swiper-slide">
												<img src="/images/case03/04_2_screenshot_mo2.png" alt="" class="block w-full" />
											</div>
											<div class="swiper-slide">
												<img src="/images/case03/04_2_screenshot_mo3.png" alt="" class="block w-full" />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="w-full px-body-x mt-12">
					<Separator class="my-0" />
					<div class="w-full pl-50">
						<div class="flex mt-8">
							<div class="flex flex-col gap-4">
								<p class="sys-text-lg">04-3. Explain with Evidence</p>
								<p class="sys-text-md">모든 매장에서 같은 정보를 바탕으로 제시하는, 고객이 직접 확인할 수 있는 상담 근거</p>
							</div>
						</div>
						<p class="description-paragraph sys-text-sm mt-8">티스테이션 온라인몰에 축적된 상품에 관한 모든 데이터를 Smart Guide 안에서 함께 확인할 수 있도록 연결했습니다.<br/>직원마다 달랐던 설명을, 모든 매장이 같은 정보를 바탕으로 고객과 비교하고 판단하는 상담으로 바꿨습니다.</p>
					</div>
					
					<div class="swiper explain-swiper mt-20 -mx-body-x! pl-[calc(var(--spacing-body-x)+200px)]! pr-body-x!" use:swiper={{
						modules: [Pagination],
						slidesPerView: "auto",
						spaceBetween: 16,
						grabCursor: true,
						observer: true,
						observeParents: true,
					}}>
						<div class="swiper-wrapper">
							<div class="swiper-slide">
								<div class="flex flex-col gap-1">
									<span class="self-start inline-flex sys-caption rounded-full bg-primary text-background py-1 px-3">차량에 맞는 선택지</span>
									<p class="sys-text-sm">차량 규격과 고객의 요구에 맞는 상품을 먼저 좁혀 보여줍니다.</p>
								</div>
								<img src="/images/case03/04_3_screenshot1.png" alt="" class="w-full aspect-580/400 rounded-sm outline-1 outline-[#f2f2f7] -outline-offset-1" />
							</div>
							<div class="swiper-slide">
								<div class="flex flex-col gap-1">
									<span class="self-start inline-flex sys-caption rounded-full bg-primary text-background py-1 px-3">고객이 직접 확인하는 사용 근거</span>
									<p class="sys-text-sm">평점과 리뷰, 영상 콘텐츠를 통해 실제 사용 경험과 상품의 차이를 확인합니다.</p>
								</div>
								<img src="/images/case03/04_3_screenshot2.png" alt="" class="w-full aspect-580/400 rounded-sm outline-1 outline-[#f2f2f7] -outline-offset-1" />
							</div>
							<div class="swiper-slide">
								<div class="flex flex-col gap-1">
									<span class="self-start inline-flex sys-caption rounded-full bg-primary text-background py-1 px-3">투명하게 확인하는 가격과 혜택</span>
									<p class="sys-text-sm">상품 가격과 적용 가능한 할인·이벤트를 고객과 같은 화면에서 확인합니다.</p>
								</div>
								<img src="/images/case03/04_3_screenshot3.png" alt="" class="w-full aspect-580/400 rounded-sm outline-1 outline-[#f2f2f7] -outline-offset-1" />
							</div>
							<div class="swiper-slide">
								<div class="flex flex-col gap-1">
									<span class="self-start inline-flex sys-caption rounded-full bg-primary text-background py-1 px-3">비교 가능한 상품 정보</span>
									<p class="sys-text-sm">특장점과 성능을 같은 기준으로 확인하고 비교합니다.</p>
								</div>
								<img src="/images/case03/04_3_screenshot4.png" alt="" class="w-full aspect-580/400 rounded-sm outline-1 outline-[#f2f2f7] -outline-offset-1" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="case-section" id="05">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">05. EVOLUTION & AI</em>
				/ 상담 근거의 확장
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					정비사의 설명에 사진과 데이터를 더한 상담 근거 — AI 마모도 측정
				</h3>
				<h4 class="sys-text-sm">상품 상담은 표준화됐지만, 교체 필요성에 대한 판단과 설명은 여전히 정비사의 눈과 말에 의존했습니다.<br/>타이어 AI 분석과 고객용 리포트를 더해, 고객이 정비 결과를 믿을 수 있도록 이미지 AI 스캔기능으로 상담의 편의성을 확장했습니다.</h4>
			</div>
			
			<div class="flex items-start gap-15 mt-25">
				<div class="flex-none iphone-frame">
					<div class="screen swiper" use:swiper>
						<div class="swiper-wrapper">
							<div class="swiper-slide">
								<img src="/images/case03/05_1_screenshot_mo1.png" alt="" class="block w-full" />
							</div>
							<div class="swiper-slide">
								<img src="/images/case03/05_1_screenshot_mo2.png" alt="" class="block w-full" />
							</div>
						</div>
					</div>
				</div>

				<div class="flex flex-col pt-6">
					<p class="sys-text-lg">05-1. 육안 판정에서 AI 분석으로</p>

					<p class="sys-text-md mt-16">익숙한 수기 입력은 유지하되, 타이어 촬영으로 결과를 얻는 <br/>AI 측정을 같은 점검 흐름 안에 추가했습니다.</p>
					<p class="description-paragraph sys-text-sm mt-6">AI 측정을 선택하면 정비사는 타이어 상태를 판정하는 대신<br/>네 개의 타이어를 순서대로 촬영합니다.<br/>AI는 촬영 이미지를 분석해 타이어별 상태와 잔여 트레드 정보를 산출하고,<br/>결과를 동일한 고객의 무상점검 기록에 저장합니다.</p>

					<p class="sys-text-md mt-18">2D 이미지 기반 AI 분석의 신뢰 근거와 도입 전 검증</p>

					<div class="flex gap-16 mt-2">
						<div class="flex flex-col items-center">
							<div class="sys-text-lg font-bold bg-linear-to-b from-[#FFA600] to-[#FF5900] bg-clip-text text-transparent"><em class="text-[64px]">17억</em>장</div>
							<p class="sys-caption">실제 타이어 이미지 학습 데이터</p>
						</div>
						<div class="flex flex-col items-center">
							<div class="sys-text-lg font-bold bg-linear-to-b from-[#FFA600] to-[#FF5900] bg-clip-text text-transparent">평균 <em class="text-[64px]">0.5mm</em></div>
							<p class="sys-caption">내부 테스트 기준 실측값과의 차이</p>
						</div>
					</div>
					<p class="description-paragraph sys-text-sm mt-8">카랑 AI는 타이어 이미지 17억 장과 실측 트레드 데이터로 학습됐으며,<br/>내부 테스트에서 실측값 대비 평균 절대 오차 약 0.5mm를 확인했습니다.<br/><br/>정확도와 API 연동 범위, 운영 비용을 종합해 스마트가이드에 도입했습니다.</p>
					<p class="sys-caption text-ts-n2 mt-2 pl-3">*학습 데이터 규모: 카랑 제공 기술자료 / 측정 오차: 내부 테스트 기준</p>
				</div>
			</div>

			<div class="full-width mt-30 py-10 bg-foreground text-background">
				<div class="w-fit mx-auto text-center">
					<div class="flex flex-col gap-4 mt-8">
						<p class="sys-text-lg">타이어 촬영에서 고객 리포트까지 - AI 스캔 프로세스</p>
						<p class="sys-text-sm text-border">네 개의 타이어를 차례로 촬영하면, 분석 결과가 고객에게 전달할 상담 리포트로 완성됩니다.</p>
					</div>

					<div class="flex items-start gap-8 mt-12 text-center">
						<div class="flex flex-col items-center gap-7 w-[330px]">
							<div class="relative w-full flex justify-center items-center connect-dash">
								<span class="relative inline-flex bg-foreground px-3 sys-text-sm font-medium">❶ 마모점검을 위해 AI 분석 선택</span>
							</div>
							<img src="/images/case03/05_1_process1.png" alt="" class="block w-full" />
						</div>
						<div class="flex flex-col items-center gap-7 w-[330px]">
							<div class="relative w-full flex justify-center items-center connect-dash">
								<span class="relative inline-flex bg-foreground px-3 sys-text-sm font-medium connect-dash-head">❷ UI 가이드에 따라 타이어 촬영</span>
							</div>
							<img src="/images/case03/05_1_process2.png" alt="" class="block w-full" />
						</div>
						<div class="flex flex-col items-center gap-7 w-[330px]">
							<div class="relative w-full flex justify-center items-center connect-dash">
								<span class="relative inline-flex bg-foreground px-3 sys-text-sm font-medium connect-dash-head">❸ 촬영 종료 후 Summery 제공</span>
							</div>
							<img src="/images/case03/05_1_process3.png" alt="" class="block w-full" />
						</div>
						<div class="flex flex-col items-center gap-7 w-[330px]">
							<div class="relative w-full flex justify-center items-center">
								<span class="relative inline-flex bg-foreground px-3 sys-text-sm font-medium connect-dash-head">❹ 잔여 그루브 및 측정 결과, AI 진단</span>
							</div>
							<img src="/images/case03/05_1_process4.png" alt="" class="block w-full" />
						</div>
					</div>
				</div>
			</div>

			<div class="mt-30">
				<div class="flex flex-col">
					<p class="sys-text-lg">05-2. 시각적 근거와 고객의 판단 변화</p>

					<p class="sys-text-md mt-4">타이어 상태를 색상과 수치로 함께 확인하면서 교체 필요성을 설명하기 쉬워지고,<br/>고객의 결정에도 도움이 됐다는 현장 반응을 확인했습니다.</p>
					<p class="description-paragraph sys-text-sm mt-10">20개 매장에서 한 달간 AI 마모도 기능을 파일럿 테스트로 운영했습니다. <br/>사용 빈도가 다른 매장 세 군데를 방문해 측정 과정과 상담 활용 방식을 살펴봤습니다.</p>

					<div class="flex gap-4 mt-10">
						<div class="flex flex-col items-center gap-2 w-33 text-center">
							<span class="w-full h-9 flex items-center justify-center sys-caption font-semibold bg-[#FF7B01] text-accent rounded-lg">20 Stores</span>
							<p class="sys-caption text-nowrap">파일럿 대상 매장</p>
						</div>
						<div class="flex flex-col items-center gap-2 w-33 text-center">
							<span class="w-full h-9 flex items-center justify-center sys-caption font-semibold bg-[#FF7B01] text-accent rounded-lg">130 Cases</span>
							<p class="sys-caption text-nowrap">AI 스캔 측정 건수</p>
						</div>
						<div class="flex flex-col items-center gap-2 w-33 text-center">
							<span class="w-full h-9 flex items-center justify-center sys-caption font-semibold bg-[#FF7B01] text-accent rounded-lg">14/20</span>
							<p class="sys-caption text-nowrap">실제 사용 매장</p>
						</div>
						<div class="flex flex-col items-center gap-2 w-33 text-center">
							<span class="w-full h-9 flex items-center justify-center sys-caption font-semibold bg-[#FF7B01] text-accent rounded-lg">54.6%</span>
							<p class="sys-caption text-nowrap">상위 3개 매장 측정 비중</p>
						</div>
					</div>

					<p class="sys-text-lg mt-18">고객용 AI 마모도 분석 리포트</p>
					<p class="description-paragraph sys-text-sm mt-6">타이어별 상태와 촬영 사진, 분석 결과를 모바일 리포트로 전달했습니다.<br/>고객은 상담 후에도 자신의 측정 결과와 설명의 근거를 다시 확인할 수 있습니다.</p>

					<div class="flex items-center gap-1 mt-10">
						<span class="inline-flex items-center h-9 px-6 bg-ts-n4 rounded-full sys-caption font-medium">AI 측정 완료</span>
						<ArrowRight class="size-6 text-ts-n2" />
						<span class="inline-flex items-center h-9 px-6 bg-ts-n4 rounded-full sys-caption font-medium">상담 중 함께 확인</span>
						<ArrowRight class="size-6 text-ts-n2" />
						<span class="inline-flex items-center h-9 px-6 bg-ts-n4 rounded-full sys-caption font-medium">고객 휴대폰으로 발송</span>
						<ArrowRight class="size-6 text-ts-n2" />
						<span class="inline-flex items-center h-9 px-6 bg-ts-n4 rounded-full sys-caption font-medium">이후 다시 확인</span>
					</div>

					<div class="flex items-start gap-16 py-4 pl-20 pr-12 mt-10 bg-attention rounded-sm">
						<div class="screenshot-marker-container w-[205px] flex-none" data-focusing={activeFocusing}>
							<img src="/images/case03/05_2_screenshot.png" alt="" class="w-full rounded-sm" />

							<button class="marker-btn" onclick={() => activeFocusing = 1} style="top:29.5%; left:76%;">
								<span class="sys-caption font-semibold">1</span>
							</button>
							<button class="marker-btn" onclick={() => activeFocusing = 2} style="top:44.5%; left:76%;">
								<span class="sys-caption font-semibold">2</span>
							</button>
							<button class="marker-btn" onclick={() => activeFocusing = 3} style="top:70%; left:55%;">
								<span class="sys-caption font-semibold">3</span>
							</button>
							<button class="marker-btn" onclick={() => activeFocusing = 4} style="top:79%; left:76%;">
								<span class="sys-caption font-semibold">4</span>
							</button>

							<div class="focusing-area w-full h-[14%] top-[23.8%]"></div>
							<div class="focusing-area w-full h-[14.92%] top-[38.72%]"></div>
							<div class="focusing-area w-[74.63%] h-[19.7%] top-[55.23%]"></div>
							<div class="focusing-area w-full h-[20.38%] top-[78%]"></div>
						</div>

						<div class="screenshot-focusing-detail">
							<div class="py-8">
								<p class="sys-text-sm text-accent-foreground font-medium">1/4 현재 상태를 인지합니다</p>
								<p class="sys-text-lg mt-4">종합 점수와 등급을 통한 타이어 상태 파악</p>
								<p class="description-paragraph sys-text-sm mt-6">네 개 타이어의 분석 결과를 종합 안전점수와 상태 등급으로 요약했습니다.<br/>고객은 세부 수치를 읽기 전에 현재 상태가 얼마나 위험한지, 무엇이 점수를 낮췄는지 먼저 이해합니다.</p>

								<img src="/images/case03/05_2_screenshot_focusing1.png" alt="" class="w-[452px] my-8" />

								<div class="inline-flex items-center p-4 gap-8 bg-background rounded-sm">
									<div class="flex flex-col items-start">
										<span class="inline-flex items-center bg-muted-foreground text-background sys-caption rounded-full px-3">Before</span>
										<p class="sys-text-sm mt-1">“타이어 상태가 좋지 않습니다.”</p>
									</div>
									<ArrowRight class="size-5" />
									<div class="flex flex-col items-start">
										<span class="inline-flex items-center bg-accent-foreground text-background sys-caption rounded-full px-3">After</span>
										<p class="sys-text-sm mt-1">“안전점수 32점이며, 좌측 타이어에 문제가 있습니다.”</p>
									</div>
								</div>
							</div>

							<div class="py-8">
								<p class="sys-text-sm text-accent-foreground font-medium">2/4 문제 위치를 확인합니다</p>
								<p class="sys-text-lg mt-4">차량 위치별 마모 상태와 점검 대상 확인</p>
								<p class="description-paragraph sys-text-sm mt-6">타이어별 잔여 트레드와 상태를 차량의 실제 위치에 맞춰 보여줍니다. 고객은 ‘전륜 좌측’과 같은 정비 용어를 해석하지 않아도 어느 타이어에 문제가 있는지 직접 확인할 수 있습니다.</p>

								<img src="/images/case03/05_2_screenshot_focusing2.png" alt="" class="w-[631px] my-8" />

								<div class="inline-flex items-center p-4 gap-8 bg-background rounded-sm">
									<div class="flex flex-col items-start">
										<span class="inline-flex items-center bg-primary text-primary-foreground sys-caption rounded-full px-3">Effects</span>
										<p class="sys-text-sm mt-1">직원과 고객이 같은 위치와 같은 상태를 보며 상담합니다.</p>
									</div>
								</div>
							</div>

							<div class="py-8">
								<p class="sys-text-sm text-accent-foreground font-medium">3/4 시각적 근거를 제공합니다</p>
								<p class="sys-text-lg mt-4">실제 타이어 사진에 표시된 측정 근거</p>
								<p class="description-paragraph sys-text-sm mt-6">고객 차량의 실제 타이어 사진 위에 측정 지점과 잔여 트레드, 마모율을 함께 표시했습니다.<br/>추상적인 숫자를 자신의 타이어 상태와 연결해 교체 권고의 근거를 눈으로 확인합니다.</p>

								<img src="/images/case03/05_2_screenshot_focusing3.png" alt="" class="w-[272px] my-8" />

								<div class="inline-flex items-center p-4 gap-8 bg-background rounded-sm">
									<div class="flex flex-col items-start">
										<span class="inline-flex items-center bg-muted-foreground text-background sys-caption rounded-full px-3">Before</span>
										<p class="sys-text-sm mt-1">정비사의 경험과 구두 설명</p>
									</div>
									<ArrowRight class="size-5" />
									<div class="flex flex-col items-start">
										<span class="inline-flex items-center bg-accent-foreground text-background sys-caption rounded-full px-3">After</span>
										<p class="sys-text-sm mt-1">고객 차량의 사진과 사진 위 맵핑된 측정 데이터</p>
									</div>
								</div>
							</div>

							<div class="py-8">
								<p class="sys-text-sm text-accent-foreground font-medium">4/4 원인과 조치방법을 제시합니다</p>
								<p class="sys-text-lg mt-4">이상 상태의 예상 원인과 후속 점검 안내</p>
								<p class="description-paragraph sys-text-sm mt-6">AI 진단소견은 편마모와 같은 이상 상태를 설명하고 예상 원인을 함께 제시합니다.<br/>고객은 단순히 교체 권유를 받는 것이 아니라 왜 문제가 발생했고 어떤 점검이 필요한지 이해할 수 있습니다.</p>

								<img src="/images/case03/05_2_screenshot_focusing4.png" alt="" class="w-[438px] my-8" />

								<div class="inline-flex items-center p-4 gap-8 bg-background rounded-sm">
									<div class="flex flex-col items-start">
										<span class="inline-flex items-center bg-primary text-primary-foreground sys-caption rounded-full px-3">Effects</span>
										<p class="sys-text-sm mt-1">타이어 판매 중심의 상담을 얼라인먼트와 하체 점검까지 연결되는 차량 정비 상담으로 확장합니다.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="full-width flex flex-col items-center justify-center mt-5 text-background text-center h-128 relative">
				<img src="/images/case03/05_store_feedback_bg.png" alt="" class="absolute inset-0 w-full h-full object-cover" />
				<p class="sys-title-md relative">“예전에는 ‘이 정도면 조금 더 타도 되지?’라고 하셨던 분들도,<br/>AI 결과가 빨간색으로 나오면 ‘아, 갈아야 되네. 교체해 주세요’라고 바뀌세요.”</p>
				<p class="sys-text-sm relative mt-4">— T’Station 방배점 점장</p>
			</div>
			
			<div class="flex items-start gap-10 mt-30">
				<div class="flex flex-col">
					<p class="sys-text-lg">05-3. 파일럿 운영 결과와 현장 정착 조건</p>

					<p class="sys-text-md mt-4">간편한 측정 과정은 사용 부담을 낮추고, 결과의 일관성과 신뢰는 반복 사용의 주요 조건으로 나타났습니다.</p>
					<p class="description-paragraph sys-text-sm mt-6">20개 매장에서 한 달간 AI 마모도 측정 기능을 운영한 결과, 총 130건의 측정이 발생했습니다.<br/>같은 기능이 매장마다 다르게 사용된 이유를 확인하기 위해 서로 다른 사용 빈도를 보인<br/>관양점(21건), 방배점(8건), 한남점(5건)을 방문해 측정 과정과 상담 활용 방식을 살펴봤습니다.</p>

					<div class="flex gap-8 mt-20">
						<img src="/images/case03/05_3_infographic.png" alt="" class="w-[641px] max-w-full" />
						<div class="">
							<div class="flex flex-col items-start">
								<span class="inline-flex items-center h-8 px-4 bg-attention rounded-full sys-caption">전체 측정 중 상위 3개 매장 비중</span>
								<div class="text-[60px] font-semibold bg-linear-to-b from-[#FF4800] to-[#FF9900] bg-clip-text text-transparent">54.6%</div>
							</div>
							<p class="description-paragraph sys-text-sm mt-8">간단한 측정 흐름이 첫 사용을 만들었지만, <br/>반복 사용은 ‘결과를 고객에게 자신 있게 보여줄 수 있는가’에<br/>달려 있었습니다.</p>
						</div>
					</div>
					<div class="flex items-stretch gap-4 mt-10">
						<div class="flex flex-col items-start bg-border rounded-sm py-7 px-6 w-150">
							<span class="inline-flex items-center h-8 px-4 bg-background rounded-full sys-caption">유효하게 작용한 사용 이유</span>
							<ul class="list-disc list-outside pl-5 mt-4 space-y-2 sys-text-sm tracking-[-3%]">
								<li>기존 무상점검 안에서 촬영해 별도의 입력과 교육 부담이 적었습니다.</li>
								<li>사진·수치·색상 등급을 함께 보여주면서 교체 필요성을 설명하기 쉬워졌습니다.</li>
								<li>확인된 마모와 편마모 결과를 타이어 교체와 얼라인먼트 상담으로 연결할 수 있었습니다.</li>
							</ul>
						</div>
						<div class="flex flex-col items-start bg-border rounded-sm pt-8 pb-10 pl-6 w-150">
							<span class="inline-flex items-center h-8 px-4 bg-background rounded-full sys-caption">반복 사용을 막은 요인</span>
							<ul class="list-disc list-outside pl-5 mt-4 space-y-2 sys-text-sm tracking-[-5%]">
								<li>같은 타이어도 촬영 환경에 따라 결과가 달라지면 분석값을 신뢰하기 어려웠습니다.</li>
								<li>야외의 강한 햇빛아래 촬영과 타이어 표면의 빗물, 패턴형태는 실패와 재촬영을 만들었습니다.</li>
								<li>AI 결과가 육안 판단과 다르면 직원이 다시 판정해야 했고, 결국 기존 구두 설명으로 돌아갔습니다.</li>
							</ul>
						</div>
					</div>

					<p class="description-paragraph sys-text-sm mt-8"><em class="font-semibold">사진과 수치를 활용한 상담이 고객의 이해와 교체 판단에 도움이 된다는 현장 반응을 확인했습니다.</em><br/>이러한 가치를 지속적으로 제공하기 위해, 촬영 환경에 따른 결과 편차와 재촬영 부담을 줄이는 것을 후속 개선 방향으로 정했습니다.</p>
				</div>
			</div>
		</section>
		<section class="case-section" id="06">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">06. LEARNING</em>
				/ 표준이 현장에서 작동하는 조건
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					현장 중심의 서비스 표준화 조건
				</h3>
				<h4 class="sys-text-sm">리뉴얼과 AI 파일럿을 거치며 약 300개 매장의 상담 표준화를 위한 설계 기준을 정리했습니다.<br/>정보의 연속성, 직원의 사용 동기, 고객과 공유하는 판단 근거를 함께 고려해야 했습니다.</h4>
			</div>
			<ul class="flex flex-col gap-10 mt-20">
				<li class="flex flex-col">
					<p class="sys-text-md">Learning 01. Flow</p>
					<div class="flex flex-col gap-3 mt-4 py-5 px-6 bg-attention rounded-sm">
						<p class="sys-text-lg">담당자와 기기 간 상담 정보의 연속성</p>
						<p class="description-paragraph sys-text-sm">동일한 절차를 제공해도 장소와 기기가 바뀌면 업무는 끊길 수 있었습니다.<br/>입차·점검부터 상담·작업·결제까지 고객 정보와 진행 상태를 유지하는 것이 일관된 서비스의 기반이었습니다.</p>
					</div>
				</li>
				<li class="flex flex-col">
					<p class="sys-text-md">Learning 02. Adoption</p>
					<div class="flex flex-col gap-3 mt-4 py-5 px-6 bg-attention rounded-sm">
						<p class="sys-text-lg">사용률 목표가 아닌, 업무 안에서 진짜 활용되는 플랫폼</p>
						<p class="description-paragraph sys-text-sm">사용 실적을 평가하는 것만으로는 사후 기록을 실제 상담 활용으로 바꾸기 어려웠습니다.<br/>입력과 인계 부담을 줄이고 업무를 마치는 데 도움이 될 때, 직원이 플랫폼을 사용할 이유가 생깁니다.</p>
					</div>
				</li>
				<li class="flex flex-col">
					<p class="sys-text-md">Learning 03. Trust</p>
					<div class="flex flex-col gap-3 mt-4 py-5 px-6 bg-attention rounded-sm">
						<p class="sys-text-lg">분석 결과의 신뢰성과 상담 활용 가치</p>
						<p class="description-paragraph sys-text-sm">정비사가 신뢰할 수 있는 AI 결과는 설명 부담을 줄이고, 고객이 교체 필요성을 이해하는 근거가 됐습니다.<br/>결과의 일관성과 이를 실제 상담의 판단으로 연결할 수 있는지가 AI 경험의 중요한 설계 기준이었습니다.</p>
					</div>
				</li>
			</ul>

			<div class="flex flex-col mt-40">
				<p class="sys-text-md">NEXT VALIDATION / 다음으로 확인할 것</p>
				<div class="flex flex-col gap-6 mt-6">
					<p class="sys-text-lg">정성적으로 확인한 변화 다음, 행동의 변화를 수치로 검증할 것</p>
					<p class="description-paragraph sys-text-sm">이번 프로젝트에서는 구·신 Smart Guide의 동일 조건 KPI 비교와 고객 직접 조사를 진행하지 못했습니다.<br/>따라서 현장에서 관찰한 반응을 전체 성과로 일반화하지 않고, 다음 단계에서 검증해야 할 지표로 남겼습니다.</p>
				</div>
			</div>

			<ul class="flex flex-col mt-16 w-200 sys-text-sm">
				<li class="flex items-center justify-start border-b py-3 px-5 gap-20 bg-attention">
					<span class="flex-none w-20">검증 영역</span>
					<span class="flex-1 min-w-0">측정 KPI</span>
				</li>
				<li class="flex items-center justify-start border-b py-3 px-5 gap-20">
					<span class="flex-none w-20">업무 흐름</span>
					<span class="flex-1 min-w-0">입차부터 결제까지 소요시간, 기기 간 인계 완료율, 결제 전환율</span>
				</li>
				<li class="flex items-center justify-start border-b py-3 px-5 gap-20">
					<span class="flex-none w-20">현장 지표</span>
					<span class="flex-1 min-w-0">매장별 스마트 가이드 사용률, 단계별 이탈율, 실시간 입차율</span>
				</li>
				<li class="flex items-center justify-start border-b py-3 px-5 gap-20">
					<span class="flex-none w-20">고객 경험</span>
					<span class="flex-1 min-w-0">리포트 열람률, 상담 신뢰도, NPS 응답분석</span>
				</li>
				<li class="flex items-center justify-start border-b py-3 px-5 gap-20">
					<span class="flex-none w-20">AI 신뢰도</span>
					<span class="flex-1 min-w-0">측정 완료 세션 시간, 촬영 환경별 평균 절대 오차</span>
				</li>
			</ul>

			<div class="full-width flex flex-col items-center justify-center mt-40 text-background text-center h-93 relative bg-black/80">
				<img src="/images/case03/closing_bg.png.png" alt="" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80" />
				<p class="sys-title-md relative">ONE STANDARD SERVICE, EVERY STORE</p>
				<p class="sys-text-md relative mt-6">더 편한 UI를 만드는것으로 UX가 완성 된다고 생각하지 않았습니다.<br/>매장의 상담과 판매 방식을 다시 들여다보고 직원에게는 상품을 효과적으로 제안할 수 있는 도구를,<br/>고객에게는 스스로 판단할 수 있는 근거를 제공하고자 했습니다.<br/><br/>매장의 판매 기회와 고객의 신뢰가 함께 커질 때, B2B 플랫폼의 UX도 비로소 비즈니스의 성과가 된다고 생각합니다.</p>
			</div>
		</section>
	</div>
</section>

<style>
	.case-mockup1 {
		width: 1032px;
		height: 605px;
		position: relative;
		background-image: url('/images/case03/02_mockup_frame.png');
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		padding-top: 44px;
		padding-left: 85px;
	}

	.case-mockup1 .screen-swiper {
		position: absolute;
		width: 835px;
		height: 489px;
		overflow: hidden;
	}

	.case-mockup1 .screen-swiper .swiper-slide {
		width: 100%;
		height: 100%;
	}

	.case-mockup1 .screen-swiper .swiper-slide img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.flow-anim-card {
		border-radius: 4px;
		overflow: hidden;
		aspect-ratio: 460/356;
		position: relative;
		background: #008BEC;
		color: #fff;
	}
	
	.flow-anim-card .text-container {
		position: absolute;
		top: 0;
		width: 100%;
		padding: 12px 16px;
		display: none;
	}

	.connect-dash:before {
		content: '';
		display: block;
		width: 100%;
		height: 0;
		border-top: 1px dashed #fff;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translateY(-50%);
	}

	.connect-dash-head {
		position: relative;
	}

	.connect-dash-head:before {
		content: '';
		display: block;
		width: 0;
		height: 0;
		border: 3px solid transparent;
		border-left: 6px solid #fff;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateX(-50%) translateY(-50%);
		z-index: 1;
	}


	.explain-swiper {
		overflow: hidden;
		position: relative;
	}

	.explain-swiper :global(.swiper-wrapper) {
		display: flex;
		flex-direction: row;
	}

	.explain-swiper :global(.swiper-slide) {
		display: flex;
		flex-direction: column;
		gap: 16px;
		width: 580px;
		height: auto;
		flex-shrink: 0;
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

	.overflow-visible-swiper {
		overflow: visible !important;
	}

	.overflow-visible-swiper :global(.swiper-slide) {
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease;
	}

	.overflow-visible-swiper :global(.swiper-slide-active) {
		opacity: 1;
		pointer-events: auto;
	}

	.overflow-visible-swiper :global(.swiper-slide-next) {
		opacity: 0.5;
		pointer-events: auto;
	}

	.overflow-visible-swiper :global(.swiper-slide-next + .swiper-slide) {
		opacity: 0.5;
		pointer-events: auto;
	}

	.screenshot-marker-container {
		position: relative;
	}

	.screenshot-marker-container .marker-btn {
		appearance: none;
		background: transparent;
		border: none;
		cursor: pointer;
		position: absolute;
		padding: 0;
		margin: 0;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		color: #fff;
		background: #000;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		animation: marker-ripple 1s infinite ease-out;
	}

	@keyframes marker-ripple {
		0% {
			box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.3);
		}
		100% {
			box-shadow: 0 0 0 16px rgba(0, 0, 0, 0);
		}
	}

	.screenshot-marker-container .focusing-area {
		position: absolute;
		z-index: 0;
		pointer-events: none;
		border: 2px solid transparent;
		transition: all 0.3s;
		border-radius: 4px;
	}

	.screenshot-marker-container .marker-btn:nth-of-type(1):hover ~ .focusing-area:nth-of-type(1),
	.screenshot-marker-container .marker-btn:nth-of-type(2):hover ~ .focusing-area:nth-of-type(2),
	.screenshot-marker-container .marker-btn:nth-of-type(3):hover ~ .focusing-area:nth-of-type(3),
	.screenshot-marker-container .marker-btn:nth-of-type(4):hover ~ .focusing-area:nth-of-type(4) {
		border-color: var(--color-ts-n3);
	}

	.screenshot-marker-container[data-focusing="1"] :global(.marker-btn:nth-of-type(1)),
	.screenshot-marker-container[data-focusing="2"] :global(.marker-btn:nth-of-type(2)),
	.screenshot-marker-container[data-focusing="3"] :global(.marker-btn:nth-of-type(3)),
	.screenshot-marker-container[data-focusing="4"] :global(.marker-btn:nth-of-type(4)) {
		background: var(--color-accent-foreground);
		animation: none;
		pointer-events: none;
	}

	.screenshot-marker-container[data-focusing="1"] :global(.focusing-area:nth-of-type(1)),
	.screenshot-marker-container[data-focusing="2"] :global(.focusing-area:nth-of-type(2)),
	.screenshot-marker-container[data-focusing="3"] :global(.focusing-area:nth-of-type(3)),
	.screenshot-marker-container[data-focusing="4"] :global(.focusing-area:nth-of-type(4)) {
		border-color: var(--color-accent-foreground);
	}

	.screenshot-focusing-detail > div {
		display: none;
	}

	.screenshot-marker-container[data-focusing="1"] ~ .screenshot-focusing-detail > div:nth-of-type(1),
	.screenshot-marker-container[data-focusing="2"] ~ .screenshot-focusing-detail > div:nth-of-type(2),
	.screenshot-marker-container[data-focusing="3"] ~ .screenshot-focusing-detail > div:nth-of-type(3),
	.screenshot-marker-container[data-focusing="4"] ~ .screenshot-focusing-detail > div:nth-of-type(4) {
		display: block;
		animation: detail-fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

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
