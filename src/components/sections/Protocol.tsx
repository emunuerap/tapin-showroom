import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { OrbitalConstellation } from '../ui/OrbitalConstellation';
import { TetrisBlueprint } from '../ui/TetrisBlueprint';
import { KineticResonance } from '../ui/KineticResonance';
import { PredictionMatrix } from '../ui/PredictionMatrix';

gsap.registerPlugin(ScrollTrigger);

export function Protocol({ activeView = 'guests' }: { activeView?: 'guests' | 'venues' }) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Simple GSAP fade-up for cards as they scroll into view
        gsap.utils.toArray('.protocol-card').forEach((card: unknown) => {
            const element = card as HTMLElement;
            gsap.fromTo(element,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                    }
                }
            );
        });
    }, { scope: containerRef, dependencies: [activeView] });

    const allProtocols = [
        {
            title: "The Epicurean Genome",
            desc: "Your culinary identity, perfected. We map your palate’s preferences, essential allergies, and ambient desires. Experience instant recognition at any venue, globally—ensuring your favorite table is waiting and your favorite bottle is open before you sit.",
            tag: "MODULE // IDENTITY",
            view: "guests",
            component: <OrbitalConstellation />
        },
        {
            title: "The Gratitude Loop",
            desc: "Turn the archaic check-paying ritual into a seamless gesture of appreciation. Digital tips that instantly elevate your status.",
            tag: "MODULE // CAPITAL",
            view: "guests",
            component: <KineticResonance />
        },
        {
            title: "The Sentient Floorplan",
            desc: "Our intelligence assigns the perfect seat based on your vibe, maximizing the restaurant's flow without human guesswork.",
            tag: "MODULE // LOGISTICS",
            view: "venues",
            component: <TetrisBlueprint />
        },
        {
            title: "The Prediction Matrix",
            desc: "Eliminate the guesswork. Our AI cross-references weather, historical dwell times, and VIP signals to perfectly predict and optimize your nightly revenue, neutralizing No-Shows.",
            tag: "MODULE // PREDICTION",
            view: "venues",
            component: <PredictionMatrix />
        }
    ];

    const activeProtocols = allProtocols.filter(p => p.view === activeView);

    return (
        <section id="protocol" ref={containerRef} className="py-24 md:py-28 relative w-full">
            <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-20 relative z-10 flex flex-col items-center justify-center text-center">
                {activeView === 'guests' ? (
                    <h2 className="font-serif italic text-4xl md:text-[3.5rem] text-silver leading-tight max-w-4xl tracking-tight">
                        "True luxury is invisible. No apps, no checkout lines, no friction. Just seamless recognition from the moment you arrive."
                    </h2>
                ) : (
                    <h2 className="font-serif italic text-4xl md:text-[3.5rem] text-silver leading-tight max-w-4xl tracking-tight">
                        "Stars are dead. Facts don't lie. We measure love through Return Rate, Dwell Time, and the Gratitude Protocol."
                    </h2>
                )}
            </div>

            {/* The Monolith Grid - Symmetrical 2 Columns */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 w-full">
                {activeProtocols.map((p) => (
                    <div
                        key={p.title}
                        className="protocol-card card-beam w-full h-full rounded-[32px] bg-[#0A0A0A] border border-white/5 relative flex flex-col group hover:-translate-y-2 transition-all duration-500 overflow-visible z-10"
                    >
                        {/* The Artifact (Top Flexible Space) - Filling Width */}
                        <div className="w-full flex-1 min-h-[350px] flex items-center justify-center relative z-10 p-8 pointer-events-none">
                            {/* Subtle Background Glow for Artifact isolation */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

                            <div className="relative z-10 w-full h-full flex items-center justify-center">
                                {p.component}
                            </div>
                        </div>

                        {/* Text Gradient Shield */}
                        <div className="absolute bottom-0 left-0 w-full h-[70%] bg-gradient-to-t from-[#050505] via-[#0A0A0A]/95 to-transparent z-0 pointer-events-none" />

                        {/* The Typography (Bottom Half) - High Padding */}
                        <div className="relative z-10 flex flex-col justify-end p-10 md:p-12 gap-5">
                            {/* Header Row */}
                            <div className="flex flex-col gap-2">
                                <span className="font-mono text-[10px] tracking-[0.2em] text-[#CCFF00] uppercase">
                                    {p.tag}
                                </span>
                                <h3 className="font-serif italic tracking-tight text-3xl md:text-5xl text-silver group-hover:text-white transition-colors duration-500">
                                    {p.title}
                                </h3>
                            </div>

                            {/* Body */}
                            <p className="font-sans text-sm md:text-base text-white/80 leading-relaxed font-light mt-2">
                                {p.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
