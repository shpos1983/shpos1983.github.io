<script lang="ts">
	// import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { resolve } from "$app/paths";
	import { marquee } from "$lib/actions/marquee.js";
</script>

<svelte:head>
	<title>Work | SENSE & STRATEGY</title>
</svelte:head>

<section class="container max-w-full mx-auto pl-14 pt-22 pb-12">
	<div class="mb-27">
		<h1 class="sys-text-sm text-accent-foreground font-extrabold tracking-tight">WHO I AM</h1>
		<div class="flex flex-col gap-8 mt-8">
			<h2 class="sys-title-lg tracking-[-0.02em]">
				복잡한 정보와 경험은 명료하게.<br/>고객이 상품을 쉽게 이해하고, 선택의 순간에 확신을 가질 수 있도록.<br/>디자인하는 이상훈입니다.
			</h2>
			<h3 class="sys-text-md font-light">I bring teams, user needs, and business goals together to build products people value.<br/>I turn complex problems into simple experiences.</h3>
		</div>
	</div>
	<div class="mb-44">
		<h1 class="sys-text-sm text-accent-foreground font-extrabold tracking-tight mb-8">CASE STUDIES</h1>
		<div class="flex flex-col gap-14">
			<!-- case01 -->
			<div class="bg-card flex justify-start gap-20">
				<div class="w-[680px] self-stretch flex-none flex flex-col justify-between gap-10">
					<div class="flex flex-col gap-4">
						<h2 class="sys-title-sm leading-tight tracking-[-0.02em]"><a href={resolve('/work/case01')} class="case-title-link">T’Station.com UX Renewal & growth</a></h2>
						<h3 class="sys-text-sm text-ts-n1">대부분의 타이어를 잘 모르는 고객을 위해<br/>그 간극을 이해하고, 데이터로 검증하며 더 나은 구매 경험을 만들어간 과정.</h3>
					</div>
					<ul class="list-none flex flex-col gap-4 w-full">
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Focus</div>
							<div class="sys-caption flex-1">B2C 커머스 · 구매 여정 개선</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Impact</div>
							<div class="sys-caption flex-1"><em class="font-bold text-primary">B2C 판매량 약 2.6배 · 구매전환율 약 2배</em></div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Role</div>
							<div class="sys-caption flex-1">UX/UI Lead · UX 기획 · UI 디자인 · QA</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Period</div>
							<div class="sys-caption flex-1">2021 - 2025</div>
						</li>
					</ul>
				</div>
				<a href={resolve('/work/case01')} class="group/item block self-stretch aspect-640/380 w-[640px] bg-attention rounded-lg overflow-hidden">
					<img src="/images/case01/thumb.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
				</a>
			</div>

			<Separator class="mb-4" />

			<!-- case02 -->
			<div class="bg-card flex justify-start gap-20">
				<div class="w-[680px] self-stretch flex-none flex flex-col justify-between gap-10">
					<div class="flex flex-col gap-4">
						<h2 class="sys-title-sm leading-tight tracking-[-0.02em]"><a href={resolve('/work/case02')} class="case-title-link">T’Station.com AI Commerce Launch</a></h2>
						<h3 class="sys-text-sm text-ts-n1">더 이상 타이어 쇼핑이 막막하지 않게.<br/>고객이 확신을 가지고 구매할 수 있도록 AI 경험을 설계한 과정</h3>
					</div>
					<ul class="list-none flex flex-col gap-4 w-full">
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Focus</div>
							<div class="sys-caption flex-1">AI 커머스 · 대화형 구매 경험</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Impact</div>
							<div class="sys-caption flex-1"><em class="font-bold text-primary">출시 6주간 3,242명 이용 · 전체 주문 중 T’Bot 사용 주문 13.1%</em></div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Role</div>
							<div class="sys-caption flex-1">UX Lead · 서비스 기획 · 대화·선택 UI 설계 · QA</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Period</div>
							<div class="sys-caption flex-1">2026.01 - 2026.07</div>
						</li>
					</ul>
				</div>
				<a href={resolve('/work/case02')} class="group/item block self-stretch aspect-640/380 w-[640px] bg-attention rounded-lg overflow-hidden">
					<img src="/images/case02/thumb.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
				</a>
			</div>

			<Separator class="mb-4" />

			<!-- case03 -->
			<div class="bg-card flex justify-start gap-20">
				<div class="w-[680px] self-stretch flex-none flex flex-col justify-between gap-10">
					<div class="flex flex-col gap-4">
						<h2 class="sys-title-sm leading-tight tracking-[-0.02em]"><a href={resolve('/work/case03')} class="case-title-link">T’Station Smart Guide</a></h2>
						<h3 class="sys-text-sm text-ts-n1">좋은 상담은 무엇에서 시작되는지 고민하고, 매장의 실제 업무 흐름 속에서<br/>더 나은 서비스 경험을 만들어온 과정</h3>
					</div>
					<ul class="list-none flex flex-col gap-4 w-full">
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Focus</div>
							<div class="sys-caption flex-1">B2B 매장 업무·상담 플랫폼 구축</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Impact</div>
							<div class="sys-caption flex-1"><em class="font-bold text-primary">AI 마모도 분석 파일럿 · 상담과정의 재구성</em></div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Role</div>
							<div class="sys-caption flex-1">UX Lead · 업무 흐름 설계 · 기기별 UI 디자인</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Period</div>
							<div class="sys-caption flex-1">2025.10 - 2026.05</div>
						</li>
					</ul>
				</div>
				<a href={resolve('/work/case03')} class="group/item block self-stretch aspect-640/380 w-[640px] bg-attention rounded-lg overflow-hidden">
					<img src="/images/case03/thumb.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
				</a>
			</div>

			<Separator />
		</div>
	</div>
	<div class="mb-15">
		<h1 class="sys-text-sm text-accent-foreground font-extrabold tracking-tight mb-8">FOUNDATIONS</h1>
		<div class="flex flex-col gap-4">
			<h2 class="sys-title-sm leading-tight tracking-[-0.02em]"><a href={resolve('/work/foundations')} class="case-title-link">Brand, Interface & Interaction Design</a></h2>
			<h3 class="sys-text-sm text-ts-n1">브랜드의 시각 언어를 웹·앱·캠페인으로 확장하고, 정보를 화면과 인터랙션으로 구체화한 작업입니다.<br/>다양한 산업과 매체에서 쌓아온 시각·인터랙션 디자인의 기반을 담았습니다.</h3>
		</div>
		<div class="-ml-body-x mt-14 overflow-hidden" use:marquee={{ animationSpeed: 1.6, animationDirection: 'left', dragSensitivity: 1.2 }}>
			<div class="marquee-wrapper flex w-fit select-none">
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="01"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}" class="group/item block aspect-520/380 h-auto w-full bg-attention rounded-none overflow-hidden">
						<img src="/images/foundations/thumb1.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="02"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#02" class="group/item block aspect-520/380 h-auto w-full bg-attention rounded-none overflow-hidden">
						<img src="/images/foundations/thumb2.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="03"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#03" class="group/item block aspect-520/380 h-auto w-full bg-attention rounded-none overflow-hidden">
						<img src="/images/foundations/thumb3.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="04"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#04" class="group/item block aspect-520/380 h-auto w-full bg-attention rounded-none overflow-hidden">
						<img src="/images/foundations/thumb4.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="04"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#04" class="group/item block aspect-520/380 h-auto w-full bg-attention rounded-none overflow-hidden">
						<img src="/images/foundations/thumb5.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="04"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#04" class="group/item block aspect-520/380 h-auto w-full bg-attention rounded-none overflow-hidden">
						<img src="/images/foundations/thumb6.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="04"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#04" class="group/item block aspect-520/380 h-auto w-full bg-attention rounded-none overflow-hidden">
						<img src="/images/foundations/thumb7.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
