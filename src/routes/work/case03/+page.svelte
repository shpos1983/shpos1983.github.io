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
		{ id: "01", label: "01 OVERVIEW" },
		{ id: "02", label: "02 CONTEXT & GOAL" },
		{ id: "03", label: "03 PROBLEM & INSIGHT" },
		{ id: "04", label: "04 DESIGN STRATEGY" },
		{ id: "05", label: "05 EXPERIENCE DESIGN" },
		{ id: "06", label: "06 VALIDATION & EVOLUTION" },
		{ id: "07", label: "07 OUTCOME" }
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
		<p>매장 서비스는 같아야 하지만, 고객의 방문 상황은 모두 다르다.<br/>그렇다면 어디까지 표준화하고 어디까지 정비사의 판단에 맡겨야 할까?</p>
	</div>
</section>
<section bind:this={caseBodyEl} class="case-body mx-auto px-body-x pt-30 pb-15">
	<aside class="case-sidebar self-stretch flex-none">
		<div class="summary-wrapper">
			<ul class="case-summary list-none flex flex-col gap-4 w-full">
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="text-sm font-extrabold w-20">Project</div>
					<div class="text-sm text-primary flex-1">Smart Guide Platform Renewal</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="text-sm font-extrabold w-20">Duration</div>
					<div class="text-sm text-primary flex-1">8개월</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="text-sm font-extrabold w-20">Role</div>
					<div class="text-sm text-primary flex-1">UX Lead / Design</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="text-sm font-extrabold w-20">Team</div>
					<div class="text-sm text-primary flex-1 inline-flex flex-wrap gap-x-3">
						<span>PO <em class="not-italic">1</em></span>
						<span>Service Planner <em class="not-italic">1</em></span>
						<span>Designer <em class="not-italic">1</em></span>
						<span>Publisher <em class="not-italic">1</em></span>
						<span>Developer <em class="not-italic">3</em></span>
					</div>
				</li>
				<li class="flex items-start gap-4 text-muted-foreground">
					<div class="text-sm font-extrabold w-20">Goal</div>
					<div class="text-sm text-primary flex-1">입차부터 사후관리까지,<br/>전 매장에 표준 상담 플로우를 정착</div>
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
						<span class="text-sm">{section.label}</span>
					</button>
				{/each}
			</nav>
		</div>
	</aside>
	<div class="case-main flex-1 flex flex-col gap-30">
		<section class="case-section" id="01">
			<h2 class="text-lg text-accent-foreground">
				<em class="not-italic font-extrabold">01 OVERVIEW</em>
				/ 300개 매장의 상담 경험을 하나로
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">
					기록을 위한 디지털에서, 현장에서 이어지는 상담 플랫폼으로
				</h3>
				<h4 class="text-lg font-light">고정형 태블릿과 분절된 시스템을 멀티디바이스·실시간 연결 구조로 재설계해,<br/>입차부터 결제와 사후관리까지 하나의 표준 상담 경험으로 연결했습니다.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
		<section class="case-section" id="02">
			<h2 class="text-lg text-accent-foreground">
				<em class="not-italic font-extrabold">02 CONTEXT & GOAL</em>
				/ 어느 매장을 가도 같은 서비스를
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">
					One Standard Service, Every Store
				</h3>
				<h4 class="text-lg font-light">정비사의 판단은 살리고, 입차부터 사후관리까지 모든 매장이 따라야 할 상담 기준을 하나의 플랫폼에.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
		<section class="case-section" id="03">
			<h2 class="text-lg text-accent-foreground">
				<em class="not-italic font-extrabold">03 PROBLEM & INSIGHT</em>
				/ 표준은 문서만으로 현장에서 실행되지 않는다
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">
					One Standard Service, Every Store
				</h3>
				<h4 class="text-lg font-light">정비사의 판단은 살리고, 입차부터 사후관리까지 모든 매장이 따라야 할 상담 기준을 하나의 플랫폼에.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
		<section class="case-section" id="04">
			<h2 class="text-lg text-accent-foreground">
				<em class="not-italic font-extrabold">04 DESIGN STRATEGY</em>
				/ 현장을 화면과 데이터 흐름에 담다
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">
					One Standard Service, Every Store
				</h3>
				<h4 class="text-lg font-light">정비사의 판단은 살리고, 입차부터 사후관리까지 모든 매장이 따라야 할 상담 기준을 하나의 플랫폼에.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
		<section class="case-section" id="05">
			<h2 class="text-lg text-accent-foreground">
				<em class="not-italic font-extrabold">05 EXPERIENCE DESIGN</em>
				/ 입차부터 결제·사후관리까지 하나의 흐름
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">
					One Standard Service, Every Store
				</h3>
				<h4 class="text-lg font-light">정비사의 판단은 살리고, 입차부터 사후관리까지 모든 매장이 따라야 할 상담 기준을 하나의 플랫폼에.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
		<section class="case-section" id="06">
			<h2 class="text-lg text-accent-foreground">
				<em class="not-italic font-extrabold">06 VALIDATION & EVOLUTION</em>
				/ 주관적 설명을 AI 진단 근거로 확장
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">
					One Standard Service, Every Store
				</h3>
				<h4 class="text-lg font-light">정비사의 판단은 살리고, 입차부터 사후관리까지 모든 매장이 따라야 할 상담 기준을 하나의 플랫폼에.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
		<section class="case-section" id="07">
			<h2 class="text-lg text-accent-foreground">
				<em class="not-italic font-extrabold">07 OUTCOME</em>
				/ 도입 가능성과 매장별 정착 편차를 확인
			</h2>
			<div class="flex flex-col gap-6 mt-10">
				<h3 class="text-[40px] font-semibold leading-tight tracking-[-0.02em]">
					One Standard Service, Every Store
				</h3>
				<h4 class="text-lg font-light">정비사의 판단은 살리고, 입차부터 사후관리까지 모든 매장이 따라야 할 상담 기준을 하나의 플랫폼에.</h4>
			</div>
			{#each items as item (item)}
				test {item}<br/>
			{/each}
		</section>
	</div>
</section>
