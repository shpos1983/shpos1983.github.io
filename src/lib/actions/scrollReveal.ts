/**
 * ============================================================================
 * Scroll Reveal Animation (스크롤 등장 애니메이션)
 * ============================================================================
 * 
 * 애니메이션을 적용하고 싶은 엘리먼트에 data-reveal 속성만 추가하면 됩니다.
 * 
 * 사용법:
 * - data-reveal="0" : 딜레이 없이 즉시 등장 (0ms)
 * - data-reveal="0.5" : 기본 딜레이 0.5배 후 등장 (0.5 * staggerDelay = 200ms)
 * - data-reveal="1" : 기본 딜레이 1배 후 등장 (1 * staggerDelay = 400ms)
 * - data-reveal="2" : 기본 딜레이 2배 후 등장 (2 * staggerDelay = 800ms)
 * 
 * 예시:
 * ```html
 * <div use:scrollReveal class="case-main">
 *   <h2 data-reveal="0">제목</h2>
 *   <div class="flex gap-4">
 *     <div data-reveal="0">카드 1 (딜레이 0ms)</div>
 *     <div data-reveal="1">카드 2 (딜레이 400ms)</div>
 *     <div data-reveal="2">카드 3 (딜레이 800ms)</div>
 *   </div>
 * </div>
 * ```
 */

export interface ScrollRevealConfig {
	/**
	 * [상수] 화면 상단 기준 등장 트리거 지점 (비율)
	 * 0.8 = 뷰포트 높이의 80% 지점을 통과할 때 애니메이션 실행
	 * (기본값: 0.8)
	 */
	triggerRatio: number;

	/**
	 * [상수] 등장 전 Y축 시작 위치 (픽셀)
	 * 100 = 아래에서 위로 100px 이동하며 등장 (translateY: 100px -> 0)
	 * (기본값: 100)
	 */
	translateY: number;

	/**
	 * [상수] 등장 전 초기 투명도 (opacity: 0 -> 1)
	 * (기본값: 0)
	 */
	initialOpacity: number;

	/**
	 * [상수] data-reveal="N" 의 N에 곱해질 딜레이 타임 (ms)
	 * data-reveal="0" -> 0ms
	 * data-reveal="0.5" -> 200ms
	 * data-reveal="1" -> 400ms
	 * data-reveal="2" -> 800ms
	 * (기본값: 400ms)
	 */
	staggerDelay: number;

	/**
	 * [상수] 애니메이션 전환 지속 시간 (ms)
	 * (기본값: 800ms)
	 */
	duration: number;

	/**
	 * [상수] 애니메이션 이징 함수
	 * (기본값: 'ease')
	 */
	easing: string;

	/**
	 * [상수] 1회성 등장 여부
	 * true: 한 번 등장하면 영구 유지 (권장)
	 * false: 뷰포트를 벗어나면 초기화 후 재등장
	 * (기본값: true)
	 */
	once: boolean;
}

/**
 * 기본 스크롤 등장 애니메이션 상수 정의
 */
export const DEFAULT_SCROLL_REVEAL_CONFIG: ScrollRevealConfig = {
	triggerRatio: 0.8,      // 화면의 80% 지점 통과 시
	translateY: 100,        // translateY: 100px -> 0
	initialOpacity: 0,      // opacity: 0 -> 1
	staggerDelay: 400,      // 딜레이 타임 (ms)
	duration: 800,          // 전환 지속 시간 (ms)
	easing: 'ease',         // 이징 곡선
	once: true              // 1회 등장
};

interface RevealItem {
	el: HTMLElement;
	delay: number;
	isRevealed: boolean;
}

/**
 * Svelte Action: scrollReveal
 * `case-main` 또는 상위 컨테이너에 부착하여 내부의 `[data-reveal]` 엘리먼트들을 감지하고
 * 화면 80% 지점 통과 시 순차적으로 등장 애니메이션을 실행합니다.
 */
