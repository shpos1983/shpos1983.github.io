<script lang="ts">
	import { onMount } from "svelte";
	import { Separator } from "$lib/components/ui/separator/index.js";
	// import { Button } from "$lib/components/ui/button/index.js";

	const DEFAULT_HEADER_HEIGHT = 144;
	const DEFAULT_HERO_HEIGHT = 588;

	let scrollY = $state(0);
	let caseBodyEl = $state<HTMLElement | null>(null);
	let activeSectionId = $state("01");
	let isScrollingTo = false;
	let headerHeight = $state(DEFAULT_HEADER_HEIGHT);
	let heroHeight = $state(DEFAULT_HERO_HEIGHT);

	let maxScroll = $derived(heroHeight - headerHeight);

	const sections = [
		{ id: "01", label: "01. OVERVIEW" },
		{ id: "02", label: "02. CONTEXT & CHALLENGE" },
		{ id: "03", label: "03. REFRAME & DESIGN STRATEGY" },
		{ id: "04", label: "04. EXPERIENCE DESIGN" },
		{ id: "05", label: "05. VALIDATION & EVOLUTION" },
		{ id: "06", label: "06. OUTCOME" }
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

	const items = [...Array(100).keys()].map(i => i + 1);
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
					<div class="sys-caption text-primary flex-1">8개월</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Role</div>
					<div class="sys-caption text-primary flex-1">UX Lead / Design</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="sys-caption font-extrabold w-20">Team</div>
					<div class="sys-caption text-primary flex-1 inline-flex flex-wrap gap-x-3">
						<span>PO <em class="not-italic text-accent-blue-foreground">1</em></span>
						<span>Service Planner <em class="not-italic text-accent-blue-foreground">1</em></span>
						<span>Designer <em class="not-italic text-accent-blue-foreground">1</em></span>
						<span>Publisher <em class="not-italic text-accent-blue-foreground">1</em></span>
						<span>Developer <em class="not-italic text-accent-blue-foreground">3</em></span>
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
	<div class="case-main self-stretch flex-1 flex flex-col gap-50">
		<section class="case-section" id="01">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="not-italic font-extrabold">01. OVERVIEW</em>
				/ 320개 매장의 상담 경험을 하나로
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					ONE STANDARD SERVICE, EVERY STORE
				</h3>
				<h4 class="sys-text-sm">고정형 태블릿과 분절된 시스템을 멀티디바이스·실시간 연결 구조로 재설계해,<br/>입차부터 결제와 사후관리까지 하나의 표준 상담 경험으로 연결했습니다.</h4>
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
				<em class="not-italic font-extrabold">02. CONTEXT & CHALLENGE</em>
				/ 표준은 문서만으로 현장에서 실행되지 않는다
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					2019. 디지털 상담은 시작됐지만 현장에서 이어지지 못한 흐름
				</h3>
				<h4 class="sys-text-sm">2019년, 티스테이션은 입차부터 작업 완료까지 전 과정을 디지털 표준화하기 위해 SMART GUIDE를 런칭했습니다.<br/>하지만 고정형 태블릿과 부족한 상담 콘텐츠, 분리된 결제 시스템은 현장 업무를 여러 도구로 흩어놓았고, 가이드는 실시간 상담보다 사후 기록에 가까워졌습니다.</h4>
			</div>
			<div class="full-width mt-20">
				<img 
					src="/images/case03/02_infographic.png" 
					alt="" 
					class="block w-full h-auto" 
				/>
			</div>

			<div class="flex flex-col gap-10 mt-10">
				<p class="sys-text-lg">
					현장과 시스템 사이 발견된, 세 가지 간극
				</p>
				<ol class="ordered-list">
					<li class="sys-text-md">
						<p>시스템이 현장을 따라가지 못했다</p>
						<div class="flex items-start gap-2 sys-text-sm mt-2">
							<Separator orientation="vertical" class="bg-accent-foreground! w-1! self-stretch! h-auto!" />
							<p>고정 해상도를 전제로 구축되어, 매장에서 사용하는 디바이스가 다양해질수록 화면과 사용성이 무너졌습니다.</p>
						</div>
					</li>
					<li class="sys-text-md mt-10">
						<p>상담이 여러 도구와 시스템으로 끊겼다</p>
						<div class="flex items-start gap-2 sys-text-sm mt-2">
							<Separator orientation="vertical" class="bg-accent-foreground! w-1! self-stretch! h-auto!" />
							<p>Smart Guide만으로 상품을 충분히 설명하거나 결제를 진행할 수 없어, 상담 중 티스테이션닷컴과 POS를 반복해서 오가야 했습니다.</p>
						</div>
					</li>
					<li class="sys-text-md mt-10">
						<p>사용률과 실제 사용이 달랐다</p>
						<div class="flex items-start gap-2 sys-text-sm mt-2">
							<Separator orientation="vertical" class="bg-accent-foreground! w-1! self-stretch! h-auto!" />
							<p>현장 업무와 맞지 않는 사용성에도 사용률이 평가 지표로 관리되면서, 일부 매장에서는 낮에 처리한 업무를 영업 종료 후 일괄 입력하는 우회 행동이 발생했습니다.</p>
						</div>
					</li>
				</ol>
			</div>
			
		</section>
		<section class="case-section" id="03">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="not-italic font-extrabold">03. REFRAME & DESIGN STRATEGY</em>
				/ 표준화의 재정의
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					사용률을 높이는 것이 아니라, 실제 업무 안에서 사용되게 할 것.
				</h3>
				<h4 class="sys-text-sm">어떻게 하면 정비사의 전문적인 판단과 다양한 현장 상황을 유지하면서도,<br/>모든 매장에서 동일한 상담 기준과 정보가 실시간으로 이어지게 할 수 있을까?</h4>
			</div>
			<div class="flex flex-col gap-3 mt-10 py-5 px-6 bg-attention rounded-sm">
				<p class="sys-text-lg">새롭게 정의한 표준화. Standardization ≠ Same Screen</p>
				<p class="sys-text-sm">표준화는 모든 직원이 같은 화면을 보는 것이 아니라, 같은 고객 정보와 업무 맥락, 상담 근거가 끊기지 않고 이어지는 것</p>
			</div>
			<div class="flex flex-col gap-6 mt-15">
				<h3 class="sys-title-sm leading-tight tracking-[-0.02em]">
					세 가지 단절을, 3개의 연결 원칙으로
				</h3>
			</div>

			

			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
		<section class="case-section" id="04">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="not-italic font-extrabold">04. EXPERIENCE DESIGN</em>
				/ 입차부터 결제·사후관리까지 하나의 흐름
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					ONE STANDARD SERVICE, EVERY STORE
				</h3>
				<h4 class="sys-text-sm">정비사의 판단은 살리고, 입차부터 사후관리까지 모든 매장이 따라야 할 상담 기준을 하나의 플랫폼에.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
		<section class="case-section" id="05">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="not-italic font-extrabold">05. VALIDATION & EVOLUTION</em>
				/ 주관적 설명을 AI 진단 근거로 확장
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					ONE STANDARD SERVICE, EVERY STORE
				</h3>
				<h4 class="sys-text-sm">정비사의 판단은 살리고, 입차부터 사후관리까지 모든 매장이 따라야 할 상담 기준을 하나의 플랫폼에.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
		<section class="case-section" id="06">
			<h2 class="sys-text-sm text-accent-foreground">
				<em class="not-italic font-extrabold">06. OUTCOME</em>
				/ 도입 가능성과 매장별 정착 편차를 확인
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="sys-title-md leading-tight tracking-[-0.02em]">
					ONE STANDARD SERVICE, EVERY STORE
				</h3>
				<h4 class="sys-text-sm">정비사의 판단은 살리고, 입차부터 사후관리까지 모든 매장이 따라야 할 상담 기준을 하나의 플랫폼에.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
	</div>
</section>
