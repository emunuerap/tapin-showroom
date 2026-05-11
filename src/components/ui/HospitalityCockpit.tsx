import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Expanded Mock data with seat-level mapping
const TABLES = [
    {
        id: 1, x: 20, y: 20, width: 60, height: 60, status: 'occupied', score: 9.2, vip: 'Generous Patron',
        seats: [
            { id: 1, name: "Alex (VIP)", order: "Oysters & Chablis" },
            { id: 2, name: "Emma", order: "Truffle Risotto" }
        ]
    },
    { id: 2, x: 100, y: 20, width: 60, height: 60, status: 'free', score: 0, vip: 'None', seats: [] },
    {
        id: 3, x: 180, y: 20, width: 100, height: 60, status: 'occupied', score: 8.5, vip: 'Regular',
        seats: [
            { id: 1, name: "Guest", order: "Wagyu A5" },
            { id: 2, name: "Guest", order: "Black Cod" },
            { id: 3, name: "Guest", order: "Spicy Tuna" }
        ]
    },
    {
        id: 4, x: 20, y: 120, width: 60, height: 100, status: 'occupied', score: 9.8, vip: 'Whale',
        seats: [
            { id: 1, name: "Jordan (Whale)", order: "Omakase Menu" }
        ]
    },
    { id: 5, x: 100, y: 120, width: 60, height: 60, status: 'free', score: 0, vip: 'None', seats: [] },
    { id: 6, x: 180, y: 120, width: 100, height: 100, status: 'free', score: 0, vip: 'None', seats: [] },
    {
        id: 7, x: 320, y: 40, width: 80, height: 80, status: 'occupied', score: 9.9, vip: 'Generous Patron', shape: 'circle',
        seats: [
            { id: 1, name: "Sarah (VIP)", order: "Champagne" },
            { id: 2, name: "Tom", order: "Caviar Service" }
        ]
    },
    { id: 8, x: 320, y: 140, width: 80, height: 80, status: 'free', score: 0, vip: 'None', shape: 'circle', seats: [] },
];

const EVENTS = [
    "Tetris Agent: Reassigned T4 to accommodate VIP Walk-In.",
    "Gratitude Protocol: Table 12 paid. 22% tip signaled. (+500 XP)",
    "Sentiment Matrix: Clean Plate Tag activated for Table 7.",
    "No-Show Predictor: Smart Deposit requested for +44 7911...",
    "Walk-In Express: 2 Pax seated at Bar via NFC.",
    "Taste Genome Match: Table 9 ordered recommended Vintage.",
    "VIP Signal: Generous Patron detected on arrival (T2).",
    "Pre-Game Hype: Contextual trivia sent to Table 5.",
    "LiveOps: T8 Dwell Time exceeded 120m. Optimizing next seating.",
    "Authless Booking: 5-second swipe confirmed for 20:00."
];

