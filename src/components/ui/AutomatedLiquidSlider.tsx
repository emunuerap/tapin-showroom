import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export const AutomatedLiquidSlider = () => {
    // 0: Idle, 1: Swiping, 2: Flashing/Confirmed
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Master Animation Loop
        const runLoop = async () => {
            while (true) {
                // [0s] Idle
                setPhase(0);
                await new Promise(r => setTimeout(r, 1000));

                // [1s] Swipe Start
                setPhase(1);
                await new Promise(r => setTimeout(r, 1000)); // swipe takes 1s

                // [2s] Flash & Confirm State
                setPhase(2);
                await new Promise(r => setTimeout(r, 2000)); // hold confirmed for 2s

                // Loops back to 0
            }
        };
        runLoop();
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">

            {/* The Badge Popup that appears ABOVE the slider */}
            <div className="h-20 w-full flex items-end justify-center mb-6 absolute -top-10 z-20 pointer-events-none">
                <AnimatePresence>
                    {phase === 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-[#050505] border border-[#CCFF00]/50 px-5 py-3 rounded-2xl flex flex-col items-center gap-1 shadow-[0_15px_40px_rgba(204,255,0,0.3)]"
                        >
                            <span className="font-sans font-bold text-xs text-white uppercase tracking-wider">VIP Status Confirmed</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
                                <span className="font-mono text-[11px] text-[#CCFF00] font-bold">+100 Gratitude XP</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* The Physical Hardware Track */}
            <div className="relative w-full max-w-[280px] h-[60px] bg-[#0A0A0A] border border-white/10 rounded-full flex items-center px-1.5 overflow-hidden shadow-[inset_0_5px_15px_rgba(0,0,0,0.8),0_1px_1px_rgba(255,255,255,0.05)] z-10">
                {/* Track Background Flashing */}
                <motion.div
                    className="absolute left-0 top-0 h-full bg-[#CCFF00]"
                    animate={{
                        width: phase === 0 ? "0%" : phase === 1 ? "100%" : "100%",
                        opacity: phase === 2 ? 1 : 0.05
                    }}
                    transition={{
                        width: { duration: phase === 1 ? 1 : 0, ease: "anticipate" },
                        opacity: { duration: 0.2 }
                    }}
                />

                {/* Idle Text */}
                <motion.span
                    className="absolute w-full text-center font-sans font-medium text-[11px] text-white/40 truncate z-0 pointer-events-none tracking-[0.2em] uppercase"
                    animate={{ opacity: phase === 0 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    Demo // Slide to leave $20 Tip
                </motion.span>

                {/* Success Text hint */}
                <motion.span
                    className="absolute w-full text-center font-sans font-bold text-[12px] text-black truncate z-10 pointer-events-none tracking-widest uppercase shadow-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === 2 ? 1 : 0 }}
                    transition={{ duration: 0.1 }}
                >
                    VIP STATUS CONFIRMED
                </motion.span>

                {/* Simulated Thumb Indicator */}
                <motion.div
                    className="relative z-20 h-[48px] w-[64px] bg-[#CCFF00] rounded-full shadow-[0_0_20px_rgba(204,255,0,0.4)] flex items-center justify-center border border-[#CCFF00]/50"
                    animate={{
                        x: phase === 1 || phase === 2 ? "202px" : "0px", // 280 (track) - 16 (padding) - 64 (thumb) ~ 200px travel
                        opacity: phase === 2 ? 0 : 1,
                        scale: phase === 2 ? 0.8 : 1
                    }}
                    transition={{
                        x: { duration: phase === 1 ? 1 : 0.5, type: phase === 1 ? "spring" : "tween", bounce: 0.1 },
                        opacity: { duration: 0.1 },
                        scale: { duration: 0.1 }
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#050505" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>
            </div>
        </div>
    );
};
