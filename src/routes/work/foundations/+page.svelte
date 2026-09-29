<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Autoplay, EffectFade } from 'swiper/modules';
	import 'swiper/css';
	import 'swiper/css/autoplay';
	import 'swiper/css/effect-fade';
	import { Button } from "$lib/components/ui/button/index.js";
	import { CirclePause, CirclePlay } from '@lucide/svelte';
	import FullPopup from '$lib/components/FullPopup.svelte';

	let activeIndex = $state(1);
	let currentTheme = $state<'default' | 'amber' | 'blue' | 'green'>('default');

	let activePopup = $state<string | null>(null);
	let popup5VideoEl = $state<HTMLVideoElement | null>(null);
	let isPopup5Playing = $state(false);
	let popup5CurrentTime = $state(0);
	let popup5Duration = $state(0);
	let isPopup5Seeking = $state(false);
	let popup5SeekBarEl = $state<HTMLDivElement | null>(null);
	let popup5Progress = $derived(popup5Duration > 0 ? (popup5CurrentTime / popup5Duration) * 100 : 0);

	function togglePopup5Video() {
		if (!popup5VideoEl) return;
		if (popup5VideoEl.paused) {
			popup5VideoEl.play();
		} else {
			popup5VideoEl.pause();
		}
	}

	function seekPopup5(e: PointerEvent) {
		if (!popup5SeekBarEl || !popup5VideoEl || !popup5Duration) return;
		const rect = popup5SeekBarEl.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		popup5CurrentTime = ratio * popup5Duration;
		popup5VideoEl.currentTime = popup5CurrentTime;
	}

	function handlePopup5SeekDown(e: PointerEvent) {
		e.stopPropagation();
		isPopup5Seeking = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		seekPopup5(e);
	}

	function handlePopup5SeekMove(e: PointerEvent) {
		if (isPopup5Seeking) {
			seekPopup5(e);
		}
	}

	function handlePopup5SeekUp(e: PointerEvent) {
		if (isPopup5Seeking) {
			seekPopup5(e);
			isPopup5Seeking = false;
		}
	}

	function handlePopup5Ended() {
		isPopup5Playing = false;
		popup5CurrentTime = 0;
		if (popup5VideoEl) {
			popup5VideoEl.currentTime = 0;
			popup5VideoEl.load();
		}
	}

	let section3VideoEl = $state<HTMLVideoElement | null>(null);
	let isSection3Playing = $state(false);
	let section3CurrentTime = $state(0);
	let section3Duration = $state(0);
	let isSection3Seeking = $state(false);
	let section3SeekBarEl = $state<HTMLDivElement | null>(null);
	let section3Progress = $derived(section3Duration > 0 ? (section3CurrentTime / section3Duration) * 100 : 0);

	function toggleSection3Video() {
		if (!section3VideoEl) return;
		if (section3VideoEl.paused) {
			section3VideoEl.play();
		} else {
			section3VideoEl.pause();
		}
	}

	function seekSection3(e: PointerEvent) {
		if (!section3SeekBarEl || !section3VideoEl || !section3Duration) return;
		const rect = section3SeekBarEl.getBoundingClientRect();
		const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
		section3CurrentTime = ratio * section3Duration;
		section3VideoEl.currentTime = section3CurrentTime;
	}

	function handleSection3SeekDown(e: PointerEvent) {
		e.stopPropagation();
		isSection3Seeking = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		seekSection3(e);
	}

	function handleSection3SeekMove(e: PointerEvent) {
		if (isSection3Seeking) {
			seekSection3(e);
		}
	}

	function handleSection3SeekUp(e: PointerEvent) {
		if (isSection3Seeking) {
			seekSection3(e);
			isSection3Seeking = false;
		}
	}

	function handleSection3Ended() {
		isSection3Playing = false;
		section3CurrentTime = 0;
		if (section3VideoEl) {
			section3VideoEl.currentTime = 0;
		}
	}

	let iphoneVideo1El = $state<HTMLVideoElement | null>(null);
	let iphoneVideo2El = $state<HTMLVideoElement | null>(null);
	let isIphone1Playing = $state(false);
	let isIphone2Playing = $state(false);

	function toggleIphone1Video() {
		if (!iphoneVideo1El) return;
		if (iphoneVideo1El.paused) {
			if (iphoneVideo2El && !iphoneVideo2El.paused) {
				iphoneVideo2El.pause();
			}
			if (iphoneVideo1El.ended) {
				iphoneVideo1El.currentTime = 0;
			}
			iphoneVideo1El.play();
		} else {
			iphoneVideo1El.pause();
		}
	}

	function toggleIphone2Video() {
		if (!iphoneVideo2El) return;
		if (iphoneVideo2El.paused) {
			if (iphoneVideo1El && !iphoneVideo1El.paused) {
				iphoneVideo1El.pause();
			}
			if (iphoneVideo2El.ended) {
				iphoneVideo2El.currentTime = 0;
			}
			iphoneVideo2El.play();
		} else {
			iphoneVideo2El.pause();
		}
	}

	function handleIphone1Ended() {
		isIphone1Playing = false;
		if (iphoneVideo1El) {
			iphoneVideo1El.currentTime = 0;
		}
		if (iphoneVideo2El) {
			iphoneVideo2El.currentTime = 0;
			iphoneVideo2El.play();
		}
	}

	function handleIphone2Ended() {
		isIphone2Playing = false;
		if (iphoneVideo2El) {
			iphoneVideo2El.currentTime = 0;
		}
	}

	$effect(() => {
		if (activePopup !== '05' && popup5VideoEl) {
			if (!popup5VideoEl.paused) {
				popup5VideoEl.pause();
			}
			popup5CurrentTime = 0;
			popup5VideoEl.currentTime = 0;
			popup5VideoEl.load();
		}
	});

	let isWhiteLnb = $derived(currentTheme !== 'default');
	let bodyColorClass = $derived.by(() => {
		switch (currentTheme) {
			case 'amber':
				return 'bg-[#F0B02F] text-background';
			case 'blue':
				return 'bg-[#00A9E4] text-background';
			case 'green':
				return 'bg-[#37523D] text-background';
			default:
				return '';
		}
	});

	const sections = [
		{ id: '01', index: 1 },
		{ id: '02', index: 2 },
		{ id: '03', index: 3 },
		{ id: '04', index: 4 }
	];

	const colorTriggers: { id: string; theme: 'default' | 'amber' | 'blue' | 'green' }[] = [
		{ id: '01', theme: 'default' },
		{ id: 'trigger-amber', theme: 'amber' },
		{ id: '02', theme: 'blue' },
		{ id: '03', theme: 'green' },
		{ id: '04', theme: 'default' }
	];

	function scrollToSection(id: string) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function updateScrollState() {
		const midY = window.innerHeight * 0.8;

		// 1. 컬러 트랜지션 (화면 중간 지점을 통과한 마지막 트리거)
		let newTheme: 'default' | 'amber' | 'blue' | 'green' = 'default';
		for (const trig of colorTriggers) {
			const el = document.getElementById(trig.id);
			if (el) {
				const rect = el.getBoundingClientRect();
				if (rect.top <= midY) {
					newTheme = trig.theme;
				}
			}
		}
		currentTheme = newTheme;

		// 2. LNB 섹션 트래킹 (스크롤 포지션으로만 활성화)
		const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
		if (isAtBottom) {
			activeIndex = 4;
		} else {
			const sectionCheckY = window.innerHeight * 0.45;
			let currentSectionIndex = 1;
			for (const sec of sections) {
				const el = document.getElementById(sec.id);
				if (el) {
					const rect = el.getBoundingClientRect();
					if (rect.top <= sectionCheckY) {
						currentSectionIndex = sec.index;
					}
				}
			}
			activeIndex = currentSectionIndex;
		}
	}

	let overviewSwiperEl = $state<HTMLElement | null>(null);

	onMount(() => {
		updateScrollState();
		window.addEventListener('scroll', updateScrollState, { passive: true });
		window.addEventListener('resize', updateScrollState, { passive: true });

		let swiper: Swiper | null = null;
		if (overviewSwiperEl) {
			swiper = new Swiper(overviewSwiperEl, {
				modules: [Autoplay, EffectFade],
				effect: 'fade',
				fadeEffect: {
					crossFade: true
				},
				loop: true,
				speed: 1000,
				autoplay: {
					delay: 3000,
					disableOnInteraction: false
				}
			});
		}

		return () => {
			window.removeEventListener('scroll', updateScrollState);
			window.removeEventListener('resize', updateScrollState);
			if (swiper) swiper.destroy();
		};
	});

	$effect(() => {
		const classes = ['bg-[#F0B02F]', 'bg-[#00A9E4]', 'bg-[#37523D]', 'text-background'];
		document.body.classList.remove(...classes);
		if (bodyColorClass) {
			bodyColorClass.split(' ').forEach((c) => {
				if (c) document.body.classList.add(c);
			});
		}
		return () => {
			document.body.classList.remove(...classes);
		};
	});
