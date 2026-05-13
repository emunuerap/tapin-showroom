import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, animate, useInView } from 'framer-motion';
import { TiltCard } from '../ui/TiltCard';

gsap.registerPlugin(ScrollTrigger);

/**
 * RevenueEngine — venues-side ROI section.
 *
 * Highly visual, WebGL-inspired data representation. Numbers physically count up,
 * sparklines draw themselves, and before/after comparisons are represented as
 * dynamic progress bars inside a glassmorphic dashboard.
 */

const IMPACT_METRICS = [
    { id: 'noshows',  label: 'No-shows',        num: -68, suffix: '%', subValue: 'Sentient pre-confirmation', trend: 'down' as const },
    { id: 'revpash',  label: 'RevPASH',         num: 23, prefix: '+', suffix: '%', subValue: 'Optimised floor turns', trend: 'up' as const },
    { id: 'wait',     label: 'Wait at door',    num: -4, suffix: ' min', subValue: 'Walk-in routing engine', trend: 'down' as const },
    { id: 'return',   label: 'Return rate',     num: 47, prefix: '+', suffix: '%', subValue: 'Gratitude Loop active', trend: 'up' as const },
];

const COMPARISON_ROWS = [
    { label: 'No-show rate', beforeStr: '12.4%', afterStr: '4.0%', pct: 32, invert: true, delta: '-68%' },
    { label: 'Avg cover · €', beforeStr: '€38.20', afterStr: '€47.00', pct: 85, invert: false, delta: '+23%' },
    { label: 'Floor turns', beforeStr: '2.4×', afterStr: '3.1×', pct: 78, invert: false, delta: '+29%' },
    { label: 'Wait at door', beforeStr: '9 min', afterStr: '3 min', pct: 33, invert: true, delta: '-66%' },
    { label: 'Return within 30d', beforeStr: '18%', afterStr: '26%', pct: 65, invert: false, delta: '+44%' },
];

