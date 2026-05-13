import { AnimatePresence, motion } from 'framer-motion';

import { AICommandLayer } from '../sections/AICommandLayer';
import { BrandClose } from '../sections/BrandClose';
import { ConsumerAppShowcase } from '../sections/ConsumerAppShowcase';
import { Ecosystem } from '../sections/Ecosystem';
import { Footer } from '../layout/Footer';
import { GratitudeLoop } from '../sections/GratitudeLoop';
import { Hero } from '../sections/Hero';
import { IAFloorShuffler } from '../sections/IAFloorShuffler';
import { Manifesto } from '../sections/Manifesto';
import { Navbar } from '../layout/Navbar';
import { PrivacyTrust } from '../sections/PrivacyTrust';
import { RevenueEngine } from '../sections/RevenueEngine';
import { SmoothScroll } from '../layout/SmoothScroll';
import { TasteGenomeVisualizer } from '../sections/TasteGenomeVisualizer';
import { WalkInExpress } from '../sections/WalkInExpress';
import type { ShowroomProps } from '../../types/showroom';

export default function DesktopShowroom({ activeView, setActiveView, routeMode, onNavigateProducts }: ShowroomProps) {
  return (
    <motion.div
      key="desktop-showroom"
      initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        routeMode={routeMode}
        onNavigateProducts={onNavigateProducts}
      />

      <SmoothScroll>
        <main className="pt-32">
          <Hero activeView={activeView} />

          <AnimatePresence mode="wait">
            {activeView === 'guests' ? (
              <motion.div
                key="guests-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-full flex flex-col"
              >
                <div id="protocol">
                  <Manifesto />
                </div>

                <div id="walk-in">
                  <WalkInExpress />
                </div>

                <div id="genome">
                  <TasteGenomeVisualizer />
                </div>

                <div id="passport">
                  <ConsumerAppShowcase />
                </div>

                <div id="gratitude-loop">
                  <GratitudeLoop />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="venues-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-full flex flex-col"
              >
                <div id="cockpit">
                  <Ecosystem />
                </div>

                <div id="tetris">
                  <IAFloorShuffler />
                </div>

                <div id="revenue-engine">
                  <RevenueEngine />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AICommandLayer activeView={activeView} />
          {activeView === 'guests' && <PrivacyTrust />}
          <BrandClose
            activeView={activeView}
            onSwitchView={() => setActiveView(activeView === 'guests' ? 'venues' : 'guests')}
          />
        </main>
        <Footer />
      </SmoothScroll>
    </motion.div>
  );
}
