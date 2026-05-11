import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const KineticAuthEngine = () => {
    // Exact Phases: idle (0-1s) -> sliding (1-1.5s) -> confirming (1.5-3s) -> success (3-5s)
    const [phase, setPhase] = useState<'idle' | 'sliding' | 'confirming' | 'success'>('idle');
    const [timeLeft, setTimeLeft] = useState(5.0);

    useEffect(() => {
        let phaseTimer: ReturnType<typeof setTimeout>;
        let tickTimer: ReturnType<typeof setInterval>;

        if (phase === 'idle') {
            phaseTimer = setTimeout(() => {
                setPhase('sliding');
            }, 1000); // Wait 1s before swipe
        } else if (phase === 'sliding') {
            // Sliding takes exactly 0.5s via CSS/Framer
            let current = 400; // 4 seconds left
            tickTimer = setInterval(() => {
                current -= 1;
                setTimeLeft(current / 100);
            }, 10);

            phaseTimer = setTimeout(() => {
                clearInterval(tickTimer);
                setTimeLeft(3.5); // Set state inside the timeout transition to avoid sync warning
                setPhase('confirming');
            }, 500); // 1.5s mark
        } else if (phase === 'confirming') {
            // Hold at 3.5s for the confirmation flash
            phaseTimer = setTimeout(() => {
                setTimeLeft(0); // Set state inside the timeout transition
                setPhase('success');
            }, 1500); // 3.0s mark
        } else if (phase === 'success') {
            phaseTimer = setTimeout(() => {
                setTimeLeft(5.0); // Reset timer here instead of idle directly
                setPhase('idle');
            }, 2000); // 5.0s mark (Reset loop)
        }

        return () => {
            clearTimeout(phaseTimer);
            clearInterval(tickTimer);
        };
    }, [phase]);

    // Calculate SVG circle properties
    const strokeWidth = 2;
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    // Map timeLeft (5 -> 0) to dashoffset (0 -> circumference)
    const dashoffset = circumference - (timeLeft / 5) * circumference;

    return (
        <div className="relative w-full h-[450px] bg-[#050505] rounded-3xl p-8 flex flex-col items-center justify-center overflow-hidden isolation-auto">
            {/* Massive ultra-faded Neon Lime radial glow - PURE BACKGROUND DEPTH */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.1)_0%,transparent_60%)] pointer-events-none z-0" />

            {/* Floating Single Glass Widget */}
            <motion.div
                animate={{
                    scale: phase === 'success' ? 0.95 : 1,
                    borderColor: phase === 'success' ? 'rgba(204,255,0,0.4)' : 'rgba(255,255,255,0.08)',
                    boxShadow: phase === 'success' ? '0 0 50px rgba(204,255,0,0.15)' : '0 20px 50px rgba(0,0,0,0.8)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative z-10 w-full max-w-[340px] bg-[#0A0A0A]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex flex-col justify-between overflow-hidden"
            >
                <AnimatePresence mode="wait">
                    {phase !== 'success' ? (
                        <motion.div
                            key="sliding-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="w-full flex flex-col h-[280px]"
                        >
                            {/* Header */}
                            <div className="flex flex-col items-center gap-1 text-center mt-2 mb-8">
                                <span className="font-serif italic text-3xl text-white tracking-tight">Kurobi Social</span>
                                <span className="font-sans text-[11px] text-white/40 uppercase tracking-[0.2em]">Table for 2</span>
                            </div>

                            {/* Clean Phone Input */}
                            <div className="w-full bg-[#111111] border border-white/5 rounded-2xl p-5 flex items-center justify-center shadow-inner mb-auto">
                                <span className="font-sans text-white/90 tracking-widest text-base flex items-center gap-1">
                                    +1 (555) 019 82
                                </span>
                            </div>

                            {/* Swipe Button / SVG Timer Integration */}
                            <div className="w-full flex items-center justify-center mt-auto relative">
                                {/* SVG Circular Progress Ring */}
                                <div className="absolute w-[64px] h-[64px] flex items-center justify-center pointer-events-none">
                                    <svg className="w-full h-full transform -rotate-90">
                                        {/* Background Track */}
                                        <circle
                                            cx="32"
                                            cy="32"
                                            r={radius}
                                            fill="none"
                                            stroke="rgba(255,255,255,0.05)"
                                            strokeWidth={strokeWidth}
                                        />
                                        {/* Dynamic Progress Fill */}
                                        <motion.circle
                                            cx="32"
                                            cy="32"
                                            r={radius}
                                            fill="none"
                                            stroke="#CCFF00"
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={circumference}
                                            strokeDashoffset={dashoffset}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-dashoffset 10ms linear' }}
                                        />
                                    </svg>
                                </div>

                                {/* Slider Track */}
                                <div className="w-full h-14 bg-[#111111] border border-black rounded-full shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] flex items-center overflow-hidden px-1 relative">
                                    <motion.div
                                        className="absolute left-0 top-0 h-full"
                                        animate={{
                                            width: phase === 'idle' ? '0%' : '100%',
                                            backgroundColor: phase === 'confirming' ? 'rgba(204,255,0,0.8)' : 'rgba(204,255,0,0.1)'
                                        }}
                                        transition={{
                                            width: { type: "spring", stiffness: 400, damping: 30 },
                                            backgroundColor: { duration: 0.1 }
                                        }}
                                    />
                                    <span
                                        className="absolute w-full text-center font-sans font-bold text-[10px] truncate z-0 pointer-events-none tracking-[0.2em] uppercase transition-colors duration-200"
                                        style={{ color: phase === 'confirming' ? '#000000' : 'rgba(255,255,255,0.2)' }}
                                    >
                                        {phase === 'confirming' ? '✓ CONFIRMED' : 'CONFIRM'}
                                    </span>

                                    {/* The Thumb */}
                                    <motion.div
                                        className="relative z-10 w-12 h-12 bg-white rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] flex items-center justify-center cursor-pointer"
                                        initial={{ x: 0 }}
                                        animate={{ x: phase === 'idle' ? 0 : 232 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#050505" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-content"
                            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full flex items-center justify-center h-[280px]"
                        >
                            <span className="font-serif italic text-[38px] text-[#FAFAFA] text-center leading-none tracking-tight drop-shadow-[0_0_30px_rgba(255,255,255,0.4)] relative">
                                Your table <br />awaits.
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};
