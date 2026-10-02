export interface MarqueeOptions {
	animationSpeed?: number;
	animationDirection?: 'left' | 'right' | 'up' | 'down';
	dragSensitivity?: number;
	on?: {
		init?: () => void;
		dragStart?: () => void;
		dragEnd?: () => void;
	};
}

/**
 * Svelte Action: use:marquee
 * 순수 RAF 기반 연속 무한 마퀴 & 자연스러운 드래그
 */
export function marquee(node: HTMLElement, options: MarqueeOptions = {}) {
	let {
		animationSpeed = 1,
		animationDirection = 'left',
		dragSensitivity = 1,
		on = {}
	} = options;

	const axis = ['left', 'right'].includes(animationDirection) ? 'x' : 'y';
	const transformProp = axis === 'x' ? 'translateX' : 'translateY';

	// wrapper 찾기 또는 지정
	let wrapper = (node.querySelector('.marquee-wrapper') as HTMLElement) || (node.firstElementChild as HTMLElement);
	if (!wrapper) {
		const newWrapper = document.createElement('div');
		newWrapper.className = 'marquee-wrapper';
		while (node.firstChild) {
			newWrapper.appendChild(node.firstChild);
		}
		node.appendChild(newWrapper);
		wrapper = newWrapper;
	}

	let currentTransform = 0;
	let animationFrameId: number | null = null;
	let lastTimestamp: number | null = null;
	let isDragging = false;
	let dragMoved = false;
	let startX = 0;
	let dragStartPos = 0;

	// 브라우저 기본 이미지/링크 드래그 방지
	const disableNativeDrag = () => {
		wrapper.querySelectorAll('img, a').forEach((el) => {
			el.setAttribute('draggable', 'false');
			(el as HTMLElement).style.userSelect = 'none';
			(el as HTMLElement).style.webkitUserSelect = 'none';
		});
		wrapper.querySelectorAll('img').forEach((img) => {
			(img as HTMLElement).style.pointerEvents = 'none';
		});
	};

	// 1. cloneMarquee (원본 앞/뒤로 3세트 복제)
	const cloneMarquee = () => {
		const content = wrapper.innerHTML;
		wrapper.innerHTML = content + content + content;
		disableNativeDrag();

		const size = getSize();
		currentTransform = -size;
		wrapper.style.transform = `${transformProp}(${currentTransform}px)`;
	};

	const getSize = () => {
		return axis === 'x' ? wrapper.scrollWidth / 3 : wrapper.scrollHeight / 3;
	};

	const normalizeTransform = () => {
		const size = getSize();
		if (size <= 0) return;

		if (currentTransform > 0) {
			currentTransform = -size + (currentTransform % size);
		} else if (Math.abs(currentTransform) >= size * 2) {
			currentTransform = -size + (Math.abs(currentTransform) % size);
		}
	};

	const getCurrentTransformFromStyle = () => {
		const transform = getComputedStyle(wrapper).transform;
		if (transform === 'none') return currentTransform;

		const matrix = transform.split(',');
		return axis === 'x' ? parseFloat(matrix[4]) : parseFloat(matrix[5]);
	};

	// 2. startMarqueeAnimation
	const animate = (timestamp: number) => {
		if (!lastTimestamp) lastTimestamp = timestamp;
		const delta = timestamp - lastTimestamp;
		lastTimestamp = timestamp;

		if (!isDragging) {
			const speed = (delta / 16.67) * animationSpeed;
			const directionMultiplier = ['left', 'up'].includes(animationDirection) ? -1 : 1;
			currentTransform += directionMultiplier * speed;

			const size = getSize();
			if (['right', 'down'].includes(animationDirection) && currentTransform >= 0) {
				currentTransform = -size;
			} else if (['left', 'up'].includes(animationDirection) && Math.abs(currentTransform) >= size * 2) {
				currentTransform = -size + (Math.abs(currentTransform) % size);
			}

			wrapper.style.transform = `${transformProp}(${currentTransform}px)`;
		}

		animationFrameId = requestAnimationFrame(animate);
	};

	const startMarqueeAnimation = () => {
		if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
		lastTimestamp = null;
		animationFrameId = requestAnimationFrame(animate);
	};

	const stopMarqueeAnimation = () => {
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
			animationFrameId = null;
		}
		lastTimestamp = null;
	};

	// 3. Event Handlers
	const onMouseDown = (e: MouseEvent) => {
		// 기본 브라우저 드래그(금지 아이콘) 원천 차단
		e.preventDefault();
		isDragging = true;
		dragMoved = false;
		startX = axis === 'x' ? e.clientX : e.clientY;
		dragStartPos = startX;
		node.classList.add('active');
		node.style.cursor = 'grabbing';

		currentTransform = getCurrentTransformFromStyle();
		stopMarqueeAnimation();
		on.dragStart?.();
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!isDragging) return;
		e.preventDefault();
		const client = axis === 'x' ? e.clientX : e.clientY;
		if (Math.abs(client - dragStartPos) > 4) {
			dragMoved = true;
		}
		const delta = (client - startX) * dragSensitivity;
		currentTransform += delta;
		normalizeTransform();
		wrapper.style.transform = `${transformProp}(${currentTransform}px)`;
		startX = client;
	};

	const onMouseUp = () => {
		if (isDragging) {
			isDragging = false;
			node.classList.remove('active');
			node.style.cursor = 'grab';
			startMarqueeAnimation();
			on.dragEnd?.();
		}
	};

	const onTouchStart = (e: TouchEvent) => {
		if (e.touches.length === 0) return;
		isDragging = true;
		dragMoved = false;
		startX = axis === 'x' ? e.touches[0].clientX : e.touches[0].clientY;
		dragStartPos = startX;
		node.classList.add('active');
		node.style.cursor = 'grabbing';

		currentTransform = getCurrentTransformFromStyle();
		stopMarqueeAnimation();
		on.dragStart?.();
	};

	const onTouchMove = (e: TouchEvent) => {
		if (!isDragging || e.touches.length === 0) return;
		const client = axis === 'x' ? e.touches[0].clientX : e.touches[0].clientY;
		if (Math.abs(client - dragStartPos) > 4) {
			dragMoved = true;
		}
		const delta = (client - startX) * dragSensitivity;
		currentTransform += delta;
		normalizeTransform();
		wrapper.style.transform = `${transformProp}(${currentTransform}px)`;
		startX = client;
	};

	const onTouchEnd = () => {
		if (isDragging) {
			isDragging = false;
			node.classList.remove('active');
			node.style.cursor = 'grab';
			startMarqueeAnimation();
			on.dragEnd?.();
		}
	};

	// 드래그 후 놓았을 때 의도치 않게 링크가 열리는 것을 방지
	const onClickCapture = (e: MouseEvent) => {
		if (dragMoved) {
			e.preventDefault();
			e.stopPropagation();
			dragMoved = false;
		}
	};

	// 초기 설정 및 리스너 등록
	node.style.cursor = 'grab';
	node.style.userSelect = 'none';

	cloneMarquee();
	startMarqueeAnimation();

	node.addEventListener('mousedown', onMouseDown);
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mouseup', onMouseUp);

	node.addEventListener('touchstart', onTouchStart, { passive: true });
	window.addEventListener('touchmove', onTouchMove, { passive: true });
	window.addEventListener('touchend', onTouchEnd);

	node.addEventListener('click', onClickCapture, true);

	on.init?.();

	return {
		update(newOptions: MarqueeOptions) {
			animationSpeed = newOptions.animationSpeed ?? animationSpeed;
			animationDirection = newOptions.animationDirection ?? animationDirection;
			dragSensitivity = newOptions.dragSensitivity ?? dragSensitivity;
			on = newOptions.on ?? on;
		},
		destroy() {
			stopMarqueeAnimation();
			node.removeEventListener('mousedown', onMouseDown);
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mouseup', onMouseUp);
			node.removeEventListener('touchstart', onTouchStart);
			window.removeEventListener('touchmove', onTouchMove);
			window.removeEventListener('touchend', onTouchEnd);
			node.removeEventListener('click', onClickCapture, true);
		}
	};
}
