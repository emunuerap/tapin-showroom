import { useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * GratitudeLoop — guest-side closing section.
 *
 * REWRITTEN: the previous abstract loop diagram (rotating arc + "Memory
 * updates" floating node) didn't communicate what the Gratitude Loop is.
 * Now the section shows it concretely — three visits of the SAME guest at
 * the SAME venue, with the memory enriching between each one. By the third
 * visit, TapIn anticipates the night entirely.
 *
 * This is story, not metaphor.
 */

interface Visit {
    n: number;
    when: string;
    headline: string;
    state: 'first' | 'recognised' | 'anticipated';
    learned: string[];
    arrived: string;
}

const VISITS: Visit[] = [
    {
        n: 1,
        when: '12 weeks ago',
        state: 'first',
        headline: 'Walked in',
        arrived: 'Phone tap at the door · no profile, no app',
        learned: [
            'Wine preference · Chablis (2 glasses)',
            'Table 04 · quiet corner',
            'Pace · 2h 14m · slow',
        ],
    },
    {
        n: 2,
        when: '4 weeks ago',
        state: 'recognised',
        headline: 'Recognised',
        arrived: 'Sofía welcomed by name · table pre-staged',
        learned: [
            'Always Tuesdays · early dinner',
            'Same wine, never list-shopper',
            'Anniversary on the way',
        ],
    },
    {
        n: 3,
        when: 'Tonight',
        state: 'anticipated',
        headline: 'Anticipated',
        arrived: 'Booking made itself · 19:30 · Sofía briefed',
        learned: [
            'Bottle waiting at the table',
            'Light dimmed by 1 stop',
            '"Welcome back, Marisol."',
        ],
    },
];

export function GratitudeLoop() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.grat-eyebrow', {
            opacity: 0, y: 14, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.grat-headline', {
            opacity: 0, y: 24, duration: 1.1, ease: 'power4.out', delay: 0.05,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.grat-sub', {
            opacity: 0, y: 12, duration: 0.9, ease: 'power3.out', delay: 0.2,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.grat-visit', {
            opacity: 0, y: 28, duration: 1.0, ease: 'power4.out', delay: 0.3, stagger: 0.15,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.grat-connector', {
            opacity: 0, scaleY: 0, transformOrigin: 'top',
            duration: 0.9, ease: 'power3.out', delay: 0.5, stagger: 0.15,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.grat-quote', {
            opacity: 0, y: 14, duration: 1, ease: 'power3.out', delay: 0.6,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
        gsap.from('.grat-stat', {
            opacity: 0, y: 16, duration: 0.8, ease: 'power3.out', delay: 0.75, stagger: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 78%' },
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full py-28 md:py-36 px-6">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_center,rgba(204,255,0,0.025)_0%,transparent_60%)]" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center text-center gap-6 mb-16">
                    <span className="grat-eyebrow inline-flex items-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                        <span className="block w-8 h-px bg-yuzu/40" />
                        Module · Gratitude Loop
                        <span className="block w-8 h-px bg-yuzu/40" />
                    </span>
                    <h2 className="grat-headline font-serif italic text-4xl md:text-6xl lg:text-7xl text-silver/90 leading-[1.04] tracking-tight max-w-4xl">
                        A visit doesn't end.
                        <br />
                        <span className="text-yuzu">It becomes memory.</span>
                    </h2>
                    <p className="grat-sub font-sans text-base md:text-lg text-silver/65 max-w-2xl leading-relaxed">
                        Three visits to the same venue. Each one richer than the last — not because you did more, but because TapIn remembered.
                    </p>
                </div>

                {/* Timeline — desktop: 3 columns side by side · mobile: stack */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_24px_1fr_24px_1fr] gap-6 lg:gap-0 items-stretch">
                    <VisitCard visit={VISITS[0]} />
                    <Connector />
                    <VisitCard visit={VISITS[1]} />
                    <Connector />
                    <VisitCard visit={VISITS[2]} />
                </div>

                {/* Quote + stats below */}
                <div className="mt-20 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
                    <blockquote className="grat-quote">
                        <p className="font-serif italic text-xl md:text-2xl text-white/85 leading-[1.4] tracking-tight">
                            "The old way ended at the check. The new way begins there — your gratitude becomes the data that shapes how you'll be welcomed back."
                        </p>
                        <footer className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-silver/45">
                            — TapIn · Hospitality OS
                        </footer>
                    </blockquote>

                    <div className="grid grid-cols-3 gap-4">
                        <Stat number="3.2×" label="Return rate" />
                        <Stat number="92%" label="Recognised on arrival" />
                        <Stat number="6s" label="Avg check-in" />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── VISIT CARD ───────────────────────────────────────────────────────── */

const STATE_STYLE: Record<Visit['state'], { border: string; accent: string; titleColor: string }> = {
    first:        { border: 'border-white/15',       accent: 'text-silver/55', titleColor: 'text-silver/85' },
    recognised:   { border: 'border-yuzu/30',        accent: 'text-yuzu/85',   titleColor: 'text-white/95'  },
    anticipated:  { border: 'border-yuzu/65',        accent: 'text-yuzu',      titleColor: 'text-yuzu'      },
};

function VisitCard({ visit }: { visit: Visit }) {
    const s = STATE_STYLE[visit.state];
    const isAnticipated = visit.state === 'anticipated';
    return (
        <article className={`grat-visit relative bg-[#0A0A0A]/85 backdrop-blur-sm rounded-xl border ${s.border} p-6 md:p-7 flex flex-col gap-5 ${isAnticipated ? 'shadow-[0_0_28px_rgba(204,255,0,0.10)]' : ''}`}>
            {/* Header — visit number + when */}
            <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-silver/45">
                    Visit · 0{visit.n}
                </span>
                <span className={`font-mono text-[9.5px] uppercase tracking-[0.22em] ${s.accent}`}>
                    {visit.when}
                </span>
            </div>

            {/* Headline */}
            <div className="flex items-baseline gap-2">
                <h3 className={`font-serif italic text-3xl md:text-4xl leading-none tracking-tight ${s.titleColor}`}>
                    {visit.headline}
                </h3>
                {isAnticipated && (
                    <motion.span
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-yuzu shadow-[0_0_6px_rgba(204,255,0,0.7)]"
                    />
                )}
            </div>

            {/* Arrival narration */}
            <p className="font-sans text-[12.5px] text-silver/65 leading-relaxed -mt-2">
                {visit.arrived}
            </p>

            {/* What TapIn captured / used */}
            <div className="mt-1 pt-4 border-t border-white/8 flex flex-col gap-2">
                <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-silver/40">
                    {isAnticipated ? 'TapIn delivered' : 'TapIn learned'}
                </span>
                <ul className="flex flex-col gap-1.5">
                    {visit.learned.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className={`mt-1.5 block w-1 h-1 rounded-full shrink-0 ${isAnticipated ? 'bg-yuzu shadow-[0_0_3px_rgba(204,255,0,0.6)]' : 'bg-silver/40'}`} />
                            <span className={`font-sans text-[11.5px] leading-snug tracking-tight ${isAnticipated ? 'text-yuzu/90' : 'text-white/75'}`}>
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </article>
    );
}

/* ─── CONNECTOR — yuzu line + label "memory enriched" between cards ───── */

function Connector() {
    return (
        <div className="grat-connector hidden lg:flex flex-col items-center justify-center gap-2 self-center">
            {/* Vertical/horizontal line — visually a tiny arrow that flows right */}
            <svg width="24" height="48" viewBox="0 0 24 48" className="overflow-visible">
                <line x1="2" y1="24" x2="22" y2="24" stroke="rgba(204,255,0,0.55)" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M 18 20 L 22 24 L 18 28" stroke="rgba(204,255,0,0.85)" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-yuzu/55 whitespace-nowrap absolute -bottom-5">
                memory enriched
            </span>
        </div>
    );
}

function Stat({ number, label }: { number: string; label: string }) {
    return (
        <div className="grat-stat flex flex-col gap-1.5 pt-4 border-t border-white/10">
            <span className="font-serif italic text-3xl md:text-[2.4rem] text-yuzu/95 leading-none">
                {number}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-silver/55 leading-tight">
                {label}
            </span>
        </div>
    );
}
