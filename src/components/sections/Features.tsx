import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck } from 'lucide-react';

import { TasteGenomeVisualizer } from '../ui/TasteGenomeVisualizer';
import { TetrisAgentSimulator } from '../ui/TetrisAgentSimulator';

gsap.registerPlugin(ScrollTrigger);

export function Features() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Tetris Shuffler animation
            gsap.fromTo('.tetris-container',
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: '.tetris-container',
                        start: 'top 80%',
                    }
                }
            );

            // Sentiment Typewriter line
            gsap.fromTo('.sentiment-bar',
                { width: 0 },
                {
                    width: '100%', duration: 1.5, ease: 'power3.inOut',
                    scrollTrigger: { trigger: '.sentiment-container', start: 'top 80%' }
                }
            );

        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="py-32 px-6 w-full max-w-7xl mx-auto flex flex-col gap-32">

            {/* 1. Taste Genome Visualizer */}
            <div className="tetris-container grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="font-serif italic text-4xl md:text-6xl text-silver mb-6">Epicurean Fingerprint</h2>
                    <p className="font-sans text-lg text-silver/70 mb-8 max-w-md">
                        Measure love through multidimensional data. Evolve your vector identity and let the Sentient OS anticipate your exact desires.
                    </p>
                </div>
                <div className="flex justify-center">
                    <TasteGenomeVisualizer />
                </div>
            </div>

            {/* 2. The Tetris Shuffler -> TetrisAgentSimulator */}
            <div className="sentiment-container grid grid-cols-1 gap-16 items-center">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="font-serif italic text-4xl md:text-6xl text-silver mb-6">The IA Floor Shuffler</h2>
                    <p className="font-sans text-lg text-silver/70 mb-8">
                        Maximizing RevPASH by eliminating empty seats. Watch real-time concurrency reject "Waste" and optimize the floor grid.
                    </p>
                </div>
                <div>
                    <TetrisAgentSimulator />
                </div>
            </div>

            {/* 3. The Sentiment Typewriter */}
            <div className="sentiment-container grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div className="order-2 md:order-1 glass-panel p-8 relative overflow-hidden flex flex-col justify-center">
                    <div className="font-mono text-sm text-silver/60 space-y-4">
                        <div className="flex gap-4 items-center">
                            <span className="text-silver/40">14:02:10</span>
                            <span className="text-yuzu">{'> VIP Detected: User #8920'}</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className="text-silver/40">14:03:45</span>
                            <span>{'> Gratitude Signal Processed'}</span>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className="text-silver/40">14:05:00</span>
                            <span className="text-yuzu">{'> +15% RevPASH Optimization'}</span>
                        </div>
                    </div>
                    <div className="absolute top-0 left-0 h-1 bg-yuzu sentiment-bar shadow-[0_0_20px_rgba(204,255,0,0.5)]" />
                </div>
                <div className="order-1 md:order-2">
                    <h2 className="font-serif italic text-4xl md:text-6xl text-silver mb-6">The Sentiment Typewriter</h2>
                    <p className="font-sans text-lg text-silver/70 mb-8 max-w-md">
                        Satisfaction is a data stream. Watch gratitude translate into instant, actionable signals that optimize your floor.
                    </p>
                </div>
            </div>

            {/* 3. The Booking Pulse */}
            <div className="booking-container grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                    <h2 className="font-serif italic text-4xl md:text-6xl text-silver mb-6">The Booking Pulse</h2>
                    <p className="font-sans text-lg text-silver/70 mb-8 max-w-md">
                        An animated handshake confirming entry. A digital pulse that answers "You're In" without a single physical friction point.
                    </p>
                </div>
                <div className="glass-panel p-8 h-96 flex items-center justify-center relative">
                    <div className="w-32 h-32 rounded-full border border-yuzu/30 flex items-center justify-center relative animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite]">
                        <div className="w-24 h-24 rounded-full bg-yuzu/10 flex items-center justify-center">
                            <ShieldCheck className="w-10 h-10 text-yuzu" />
                        </div>
                        {/* Ripple effect */}
                        <div className="absolute inset-0 rounded-full border border-yuzu animate-ping opacity-20" style={{ animationDuration: '2s' }} />
                    </div>
                </div>
            </div>

        </section>
    );
}
