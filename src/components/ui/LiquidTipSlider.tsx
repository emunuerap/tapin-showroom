import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

export function LiquidTipSlider() {
    const constraintsRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);
    const [success, setSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    const [particles] = useState(() => {
        return [...Array(30)].map(() => ({
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            scale: Math.random() * 0.5 + 0.5,
            rotate: Math.random() * 360,
            duration: 2 + Math.random(),
            color: Math.random() > 0.5 ? '#CCFF00' : '#FFC200'
        }));
    });

    const x = useMotionValue(0);
    const containerWidth = 300; // Estimated max drag width minus handle

    // Transform x to percentage (0 to 1)
    const percentage = useTransform(x, [0, containerWidth], [0, 1]);

    // Transform percentage to actual tip amount (e.g. 0% to 30%)
    const tipAmount = useTransform(percentage, [0, 1], [0, 30]);

    // Transform colors based on percentage
    const bgOpacity = useTransform(percentage, [0, 1], [0.1, 0.4]);
    const glowIntensity = useTransform(percentage, [0, 1], [0, 40]);

    useEffect(() => {
        // If user dragged past ~80% and releases, trigger success
        const unsubscribe = x.on("change", (latest) => {
            if (!success && latest > containerWidth * 0.8) {
                // We keep tracking, success evaluates on release via onDragEnd
            }
        });
        return () => unsubscribe();
    }, [x, success, containerWidth]);

    const handleDragEnd = () => {
        if (x.get() > containerWidth * 0.8) {
            setSuccess(true);
            setShowConfetti(true);
            x.set(containerWidth); // Snap to end

            setTimeout(() => {
                setShowConfetti(false);
                setSuccess(false);
                x.set(0); // Reset after typical success duration
            }, 4000);
        } else {
            x.set(0); // Snap back if aborted early
        }
    };

    return (
        <div className="w-full flex flex-col items-center gap-8 relative">

            <div className="text-center">
                <h3 className="font-serif italic text-3xl mb-2 text-silver">The Gratitude Protocol</h3>
                <div className="font-mono text-xs text-yuzu">Signal VIP status through generosity.</div>
            </div>

            <div
                className="w-full max-w-sm h-16 rounded-full relative bg-obsidian border border-white/5 flex items-center p-2 shadow-inner"
                ref={constraintsRef}
            >
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        backgroundColor: 'rgba(204, 255, 0, var(--bg-op))',
                        boxShadow: '0 0 var(--glow) rgba(204, 255, 0, 0.2)'
                    }}
                    custom={{ '--bg-op': bgOpacity, '--glow': glowIntensity }}
                />

                <div className="absolute inset-0 flex items-center justify-center font-sans font-bold text-silver/40 pointer-events-none select-none">
                    Slide to Signal VIP
                </div>

                <motion.div
                    ref={handleRef}
                    className="w-12 h-12 bg-yuzu rounded-full shadow-[0_0_15px_rgba(204,255,0,0.5)] z-10 flex items-center justify-center cursor-grab active:cursor-grabbing"
                    style={{ x }}
                    drag="x"
                    dragConstraints={{ left: 0, right: containerWidth }}
                    dragElastic={0}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                >
                    <div className="w-2 h-2 rounded-full bg-obsidian" />
                </motion.div>

                <motion.div
                    className="absolute right-6 z-0 font-mono font-bold text-sm text-obsidian mix-blend-difference pointer-events-none"
                >
                    <motion.span>{useTransform(tipAmount, (v) => `${Math.round(v)}%`)}</motion.span>
                </motion.div>
            </div>

            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        className="absolute -top-16 bg-obsidian border border-yuzu/50 p-4 rounded-xl shadow-[0_20px_40px_rgba(204,255,0,0.15)] flex flex-col items-center z-50 pointer-events-none"
                    >
                        <div className="font-sans font-black text-yuzu tracking-tight flex items-center gap-2">
                            Badge Unlocked
                        </div>
                        <div className="font-mono text-xs text-silver mt-1">Generous Patron Signal Sent</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none overflow-visible z-0 flex items-center justify-center">
                    {/* Minimal CSS Confetti logic using framer-motion particles */}
                    {particles.map((p, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: 0,
                                y: 0,
                                scale: 0,
                                rotate: 0
                            }}
                            animate={{
                                x: p.x,
                                y: p.y,
                                scale: p.scale,
                                rotate: p.rotate,
                                opacity: [1, 1, 0]
                            }}
                            transition={{
                                duration: p.duration,
                                ease: "easeOut"
                            }}
                            className="absolute w-2 h-2 rounded-sm"
                            style={{ backgroundColor: p.color }}
                        />
                    ))}
                </div>
            )}

        </div>
    );
}