export const HospitalityCockpit = () => {
    const [hoveredTable, setHoveredTable] = useState<number | null>(null);
    const [feed, setFeed] = useState<string[]>([]);

    useEffect(() => {
        // Simulate live feed
        let index = 0;
        const interval = setInterval(() => {
            setFeed(prev => {
                // Ensure unique events by appending a timestamp if needed, but for now just use the event text 
                // mixed with a counter to guarantee unique keys for AnimatePresence
                const newEvent = `${EVENTS[index]} [${Date.now()}]`;
                const newFeed = [newEvent, ...prev];
                return newFeed.slice(0, 6); // Keep last 6 events
            });
            index = (index + 1) % EVENTS.length;
        }, 2000); // Terminal speed
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-auto min-h-[600px] grid grid-cols-1 lg:grid-cols-12 bg-white/5 backdrop-blur-[22px] border border-white/10 rounded-3xl shadow-2xl relative isolate overflow-hidden">
            <div className="lg:col-span-7 p-8 md:p-10 relative flex flex-col min-w-0 h-full">
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10 shrink-0">
                    <div>
                        <h3 className="text-white/40 font-mono text-sm tracking-widest uppercase mb-1 flex items-center gap-2 font-['JetBrains_Mono',monospace]">
                            Cockpit v8.0
                        </h3>
                        <p className="text-[#CCFF00]/80 text-xs font-mono font-['JetBrains_Mono',monospace] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
                            Tetris Agent Active
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[3px] bg-[#0A0A0A] border border-[#CCFF00]/50 shadow-[inset_0_0_5px_rgba(204,255,0,0.2)]"></div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-white/70">Occupied</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-[3px] bg-[#050505] border border-white/20 border-dashed"></div>
                            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Free</span>
                        </div>
                    </div>
                </div>

                {/* Vector Map */}
                <div className="relative w-full h-[350px] border border-white/5 bg-[#050505] rounded-2xl overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-center bg-clip-padding shrink-0 isolate">
                    {/* Subtle radar sweep gradient background */}
                    <div className="absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,rgba(255,255,255,0.01)_0%,transparent_50%)] animate-[spin_10s_linear_infinite] mix-blend-screen pointer-events-none -z-10"></div>

                    <svg className="w-full h-full max-h-full block absolute inset-0 m-auto p-6" viewBox="0 0 450 250" preserveAspectRatio="xMidYMid meet">
                        {TABLES.map((table) => {
                            const isOccupied = table.status === 'occupied';
                            const fillColor = isOccupied ? '#0A0A0A' : '#050505'; // Dark glass for occupied, Obsidian for free
                            const isHovered = hoveredTable === table.id;
                            const strokeColor = isOccupied ? (isHovered ? '#CCFF00' : 'rgba(204,255,0,0.4)') : 'rgba(255,255,255,0.1)';
                            const strokeWidth = isHovered && isOccupied ? "2" : "1";
                            const strokeDasharray = !isOccupied ? "4,4" : "none"; // Dashed for free tables

                            return (
                                <g
                                    key={table.id}
                                    onMouseEnter={() => setHoveredTable(table.id)}
                                    onMouseLeave={() => setHoveredTable(null)}
                                    className="cursor-pointer transition-all duration-300 hover:opacity-90"
                                >
                                    {table.shape === 'circle' ? (
                                        <circle
                                            cx={table.x + table.width / 2}
                                            cy={table.y + table.height / 2}
                                            r={table.width / 2}
                                            fill={fillColor}
                                            stroke={strokeColor}
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={strokeDasharray}
                                            style={{ filter: isOccupied ? 'drop-shadow(inset 0 0 15px rgba(204,255,0,0.1))' : 'none' }}
                                        />
                                    ) : (
                                        <rect
                                            x={table.x}
                                            y={table.y}
                                            width={table.width}
                                            height={table.height}
                                            fill={fillColor}
                                            rx="12"
                                            stroke={strokeColor}
                                            strokeWidth={strokeWidth}
                                            strokeDasharray={strokeDasharray}
                                            style={{ filter: isOccupied ? 'drop-shadow(inset 0 0 15px rgba(204,255,0,0.1))' : 'none' }}
                                        />
                                    )}
                                    <foreignObject
                                        x={table.x}
                                        y={table.y}
                                        width={table.width}
                                        height={table.height}
                                    >
                                        <div className="flex flex-col items-center justify-center w-full h-full p-1 text-center select-none pointer-events-none">
                                            <span className={`text-sm font-bold leading-none font-mono ${isOccupied ? 'text-white' : 'text-white/30'}`}>
                                                T{table.id}
                                            </span>
                                            {isOccupied && (
                                                <span className="text-[9px] font-mono text-[#CCFF00]/80 mt-1 leading-none tracking-tighter">
                                                    {table.seats.length}P • 45m
                                                </span>
                                            )}
                                        </div>
                                    </foreignObject>
                                </g>
                            );
                        })}
                    </svg>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {hoveredTable && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute bottom-6 right-6 w-80 bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/10 p-5 rounded-2xl z-50 pointer-events-none shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                                style={{ boxShadow: '0 0 0 1px rgba(204,255,0,0.1), 0 20px 40px rgba(0,0,0,0.8)' }}
                            >
                                {(() => {
                                    const data = TABLES.find(t => t.id === hoveredTable);
                                    if (!data) return null;
                                    return (
                                        <div className="font-sans text-sm">
                                            {/* Header */}
                                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                                                <span className="text-white font-mono text-[11px] font-bold tracking-widest uppercase">
                                                    [ TABLE {data.id} ]
                                                </span>
                                                <div className="font-mono text-[10px] text-silver/60 flex items-center gap-2">
                                                    <span>CHECK #8902</span>
                                                    <span>•</span>
                                                    <span className="text-[#CCFF00]">SATISFACTION: {data.score.toFixed(1)}</span>
                                                </div>
                                            </div>

                                            {/* Seat Data Grid */}
                                            {data.seats.length > 0 ? (
                                                <div className="grid grid-cols-2 gap-4 mt-3 mb-5 max-h-[140px] overflow-y-auto custom-scrollbar">
                                                    {data.seats.map(seat => (
                                                        <div key={seat.id} className="flex flex-col gap-1">
                                                            <span className={`text-xs font-semibold ${seat.name.includes('(VIP)') || seat.name.includes('(Whale)') ? 'text-yuzu' : 'text-white'}`}>
                                                                {seat.name.replace(/\(.*\)/, '')} {seat.name.includes('(VIP)') && '👑'} {seat.name.includes('(Whale)') && '🐋'}
                                                            </span>
                                                            <span className="text-white/50 text-[10px] leading-tight">
                                                                {seat.order}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center text-silver/40 text-xs py-4 font-mono italic">
                                                    No POS data matching this node.
                                                </div>
                                            )}

                                            {/* Footer Progress Bar */}
                                            <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                                                <div className="flex justify-between items-center text-[10px] font-mono">
                                                    <span className="text-white/70">Expected Turnaround</span>
                                                    <span className="text-white">15 mins</span>
                                                </div>
                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "75%" }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-[#CCFF00] rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                                                    />
                                                </div>
                                                <div className="mt-2 text-[9px] text-silver/50 font-mono tracking-widest flex items-center gap-1.5 uppercase">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse"></span>
                                                    LIVE POS SYNC ACTIVE
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Sidebar Live Feed */}
            <div className="w-full lg:col-span-5 bg-black/40 border-l border-white/5 p-8 md:p-10 flex flex-col h-full lg:max-h-[600px]">
                <h4 className="text-white font-medium mb-8 flex items-center gap-3 text-sm tracking-wide">
                    <span className="w-2 h-2 bg-yuzu rounded-full hidden md:block animate-pulse"></span>
                    ACTIVITY LOG
                </h4>
                {/* Flex-col with specific gap to prevent overlap, enable auto scroll but no wrap */}
                <div className="flex flex-col relative h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
                    <AnimatePresence initial={false}>
                        {feed.map((event, i) => {
                            // High-end terminal highlighting logic
                            const renderHighlightedText = (text: string) => {
                                const highlightWords = ['Paid', 'VIP', 'Generous Patron', '\\+500 XP', 'confirmed', 'NFC', 'Smart Deposit', 'Taste Genome Match'];
                                let highlighted = text;
                                highlightWords.forEach(word => {
                                    highlighted = highlighted.replace(new RegExp(`(${word})`, 'gi'), `<span class="text-[#CCFF00] font-bold">$1</span>`);
                                });
                                return <span dangerouslySetInnerHTML={{ __html: highlighted }} className="whitespace-normal break-words" />;
                            };

                            // Extract timestamp logic since we appended it to the event string for uniqueness
                            const splitIndex = event.lastIndexOf(' [');
                            let textSegment = event;
                            let timestamp = '[LIVE]';
                            if (splitIndex !== -1) {
                                textSegment = event.substring(0, splitIndex);
                                // Format a fake readable time for UI purposes
                                const date = new Date(parseInt(event.substring(splitIndex + 2, event.length - 1)));
                                timestamp = `[ ${date.toTimeString().split(' ')[0]} ]`;
                            }

                            return (
                                <motion.div
                                    key={event} // Use strictly the event string as key assuming they are unique or add an ID, to ensure proper AnimatePresence tracking
                                    layout
                                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                    animate={{ opacity: 1 - (i * 0.15), y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                        mass: 0.8
                                    }}
                                    className="w-full origin-top"
                                >
                                    <div className="flex flex-col gap-2 p-4 mb-3 border border-white/5 bg-white/[0.02] rounded-xl hover:bg-white/[0.04] transition-colors shadow-md">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2 text-[10px] font-mono text-[#CCFF00]">
                                                <div className={`w-1.5 h-1.5 rounded-full ${event.includes('VIP') || event.includes('Generous Patron') ? 'bg-[#CCFF00]' : 'bg-white'}`}></div>
                                                SYS_EVENT
                                            </div>
                                            <span className="text-[10px] font-mono text-white/40">{timestamp}</span>
                                        </div>
                                        <p className="text-sm text-white/80 leading-relaxed whitespace-normal break-words font-sans">
                                            {renderHighlightedText(textSegment)}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
