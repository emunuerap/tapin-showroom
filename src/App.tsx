import { useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

import { Navbar } from './components/layout/Navbar';
import { IntroSequence } from './components/sections/IntroSequence';
import { Footer } from './components/layout/Footer';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { CustomCursor } from './components/layout/CustomCursor';
import { Hero } from './components/sections/Hero';
import { Manifesto } from './components/sections/Manifesto';
import { Ecosystem } from './components/sections/Ecosystem';
import { WalkInExpress } from './components/sections/WalkInExpress';
import { TasteGenomeVisualizer } from './components/sections/TasteGenomeVisualizer';
import { ConsumerAppShowcase } from './components/sections/ConsumerAppShowcase';
import { IAFloorShuffler } from './components/sections/IAFloorShuffler';
import { BrandClose } from './components/sections/BrandClose';
import { AICommandLayer } from './components/sections/AICommandLayer';
import { GratitudeLoop } from './components/sections/GratitudeLoop';
import { RevenueEngine } from './components/sections/RevenueEngine';
import { PrivacyTrust } from './components/sections/PrivacyTrust';

gsap.registerPlugin(ScrollTrigger);



function App() {
  const [activeView, setActiveView] = useState<'guests' | 'venues'>('guests');
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="relative bg-[#050505] min-h-screen text-white font-sans overflow-x-hidden">
      {/* Custom cursor — auto-disabled on touch / reduced-motion */}
      <CustomCursor />

      {/* Universal ambient layer — fixed behind every section so there are no
          dead black gaps between sections. Combines 4 quiet yuzu radial glows
          (each corner + a center warmth) + an ultra-faint paper grain. Sits
          at z-0; all sections render z-10 above. */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Composite radial glows — different sizes/intensities so it doesn't feel uniform */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(900px circle at 12% 18%, rgba(204,255,0,0.024), transparent 65%)',
              'radial-gradient(700px circle at 88% 22%, rgba(204,255,0,0.018), transparent 65%)',
              'radial-gradient(800px circle at 18% 82%, rgba(204,255,0,0.020), transparent 65%)',
              'radial-gradient(900px circle at 85% 88%, rgba(204,255,0,0.022), transparent 65%)',
              'radial-gradient(1100px circle at 50% 50%, rgba(204,255,0,0.012), transparent 70%)',
            ].join(', '),
          }}
        />
        {/* Paper-grain noise overlay — consistent visual texture across all sections */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-[0.035]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")',
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!introComplete ? (
          <IntroSequence key="intro" onComplete={() => setIntroComplete(true)} />
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            <Navbar activeView={activeView} setActiveView={setActiveView} />

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
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full flex flex-col"
                    >
                      <div id="protocol">
                        {/* Friction vs Flow / 5-Second Simulator */}
                        <Manifesto />
                      </div>
                      
                      <div id="walk-in">
                        {/* Walk-In Express */}
                        <WalkInExpress />
                      </div>
                      
                      <div id="genome">
                        {/* Taste Genome Visualizer */}
                        <TasteGenomeVisualizer />
                      </div>
                      
                      {/* Protocol monolith cards removed — they duplicated content
                          that the dedicated sections (TasteGenome, ConsumerApp,
                          GratitudeLoop) already deliver in greater depth. */}

                      <div id="passport">
                        <ConsumerAppShowcase />
                      </div>

                      {/* Emotional close of the guest journey — the visit becomes memory. */}
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
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="w-full flex flex-col"
                    >
                      <div id="cockpit">
                        {/* The Command Center / Hospitality OS */}
                        <Ecosystem />
                      </div>
                      
                      <div id="tetris">
                        {/* The Tetris Agent Floorplan & Sentient Floorplan */}
                        <IAFloorShuffler />
                      </div>
                      
                      {/* Protocol Venues cards removed — Sentient Floorplan
                          duplicated IAFloorShuffler, Prediction Matrix is now
                          folded conceptually into RevenueEngine. */}

                      {/* Concrete ROI — the operator's "numbers, not poetry" moment. */}
                      <div id="revenue-engine">
                        <RevenueEngine />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Universal — signature section. Demonstrates the AI Command Layer
                    with scenarios adapted to the active view (Guests vs Venues). */}
                <AICommandLayer activeView={activeView} />

                {/* Universal — privacy & trust commitment. Required moment for any
                    premium brand that captures behavioural data. */}
                <PrivacyTrust />

                {/* Universal brand close — CTA adapts to active view (Get the App
                    for guests, Request a Demo for venues), plus a quiet secondary
                    link inviting the visitor to the other perspective. */}
                <BrandClose
                  activeView={activeView}
                  onSwitchView={() => setActiveView(activeView === 'guests' ? 'venues' : 'guests')}
                />
              </main>
              <Footer />
            </SmoothScroll>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
