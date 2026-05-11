import { motion } from 'framer-motion';

export function PredictionMatrix() {
    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden group">
            {/* Dark container backdrop */}
            <div className="absolute inset-0 bg-[#050505] rounded-2xl flex items-center justify-center pointer-events-none">
                {/* Subtle sweeping radar gradient */}
                <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(204,255,0,0.05)_0%,transparent_50%)] animate-[spin_10s_linear_infinite] mix-blend-screen opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>

                {/* SVG Node Graph */}
                <svg viewBox="0 0 400 300" className="w-full h-auto max-h-[250px] overflow-visible z-10">
                    {/* Definitions */}
                    <defs>
                        <filter id="glow-yuzu" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Dashed Connecting Lines */}
                    <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        {/* Traffic Line */}
                        <path d="M 100 80 Q 200 120 200 150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                        {/* Weather Line */}
                        <path d="M 300 80 Q 200 120 200 150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite_reverse]" />
                        {/* History Line */}
                        <path d="M 200 250 L 200 150" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" className="animate-[dash_10s_linear_infinite]" />
                    </motion.g>

                    {/* Outer Nodes */}
                    <g className="text-[#A1A1AA] font-mono text-[9px] tracking-widest uppercase">
                        {/* [TRAFFIC] */}
                        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                            <circle cx="100" cy="80" r="4" fill="#0A0A0A" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <circle cx="100" cy="80" r="1.5" fill="rgba(255,255,255,0.5)" />
                            <text x="100" y="65" textAnchor="middle" fill="currentColor">[TRAFFIC]</text>
                        </motion.g>

                        {/* [WEATHER] */}
                        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}>
                            <circle cx="300" cy="80" r="4" fill="#0A0A0A" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <circle cx="300" cy="80" r="1.5" fill="rgba(255,255,255,0.5)" />
                            <text x="300" y="65" textAnchor="middle" fill="currentColor">[WEATHER]</text>
                        </motion.g>

                        {/* [HISTORY] */}
                        <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.4 }}>
                            <circle cx="200" cy="250" r="4" fill="#0A0A0A" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                            <circle cx="200" cy="250" r="1.5" fill="rgba(255,255,255,0.5)" />
                            <text x="200" y="270" textAnchor="middle" fill="currentColor">[HISTORY]</text>
                        </motion.g>
                    </g>

                    {/* Central Core: [PREDICTIVE YIELD] */}
                    <motion.g
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 1.5, delay: 0.6 }}
                        className="group-hover:scale-110 transition-transform duration-500 origin-center"
                        style={{ transformOrigin: '200px 150px' }}
                    >
                        {/* Outer Glow Ring */}
                        <circle cx="200" cy="150" r="35" fill="rgba(204,255,0,0.05)" stroke="rgba(204,255,0,0.2)" strokeWidth="1" strokeDasharray="2 4" className="origin-center animate-[spin_20s_linear_infinite]" />

                        {/* Middle Solid Ring */}
                        <circle cx="200" cy="150" r="25" fill="#0A0A0A" stroke="#CCFF00" strokeWidth="1.5" filter="url(#glow-yuzu)" />

                        {/* Inner Pulsing Core */}
                        <motion.circle
                            cx="200"
                            cy="150"
                            r="8"
                            fill="#CCFF00"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />

                        {/* Label */}
                        <text x="200" y="195" textAnchor="middle" fill="#CCFF00" fontSize="10" fontFamily="monospace" fontWeight="bold" letterSpacing="0.1em">
                            [PREDICTIVE YIELD]
                        </text>
                        <text x="200" y="210" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace" letterSpacing="0.1em">
                            99.8% ACCURACY
                        </text>
                    </motion.g>
                </svg>
            </div>

            <style>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -200;
                    }
                }
            `}</style>
        </div>
    );
}
