import { motion } from 'framer-motion';
import type { ViewMode } from '../../types/showroom';

interface NavbarProps {
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  onNavigateShowroom?: (view?: ViewMode) => void;
}

const TABS: { id: ViewMode; label: string }[] = [
  { id: 'guests', label: 'Guests' },
  { id: 'venues', label: 'Venues' },
];

export function Navbar({ activeView, setActiveView, onNavigateShowroom }: NavbarProps) {
  const selectView = (view: ViewMode) => {
    setActiveView(view);
    onNavigateShowroom?.(view);
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] hidden md:flex items-center"
    >
      <div
        className="flex items-center gap-2.5 px-2.5 py-2"
        style={{
          background: 'rgba(255,255,255,0.065)',
          backdropFilter: 'blur(44px) saturate(180%)',
          WebkitBackdropFilter: 'blur(44px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.11)',
          borderRadius: '22px',
          boxShadow: [
            '0 8px 40px rgba(0,0,0,0.55)',
            'inset 0 1px 0 rgba(255,255,255,0.13)',
            'inset 0 -1px 0 rgba(0,0,0,0.25)',
          ].join(', '),
        }}
      >
        {/* Wordmark */}
        <button
          type="button"
          onClick={() => selectView('guests')}
          aria-label="TapIn — back to top"
          className="flex items-baseline select-none"
          style={{ borderRight: '1px solid rgba(255,255,255,0.08)', paddingLeft: '8px', paddingRight: '14px', marginRight: '2px' }}
        >
          <span
            className="text-[13px] font-bold tracking-[-0.02em] text-white/90"
            style={{ fontFamily: 'var(--font-sans, system-ui)' }}
          >
            TapIn
          </span>
          <span
            aria-hidden="true"
            className="ml-[4px] mb-[1px] inline-block w-[5px] h-[5px] rounded-full"
            style={{ background: '#ccff00', boxShadow: '0 0 8px 1px rgba(204,255,0,0.65)' }}
          />
        </button>

        {/* Two-tab toggle */}
        <div
          className="flex items-center p-[3px]"
          style={{
            background: 'rgba(0,0,0,0.35)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectView(tab.id)}
              className="relative z-10 select-none"
              style={{
                padding: '5px 18px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-sans, system-ui)',
                color: activeView === tab.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.32)',
                transition: 'color 0.22s ease',
                borderRadius: '13px',
              }}
            >
              {activeView === tab.id && (
                <motion.span
                  layoutId="nav-active-tab"
                  className="absolute inset-0 -z-10"
                  transition={{ type: 'spring', stiffness: 360, damping: 34, mass: 0.9 }}
                  style={{
                    borderRadius: '13px',
                    background: 'rgba(255,255,255,0.11)',
                    boxShadow: [
                      'inset 0 1px 0 rgba(255,255,255,0.22)',
                      'inset 0 -1px 0 rgba(0,0,0,0.18)',
                      '0 2px 8px rgba(0,0,0,0.28)',
                    ].join(', '),
                    border: '1px solid rgba(255,255,255,0.14)',
                  }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Context-aware CTA */}
        <div className="pl-1 pr-1">
          {activeView === 'guests' ? (
            <button
              type="button"
              className="select-none"
              style={{
                padding: '7px 16px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.8)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.95)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)';
              }}
            >
              Get the App
            </button>
          ) : (
            <button
              type="button"
              className="select-none"
              style={{
                padding: '7px 16px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                borderRadius: '14px',
                background: '#ccff00',
                border: '1px solid rgba(204,255,0,0.4)',
                color: '#0a0a0a',
                boxShadow: '0 0 18px rgba(204,255,0,0.22), inset 0 1px 0 rgba(255,255,255,0.35)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(204,255,0,0.38), inset 0 1px 0 rgba(255,255,255,0.35)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 18px rgba(204,255,0,0.22), inset 0 1px 0 rgba(255,255,255,0.35)';
              }}
            >
              Request Demo
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
