/**
 * scrollToId — anchor navigation that bridges to the app's single Lenis
 * instance (exposed on window.__tapin_lenis by SmoothScroll). Falls back to
 * native smooth scroll when Lenis is absent (touch / reduced motion).
 */
type LenisLike = {
  scrollTo: (target: HTMLElement, options?: { offset?: number; duration?: number }) => void;
};

export function scrollToId(id: string, offset = -32): void {
  if (typeof window === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = (window as unknown as { __tapin_lenis?: LenisLike }).__tapin_lenis;
  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.scrollTo(el, { offset, duration: 1.3 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
