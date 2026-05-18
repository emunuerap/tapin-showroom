import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { ProductDefinition, ProductId } from '../content/products';

gsap.registerPlugin(ScrollTrigger);

/**
 * ProductConstellation — 3×2 editorial grid of product cards.
 *
 * Previous version: asymmetric scattered cards with Bezier-curve background
 * threads. The threads rendered pixelated at most aspect ratios and the
 * scatter made the bottom card clip on tighter viewports.
 *
 * This rewrite:
 *  - Clean 3-column × 2-row grid (responsive: 1 col mobile, 2 cols tablet,
 *    3 cols desktop). All 6 cards fully visible, never clipped.
 *  - Numbered 01–06 (top-left of each card) — establishes the order of the
 *    protocol surfaces and gives the section editorial rhythm.
 *  - Bezier threads dropped. Visual connection is implicit (grid alignment
 *    + shared design language) rather than literal lines.
 *  - Mouse parallax at grid level (subtle x/y drift).
 *  - Per-card 3D tilt that responds to cursor position.
 *  - GSAP scroll-trigger reveal: cards rise + fade in with stagger from
 *    center outward.
 *  - Rich graphic previews inside each card — same data, tighter layout,
 *    better hierarchy.
 */

interface ProductConstellationProps {
    products: ProductDefinition[];
}

// Order the cards follow in the grid (left → right, top → bottom).
const CARD_ORDER: ProductId[] = [
    'web-sdk',
    'consumer-app',
    'hospitality-os',
    'messaging',
    'ai-core',
    'integrations',
];

export function ProductConstellation({ products }: ProductConstellationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState<ProductId | null>(null);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const smx = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.6 });
    const smy = useSpring(my, { stiffness: 60, damping: 22, mass: 0.6 });

    // Subtle grid-level parallax for atmospheric depth
    const driftX = useTransform(smx, [-0.5, 0.5], [8, -8]);
    const driftY = useTransform(smy, [-0.5, 0.5], [5, -5]);

    useEffect(() => {
        if (typeof window === 'undefined' || !containerRef.current) return;
        const isTouch =
            window.matchMedia('(hover: none)').matches ||
            window.matchMedia('(pointer: coarse)').matches;
        if (isTouch) return;

        const el = containerRef.current;
        const onMove = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [mx, my]);

    // GSAP entrance — stagger cards from the centre outward
    useEffect(() => {
        if (typeof window === 'undefined' || !containerRef.current) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.constellation-card',
                {
                    opacity: 0,
                    y: 40,
                    scale: 0.94,
                    filter: 'blur(10px)',
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.0,
                    stagger: { each: 0.09, from: 'center', grid: [3, 2] },
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                        once: true,
                    },
                },
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const orderedProducts = CARD_ORDER.map((id) =>
        products.find((p) => p.id === id)!,
    );

    return (
        <motion.div
            ref={containerRef}
            className="relative grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
            style={{ x: driftX, y: driftY, perspective: '1600px' }}
        >
            {orderedProducts.map((product, idx) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    index={idx}
                    isHovered={hovered === product.id}
                    anyHovered={hovered !== null && hovered !== product.id}
                    onHover={() => setHovered(product.id)}
                    onLeave={() =>
                        setHovered((cur) => (cur === product.id ? null : cur))
                    }
                    smx={smx}
                    smy={smy}
                />
            ))}
        </motion.div>
    );
}

/* ─── CARD ─────────────────────────────────────────────────────────────── */

interface ProductCardProps {
    product: ProductDefinition;
    index: number;
    isHovered: boolean;
    anyHovered: boolean;
    onHover: () => void;
    onLeave: () => void;
    smx: ReturnType<typeof useSpring>;
    smy: ReturnType<typeof useSpring>;
}

