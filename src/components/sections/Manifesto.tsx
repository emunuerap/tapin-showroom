import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { KineticAuthEngine } from '../ui/KineticAuthEngine';

gsap.registerPlugin(ScrollTrigger);

/**
 * Manifesto — Guests opener.
 *
 * The "Friction vs. Flow" conceptual contrast. Now uses the unified
 * eyebrow + headline + staggered reveal language that the rest of the
 * sections share, so the page feels like one product.
 */
export function Manifesto() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.man-eyebrow', {
            opacity: 0, y: 14, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.man-old', {
            opacity: 0, y: 24, duration: 1.0, ease: 'power4.out', delay: 0.05,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.man-rule', {
            scaleX: 0, transformOrigin: 'left',
            duration: 1.0, ease: 'power4.out', delay: 0.2,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.man-new', {
            opacity: 0, y: 28, duration: 1.2, ease: 'power4.out', delay: 0.3,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.man-pass', {
            opacity: 0, y: 12, duration: 0.9, ease: 'power3.out', delay: 0.55,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.man-engine', {
            opacity: 0, y: 28, scale: 0.97, duration: 1.2, ease: 'power4.out', delay: 0.25,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
    }, { scope: containerRef });

    return (
        <section id="manifesto" ref={containerRef} className="py-28 md:py-32 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="flex flex-col gap-7">
                    <span className="man-eyebrow inline-flex items-center gap-3 self-start font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                        <span className="block w-8 h-px bg-yuzu/40" />
                        Friction vs. Flow
                    </span>

                    <h2 className="man-old font-sans font-bold text-3xl md:text-4xl text-silver/30 tracking-tighter line-through leading-[1.1]">
                        Old way · 12 clicks, 2 apps, 1 phone call.
                    </h2>

                    <span className="man-rule block w-32 h-px bg-gradient-to-r from-yuzu/60 to-transparent" />

                    <h3 className="man-new font-sans font-bold text-5xl md:text-7xl text-yuzu tracking-tighter drop-shadow-[0_0_30px_rgba(204,255,0,0.25)] leading-[0.98]">
                        TapIn · 5 seconds.
                        <br />
                        No apps. No passwords.
                    </h3>

                    <p className="man-pass font-serif italic text-xl md:text-2xl text-silver/85 leading-relaxed max-w-md">
                        Your phone number is your only passport.
                    </p>
                </div>

                <div className="man-engine flex items-center justify-center w-full">
                    <div className="w-full max-w-lg mx-auto">
                        <KineticAuthEngine />
                    </div>
                </div>
            </div>
        </section>
    );
}
