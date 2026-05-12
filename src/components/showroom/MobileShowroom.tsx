import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import type { ShowroomProps, ViewMode } from '../../types/showroom';

gsap.registerPlugin(ScrollTrigger);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const VIEW_LABELS: Record<ViewMode, { primaryCta: string; alternate: string; heroMode: string }> = {
  guests: { primaryCta: 'Join Waitlist', alternate: 'For venues', heroMode: 'Guest intelligence' },
  venues: { primaryCta: 'Request Demo', alternate: 'For guests', heroMode: 'Venue operating system' },
};

const HERO_PIPELINE: Record<ViewMode, Array<{ label: string; value: string }>> = {
  guests: [
    { label: 'Identity', value: 'phone verified' },
    { label: 'Taste', value: 'Chablis - corner - late' },
    { label: 'Action', value: 'table 04 staged' },
  ],
  venues: [
    { label: 'Front room', value: 'VIP routed' },
    { label: 'Revenue', value: 'turns protected' },
    { label: 'Back office', value: 'invoice matched' },
  ],
};

const COMMANDS: Record<ViewMode, Array<{ label: string; prompt: string; result: string[]; visual: 'book' | 'memory' | 'vip' | 'invoice' | 'revenue' }>> = {
  guests: [
    {
      label: 'Book',
      prompt: 'Find somewhere intimate, Italian, tonight at 20:30.',
      result: ['Osteria Lumina - 94% fit', 'Table 04 held for 2', 'Chablis preference sent quietly'],
      visual: 'book',
    },
    {
      label: 'Remember',
      prompt: 'What did we drink last time at Casa Marisol?',
      result: ['Cotes du Rhone - 2021', 'Mussels, no dessert', 'Window table with Diego'],
      visual: 'memory',
    },
  ],
  venues: [
    {
      label: 'Floor',
      prompt: 'VIP just arrived. Where should they go?',
      result: ['Seat T09 - quiet booth', 'Server Sofia assigned', '2018 Barolo pre-staged'],
      visual: 'vip',
    },
    {
      label: 'Invoices',
      prompt: 'Process today supplier invoices and flag exceptions.',
      result: ['La Finca Produce matched to PO', 'Wine House coded to COGS', '1 VAT mismatch needs review'],
      visual: 'invoice',
    },
    {
      label: 'Yield',
      prompt: 'Four walk-ins waiting. Protect revenue without rushing guests.',
      result: ['T11 clears in 4 min', 'Bar alternative ready now', 'RevPASH impact +18%'],
      visual: 'revenue',
    },
  ],
};

export default function MobileShowroom({ activeView, setActiveView }: ShowroomProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useMobileSmoothScroll(Boolean(shouldReduceMotion));
  useMobileScrollTheatre(rootRef, activeView, Boolean(shouldReduceMotion));

  return (
    <motion.div
      ref={rootRef}
      key="mobile-showroom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative z-10 min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      <MobileHeader activeView={activeView} setActiveView={setActiveView} />
      <main className="relative pb-36">
        <MobileHero activeView={activeView} />
        <ArrivalChapter activeView={activeView} />
        <TasteChapter activeView={activeView} />
        <MemoryChapter activeView={activeView} />
        <VenueOSChapter activeView={activeView} />
        <CommandChapter activeView={activeView} />
        <TrustChapter
          activeView={activeView}
          onSwitchView={() => setActiveView(activeView === 'guests' ? 'venues' : 'guests')}
        />
      </main>
      <StickyCTA activeView={activeView} />
    </motion.div>
  );
}

