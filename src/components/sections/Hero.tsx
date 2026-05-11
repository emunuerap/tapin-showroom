import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';

import { DistrictMap } from '../ui/DistrictMap';
import { FloorAtmosphere } from '../ui/FloorAtmosphere';

interface HeroProps {
    /** Drives which atmosphere is rendered: city map (guests) vs. floor plan (venues). */
    activeView?: 'guests' | 'venues';
}

/**
 * Hero — the post-intro first impression.
 *
 * Two atmospheres, one universe:
 *  - For Guests → DistrictMap (city map of TapIn-enabled venues with live
 *    signal cards: Recognized, taste match, friends dining, etc.)
 *  - For Venues → FloorAtmosphere (top-down floor plan with live table
 *    states + KPI cards: RevPASH, coverage, dwell time, walk-ins)
 *
 * Both use the same palette (obsidian / yuzu / silver), the same paper-grain
 * texture, and the same vignette so toggling between them feels like one
 * coherent product rather than two pages.
 */
export function Hero({ activeView = 'guests' }: HeroProps) {
    const containerRef = useRef<HTMLElement>(null);

    // Cursor → normalized position (-0.5 .. +0.5)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Two springs at different "weights" to give layered parallax
    const sxFront = useSpring(mouseX, { mass: 0.3, stiffness: 80, damping: 22 });
    const syFront = useSpring(mouseY, { mass: 0.3, stiffness: 80, damping: 22 });
    const sxBack = useSpring(mouseX, { mass: 0.5, stiffness: 40, damping: 22 });
    const syBack = useSpring(mouseY, { mass: 0.5, stiffness: 40, damping: 22 });

    // Background plane: opposite direction to cursor (depth illusion)
    const bgX = useTransform(sxBack, [-0.5, 0.5], [10, -10]);
    const bgY = useTransform(syBack, [-0.5, 0.5], [6, -6]);
    // Title block: subtle same-direction
    const titleX = useTransform(sxBack, [-0.5, 0.5], [-8, 8]);
    const titleY = useTransform(syBack, [-0.5, 0.5], [-5, 5]);
    // Accent "Sentient.": stronger pull, faster spring → feels closest
    const accentX = useTransform(sxFront, [-0.5, 0.5], [-16, 16]);
    const accentY = useTransform(syFront, [-0.5, 0.5], [-10, 10]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isTouch =
            window.matchMedia('(hover: none)').matches ||
            window.matchMedia('(pointer: coarse)').matches;
        if (isTouch) return;

        function onMove(e: MouseEvent) {
            mouseX.set(e.clientX / window.innerWidth - 0.5);
            mouseY.set(e.clientY / window.innerHeight - 0.5);
        }
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, [mouseX, mouseY]);

    // Entrance choreography
    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            tl.from(
                '.hero-map',
                { opacity: 0, scale: 1.05, duration: 1.4, ease: 'power3.out' },
                0.0
            )
                .from(
                    '.hero-title-word',
                    {
                        opacity: 0,
                        y: 48,
                        rotateX: -28,
                        duration: 1.0,
                        stagger: 0.08,
                        ease: 'power4.out',
                    },
                    0.50
                )
                .from(
                    '.hero-accent',
                    {
                        opacity: 0,
                        y: 56,
                        scale: 0.96,
                        filter: 'blur(8px)',
                        duration: 1.2,
                        ease: 'power4.out',
                    },
                    0.85
                )
                .from('.hero-description', { opacity: 0, y: 14, duration: 0.8 }, 1.20)
                .from('.hero-scroll', { opacity: 0, duration: 0.9 }, 1.45);

            // Subtle continuous bob on the scroll indicator (matches original)
            gsap.to('.hero-scroll', {
                y: 10,
                duration: 1.6,
                ease: 'power2.inOut',
                repeat: -1,
                yoyo: true,
                delay: 2.5,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    function scrollToNext() {
        const next = containerRef.current?.nextElementSibling as HTMLElement | null;
        if (next) {
            next.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
        }
    }

    return (
        <section
            ref={containerRef}
            className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Atmosphere — switches between city-map (guests) and floor-plan (venues) */}
            <motion.div
                className="hero-map absolute inset-0"
                style={{ x: bgX, y: bgY }}
            >
                <AnimatePresence mode="wait">
                    {activeView === 'guests' ? (
                        <motion.div
                            key="atmosphere-guests"
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <DistrictMap />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="atmosphere-venues"
                            className="absolute inset-0"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <FloorAtmosphere />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Vignette: dim edges so the title is the focal point. */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.6)_72%,#050505_100%)]" />

            {/* Foreground: title + accent + description */}
            <motion.div
                className="relative z-10 text-center flex flex-col items-center px-6"
                style={{ x: titleX, y: titleY }}
            >
                <h1 className="font-sans font-black text-5xl md:text-8xl tracking-tighter text-silver leading-[0.95] [perspective:1000px]">
                    <span className="hero-title-word inline-block will-change-transform">
                        Hospitality
                    </span>{' '}
                    <span className="hero-title-word inline-block will-change-transform">
                        is
                    </span>{' '}
                    <span className="hero-title-word inline-block will-change-transform">
                        now
                    </span>
                </h1>

                <motion.span
                    className="hero-accent font-serif italic font-normal text-6xl md:text-9xl text-yuzu mt-3 md:mt-4 block leading-none drop-shadow-[0_0_30px_rgba(204,255,0,0.28)] will-change-transform"
                    style={{ x: accentX, y: accentY }}
                >
                    Sentient.
                </motion.span>

                <p className="hero-description mt-10 font-mono text-xs md:text-sm text-silver/60 max-w-md leading-relaxed tracking-wide min-h-[3.4em]">
                    The first Sentient Hospitality OS.
                    <br />
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={`subtitle-${activeView}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="inline-block"
                        >
                            {activeView === 'guests'
                                ? "It doesn't wait for orders. It anticipates desire."
                                : 'Your floor, watched. Your night, anticipated.'}
                        </motion.span>
                    </AnimatePresence>
                </p>
            </motion.div>

            {/* Scroll indicator: mouse-shaped pill + traveling yuzu dot + "Scroll" label */}
            <ScrollMouseIndicator onClick={scrollToNext} />
        </section>
    );
}

function ScrollMouseIndicator({ onClick }: { onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            aria-label="Scroll to explore"
            className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 group cursor-pointer p-2 -m-2"
        >
            {/* Mouse-shaped pill */}
            <span className="relative block w-7 h-11 rounded-full border border-white/20 group-hover:border-yuzu/70 transition-colors duration-500 backdrop-blur-md flex items-start justify-center pt-2">
                <motion.span
                    className="block w-1 h-1.5 rounded-full bg-yuzu shadow-[0_0_6px_rgba(204,255,0,0.6)]"
                    animate={{ y: [0, 14, 0], opacity: [1, 0.4, 1] }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </span>
            {/* Label */}
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-silver/40 group-hover:text-silver/80 transition-colors duration-500">
                Scroll
            </span>
        </button>
    );
}
