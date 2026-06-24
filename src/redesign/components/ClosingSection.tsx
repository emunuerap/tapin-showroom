import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ClosingSection — an immersive pine footer that the page resolves into. The
 * headline LETTERS emerge from below a mask as the section scrolls up, echoing
 * the gallery's "green" energy. Scroll-linked (scrub), so it reverses cleanly.
 */
export function ClosingSection() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const el = ref.current;
        if (!el) return;
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 28%', scrub: 1 } })
          .from('.rd-close__rise', { yPercent: 125, duration: 1, stagger: 0.1, ease: 'power3.out' });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section id="contact" ref={ref} className="rd-section rd-close">
      <div className="rd-close__grain" aria-hidden="true" />
      <div className="rd-container rd-close__inner">
        <span className="rd-close__kicker">
          <span className="rd-close__rise">Ready when you are</span>
        </span>

        <h2 className="rd-display rd-close__title">
          <span className="rd-close__line">
            <span className="rd-close__rise">Don&rsquo;t call.</span>
          </span>
          <span className="rd-close__line">
            <span className="rd-close__rise">
              Just <span className="rd-close__mark">TapIn</span>.
            </span>
          </span>
        </h2>

        <p className="rd-close__sub">
          <span className="rd-close__rise">
            The invisible OS for modern hospitality — booking, seating and floor intelligence working as one.
          </span>
        </p>

        <div className="rd-close__actions">
          <a className="rd-btn rd-btn--paper" href="mailto:hello@tapin.app?subject=Restaurant%20demo">
            Request a restaurant demo <span className="rd-yuzu-dot" />
          </a>
          <a className="rd-btn rd-btn--ghost-light" href="mailto:hello@tapin.app?subject=Talk%20to%20the%20team">
            Talk to the team
          </a>
        </div>

        <div className="rd-foot">
          <span className="rd-foot__brand">TapIn</span>
          <span>The invisible OS for modern hospitality</span>
          <span>© {new Date().getFullYear()} TapIn</span>
        </div>
      </div>
    </section>
  );
}
