// 스크롤 관련 상수 정의
export const SCALE_MIN = 0.7;
export const SCALE_MAX = 1;
export const SCALE_DIVISOR = 300;
export const OPACITY_DIVISOR = 100;
export const SCALE_OFFSET = 0;

/**
 * 스크롤에 따른 헤더 스케일 및 투명도 계산
 */
export const calculateHeaderScale = (scrollY: number): number => {
  return Math.max(SCALE_MIN, Math.round((SCALE_MAX - (scrollY - SCALE_OFFSET) / SCALE_DIVISOR) * 1000) / 1000);
};

export const calculateHeaderOpacity = (scrollY: number): number => {
  return Math.max(0, Math.round((SCALE_MAX - (scrollY - SCALE_OFFSET) / OPACITY_DIVISOR) * 1000) / 1000);
};

/**
 * 스크롤 이벤트 핸들러 설정
 */
export const setupScrollHandler = (setScrollY: (scrollY: number) => void): (() => void) => {
  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  return () => window.removeEventListener('scroll', handleScroll);
};
