import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export const GratitudeTransmutationUI = () => {
    // 0: Idle (The Capital)
    // 1: Scanning/Transmuting
    // 2: The Status (G-SCORE UPGRADED)
    // 3: Validation Hold
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        const runLoop = async () => {
            while (true) {
                // Phase 0: The Capital
                setPhase(0);
                await new Promise(r => setTimeout(r, 2000));

                // Phase 1: The Transmutation (Scanning)
                setPhase(1);
                await new Promise(r => setTimeout(r, 1200));

                // Phase 2 & 3: The Status & Validation Hold
                setPhase(2);
                await new Promise(r => setTimeout(r, 2500));
            }
        };
        runLoop();
    }, []);

    return (
        <div className="w-full relative flex flex-col items-center justify-center min-h-[300px] py-16">

            {/* The Outer Glass Container (Card expands slightly on validation) */}
            <motion.div
                className="relative w-full max-w-[280px] h-[140px] bg-[#050505] border border-white/10 rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-10"
                animate={{
                    scale: phase === 2 ? 1.02 : 1,
                    boxShadow: phase === 2 ? "inset 0 0 40px rgba(204,255,0,0.05), 0 20px 40px rgba(0,0,0,0.9)" : "inset 0 0 0px rgba(204,255,0,0), 0 10px 30px rgba(0,0,0,0.8)",
                    borderColor: phase === 2 ? "rgba(204,255,0,0.3)" : "rgba(255,255,255,0.1)"
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >

                {/* The Scanning Line (Appears in Phase 1) */}
                <motion.div
                    className="absolute top-0 bottom-0 w-[4px] bg-[#CCFF00] shadow-[0_0_20px_10px_rgba(204,255,0,0.2)] z-30"
                    initial={{ left: "-10%" }}
                    animate={{ left: phase === 1 ? "110%" : "-10%" }}
                    transition={{ duration: phase === 1 ? 1 : 0, ease: "anticipate" }}
                    style={{ opacity: phase === 1 ? 1 : 0 }}
                />

                <AnimatePresence mode="wait">
                    {phase === 0 || phase === 1 ? (
                        <motion.div
                            key="capital"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center w-full px-6"
                        >
                            <span className="font-mono text-[10px] text-white/40 tracking-[0.2em] uppercase mb-2">
                                Gratitude Tip
                            </span>

                            {/* The Scrambling Text Effect during Scan */}
                            <div className="relative overflow-hidden w-full flex justify-center">
                                <motion.span
                                    className="font-serif text-4xl text-white italic tracking-tight"
                                    animate={{ opacity: phase === 1 ? [1, 0] : 1 }}
                                    transition={{ duration: 0.05, delay: 0.5 }} // disappear mid-scan
                                >
                                    $50.00
                                </motion.span>

                                {phase === 1 && (
                                    <motion.span
                                        className="absolute font-mono text-3xl text-[#CCFF00] tracking-widest font-bold"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ duration: 0.2, delay: 0.55 }}
                                    >
                                        0x9A...
                                    </motion.span>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="status"
                            initial={{ opacity: 0, scale: 1.1, filter: "blur(4px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                            className="flex flex-col items-center justify-center w-full h-full bg-[#0A0A0A] relative"
                        >
                            {/* Glowing Aura inside the receipt */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.1)_0%,transparent_70%)] pointer-events-none" />

                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#CCFF00]/40 bg-[#CCFF00]/10 mb-3 shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 13L9 17L19 7" stroke="#CCFF00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <span className="font-mono text-[10px] text-[#CCFF00] tracking-[0.2em] font-bold uppercase z-10 shadow-sm drop-shadow-[0_0_5px_rgba(204,255,0,0.5)]">
                                G-SCORE UPGRADED: 9.8
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
};
