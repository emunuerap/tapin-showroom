import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ParallaxSection({ children, speed = 1, className = '' }: { children: React.ReactNode, speed?: number, className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !innerRef.current) return;

        const yValue = speed * 100;

        const animation = gsap.fromTo(innerRef.current, 
            { y: -yValue },
            {
                y: yValue,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                }
            }
        );

        return () => {
            animation.kill();
        };
    }, [speed]);

    return (
        <div ref={containerRef} className={`overflow-hidden relative w-full h-full ${className}`}>
            <div ref={innerRef} className="w-full h-[120%] absolute top-[-10%] left-0">
                {children}
            </div>
        </div>
    );
}
