import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { KineticWords } from './KineticText';
import { ProductConstellation } from './ProductConstellation';
import type { ProductDefinition } from '../content/products';
import { SplitChars } from '../../components/ui/SplitChars';

interface ProductUniverseProps {
    products: ProductDefinition[];
}

/**
 * ProductUniverse — split editorial hero.
 *
 *   LEFT  → editorial typography (eyebrow + headline + description + tags)
 *   RIGHT → big asymmetric constellation of product cards floating in 3D
 *
 * The left text and the right constellation share a multi-layer mouse
 * parallax so they feel like one continuous space, not two columns.
 */
export function ProductUniverse({ products }: ProductUniverseProps) {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const smx = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.6 });
    const smy = useSpring(my, { stiffness: 60, damping: 22, mass: 0.6 });

    const typeX = useTransform(smx, [-0.5, 0.5], [-10, 10]);
    const typeY = useTransform(smy, [-0.5, 0.5], [-6, 6]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isTouch =
            window.matchMedia('(hover: none)').matches ||
            window.matchMedia('(pointer: coarse)').matches;
        if (isTouch) return;
        const onMove = (e: MouseEvent) => {
            mx.set(e.clientX / window.innerWidth - 0.5);
            my.set(e.clientY / window.innerHeight - 0.5);
        };
        window.addEventListener('mousemove', onMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMove);
    }, [mx, my]);

    return (
        <section className="relative w-full max-w-[100vw] px-4 pb-16 pt-28 md:px-8 md:pb-16 md:pt-32">
            {/* No section-local aurora or fade-to-black — the global ambient
                defined in ProductsPage spans the whole page so sections
                blend continuously without visible cuts. */}

            {/* ─── CONTENT — left typography + right constellation ─────── */}
            <div className="relative z-10 mx-auto grid w-full max-w-[1400px] items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14 xl:gap-20">
                {/* LEFT — editorial typography */}
                <motion.div style={{ x: typeX, y: typeY }} className="relative">
                    {/* Eyebrow */}
                    <div className="products-soft-reveal mb-7 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-yuzu/72 md:text-[11px]">
                        <span className="block h-px w-10 bg-yuzu/30" />
                        The protocol
                    </div>

                    {/* Headline — sans + serif italic yuzu accent */}
                    <h1 className="products-page-kinetic text-[clamp(2.85rem,7.4vw,7rem)] font-black leading-[0.84] tracking-tight text-silver">
                        <KineticWords text="The TapIn" />
                        <span className="block font-serif font-normal italic text-yuzu drop-shadow-[0_0_46px_rgba(204,255,0,0.34)]">
                            <SplitChars
                                text="Product Universe."
                                trigger="mount"
                                delay={0.5}
                                stagger={0.024}
                                rotateJitter={14}
                                duration={0.95}
                            />
                        </span>
                    </h1>

                    {/* Description — serif italic */}
                    <p className="products-soft-reveal mt-9 max-w-md font-serif text-[15px] italic leading-[1.55] text-silver/70 md:text-[17px]">
                        Six surfaces. One hospitality protocol. The widget that
                        becomes a passport, the conversation that becomes a
                        reservation, the floor that anticipates the night.
                    </p>

                    {/* Sub-line mono */}
                    <p className="products-soft-reveal mt-5 max-w-md font-mono text-[10.5px] uppercase tracking-[0.22em] text-silver/42">
                        Built to move together · Designed to feel like one room
                    </p>

                    {/* Tag chips */}
                    <div className="products-soft-reveal mt-10 flex flex-wrap gap-2">
                        {['Web', 'App', 'OS', 'Messages', 'AI', 'Integrations'].map((label, i) => (
                            <motion.span
                                key={label}
                                className="rounded-full border border-white/10 bg-white/[0.025] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-silver/55 backdrop-blur-sm"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 1.5 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {label}
                            </motion.span>
                        ))}
                    </div>

                    {/* Scroll hint at the bottom of the type block */}
                    <div className="mt-14 flex items-center gap-3 opacity-50">
                        <motion.span
                            className="block h-px w-8 bg-silver/40"
                            animate={{ scaleX: [1, 1.4, 1] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <span className="font-mono text-[9px] uppercase tracking-[0.42em] text-silver/40">
                            Scroll · explore each surface
                        </span>
                    </div>
                </motion.div>

                {/* RIGHT — constellation */}
                <div className="relative">
                    <ProductConstellation products={products} />
                </div>
            </div>
        </section>
    );
}
