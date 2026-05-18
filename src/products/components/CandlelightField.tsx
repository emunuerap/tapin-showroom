import { useEffect, useRef } from 'react';

/**
 * CandlelightField — slow upward drifting motes of warm light.
 *
 * The hospitality equivalent of "particles": specks of dust catching
 * candlelight in a restaurant at night. Not a sci-fi starfield. Each
 * particle drifts upward gently, fades in at the bottom and out at the
 * top, and gets a subtle parallax pull from the cursor (real dust in a
 * room reacts to people moving past it).
 *
 * Canvas 2D only — zero bundle cost, runs at 60fps with ~80 particles.
 * Respects prefers-reduced-motion (renders a still field).
 */
interface CandlelightFieldProps {
    /** How many particles. Default 80. Lower for mobile. */
    count?: number;
    /** Multiplier for global motion. 0 = still, 1 = normal. */
    intensity?: number;
    /** Optional className for absolute positioning. */
    className?: string;
}

interface Mote {
    x: number;
    y: number;
    vx: number; // horizontal drift
    vy: number; // upward speed (negative)
    r: number; // radius
    hue: number; // 35-60 for warm gold; occasional spike to 75 for yuzu accent
    sat: number;
    light: number;
    alphaMax: number;
    twinkleOffset: number;
}

export function CandlelightField({
    count = 80,
    intensity = 1,
    className = 'absolute inset-0 pointer-events-none',
}: CandlelightFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0.5, y: 0.5 });
    const reduceRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        reduceRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let width = 0;
        let height = 0;
        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let motes: Mote[] = [];

        const seed = (w: number, h: number) => {
            motes = Array.from({ length: count }, () => makeMote(w, h, false));
        };

        const makeMote = (w: number, h: number, fromBottom: boolean): Mote => {
            // 8% of motes get the yuzu accent hue. The rest stay warm gold/amber.
            const isAccent = Math.random() < 0.08;
            return {
                x: Math.random() * w,
                y: fromBottom ? h + Math.random() * 60 : Math.random() * h,
                vx: (Math.random() - 0.5) * 0.08,
                vy: -(0.05 + Math.random() * 0.18) * intensity,
                r: 0.6 + Math.random() * 1.6,
                hue: isAccent ? 72 : 36 + Math.random() * 18,
                sat: isAccent ? 100 : 70 + Math.random() * 20,
                light: isAccent ? 60 : 65 + Math.random() * 15,
                alphaMax: 0.18 + Math.random() * 0.42,
                twinkleOffset: Math.random() * Math.PI * 2,
            };
        };

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            if (!motes.length) seed(width, height);
        };

        const onMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = (e.clientX - rect.left) / rect.width;
            mouseRef.current.y = (e.clientY - rect.top) / rect.height;
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMouseMove, { passive: true });

        let raf = 0;
        const start = performance.now();

        const tick = () => {
            const t = (performance.now() - start) / 1000;
            ctx.clearRect(0, 0, width, height);

            // Faint atmospheric haze — large radial wash that follows mouse
            const mx = mouseRef.current.x * width;
            const my = mouseRef.current.y * height;
            const grad = ctx.createRadialGradient(mx, my, 0, mx, my, Math.max(width, height) * 0.55);
            grad.addColorStop(0, 'rgba(255, 200, 110, 0.025)');
            grad.addColorStop(1, 'rgba(255, 200, 110, 0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            // Particles
            for (let i = 0; i < motes.length; i++) {
                const m = motes[i];

                // Drift
                if (!reduceRef.current) {
                    m.x += m.vx;
                    m.y += m.vy;

                    // Mouse attraction (very subtle, fall-off with distance)
                    const dx = mx - m.x;
                    const dy = my - m.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    if (dist < 220) {
                        const pull = (1 - dist / 220) * 0.04;
                        m.x += dx * pull * 0.02;
                        m.y += dy * pull * 0.02;
                    }
                }

                // Recycle when above the top
                if (m.y < -10) {
                    Object.assign(m, makeMote(width, height, true));
                }
                // Wrap horizontally
                if (m.x < -10) m.x = width + 10;
                if (m.x > width + 10) m.x = -10;

                // Twinkle
                const twinkle = (Math.sin(t * 1.4 + m.twinkleOffset) + 1) * 0.5;
                const alpha = m.alphaMax * (0.5 + twinkle * 0.5);

                // Outer glow
                const glowR = m.r * 4.5;
                const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, glowR);
                g.addColorStop(0, `hsla(${m.hue}, ${m.sat}%, ${m.light}%, ${alpha * 0.6})`);
                g.addColorStop(1, `hsla(${m.hue}, ${m.sat}%, ${m.light}%, 0)`);
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(m.x, m.y, glowR, 0, Math.PI * 2);
                ctx.fill();

                // Hot core
                ctx.fillStyle = `hsla(${m.hue}, ${m.sat}%, ${Math.min(95, m.light + 12)}%, ${alpha})`;
                ctx.beginPath();
                ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
                ctx.fill();
            }

            raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMouseMove);
        };
    }, [count, intensity]);

    return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