function useMobileSmoothScroll(disabled: boolean) {
  useEffect(() => {
    if (disabled || typeof window === 'undefined') return;
    if (!window.matchMedia('(max-width: 767px)').matches) return;

    let cancelled = false;
    let raf: ((time: number) => void) | null = null;
    let lenis: { raf: (time: number) => void; destroy: () => void; on: (event: string, cb: () => void) => void } | null = null;

    void import('lenis').then((mod) => {
      if (cancelled) return;
      const Lenis = mod.default;
      const instance = new Lenis({
        duration: 0.92,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.82,
        touchMultiplier: 1,
      });
      lenis = instance;
      instance.on('scroll', ScrollTrigger.update);
      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      cancelled = true;
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, [disabled]);
}

function useMobileScrollTheatre(scope: React.RefObject<HTMLDivElement | null>, activeView: ViewMode, disabled: boolean) {
  useGSAP(
    () => {
      if (disabled || !scope.current) return;

      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.hero-choreo',
          { opacity: 0, y: 24, filter: 'blur(8px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.08, ease: 'power3.out' }
        );

        gsap.to('.hero-map-drift', {
          yPercent: -8,
          ease: 'none',
          scrollTrigger: {
            trigger: '.mobile-hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        gsap.utils.toArray<HTMLElement>('.mobile-chapter').forEach((section) => {
          const reveals = section.querySelectorAll('.m-reveal');
          const progress = section.querySelector('.m-progress');
          const art = section.querySelector('.m-art');

          if (reveals.length) {
            gsap.fromTo(
              reveals,
              { opacity: 0, y: 28, filter: 'blur(8px)' },
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.75,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 82%',
                },
              }
            );
          }

          if (progress) {
            gsap.fromTo(
              progress,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 78%',
                  end: 'bottom 38%',
                  scrub: true,
                },
              }
            );
          }

          if (art) {
            gsap.fromTo(
              art,
              { y: 18, rotateX: -4 },
              {
                y: -10,
                rotateX: 0,
                ease: 'none',
                scrollTrigger: {
                  trigger: section,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.6,
                },
              }
            );
          }
        });

        ScrollTrigger.refresh();
      }, scope.current);

      return () => ctx.revert();
    },
    { dependencies: [activeView, disabled], revertOnUpdate: true }
  );
}

