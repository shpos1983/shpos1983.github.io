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
						<h3 class="sys-text-sm text-ts-n1">타이어는 중요하지만, 대부분의 고객은 타이어를 잘 모른다.<br/>그 간극을 이해하고, 데이터로 검증하며 더 나은 구매 경험을 만들어간 과정.</h3>
					</div>
					<ul class="list-none flex flex-col gap-4 w-full">
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Focus</div>
							<div class="sys-caption flex-1">B2C 플랫폼, UX</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Impact</div>
							<div class="sys-caption flex-1"><em class="font-bold text-primary">208% 판매성장, 2배의 구매전환율 성장</em></div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Role</div>
							<div class="sys-caption flex-1"><em class="text-primary">UX Lead</em> / PO / UI / QA</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Period</div>
							<div class="sys-caption flex-1">‘21 - ‘25</div>
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
							<div class="sys-caption flex-1">AI, UX</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Impact</div>
							<div class="sys-caption flex-1"><em class="font-bold text-primary">고객센터 FAQ 40% 감소, 30% 구매전환 증가</em></div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Role</div>
							<div class="sys-caption flex-1"><em class="text-primary">UX Lead</em> / PO / UI / QA</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Period</div>
							<div class="sys-caption flex-1">‘26. JANuary - JULy</div>
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
							<div class="sys-caption flex-1">B2B 고객 상담 플랫폼, UX</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Impact</div>
							<div class="sys-caption flex-1"><em class="font-bold text-primary">AI, 상담 패러다임의 변화</em></div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Role</div>
							<div class="sys-caption flex-1"><em class="text-primary">UX Lead</em> / PO / UI / QA</div>
						</li>
						<li class="flex items-start gap-4 text-primary">
							<div class="sys-caption font-extrabold text-ts-n3 w-12">Period</div>
							<div class="sys-caption flex-1">‘25 October - ‘26. May</div>
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
			<h2 class="sys-title-sm leading-tight tracking-[-0.02em]">COMPLEX EXPERIENCES, MADE SIMPLE</h2>
			<h3 class="sys-text-sm text-ts-n1">사람들은 제품(Product)보다 먼저 브랜드를 경험한다.<br/>다양한 산업의 복잡한 정보를 쉽고 직관적인 경험으로 바꾸며 다져온 디자인의 출발점.</h3>
		</div>
		<div class="-ml-body-x mt-14 overflow-hidden" use:marquee={{ animationSpeed: 1.6, animationDirection: 'left', dragSensitivity: 1.2 }}>
			<div class="marquee-wrapper flex w-fit select-none">
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="01"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#01" class="group/item block aspect-520/380 h-auto w-full bg-border rounded-none overflow-hidden">
						<img src="/images/foundations/thumb1.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="02"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#02" class="group/item block aspect-520/380 h-auto w-full bg-border rounded-none overflow-hidden">
						<img src="/images/foundations/thumb2.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="03"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#03" class="group/item block aspect-520/380 h-auto w-full bg-border rounded-none overflow-hidden">
						<img src="/images/foundations/thumb3.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="04"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#04" class="group/item block aspect-520/380 h-auto w-full bg-border rounded-none overflow-hidden">
						<img src="/images/foundations/thumb4.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="04"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#04" class="group/item block aspect-520/380 h-auto w-full bg-border rounded-none overflow-hidden">
						<img src="/images/foundations/thumb5.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="04"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#04" class="group/item block aspect-520/380 h-auto w-full bg-border rounded-none overflow-hidden">
						<img src="/images/foundations/thumb6.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
				<div class="w-[520px] min-w-65 flex-none">
					<!-- foundations페이지 이동 후 섹션 id="04"로 스크롤포지셔닝 -->
					<a href="{resolve('/work/foundations')}#04" class="group/item block aspect-520/380 h-auto w-full bg-border rounded-none overflow-hidden">
						<img src="/images/foundations/thumb7.png" alt="" class="object-cover object-center w-full h-full group-hover/item:scale-104 transition-all duration-500"/>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