function ProductCard({
    product,
    index,
    isHovered,
    anyHovered,
    onHover,
    onLeave,
    smx,
    smy,
}: ProductCardProps) {
    // Subtle 3D tilt — small range, feels alive but not seasick
    const tiltY = useTransform(smx, [-0.5, 0.5], [-5, 5]);
    const tiltX = useTransform(smy, [-0.5, 0.5], [4, -4]);

    const num = String(index + 1).padStart(2, '0');

    return (
        <motion.div
            className="constellation-card group relative aspect-[4/5.2] w-full will-change-transform"
            style={{
                rotateY: tiltY,
                rotateX: tiltX,
                transformStyle: 'preserve-3d',
            }}
            animate={{
                scale: isHovered ? 1.04 : 1,
                opacity: anyHovered ? 0.5 : 1,
            }}
            transition={{
                scale: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.4 },
            }}
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            onFocus={onHover}
            onBlur={onLeave}
        >
            {/* Drop shadow that strengthens on hover */}
            <div
                className={`pointer-events-none absolute inset-x-5 -bottom-4 h-6 rounded-full bg-black/65 blur-2xl transition-opacity duration-500 ${
                    isHovered ? 'opacity-95' : 'opacity-55'
                }`}
            />

            <div
                className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border bg-[#0a0a0a]/82 shadow-[0_24px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500 ${
                    isHovered
                        ? 'border-yuzu/40 shadow-[0_30px_70px_rgba(0,0,0,0.65),0_0_50px_rgba(204,255,0,0.18)]'
                        : 'border-white/10'
                }`}
            >
                {/* Top inner glow on hover */}
                <div
                    className={`pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-700 ${
                        isHovered ? 'opacity-100' : 'opacity-50'
                    }`}
                    style={{
                        background:
                            'radial-gradient(ellipse at 50% 0%, rgba(255,180,80,0.12), transparent 60%)',
                    }}
                />

                {/* Number — top-left */}
                <div className="absolute left-4 top-3 z-10 font-mono text-[10px] tracking-[0.18em] text-yuzu/55">
                    {num}
                </div>

                {/* Live indicator — top-right */}
                <div className="absolute right-4 top-3 z-10 flex items-center gap-1.5">
                    <span
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                            isHovered
                                ? 'bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.7)]'
                                : 'bg-yuzu/30'
                        }`}
                    />
                </div>

                {/* Preview — fills ~62% of card */}
                <div className="relative flex-[1.6] overflow-hidden border-b border-white/8 bg-[#070707]">
                    <ProductPreview id={product.id} active={isHovered} />
                </div>

                {/* Caption — 38% of card */}
                <div className="relative flex flex-1 flex-col justify-between px-4 py-4">
                    <div>
                        <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-silver/45">
                            {product.eyebrow}
                        </div>
                        <div className="mt-1.5 font-serif text-[clamp(15px,1.3vw,18px)] italic leading-tight text-white">
                            {product.name}
                        </div>
                    </div>

                    <div className="mt-2 flex items-end justify-between gap-2">
                        <p className="line-clamp-2 font-sans text-[11.5px] leading-snug text-silver/55">
                            {product.description.split('.')[0]}.
                        </p>
                        <motion.span
                            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-yuzu/85"
                            animate={{
                                x: isHovered ? 0 : 4,
                                opacity: isHovered ? 1 : 0,
                            }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            →
                        </motion.span>
                    </div>
                </div>

                {/* Bottom accent slides in on hover */}
                <motion.div
                    className="absolute bottom-0 left-5 right-5 h-px origin-left bg-gradient-to-r from-yuzu/0 via-yuzu/85 to-yuzu/0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
            </div>
        </motion.div>
    );
}

/* ─── PREVIEW DISPATCHER ───────────────────────────────────────────────── */

function ProductPreview({ id, active }: { id: ProductId; active: boolean }) {
    switch (id) {
        case 'web-sdk':
            return <WebSDKPreview active={active} />;
        case 'consumer-app':
            return <ConsumerAppPreview active={active} />;
        case 'hospitality-os':
            return <HospitalityOSPreview active={active} />;
        case 'messaging':
            return <MessagingPreview active={active} />;
        case 'ai-core':
            return <AICorePreview active={active} />;
        case 'integrations':
            return <IntegrationsPreview active={active} />;
    }
}

/* ─── PREVIEWS — graphic and tight ───────────────────────────────────── */

