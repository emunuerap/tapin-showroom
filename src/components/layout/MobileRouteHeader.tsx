import { motion } from 'framer-motion';

import type { RouteMode, ViewMode } from '../../types/showroom';

interface MobileRouteHeaderProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  routeMode?: RouteMode;
  onNavigateProducts?: () => void;
  onNavigateShowroom?: (view?: ViewMode) => void;
}

export function MobileRouteHeader({
  activeView,
  setActiveView,
  routeMode = 'showroom',
  onNavigateProducts,
  onNavigateShowroom,
}: MobileRouteHeaderProps) {
  const selectView = (view: ViewMode) => {
    setActiveView(view);
    onNavigateShowroom?.(view);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-screen max-w-[100vw] overflow-hidden px-4 pt-[max(14px,env(safe-area-inset-top))] md:hidden">
      <div className="mx-auto flex w-full max-w-[430px] items-center justify-between gap-1.5 rounded-full border border-white/10 bg-[#080808]/88 px-2.5 py-2 shadow-[0_10px_34px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="flex items-baseline text-xs font-bold tracking-tighter text-silver min-[390px]:text-sm">
          TapIn
          <span className="ml-[3px] inline-block h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.85)]" />
        </div>
        <div className="flex rounded-full border border-white/8 bg-black/70 p-0.5">
          <MobileRouteButton active={routeMode === 'showroom' && activeView === 'guests'} onClick={() => selectView('guests')}>
            Guests
          </MobileRouteButton>
          <MobileRouteButton active={routeMode === 'products'} onClick={() => onNavigateProducts?.()}>
            Products
          </MobileRouteButton>
          <MobileRouteButton active={routeMode === 'showroom' && activeView === 'venues'} onClick={() => selectView('venues')}>
            Venues
          </MobileRouteButton>
        </div>
      </div>
    </header>
  );
}

function MobileRouteButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative rounded-full px-1.5 py-1.5 font-mono text-[7px] font-semibold uppercase tracking-[0.08em] transition-colors min-[390px]:px-2 min-[390px]:text-[8px] ${
        active ? 'text-white' : 'text-white/35'
      }`}
    >
      {active && (
        <motion.span
          layoutId="mobile-active-view"
          className="absolute inset-0 -z-10 rounded-full border border-yuzu/35 bg-yuzu/15 shadow-[0_0_16px_rgba(204,255,0,0.18)]"
          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
        />
      )}
      {children}
    </button>
  );
}