</script>

<svelte:head>
	<title>Foundations | SangSquare</title>
</svelte:head>

<section class="foundations-hero">
	<div class="text-container">
		<h1>Brand & Interactive Design</h1>
		<p class="text-[160px] font-bold leading-none">Foundations</p>
		<p class="sys-text-lg">브랜딩과 그래픽에서 웹·앱·전시의 인터랙션까지, 지금의 디자인 관점과 역량의 바탕이 된 작업들입니다.</p>
	</div>
</section>
<section class="foundations-body flex flex-row items-start justify-start mx-auto px-body-x pt-30 pb-15">
	<aside class="foundations-sidebar self-stretch flex-none">
		<!-- [스크롤에 따른 컬러 트랜지션] foundations-lnb에 white클래스 추가/제거 -->
		<div class="foundations-lnb {isWhiteLnb ? 'white' : ''}">
			<p class="sys-caption font-medium lnb-title">PROJECT INDEX</p>
			<nav class="menus flex-1">
				<div class="menu-item">
					<button 
						type="button"
						class={activeIndex === 1 ? "active" : ""}
						onclick={() => scrollToSection('01')}
					>
						<div class="thumb-holder">
							<img src="/images/foundations/lnb_thumb1.png" alt="" />
						</div>
						<span>1. HOPPY</span>
					</button>

					<ul class="list-none flex flex-col gap-4 w-full pl-4 summary">
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Client</div>
							<div class="sys-caption flex-1 summary-detail">AB InBev</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Year</div>
							<div class="sys-caption flex-1 summary-detail">2018</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Agency</div>
							<div class="sys-caption flex-1 summary-detail">Deutsch New York</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Awards</div>
							<div class="sys-caption flex-1 summary-detail">2019 Shorty Awards<br/>UX/UI · Gamification 부문 Winner</div>
						</li>
					</ul>
				</div>
				<div class="menu-item">
					<button 
						type="button"
						class={activeIndex === 2 ? "active" : ""}
						onclick={() => scrollToSection('02')}
					>
						<div class="thumb-holder">
							<img src="/images/foundations/lnb_thumb2.png" alt="" />
						</div>
						<span>2. ACUVUE</span>
					</button>

					<ul class="list-none flex flex-col gap-4 w-full pl-4 summary">
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Client</div>
							<div class="sys-caption flex-1 summary-detail">ACUVUE</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Year</div>
							<div class="sys-caption flex-1 summary-detail">2017</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Agency</div>
							<div class="sys-caption flex-1 summary-detail">Deutsch New York</div>
						</li>
					</ul>
				</div>
				<div class="menu-item">
					<button 
						type="button"
						class={activeIndex === 3 ? "active" : ""}
						onclick={() => scrollToSection('03')}
					>
						<div class="thumb-holder">
							<img src="/images/foundations/lnb_thumb3.png" alt="" />
						</div>
						<span>3. Hidden Dangers</span>
					</button>

					<ul class="list-none flex flex-col gap-4 w-full pl-4 summary">
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Client</div>
							<div class="sys-caption flex-1 summary-detail">WATERisLIFE</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Year</div>
							<div class="sys-caption flex-1 summary-detail">2017</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Agency</div>
							<div class="sys-caption flex-1 summary-detail">Deutsch New York</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Awards</div>
							<div class="sys-caption flex-1 summary-detail">· FWA of the day<br/>· W. site of the day</div>
						</li>
					</ul>
				</div>
				<div class="menu-item">
					<button 
						type="button"
						class={activeIndex === 4 ? "active" : ""}
						onclick={() => scrollToSection('04')}
					>
						<div class="thumb-holder">
							<img src="/images/foundations/lnb_thumb4.png" alt="" />
						</div>
						<span>4. Selected Graphics</span>
					</button>

					<ul class="list-none flex flex-col gap-4 w-full pl-4 summary">
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Client</div>
							<div class="sys-caption flex-1 summary-detail">Various Clients</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Year</div>
							<div class="sys-caption flex-1 summary-detail">2015 ~ 2019</div>
						</li>
						<li class="flex items-start gap-4">
							<div class="sys-caption font-extrabold w-16 summary-title">Agency</div>
							<div class="sys-caption flex-1 summary-detail">Vinyl I · Deutsch NY</div>
						</li>
					</ul>
				</div>
			</nav>
		</div>
	</aside>
	<div class="foundations-main self-stretch flex-1 min-w-0 flex flex-col gap-60">
		<!-- [스크롤에 따른 컬러 트랜지션] 이부분이 화면 중간쯤 왔을때 body bg-컬러 클래스 text-background 클래스 등 제거(디폴트)로 바뀜 -->
		<section class="foundations-section" id="01">
			<div class="flex gap-20">
				<div class="w-[260px] flex-none flex flex-col">
					<p class="sys-caption">01 / AB InBev</p>
					<h2 class="sys-title-lg font-bold">HOPPY</h2>
					<p class="sys-caption">Branding · UI Design · Illustration</p>
				</div>
				<div class="flex-1 flex flex-col">
					<h3 class="sys-text-lg">AB InBev 임직원을 위한 게임형 맥주 교육 앱</h3>
					<p class="sys-text-sm mt-4">AB InBev는 양조 부서뿐 아니라 재무·영업·마케팅 등 <em class="font-semibold">모든 임직원이 맥주에 관한 지식을 갖고 브랜드와 카테고리를<br/>설명할 수 있기를 원했습니다. Hoppy는 이를 위해 전문적인 맥주 교육을 짧은 모바일 학습과 퀴즈로 전환한 게임형 교육 앱</em>입니다. <br/>학습을 통해 배지와 Beercoin을 획득하고, 모은 코인을 굿즈로 교환하는 보상 구조로 지속적인 참여를 유도합니다.</p>

					<div class="flex gap-6 mt-10">
						<span class="inline-flex items-center justify-center h-8 rounded-full bg-accent-foreground text-background font-extrabold px-3">My Role</span>

						<p class="leading-[32px] font-medium">브랜딩·그래픽 시스템의 주요 디자인 담당<br/>배지·일러스트레이션 주요 에셋 디자인 및 제작<br/>UI 시스템·가이드 기반 앱 화면 디자인</p>
					</div>
				</div>
			</div>

			<div class="mt-21">
				<h4 class="sys-text-md">브랜드·보상 그래픽</h4>
				<p class="description-paragraph sys-text-sm mt-6">맥주를 소재로 한 일러스트레이션과 배지, Beercoin 그래픽을 학습 콘텐츠와 보상 화면에 적용했습니다.</p>
			</div>

			<div class="grid grid-cols-3 gap-2 mt-10">
				<img src="/images/foundations/01_1_graphic1.png" alt="" class="rounded" />
				<img src="/images/foundations/01_1_graphic2.png" alt="" class="rounded" />
				<img src="/images/foundations/01_1_graphic3.png" alt="" class="rounded" />
				<!-- [스크롤에 따른 컬러 트랜지션] 이부분이 화면 중간쯤 왔을때 body bg-[#F0B02F] text-background 로 바뀜 -->
				<img id="trigger-amber" src="/images/foundations/01_1_graphic4.png" alt="" class="rounded" />
				<img src="/images/foundations/01_1_graphic5.png" alt="" class="rounded" />
			</div>

			<div class="mt-30">
				<h4 class="sys-text-md">퀴즈 참여·보상 획득</h4>
				<p class="description-paragraph sys-text-sm mt-6">데일리 챌린지로 맥주 지식을 확인하고, 틀린 문제는 정답을 살펴본 뒤 다시 도전할 수 있습니다.<br/>챌린지를 완료하면 배지와 Beercoin을 보상으로 받습니다.</p>
			</div>
			<div class="full-width flex">
				<img src="/images/foundations/01_2_graphic.png" alt="" class="w-full" />
			</div>
			<div class="flex gap-28 mt-20">
				<div class="flex-none iphone-frame">
					<div class="screen">
						<video
							bind:this={iphoneVideo1El}
							src="/images/foundations/01_2_video1.mp4"
							preload="metadata"
							muted
							playsinline
							onplay={() => (isIphone1Playing = true)}
							onpause={() => (isIphone1Playing = false)}
							onended={handleIphone1Ended}
							onclick={toggleIphone1Video}
							class="absolute inset-0 w-full h-full object-cover object-center rounded-4xl cursor-pointer"
						>
							<track kind="captions" />
						</video>
					</div>

					<Button
						onclick={toggleIphone1Video}
						variant="ghost"
						class="absolute -right-8 bottom-0 p-0 rounded-full! cursor-pointer text-foreground bg-transparent!"
						aria-label={isIphone1Playing ? '일시정지' : '재생'}
					>
						{#if isIphone1Playing}
							<CirclePause class="size-8 stroke-[1.5]!" />
						{:else}
							<CirclePlay class="size-8 stroke-[1.5]!" />
						{/if}
					</Button>
				</div>

				<div class="flex-none iphone-frame">
					<div class="screen">
						<video
							bind:this={iphoneVideo2El}
							src="/images/foundations/01_2_video2.mp4"
							preload="metadata"
							muted
							playsinline
							onplay={() => (isIphone2Playing = true)}
							onpause={() => (isIphone2Playing = false)}
							onended={handleIphone2Ended}
							onclick={toggleIphone2Video}
							class="absolute inset-0 w-full h-full object-cover object-center rounded-4xl cursor-pointer"
						>
							<track kind="captions" />
						</video>
					</div>
					<Button
						onclick={toggleIphone2Video}
						variant="ghost"
						class="absolute -right-8 bottom-0 p-0 rounded-full! cursor-pointer text-foreground bg-transparent!"
						aria-label={isIphone2Playing ? '일시정지' : '재생'}
					>
						{#if isIphone2Playing}
							<CirclePause class="size-8 stroke-[1.5]!" />
						{:else}
							<CirclePlay class="size-8 stroke-[1.5]!" />
						{/if}
					</Button>
				</div>

				<img src="/images/foundations/01_2_flow.png" alt="" class="flex-none w-[389px] aspect-389/758" />
			</div>

			<div class="mt-20">
				<h4 class="sys-text-md">Beercoin 사용·굿즈 구매</h4>
				<p class="description-paragraph sys-text-sm mt-6">학습과 퀴즈로 모은 Beercoin을 티셔츠 등 브랜드 굿즈 구매에 사용할 수 있습니다.<br/>원하는 상품과 옵션을 선택하고, 사용할 코인과 교환 후 잔액을 확인한 뒤 주문을 완료합니다.</p>
			</div>
			<div class="full-width flex">
				<img src="/images/foundations/01_3_graphic.png" alt="" class="w-full" />
			</div>

			<div class="mt-10">
				<h4 class="sys-text-md">브랜드 일러스트레이션·그래픽</h4>
				<p class="description-paragraph sys-text-sm mt-6">맥주를 소재로 한 캐릭터와 일러스트레이션, 패턴 등 브랜드 그래픽을 디자인했습니다.<br/>굵은 윤곽선과 선명한 색감을 바탕으로 앱, 인쇄물, 굿즈, 공간 등 다양한 매체에서 일관된 스타일로 활용할 수 있도록 구성했습니다.</p>
			</div>

			<img src="/images/foundations/01_4_graphic.png" alt="" class="w-[782px] aspect-782/471 mt-12 ml-34 mix-blend-multiply" />

			<div class="grid grid-cols-3 gap-2">
				<img src="/images/foundations/01_4_tile1.png" alt="" class="rounded" />
				<img src="/images/foundations/01_4_tile2.png" alt="" class="rounded" />
				<img src="/images/foundations/01_4_tile3.png" alt="" class="rounded" />
			</div>
		</section>

		<!-- [스크롤에 따른 컬러 트랜지션] 이부분이 화면 중간쯤 왔을때 body bg-[#00A9E4] text-background 로 바뀜 -->
		<section class="foundations-section" id="02">
			<div class="flex gap-20">
				<div class="w-[260px] flex-none flex flex-col">
					<p class="sys-caption">02 / johnson & johnson</p>
					<h2 class="sys-title-lg font-bold">ACUVUE</h2>
					<p class="sys-caption">UI system · Illustration</p>
				</div>
				<div class="flex-1 flex flex-col">
					<h3 class="sys-text-lg">콘택트렌즈 제품과 눈 건강 정보를 위한 웹사이트 리뉴얼</h3>
					<p class="sys-text-sm mt-4"><em class="font-semibold">콘택트렌즈 제품과 눈 건강, 렌즈 착용·관리 정보를 제공하는 Acuvue.com의 미주 웹사이트 리뉴얼 프로젝트입니다.</em><br/>기존 브랜드 아이덴티티를 유지하면서, 많은 정보를 짧은 단락과 사진·아이콘·일러스트레이션으로 정리해<br/>제품의 특징과 사용 정보를 쉽게 살펴볼 수 있도록 구성했습니다.</p>

					<div class="flex gap-6 mt-10">
						<span class="inline-flex items-center justify-center h-8 rounded-full bg-background text-[#00A9E4] font-extrabold px-3">My Role</span>

						<p class="leading-[32px] font-medium">공통 UI 시스템·가이드 기반 주요 화면 및 상품 페이지 디자인<br/>아이콘·정보 일러스트레이션 제작<br/>전체 페이지 중 50% 이상 UI 디자인 담당</p>
					</div>
				</div>
			</div>

			<div class="flex gap-20 mt-28">
				<img src="/images/foundations/02_overview_screen.png" alt="" class="rounded-4xl w-[900px] aspect-900/1644 flex-none" />

				<div class="self-start flex-1 min-w-0 overflow-hidden -mr-body-x">
					<img src="/images/foundations/02_overview_system.png" alt="" class="self-start w-[649px] aspect-649/973 flex-none" />
				</div>

				
			</div>

			<div class="mt-34">
				<h4 class="sys-text-md">커스텀 아이콘·정보 일러스트레이션</h4>
				<p class="description-paragraph sys-text-sm mt-6">브랜드 서체 Graphik의 기하학적 형태와 선 굵기 규칙을 바탕으로 아이콘을 제작했습니다.<br/>같은 스타일을 눈의 구조와 렌즈 착용·관리 방법을 설명하는 일러스트레이션으로 확장했습니다.</p>
			</div>

			<img src="/images/foundations/02_1_graphic1.png" alt="" class="w-full aspect-1448/453 flex-none mt-10" />

			<img src="/images/foundations/02_1_graphic2.png" alt="" class="w-[913px] aspect-913/238 flex-none my-16 mx-auto" />

			<img src="/images/foundations/02_1_graphic3.png" alt="" class="w-full aspect-1448/555 flex-none" />

			<div class="mt-30">
				<h4 class="sys-text-md">주요 페이지 UI 디자인</h4>
				<p class="description-paragraph sys-text-sm mt-6">공통 UI 시스템을 바탕으로 눈 건강 정보와 신제품 소개 페이지를 디자인했습니다.<br/>사진·일러스트레이션·텍스트를 콘텐츠의 성격에 맞게 조합해 각 페이지의 주요 화면을 구성했습니다.</p>
			</div>

			<div class="flex gap-6 mt-10">
				<img src="/images/foundations/02_2_graphic1.png" alt="" class="aspect-712/912 flex-1 min-w-0" />
				<img src="/images/foundations/02_2_graphic2.png" alt="" class="aspect-712/912 flex-1 min-w-0" />
			</div>

			<div class="mt-30">
				<h4 class="sys-text-md">상품 목록·상세 페이지</h4>
				<p class="description-paragraph sys-text-sm mt-6">조건별로 렌즈를 살펴볼 수 있는 상품 목록과 제품의 특징을 소개하는 상세 페이지를 디자인했습니다.<br/>제품 이미지와 주요 정보, 체험 신청·전문가 찾기 안내를 PC와 모바일 화면에 맞춰 구성했습니다.</p>
			</div>

			<div class="mt-10 pb-90 relative">
				<img src="/images/foundations/02_3_graphic1.png" alt="" class="w-[920px] aspect-920/767" />
				<img src="/images/foundations/02_3_graphic2.png" alt="" class="w-[920px] aspect-920/803 absolute right-0 bottom-0 drop-shadow-2xl" />
			</div>

			<div class="full-width mt-34">
				<img src="/images/foundations/02_closing.png" alt="" class="w-full aspect-1920/858" />
			</div>
		</section>

		<!-- [스크롤에 따른 컬러 트랜지션] 이부분이 화면 중간쯤 왔을때 body bg-[#37523D] text-background 로 바뀜 -->
		<section class="foundations-section" id="03">
			<div class="flex gap-20">
				<div class="w-[260px] flex-none flex flex-col">
					<p class="sys-caption">03 / WATERisLIFE</p>
					<h2 class="sys-title-lg font-bold whitespace-nowrap">Hidden Dangers</h2>
					<p class="sys-caption">UI Design · Character Design · Illustration</p>
				</div>
				<div class="flex-1 flex flex-col">
					<h3 class="sys-text-lg">수질 오염의 위험을 알리는 캠페인 웹사이트 제작</h3>
					<p class="sys-text-sm mt-4"><em class="font-semibold">Hidden Dangers는 태국 농촌 지역 어린이들에게 수질 오염의 위험을 알리기 위한 WATERisLIFE의 교육 캠페인입니다.</em><br/>물속 오염원을 몬스터로 표현한 VR 게임으로 깨끗한 물의 중요성을 전달하고, 웹사이트를 통해 각 오염원의 이야기와<br/>교육 콘텐츠, 후원 방법을 소개했습니다.</p>

					<div class="flex gap-6 mt-10">
						<span class="inline-flex items-center justify-center h-8 rounded-full bg-[#FED70D] text-[#3F5644] font-extrabold px-3">My Role</span>

						<p class="leading-[32px] font-medium">캐릭터 디자인·일러스트레이션 에셋 제작<br/>PC·모바일 캠페인 페이지 UI 디자인</p>
					</div>
				</div>
			</div>

			<div bind:this={overviewSwiperEl} class="w-full swiper mt-20 rounded-sm">
				<div class="swiper-wrapper">
					<div class="swiper-slide">
						<img src="/images/foundations/03_overview1.png" alt="" class="w-full aspect-1448/640" />
					</div>
					<div class="swiper-slide">
						<img src="/images/foundations/03_overview2.png" alt="" class="w-full aspect-1448/640" />
					</div>
					<div class="swiper-slide">
						<img src="/images/foundations/03_overview3.png" alt="" class="w-full aspect-1448/640" />
					</div>
				</div>
			</div>

			<div class="mt-20">
				<h4 class="sys-text-md">오염원별 몬스터 캐릭터</h4>
				<p class="description-paragraph sys-text-sm mt-6">박테리아·쓰레기·금속·화학물질을 각각의 몬스터 캐릭터로 시각화했습니다.<br/>어린이를 대상으로 한 교육 콘텐츠에 맞춰 기괴한 형태에 유머를 더하고, 눈에 보이지 않는 오염의 위험을 구체적인 대상으로 표현했습니다.</p>
			</div>

			<img src="/images/foundations/03_1_graphic.png" alt="" class="w-full aspect-1452/340 flex-none mt-8 rounded-sm" />

			<div class="flex mt-20 gap-10 items-center">
				<img src="/images/foundations/03_2_screenshot.png" alt="" class="w-[721px] aspect-721/1589 flex-none" />
				<div class="flex-1 min-w-0 flex flex-col gap-20">
					<div class="">
						<h4 class="sys-text-md">수중 탐색형 페이지 구성</h4>
						<p class="description-paragraph sys-text-sm mt-6">몬스터를 선택하면 해당 오염원에 대한 이야기로 이어집니다.<br/>수면에서 물속으로 내려가는 스크롤 흐름에 짧은 설명과 캐릭터를 배치해,<br/>강물에 감춰진 위험을 살펴볼 수 있도록 구성했습니다.</p>
					</div>

					<div class="">
						<span class="inline-flex items-center justify-center h-8 rounded-full bg-background text-foreground px-3 mb-6">01 오염원과 위험 안내</span>

						<div class="flex gap-8">
							<img src="/images/foundations/03_2_monster3.png" alt="" class="w-[220px] aspect-220/244 flex-none" />

							<div class="">
								<p class="sys-text-md">금속 몬스터 · Metal Monster</p>
								<p class="sys-text-sm font-medium mt-6">먹거리와 연결된 강물 속 오염</p>
								<p class="sys-caption mt-2">주민들의 식재료와 가축의 먹이를 제공하는 강을 배경으로, 금속 오염의 <br/>위험을 표현한 캐릭터입니다. 강물의 오염이 먹거리를 얻는 일상과도<br/>연결되어 있음을 보여줍니다.</p>
							</div>
						</div>
					</div>

					<div class="">
						<span class="inline-flex items-center justify-center h-8 rounded-full bg-background text-foreground px-3 mb-6">02 교육 콘텐츠 제공 안내</span>

						<div class="grid grid-cols-2 gap-2">
							<img src="/images/foundations/03_2_tile1.png" alt="" class="" />
							<div class="flex flex-col items-start justify-center pl-4">
								<p class="sys-text-sm font-medium">식수 빨대와 VR 게임 설명</p>
								<p class="sys-caption mt-2">정수용 빨대의 원리와 VR 체험, 360° 영상을 안내합니다.<br/>학교에서도 콘텐츠를 활용해 수질 오염과 정수·위생의<br/>중요성을 배울 수 있도록 연결합니다.</p>
							</div>
							<img src="/images/foundations/03_2_tile2.png" alt="" class="" />
							<img src="/images/foundations/03_2_tile3.png" alt="" class="" />
						</div>
					</div>

					<div class="">
						<span class="inline-flex items-center justify-center h-8 rounded-full bg-background text-foreground px-3 mb-6">03 후원 참여 안내</span>

						<div class="flex flex-col items-start justify-center">
							<p class="sys-text-sm font-medium">10달러로 식수빨대를 후원합니다.</p>
							<p class="sys-caption mt-2">후원 금액과 해당 금액으로 지원할 수 있는 내용을 함께 제시합니다.<br/>앞서 살펴본 오염 문제에 대한 관심이 깨끗한 물을 제공하는 활동의 후원으로 이어지도록 구성합니다.</p>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-30">
				<h4 class="sys-text-md">03. 웹사이트 탐색 흐름</h4>
				<p class="description-paragraph sys-text-sm mt-6">몬스터 선택부터 오염원별 이야기, 교육 콘텐츠와 후원 안내까지 이어지는 웹사이트의 전체 탐색 과정입니다.<br/>실사 화면에서 수중 공간으로 전환되는 장면과 스크롤에 따른 콘텐츠의 등장, 주요 화면 간의 연결을 영상으로 담았습니다.</p>
			</div>

			<div class="flex-none laptop-frame mt-20">
				<div class="screen group">
					<video
						bind:this={section3VideoEl}
						bind:currentTime={section3CurrentTime}
						bind:duration={section3Duration}
						src="/images/foundations/03_3_video.mp4"
						preload="metadata"
						muted
						playsinline
						onplay={() => (isSection3Playing = true)}
						onpause={() => (isSection3Playing = false)}
						onended={handleSection3Ended}
						onclick={toggleSection3Video}
						class="absolute inset-0 w-full h-full object-cover object-center cursor-pointer"
					>
						<track kind="captions" />
					</video>

					<!-- 하단 미니멀 Seek 바 -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						bind:this={section3SeekBarEl}
						onpointerdown={handleSection3SeekDown}
						onpointermove={handleSection3SeekMove}
						onpointerup={handleSection3SeekUp}
						onkeydown={(e) => {
							if (!section3VideoEl || !section3Duration) return;
							if (e.key === 'ArrowLeft') {
								e.preventDefault();
								section3VideoEl.currentTime = Math.max(0, section3CurrentTime - 5);
							} else if (e.key === 'ArrowRight') {
								e.preventDefault();
								section3VideoEl.currentTime = Math.min(section3Duration, section3CurrentTime + 5);
							}
						}}
						onclick={(e) => e.stopPropagation()}
						class="absolute bottom-0 inset-x-0 h-7 flex items-center px-6 cursor-pointer z-20 group/seek select-none transition-opacity duration-300 {isSection3Playing ? (isSection3Seeking ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto') : 'opacity-0 pointer-events-none'}"
						role="slider"
						aria-label="재생 구간 탐색"
						aria-valuemin={0}
						aria-valuemax={section3Duration}
						aria-valuenow={section3CurrentTime}
						tabindex="0"
					>
						<div class="w-full h-0.5 group-hover/seek:h-1 bg-white/30 rounded-full relative transition-all">
							<div
								class="h-full bg-white rounded-full relative transition-none"
								style="width: {section3Progress}%"
							></div>
							<div
								class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 bg-white rounded-full shadow-md transition-transform pointer-events-none {isSection3Seeking ? 'scale-100' : 'scale-0 group-hover/seek:scale-100'}"
								style="left: {section3Progress}%"
							></div>
						</div>
					</div>
				</div>
				<Button
					onclick={toggleSection3Video}
					variant="ghost"
					class="absolute right-18 bottom-24 p-0 rounded-full! cursor-pointer text-background bg-transparent! z-10"
					aria-label={isSection3Playing ? '일시정지' : '재생'}
				>
					{#if isSection3Playing}
						<CirclePause class="size-8 stroke-[1.5]!" />
					{:else}
						<CirclePlay class="size-8 stroke-[1.5]!" />
					{/if}
				</Button>
			</div>
		</section>

		<!-- [스크롤에 따른 컬러 트랜지션] 이부분이 화면 중간쯤 왔을때 body bg-컬러 클래스 text-background 클래스 등 제거(디폴트)로 바뀜 -->
		<section class="foundations-section" id="04">
			<div class="flex items-center gap-20">
				<div class="w-[260px] flex-none flex flex-col">
					<p class="sys-caption">04 / Foundations</p>
					<h2 class="sys-title-lg font-bold leading-[1.1]">SELECTED<br/>WORKS</h2>
					<p class="sys-caption">Branding · UI Design · Illustration</p>
				</div>
				<div class="flex-1 flex flex-col">
					<h3 class="sys-text-lg">아이덴티티, 타이포그래피, 일러스트레이션과 인터랙티브 작업을 선별했습니다.<br/>다양한 매체에서 시각적 표현과 정보 전달을 다뤄온 작업을 소개합니다.</h3>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-x-8 gap-y-16 mt-16">
				<button 
					type="button" 
					class="foundations-tile-btn w-full text-left"
					onclick={() => activePopup = '01'}
				>
					<img src="/images/foundations/04_tile1.png" alt="" class="w-full aspect-704/400" />
					<div class="cover">
						<p class="sys-text-lg">American Library Association</p>
						<p class="sys-caption">Illustration · Editorial Design</p>
					</div>
				</button>
				<button 
					type="button" 
					class="foundations-tile-btn w-full text-left"
					onclick={() => activePopup = '02'}
				>
					<img src="/images/foundations/04_tile2.png" alt="" class="w-full aspect-704/400" />
					<div class="cover">
						<p class="sys-text-lg">CJ Baseball Team CI</p>
						<p class="sys-caption">Symbol · Emblem / 제안 시안</p>
					</div>
				</button>
				<button 
					type="button" 
					class="foundations-tile-btn w-full text-left"
					onclick={() => activePopup = '03'}
				>
					<img src="/images/foundations/04_tile3.png" alt="" class="w-full aspect-704/400" />
					<div class="cover">
						<p class="sys-text-lg">MindSphere</p>
						<p class="sys-caption">Campaign Graphic · UI · Iconography</p>
					</div>
				</button>
				<button 
					type="button" 
					class="foundations-tile-btn w-full text-left"
					onclick={() => activePopup = '04'}
				>
					<img src="/images/foundations/04_tile4.png" alt="" class="w-full aspect-704/400" />
					<div class="cover">
						<p class="sys-text-lg">PNC MoBot</p>
						<p class="sys-caption">UI · BI · Character Design</p>
					</div>
				</button>
				<button 
					type="button" 
					class="foundations-tile-btn col-span-2 w-full text-left"
					onclick={() => activePopup = '05'}
				>
					<img src="/images/foundations/04_tile5.png" alt="" class="w-full aspect-1440/400" />
					<div class="cover">
						<p class="sys-text-lg">Emotional Contagion</p>
						<p class="sys-caption">Interactive Installation / 전시기록</p>
					</div>
				</button>
			</div>
		</section>
	</div>
</section>

<!-- 1. American Library Association -->
<FullPopup open={activePopup === '01'} onclose={() => activePopup = null}>
	{#snippet header()}
		<div class="w-16 h-16 rounded-full overflow-hidden flex-none bg-muted border border-border/50">
			<img src="/images/foundations/04_1_thumb.png" alt="" class="w-full h-full object-cover" />
		</div>
		<div class="flex flex-col">
			<h2 class="sys-text-md leading-tight">American Library Association</h2>
			<p class="sys-caption text-ts-n2 mt-0.5">독자 프라이버시 보호 캠페인</p>
		</div>
	{/snippet}

	<div class="flex flex-col gap-4">
		<h1 class="sys-text-lg">ALA - 일러스트레이션·인포그래픽</h1>
		<p class="sys-text-sm text-ts-n2 whitespace-pre-line mt-2">
			미국도서관협회(ALA)를 위한 책 표지 일러스트레이션과 타임라인 그래픽 작업입니다.<br/>유명 소설의 제목을 감시·도청 등의 표현으로 변형한 콘셉트에 맞춰 다섯 종의 표지 일러스트레이션을 제작했습니다.<br/>미국 애국법과 도서관 감시의 주요 사건을 담은 타임라인을 함께 구성해, 독자의 프라이버시와 관련된 문제를 시각적으로 전달했습니다.
		</p>
		<div class="flex items-center gap-1">
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">Illustration</span>
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">Editorial Design</span>
		</div>
	</div>

	<div class="flex flex-col gap-4 mt-20">
		<img src="/images/foundations/04_popup1_works1.png" alt="" class="w-full aspect-1200/675" />
		<img src="/images/foundations/04_popup1_works2.png" alt="" class="w-full aspect-1200/675" />
		<img src="/images/foundations/04_popup1_works3.png" alt="" class="w-full aspect-1200/935" />
		<img src="/images/foundations/04_popup1_works4.png" alt="" class="w-full aspect-1200/585" />
		<img src="/images/foundations/04_popup1_works5.png" alt="" class="w-full aspect-1200/489" />
		<img src="/images/foundations/04_popup1_works6.png" alt="" class="w-full aspect-1200/3563" />
	</div>
</FullPopup>

<!-- 2. CJ Heroes -->
<FullPopup open={activePopup === '02'} onclose={() => activePopup = null}>
	{#snippet header()}
		<div class="w-16 h-16 rounded-full overflow-hidden flex-none bg-muted border border-border/50">
			<img src="/images/foundations/04_2_thumb.png" alt="" class="w-full h-full object-cover" />
		</div>
		<div class="flex flex-col">
			<h2 class="sys-text-md leading-tight">CJ Baseball Team BI</h2>
			<p class="sys-caption text-ts-n2 mt-0.5">프로야구 구단 후원을 위한 CI 제안</p>
		</div>
	{/snippet}

	<div class="flex flex-col gap-4">
		<h1 class="sys-text-lg">CJ Heroes - 구단 아이덴티티 제안</h1>
		<p class="sys-text-sm text-ts-n2 whitespace-pre-line mt-2">
			2015년 CJ의 히어로즈 구단 후원 비딩을 위해 바이널에서 진행한 CI 제안 프로젝트입니다.<br/>CJ가 새로운 스폰서로 참여하는 상황을 전제로, ‘CJ 히어로즈’의 시각적 아이덴티티를 디자인했습니다. CJ 브랜드와 히어로즈 구단의 <br/>정체성을 함께 담는 CI 방향을 제안했습니다.
		</p>
		<div class="flex items-center gap-1">
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">Symbol</span>
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">Emblem</span>
		</div>
	</div>

	<div class="flex flex-col items-center gap-4 mt-20">
		<img src="/images/foundations/04_popup2_works1.png" alt="" class="w-full aspect-1200/426" />
		<img src="/images/foundations/04_popup2_works2.png" alt="" class="w-full aspect-1200/426" />
		<img src="/images/foundations/04_popup2_works3.png" alt="" class="w-[600px] aspect-600/561 mt-16" />
		<img src="/images/foundations/04_popup2_works4.png" alt="" class="w-[988px] aspect-988/1280 mt-8 mb-10" />
	</div>
</FullPopup>

<!-- 3. MindSphere -->
<FullPopup open={activePopup === '03'} onclose={() => activePopup = null}>
	{#snippet header()}
		<div class="w-16 h-16 rounded-full overflow-hidden flex-none bg-muted border border-border/50">
			<img src="/images/foundations/04_3_thumb.png" alt="" class="w-full h-full object-cover" />
		</div>
		<div class="flex flex-col">
			<h2 class="sys-text-md leading-tight">MindSphere</h2>
			<p class="sys-caption text-ts-n2 mt-0.5">산업용 IoT 플랫폼 소개·체험 웹사이트</p>
		</div>
	{/snippet}

	<div class="flex flex-col gap-4">
		<h1 class="sys-text-lg">MindSphere - 브랜딩·웹 디자인</h1>
		<p class="sys-text-sm text-ts-n2 whitespace-pre-line mt-2">
			지멘스의 산업용 사물인터넷(IoT) 플랫폼 MindSphere를 소개하는 브랜딩·웹 디자인 프로젝트입니다.<br/>풍력발전·철도·스마트시티·양조장으로 구성된 미니어처 도시와 실시간 데이터를 통해, 개발자가 플랫폼의 활용 방식을 살펴볼 수 있는 웹사이트입니다. <br/>산업과 데이터의 연결을 표현한 키 비주얼을 비롯해 웹 UI, 대시보드와 아이콘 디자인에 참여했습니다.
		</p>
		<div class="flex items-center gap-1">
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">UI</span>
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">Iconography</span>
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">Campaign Graphic</span>
		</div>
	</div>

	<p class="sys-text-lg mt-20">MindSphere Web</p>
	<div class="flex items-start gap-2 mt-10">
		<img src="/images/foundations/04_popup3_works1.png" alt="" class="w-[596px] aspect-596/1948.5" />
		<img src="/images/foundations/04_popup3_works2.png" alt="" class="w-[596px] aspect-596/1991.5" />
	</div>
	<div class="flex items-start justify-between mt-20">
		<img src="/images/foundations/04_popup3_works3.png" alt="" class="w-[807px] aspect-807/522" />
		<img src="/images/foundations/04_popup3_works4.png" alt="" class="w-[370px] aspect-370/522" />
	</div>
	
	<div class="flex flex-col gap-10 mt-50">
		<img src="/images/foundations/04_popup3_works5.png" alt="" class="w-full aspect-1200/571" />
		<img src="/images/foundations/04_popup3_works6.png" alt="" class="w-full aspect-1200/571" />
	</div>
	<div class="flex flex-col items-center gap-2 mt-50">
		<img src="/images/foundations/04_popup3_works7.png" alt="" class="w-full aspect-1200/663" />
		<img src="/images/foundations/04_popup3_works8.png" alt="" class="w-[158px] aspect-158/192 flex-none" />
		<img src="/images/foundations/04_popup3_works9.png" alt="" class="w-full aspect-1200/853 mt-5" />
	</div>
	<p class="sys-text-lg mt-30">MindSphere Campaign</p>
	<div class="flex flex-col items-center gap-20 mt-10">
		<img src="/images/foundations/04_popup3_works10.png" alt="" class="w-[580px] aspect-580/581" />
		<img src="/images/foundations/04_popup3_works11.png" alt="" class="w-full aspect-1200/2746 flex-none" />
	</div>
</FullPopup>

<!-- 4. PNC MoBot -->
<FullPopup open={activePopup === '04'} onclose={() => activePopup = null}>
	{#snippet header()}
		<div class="w-16 h-16 rounded-full overflow-hidden flex-none bg-muted border border-border/50">
			<img src="/images/foundations/04_4_thumb.png" alt="" class="w-full h-full object-cover" />
		</div>
		<div class="flex flex-col">
			<h2 class="sys-text-md leading-tight">PNC MoBot</h2>
			<p class="sys-caption text-ts-n2 mt-0.5">메신저 기반 금융 교육 챗봇</p>
		</div>
	{/snippet}

	<div class="flex flex-col gap-4">
		<h1 class="sys-text-lg">MoBot - 캐릭터·그래픽 시스템 디자인</h1>
		<p class="sys-text-sm text-ts-n2 whitespace-pre-line mt-2">
			PNC 은행의 페이스북 메신저 기반 금융 교육 챗봇 MoBot을 위한 캐릭터·그래픽 시스템 디자인 프로젝트입니다.<br/>저축·예산 관리 등 금융 주제를 친근하게 전달하도록 폴리고날 그래픽 스타일을 정립했습니다.<br/>이를 바탕으로 챗봇 캐릭터와 대화 중 제공되는 카드·배지 등 그래픽 에셋을 디자인했습니다.
		</p>
		<div class="flex items-center gap-1">
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">UI</span>
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">BI</span>
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">Character Design</span>
		</div>
	</div>

	<div class="flex flex-col items-center gap-4 mt-20">
		<img src="/images/foundations/04_popup4_works1.png" alt="" class="w-[912px] aspect-912/423 mb-16" />
		<img src="/images/foundations/04_popup4_works2.png" alt="" class="w-full aspect-1200/642" />
		<img src="/images/foundations/04_popup4_works3.png" alt="" class="w-full aspect-1200/675" />
		<img src="/images/foundations/04_popup4_works4.png" alt="" class="w-full aspect-1200/409" />
		<img src="/images/foundations/04_popup4_works5.png" alt="" class="w-full aspect-1200/467" />
		<div class="flex justify-center gap-4">
			<img src="/images/foundations/04_popup4_works6.png" alt="" class="w-[360px] aspect-360/733" />
			<img src="/images/foundations/04_popup4_works7.png" alt="" class="w-[360px] aspect-360/733" />
			<img src="/images/foundations/04_popup4_works8.png" alt="" class="w-[360px] aspect-360/733" />
		</div>
	</div>
</FullPopup>

<!-- 5. Emotional Contagion -->
<FullPopup open={activePopup === '05'} onclose={() => activePopup = null}>
	{#snippet header()}
		<div class="w-16 h-16 rounded-full overflow-hidden flex-none bg-muted border border-border/50">
			<img src="/images/foundations/04_5_thumb.png" alt="" class="w-full h-full object-cover" />
		</div>
		<div class="flex flex-col">
			<h2 class="sys-text-md leading-tight">Emotional Contagion</h2>
			<p class="sys-caption text-ts-n2 mt-0.5">감정 전이 연구·인터랙티브 전시</p>
		</div>
	{/snippet}

	<div class="flex flex-col gap-4">
		<h1 class="sys-text-lg">Emotional Contagion</h1>
		<p class="sys-text-sm text-ts-n2 whitespace-pre-line mt-2">
			온라인에서 감정이 확산되는 현상에 착안해, 영상이 전달하는 정서와 관람자의 반응을 탐구한 석사 논문 프로젝트입니다.<br/>관람자가 영상을 보는 동안 표정 변화를 인식하고, 영상의 정서와 관람자의 반응을 두 원의 색상과 입자로 표현했습니다.<br/>두 영역의 입자가 섞이고 변화하는 모습을 통해 감정의 관계를 시각적으로 살펴보도록 구성했습니다.
		</p>
		<div class="flex items-center gap-1">
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">SVA MFA Computer Art</span>
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">Thesis Project</span>
			<span class="inline-flex items-center px-4 h-[26px] rounded-full sys-caption text-ts-n2 bg-attention">2014</span>
		</div>
	</div>

	<div class="flex flex-col items-center gap-4 mt-20">
		<img src="/images/foundations/04_popup5_works1.png" alt="" class="w-[632px] aspect-632/355 mb-8" />
		<div class="w-full aspect-1200/674 relative rounded-sm overflow-hidden group">
			<video
				bind:this={popup5VideoEl}
				bind:currentTime={popup5CurrentTime}
				bind:duration={popup5Duration}
				src="/images/foundations/04_popup5_works2_video.mp4"
				poster="/images/foundations/04_popup5_works2.png"
				preload="metadata"
				muted
				playsinline
				onplay={() => (isPopup5Playing = true)}
				onpause={() => (isPopup5Playing = false)}
				onended={handlePopup5Ended}
				onclick={togglePopup5Video}
				class="absolute inset-0 w-full h-full object-cover object-center cursor-pointer"
			>
				<track kind="captions" />
			</video>

			<button
				onclick={togglePopup5Video}
				class="w-20 h-20 absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 p-0 rounded-full! text-background hover:text-background cursor-pointer transition-opacity duration-300 {isPopup5Playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}"
				aria-label={isPopup5Playing ? '일시정지' : '재생'}
			>
				{#if isPopup5Playing}
					<CirclePause class="size-20 stroke-[0.5]!" />
				{:else}
					<CirclePlay class="size-20 stroke-[0.5]!" />
				{/if}
			</button>

			<!-- 하단 미니멀 Seek 바 -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				bind:this={popup5SeekBarEl}
				onpointerdown={handlePopup5SeekDown}
				onpointermove={handlePopup5SeekMove}
				onpointerup={handlePopup5SeekUp}
				onkeydown={(e) => {
					if (!popup5VideoEl || !popup5Duration) return;
					if (e.key === 'ArrowLeft') {
						e.preventDefault();
						popup5VideoEl.currentTime = Math.max(0, popup5CurrentTime - 5);
					} else if (e.key === 'ArrowRight') {
						e.preventDefault();
						popup5VideoEl.currentTime = Math.min(popup5Duration, popup5CurrentTime + 5);
					}
				}}
				onclick={(e) => e.stopPropagation()}
				class="absolute bottom-0 inset-x-0 h-7 flex items-center px-6 cursor-pointer z-20 group/seek select-none transition-opacity duration-300 {isPopup5Playing ? (isPopup5Seeking ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto') : 'opacity-0 pointer-events-none'}"
				role="slider"
				aria-label="재생 구간 탐색"
				aria-valuemin={0}
				aria-valuemax={popup5Duration}
				aria-valuenow={popup5CurrentTime}
				tabindex="0"
			>
				<div class="w-full h-0.5 group-hover/seek:h-1 bg-white/30 rounded-full relative transition-all">
					<div
						class="h-full bg-white rounded-full relative transition-none"
						style="width: {popup5Progress}%"
					></div>
					<div
						class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-4 bg-white rounded-full shadow-md transition-transform pointer-events-none {isPopup5Seeking ? 'scale-100' : 'scale-0 group-hover/seek:scale-100'}"
						style="left: {popup5Progress}%"
					></div>
				</div>
			</div>
		</div>
		<img src="/images/foundations/04_popup5_works3.png" alt="" class="w-full aspect-1200/376" />
		<img src="/images/foundations/04_popup5_works4.png" alt="" class="w-full aspect-1200/625" />
		<img src="/images/foundations/04_popup5_works5.png" alt="" class="w-full aspect-1200/539" />
		<img src="/images/foundations/04_popup5_works6.png" alt="" class="w-full aspect-1200/576" />
	</div>
</FullPopup>
