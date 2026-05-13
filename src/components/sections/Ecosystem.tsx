import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TiltCard } from '../ui/TiltCard';
import { HospitalityCockpit } from '../ui/HospitalityCockpit';

gsap.registerPlugin(ScrollTrigger);

/**
 * Ecosystem — Venues opener.
 * Unified scroll-triggered presentation matching the rest of the site.
 */
export const Ecosystem = () => {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.eco-eyebrow, .eco-headline, .eco-sub', {
            opacity: 0, y: 50, scale: 0.95, stagger: 0.1,
            scrollTrigger: { trigger: container.current, start: 'top 90%', end: 'top 40%', scrub: 1 },
        });
        gsap.from('.eco-cockpit', {
            opacity: 0, y: 150, scale: 0.8, rotateX: 15,
            scrollTrigger: { trigger: container.current, start: 'top 85%', end: 'top 30%', scrub: 1 },
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

            <div className="eco-cockpit max-w-6xl mx-auto perspective-[1200px]">
                <TiltCard intensity={15}>
                    <div className="shadow-[0_40px_80px_rgba(0,0,0,0.8),inset_0_2px_20px_rgba(255,255,255,0.03)] rounded-2xl overflow-hidden border border-white/10">
                        <HospitalityCockpit />
                    </div>
                </TiltCard>
            </div>
        </section>
    );
};
