import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — Lenis-backed inertial smooth scroll, with safe degradation.
 *
 * Implementation notes:
 *  - Lenis is loaded via dynamic import. If the package is not installed in
 *    node_modules, the import promise rejects, the try/catch swallows it, and
 *    the site falls back to native browser scroll. The page never crashes
 *    because of a missing dep — that was the bug in a previous attempt.
 *  - When Lenis loads, we bridge its RAF into gsap.ticker so ScrollTrigger
 *    keeps firing in sync (no double-RAF jitter).
 *  - Respects prefers-reduced-motion — skip Lenis entirely.
 *  - Cleanup tears down ticker + lenis instance on unmount.
 */
export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) return;
        const mobileOrTouch = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
        if (mobileOrTouch) {
            requestAnimationFrame(() => ScrollTrigger.refresh());
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let lenis: any = null;
        let raf: ((time: number) => void) | null = null;
        let destroyed = false;

        (async () => {
            try {
                const mod = await import('lenis');
                if (destroyed) return;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Lenis = (mod as any).default ?? mod;

                lenis = new Lenis({
                    // Slightly longer duration + an ease-out-expo curve gives
                    // the inertial "luxury car" feel. Curve = 1 - 2^(-10*t).
                    duration: 1.25,
                    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    touchMultiplier: 1.6,
                    syncTouch: false,
                });

                lenis.on('scroll', ScrollTrigger.update);

                raf = (time: number) => lenis!.raf(time * 1000);
                gsap.ticker.add(raf);
                gsap.ticker.lagSmoothing(0);

                // Expose Lenis on window for programmatic scrolls (route
                // changes, "scroll to next section" buttons, anchor links).
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (window as any).__tapin_lenis = lenis;

                // Recalculate after fonts / images settle. Two refresh passes
                // (immediate + 500ms) cover late-mounting lazy sections.
                requestAnimationFrame(() => ScrollTrigger.refresh());
                window.setTimeout(() => ScrollTrigger.refresh(), 500);
            } catch (err) {
                // Lenis not available — site continues with native scroll
                if (typeof console !== 'undefined') {
                    console.warn(
                        '[SmoothScroll] Lenis unavailable, using native scroll.',
                        err instanceof Error ? err.message : err
                    );
                }
            }
        })();

        return () => {
            destroyed = true;
            if (raf) gsap.ticker.remove(raf);
            if (lenis) lenis.destroy();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof window !== 'undefined') (window as any).__tapin_lenis = null;
        };
    }, []);

    return <>{children}</>;
};
