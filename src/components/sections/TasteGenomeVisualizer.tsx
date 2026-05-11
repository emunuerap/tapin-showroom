import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TasteGenomeVisualizer as TasteGenomeUI } from '../ui/TasteGenomeVisualizer';

gsap.registerPlugin(ScrollTrigger);

/**
 * TasteGenomeVisualizer — Guests section.
 *
 * Now focused PURELY on the Taste Genome concept (no overlap with the
 * Gastronomic Passport, which has its own dedicated section). Copy explains
 * what the Genome is, how it builds itself, and why it never feels invasive.
 *
 * Visual hierarchy: eyebrow → headline → body → 3 "signal types" → visualiser.
 */

const SIGNAL_TYPES = [
    {
        keyword: 'Explicit',
        label: 'What you say',
        body: 'Allergies, ratings, gentle tips after a visit.',
    },
    {
        keyword: 'Implicit',
        label: 'What you do',
        body: 'Dwell time, return rhythm, the wines you reach for.',
    },
    {
        keyword: 'Ambient',
        label: 'How you arrive',
        body: 'Time of day, occasion, who you bring with you.',
    },
];

export function TasteGenomeVisualizer() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.genome-eyebrow', {
            opacity: 0, y: 14, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.genome-headline', {
            opacity: 0, y: 24, duration: 1.1, ease: 'power4.out', delay: 0.05,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.genome-body', {
            opacity: 0, y: 14, duration: 0.9, ease: 'power3.out', delay: 0.2,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.genome-signal', {
            opacity: 0, y: 18, duration: 0.9, ease: 'power4.out', delay: 0.35, stagger: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.genome-viz', {
            opacity: 0, scale: 0.95, duration: 1.2, ease: 'power4.out', delay: 0.3,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative w-full py-24 md:py-28 px-6 max-w-7xl mx-auto flex flex-col bg-transparent"
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-20 items-center">
                {/* Left — copy + signal grid */}
                <div className="flex flex-col gap-7">
                    <span className="genome-eyebrow inline-flex items-center gap-3 self-start font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                        <span className="block w-8 h-px bg-yuzu/40" />
                        Module · Taste Genome
                    </span>

                    <h2 className="genome-headline font-serif italic text-4xl md:text-6xl lg:text-7xl text-silver/90 leading-[1.04] tracking-tight">
                        Your palate,
                        <br />
                        <span className="text-yuzu">remembered.</span>
                    </h2>

                    <p className="genome-body font-sans text-base md:text-lg text-silver/65 leading-relaxed max-w-xl">
                        The Genome is the living model of your taste — built quietly across every visit. It learns what you order, when, with whom, in what mood — and refines itself with each interaction. Every venue you walk into receives only what's useful for that night.
                    </p>

                    {/* Three signal types */}
                    <div className="flex flex-col gap-3 mt-2">
                        {SIGNAL_TYPES.map((s) => (
                            <div key={s.keyword} className="genome-signal flex items-start gap-4 py-3 border-t border-white/8 first:border-t-0 first:pt-0">
                                <span className="shrink-0 w-20 font-mono text-[10px] uppercase tracking-[0.28em] text-yuzu/80 pt-0.5">
                                    {s.keyword}
                                </span>
                                <div className="flex flex-col gap-0.5">
                                    <span className="font-sans text-[13px] font-semibold text-white/90 tracking-tight">
                                        {s.label}
                                    </span>
                                    <span className="font-sans text-[12.5px] text-silver/55 leading-relaxed">
                                        {s.body}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — visualisation */}
                <div className="genome-viz flex justify-center lg:justify-end mt-8 lg:mt-0">
                    <TasteGenomeUI />
                </div>
            </div>
        </section>
    );
}
