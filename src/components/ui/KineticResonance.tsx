import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

export const KineticResonance = () => {
    const [isPressing, setIsPressing] = useState(false);
    const [chargeLevel, setChargeLevel] = useState(0);
    const [isSealed, setIsSealed] = useState(false);

    const chargeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const controls = useAnimation();

    const handleClimax = useCallback(() => {
        setIsSealed(true);
        setIsPressing(false);
        // Violent snap back
        controls.start({
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        });
    }, [controls]);

    // The Charging Loop
    useEffect(() => {
        if (isPressing && !isSealed) {
            // Start charging
            chargeInterval.current = setInterval(() => {
                setChargeLevel(prev => {
                    const next = prev + 2; // Speed of charge
                    if (next >= 100) {
                        handleClimax();
                        return 100;
                    }
                    return next;
                });
            }, 20); // 50 ticks a second
        } else {
            // Stop charging
            if (chargeInterval.current) {
                clearInterval(chargeInterval.current);
            }
        }

        return () => {
            if (chargeInterval.current) clearInterval(chargeInterval.current);
        };
    }, [isPressing, isSealed, handleClimax]);

    const handlePointerDown = () => {
        if (isSealed) return;
        setIsPressing(true);
        controls.start({ scale: 0.95, transition: { duration: 0.2 } });
    };

    const handlePointerUp = () => {
        setIsPressing(false);
        // Gamified cancel: If they released early before sealing, reset immediately.
        if (!isSealed && chargeLevel > 0 && chargeLevel < 100) {
            setChargeLevel(0);
            controls.start({ scale: 1 });
        }
    };

    const resetDemo = () => {
        setChargeLevel(0);
        setIsSealed(false);
        setIsPressing(false);
        controls.start({ scale: 1 });
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative min-h-[450px] overflow-hidden select-none">

            {/* Ambient Background Dark Glow during charge */}
            {!isSealed && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-200"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(204,255,0,0.1) 0%, transparent 50%)',
                        opacity: chargeLevel / 100
                    }}
                />
            )}

            {/* THE CLIMAX AURA EXPLOSION */}
            <AnimatePresence>
                {isSealed && (
                    <motion.div
                        initial={{ scale: 1, opacity: 0.5 }}
                        animate={{ scale: 20, opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0 z-0 bg-[#CCFF00] rounded-full pointer-events-none origin-center"
                        style={{ width: 100, height: 100, top: 'calc(50% - 50px)', left: 'calc(50% - 50px)' }}
                    />
                )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col items-center gap-12">

                {/* 1. The Typographic Counter / Status Text */}
                <div className="h-16 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!isSealed ? (
                            <motion.h3
                                key="counter"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="font-serif italic text-7xl tracking-tighter text-white drop-shadow-2xl"
                            >
                                ${chargeLevel}
                            </motion.h3>
                        ) : (
                            <motion.h3
                                key="status"
                                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                transition={{ duration: 0.8, type: "spring" }}
                                className="font-serif text-3xl md:text-4xl text-[#CCFF00] italic tracking-tight text-center drop-shadow-[0_0_20px_rgba(204,255,0,0.6)]"
                            >
                                INFLUENCE BROADCASTED.<br />VIP STATUS SECURED.
                            </motion.h3>
                        )}
                    </AnimatePresence>
                </div>

                {/* 2. The Core Button Engine */}
                <motion.div
                    className="relative w-32 h-32 rounded-full flex items-center justify-center cursor-pointer group touch-none"
                    onPanStart={handlePointerDown}
                    onPanEnd={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    animate={controls}
                >
                    {/* The physical glass button */}
                    <div className="absolute inset-0 rounded-full bg-[#050505] border border-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),_0_20px_40px_rgba(0,0,0,0.8)] z-10 group-hover:bg-[#0A0A0A] transition-colors" />

                    {/* The Charging SVG Ring */}
                    {!isSealed && (
                        <svg className="absolute inset-0 w-full h-full -rotate-90 z-20 pointer-events-none overflow-visible">
                            <circle
                                cx="64" cy="64" r="64"
                                fill="transparent"
                                stroke="rgba(204,255,0,0.2)"
                                strokeWidth="2"
                            />
                            <motion.circle
                                cx="64" cy="64" r="64"
                                fill="transparent"
                                stroke="#CCFF00"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray="402" // 2 * PI * 64 roughly
                                style={{ strokeDashoffset: `${402 - (402 * chargeLevel) / 100}` }}
                                className="transition-all duration-75"
                            />
                        </svg>
                    )}

                    {/* Button Text / Icon */}
                    <div className="relative z-30 pointer-events-none">
                        <AnimatePresence mode="wait">
                            {!isSealed ? (
                                <motion.span
                                    key="hold-text"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-white/50 group-hover:text-white transition-colors"
                                >
                                    [ HOLD ]
                                </motion.span>
                            ) : (
                                <motion.div
                                    key="check-icon"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    {/* Razor sharp checkmark */}
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                        <motion.path
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            d="M5 13L9 17L19 7"
                                            stroke="#CCFF00"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </motion.div>

                {/* Micro Reset Demo link */}
                <div className="h-8 flex items-center justify-center mt-8">
                    <AnimatePresence>
                        {isSealed && (
                            <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 1 }}
                                onClick={resetDemo}
                                className="font-mono text-[9px] uppercase tracking-widest text-[#CCFF00]/40 hover:text-[#CCFF00] transition-colors underline underline-offset-4 decoration-[#CCFF00]/20 hidden md:block"
                            >
                                Reset Demo
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};
