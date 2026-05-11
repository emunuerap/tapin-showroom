import { motion } from 'framer-motion';

interface NavbarProps {
    activeView: 'guests' | 'venues';
    setActiveView: (view: 'guests' | 'venues') => void;
}

export function Navbar({ activeView, setActiveView }: NavbarProps) {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center w-full max-w-[90%] md:max-w-2xl">
            {/* Minimalist Dock */}
            <div className="flex items-center justify-between w-full px-2 py-1.5 bg-[#0A0A0A]/80 backdrop-blur-2xl border border-white/5 shadow-[0_4px_24px_rgba(0,0,0,0.6)] rounded-full">
                {/* Left (Logo) — circular yuzu dot for visual consistency with hero wordmark */}
                <div className="flex justify-start items-center pl-4">
                    <span className="text-sm font-bold tracking-tighter text-silver leading-none flex items-baseline">
                        TapIn
                        <span
                            aria-hidden="true"
                            className="ml-1 inline-block w-[5px] h-[5px] rounded-full bg-yuzu shadow-[0_0_6px_1px_rgba(204,255,0,0.55)]"
                        />
                    </span>
                </div>

                {/* Center (Toggle) */}
                <div className="flex justify-center items-center">
                    <div className="flex items-center p-0.5 bg-black/60 border border-white/5 rounded-full relative">
                        <button
                            onClick={() => setActiveView('guests')}
                            className={`relative z-10 px-4 py-1 text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] font-sans uppercase transition-colors duration-300 ${activeView === 'guests' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                        >
                            For Guests
                            {activeView === 'guests' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-yuzu/15 border border-yuzu/30 shadow-[0_0_12px_rgba(204,255,0,0.18)] rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveView('venues')}
                            className={`relative z-10 px-4 py-1 text-[10px] sm:text-[11px] font-semibold tracking-[0.15em] font-sans uppercase transition-colors duration-300 ${activeView === 'venues' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                        >
                            For Venues
                            {activeView === 'venues' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-yuzu/15 border border-yuzu/30 shadow-[0_0_12px_rgba(204,255,0,0.18)] rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* Right (CTA) */}
                <div className="flex justify-end pr-1 items-center">
                    {activeView === 'guests' ? (
                        <button className="px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold text-white/90 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 transition-all whitespace-nowrap">
                            Get the App
                        </button>
                    ) : (
                        <button className="px-4 py-1.5 text-[10px] sm:text-[11px] font-semibold text-obsidian bg-yuzu rounded-full hover:scale-105 transition-all shadow-[0_0_10px_rgba(204,255,0,0.2)] whitespace-nowrap">
                            Request Demo
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