export function scrollReveal(node: HTMLElement, customOptions?: Partial<ScrollRevealConfig>) {
	let config: ScrollRevealConfig = { ...DEFAULT_SCROLL_REVEAL_CONFIG, ...customOptions };
	let items: RevealItem[] = [];
	let observer: IntersectionObserver | null = null;
	let mutationObserver: MutationObserver | null = null;

	const parseElements = () => {
		items = [];

		// node 자체 및 하위의 모든 [data-reveal] 엘리먼트 수집
		const elements: HTMLElement[] = [];
		if (node.hasAttribute('data-reveal')) {
			elements.push(node);
		}
		elements.push(...Array.from(node.querySelectorAll<HTMLElement>('[data-reveal]')));

		elements.forEach((el) => {
			const attrValue = el.getAttribute('data-reveal')?.trim() ?? '0';
			const multiplier = !isNaN(Number(attrValue)) && attrValue !== '' ? Number(attrValue) : 0;
			const delay = Math.max(0, multiplier * config.staggerDelay);

			el.style.setProperty('--reveal-offset-y', `${config.translateY}px`);
			el.style.setProperty('--reveal-initial-opacity', `${config.initialOpacity}`);
			el.style.setProperty('--reveal-duration', `${config.duration}ms`);
			el.style.setProperty('--reveal-easing', config.easing);
			el.style.setProperty('--reveal-delay', `${delay}ms`);

			items.push({
				el,
				delay,
				isRevealed: el.classList.contains('is-revealed')
			});
		});
	};

	const revealItem = (item: RevealItem, immediate = false) => {
		if (item.isRevealed) return;
		item.isRevealed = true;

		if (immediate) {
			// 이미 뷰포트 위로 지나간 요소는 전환 효과 없이 즉시 완료 상태로 설정
			item.el.style.transition = 'none';
			item.el.classList.add('is-revealed');
			void item.el.offsetHeight; // 리플로우 강제
			item.el.style.transition = '';
		} else {
			item.el.classList.add('is-revealed');
		}

		if (config.once && observer) {
			observer.unobserve(item.el);
		}
	};

	const hideItem = (item: RevealItem) => {
		if (!item.isRevealed) return;
		item.isRevealed = false;
		item.el.classList.remove('is-revealed');
	};

	const checkInitialPositions = () => {
		if (typeof window === 'undefined') return;
		const triggerLine = window.innerHeight * config.triggerRatio;

		items.forEach((item) => {
			if (item.isRevealed) return;
			const rect = item.el.getBoundingClientRect();
			// 화면 80% 트리거 라인보다 위에 있는 모든 엘리먼트 (현재 뷰포트 내 + 이미 위로 지나친 요소들)
			if (rect.top <= triggerLine) {
				const isAboveViewport = rect.bottom < 0;
				revealItem(item, isAboveViewport);
			}
		});
	};

	const initObserver = () => {
		if (observer) observer.disconnect();

		// 화면 상단 기준 80% 지점에 도달할 때 트리거
		const bottomMarginPercent = Math.round((1 - config.triggerRatio) * 100);

		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const item = items.find((i) => i.el === entry.target);
					if (!item) return;

					const rect = entry.boundingClientRect;
					const triggerLine = window.innerHeight * config.triggerRatio;

					if (entry.isIntersecting || rect.top <= triggerLine) {
						const isAboveViewport = rect.bottom < 0;
						revealItem(item, isAboveViewport);
					} else if (!config.once && rect.top > triggerLine) {
						hideItem(item);
					}
				});
			},
			{
				root: null,
				rootMargin: `0px 0px -${bottomMarginPercent}% 0px`,
				threshold: 0
			}
		);

		items.forEach((item) => {
			if (!item.isRevealed || !config.once) {
				observer?.observe(item.el);
			}
		});

		checkInitialPositions();
	};

	const handleResize = () => {
		initObserver();
	};

	const handleScroll = () => {
		checkInitialPositions();
	};

	// DOM 변경 시 자동 갱신
	mutationObserver = new MutationObserver(() => {
		parseElements();
		initObserver();
	});

	mutationObserver.observe(node, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ['data-reveal']
	});

	parseElements();
	initObserver();

	// 브라우저 스크롤 복원(새로고침 / 뒤로가기) 대응: 다단계 즉시 체크
	const rafId = requestAnimationFrame(() => {
		parseElements();
		initObserver();
	});

	const timer1 = setTimeout(checkInitialPositions, 50);
	const timer2 = setTimeout(checkInitialPositions, 200);

	window.addEventListener('resize', handleResize, { passive: true });
	window.addEventListener('scroll', handleScroll, { passive: true });
	window.addEventListener('pageshow', checkInitialPositions, { passive: true });

	return {
		update(newOptions?: Partial<ScrollRevealConfig>) {
			config = { ...DEFAULT_SCROLL_REVEAL_CONFIG, ...newOptions };
			parseElements();
			initObserver();
		},
		destroy() {
			cancelAnimationFrame(rafId);
			clearTimeout(timer1);
			clearTimeout(timer2);
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('pageshow', checkInitialPositions);
			if (mutationObserver) {
				mutationObserver.disconnect();
				mutationObserver = null;
			}
			if (observer) {
				observer.disconnect();
				observer = null;
			}
		}
	};
}
