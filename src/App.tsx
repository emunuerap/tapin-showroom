import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { IntroSequence } from './components/sections/IntroSequence';
import { CustomCursor } from './components/layout/CustomCursor';
import type { ViewMode } from './types/showroom';

const DesktopShowroom = lazy(() => import('./components/showroom/DesktopShowroom'));
const MobileShowroom = lazy(() => import('./components/showroom/MobileShowroom'));

function App() {
  const [activeView, setActiveView] = useState<ViewMode>('guests');
  const [introComplete, setIntroComplete] = useState(false);
  const isMobile = useIsMobile();

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
          <Suspense fallback={<ShowroomFallback />}>
            {isMobile ? (
              <MobileShowroom activeView={activeView} setActiveView={setActiveView} />
            ) : (
              <DesktopShowroom activeView={activeView} setActiveView={setActiveView} />
            )}
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 767px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 767px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

function ShowroomFallback() {
  return (
    <div className="min-h-screen grid place-items-center bg-[#050505]">
      <div className="h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_18px_rgba(204,255,0,0.8)]" />
    </div>
  );
}

export default App;
