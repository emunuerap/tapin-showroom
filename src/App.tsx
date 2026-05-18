import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import { IntroSequence } from './components/sections/IntroSequence';
import { CustomCursor } from './components/layout/CustomCursor';
import { SmoothScroll } from './components/layout/SmoothScroll';
import type { RouteMode, ViewMode } from './types/showroom';

const loadDesktopShowroom = () => import('./components/showroom/DesktopShowroom');
const loadMobileShowroom = () => import('./components/showroom/MobileShowroom');
const loadProductsPage = () => import('./products/ProductsPage');

const DesktopShowroom = lazy(loadDesktopShowroom);
const MobileShowroom = lazy(loadMobileShowroom);
const ProductsPage = lazy(loadProductsPage);

function App() {
  const [activeView, setActiveView] = useState<ViewMode>('guests');
  const [routeMode, setRouteMode] = useState<RouteMode>(() => getRouteMode());
  const [introComplete, setIntroComplete] = useState(() => getRouteMode() === 'products');
  const isMobile = useIsMobile();

  const completeIntro = useCallback(() => {
    setIntroComplete(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onPopState = () => {
      const nextRoute = getRouteMode();
      setRouteMode(nextRoute);
      if (nextRoute === 'products') setIntroComplete(true);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (routeMode === 'products') {
      void loadProductsPage();
      return;
    }

    void loadDesktopShowroom();
    void loadMobileShowroom();
  }, [routeMode]);

  const navigateToProducts = () => {
    void loadProductsPage();
    if (typeof window !== 'undefined' && window.location.pathname !== '/products') {
      window.history.pushState(null, '', '/products');
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    setIntroComplete(true);
    setRouteMode('products');
  };

  const navigateToShowroom = (view?: ViewMode) => {
    if (view) setActiveView(view);
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
    setRouteMode('showroom');
  };

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

      {/* Single Lenis instance — bridges all routes. ProductsPage no longer
          wraps its own SmoothScroll to avoid a nested Lenis on /products. */}
      <SmoothScroll>
        <AnimatePresence mode="wait">
          {routeMode === 'products' ? (
            <Suspense key="products-route" fallback={<ShowroomFallback />}>
              <ProductsPage
                activeView={activeView}
                setActiveView={setActiveView}
                routeMode={routeMode}
                onNavigateProducts={navigateToProducts}
                onNavigateShowroom={navigateToShowroom}
              />
            </Suspense>
          ) : !introComplete ? (
            <IntroSequence key="intro" onComplete={completeIntro} />
          ) : (
            <Suspense key="showroom-route" fallback={<ShowroomFallback />}>
              {isMobile ? (
                <MobileShowroom
                  activeView={activeView}
                  setActiveView={setActiveView}
                  routeMode={routeMode}
                  onNavigateProducts={navigateToProducts}
                  onNavigateShowroom={navigateToShowroom}
                />
              ) : (
                <DesktopShowroom
                  activeView={activeView}
                  setActiveView={setActiveView}
                  routeMode={routeMode}
                  onNavigateProducts={navigateToProducts}
                  onNavigateShowroom={navigateToShowroom}
                />
              )}
            </Suspense>
          )}
        </AnimatePresence>
      </SmoothScroll>
    </div>
  );
}

function getRouteMode(): RouteMode {
  if (typeof window === 'undefined') return 'showroom';
  return window.location.pathname === '/products' ? 'products' : 'showroom';
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
    <div aria-hidden="true" className="min-h-screen bg-[#050505]" />
  );
}

export default App;
