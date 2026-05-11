import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function WalkInExpress() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [pulseText, setPulseText] = useState("Walk-in Express. Awaiting Device...");
    const phoneRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Phone Tap Loop Animation
            const tl = gsap.timeline({ repeat: -1 });

            // 1. Phone slides up
            tl.fromTo(phoneRef.current,
                { y: 150, opacity: 0, rotateX: 45 },
                { y: 20, opacity: 1, rotateX: 0, duration: 1, ease: 'power3.out' }
            )
                // 2. Phone taps (moves slightly closer)
                .to(phoneRef.current, { y: 15, scale: 0.98, duration: 0.15, ease: 'power2.in' })
                // 3. Trigger state change via callback
                .call(() => {
                    // Simulate ripple and text change
                    setPulseText("Table 4 is ready. Walk in.");
                    if (textRef.current) {
                        gsap.fromTo(textRef.current, { opacity: 0, y: 5 }, { opacity: 1, y: 0, duration: 0.3 });
                    }
                    // Quick flash on the rings
                    gsap.fromTo('.nfc-ring', { borderColor: '#FFFFFF', scale: 1.1 }, { borderColor: '#CCFF00', scale: 1, duration: 0.5 });
                })
                // 4. Phone releases slightly
                .to(phoneRef.current, { y: 20, scale: 1, duration: 0.2, ease: 'power2.out' })
                // 5. Hold
                .to({}, { duration: 2.5 })
                // 6. Phone slides away
                .to(phoneRef.current, { y: 150, opacity: 0, duration: 0.8, ease: 'power3.in' })
                // 7. Reset text
                .call(() => {
                    setPulseText("Walk-in Express. Awaiting Device...");
                    if (textRef.current) {
                        gsap.fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                    }
                })
                // Wait before next loop
                .to({}, { duration: 1 });

        }, containerRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.feature-reveal',
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: '.feature-reveal',
                        start: 'top 85%'
                    }
                }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-24 md:py-28 px-6 w-full max-w-7xl mx-auto flex flex-col gap-24 bg-transparent">
            <div className="feature-reveal grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="flex flex-col gap-6">
                    <span className="inline-flex items-center gap-3 self-start font-mono text-[10px] md:text-xs uppercase tracking-[0.35em] text-yuzu/80">
                        <span className="block w-8 h-px bg-yuzu/40" />
                        Module · Walk-In Express
                    </span>
                    <h2 className="font-serif italic text-4xl md:text-6xl lg:text-7xl text-silver/90 leading-[1.04] tracking-tight">
                        Skip the host.
                        <br />
                        <span className="text-yuzu">Just tap.</span>
                    </h2>
                    <p className="font-sans text-base md:text-lg text-silver/65 leading-relaxed max-w-md">
                        At the door. On a contactless plate. Your phone says hello, TapIn recognises you, the table is yours. Average wait collapses from minutes to seconds.
                    </p>
                    <div className="flex items-baseline gap-6 mt-4 pt-4 border-t border-white/8">
                        <div className="flex flex-col gap-0.5">
                            <span className="font-serif italic text-3xl md:text-4xl text-yuzu/95 leading-none">
                                6s
                            </span>
                            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-silver/45">
                                with TapIn
                            </span>
                        </div>
                        <span className="font-mono text-silver/35">·</span>
                        <div className="flex flex-col gap-0.5">
                            <span className="font-serif italic text-3xl md:text-4xl text-silver/40 leading-none line-through">
                                7-12m
                            </span>
                            <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-silver/45">
                                without
                            </span>
                        </div>
                    </div>
                </div>

                {/* NFC Plate Concept */}
                <div className="relative p-12 h-96 flex items-end justify-center perspective-[1000px]">
                    {/* Concentric Radar Rings */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                        <div className="nfc-ring absolute w-48 h-48 rounded-full border border-[#CCFF00] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40"></div>
                        <div className="nfc-ring absolute w-40 h-40 rounded-full border border-[#CCFF00] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-30" style={{ animationDelay: '0.5s' }}></div>
                        <div className="nfc-ring absolute w-32 h-32 rounded-full border border-[#CCFF00] animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-20" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Glossy Plate */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0A0A0A] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_15px_rgba(204,255,0,0.05)] rounded-full flex flex-col items-center justify-center p-6 overflow-hidden z-0">
                        {/* NFC Signal Arc Graphic */}
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="0.5" />
                            <path d="M6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" className={`${pulseText.includes('Table') ? 'animate-pulse' : ''}`} />
                            <path d="M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12" stroke="#CCFF00" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
                        </svg>
                    </div>

                    {/* Animated Smartphone Silhouette */}
                    <div ref={phoneRef} className="relative z-10 w-52 h-[340px] bg-[#1A1A1A] border-4 border-[#333] rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.9),inset_0_2px_10px_rgba(255,255,255,0.1)] flex flex-col items-center justify-start p-4 origin-bottom translate-y-[150px] overflow-hidden">
                        {/* Fake Smartphone Status Bar */}
                        <div className="w-16 h-4 bg-black rounded-b-xl absolute top-0"></div>

                        {/* Screen Background (Dynamic) */}
                        <div className={`absolute inset-0 bg-gradient-to-t from-transparent ${pulseText.includes('Table') ? 'to-[#CCFF00]/10' : 'to-transparent'} transition-colors duration-500 pointer-events-none`} />

                        {/* Lock Screen UI / Notification Modal */}
                        <div className="mt-8 w-full flex flex-col gap-2">
                            {/* The actual text node is now rendered ON the phone screen */}
                            <div
                                ref={textRef}
                                className={`w-full p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg flex flex-col gap-1 transition-all duration-300 ${pulseText.includes('Table') ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-4 h-4 rounded bg-[#CCFF00]/20 flex items-center justify-center">
                                        <div className="w-2 h-2 rounded-full bg-[#CCFF00]"></div>
                                    </div>
                                    <span className="font-sans text-[10px] text-white/60 font-medium">TapIn Protocol</span>
                                    <span className="font-sans text-[10px] text-white/40 ml-auto flex items-center gap-1">now</span>
                                </div>
                                <span className={`font-sans text-sm font-semibold tracking-wide ${pulseText.includes('Table') ? 'text-white' : 'text-yuzu'}`}>
                                    {pulseText}
                                </span>
                            </div>
                        </div>

                        {/* Fake minimal home bar on phone */}
                        <div className="absolute bottom-2 w-20 h-1 bg-white/20 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
