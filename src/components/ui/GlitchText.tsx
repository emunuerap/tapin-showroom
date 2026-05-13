import { useEffect, useRef, useState, type ElementType } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const chars = '@#$%&*,0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface GlitchTextProps {
    text: string;
    as?: ElementType;
    className?: string;
    delay?: number;
}

function deterministicScramble(text: string) {
    return text.replace(/[a-zA-Z0-9]/g, (char, index) => chars[(char.charCodeAt(0) + index * 17) % chars.length]);
}

export function GlitchText({ text, as: Component = 'span', className = '', delay = 0 }: GlitchTextProps) {
    const elRef = useRef<HTMLElement>(null);
    const [scrambled, setScrambled] = useState(() => deterministicScramble(text));

    useEffect(() => {
        if (!elRef.current) return;

        const obj = { value: 0 };

        const animation = gsap.to(obj, {
            value: 100,
            duration: 1.5,
            delay: delay,
            ease: "power2.inOut",
            onUpdate: () => {
                const progress = obj.value / 100;
                const limit = Math.floor(progress * text.length);
                let newText = '';

                for (let i = 0; i < text.length; i++) {
                    if (text[i] === ' ') {
                        newText += ' ';
                    } else if (i < limit) {
                        newText += text[i];
                    } else {
                        newText += chars[Math.floor(Math.random() * chars.length)];
                    }
                }
                setScrambled(newText);
            },
            scrollTrigger: {
                trigger: elRef.current,
                start: "top 85%",
            }
        });

        return () => {
            animation.kill();
        };
    }, [text, delay]);

    return (
        <Component ref={elRef} className={className}>
            {scrambled}
        </Component>
    );
}
