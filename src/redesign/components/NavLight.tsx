import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from 'framer-motion';
import type { Variants } from 'framer-motion';
import { scrollToId } from '../motion/scrollTo';
import { useReducedMotion } from '../motion/useReducedMotion';
import { ease } from '../../design/light-tokens';

const LINKS = [
  { label: 'How it works', id: 'gesture' },
  { label: 'For restaurants', id: 'restaurants' },
  { label: 'What it does', id: 'capabilities' },
  { label: 'Install', id: 'install' },
] as const;

type Lenis = { stop?: () => void; start?: () => void };
function getLenis(): Lenis | undefined {
  return (window as unknown as { __tapin_lenis?: Lenis }).__tapin_lenis;
}

export function NavLight() {
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  // once you've scrolled past the hero the nav condenses to a minimal "T●"
  // mark; hovering it expands the full bar back, elegantly.
  const [collapsed, setCollapsed] = useState(false);
  const [hoverNav, setHoverNav] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24);
    setCollapsed(y > 170);
  });

  // lock scroll while the mobile menu is open
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const lenis = getLenis();
    if (menuOpen) {
      lenis?.stop?.();
      document.body.style.overflow = 'hidden';
    } else {
      lenis?.start?.();
      document.body.style.overflow = '';
    }
    return () => {
      lenis?.start?.();
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <>
      <motion.header
        className="rd-nav"
        data-scrolled={scrolled}
        data-collapsed={collapsed && !hoverNav && !menuOpen}
        onMouseEnter={() => setHoverNav(true)}
        onMouseLeave={() => setHoverNav(false)}
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: ease.reveal, delay: 0.15 }}
      >
        <div className="rd-nav__inner">
          <button type="button" className="rd-nav__brand" onClick={() => go('top')} aria-label="TapIn — back to top">
            <span className="rd-nav__wordmark">
              <span className="rd-nav__wm-lead">T</span>
              <span className="rd-nav__wm-rest">apIn</span>
            </span>
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
                onClick={() => go(link.id)}
              >
                {hovered === link.id && (
                  <motion.span layoutId="rd-nav-hl" className="rd-nav__highlight" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
                )}
                <RollText>{link.label}</RollText>
              </button>
            ))}
          </nav>

          <div className="rd-nav__right">
            <CoversCounter />
            <MagneticCTA />
            <button
              type="button"
              className="rd-nav__burger"
              data-open={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{menuOpen && <MobileMenu onGo={go} />}</AnimatePresence>
    </>
  );
}

/* ---------- full-screen mobile menu (clip-path reveal) ---------- */
const overlayVariants: Variants = {
  closed: {
    clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
    transition: { duration: 0.5, ease: ease.liquid },
  },
  open: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
    transition: { duration: 0.7, ease: ease.liquid },
  },
};

// each row self-animates with a staggered delay (robust against nesting)
const rise = (i: number) => ({
  initial: { y: 26, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { delay: 0.22 + i * 0.07, duration: 0.5, ease: ease.liquid } },
  exit: { y: 16, opacity: 0, transition: { duration: 0.2 } },
});

function MobileMenu({ onGo }: { onGo: (id: string) => void }) {
  return (
    <motion.div className="rd-menu" variants={overlayVariants} initial="closed" animate="open" exit="closed">
      <div className="rd-menu__inner">
        <nav className="rd-menu__links" aria-label="Menu">
          {LINKS.map((link, i) => (
            <motion.button key={link.id} type="button" className="rd-menu__link" {...rise(i)} onClick={() => onGo(link.id)}>
              <span className="rd-menu__no">0{i + 1}</span>
              <RollText>{link.label}</RollText>
            </motion.button>
          ))}
        </nav>
        <motion.button type="button" className="rd-btn rd-btn--primary rd-menu__cta" {...rise(LINKS.length)} onClick={() => onGo('contact')}>
          Book a demo <span className="rd-yuzu-dot" />
        </motion.button>
        <motion.div className="rd-menu__foot" {...rise(LINKS.length + 1)}>
          <span className="rd-menu__brand">TapIn</span>
          <span>The invisible OS for modern hospitality</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

/** Text that rolls over itself on hover (two stacked copies). */
function RollText({ children }: { children: string }) {
  return (
    <span className="rd-roll">
      <span className="rd-roll__a">{children}</span>
      <span className="rd-roll__b" aria-hidden="true">{children}</span>
    </span>
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
