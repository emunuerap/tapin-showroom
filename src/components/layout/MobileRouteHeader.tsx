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
    <header className="fixed inset-x-0 top-0 z-50 overflow-hidden px-3 pt-[max(14px,env(safe-area-inset-top))] md:hidden">
      <div className="mx-auto grid w-[calc(100vw-1.5rem)] max-w-[340px] grid-cols-[2.9rem_minmax(0,1fr)] items-center gap-1.5 rounded-full border border-white/10 bg-[#080808]/88 px-2 py-2 shadow-[0_10px_34px_rgba(0,0,0,0.55)] backdrop-blur-2xl min-[390px]:max-w-[352px]">
        <div className="flex min-w-0 items-baseline text-xs font-bold tracking-normal text-silver">
          TapIn
          <span className="ml-[3px] inline-block h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.85)]" />
        </div>
        <div className="grid min-w-0 grid-cols-3 rounded-full border border-white/8 bg-black/70 p-0.5">
          <MobileRouteButton active={routeMode === 'showroom' && activeView === 'guests'} onClick={() => selectView('guests')}>
            Guest
          </MobileRouteButton>
          <MobileRouteButton active={routeMode === 'products'} onClick={() => onNavigateProducts?.()}>
            Products
          </MobileRouteButton>
          <MobileRouteButton active={routeMode === 'showroom' && activeView === 'venues'} onClick={() => selectView('venues')}>
            Venue
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
      className={`relative min-h-8 min-w-0 overflow-hidden rounded-full px-0.5 py-1.5 text-center font-mono text-[7px] font-semibold uppercase tracking-normal transition-colors min-[390px]:text-[8px] ${
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
