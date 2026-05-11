import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HospitalityCockpit } from '../ui/HospitalityCockpit';

gsap.registerPlugin(ScrollTrigger);

/**
 * Ecosystem — Venues opener.
 * Unified scroll-triggered presentation matching the rest of the site.
 */
export const Ecosystem = () => {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.eco-eyebrow', {
            opacity: 0, y: 14, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: container.current, start: 'top 78%' },
        });
        gsap.from('.eco-headline', {
            opacity: 0, y: 24, duration: 1.1, ease: 'power4.out', delay: 0.05,
            scrollTrigger: { trigger: container.current, start: 'top 78%' },
        });
        gsap.from('.eco-sub', {
            opacity: 0, y: 12, duration: 0.9, ease: 'power3.out', delay: 0.2,
            scrollTrigger: { trigger: container.current, start: 'top 78%' },
        });
        gsap.from('.eco-cockpit', {
            opacity: 0, y: 30, scale: 0.97, duration: 1.2, ease: 'power4.out', delay: 0.3,
            scrollTrigger: { trigger: container.current, start: 'top 78%' },
        });
    }, { scope: container });

    return (
        <section ref={container} className="relative w-full py-24 md:py-28 px-6 bg-transparent">
            <div className="flex flex-col items-center text-center gap-6 mb-12 md:mb-14">
                <span className="eco-eyebrow inline-flex items-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                    <span className="block w-8 h-px bg-yuzu/40" />
                    Module · Cockpit
                    <span className="block w-8 h-px bg-yuzu/40" />
                </span>
                <h2 className="eco-headline font-serif italic text-4xl md:text-6xl lg:text-7xl text-silver/90 leading-[1.04] tracking-tight max-w-3xl">
                    The room, on a screen.
                </h2>
                <p className="eco-sub font-sans text-base md:text-lg text-silver/65 max-w-2xl leading-relaxed">
                    One operator surface that mirrors your venue in real time — bookings, walk-ins, sentiment, revenue. Tap to act. The OS handles the rest.
                </p>
            </div>

            <div className="eco-cockpit max-w-6xl mx-auto">
                <HospitalityCockpit />
            </div>
        </section>
    );
};