function WebSDKPreview({ active }: { active: boolean }) {
    return (
        <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-[#0e0e0e] to-[#050505] p-3.5">
            {/* Faux browser chrome */}
            <div className="rounded-md border border-white/8 bg-white/[0.03] p-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-white/22" />
                        <span className="h-1 w-1 rounded-full bg-white/15" />
                        <span className="h-1 w-1 rounded-full bg-white/12" />
                    </div>
                    <div className="font-serif text-[7px] italic text-silver/45">
                        osterialumina.com
                    </div>
                </div>
                <div className="mt-2.5 space-y-1">
                    <div className="h-1 w-16 rounded-full bg-white/9" />
                    <div className="h-0.5 w-24 rounded-full bg-white/5" />
                    <div className="h-0.5 w-20 rounded-full bg-white/5" />
                </div>
                <div className="mt-2 flex gap-1">
                    <div className="h-3 w-7 rounded-sm bg-white/4" />
                    <div className="h-3 w-7 rounded-sm bg-white/4" />
                    <div className="h-3 w-7 rounded-sm bg-white/4" />
                </div>
            </div>

            {/* TapIn pill — pulses on hover */}
            <motion.div
                className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-yuzu px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-obsidian shadow-[0_0_20px_rgba(204,255,0,0.45)]"
                animate={active ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                transition={{ duration: 1.4, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
            >
                <span className="h-1 w-1 rounded-full bg-obsidian" />
                TapIn
            </motion.div>

            {/* Bottom-sheet hint slides up on hover */}
            <motion.div
                className="absolute inset-x-3 bottom-2 overflow-hidden rounded-t border border-white/12 bg-[#0e0e0e]/95 backdrop-blur"
                initial={{ y: '110%' }}
                animate={{ y: active ? '0%' : '110%' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="px-2 py-1.5">
                    <div className="font-mono text-[7px] uppercase tracking-[0.18em] text-yuzu/72">
                        Reserve
                    </div>
                    <div className="mt-0.5 font-serif text-[11px] italic text-white">
                        Tonight · 8:30pm
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function ConsumerAppPreview({ active }: { active: boolean }) {
    return (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0e0e0e] to-[#050505]">
            <div
                className={`pointer-events-none absolute inset-x-6 top-3 bottom-6 rounded-full bg-[radial-gradient(circle,rgba(255,180,80,0.16),transparent_60%)] blur-2xl transition-opacity duration-500 ${
                    active ? 'opacity-100' : 'opacity-50'
                }`}
            />
            {/* Phone */}
            <div
                className="relative h-[78%] w-[42%] rounded-[14px] border border-white/14 bg-[#0a0a0a] shadow-[inset_0_0_18px_rgba(255,180,80,0.05),0_14px_30px_rgba(0,0,0,0.55)]"
                style={{ transform: 'rotate(-5deg)' }}
            >
                {/* Notch */}
                <div className="absolute left-1/2 top-1 h-1 w-6 -translate-x-1/2 rounded-full bg-black" />
                <div className="px-2 pt-3">
                    <div className="font-mono text-[6px] uppercase tracking-[0.2em] text-yuzu/80">
                        Tonight
                    </div>
                    <div className="font-serif text-[12px] italic leading-none text-white">
                        8:30pm
                    </div>
                    <div className="mt-0.5 font-mono text-[5.5px] uppercase tracking-[0.1em] text-silver/55">
                        Osteria Lumina · 2
                    </div>
                </div>

                {/* Taste affinity bars */}
                <div className="mx-2 mt-2 space-y-1">
                    {[
                        { l: 'Wine', v: 88 },
                        { l: 'Counter', v: 72 },
                        { l: 'Late', v: 64 },
                    ].map((it, i) => (
                        <div key={it.l}>
                            <div className="flex justify-between font-mono text-[5px] text-silver/60">
                                <span>{it.l}</span>
                                <span>{it.v}</span>
                            </div>
                            <div className="mt-0.5 h-0.5 overflow-hidden rounded-full bg-white/8">
                                <motion.div
                                    className="h-full rounded-full bg-yuzu/80"
                                    initial={{ width: 0 }}
                                    animate={{ width: active ? `${it.v}%` : `${it.v * 0.7}%` }}
                                    transition={{ duration: 0.9, delay: i * 0.08 }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Confirm bar */}
                <div className="absolute inset-x-2 bottom-1.5 grid h-3 place-items-center rounded-sm bg-yuzu font-mono text-[6px] font-bold uppercase tracking-[0.18em] text-obsidian">
                    Confirmed
                </div>
            </div>
        </div>
    );
}

function HospitalityOSPreview({ active }: { active: boolean }) {
    return (
        <div className="relative h-full w-full bg-gradient-to-br from-[#0e0e0e] to-[#050505] p-3.5">
            {/* Floor plan */}
            <div className="relative h-[55%] w-full rounded border border-white/10 bg-[#080808]">
                <div className="absolute inset-1.5 border border-white/8" />
                {[
                    { x: '10%', y: '12%', w: 20, h: 14, state: 'reserved' },
                    { x: '40%', y: '12%', w: 20, h: 14, state: 'occupied' },
                    { x: '70%', y: '12%', w: 20, h: 14, state: 'available' },
                    { x: '40%', y: '46%', w: 18, h: 16, state: 'active', isActive: true },
                    { x: '72%', y: '48%', w: 18, h: 16, state: 'available' },
                    { x: '18%', y: '72%', w: 28, h: 14, state: 'reserved' },
                ].map((t, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-sm border ${
                            t.isActive
                                ? 'border-yuzu/70 bg-yuzu/15'
                                : t.state === 'reserved'
                                  ? 'border-yuzu/25 bg-yuzu/[0.04]'
                                  : t.state === 'occupied'
                                    ? 'border-white/25 bg-white/8'
                                    : 'border-white/8 bg-white/2'
                        }`}
                        style={{
                            left: t.x,
                            top: t.y,
                            width: `${t.w}%`,
                            height: `${t.h}%`,
                        }}
                        animate={
                            t.isActive && active
                                ? {
                                      borderColor: [
                                          'rgba(204,255,0,0.6)',
                                          'rgba(204,255,0,1)',
                                          'rgba(204,255,0,0.6)',
                                      ],
                                  }
                                : {}
                        }
                        transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
                    />
                ))}
                <motion.div
                    className="absolute right-1 top-1 rounded-sm bg-yuzu/15 px-1 py-0.5 font-mono text-[5px] font-bold uppercase tracking-[0.12em] text-yuzu"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Route T5
                </motion.div>
            </div>

            {/* KPIs */}
            <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {[
                    { label: 'RevPASH', value: '+18%', accent: true },
                    { label: 'Dwell', value: '64m', accent: false },
                    { label: 'No-show', value: '−4', accent: true },
                ].map((k) => (
                    <div
                        key={k.label}
                        className="rounded border border-white/8 bg-white/[0.02] px-1.5 py-1"
                    >
                        <div className="font-mono text-[5.5px] uppercase tracking-[0.16em] text-silver/45">
                            {k.label}
                        </div>
                        <div
                            className={`mt-0.5 font-serif text-[11px] italic leading-none ${
                                k.accent ? 'text-yuzu' : 'text-white'
                            }`}
                        >
                            {k.value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MessagingPreview({ active }: { active: boolean }) {
    return (
        <div className="relative flex h-full w-full flex-col gap-1 bg-gradient-to-br from-[#0e0e0e] to-[#050505] p-3.5">
            {/* Header */}
            <div className="mb-1 flex items-center gap-1.5 border-b border-white/8 pb-1.5">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-yuzu/15 font-mono text-[7px] font-bold text-yuzu">
                    OL
                </span>
                <div>
                    <div className="font-mono text-[6.5px] uppercase tracking-[0.16em] text-yuzu/70">
                        WhatsApp
                    </div>
                    <div className="font-serif text-[8px] italic text-white">
                        Osteria Lumina
                    </div>
                </div>
            </div>

            {/* Bubbles */}
            <div className="ml-auto max-w-[78%] rounded rounded-tr-sm bg-yuzu/15 px-1.5 py-1 text-[8.5px] leading-tight text-white">
                Table for 4 · Friday?
            </div>
            <motion.div
                className="max-w-[78%] rounded rounded-tl-sm bg-white/6 px-1.5 py-1 text-[8.5px] leading-tight text-silver/85"
                animate={active ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
                transition={{ duration: 1.4, repeat: active ? Infinity : 0 }}
            >
                Confirmed. Table 5 · 8pm.
            </motion.div>
            <div className="ml-auto max-w-[78%] rounded rounded-tr-sm bg-yuzu/15 px-1.5 py-1 text-[8.5px] leading-tight text-white">
                Window seat possible?
            </div>

            {/* Footer pill */}
            <div className="mt-auto flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-yuzu shadow-[0_0_5px_rgba(204,255,0,0.7)]" />
                <span className="font-mono text-[6.5px] uppercase tracking-[0.18em] text-yuzu/82">
                    Friday · 8:00pm · Confirmed
                </span>
            </div>
        </div>
    );
}

function AICorePreview({ active }: { active: boolean }) {
    return (
        <div className="relative flex h-full w-full flex-col bg-gradient-to-br from-[#0e0e0e] to-[#050505] p-3.5 font-mono">
            <div className="mb-1.5 flex items-center gap-1.5 text-[6.5px] uppercase tracking-[0.18em] text-yuzu/68">
                <span className="h-1 w-1 rounded-full bg-yuzu shadow-[0_0_5px_rgba(204,255,0,0.7)]" />
                Parsing
            </div>

            <div className="rounded border-l-2 border-yuzu/60 bg-white/[0.025] px-2 py-1.5">
                <div className="font-serif text-[10px] italic leading-snug text-white">
                    "two of us, around 9, somewhere quiet"
                </div>
            </div>

            <div className="mt-2 space-y-0.5">
                {[
                    { k: 'party', v: '2' },
                    { k: 'time', v: '~21:00' },
                    { k: 'mood', v: 'quiet · counter' },
                ].map((row, i) => (
                    <motion.div
                        key={row.k}
                        className="flex items-center gap-1.5 text-[8px]"
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                    >
                        <span className="w-10 text-silver/45">{row.k}</span>
                        <span className="text-yuzu/85">→</span>
                        <span className="text-white">{row.v}</span>
                    </motion.div>
                ))}
            </div>

            <div className="mt-auto flex items-center gap-1">
                <span className="text-[6.5px] uppercase tracking-[0.16em] text-silver/40">
                    thinking
                </span>
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="h-1 w-1 rounded-full bg-yuzu"
                        animate={
                            active
                                ? { opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }
                                : { opacity: 0.45 }
                        }
                        transition={{
                            duration: 1.0,
                            repeat: active ? Infinity : 0,
                            delay: i * 0.18,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

function IntegrationsPreview({ active }: { active: boolean }) {
    const services = [
        { id: 'pos', label: 'POS', pos: { x: 20, y: 22 } },
        { id: 'stripe', label: 'Stripe', pos: { x: 80, y: 18 } },
        { id: 'nfc', label: 'NFC', pos: { x: 88, y: 60 } },
        { id: 'whatsapp', label: 'WhatsApp', pos: { x: 65, y: 88 } },
        { id: 'maps', label: 'Maps', pos: { x: 22, y: 86 } },
        { id: 'invoices', label: 'Invoices', pos: { x: 10, y: 56 } },
    ];
    return (
        <div className="relative h-full w-full bg-gradient-to-br from-[#0e0e0e] to-[#050505]">
            <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 h-full w-full"
                preserveAspectRatio="xMidYMid meet"
            >
                <defs>
                    <linearGradient id="int-line-pp" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="rgba(204,255,0,0.55)" />
                        <stop offset="100%" stopColor="rgba(255,180,80,0.35)" />
                    </linearGradient>
                    <filter id="int-glow-pp">
                        <feGaussianBlur stdDeviation="0.5" />
                    </filter>
                </defs>
                {services.map((s, i) => (
                    <motion.line
                        key={s.id}
                        x1={50}
                        y1={50}
                        x2={s.pos.x}
                        y2={s.pos.y}
                        stroke="url(#int-line-pp)"
                        strokeWidth={0.45}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.85 }}
                        transition={{
                            duration: 0.9,
                            delay: 0.2 + i * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        filter="url(#int-glow-pp)"
                    />
                ))}
                <circle cx={50} cy={50} r={4.5} fill="rgba(204,255,0,0.95)" filter="url(#int-glow-pp)" />
                <motion.circle
                    cx={50}
                    cy={50}
                    fill="none"
                    stroke="rgba(204,255,0,0.4)"
                    strokeWidth={0.4}
                    initial={{ r: 7, opacity: 0.4 }}
                    animate={
                        active
                            ? { r: [7, 12, 7], opacity: [0.4, 0, 0.4] }
                            : { r: 7, opacity: 0.4 }
                    }
                    transition={{
                        duration: 2.2,
                        repeat: active ? Infinity : 0,
                        ease: 'easeInOut',
                    }}
                />
                {services.map((s) => (
                    <g key={s.id}>
                        <circle
                            cx={s.pos.x}
                            cy={s.pos.y}
                            r={2.6}
                            fill="rgba(10,10,10,0.95)"
                            stroke="rgba(255,180,80,0.55)"
                            strokeWidth={0.4}
                        />
                        <text
                            x={s.pos.x}
                            y={s.pos.y + 6}
                            textAnchor="middle"
                            className="fill-silver/70"
                            style={{
                                fontFamily: 'monospace',
                                fontSize: '2.4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.3px',
                            }}
                        >
                            {s.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
