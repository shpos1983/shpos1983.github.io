<script lang="ts">
	import { onMount } from "svelte";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import Swiper from "swiper";
	import type { SwiperOptions } from "swiper/types";
	import { Pagination } from "swiper/modules";
	import "swiper/css";
	import "swiper/css/autoplay";
	import "swiper/css/pagination";
	import { Button } from "$lib/components/ui/button/index.js";
	import { ImageComparison } from "$lib/components/ui/image-comparison/index.js";
	import { CirclePause, CirclePlay, CircleX } from '@lucide/svelte';

	const DEFAULT_HEADER_HEIGHT = 144;
	const DEFAULT_HERO_HEIGHT = 588;

	let scrollY = $state(0);
	let caseBodyEl = $state<HTMLElement | null>(null);
	let activeSectionId = $state("01");
	let isScrollingTo = false;
	let activeFocusing = $state(1);
	let headerHeight = $state(DEFAULT_HEADER_HEIGHT);
	let heroHeight = $state(DEFAULT_HERO_HEIGHT);
	let comparisonPosition = $state(62);

	const paymentSteps = [
		{
			id: 0,
			timestamp: "00:00",
			label: "결제 UX 개편",
			src: "/images/case01/TS_01payment_4K.mp4"
		},
		{
			id: 1,
			timestamp: "00:27",
			label: "마이페이지-관리 정보 통합",
			src: "/images/case01/TS_02mypage_4K.mp4"
		},
		{
			id: 2,
			timestamp: "00:52",
			label: "워런티 디지털화",
			src: "/images/case01/TS_03warranty_4K.mp4"
		}
	];

	let paymentVideoEl = $state<HTMLVideoElement | null>(null);
	let currentPaymentStep = $state(0);
	let isPaymentPlaying = $state(true);

	function handlePaymentStepClick(index: number) {
		if (!paymentVideoEl) return;
		if (currentPaymentStep === index) {
			if (paymentVideoEl.paused) {
				paymentVideoEl.play().catch(() => {});
			} else {
				paymentVideoEl.pause();
			}
		} else {
			currentPaymentStep = index;
			paymentVideoEl.src = paymentSteps[index].src;
			paymentVideoEl.currentTime = 0;
			paymentVideoEl.play().catch(() => {});
		}
	}

	function handlePaymentVideoEnded() {
		currentPaymentStep = (currentPaymentStep + 1) % paymentSteps.length;
		if (paymentVideoEl) {
			paymentVideoEl.src = paymentSteps[currentPaymentStep].src;
			paymentVideoEl.currentTime = 0;
			paymentVideoEl.play().catch(() => {});
		}
	}

	let plpVideoEl = $state<HTMLVideoElement | null>(null);
	let isPlpVideoActive = $state(false);
	let isPlpPlaying = $state(false);

	function togglePlpVideo() {
		if (!isPlpVideoActive) {
			isPlpVideoActive = true;
			if (plpVideoEl) {
				plpVideoEl.currentTime = 0;
				plpVideoEl.play().catch(() => {});
			}
		} else {
			if (plpVideoEl) {
				if (plpVideoEl.paused) {
					if (plpVideoEl.ended) plpVideoEl.currentTime = 0;
					plpVideoEl.play().catch(() => {});
				} else {
					plpVideoEl.pause();
				}
			}
		}
	}

	function closePlpVideo() {
		if (plpVideoEl) {
			plpVideoEl.pause();
			plpVideoEl.currentTime = 0;
		}
		isPlpVideoActive = false;
		isPlpPlaying = false;
	}

	let pdpVideoEl = $state<HTMLVideoElement | null>(null);
	let isPdpVideoActive = $state(false);
	let isPdpPlaying = $state(false);

	function togglePdpVideo() {
		if (!isPdpVideoActive) {
			isPdpVideoActive = true;
			if (pdpVideoEl) {
				pdpVideoEl.currentTime = 0;
				pdpVideoEl.play().catch(() => {});
			}
		} else {
			if (pdpVideoEl) {
				if (pdpVideoEl.paused) {
					if (pdpVideoEl.ended) pdpVideoEl.currentTime = 0;
					pdpVideoEl.play().catch(() => {});
				} else {
					pdpVideoEl.pause();
				}
			}
		}
	}

	function closePdpVideo() {
		if (pdpVideoEl) {
			pdpVideoEl.pause();
			pdpVideoEl.currentTime = 0;
		}
		isPdpVideoActive = false;
		isPdpPlaying = false;
	}

	let maxScroll = $derived(heroHeight - headerHeight);

	const sections = [
		{ id: "01", label: "01. OVERVIEW" },
		{ id: "02", label: "02. EXECUTION" },
		{ id: "03", label: "03. PROCESS" },
		{ id: "04", label: "04. UX PERSPECTIVE" },
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
			const localEl = node.parentElement?.querySelector(finalOptions.pagination.el) || node.querySelector(finalOptions.pagination.el);
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
	<title>CASE 01 | SangSquare</title>
</svelte:head>

<section class="case-hero">
	<img 
		src="/images/case03/hero_bg.png" 
		alt="" 
		class="bg-image" 
		style="transform: translateY({translateY}px);"
	/>
	<div class="text-container">
		<h1>T’Station.com UX Transformation · 2021 - 2025</h1>
		<p class="sys-title-lg">타이어는 잘 몰라도, 내 차에 필요한 타이어는 딱 맞게.<br/>구매 전환을 높이기 위해, 탐색부터 관리까지 고객 여정을 개선한 5년.	</p>
	</div>
</section>
<section bind:this={caseBodyEl} class="case-body flex flex-row items-start justify-start mx-auto px-body-x pt-30 pb-15">
	<aside class="case-sidebar self-stretch flex-none">
		<div class="summary-wrapper">
			<ul class="case-summary list-none flex flex-col gap-4 w-full">
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Project</div>
					<div class="sys-caption text-primary flex-1">T’Station.com UX Transformation</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Duration</div>
					<div class="sys-caption text-primary flex-1">2021 - 2025</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Role</div>
					<div class="sys-caption text-primary flex-1">UX/UI Lead</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Scope</div>
					<div class="sys-caption text-primary flex-1">Business Planning · UX Strategy · UX/UI Design · Data Analysis</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Team</div>
					<div class="sys-caption text-primary flex-1 inline-flex flex-wrap gap-x-3">
						<span>PO <em class="text-accent-blue">1</em></span>
						<span>Service Planner <em class="text-accent-blue">1</em></span>
						<span>Product Designer <em class="text-accent-blue">1</em></span>
						<span>Publisher <em class="text-accent-blue">1</em></span>
						<span>Developer <em class="text-accent-blue">3</em></span>
					</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Goal</div>
					<div class="sys-caption text-primary flex-1">타이어 탐색부터 결제·사후관리까지 <br/>주요 구매 허들을 줄이고 전환을 개선</div>
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
				/ 서비스의 방향 설정과 성장
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					타이어 유통플랫폼을 향한 단계적 전환
				</h3>
				<h4 class="sys-text-sm">T’Station.com이 지향할 역할을 자사 제품 판매를 넘어, 다양한 브랜드의 비교·선택과 장착·사후 관리를 연결하는 유통플랫폼으로 정의했습니다.<br/><em class="font-semibold">이 방향에 맞춰 2022-2025년 주요 구매 접점을 단계적으로 개선했으며, 같은 기간 판매량과 구매 전환율도 함께 성장했습니다.</em></h4>
			</div>

			<img  src="/images/case01/01_infographic.png" alt="" class="flex-none block w-[1104px] aspect-1104/412 mt-20" />

			<div class="full-width flex justify-center gap-20 mt-20 pt-15 border-t border-muted bg-background">
				<div class="w-92">
					<p class="sys-text-lg">연간 개선 흐름과 성과</p>
					<p class="sys-text-md mt-4">주요 구매 접점을 개선해 온 기간 동안<br/>판매량과 구매전환율이 함께 성장했습니다.</p>
					<div class="w-full flex flex-col gap-10 mt-16">
						<div class="w-full flex flex-col items-center">
							<p class="font-bold text-[32px] text-center leading-tight bg-linear-to-b from-[#818181] to-[#000000] bg-clip-text text-transparent"><em class="text-[84px]">2.6</em>배</p>
							<p class="font-semibold text-accent-foreground">연간 판매량</p>
							<p class="sys-caption text-accent-foreground">75,000개 → 197,000개</p>
						</div>
						<div class="w-full flex flex-col items-center">
							<p class="font-bold text-[32px] text-center leading-tight bg-linear-to-b from-[#818181] to-[#000000] bg-clip-text text-transparent"><em class="text-[84px]">2</em>배</p>
							<p class="font-semibold text-[#009BBA]">구매 전환율</p>
							<p class="sys-caption text-[#009BBA]">1.21% → 2.40%</p>
						</div>
					</div>
				</div>
				<div class="w-246.5 flex flex-col gap-6">
					<img  src="/images/case01/01_1_infographic1.png" alt="" class="flex-none block w-full aspect-986/369" />
					<img  src="/images/case01/01_1_infographic2.png" alt="" class="flex-none block w-full aspect-986/62" />
					<img  src="/images/case01/01_1_infographic3.png" alt="" class="flex-none block w-full aspect-986/237" />
				</div>
			</div>
		</section>
		<section class="case-section" id="02">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">02. EXECUTION</em>
				/ 페이지별 UX 개선과 사업 목표의 연결
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					주요 페이지의 개선 목적과 결과
				</h3>
				<h4 class="sys-text-sm">홈·PLP·PDP를 중심으로 고객이 타이어를 찾고 비교하고 구매하는 단계의 역할을 정리했습니다.<br/><em class="font-semibold">각 페이지의 UI와 기능을 상품 탐색, 선택 확신, 구매 전환, 장착 후 관리라는 사업 목표에 맞춰 설계</em>했습니다.</h4>
			</div>
			<div class="mt-30">
				<div class="flex flex-col gap-4">
					<p class="sys-text-lg">02-1. 구매 시작 경로 재구성</p>
					<p class="sys-text-md">타이어를 몰라도 시작할 수 있는 첫 화면</p>
				</div>
				<p class="description-paragraph sys-text-sm mt-6"><em class="font-semibold">무엇부터 해야 할지 판단하기 어려운 고객에게 명확한 시작점을 제공하는 것이 개선의 목표</em>였습니다.<br/>차량번호·차종으로 바로 찾거나 차량을 등록하도록 안내하고, 등록 후에는 내 차에 맞는 타이어와 베스트셀러를 바로 보여줬습니다.</p>
			</div>

			<div class="w-full rounded-2xl bg-pale py-12 px-8 mt-15 flex gap-6 items-start">
				<div class="w-80 flex flex-col items-center gap-6">
					<div class="relative w-full flex justify-center select-none">
						<span class="inline-flex sys-caption rounded-full bg-ts-n3 text-background py-2 px-6 whitespace-nowrap">개편 전 Home 화면</span>
						<div
							class="absolute inset-0 flex justify-center pointer-events-none select-none overflow-hidden"
							style="clip-path: inset(0 {100 - comparisonPosition}% 0 0);"
						>
							<span class="inline-flex sys-caption rounded-full bg-foreground text-background py-2 px-6 whitespace-nowrap">개편 후 Home 화면</span>
						</div>
					</div>

					<ImageComparison
						beforeImage="/images/case01/02_1_screenshot_asis.png"
						afterImage="/images/case01/02_1_screenshot_tobe.png"
						beforeAlt="개편 전 Home 화면"
						afterAlt="개편 후 Home 화면"
						bind:position={comparisonPosition}
						class="w-full aspect-320/658 rounded-[40px] overflow-hidden outline-1 outline-attention -outline-offset-1 relative shadow-2xl"
					/>

					<p class="sys-caption text-ts-n2 text-center mt-7">화면을 좌우로 움직여 비교해 보세요</p>
				</div>
				<div class="w-189.25 flex flex-col gap-20 pt-16">
					<img  src="/images/case01/02_1_desc1.png" alt="" class="flex-none block w-full aspect-757/134" />
					<img  src="/images/case01/02_1_desc2.png" alt="" class="flex-none block w-full aspect-757/182" />
					<img  src="/images/case01/02_1_desc3.png" alt="" class="flex-none block w-full aspect-757/226" />
				</div>
			</div>

			<div class="mt-30">
				<div class="flex flex-col gap-4">
					<p class="sys-text-md">홈에 개편된 구매 탐색 흐름</p>
				</div>
				<p class="description-paragraph sys-text-sm mt-6">차량 등록 상태에 맞춘 탐색 시작부터 적합한 상품과 실사용 리뷰를 통한 판단까지,<br/><em class="font-semibold">홈 안에서 이어지는 구매 흐름을 제공했습니다.</em></p>

				<div class="flex items-start gap-15">
					<div class="screenshot-focusing-detail mt-40">
						{#if activeFocusing === 1}
							<div class="detail-item w-[653px]">
								<div class="">
									<p class="sys-text-md">❶ 등록 상태에 맞춘 시작 경로</p>
									<p class="description-paragraph sys-text-sm mt-6">미등록 고객에게는 차량번호·차종·사이즈 통합 검색과 차량 등록을, 등록 고객에게는 내 차 타이어 쇼핑을 첫 행동으로 제안했습니다.</p>
								</div>
								<img src="/images/case01/02_1_screenshot_focusing1.png" alt="" class="block w-full mt-10" />
							</div>
						{:else if activeFocusing === 2}
							<div class="detail-item w-[653px]">
								<div class="">
									<p class="sys-text-md">❷ 차량 조건에 맞는 상품 탐색</p>
									<p class="description-paragraph sys-text-sm mt-6">미등록 고객에게는 전체 판매 Top5를, 등록 고객에게는 규격에 맞는 Top5를 제공하고 <br/>다양한 브랜드로 탐색 범위를 넓혔습니다.</p>
								</div>
								<img src="/images/case01/02_1_screenshot_focusing2.png" alt="" class="block w-full mt-10" />
							</div>
						{:else if activeFocusing === 3}
							<div class="detail-item w-[653px]">
								<div class="">
									<p class="sys-text-md">❸ 리뷰를 구매 판단 정보로 연결</p>
									<p class="description-paragraph sys-text-sm mt-6">Top5 상품과 해당 상품을 구매한 고객의 리뷰를 같은 순서로 배치했습니다.</p>
								</div>
								<img src="/images/case01/02_1_screenshot_focusing3.png" alt="" class="block w-full mt-10" />
							</div>
						{/if}
					</div>

					<div class="flex-none iphone-frame">
						<div class="screen swiper" use:swiper={{
							grabCursor: true,
							direction: "vertical",
							slidesPerView: "auto",
							spaceBetween: 0,
							modules: [Pagination],
							pagination: {
								el: ".swiper-pagination.mockup1-pagination",
								clickable: true
							},
							on: {
								slideChange: (swiper) => {
									activeFocusing = swiper.activeIndex + 1;
								}
							}
						}}>
							<div class="swiper-wrapper">
								<div class="swiper-slide h-auto! pt-8! bg-ts-n1! relative">
									<img src="/images/case01/02_1_screenshot_mo1.png" alt="" class="block w-full" />
								</div>
								<div class="swiper-slide h-auto! relative">
									<img src="/images/case01/02_1_screenshot_mo2.png" alt="" class="block w-full" />
								</div>
								<div class="swiper-slide h-auto! relative">
									<img src="/images/case01/02_1_screenshot_mo3.png" alt="" class="block w-full" />
								</div>
							</div>
						</div>
						<div class="swiper-pagination mockup1-pagination -left-5!"></div>
					</div>
				</div>

				<div class="mt-20">
					<div>
						<span class="inline-flex bg-attention px-4 py-2 font-semibold sys-caption rounded-full">리뷰 상세 팝업</span>
						<p class="sys-text-md mt-3">구매 판단 정보로 신뢰할 수 있는 리뷰</p>
						<p class="sys-caption mt-3">리뷰 상세에서는 실제 장착 여부와 내 차량과의 유사성, 사용 이후의<br/>성능 평가를 순서대로 확인하도록 정보를 구성했습니다.</p>
					</div>

					<div class="flex items-center justify-start -mt-25 pl-25">
						<img src="/images/case01/02_1_screenshot_focusing_review.png" alt="" class="block w-[483px] aspect-483/304" />
						<img src="/images/case01/02_1_screenshot_review.png" alt="" class="block w-[698px] aspect-698/800" />
					</div>
				</div>
			</div>
			
			<div class="mt-30">
				<div class="flex flex-col gap-4">
					<p class="sys-text-lg">02-2. 상품 선택 단계 재구성</p>
					<p class="sys-text-md">상품을 비교하고 구매 확신을 쌓는 PLP·PDP</p>
				</div>
				<p class="description-paragraph sys-text-sm mt-6">기존에는 상품 목록의 ‘바로구매’를 통해 상품 상세를 확인하지 않고 결제로 이동할 수 있었습니다.<br/><em class="font-semibold">PLP에는 탐색과 비교에 필요한 정보만 남기고, 가격·혜택·성능·리뷰 등 구매 판단의 근거는<br/>PDP에서 단계적으로 확인하도록 역할을 재구성했습니다.</em></p>
			</div>

			<div class="full-width flex justify-center mt-20 backdrop-blur-lg">
				<img src="/images/case01/02_2_overview.png" alt="" class="block w-full flex-none" />
			</div>

			<div class="mt-30">
				<p class="sys-text-md">개편 후 — 탐색에 집중한 상품 목록</p>
				<p class="description-paragraph sys-text-sm mt-6">차량 조건에 맞는 상품을 먼저 제안하고, 가격대와 필터를 통해 후보를 좁힌 뒤 상품 간 차이를 비교하도록 구성했습니다.<br/><em class="font-semibold">상품 카드에는 목록 탐색에 필요한 정보만 남기고, 구매 판단과 실행은 PDP로 분리했습니다.</em></p>
			</div>

			<div class="w-full flex gap-40 items-start justify-start mt-14">
				<img src="/images/case01/02_2_PLP_infographic1.png" alt="" class="block w-[432px] aspect-432/319 flex-none" />
				<img src="/images/case01/02_2_PLP_infographic2.png" alt="" class="block w-[414px] aspect-414/280 flex-none" />
			</div>

			<div class="w-full flex flex-col gap-4 mt-20">
				<img src="/images/case01/02_2_PLP_screenshot1.png" alt="" class="block w-full flex-none rounded-2xl outline-1 outline-border -outline-offset-1 aspect-1402/519" />
				<img src="/images/case01/02_2_PLP_screenshot2.png" alt="" class="block w-full flex-none rounded-2xl outline-1 outline-border -outline-offset-1 aspect-1402/543" />
				<img src="/images/case01/02_2_PLP_screenshot3.png" alt="" class="block w-full flex-none rounded-2xl outline-1 outline-border -outline-offset-1 aspect-1402/567" />
			</div>

			<div class="mt-30">
				<p class="sys-text-md">개편 후 — 구매 판단의 근거를 쌓는 상세 페이지</p>
				<p class="description-paragraph sys-text-sm mt-6">PLP에서 좁힌 상품을 가격과 혜택, 워런티, 리뷰와 성능 정보로 검증하도록 PDP의 정보 위계를 정리했습니다.<br/><em class="font-semibold">핵심 구매 정보는 먼저 확인하고, 깊은 검토가 필요한 내용은 필요한 만큼 탐색하도록 구성했습니다.</em></p>
			</div>

			<div class="swiper pdp-swiper full-width mt-20 py-10! bg-pale pl-[calc(var(--spacing-sidebar)+var(--spacing-body-x)+var(--spacing-case-gap)-333px)]! pr-body-x select-none [&_img]:select-none" use:swiper={{
				slidesPerView: "auto",
				spaceBetween: 96,
				grabCursor: true,
				touchEventsTarget: "container",
				observer: true,
				observeParents: true
			}}>
				<div class="swiper-wrapper">
					<div class="swiper-slide">
						<img src="/images/case01/02_2_PDP_screenshot0.png" alt="" class="block flex-none w-[237px] aspect-237/663" />
					</div>
					<div class="swiper-slide">
						<img src="/images/case01/02_2_PDP_screenshot1.png" alt="" class="block flex-none w-[372px] aspect-372/663" />
					</div>
					<div class="swiper-slide">
						<img src="/images/case01/02_2_PDP_screenshot2.png" alt="" class="block flex-none w-[704px] aspect-704/663" />
					</div>
					<div class="swiper-slide">
						<img src="/images/case01/02_2_PDP_screenshot3.png" alt="" class="block flex-none w-[372px] aspect-372/663" />
					</div>
					<div class="swiper-slide">
						<img src="/images/case01/02_2_PDP_screenshot4.png" alt="" class="block flex-none w-[676px] aspect-676/663" />
					</div>
				</div>
			</div>

			<div class="mt-40">
				<div class="flex flex-col gap-4">
					<p class="sys-text-lg">02-3. 구매 완료와 사후 관리 연결</p>
					<p class="sys-text-md">결제에서 마이페이지·워런티로 이어지는 구매 이후의 흐름</p>
				</div>
				<p class="description-paragraph sys-text-sm mt-6">결제 과정에서 확정된 주문·장착 정보를 마이페이지로 이어<br/>차량·혜택·이력과 상품별 워런티까지 하나의 플로우로 관리하도록 연결했습니다.</p>
			</div>
			<div class="flex items-start justify-start gap-12 mt-20">
				<div class="w-[535px] aspect-535/740 bg-[#fafafa] rounded-2xl overflow-hidden outline-1 outline-border -outline-offset-1 flex-none">
					<video
						bind:this={paymentVideoEl}
						src={paymentSteps[currentPaymentStep].src}
						muted
						autoplay
						playsinline
						onended={handlePaymentVideoEnded}
						onplay={() => (isPaymentPlaying = true)}
						onpause={() => (isPaymentPlaying = false)}
						class="w-full h-full object-cover block"
					>
						<track kind="captions" />
					</video>
				</div>

				<div class="flex flex-col gap-4">
					<span class="self-start inline-flex sys-caption font-semibold rounded-full bg-accent py-1 px-11 text-nowrap">영상 단계</span>

					<div class="timestamp-wrap">
						{#each paymentSteps as step, idx (step.id)}
							<Button
								variant="ghost"
								size="sm"
								class="flex justify-start gap-2 hover:bg-transparent! sys-caption px-0 group transition-all text-left"
								onclick={() => handlePaymentStepClick(idx)}
							>
								{#if currentPaymentStep === idx}
									<Separator class="flex-none bg-accent-foreground w-6! mr-2" />
									<span class="sys-caption font-semibold text-accent-foreground">{step.timestamp}</span>
									<span class="sys-caption font-semibold text-accent-foreground">{step.label}</span>
									{#if isPaymentPlaying}
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

					<p class="sys-caption-sm text-ts-n3">*영상 단계를 선택해 각 단계로 이동할 수 있습니다</p>

					<div class="flex flex-col gap-18 mt-16">
						<div class="transition-opacity duration-300 {currentPaymentStep === 0 ? 'opacity-100' : 'opacity-30'}">
							<p class="sys-text-md">01. 혜택을 놓치지 않는 결제 화면</p>
							<p class="description-paragraph sys-text-sm mt-6"><em class="font-semibold">주문·장착 정보를 묶고 최대 혜택 쿠폰을 자동 적용</em>해,<br/>실제 부담 금액을 바로 확인하도록 했습니다.</p>
						</div>
						<div class="transition-opacity duration-300 {currentPaymentStep === 1 ? 'opacity-100' : 'opacity-30'}">
							<p class="sys-text-md">02. 마이페이지 - 사후 관리의 시작점을 한곳에</p>
							<p class="description-paragraph sys-text-sm mt-6">차량·혜택·구매 이력을 마이페이지에 모아<br/>필요한 <em class="font-semibold">사후 관리로 이어지는 진입점을 통합</em>했습니다.</p>
						</div>
						<div class="transition-opacity duration-300 {currentPaymentStep === 2 ? 'opacity-100' : 'opacity-30'}">
							<p class="sys-text-md">03. 마이페이지에서 이어지는 워런티 관리</p>
							<p class="description-paragraph sys-text-sm mt-6"><em class="font-semibold">상품별 보증 확인부터 신청·잔여기간·이력 조회까지</em><br/>한곳에서 관리하도록 했습니다.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section class="case-section" id="03">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">03. PROCESS</em>
				/ 연차별 개선 과제의 선정·실행·연결 방법
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					무엇부터 바꿨고, 다음 개선은 어떻게 연결했는지
				</h3>
				<h4 class="sys-text-sm">투자 규모와 실행 여건을 고려해 고객과 사업에 미치는 영향이 큰 구매 여정부터 연차별로 개선 범위를 확장했습니다.<br/><em class="font-semibold">상품 선택에서 구매 이후 관리까지 단계적으로 확장하고, 실제 고객 행동으로 개편 의도의 작동 여부를 확인했습니다.</em></h4>
			</div>

			<div class="mt-20">
				<div class="flex flex-col gap-4">
					<p class="sys-text-lg">03-1. 전면 개편이 아닌, 검증 가능한 단위로 개선한 이유</p>
					<p class="sys-text-md">한 번의 대규모 투자보다, 성과를 확인하며 다음 투자를 연결</p>
				</div>
				<p class="description-paragraph sys-text-sm mt-6">전면 개편은 투자 규모와 운영 위험이 크고, <em class="font-semibold">여러 변화가 동시에 진행되면 성과의 원인을 구분하기 어렵습니다.</em><br/>고객 영향도가 큰 여정부터 연차별로 실행하고, 각 단계의 결과를 다음 투자와 개선의 근거로 연결했습니다.</p>
			</div>

			<div class="mt-20 flex flex-col gap-6">
				<div class="flex items-center justify-start gap-4 sys-text-sm">
					<span class="flex-none w-22 h-9 rounded-sm bg-accent-foreground text-accent inline-flex items-center justify-center font-medium">투자</span>
					<p>대규모 일괄 예산보다 단계별 타당성 확보</p>
				</div>
				<div class="flex items-center justify-start gap-4 sys-text-sm">
					<span class="flex-none w-22 h-9 rounded-sm bg-accent-foreground text-accent inline-flex items-center justify-center font-medium">운영</span>
					<p>서비스 사용성을 유지하며 독립 범위부터 적용</p>
				</div>
				<div class="flex items-center justify-start gap-4 sys-text-sm">
					<span class="flex-none w-22 h-9 rounded-sm bg-accent-foreground text-accent inline-flex items-center justify-center font-medium">검증</span>
					<p>변화의 효과를 구간별 행동 지표로 확인</p>
				</div>
			</div>

			<div class="full-width flex items-center justify-center text-center py-5 mt-16 bg-foreground/88 text-background">
				<p class="text-[28px] font-light leading-tight">개편 범위를 좁힌것이 아니라,<br/><em class="font-semibold">검증 가능한 개편 단위로 나눴습니다.</em></p>
			</div>

			<div class="flex mt-20">
				<div class="pr-20">
					<div class="flex items-center gap-3 -mr-16">
						<span class="rounded-full w-15 h-8 bg-foreground text-background flex items-center justify-center font-bold sys-caption flex-none">1 단계</span>
						<div class="h-0 w-full border-t-2 border-ts-n2 relative before:content-[''] before:absolute before:left-0 before:top-0 before:-translate-y-[5px] before:size-2 before:rounded-full before:bg-ts-n2 after:content-[''] after:absolute after:-right-[3px] after:top-0 after:-translate-y-[5.5px] after:w-0 after:h-0 after:border-y-[5px] after:border-y-transparent after:border-l-[9px] after:border-l-ts-n2"></div>
					</div>
					<p class="sys-text-md mt-2">상품 선택 기반 구축</p>
					<p class="sys-text-sm">PLP·PDP 역할 재정의</p>
					<p class="description-paragraph sys-text-sm text-ts-n1 my-7">상품 탐색과 구매 판단을 분리하고,<br/>비교와 선택의 기준을 정비했습니다.</p>
					<div class="flex flex-wrap gap-2">
						<span class="sys-caption text-background bg-ts-n2 rounded-sm px-2 py-0.5">PLP·PDP</span>
						<span class="sys-caption text-background bg-ts-n2 rounded-sm px-2 py-0.5">추천·필터</span>
						<span class="sys-caption text-background bg-ts-n2 rounded-sm px-2 py-0.5">상품 비교</span>
						<span class="sys-caption text-background bg-ts-n2 rounded-sm px-2 py-0.5">구매 확신</span>
					</div>
				</div>
				<div class="pr-20">
					<div class="flex items-center gap-3 -mr-16">
						<span class="rounded-full w-15 h-8 bg-foreground text-background flex items-center justify-center font-bold sys-caption flex-none">2 단계</span>
						<div class="h-0 w-full border-t-2 border-ts-n2 border-dashed relative before:content-[''] before:absolute before:left-0 before:top-0 before:-translate-y-[5px] before:size-2 before:rounded-full before:bg-ts-n2 after:content-[''] after:absolute after:-right-[3px] after:top-0 after:-translate-y-[5.5px] after:w-0 after:h-0 after:border-y-[5px] after:border-y-transparent after:border-l-[9px] after:border-l-ts-n2"></div>
					</div>
					<p class="sys-text-md mt-2">구매 여정 연결</p>
					<p class="sys-text-sm">홈에서 사후 관리까지 확장</p>
					<p class="description-paragraph sys-text-sm text-ts-n1 my-7">쇼핑 시작점을 재구성하고 결제·마이페이지·<br/>워런티를 하나의 경험 흐름으로 연결했습니다.</p>
					<div class="flex flex-wrap gap-2">
						<span class="sys-caption text-background bg-ts-n2 rounded-sm px-2 py-0.5">홈</span>
						<span class="sys-caption text-background bg-ts-n2 rounded-sm px-2 py-0.5">결제 페이지</span>
						<span class="sys-caption text-background bg-ts-n2 rounded-sm px-2 py-0.5">마이 페이지</span>
						<span class="sys-caption text-background bg-ts-n2 rounded-sm px-2 py-0.5">디지털 워런티</span>
					</div>
				</div>
				<div class="pr-20">
					<div class="flex items-center gap-2">
						<span class="rounded-full w-15 h-8 bg-ts-n3 text-background flex items-center justify-center font-bold sys-caption">3 단계</span>
						<span class="text-ts-n3 sys-caption font-medium">NEXT</span>
					</div>
					<p class="sys-text-md mt-2">고객 관계 확장</p>
					<p class="sys-text-sm">행동 데이터 기반 개인화</p>
					<p class="description-paragraph sys-text-sm text-ts-n1 my-7">탐색과 구매 이력을 활용한 맞춤 추천과<br/>재구매 경험으로 확장하는 단계입니다.</p>
					<div class="flex flex-wrap gap-2">
						<span class="sys-caption text-background bg-ts-n4 rounded-sm px-2 py-0.5">개인화</span>
						<span class="sys-caption text-background bg-ts-n4 rounded-sm px-2 py-0.5">맞춤 추천</span>
						<span class="sys-caption text-background bg-ts-n4 rounded-sm px-2 py-0.5">재구매</span>
						<span class="sys-caption text-background bg-ts-n4 rounded-sm px-2 py-0.5">로열티</span>
					</div>
				</div>
			</div>

			<div class="mt-40">
				<div class="flex flex-col gap-4">
					<p class="sys-text-lg">03-2. 대표 사례로 보는 UX 개선 프로세스</p>
					<p class="sys-text-md">상품페이지의 검증 결과를 다음 개선 범위로 연결</p>
				</div>
				<p class="description-paragraph sys-text-sm mt-6">유통플랫폼 전환에 따라 상품 비교와 구매 판단을 담당하는 PLP·PDP를 첫 개선 대상으로 선정했습니다.<br/><em class="font-semibold">고객 행동 데이터를 바탕으로 PLP·PDP의 개선 가설을 세우고, 개편 후 실제 사용으로 설계 의도를 확인</em>했습니다.<br/>이를 바탕으로 상품페이지 유입을 확대할 홈을 다음 개선 대상으로 선정했습니다.</p>
			</div>

			<div class="mt-12 flex gap-20">
				<div class="w-[431px] flex-none">
					<span class="inline-flex bg-attention px-4 py-2 font-semibold sys-caption rounded-full">개편 전 행동 데이터 · GA360</span>
					<img src="/images/case01/03_2_infographic.png" alt="" class=" aspect-431/485 mt-6">
				</div>
				<div class="">
					<span class="inline-flex bg-attention px-4 py-2 font-semibold sys-caption rounded-full">데이터 기반 설계 과정</span>
					
					<div class="flex flex-col gap-12 mt-6">
						<ol class="ordered-list">
							<li class="sys-text-md">
								<p>데이터 진단</p>
								<p class="description-paragraph sys-text-sm text-ts-n1 mt-2"><em class="font-semibold">비전환 고객</em>은 페이지에 더 오래 머물렀지만 PLP·PDP <em class="font-semibold">탐색량은 약 70% 적고,<br/>이탈률은 최대 3배 높았습니다.</em></p>
							</li>
							<li class="sys-text-md mt-10">
								<p>UX 판단</p>
								<p class="description-paragraph sys-text-sm text-ts-n1 mt-2">낮은 탐색량, 높은 이탈률 및 긴 체류시간은 관심보다 <em class="font-semibold">정보 탐색의 어려움</em>일 수 있다고 해석했습니다.</p>
							</li>
							<li class="sys-text-md mt-10">
								<p>설계 가설</p>
								<p class="description-paragraph sys-text-sm text-ts-n1 mt-2"><em class="font-semibold">후보를 좁히는 단계와 구매 근거를 확인하는 단계를 나누면,</em> 상품 선택의 부담을 줄일 수 있을 것으로 보았습니다.</p>
							</li>
							<li class="sys-text-md mt-10">
								<p>설계 결정</p>
								<p class="description-paragraph sys-text-sm text-ts-n1 mt-2">PLP는 추천·필터를 통한 후보 선별, PDP는 비교와 구매 확신에 집중하도록<br/><em class="font-semibold">단계별로 역할을 분리</em>하기로 결정하였습니다.</p>
							</li>
						</ol>
					</div>
				</div>
			</div>

			<div class="mt-25">
				<p class="sys-text-md">개편 후 행동 검증 - 설계 의도의 활용 여부 확인</p>
				<p class="description-paragraph sys-text-sm mt-6">개편 후 실제 고객 동선 추적을 통해 추천영역 탐색, 필터 활용과 유사 상품 비교 행동을 확인했습니다</p>
			</div>

			<div class="mt-12">
				<div class="flex flex-col w-fit items-center">
					<span class="inline-flex bg-attention px-4 py-2 font-semibold sys-caption rounded-full ml-0 mr-auto">개편 후 행동 분석 · Hotjar</span>

					<div class="mt-8 flex w-fit gap-80 pb-10 border-b border-border relative after:content-[''] after:absolute after:-bottom-[13px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0 after:border-x-[7px] after:border-x-transparent after:border-t-[9px] after:border-t-ts-n4">
						<div class="relative w-80 flex-none">
							<div class="relative w-full aspect-320/682 bg-foreground outline-1 outline-border rounded-3xl overflow-hidden isolate">
								<img
									src="/images/case01/03_2_PLP_hotjar_poster.png"
									alt=""
									class="w-full h-full object-cover {isPlpVideoActive ? 'hidden' : 'block'}"
								/>

								<video
									bind:this={plpVideoEl}
									src="/images/case01/03_2_PLP_hotjar_video.mp4"
									muted
									playsinline
									onplay={() => (isPlpPlaying = true)}
									onpause={() => (isPlpPlaying = false)}
									onended={() => (isPlpPlaying = false)}
									class="absolute inset-0 w-full h-full object-contain object-center {isPlpVideoActive ? 'block' : 'hidden'}"
								>
									<track kind="captions" />
								</video>
							</div>
							<div class="w-full flex justify-end items-center gap-2 mt-2">
								<Button
									variant="ghost"
									size="sm"
									class="flex justify-start gap-2 hover:text-accent-foreground hover:bg-transparent! sys-caption px-0 group transition-all text-left"
									onclick={togglePlpVideo}
								>
									<span class="sys-caption">필터 활용 동선 보기</span>
									{#if isPlpPlaying}
										<CirclePause class="size-6" />
									{:else}
										<CirclePlay class="size-6" />
									{/if}
								</Button>

								{#if isPlpVideoActive}
									<Button
										variant="ghost"
										size="icon-sm"
										class="flex justify-start gap-2 hover:text-accent-foreground hover:bg-transparent! sys-caption px-0 group transition-all text-left"
										title="동영상 닫기"
										onclick={closePlpVideo}
									>
										<CircleX class="size-6" />
									</Button>
								{/if}
							</div>

							<div class="absolute -right-6 top-[140px] translate-x-full">
								<p class="sys-text-md">PLP</p>
								<p class="description-paragraph sys-text-sm mt-4">추천 기준과 필터를 활용하는 <br/>행동을 확인했습니다.</p>
							</div>
						</div>
						

						<div class="relative w-80 flex-none">
							<div class="relative w-full aspect-320/682 bg-foreground outline-1 outline-border rounded-3xl overflow-hidden isolate">
								<img
									src="/images/case01/03_2_PDP_hotjar_poster.png"
									alt=""
									class="w-full h-full object-cover {isPdpVideoActive ? 'hidden' : 'block'}"
								/>

								<video
									bind:this={pdpVideoEl}
									src="/images/case01/03_2_PDP_hotjar_video.mp4"
									muted
									playsinline
									onplay={() => (isPdpPlaying = true)}
									onpause={() => (isPdpPlaying = false)}
									onended={() => (isPdpPlaying = false)}
									class="absolute inset-0 w-full h-full object-contain object-center {isPdpVideoActive ? 'block' : 'hidden'}"
								>
									<track kind="captions" />
								</video>
							</div>

							<div class="w-full flex justify-end items-center gap-2 mt-2">
								<Button
									variant="ghost"
									size="sm"
									class="flex justify-start gap-2 hover:text-accent-foreground hover:bg-transparent! sys-caption px-0 group transition-all text-left"
									onclick={togglePdpVideo}
								>
									<span class="sys-caption">유사 상품 비교 동선 보기</span>
									{#if isPdpPlaying}
										<CirclePause class="size-6" />
									{:else}
										<CirclePlay class="size-6" />
									{/if}
								</Button>

								{#if isPdpVideoActive}
									<Button
										variant="ghost"
										size="icon-sm"
										class="flex justify-start gap-2 hover:text-accent-foreground hover:bg-transparent! sys-caption px-0 group transition-all text-left"
										title="동영상 닫기"
										onclick={closePdpVideo}
									>
										<CircleX class="size-6" />
									</Button>
								{/if}
							</div>

							<div class="absolute -right-6 bottom-[64px] translate-x-full">
								<p class="sys-text-md">PDP</p>
								<p class="description-paragraph sys-text-sm mt-4">유사 가격 상품의 비교 기능이 <br/>실제 탐색에 사용됐습니다.</p>
							</div>
						</div>
					</div>

					<div class="w-fit flex flex-col items-center text-center mt-10">
						<span class="inline-flex bg-attention px-4 py-2 font-semibold sys-caption rounded-full">확인한 변화</span>

						<p class="sys-text-sm font-medium mt-4">추천·필터·비교 기능의 실제 사용 <span class="sys-caption">(Hotjar 히트맵 및 실제 고객 세션)</span></p>

						<div class="inline-flex flex-col items-end mt-6">
							<div class="inline-flex items-baseline justify-center gap-2">
								<span class="sys-text-sm font-medium mr-4">상품 상세 진입률</span>
								<span class="sys-text-lg font-bold bg-linear-to-b from-[#FFA600] to-[#FF5900] bg-clip-text text-transparent leading-none"><em class="text-[64px] leading-none">2.4</em>배</span>
								<span class="sys-caption">(8.48% → 20.36%)</span>
							</div>
							<p class="sys-caption-sm text-ts-n2 mt-4">데이터 : GA4 (2023.11.20 ~ 12.31 기준 전후 동기 대비)</p>
						</div>

						<div class="w-[2px] h-14 bg-accent-foreground relative before:content-[''] before:absolute before:left-1/2 before:top-0 before:-translate-x-1/2 before:size-2 before:rounded-full before:bg-accent-foreground after:content-[''] after:absolute after:-bottom-[3px] after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0 after:border-x-[5px] after:border-x-transparent after:border-t-[9px] after:border-t-accent-foreground my-3"></div>

						<div class="px-12 pt-8 pb-12 bg-pale rounded-lg">
							<p class="font-medium sys-caption text-ts-n2">전체 구매 전환율을 위한 다음 질문</p>
							<p class="sys-text-lg mt-2">개선된 상품 선택 구간에, 더 많은 고객이 도달할 수 있도록 하려면?</p>

							<p class="sys-text-sm mt-8">상품페이지의 개선 효과를 바탕으로, 더 많은 고객이 상품 탐색을 시작할 수 있도록<br/><em class="text-accent-foreground font-semibold">홈에서 상품페이지까지의 유입 동선 개선을 다음 해 프로젝트로 선정</em>했습니다.</p>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="case-section" id="04">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="font-extrabold">04. UX PERSPECTIVE</em>
				/ 사업을 읽고 UX 방향을 정하는 원칙
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					시장의 맥락을 읽고,<br/>바꿔야 할 경험과 실행의 순서를 정합니다.
				</h3>
				<h4 class="sys-text-sm">디자인을 하기 전에 시장과 경쟁 환경, 상품·가격 경쟁력과 장착점의 운영 구조를 함께 살폈습니다.<br/>UX뿐 아니라 정책과 운영환경을 함께 검토하고, 사업에 필요한 변화에 따라 실행 우선순위를 정합니다.</h4>
			</div>

			<div class="w-full flex items-stretch gap-2 mt-20">
				<div class="flex-1 min-w-0 px-8 pt-4 pb-20 bg-linear-[165deg] from-[#0E0E0E] to-[#2B3137] rounded-sm">
					<p class="sys-text-md mb-6 text-background">01<br/>사업의 가치를 고객의 경험으로</p>
					<p class="sys-text-sm font-light text-ts-n4">사업의 방향과 고객의 필요가 만나는 지점에서<br/>UX의 목표를 정합니다.</p>
					<p class="sys-text-sm font-light text-ts-n4 mt-5">상품과 서비스의 가치가 고객에게 이해되고,<br/>선택과 이용으로 이어지도록 설계합니다.</p>
				</div>
				<div class="flex-1 min-w-0 px-8 pt-4 pb-20 bg-linear-[165deg] from-[#0E0E0E] to-[#2B3137] rounded-sm">
					<p class="sys-text-md mb-6 text-background">02<br/>고객이 이해하고 행동할 수 있게</p>
					<p class="sys-text-sm font-light text-ts-n4">고객이 구매 여정에 있어 현재 위치와<br/>필요 행동을 쉽게 파악하도록 돕습니다.</p>
					<p class="sys-text-sm font-light text-ts-n4 mt-5">각 접점의 정보와 기능을 이해하고<br/>행동으로 이어지는 흐름을 설계합니다.</p>
				</div>
				<div class="flex-1 min-w-0 px-8 pt-4 pb-20 bg-linear-[165deg] from-[#0E0E0E] to-[#2B3137] rounded-sm">
					<p class="sys-text-md mb-6 text-background">03<br/>데이터에 근거한 개선 우선순위</p>
					<p class="sys-text-sm font-light text-ts-n4">지표와 실제 이용 행동을 바탕으로 개선이<br/>필요한 지점을 찾습니다.</p>
					<p class="sys-text-sm font-light text-ts-n4 mt-5">각 개선이 사업에 미칠 영향을 고려해<br/>실행 우선순위를 정합니다.</p>
				</div>
			</div>
			
			<div class="full-width flex flex-col items-center justify-center mt-32 text-background text-center h-93 relative">
				<img src="/images/case01/closing_bg.png" alt="" class="absolute inset-0 w-full h-full object-cover" />
				<p class="sys-title-md relative">FROM TOUCHPOINTS TO ONE JOURNEY</p>
				<p class="sys-text-md relative mt-4">상품을 찾는 순간부터 장착 이후의 관리까지,<br/>고객의 선택이 좋은 경험으로 이어져 기억에 남도록.<br/><br/>사업의 방향에 따라 여러 해에 걸친 접점별 개선을 하나의 고객 여정으로 연결했습니다.</p>
			</div>
		</section>
		
	</div>
</section>

<style>
	.pdp-swiper {
		overflow: hidden;
		position: relative;
	}

	.pdp-swiper :global(.swiper-wrapper) {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
	}

	.pdp-swiper :global(.swiper-slide) {
		width: auto;
		height: auto;
		flex-shrink: 0;
	}

	.screenshot-focusing-detail .detail-item {
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