function MobileHeader({ activeView, setActiveView }: ShowroomProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-[max(14px,env(safe-area-inset-top))]">
      <div className="mx-auto flex max-w-[430px] items-center justify-between rounded-full border border-white/10 bg-[#080808]/88 px-3 py-2 shadow-[0_10px_34px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="flex items-baseline text-sm font-bold tracking-tighter text-silver">
          TapIn
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.85)]" />
        </div>
        <div className="flex rounded-full border border-white/8 bg-black/70 p-0.5">
          <ToggleButton active={activeView === 'guests'} onClick={() => setActiveView('guests')}>
            Guests
          </ToggleButton>
          <ToggleButton active={activeView === 'venues'} onClick={() => setActiveView('venues')}>
            Venues
          </ToggleButton>
        </div>
      </div>
    </header>
  );
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`relative rounded-full px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
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

function StickyCTA({ activeView }: { activeView: ViewMode }) {
  const label = VIEW_LABELS[activeView].primaryCta;
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-[#050505] via-[#050505]/82 to-transparent px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3">
      <button
        type="button"
        className="mx-auto flex min-h-12 w-full max-w-[430px] items-center justify-center rounded-full bg-yuzu px-6 py-3 text-center font-sans text-[11px] font-extrabold uppercase tracking-[0.24em] text-obsidian shadow-[0_0_30px_rgba(204,255,0,0.26)] active:scale-[0.99]"
      >
        {label}
      </button>
    </div>
  );
}

function MobileHero({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <section className="mobile-hero relative overflow-hidden px-5 pb-12 pt-24">
      <HeroAtmosphere activeView={activeView} />
      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-104px)] w-full max-w-[430px] flex-col justify-between gap-6">
        <div className="space-y-5">
          <div className="hero-choreo flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-yuzu/72">
            <span className="h-px w-9 bg-yuzu/45" />
            {VIEW_LABELS[activeView].heroMode}
          </div>
          <h1 className="hero-choreo text-[clamp(3.15rem,16vw,5.4rem)] font-black leading-[0.84] tracking-tighter text-silver">
            Hospitality is now
            <span className="mt-2 block font-serif text-[1.1em] font-normal italic leading-[0.86] tracking-tight text-yuzu drop-shadow-[0_0_28px_rgba(204,255,0,0.26)]">
              Sentient.
            </span>
          </h1>
          <p className="hero-choreo max-w-[21rem] font-mono text-[11px] leading-relaxed tracking-[0.08em] text-silver/66">
            {isGuests
              ? 'TapIn turns a phone number into recognition: the venue knows the useful parts before you explain the night.'
              : 'TapIn gives operators one live surface for guests, tables, revenue, staff, suppliers, and invoices.'}
          </p>
          <SignalPipeline activeView={activeView} />
        </div>

        <div className="pb-[6.75rem]">
          <div className="hero-choreo">
            <HeroSignalCard activeView={activeView} />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroAtmosphere({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <div className="hero-map-drift absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(204,255,0,0.13)_0%,rgba(204,255,0,0.025)_34%,transparent_68%)]" />
      <svg viewBox="0 0 390 760" className="absolute inset-0 h-full w-full opacity-75" aria-hidden="true">
        <defs>
          <filter id={`mobile-glow-${activeView}`} x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {isGuests ? (
          <g fill="none" strokeLinecap="round">
            <path d="M30 182C78 126 142 150 180 210S268 292 346 238" stroke="rgba(255,255,255,0.1)" />
            <path d="M44 565C108 486 154 468 214 512S300 598 356 500" stroke="rgba(255,255,255,0.08)" />
            <motion.path
              d="M58 598C104 492 92 340 154 268S266 236 334 138"
              stroke="rgba(204,255,0,0.38)"
              strokeWidth="1.2"
              strokeDasharray="4 10"
              animate={{ strokeDashoffset: [0, -56] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            />
            {[
              { x: 58, y: 598, label: 'Phone' },
              { x: 154, y: 268, label: 'Taste' },
              { x: 334, y: 138, label: 'Table' },
            ].map((node, i) => (
              <g key={node.label}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={i === 1 ? 6 : 4}
                  fill="rgba(204,255,0,0.94)"
                  filter={`url(#mobile-glow-${activeView})`}
                  animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />
                <text x={node.x + 10} y={node.y + 4} fill="rgba(255,255,255,0.38)" fontSize="8" letterSpacing="1.4">
                  {node.label.toUpperCase()}
                </text>
              </g>
            ))}
          </g>
        ) : (
          <g fill="none" strokeLinecap="round">
            <rect x="38" y="105" width="314" height="520" rx="18" stroke="rgba(255,255,255,0.13)" />
            <path d="M70 205H318M70 385H318M194 125V598" stroke="rgba(255,255,255,0.06)" />
            <motion.path
              d="M82 506C126 448 122 300 188 258S278 230 314 160"
              stroke="rgba(204,255,0,0.36)"
              strokeWidth="1.2"
              strokeDasharray="5 9"
              animate={{ strokeDashoffset: [0, -60] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            {[
              { x: 86, y: 506, label: 'Door' },
              { x: 188, y: 258, label: 'Seat' },
              { x: 314, y: 160, label: 'POS' },
              { x: 252, y: 462, label: 'AP' },
            ].map((node, i) => (
              <g key={node.label}>
                <motion.rect
                  x={node.x - 8}
                  y={node.y - 8}
                  width="16"
                  height="16"
                  rx="4"
                  fill="rgba(204,255,0,0.08)"
                  stroke="rgba(204,255,0,0.48)"
                  animate={{ opacity: [0.34, 0.95, 0.34] }}
                  transition={{ duration: 2.8 + i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
                />
                <text x={node.x + 14} y={node.y + 3} fill="rgba(255,255,255,0.38)" fontSize="8" letterSpacing="1.4">
                  {node.label.toUpperCase()}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.58)_58%,#050505_100%)]" />
    </div>
  );
}

function HeroSignalCard({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#090909]/82 shadow-[0_24px_70px_rgba(0,0,0,0.58)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-yuzu/80">
          {isGuests ? 'Recognized' : 'Live room'}
        </span>
        <span className="font-mono text-[9px] text-silver/45">now</span>
      </div>
      {isGuests ? (
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-2xl italic leading-none text-white/92">Osteria Lumina</p>
              <p className="mt-2 text-[12px] leading-relaxed text-silver/62">Table 04 ready. The room already knows the useful details.</p>
            </div>
            <div className="flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border border-yuzu/35 bg-yuzu/[0.06]">
              <span className="font-serif text-2xl italic text-yuzu">94</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['+1 555 verified', 'quiet corner', 'Chablis passed'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-[10px] leading-none text-silver/62">
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[1fr_96px] gap-4 p-4">
          <div className="space-y-2">
            <SignalRow label="VIP arrival routed to T09" />
            <SignalRow label="Walk-ins balanced against dwell" />
            <SignalRow label="Supplier invoice auto-coded" />
          </div>
          <div className="grid gap-2">
            <Metric number="+18%" label="RevPASH" />
            <Metric number="1" label="Exception" />
          </div>
        </div>
      )}
    </div>
  );
}

function SignalPipeline({ activeView }: { activeView: ViewMode }) {
  return (
    <div className="hero-choreo grid grid-cols-3 gap-2">
      {HERO_PIPELINE[activeView].map((item, i) => (
        <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3">
          <div className="mb-2 font-serif text-lg italic leading-none text-yuzu">0{i + 1}</div>
          <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/40">{item.label}</div>
          <div className="mt-1 text-[10px] leading-snug text-silver/66">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

function ArrivalChapter({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <MobileSection
      index="01"
      label="Arrival"
      title={isGuests ? 'Five seconds. Then the room knows enough.' : 'Every arrival becomes a routed event.'}
      copy={
        isGuests
          ? "Tap the plate, confirm your number, and TapIn sends only tonight's service cues: table, pace, taste, and context."
          : 'Walk-ins, VIPs, regulars, and late parties stop living in separate tools. The floor receives one ranked queue.'
      }
    >
      <div className="m-reveal m-art">
        {isGuests ? <GuestArrivalVisual /> : <VenueArrivalVisual />}
      </div>
      <div className="m-reveal grid grid-cols-3 gap-2">
        <Metric number="5s" label="Confirm" />
        <Metric number="0" label="Passwords" />
        <Metric number="1" label={isGuests ? 'Passport' : 'Queue'} />
      </div>
    </MobileSection>
  );
}

function GuestArrivalVisual() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <div className="absolute -right-16 top-8 h-44 w-44 rounded-full border border-yuzu/14 bg-yuzu/[0.025]" />
      <div className="grid grid-cols-[112px_1fr] gap-4">
        <div className="relative h-[232px] rounded-[1.8rem] border border-white/14 bg-[#111] p-3 shadow-[0_26px_60px_rgba(0,0,0,0.72)]">
          <div className="mx-auto mb-5 h-3 w-12 rounded-b-xl bg-black" />
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-yuzu/80">TapIn</span>
            <p className="mt-3 font-serif text-[22px] italic leading-none text-white">Your table awaits.</p>
            <p className="mt-3 text-[10px] leading-relaxed text-silver/58">+1 555 019 82 verified</p>
          </div>
          <motion.div
            className="absolute inset-x-5 bottom-6 h-10 rounded-full bg-yuzu text-center font-mono text-[9px] font-bold uppercase tracking-[0.2em] leading-10 text-obsidian"
            animate={{ boxShadow: ['0 0 16px rgba(204,255,0,0.18)', '0 0 34px rgba(204,255,0,0.34)', '0 0 16px rgba(204,255,0,0.18)'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            Confirmed
          </motion.div>
        </div>
        <div className="flex flex-col justify-center gap-3">
          {[
            ['01', 'Tap plate', 'NFC or QR wakes the protocol.'],
            ['02', 'Confirm number', 'No app, no password, no profile setup.'],
            ['03', 'Host sees context', 'Enough to welcome, never too much.'],
          ].map(([num, title, body]) => (
            <div key={num} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg italic text-yuzu">{num}</span>
                <span className="font-sans text-[12px] font-semibold text-white/88">{title}</span>
              </div>
              <p className="mt-1 text-[10px] leading-snug text-silver/52">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VenueArrivalVisual() {
  const arrivals = [
    ['VIP', 'Marta L.', 'T09 - Sofia'],
    ['Walk-in', '4 guests', 'bar hold'],
    ['Regular', 'Diego party', 'T04 ready'],
    ['Late', '20:30', '15m buffer'],
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-silver/42">Arrival router</span>
        <span className="rounded-full border border-yuzu/30 bg-yuzu/[0.06] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-yuzu">live</span>
      </div>
      <div className="grid gap-2">
        {arrivals.map(([type, guest, action], i) => (
          <motion.div
            key={`${type}-${guest}`}
            className="grid grid-cols-[58px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3"
            animate={{ borderColor: i === 0 ? ['rgba(255,255,255,0.1)', 'rgba(204,255,0,0.36)', 'rgba(255,255,255,0.1)'] : undefined }}
            transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.25 }}
          >
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-yuzu/75">{type}</span>
            <span className="font-sans text-[12px] font-semibold text-white/86">{guest}</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-silver/48">{action}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TasteChapter({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <MobileSection
      index="02"
      label={isGuests ? 'Taste Genome' : 'Guest Context'}
      title={isGuests ? 'Your palate becomes usable memory.' : 'The team gets context before hello.'}
      copy={
        isGuests
          ? 'The Genome is not a chart for decoration. It is a living model of what you like, what to avoid, and how you prefer the night to feel.'
          : 'TapIn translates guest history into service actions: what to offer, where to seat, what to avoid, and how much detail staff should see.'
      }
    >
      <div className="m-reveal m-art">
        {isGuests ? <GuestTasteVisual /> : <VenueGuestContextVisual />}
      </div>
    </MobileSection>
  );
}

function GuestTasteVisual() {
  const signals = [
    ['Wine', 'Chablis, mineral whites', '92'],
    ['Room', 'quiet corner, low light', '84'],
    ['Pace', 'slow dinner, no rush', '78'],
    ['Avoid', 'shellfish, loud bar', '100'],
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <div className="absolute left-1/2 top-7 h-36 w-36 -translate-x-1/2 rounded-full border border-yuzu/16 bg-yuzu/[0.018]" />
      <div className="relative mx-auto mb-5 flex h-36 w-36 items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full border border-dashed border-yuzu/24"
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-5 rounded-full border border-dashed border-white/12"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        <div className="relative z-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border border-yuzu/35 bg-yuzu/[0.06] text-center">
          <span className="font-serif text-2xl italic text-yuzu">You</span>
          <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-silver/50">Genome</span>
        </div>
        {[
          ['Chablis', 'left-0 top-3'],
          ['Corner', 'right-0 top-10'],
          ['Late', 'bottom-3 left-3'],
          ['No shellfish', 'bottom-1 right-0'],
        ].map(([label, pos]) => (
          <span key={label} className={`absolute ${pos} rounded-full border border-white/10 bg-black/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-silver/62`}>
            {label}
          </span>
        ))}
      </div>
      <div className="grid gap-2">
        {signals.map(([label, desc, value]) => (
          <div key={label} className="grid grid-cols-[54px_1fr_30px] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-yuzu/70">{label}</span>
            <div>
              <div className="h-1 rounded-full bg-white/8">
                <motion.div
                  className="h-full rounded-full bg-yuzu"
                  initial={{ width: '18%' }}
                  whileInView={{ width: `${value}%` }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
              </div>
              <p className="mt-1 text-[10px] leading-snug text-silver/50">{desc}</p>
            </div>
            <span className="text-right font-serif text-lg italic text-silver/78">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VenueGuestContextVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <div className="mb-4 rounded-2xl border border-yuzu/20 bg-yuzu/[0.045] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-serif text-2xl italic leading-none text-white/92">Marta L.</p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-silver/44">returning guest - permission scoped</p>
          </div>
          <span className="font-serif text-3xl italic text-yuzu">94</span>
        </div>
      </div>
      <div className="grid gap-2">
        {[
          ['Seat', 'quiet booth, not center floor'],
          ['Offer', 'mineral white before menu'],
          ['Avoid', 'shellfish suggestions hidden'],
          ['Tone', 'low-touch, no birthday song'],
        ].map(([label, body]) => (
          <div key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-yuzu/72">{label}</span>
            <span className="max-w-[190px] text-right text-[11px] leading-snug text-silver/62">{body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemoryChapter({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <MobileSection
      index="03"
      label={isGuests ? 'Memory' : 'Retention'}
      title={isGuests ? "A visit doesn't end at payment." : 'Gratitude turns into return visits.'}
      copy={
        isGuests
          ? 'Each visit leaves a service memory you control. The next welcome starts warmer because the last night was understood.'
          : 'Tips, sentiment, dwell, and repeat behavior become an operating loop for loyalty, staff recognition, and revenue.'
      }
    >
      <div className="m-reveal m-art">
        {isGuests ? <GuestMemoryVisual /> : <VenueRetentionVisual />}
      </div>
    </MobileSection>
  );
}

function GuestMemoryVisual() {
  const visits = [
    ['First tap', 'quiet corner learned'],
    ['Second visit', 'wine pre-noted'],
    ['Tonight', 'welcome already shaped'],
  ];
  return (
    <div className="relative rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <div className="absolute left-[33px] top-10 h-[calc(100%-80px)] w-px bg-gradient-to-b from-yuzu/60 via-white/12 to-yuzu/30" />
      <div className="space-y-3">
        {visits.map(([title, body], i) => (
          <div key={title} className="relative grid grid-cols-[42px_1fr] gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
            <span className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-[#080808] font-serif text-lg italic ${
              i === visits.length - 1 ? 'border-yuzu/60 text-yuzu' : 'border-white/14 text-silver/60'
            }`}>
              {i + 1}
            </span>
            <div>
              <p className="font-sans text-[13px] font-semibold leading-snug text-white/88">{title}</p>
              <p className="mt-1 text-[11px] leading-snug text-silver/58">{body}</p>
              <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-yuzu/50">{i === visits.length - 1 ? 'anticipated' : 'remembered'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VenueRetentionVisual() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Metric number="22%" label="Tip signal" />
        <Metric number="+47%" label="Return" />
        <Metric number="3.8x" label="Staff cue" />
      </div>
      <div className="grid gap-2">
        {[
          ['Payment', 'guest closes without queue'],
          ['Signal', 'generosity and sentiment captured'],
          ['Action', 'next visit opens with context'],
        ].map(([label, body]) => (
          <div key={label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3">
            <span className="h-2 w-2 rounded-full bg-yuzu shadow-[0_0_10px_rgba(204,255,0,0.7)]" />
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-yuzu/70">{label}</p>
              <p className="mt-1 text-[11px] leading-snug text-silver/60">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VenueOSChapter({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <MobileSection
      index="04"
      label={isGuests ? 'Invisible OS' : 'Venue OS'}
      title={isGuests ? 'The room moves before you ask.' : 'The floor and back office share one brain.'}
      copy={
        isGuests
          ? 'You do not see the machinery. Host, server, table, payment, and taste cues coordinate around the welcome.'
          : 'TapIn is not just a pretty floor plan. It connects service, yield, suppliers, invoices, exceptions, and nightly decisions.'
      }
    >
      <div className="m-reveal m-art">
        {isGuests ? <GuestInvisibleOS /> : <VenueOpsConsole />}
      </div>
      <div className="m-reveal grid grid-cols-3 gap-2">
        <Metric number={isGuests ? '3' : '+23%'} label={isGuests ? 'Cues' : 'Revenue'} />
        <Metric number={isGuests ? '0' : '-4m'} label={isGuests ? 'Friction' : 'Door wait'} />
        <Metric number={isGuests ? '1' : '94%'} label={isGuests ? 'Welcome' : 'Matched'} />
      </div>
    </MobileSection>
  );
}

function GuestInvisibleOS() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <MiniFloorMap active="guest" />
      <div className="mt-4 grid gap-2">
        {[
          ['Host', 'Marta is recognized at the door.'],
          ['Server', 'Chablis and quiet pace passed quietly.'],
          ['Payment', 'Gratitude loop opens after service.'],
        ].map(([label, body]) => (
          <div key={label} className="grid grid-cols-[62px_1fr] rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-yuzu/70">{label}</span>
            <span className="text-[11px] leading-snug text-silver/62">{body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VenueOpsConsole() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <div className="grid grid-cols-[1fr_116px] gap-3">
        <MiniFloorMap active="venue" />
        <div className="grid gap-2">
          <Metric number="+18%" label="RevPASH" />
          <Metric number="7" label="Auto tasks" />
          <Metric number="1" label="Exception" />
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-yuzu/18 bg-yuzu/[0.035] p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-yuzu/76">Supplier automation</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/40">AP live</span>
        </div>
        {[
          ['La Finca Produce', 'invoice recognized - matched to PO'],
          ['Wine House', 'bottle variance checked - coded COGS'],
          ['Nordic Laundry', 'recurring bill approved automatically'],
        ].map(([name, body]) => (
          <div key={name} className="border-t border-white/8 py-2 first:border-t-0 first:pt-0 last:pb-0">
            <p className="font-sans text-[12px] font-semibold text-white/82">{name}</p>
            <p className="mt-1 text-[10px] leading-snug text-silver/54">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniFloorMap({ active }: { active: 'guest' | 'venue' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-silver/42">Osteria Lumina</span>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-yuzu/70">live</span>
      </div>
      <svg viewBox="0 0 210 152" className="h-[152px] w-full" aria-hidden="true">
        <rect x="10" y="10" width="190" height="120" rx="14" fill="none" stroke="rgba(255,255,255,0.15)" />
        <path d="M36 55H174M36 94H174M105 24V118" stroke="rgba(255,255,255,0.08)" />
        {[
          ['rect', 30, 28, 34, 28],
          ['circle', 148, 42, 24, 24],
          ['rect', 78, 30, 42, 28],
          ['rect', 46, 84, 42, 28],
          ['circle', 134, 96, 25, 25],
        ].map(([shape, x, y, w, h], i) => {
          const isActive = active === 'guest' ? i === 3 : i === 2 || i === 4;
          const common = {
            fill: isActive ? 'rgba(204,255,0,0.1)' : 'rgba(255,255,255,0.03)',
            stroke: isActive ? 'rgba(204,255,0,0.55)' : 'rgba(255,255,255,0.18)',
          };
          return shape === 'circle' ? (
            <circle key={i} cx={Number(x)} cy={Number(y)} r={Number(w) / 2} {...common} />
          ) : (
            <rect key={i} x={Number(x)} y={Number(y)} width={Number(w)} height={Number(h)} rx="7" {...common} />
          );
        })}
        <motion.circle
          cx={active === 'guest' ? 68 : 120}
          cy={active === 'guest' ? 98 : 44}
          r="5"
          fill="rgb(204,255,0)"
          animate={{ opacity: [0.42, 1, 0.42], r: [4, 8, 4] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <text x="105" y="145" textAnchor="middle" fontSize="7" letterSpacing="1.8" fill="rgba(204,255,0,0.58)">
          SENSE - DECIDE - ACT
        </text>
      </svg>
    </div>
  );
}

function CommandChapter({ activeView }: { activeView: ViewMode }) {
  const [idx, setIdx] = useState(0);
  const scenarios = COMMANDS[activeView];
  const scenario = scenarios[idx] ?? scenarios[0];
  return (
    <MobileSection
      index="05"
      label="Command"
      title={activeView === 'guests' ? 'Talk to your night.' : 'Talk to the whole operation.'}
      copy={
        activeView === 'guests'
          ? 'Plain language becomes a reservation, a memory, or a preference update.'
          : 'One command can move a guest, protect yield, or clear supplier admin without opening five tools.'
      }
    >
      <div className="m-reveal m-art">
        <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#080808]/95 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-silver/48">Sentient command</span>
            <div className="flex gap-1.5">
              {scenarios.map((item, i) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setIdx(i)}
                  className={`rounded-full px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] ${
                    i === idx ? 'bg-yuzu text-obsidian' : 'bg-white/8 text-silver/42'
                  }`}
                  aria-label={`Show ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeView}-${idx}`}
                initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                transition={{ duration: 0.28 }}
                className="space-y-4"
              >
                <div className="rounded-xl border border-yuzu/18 bg-yuzu/[0.035] p-3">
                  <span className="font-mono text-[10px] text-yuzu/85">&gt;</span>
                  <span className="ml-2 font-sans text-[13px] leading-snug text-white/92">{scenario.prompt}</span>
                </div>
                <CommandVisual visual={scenario.visual} />
                <div className="grid gap-2">
                  {scenario.result.map((line) => (
                    <div key={line} className="flex items-start gap-2 text-[12px] leading-snug text-silver/72">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yuzu" />
                      {line}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MobileSection>
  );
}

function CommandVisual({ visual }: { visual: 'book' | 'memory' | 'vip' | 'invoice' | 'revenue' }) {
  if (visual === 'invoice') {
    return (
      <div className="grid gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-3">
        {['OCR read', 'PO match', 'GL code', 'Exception'].map((step, i) => (
          <div key={step} className="grid grid-cols-[20px_1fr_auto] items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${i < 3 ? 'bg-yuzu' : 'bg-white/20'}`} />
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-silver/48">{step}</span>
            <span className="text-[10px] text-silver/62">{i < 3 ? 'done' : 'review'}</span>
          </div>
        ))}
      </div>
    );
  }

  if (visual === 'revenue') {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
        {[62, 78, 91].map((value, i) => (
          <div key={value} className="mb-2 last:mb-0">
            <div className="mb-1 flex justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-silver/42">
              <span>{['Current', 'Re-route', 'Optimized'][i]}</span>
              <span>{value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full bg-yuzu"
                initial={{ width: '16%' }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: EASE }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {[
        visual === 'vip' ? ['T09', 'quiet booth'] : ['94', 'match'],
        visual === 'memory' ? ['2021', 'wine'] : ['04', 'table'],
        visual === 'book' ? ['20:30', 'held'] : ['Sofia', 'owner'],
      ].map(([top, bottom]) => (
        <div key={`${top}-${bottom}`} className="rounded-xl border border-white/10 bg-white/[0.025] p-3 text-center">
          <p className="font-serif text-2xl italic leading-none text-yuzu">{top}</p>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/44">{bottom}</p>
        </div>
      ))}
    </div>
  );
}

function TrustChapter({ activeView, onSwitchView }: { activeView: ViewMode; onSwitchView: () => void }) {
  const isGuests = activeView === 'guests';
  const controls = isGuests
    ? ['Inspect Genome', 'Export memory', 'Pause recognition']
    : ['Role permissions', 'Audit actions', 'Supplier exception log'];

  return (
    <MobileSection
      index="06"
      label="Trust"
      title={isGuests ? 'Anticipation requires control.' : 'Automation needs a paper trail.'}
      copy={
        isGuests
          ? 'Your Taste Genome is yours. TapIn does not sell it, advertise against it, or expose more than hospitality needs.'
          : 'Every guest cue, staff action, supplier invoice, and automated approval stays permissioned, inspectable, and reversible.'
      }
    >
      <div className="m-reveal grid gap-3">
        {controls.map((item) => (
          <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
            <span className="font-sans text-[13px] text-white/82">{item}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-yuzu/68">{isGuests ? 'Yours' : 'Logged'}</span>
          </div>
        ))}
      </div>
      <div className="m-reveal mt-10 text-center">
        <p className="font-serif text-[3.25rem] italic leading-[0.9] tracking-tight text-silver">
          Don't call.
          <span className="block text-yuzu">Just TapIn.</span>
        </p>
        <button
          type="button"
          onClick={onSwitchView}
          className="mt-8 font-mono text-[10px] uppercase tracking-[0.28em] text-silver/48"
        >
          {VIEW_LABELS[activeView].alternate}
        </button>
        <p className="mt-8 pb-3 font-mono text-[9px] uppercase tracking-[0.2em] text-silver/28">
          {isGuests ? 'Guest protocol' : 'Venue protocol'} - TapIn OS
        </p>
      </div>
    </MobileSection>
  );
}

function MobileSection({
  index,
  label,
  title,
  copy,
  children,
}: {
  index: string;
  label: string;
  title: string;
  copy: string;
  children: ReactNode;
}) {
  return (
    <section className="mobile-chapter relative px-5 py-14">
      <div className="pointer-events-none absolute bottom-8 left-5 top-16 w-px bg-white/8">
        <span className="m-progress absolute left-0 top-0 block h-full w-px origin-top bg-yuzu shadow-[0_0_12px_rgba(204,255,0,0.55)]" />
      </div>
      <div className="relative mx-auto flex w-full max-w-[430px] flex-col gap-6 pl-5">
        <div className="m-reveal flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-yuzu/74">
            <span className="h-px w-8 bg-yuzu/42" />
            {label}
          </div>
          <span className="font-serif text-4xl italic leading-none text-white/[0.07]">{index}</span>
        </div>
        <h2 className="m-reveal max-w-[21rem] text-[clamp(2.35rem,11vw,4.3rem)] font-black leading-[0.9] tracking-tighter text-silver">
          {title}
        </h2>
        <p className="m-reveal mobile-body max-w-[21rem]">{copy}</p>
        {children}
      </div>
    </section>
  );
}

function SignalRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.7)]" />
      <span className="text-[11px] leading-snug text-silver/62">{label}</span>
    </div>
  );
}

function Metric({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3">
      <div className="font-serif text-[24px] italic leading-none text-yuzu">{number}</div>
      <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-silver/45">{label}</div>
    </div>
  );
}
