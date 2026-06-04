import { useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { scrollToId } from '../motion/scrollTo';
import { ease } from '../../design/light-tokens';

/**
 * NavLight — minimal, journey-led navigation.
 *
 * Deliberately NOT the old Guests / Products / Venues tab model. It only
 * links to sections that exist in this phase-1 prototype (the gesture, the
 * restaurant layer, the demo CTA) — App + Intelligence join in phase 2 rather
 * than dead-link today.
 */
const LINKS = [
  { label: 'How it works', id: 'gesture' },
  { label: 'For Restaurants', id: 'restaurants' },
] as const;

export function NavLight() {
  const [scrolled, setScrolled] = useState(false);
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
        <button
          type="button"
          className="rd-nav__brand"
          onClick={() => scrollToId('top')}
          aria-label="TapIn — back to top"
        >
          <span className="rd-nav__wordmark">TapIn</span>
          <span className="rd-nav__dot" aria-hidden="true" />
        </button>

        <nav className="rd-nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              className="rd-nav__link"
              onClick={() => scrollToId(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="rd-btn rd-btn--primary rd-nav__cta"
          onClick={() => scrollToId('contact')}
        >
          Book a demo
        </button>
      </div>
    </motion.header>
  );
}