export function RevenueEngine() {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.from('.rev-eyebrow, .rev-headline, .rev-sub', {
            opacity: 0, y: 50, scale: 0.95, stagger: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 90%', end: 'top 40%', scrub: 1 },
        });
        gsap.from('.rev-metric', {
            opacity: 0, y: 150, scale: 0.8, rotateX: 15, stagger: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%', end: 'top 30%', scrub: 1 },
        });
        gsap.from('.rev-compare', {
            opacity: 0, y: 100, scale: 0.9, rotateX: 10,
            scrollTrigger: { trigger: '.rev-compare', start: 'top 95%', end: 'top 50%', scrub: 1 },
        });
        gsap.from('.rev-credibility', {
            opacity: 0, y: 30,
            scrollTrigger: { trigger: '.rev-credibility', start: 'top 95%', end: 'top 75%', scrub: 1 },
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative w-full py-32 md:py-40 px-6 overflow-hidden perspective-[1200px]">
            {/* Immersive background glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom,rgba(204,255,0,0.03)_0%,transparent_60%)]" />

            <div className="relative z-10 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center gap-7 text-center mb-16 md:mb-24">
                    <span className="rev-eyebrow inline-flex items-center gap-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                        <span className="block w-8 h-px bg-yuzu/40" />
                        Revenue Engine
                        <span className="block w-8 h-px bg-yuzu/40" />
                    </span>
                    <h2 className="rev-headline font-serif italic text-4xl md:text-6xl lg:text-7xl text-silver/90 leading-[1.04] tracking-tight max-w-3xl drop-shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        Numbers, not poetry.
                    </h2>
                    <p className="rev-sub font-sans text-base md:text-lg text-silver/65 max-w-2xl leading-relaxed">
                        Operators don't run their venue on sentiment. TapIn earns its place at every service through measurable impact on the metrics that matter.
                    </p>
                </div>

                {/* 4 Impact Metrics with Sparklines */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20 md:mb-28">
                    {IMPACT_METRICS.map((m) => <MetricCard key={m.id} metric={m} />)}
                </div>

                {/* Unified Data Dashboard */}
                <TiltCard intensity={5} className="rev-compare w-full max-w-5xl mx-auto mb-16">
                    <div className="relative bg-[#070707]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.8),inset_0_2px_20px_rgba(255,255,255,0.04)] overflow-hidden">
                        {/* Header bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 md:p-8 border-b border-white/5 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <span className="block w-2 h-2 rounded-full bg-white/20" />
                                    <span className="block w-2 h-2 rounded-full bg-white/15" />
                                </div>
                                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-silver/55">
                                    Performance Impact · 90d Trailing
                                </span>
                            </div>
                            <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yuzu/20 bg-yuzu/[0.03]">
                                <span className="relative flex w-1.5 h-1.5">
                                    <span className="absolute inset-0 rounded-full bg-yuzu animate-ping opacity-75" />
                                    <span className="relative w-1.5 h-1.5 rounded-full bg-yuzu" />
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-yuzu/80">Live Pilot Data</span>
                            </span>
                        </div>

                        {/* Data Rows */}
                        <div className="flex flex-col p-6 md:p-8 gap-1">
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-[1.5fr_1fr_2fr_1fr] items-center gap-6 px-4 pb-4 border-b border-white/10 mb-2">
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/40">Metric</span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/40">Before TapIn</span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/40 text-center">Delta Shift</span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-yuzu/60 text-right">After TapIn</span>
                            </div>

                            {/* Rows */}
                            {COMPARISON_ROWS.map((row, i) => (
                                <ComparisonRow key={row.label} row={row} index={i} />
                            ))}
                        </div>
                    </div>
                </TiltCard>

                {/* Credibility line */}
                <div className="rev-credibility flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 font-mono text-[9.5px] uppercase tracking-[0.28em] text-silver/40">
                    <span className="flex items-center gap-2">
                        <span className="relative flex w-1.5 h-1.5">
                            <span className="absolute inset-0 rounded-full bg-white/40 opacity-75" />
                            <span className="relative w-1.5 h-1.5 rounded-full bg-white/60" />
                        </span>
                        Aggregated across 12 pilot venues
                    </span>
                    <span className="hidden md:inline w-px h-3 bg-white/15" />
                    <span>Methodology · strict 90-day baseline</span>
                </div>
            </div>
        </section>
    );
}

/* ─── METRIC CARD WITH SPARKLINE ───────────────────────────────────────── */

function MetricCard({ metric }: { metric: typeof IMPACT_METRICS[number] }) {
    return (
        <TiltCard intensity={15} className="rev-metric h-full">
            <div className="relative bg-[#0A0A0A]/85 backdrop-blur-xl border border-white/10 hover:border-yuzu/40 rounded-xl p-6 md:p-7 transition-colors duration-500 group overflow-hidden h-full shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                {/* Background Sparkline */}
                <div className="absolute inset-x-0 bottom-0 h-24 opacity-30 group-hover:opacity-70 transition-opacity duration-500">
                    <Sparkline trend={metric.trend} />
                </div>

                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-yuzu/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Corner accents */}
                <span className="absolute top-0 right-0 w-8 h-px bg-yuzu/40 transition-all duration-300 group-hover:w-16" />
                <span className="absolute top-0 right-0 w-px h-8 bg-yuzu/40 transition-all duration-300 group-hover:h-16" />

                <div className="font-mono text-[9.5px] uppercase tracking-[0.25em] text-silver/60 mb-4 relative z-10">
                    {metric.label}
                </div>

                <div className="font-serif italic text-5xl md:text-6xl text-yuzu/95 leading-none mb-4 drop-shadow-[0_0_25px_rgba(204,255,0,0.2)] relative z-10 flex items-baseline">
                    <AnimatedCounter value={metric.num} prefix={metric.prefix} suffix={metric.suffix} />
                </div>

                <div className="font-sans text-[11.5px] text-silver/55 leading-relaxed relative z-10">
                    {metric.subValue}
                </div>
            </div>
        </TiltCard>
    );
}

/* ─── UNIFIED COMPARISON ROW ───────────────────────────────────────────── */

function ComparisonRow({ row, index }: { row: typeof COMPARISON_ROWS[number], index: number }) {
    return (
        <div className="group flex flex-col md:grid md:grid-cols-[1.5fr_1fr_2fr_1fr] items-start md:items-center gap-3 md:gap-6 px-4 py-4 md:py-5 rounded-lg hover:bg-white/[0.02] transition-colors border-b border-white/[0.03] last:border-0">

            {/* Label */}
            <span className="font-sans text-[13px] md:text-[14px] font-medium text-silver/80 group-hover:text-white transition-colors">
                {row.label}
            </span>

            {/* Before */}
            <span className="font-serif italic text-base md:text-lg text-silver/40 line-through">
                {row.beforeStr}
            </span>

            {/* Visual Bar */}
            <div className="w-full flex items-center gap-3">
                <span className="font-mono text-[9px] text-silver/30 shrink-0 w-8 text-right hidden md:block">prev</span>
                <div className="relative flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        className={`absolute left-0 top-0 h-full rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)] ${row.invert ? 'bg-yuzu origin-right' : 'bg-yuzu origin-left'}`}
                        initial={{ width: row.invert ? '100%' : '10%' }}
                        whileInView={{ width: `${row.pct}%` }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
                    />
                </div>
                <span className="font-mono text-[10px] text-yuzu/80 font-bold shrink-0 w-8 hidden md:block">{row.delta}</span>
            </div>

            {/* After */}
            <span className="font-serif italic text-2xl md:text-3xl text-yuzu font-semibold md:text-right drop-shadow-[0_0_15px_rgba(204,255,0,0.15)]">
                {row.afterStr}
            </span>
        </div>
    );
}

/* ─── HELPERS ──────────────────────────────────────────────────────────── */

function AnimatedCounter({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        if (isInView) {
            const controls = animate(0, value, {
                duration: 2.5,
                ease: [0.16, 1, 0.3, 1],
                onUpdate: (v) => setDisplay(v)
            });
            return () => controls.stop();
        }
    }, [isInView, value]);

    const isInt = Number.isInteger(value);
    return (
        <span ref={ref} className="tabular-nums">
            {prefix}{display.toFixed(isInt ? 0 : 1)}{suffix}
        </span>
    );
}

function Sparkline({ trend }: { trend: 'up' | 'down' }) {
    // Generate organic-looking bezier curves for the data lines
    const pathD = trend === 'up'
        ? "M 0 40 Q 20 40, 30 30 T 60 25 T 80 15 T 100 5"
        : "M 0 10 Q 20 10, 30 20 T 60 25 T 80 35 T 100 45";

    return (
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
            <motion.path
                d={pathD}
                fill="none"
                stroke="url(#sparkline-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
            />
            <defs>
                <linearGradient id="sparkline-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(204,255,0,0)" />
                    <stop offset="50%" stopColor="rgba(204,255,0,0.6)" />
                    <stop offset="100%" stopColor="rgba(204,255,0,1)" />
                </linearGradient>
            </defs>
        </svg>
    );
}
