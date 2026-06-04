import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { Atmosphere } from '../visuals/Atmosphere';
import { NavLight } from '../components/NavLight';
import { OpeningScene } from '../components/OpeningScene';
import { GestureFlow } from '../components/GestureFlow';
import { RestaurantLayer } from '../components/RestaurantLayer';
import { RestaurantCapabilities } from '../components/RestaurantCapabilities';
import { InstallFlow } from '../components/InstallFlow';
import { ClosingSection } from '../components/ClosingSection';
import '../redesign.css';
import '../redesign.sections.css';

/**
 * HomeRedesign — the "Light Immersive Hospitality OS" direction.
 *
 * A single scrolling journey (no Guests/Products/Venues tabs): identity →
 * the gesture → the restaurant layer → close. Everything is scoped under
 * `.tapin-light` and the document is painted warm while this is mounted, so
 * none of it touches the archived dark obsidian showroom.
 *
 * `MotionConfig reducedMotion="user"` propagates the OS reduced-motion
 * preference to every framer animation in the tree.
 */
export default function HomeRedesign() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('tapin-light-active');
    return () => root.classList.remove('tapin-light-active');
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="tapin-light">
        <Atmosphere />
        <NavLight />
        <main>
          <OpeningScene />
          <GestureFlow />
          <RestaurantLayer />
          <RestaurantCapabilities />
          <InstallFlow />
          <ClosingSection />
        </main>
      </div>
    </MotionConfig>
  );
}
