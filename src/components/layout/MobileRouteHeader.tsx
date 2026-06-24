import { motion } from 'framer-motion';
import type { ViewMode } from '../../types/showroom';

interface MobileRouteHeaderProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  onNavigateShowroom?: (view?: ViewMode) => void;
}

const TABS: { id: ViewMode; label: string }[] = [
  { id: 'guests', label: 'Guests' },
  { id: 'venues', label: 'Venues' },
];

export function MobileRouteHeader({ activeView, setActiveView, onNavigateShowroom }: MobileRouteHeaderProps) {
  const selectView = (view: ViewMode) => {
    setActiveView(view);
    onNavigateShowroom?.(view);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-hidden px-3 pt-[max(14px,env(safe-area-inset-top))] md:hidden">
      <div
        className="mx-auto flex w-[calc(100vw-1.5rem)] max-w-[340px] items-center gap-2 px-2.5 py-2 min-[390px]:max-w-[352px]"
        style={{
          background: 'rgba(8,8,8,0.82)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '20px',
          boxShadow: '0 10px 34px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.10)',
        }}
      >
        {/* Wordmark */}
        <div
          className="flex min-w-0 items-baseline shrink-0"
          style={{ paddingRight: '10px', borderRight: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-xs font-bold tracking-tight text-white/90">TapIn</span>
          <span
            aria-hidden="true"
            className="ml-[3px] inline-block h-1.5 w-1.5 rounded-full"
            style={{ background: '#ccff00', boxShadow: '0 0 8px rgba(204,255,0,0.85)' }}
          />
        </div>

        {/* Two-tab toggle */}
        <div
          className="flex flex-1 items-center p-[3px]"
          style={{
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-pressed={activeView === tab.id}
              onClick={() => selectView(tab.id)}
              className="relative flex-1 py-1.5 text-center select-none"
              style={{
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '11px',
                color: activeView === tab.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.32)',
                transition: 'color 0.22s ease',
              }}
            >
              {activeView === tab.id && (
                <motion.span
                  layoutId="mobile-active-tab"
                  className="absolute inset-0 -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 36 }}
                  style={{
                    borderRadius: '11px',
                    background: 'rgba(255,255,255,0.10)',
                    boxShadow: [
                      'inset 0 1px 0 rgba(255,255,255,0.20)',
                      'inset 0 -1px 0 rgba(0,0,0,0.16)',
                      '0 2px 6px rgba(0,0,0,0.25)',
                    ].join(', '),
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
