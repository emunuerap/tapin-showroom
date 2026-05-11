import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * RevenueEngine — venues-side ROI section.
 *
 * The operator needs numbers, not poetry. This section gives 4 concrete
 * impact metrics + a "before / after" visual + a quiet credibility line.
 * All mocked but plausible — designed to feel like a real impact report.
 */

const IMPACT_METRICS = [
    { id: 'noshows',  label: 'No-shows',        delta: '-68%', subValue: 'Sentient pre-confirmation' },
    { id: 'revpash',  label: 'RevPASH',         delta: '+23%', subValue: 'Optimised floor turns' },
    { id: 'wait',     label: 'Wait at door',    delta: '-4 min', subValue: 'Walk-in routing engine' },
    { id: 'return',   label: 'Return rate',     delta: '+47%', subValue: 'Gratitude Loop active' },
];

export function RevenueEngine() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.rev-eyebrow', {
            opacity: 0, y: 14, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.rev-headline', {
            opacity: 0, y: 24, duration: 1.1, ease: 'power4.out', delay: 0.05,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.rev-sub', {
            opacity: 0, y: 12, duration: 0.8, ease: 'power3.out', delay: 0.2,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.rev-metric', {
            opacity: 0, y: 24, duration: 0.9, ease: 'power4.out', delay: 0.35, stagger: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.rev-compare', {
            opacity: 0, y: 18, duration: 1, ease: 'power3.out', delay: 0.6,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
        gsap.from('.rev-credibility', {
            opacity: 0, y: 12, duration: 0.8, ease: 'power3.out', delay: 0.75,
            scrollTrigger: { trigger: containerRef.current, start: 'top 80%' },
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full py-32 md:py-40 px-6 overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,rgba(204,255,0,0.022)_0%,transparent_55%)]" />

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="flex flex-col items-center gap-7 text-center mb-16">
                    <span className="rev-eyebrow inline-flex items-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                        <span className="block w-8 h-px bg-yuzu/40" />
                        Revenue Engine
                        <span className="block w-8 h-px bg-yuzu/40" />
                    </span>
                    <h2 className="rev-headline font-serif italic text-4xl md:text-6xl lg:text-7xl text-silver/90 leading-[1.04] tracking-tight max-w-3xl">
                        Numbers, not poetry.
                    </h2>
                    <p className="rev-sub font-sans text-base md:text-lg text-silver/65 max-w-2xl leading-relaxed">
                        Operators don't run their venue on sentiment. TapIn earns its place at every service through measurable impact on the metrics that matter.
                    </p>
                </div>

                {/* 4 impact metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
                    {IMPACT_METRICS.map((m) => <MetricCard key={m.id} metric={m} />)}
                </div>

                {/* Before / After compare */}
                <div className="rev-compare grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    <BeforeAfterCard
                        title="Before TapIn"
                        tone="dim"
                        rows={[
                            { label: 'No-show rate',         value: '12.4%'   },
                            { label: 'Avg cover · €',        value: '€38.20'  },
                            { label: 'Floor turns / night',  value: '2.4×'    },
                            { label: 'Wait at door',         value: '7–11 min'},
                            { label: 'Return within 30d',    value: '18%'     },
                        ]}
                    />
                    <BeforeAfterCard
                        title="After TapIn · 90d"
                        tone="yuzu"
                        rows={[
                            { label: 'No-show rate',         value: '4.0%',   delta: '-68%'  },
                            { label: 'Avg cover · €',        value: '€47.00', delta: '+23%'  },
                            { label: 'Floor turns / night',  value: '3.1×',   delta: '+29%'  },
                            { label: 'Wait at door',         value: '2–4 min',delta: '-60%'  },
                            { label: 'Return within 30d',    value: '26%',    delta: '+47%'  },
                        ]}
                    />
                </div>

                {/* Credibility line */}
                <div className="rev-credibility flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 font-mono text-[9.5px] uppercase tracking-[0.28em] text-silver/45">
                    <span className="flex items-center gap-2">
                        <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                            <span className="relative w-1.5 h-1.5 rounded-full bg-yuzu" />
                        </span>
                        Aggregated across pilot venues
                    </span>
                    <span className="hidden md:inline w-px h-3 bg-white/15" />
                    <span>Updated · weekly</span>
                    <span className="hidden md:inline w-px h-3 bg-white/15" />
                    <span>Methodology · per-venue baseline · 90-day window</span>
                </div>
            </div>
        </section>
    );
}

/* ─── METRIC CARD ──────────────────────────────────────────────────────── */

function MetricCard({ metric }: { metric: typeof IMPACT_METRICS[number] }) {
    return (
        <div className="rev-metric relative bg-[#0A0A0A]/85 backdrop-blur-sm border border-white/12 hover:border-yuzu/45 rounded-lg p-5 md:p-6 transition-colors duration-300 group overflow-hidden">
            {/* Top corner accent */}
            <span className="absolute top-0 right-0 w-12 h-px bg-yuzu/30" />
            <span className="absolute top-0 right-0 w-px h-12 bg-yuzu/30" />

            <div className="font-mono text-[9.5px] uppercase tracking-[0.25em] text-silver/55 mb-3">
                {metric.label}
            </div>
            <div className="font-serif italic text-4xl md:text-5xl text-yuzu/95 leading-none mb-3 drop-shadow-[0_0_20px_rgba(204,255,0,0.15)]">
                {metric.delta}
            </div>
            <div className="font-sans text-[11px] text-silver/55 leading-relaxed">
                {metric.subValue}
            </div>
        </div>
    );
}

/* ─── BEFORE / AFTER CARD ──────────────────────────────────────────────── */

function BeforeAfterCard({
    title,
    tone,
    rows,
}: {
    title: string;
    tone: 'dim' | 'yuzu';
    rows: { label: string; value: string; delta?: string }[];
}) {
    const isYuzu = tone === 'yuzu';
    return (
        <div className={`relative rounded-lg p-6 md:p-8 ${
            isYuzu
                ? 'bg-yuzu/[0.03] border border-yuzu/30'
                : 'bg-[#0A0A0A]/70 border border-white/10'
        }`}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/8">
                <span className={`font-mono text-[10px] uppercase tracking-[0.28em] ${isYuzu ? 'text-yuzu/85' : 'text-silver/55'}`}>
                    {title}
                </span>
                {isYuzu && (
                    <span className="flex items-center gap-1.5">
                        <span className="relative flex w-1 h-1">
                            <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                            <span className="relative w-1 h-1 rounded-full bg-yuzu" />
                        </span>
                        <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-yuzu/70">Live</span>
                    </span>
                )}
            </div>
            <dl className="flex flex-col divide-y divide-white/6">
                {rows.map((r) => (
                    <div key={r.label} className="flex items-baseline justify-between gap-3 py-3 first:pt-0 last:pb-0">
                        <dt className="font-sans text-[11.5px] text-silver/55">{r.label}</dt>
                        <dd className="flex items-baseline gap-3">
                            <span className={`font-serif italic text-[18px] tracking-tight ${
                                isYuzu ? 'text-yuzu/95' : 'text-silver/45 line-through'
                            }`}>
                                {r.value}
                            </span>
                            {r.delta && (
                                <span className="font-mono text-[9.5px] font-semibold text-yuzu/80 tabular-nums shrink-0 w-12 text-right">
                                    {r.delta}
                                </span>
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
