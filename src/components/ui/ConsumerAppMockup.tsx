import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';

export const ConsumerAppMockup = () => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [tipAmount, setTipAmount] = useState(0);
    const [badgeRevealed, setBadgeRevealed] = useState(false);

    // Add refs for drag constraints
    const tipTrackRef = useRef<HTMLDivElement>(null);
    const swipeTrackRef = useRef<HTMLDivElement>(null);

    // Swipe gesture values
    const swipeX = useMotionValue(0);
    const swipeOpacity = useTransform(swipeX, [0, 150], [1, 0]);
    const swipeBg = useTransform(swipeX, [0, 150], ['rgba(255,255,255,0.05)', 'rgba(204,255,0,0.1)']);

    // Tipping liquid slider values
    const tipX = useMotionValue(0);
    const currentTip = useTransform(tipX, [0, 210], [0, 25]);

    // The total travel distance is roughly 216px (244px track width - 28px thumb width). 
    // We map that motion value to a 0% -> 100% width, adding some offset so it looks correct visually.
    const tipWidth = useTransform(tipX, [0, 216], ['14px', '100%']);

    // Update tip display when dragging
    useMotionValueEvent(currentTip, "change", (latest) => {
        if (!badgeRevealed) {
            setTipAmount(parseFloat(latest.toFixed(0)));
        }
    });

    const handleSwipeEnd = () => {
        const x = swipeX.get();
        if (x > 120) {
            setIsUnlocked(true);
        } else {
            swipeX.set(0);
        }
    };

    const handleTipEnd = () => {
        const x = tipX.get();
        if (x > 180) { // Require almost full swipe
            setBadgeRevealed(true);
        } else {
            tipX.set(0);
            setTipAmount(0);
        }
    };

    return (
        <div className="relative w-full max-w-[340px] mx-auto h-[680px] bg-[#050505] rounded-[45px] border-[10px] border-zinc-900 shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col font-sans">
            {/* Phone Notch/Status Bar */}
            <div className="absolute top-0 w-full h-8 flex justify-between items-center px-7 z-20">
                <span className="text-[11px] text-white font-medium tracking-wide">9:41</span>
                <div className="w-32 h-6 bg-black rounded-b-2xl absolute left-1/2 -translate-x-1/2 flex justify-center pt-1">
                    <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                </div>
                <div className="flex gap-1.5 items-center opacity-80">
                    <div className="w-3.5 h-3 border-[1.5px] border-white rounded-[3px] relative">
                        <div className="absolute top-0.5 right-[1px] w-[50%] h-[50%] bg-white rounded-[1px]"></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative pt-12 flex flex-col px-6 pb-8 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">

                {/* Header Content */}
                <div className="mt-4 mb-6 text-center space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-2">
                        <span className="w-1.5 h-1.5 bg-yuzu rounded-full animate-pulse"></span>
                        <span className="text-[9px] text-silver font-mono uppercase tracking-widest">Active Table Sync</span>
                    </div>
                    <h2 className="text-white text-2xl font-serif tracking-tight">Kurobi Social</h2>
                    <p className="text-silver/60 text-xs font-mono uppercase tracking-wider">Table 4 • Check #8902</p>
                </div>

                {/* Taste Genome Visualizer / Check Details Toggle */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-[24px] p-5 mb-auto relative backdrop-blur-md">

                    <AnimatePresence mode="wait">
                        {!isUnlocked ? (
                            <motion.div
                                key="check"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3">
                                    <span className="text-white text-sm font-medium">The Tab</span>
                                    <span className="text-yuzu text-[10px] font-mono border border-yuzu/30 px-2 py-0.5 rounded-sm bg-yuzu/10">UNPAID</span>
                                </div>
                                <div className="space-y-3 mb-4">
                                    <div className="flex justify-between items-start text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-silver">Spicy Tuna Crispy Rice</span>
                                            <span className="text-silver/40 text-[10px]">Qty: 1</span>
                                        </div>
                                        <span className="text-white font-mono">$24.00</span>
                                    </div>
                                    <div className="flex justify-between items-start text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-silver">Miso Glazed Black Cod</span>
                                            <span className="text-silver/40 text-[10px]">Qty: 1</span>
                                        </div>
                                        <span className="text-white font-mono">$45.00</span>
                                    </div>
                                    <div className="flex justify-between items-start text-sm">
                                        <div className="flex flex-col">
                                            <span className="text-silver">Wagyu Gyoza</span>
                                            <span className="text-silver/40 text-[10px]">Qty: 1</span>
                                        </div>
                                        <span className="text-white font-mono">$28.00</span>
                                    </div>
                                </div>
                                <div className="border-t border-white/10 pt-4 flex justify-between font-medium items-end">
                                    <span className="text-silver text-sm uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-white text-xl font-serif italic">$142.00</span>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="genome"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-2"
                            >
                                <h4 className="text-silver text-[10px] tracking-[0.2em] uppercase mb-4 font-mono">Taste Genome Updated</h4>

                                {/* Abstract Taste Radar SVG */}
                                <div className="relative w-32 h-32 mb-4">
                                    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                                        {/* Outer grids */}
                                        <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                                        <polygon points="50,20 80,37 80,63 50,80 20,63 20,37" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                                        <polygon points="50,35 65,43.5 65,56.5 50,65 35,56.5 35,43.5" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                                        {/* Axes */}
                                        <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                                        <line x1="5" y1="27.5" x2="95" y2="72.5" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                                        <line x1="5" y1="72.5" x2="95" y2="27.5" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                                        {/* Data Polygon */}
                                        <motion.polygon
                                            initial={{ points: "50,50 50,50 50,50 50,50 50,50 50,50", opacity: 0 }}
                                            animate={{ points: "50,25 75,40 85,72.5 50,85 15,60 30,27.5", opacity: 1 }}
                                            transition={{ duration: 1, delay: 0.2 }}
                                            fill="rgba(204,255,0,0.2)"
                                            stroke="#CCFF00"
                                            strokeWidth="1.5"
                                        />

                                        <circle cx="50" cy="25" r="2" fill="#CCFF00" />
                                        <circle cx="75" cy="40" r="2" fill="#CCFF00" />
                                        <circle cx="85" cy="72.5" r="2" fill="#CCFF00" />
                                        <circle cx="50" cy="85" r="2" fill="#CCFF00" />
                                    </svg>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    <span className="text-[9px] text-white/60 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-full">Umami +12%</span>
                                    <span className="text-[9px] text-white/60 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded-full">Spice +5%</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence mode="wait">
                    {!isUnlocked ? (
                        <motion.div
                            key="swipe-to-pay"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="mt-4 w-full"
                        >
                            <div className="text-center mb-4 text-[10px] text-silver/60 uppercase tracking-[0.2em] font-mono">
                                Authorize Payment
                            </div>
                            <motion.div
                                ref={swipeTrackRef}
                                className="w-full h-16 rounded-full border border-white/10 relative flex items-center px-1.5 overflow-hidden backdrop-blur-md"
                                style={{ backgroundColor: swipeBg }}
                            >
                                <motion.div
                                    className="absolute w-full text-center text-sm font-medium pointer-events-none text-white/50 tracking-wide"
                                    style={{ opacity: swipeOpacity }}
                                >
                                    Slide to Confirm
                                </motion.div>
                                <motion.div
                                    drag="x"
                                    dragConstraints={swipeTrackRef}
                                    dragElastic={0.05}
                                    onDragEnd={handleSwipeEnd}
                                    style={{ x: swipeX }}
                                    className="w-[52px] h-[52px] bg-white rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing z-10 hover:scale-105 transition-transform"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="gratitude-protocol"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-2 w-full flex flex-col items-center"
                        >
                            {!badgeRevealed ? (
                                <>
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-full text-center py-3 bg-yuzu text-black font-bold uppercase tracking-widest text-xs rounded-xl mb-6 shadow-[0_0_30px_rgba(204,255,0,0.15)] flex justify-center items-center gap-2"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        PAYMENT SECURED
                                    </motion.div>

                                    <div className="text-center w-full mb-4 bg-white/5 p-5 rounded-[24px] border border-white/10">
                                        <div className="flex justify-between items-center mb-3">
                                            <p className="text-silver text-[10px] tracking-widest uppercase font-mono">Gratitude Protocol</p>
                                            <span className="text-yuzu text-xl font-serif italic">${tipAmount.toFixed(2)}</span>
                                        </div>

                                        <div ref={tipTrackRef} className="pt-4 pb-2 relative flex items-center w-full">
                                            <div className="w-full h-1.5 bg-black rounded-full relative overflow-hidden shadow-inner flex items-center">
                                                <motion.div
                                                    className="absolute top-0 left-0 h-full bg-yuzu shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                                                    style={{ width: tipWidth }}
                                                />
                                            </div>
                                            <motion.div
                                                drag="x"
                                                dragConstraints={tipTrackRef}
                                                dragElastic={0}
                                                onDragEnd={handleTipEnd}
                                                style={{ x: tipX }}
                                                className="w-7 h-7 bg-white border-[3px] border-[#0A0A0A] shadow-md rounded-full absolute left-0 cursor-grab active:cursor-grabbing flex items-center justify-center group z-10"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-black opacity-20 group-hover:opacity-100 transition-opacity"></div>
                                            </motion.div>
                                        </div>

                                        <div className="flex justify-between text-[9px] text-silver/40 mt-3 uppercase tracking-wider font-mono">
                                            <span>Routine</span>
                                            <span className="text-yuzu/70">Generous</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="w-full h-[180px] bg-gradient-to-tr from-yuzu/5 to-yuzu/10 border border-yuzu/20 rounded-[24px] flex flex-col items-center justify-center relative overflow-hidden group shadow-[inset_0_0_30px_rgba(204,255,0,0.05)]"
                                >
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.2)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                                        className="w-20 h-20 rounded-full border-[0.5px] border-dashed border-yuzu/40 flex items-center justify-center mb-3 relative"
                                    >
                                        <div className="absolute inset-2 rounded-full border border-yuzu/20"></div>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, type: "spring" }}
                                            className="text-3xl"
                                        >
                                            ⭐
                                        </motion.div>
                                    </motion.div>

                                    <h3 className="text-yuzu font-medium tracking-widest text-xs uppercase mb-1">Generous Patron</h3>
                                    <p className="text-silver/50 text-[9px] uppercase tracking-[0.2em] font-mono">Network Status Acquired</p>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};
