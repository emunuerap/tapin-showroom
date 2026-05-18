import { useEffect, useRef } from "react";

interface ChromaticHoverProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

/**
 * ChromaticHover
 * Tracks mouse velocity over the element to apply a directional RGB shift (chromatic aberration).
 * Emulates the WebGL flowmap distortion from the case study, but using CSS text-shadow for performance and simplicity.
 */
export function ChromaticHover({
  children,
  className = "",
  intensity = 1.5,
}: ChromaticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    // We only want this on desktop
    if (window.matchMedia("(max-width: 768px)").matches) return;

    let lastX = 0;
    let lastY = 0;
    let lastTime = 0;
    let animationFrameId: number;

    // Decay the effect back to 0 smoothly when mouse stops
    let currentVx = 0;
    let currentVy = 0;

    const decay = () => {
      currentVx *= 0.85;
      currentVy *= 0.85;

      if (Math.abs(currentVx) < 0.1) currentVx = 0;
      if (Math.abs(currentVy) < 0.1) currentVy = 0;

      el.style.setProperty("--chromatic-rx", `${currentVx * intensity}px`);
      el.style.setProperty("--chromatic-ry", `${currentVy * intensity}px`);
      el.style.setProperty(
        "--chromatic-bx",
        `${-currentVx * intensity * 1.2}px`,
      );
      el.style.setProperty(
        "--chromatic-by",
        `${-currentVy * intensity * 1.2}px`,
      );

      if (currentVx !== 0 || currentVy !== 0) {
        animationFrameId = requestAnimationFrame(decay);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastTime;

      if (dt > 0 && lastTime > 0) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;

        // Calculate velocity vector (clamped)
        const maxV = 10;
        const vx = Math.min(Math.max((dx / dt) * 15, -maxV), maxV);
        const vy = Math.min(Math.max((dy / dt) * 15, -maxV), maxV);

        currentVx = vx;
        currentVy = vy;

        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(decay);
      }

      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
    };

    const handleMouseLeave = () => {
      lastTime = 0;
    };

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity]);

  return (
    <div
      ref={ref}
      className={`relative inline-block ${className}`}
      style={{
        textShadow:
          "var(--chromatic-rx, 0px) var(--chromatic-ry, 0px) 0px rgba(255, 0, 0, 0.7), var(--chromatic-bx, 0px) var(--chromatic-by, 0px) 0px rgba(0, 255, 255, 0.7)",
      }}
    >
      {children}
    </div>
  );
}
