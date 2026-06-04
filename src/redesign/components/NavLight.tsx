import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { scrollToId } from '../motion/scrollTo';
import { useReducedMotion } from '../motion/useReducedMotion';
import { ease } from '../../design/light-tokens';

const LINKS = [
  { label: 'How it works', id: 'gesture' },
  { label: 'For restaurants', id: 'restaurants' },
  { label: 'What it does', id: 'capabilities' },
  { label: 'Install', id: 'install' },
] as const;

export function NavLight() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 24));

  return (
    <motion.header
      className="rd-nav"
      data-scrolled={scrolled}
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: ease.reveal, delay: 0.15 }}
    >
      <div className="rd-nav__inner">
        <button type="button" className="rd-nav__brand" onClick={() => scrollToId('top')} aria-label="TapIn — back to top">
          <span className="rd-nav__wordmark">TapIn</span>
          <span className="rd-nav__tap" aria-hidden="true" />
        </button>

        <nav className="rd-nav__capsule" aria-label="Primary" onMouseLeave={() => setHovered(null)}>
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="rd-nav__link"
              onMouseEnter={() => setHovered(link.id)}
              onFocus={() => setHovered(link.id)}
              onClick={() => scrollToId(link.id)}
            >
              {hovered === link.id && (
                <motion.span
                  layoutId="rd-nav-hl"
                  className="rd-nav__highlight"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {link.label}
            </button>
          ))}
        </nav>

        <div className="rd-nav__right">
          <CoversCounter />
          <MagneticCTA />
        </div>
      </div>
    </motion.header>
  );
}

/** A quietly-living "covers seated today" readout. */
function CoversCounter() {
  const reduced = useReducedMotion();
  const [covers, setCovers] = useState(1284);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setCovers((c) => c + 1), 5200);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <span className="rd-nav__live" aria-hidden="true">
      <i /> <b>{covers.toLocaleString('en-US')}</b> covers seated today
    </span>
  );
}

/** Magnetic "Book a demo" — the button leans toward the cursor. */
function MagneticCTA() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18 });
  const sy = useSpring(y, { stiffness: 250, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(((e.clientX - (r.left + r.width / 2)) / r.width) * 14);
    y.set(((e.clientY - (r.top + r.height / 2)) / r.height) * 10);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className="rd-btn rd-btn--primary rd-nav__cta"
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={() => scrollToId('contact')}
    >
      Book a demo
    </motion.button>
  );
}
