import { lazy, Suspense, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// Lazy-load three.js + drei + 5MB GLB. The chunk is fetched on demand
// (not at initial page load) but mounts immediately when this scene is
// rendered — we no longer gate on IntersectionObserver because, inside
// the horizontal pin-scroll rail, IO can fail to fire reliably and
// leave the phone unmounted.
const IPhone3D = lazy(() =>
    import('../components/IPhone3D').then((m) => ({ default: m.IPhone3D })),
);

/**
 * ConsumerAppScene — Products rail panel #2.
 *
 * Layout: free-floating phone on the left (large), Flashback card + tabs
 * on the right. No bounding box. Cards tilt in CSS3D with mouse parallax.
 */
export function ConsumerAppScene() {
    const sceneRef = useRef<HTMLDivElement>(null);

    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const smx = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.6 });
    const smy = useSpring(my, { stiffness: 60, damping: 22, mass: 0.6 });

    useEffect(() => {
        if (typeof window === 'undefined' || !sceneRef.current) return;
        const isTouch =
            window.matchMedia('(hover: none)').matches ||
            window.matchMedia('(pointer: coarse)').matches;
        if (isTouch) return;
        const el = sceneRef.current;
        const onMove = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [mx, my]);

    return (
        <div
            ref={sceneRef}
            className="relative w-full"
            style={{ perspective: '1800px', minHeight: 'min(82vh, 720px)' }}
        >
            {/* NOTE: no localised background atmosphere. The phone and cards
                float over the page-level ambient (defined globally) so the
                section reads as "objects in space", not "objects inside a
                card container". */}

            <div className="relative z-10 grid w-full items-center gap-10 md:grid-cols-[1.05fr_1.1fr] md:gap-14 lg:gap-18">
                {/* LEFT — iPhone 3D, big and well-framed */}
                <div className="relative mx-auto h-[min(80vh,720px)] w-full max-w-[28rem] overflow-visible">
                    <Suspense fallback={<PhoneSkeleton />}>
                        <IPhone3D active />
                    </Suspense>
                </div>

                {/* RIGHT — Flashback card + tabs, free-floating */}
                <div className="relative grid gap-6">
                    <FlashbackCard smx={smx} smy={smy} />
                    <TabRow smx={smx} smy={smy} />
                </div>
            </div>
        </div>
    );
}

function PhoneSkeleton() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="relative h-[72%] w-[40%] rounded-[32px] border-2 border-[#1a1a1a] bg-black shadow-[0_0_70px_rgba(204,255,0,0.10),inset_0_4px_10px_rgba(255,255,255,0.05)]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-24 bg-[#1a1a1a] rounded-b-xl" />
                <motion.div className="absolute inset-x-5 top-14 h-2 rounded-full bg-yuzu/22" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
            </div>
        </div>
    );
}

/* ─── FLASHBACK CARD ──────────────────────────────────────────────────── */

interface CardProps {
    smx: ReturnType<typeof useSpring>;
    smy: ReturnType<typeof useSpring>;
}

function FlashbackCard({ smx, smy }: CardProps) {
    const rotY = useTransform(smx, [-0.5, 0.5], [-8, 4]);
    const rotX = useTransform(smy, [-0.5, 0.5], [5, -5]);
    const tX = useTransform(smx, [-0.5, 0.5], [8, -8]);
    const tY = useTransform(smy, [-0.5, 0.5], [6, -6]);

    return (
        <motion.div
            className="relative will-change-transform"
            style={{
                rotateY: rotY,
                rotateX: rotX,
                x: tX,
                y: tY,
                transformStyle: 'preserve-3d',
                transformOrigin: '10% 50%',
            }}
            initial={{ opacity: 0, x: 30, rotateY: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
            <div className="absolute -inset-4 -z-10 rounded-[2.4rem] bg-black/70 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-[#0a0a0a]/85 p-7 shadow-[0_40px_90px_rgba(0,0,0,0.6),0_0_70px_rgba(204,255,0,0.07),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl md:p-9">
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-yuzu/75 to-transparent shadow-[0_0_18px_rgba(204,255,0,0.5)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,180,80,0.14),transparent_58%)]" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inset-0 animate-ping rounded-full bg-yuzu opacity-75" />
                            <span className="relative h-1.5 w-1.5 rounded-full bg-yuzu" />
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-yuzu">
                            Flashback Engine
                        </span>
                        <span className="ml-auto font-mono text-[8.5px] uppercase tracking-[0.22em] text-silver/40">
                            Visit · 02
                        </span>
                    </div>

                    <div className="mt-5 font-serif text-[clamp(1.8rem,3.4vw,2.6rem)] italic leading-[1.05] tracking-tight text-white">
                        Osteria Lumina,
                        <br />
                        <span className="text-yuzu drop-shadow-[0_0_36px_rgba(204,255,0,0.34)]">
                            12 weeks ago.
                        </span>
                    </div>

                    <p className="mt-6 max-w-md font-serif text-[15px] italic leading-[1.55] text-silver/72">
                        Phone tap at the door. No profile, no app. TapIn learned wine,
                        pace, table, and service preference passively — and remembered
                        them the next time you walked in.
                    </p>

                    <div className="mt-7">
                        <div className="font-mono text-[8.5px] uppercase tracking-[0.32em] text-silver/45">
                            Learned that night
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {[
                                { k: 'Wine', v: 'Chablis · 2 glasses' },
                                { k: 'Pace', v: '2h 14m · slow' },
                                { k: 'Table', v: 'Quiet corner' },
                                { k: 'Allergy', v: 'No shellfish' },
                            ].map((t, i) => (
                                <motion.span
                                    key={t.k}
                                    initial={{ opacity: 0, y: 6 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-80px' }}
                                    transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                                    className="inline-flex items-center gap-2 rounded-full border border-yuzu/30 bg-yuzu/[0.05] px-3 py-1.5"
                                >
                                    <span className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-yuzu/85">
                                        {t.k}
                                    </span>
                                    <span className="font-mono text-[9.5px] tracking-[0.04em] text-white/85">
                                        {t.v}
                                    </span>
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── TABS ────────────────────────────────────────────────────────────── */

function TabRow({ smx, smy }: CardProps) {
    const rotY = useTransform(smx, [-0.5, 0.5], [-5, 2]);
    const rotX = useTransform(smy, [-0.5, 0.5], [4, -4]);

    const tabs = [
        { label: 'Taste Genome', value: '128d', sub: 'vector · live' },
        { label: 'Reservation Wallet', value: '4 / 12', sub: 'upcoming · past' },
        { label: 'Visit Flashbacks', value: '12', sub: 'venues · 30 days' },
    ];

    return (
        <motion.div
            className="grid grid-cols-3 gap-3"
            style={{
                rotateY: rotY,
                rotateX: rotX,
                transformStyle: 'preserve-3d',
                transformOrigin: '50% 0%',
            }}
        >
            {tabs.map((t, i) => (
                <motion.div
                    key={t.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -5 }}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/85 p-4 shadow-[0_22px_44px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-300 hover:border-yuzu/35 hover:bg-[#0a0a0a]/95"
                >
                    <div className="h-[2px] w-8 rounded-full bg-yuzu/55 transition-all duration-300 group-hover:w-16 group-hover:bg-yuzu" />
                    <div className="mt-3 font-serif text-2xl italic leading-none text-white">
                        {t.value}
                    </div>
                    <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-silver/55 transition-colors group-hover:text-white">
                        {t.label}
                    </div>
                    <div className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.2em] text-silver/30 transition-colors group-hover:text-yuzu/70">
                        {t.sub}
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}
