import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { MobileRouteHeader } from '../layout/MobileRouteHeader';
import type { ShowroomProps, ViewMode } from '../../types/showroom';

gsap.registerPlugin(ScrollTrigger);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* ─── LABELS · CONTENT ─────────────────────────────────────────────────── */

const VIEW_LABELS: Record<ViewMode, {
  primaryCta: string;
  primarySubtitle: string;
  alternate: string;
  heroMode: string;
}> = {
  guests: {
    primaryCta: 'Join Waitlist',
    primarySubtitle: '30 seconds · no commitment',
    alternate: 'Switch to venues',
    heroMode: 'Guest intelligence',
  },
  venues: {
    primaryCta: 'Request Demo',
    primarySubtitle: '15 minutes · no obligation',
    alternate: 'Switch to guests',
    heroMode: 'Venue operating system',
  },
};

const HERO_PIPELINE: Record<ViewMode, Array<{ label: string; value: string }>> = {
  guests: [
    { label: 'Identity', value: 'phone verified' },
    { label: 'Taste', value: 'Chablis · corner · late' },
    { label: 'Action', value: 'table 04 staged' },
  ],
  venues: [
    { label: 'Front room', value: 'VIP routed' },
    { label: 'Revenue', value: 'turns protected' },
    { label: 'Back office', value: 'invoice matched' },
  ],
};

/* Memory chapter — rich learned items per visit (now mirrors desktop GratitudeLoop) */
interface MemoryVisit {
  n: number;
  when: string;
  headline: string;
  state: 'first' | 'recognised' | 'anticipated';
  arrived: string;
  learned: string[];
}

const MEMORY_VISITS_GUESTS: MemoryVisit[] = [
  {
    n: 1,
    when: '12w ago',
    headline: 'First tap',
    state: 'first',
    arrived: 'Phone tap at the door · no profile, no app',
    learned: ['Wine · Chablis (2 glasses)', 'Table · quiet corner', 'Pace · 2h 14m slow'],
  },
  {
    n: 2,
    when: '4w ago',
    headline: 'Recognised',
    state: 'recognised',
    arrived: 'Sofía welcomed by name · table pre-staged',
    learned: ['Always Tuesdays · early', 'Same wine, never list-shopper', 'Anniversary on the way'],
  },
  {
    n: 3,
    when: 'Tonight',
    headline: 'Anticipated',
    state: 'anticipated',
    arrived: 'Booking made itself · 19:30 · Sofía briefed',
    learned: ['Bottle waiting at the table', 'Light dimmed by 1 stop', '"Welcome back, Marisol"'],
  },
];

const MEMORY_VISITS_VENUES: MemoryVisit[] = [
  {
    n: 1,
    when: 'After payment',
    headline: 'Gratitude captured',
    state: 'first',
    arrived: 'Guest closes without queue · zero friction',
    learned: ['+22% tip vs base', 'Sentiment +0.42', 'Dwell 96 min (above target)'],
  },
  {
    n: 2,
    when: 'Loop processed',
    headline: 'Signal becomes action',
    state: 'recognised',
    arrived: 'Staff cue raised · supplier order auto-triggered',
    learned: ['Server Sofía flagged as preferred', 'Bottle reorder scheduled', 'Repeat slot proposed Sat 20:00'],
  },
  {
    n: 3,
    when: 'Next visit',
    headline: 'Return without effort',
    state: 'anticipated',
    arrived: 'Marta books · TapIn matches preferences automatically',
    learned: ['Same booth held', 'Sofía rostered', '+47% return rate across cohort'],
  },
];

/* Command terminal scenarios — full data for typewriter playback */
type LineType = 'header' | 'detail' | 'check' | 'meta';
interface ResponseLine { text: string; type: LineType; }
interface CommandScenario {
  id: string;
  label: string;
  command: string;
  thinkingMs: number;
  response: ResponseLine[];
}

const COMMAND_SCENARIOS: Record<ViewMode, CommandScenario[]> = {
  guests: [
    {
      id: 'discover',
      label: 'Discover',
      command: 'Italian, intimate, tonight at 20:30',
      thinkingMs: 720,
      response: [
        { type: 'header', text: '3 matches · all available' },
        { type: 'detail', text: 'Osteria Lumina · 94% match · 0.4 km' },
        { type: 'detail', text: 'Da Salvatore · 87% · 0.9 km' },
        { type: 'meta',   text: 'Sorted by taste fit' },
      ],
    },
    {
      id: 'book',
      label: 'Book',
      command: 'Book Osteria Lumina, 2 people, 20:30',
      thinkingMs: 600,
      response: [
        { type: 'header', text: 'Confirmed · 20:30' },
        { type: 'detail', text: 'Table 04 held · party of 2' },
        { type: 'check',  text: 'Chablis pre-noted to server' },
        { type: 'check',  text: 'Calendar updated' },
      ],
    },
    {
      id: 'memory',
      label: 'Memory',
      command: 'What did I have last time at Casa Marisol?',
      thinkingMs: 540,
      response: [
        { type: 'header', text: 'Last visit · 3 weeks ago' },
        { type: 'detail', text: 'Mussels · Côtes du Rhône 2019' },
        { type: 'detail', text: 'Server Diego · window table' },
        { type: 'meta',   text: 'Recreate the visit?' },
      ],
    },
  ],
  venues: [
    {
      id: 'vip',
      label: 'VIP',
      command: 'VIP just arrived. Where do I seat them?',
      thinkingMs: 850,
      response: [
        { type: 'header', text: 'Suggested · Table 09' },
        { type: 'check',  text: 'Booth · quiet corner · their preference' },
        { type: 'check',  text: 'Server Sofía · their usual' },
        { type: 'check',  text: '2018 Barolo pre-staged' },
      ],
    },
    {
      id: 'invoice',
      label: 'Invoices',
      command: 'Process today\'s supplier invoices',
      thinkingMs: 720,
      response: [
        { type: 'header', text: '3 processed · 1 flagged' },
        { type: 'detail', text: 'La Finca · matched to PO' },
        { type: 'detail', text: 'Wine House · coded COGS' },
        { type: 'meta',   text: 'VAT mismatch needs review' },
      ],
    },
    {
      id: 'yield',
      label: 'Yield',
      command: 'Four walk-ins waiting. Protect revenue.',
      thinkingMs: 680,
      response: [
        { type: 'header', text: 'T11 clears in 4 min' },
        { type: 'detail', text: 'Bar alternative ready now' },
        { type: 'check',  text: 'No party gets rushed' },
        { type: 'meta',   text: 'RevPASH impact · +18%' },
      ],
    },
  ],
};

const PRIVACY_COMMITMENTS = [
  { keyword: 'Yours',   body: 'Your Genome belongs to you. Export, delete, take it anywhere.' },
  { keyword: 'Sealed',  body: 'Never sold. Never used to target ads.' },
  { keyword: 'Minimal', body: 'Only the signals hospitality needs. Nothing more.' },
];

/* ─── ROOT ─────────────────────────────────────────────────────────────── */

export default function MobileShowroom({ activeView, setActiveView, onNavigateShowroom }: ShowroomProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

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
      <MobileRouteHeader
        activeView={activeView}
        setActiveView={setActiveView}
        onNavigateShowroom={onNavigateShowroom}
      />
      <main className="relative pb-48">
        <MobileHero activeView={activeView} />
        <ArrivalChapter activeView={activeView} />
        <TasteChapter activeView={activeView} />
        <MemoryChapter activeView={activeView} />
        <VenueOSChapter activeView={activeView} />
        <CommandChapter key={`command-${activeView}`} activeView={activeView} />
        <TrustChapter
          activeView={activeView}
          onSwitchView={() => setActiveView(activeView === 'guests' ? 'venues' : 'guests')}
        />
      </main>
      <StickyCTA activeView={activeView} />
    </motion.div>
  );
}

/* ─── HOOKS ────────────────────────────────────────────────────────────── */

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

/* ─── STICKY CTA ───────────────────────────────────────────────────────── */

function StickyCTA({ activeView }: { activeView: ViewMode }) {
  const { primaryCta, primarySubtitle } = VIEW_LABELS[activeView];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent px-4 pb-[max(10px,env(safe-area-inset-bottom))] pt-4">
      <div className="mx-auto flex w-full max-w-[430px] flex-col items-center gap-1.5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.button
            key={`cta-${activeView}`}
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex min-h-11 w-full items-center justify-center rounded-full bg-yuzu px-6 py-2.5 text-center font-sans text-[10px] font-extrabold uppercase tracking-[0.24em] text-obsidian shadow-[0_0_30px_rgba(204,255,0,0.26)] active:scale-[0.99]"
          >
            {primaryCta}
          </motion.button>
        </AnimatePresence>
        <div className="flex w-full items-center justify-center text-center font-mono text-[8px] uppercase tracking-[0.18em] text-silver/40">
          <span className="whitespace-nowrap">{primarySubtitle}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────── */

function MobileHero({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <section className="mobile-hero relative overflow-hidden px-5 pb-0 pt-24">
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

        <div className="pb-0">
          <div className="hero-choreo">
            <HeroSignalCard activeView={activeView} />
          </div>
          <HeroHandoffTrail activeView={activeView} />
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
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={i === 1 ? 6 : 4}
                  fill="rgba(204,255,0,0.94)"
                  filter={`url(#mobile-glow-${activeView})`}
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
            <Metric number="1" label="Exception" tone="warn" />
          </div>
        </div>
      )}
    </div>
  );
}

function HeroHandoffTrail({ activeView }: { activeView: ViewMode }) {
  const steps =
    activeView === 'guests'
      ? ['Phone verified', 'Taste matched', 'Table staged']
      : ['Door detected', 'Floor routed', 'Invoice ready'];

  return (
    <div className="hero-choreo mx-auto mt-5 mb-6 w-full max-w-[300px]">
      <div className="relative flex items-start justify-between">
        <span className="absolute left-5 right-5 top-[7px] h-px bg-gradient-to-r from-yuzu/0 via-yuzu/35 to-yuzu/0" />
        {steps.map((step, index) => (
          <div key={step} className="relative flex w-[30%] flex-col items-center gap-2 text-center">
            <span
              className={`relative z-10 h-3.5 w-3.5 rounded-full border ${
                index === 1
                  ? 'border-yuzu bg-yuzu shadow-[0_0_18px_rgba(204,255,0,0.72)]'
                  : 'border-yuzu/35 bg-[#050505] shadow-[0_0_12px_rgba(204,255,0,0.22)]'
              }`}
            />
            <span className="font-mono text-[8px] uppercase leading-snug tracking-[0.16em] text-silver/42">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SignalPipeline({ activeView }: { activeView: ViewMode }) {
  return (
    <div className="hero-choreo grid grid-cols-3 gap-2 max-[375px]:grid-cols-2">
      {HERO_PIPELINE[activeView].map((item, i) => (
        <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3 max-[375px]:last:col-span-2">
          <div className="mb-2 font-serif text-lg italic leading-none text-yuzu">0{i + 1}</div>
          <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/40">{item.label}</div>
          <div className="mt-1 text-[10px] leading-snug text-silver/66">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── ARRIVAL CHAPTER ──────────────────────────────────────────────────── */

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
    ['VIP', 'Marta L.', 'T09 · Sofía'],
    ['Walk-in', '4 guests', 'bar hold'],
    ['Regular', 'Diego party', 'T04 ready'],
    ['Late', '20:30', '15m buffer'],
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-silver/42">Arrival router</span>
        <span className="flex items-center gap-1.5 rounded-full border border-yuzu/30 bg-yuzu/[0.06] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-yuzu">
          <span className="relative flex h-1 w-1">
            <span className="absolute inset-0 animate-ping rounded-full bg-yuzu opacity-70" />
            <span className="relative h-1 w-1 rounded-full bg-yuzu" />
          </span>
          live
        </span>
      </div>
      <div className="grid gap-2">
        {arrivals.map(([type, guest, action], i) => (
          <motion.div
            key={`${type}-${guest}`}
            className="grid grid-cols-[58px_1fr_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-3"
            animate={i === 0 ? { opacity: [0.88, 1, 0.88] } : undefined}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
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

/* ─── TASTE CHAPTER ────────────────────────────────────────────────────── */

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

/* Fixed-orbital: pill labels placed using angular math so they NEVER overlap
   the centre or escape the container regardless of viewport. */
function GuestTasteVisual() {
  const signals = [
    ['Wine', 'Chablis, mineral whites', 92],
    ['Room', 'quiet corner, low light', 84],
    ['Pace', 'slow dinner, no rush', 78],
    ['Avoid', 'shellfish, loud bar', 100],
  ] as const;

  /* Orbital labels — angular distribution around the centre, math-based so it
     scales correctly on any screen. */
  const orbitalSize = 156;
  const cx = orbitalSize / 2;
  const cy = orbitalSize / 2;
  const labelRadius = 78;
  const orbitalLabels = ['Chablis', 'Corner', 'Late', 'No shellfish'];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[#080808] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.52)]">
      <div className="absolute left-1/2 top-7 h-36 w-36 -translate-x-1/2 rounded-full border border-yuzu/16 bg-yuzu/[0.018]" />

      {/* Orbital diagram */}
      <div className="relative mx-auto mb-5" style={{ width: orbitalSize, height: orbitalSize + 36 }}>
        <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ width: orbitalSize, height: orbitalSize }}>
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
          <div className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-yuzu/35 bg-yuzu/[0.06] text-center">
            <span className="font-serif text-2xl italic text-yuzu">You</span>
            <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-silver/50">Genome</span>
          </div>
          {orbitalLabels.map((label, i) => {
            const angle = (Math.PI * 2 * i) / orbitalLabels.length - Math.PI / 2;
            const x = cx + labelRadius * Math.cos(angle);
            const y = cy + labelRadius * Math.sin(angle);
            return (
              <span
                key={label}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-white/10 bg-black/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-silver/65"
                style={{ left: x, top: y }}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Signal bars below */}
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
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-silver/44">returning guest · permission scoped</p>
          </div>
          <span className="font-serif text-3xl italic text-yuzu">94</span>
        </div>
      </div>
      <div className="grid gap-2">
        {[
          ['Seat', 'quiet booth, not centre floor'],
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

/* ─── MEMORY CHAPTER ───────────────────────────────────────────────────── */

function MemoryChapter({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  const visits = isGuests ? MEMORY_VISITS_GUESTS : MEMORY_VISITS_VENUES;

  return (
    <MobileSection
      index="03"
      label={isGuests ? 'Memory · Gratitude Loop' : 'Retention · Gratitude Loop'}
      title={isGuests ? "A visit doesn't end at payment." : 'Gratitude turns into return visits.'}
      copy={
        isGuests
          ? 'Three visits to the same venue. Each one richer than the last — not because you did more, but because TapIn remembered.'
          : 'Tips, sentiment, dwell, and repeat behaviour become an operating loop for loyalty, staff recognition, and revenue.'
      }
    >
      <div className="m-reveal m-art space-y-3">
        {visits.map((v, i) => (
          <MemoryVisitCard key={v.n} visit={v} isLast={i === visits.length - 1} />
        ))}
      </div>
    </MobileSection>
  );
}

function MemoryVisitCard({ visit, isLast }: { visit: MemoryVisit; isLast: boolean }) {
  const isAnticipated = visit.state === 'anticipated';
  const borderClass =
    visit.state === 'first'
      ? 'border-white/12'
      : visit.state === 'recognised'
        ? 'border-yuzu/30'
        : 'border-yuzu/60 shadow-[0_0_24px_rgba(204,255,0,0.10)]';

  return (
    <div className={`relative rounded-2xl border ${borderClass} bg-[#080808]/85 p-4`}>
      {!isLast && (
        <div className="absolute -bottom-3 left-7 z-10 flex h-3 w-px items-center justify-center bg-gradient-to-b from-yuzu/55 to-yuzu/15" />
      )}
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-silver/45">
          Visit · 0{visit.n}
        </span>
        <span className={`font-mono text-[9px] uppercase tracking-[0.22em] ${
          visit.state === 'first' ? 'text-silver/55'
            : visit.state === 'recognised' ? 'text-yuzu/80'
              : 'text-yuzu'
        }`}>
          {visit.when}
        </span>
      </div>
      <div className="mt-2.5 flex items-baseline gap-2">
        <h4 className={`font-serif text-[1.7rem] italic leading-none tracking-tight ${
          visit.state === 'first' ? 'text-silver/85'
            : visit.state === 'recognised' ? 'text-white/95'
              : 'text-yuzu'
        }`}>
          {visit.headline}
        </h4>
        {isAnticipated && (
          <motion.span
            animate={{ opacity: [0.55, 1, 0.55] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_6px_rgba(204,255,0,0.7)]"
          />
        )}
      </div>
      <p className="mt-2 text-[11px] leading-snug text-silver/60">{visit.arrived}</p>
      <div className="mt-3 border-t border-white/8 pt-3">
        <span className="font-mono text-[8px] uppercase tracking-[0.26em] text-silver/40">
          {isAnticipated ? 'TapIn delivered' : 'TapIn learned'}
        </span>
        <ul className="mt-2 grid gap-1.5">
          {visit.learned.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className={`mt-1.5 block h-1 w-1 shrink-0 rounded-full ${
                isAnticipated ? 'bg-yuzu shadow-[0_0_3px_rgba(204,255,0,0.6)]' : 'bg-silver/45'
              }`} />
              <span className={`text-[11.5px] leading-snug tracking-tight ${
                isAnticipated ? 'text-yuzu/90' : 'text-white/78'
              }`}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── VENUE OS CHAPTER ─────────────────────────────────────────────────── */

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
        <Metric number={isGuests ? '0' : '-4m'} label={isGuests ? 'Friction' : 'Door wait'} tone={isGuests ? 'positive' : 'neutral'} />
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
          ['Host', 'Marta is recognised at the door.'],
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
          <Metric number="1" label="Exception" tone="warn" />
        </div>
      </div>
      <div className="mt-4 rounded-2xl border border-yuzu/18 bg-yuzu/[0.035] p-3">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-yuzu/76">Supplier automation</span>
          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/40">AP live</span>
        </div>
        {[
          ['La Finca Produce', 'invoice recognised · matched to PO'],
          ['Wine House', 'bottle variance checked · coded COGS'],
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

/* Cleanly typed floor map (was: heterogeneous arrays with Number() casts) */
interface FloorShape {
  shape: 'rect' | 'circle';
  x: number;
  y: number;
  w: number;
  h?: number;
}
const FLOOR_SHAPES: FloorShape[] = [
  { shape: 'rect',   x: 30,  y: 28, w: 34, h: 28 },
  { shape: 'circle', x: 148, y: 42, w: 24 },
  { shape: 'rect',   x: 78,  y: 30, w: 42, h: 28 },
  { shape: 'rect',   x: 46,  y: 84, w: 42, h: 28 },
  { shape: 'circle', x: 134, y: 96, w: 25 },
];

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
        {FLOOR_SHAPES.map((s, i) => {
          const isActive = active === 'guest' ? i === 3 : i === 2 || i === 4;
          const fill = isActive ? 'rgba(204,255,0,0.1)' : 'rgba(255,255,255,0.03)';
          const stroke = isActive ? 'rgba(204,255,0,0.55)' : 'rgba(255,255,255,0.18)';
          return s.shape === 'circle' ? (
            <circle key={i} cx={s.x} cy={s.y} r={s.w / 2} fill={fill} stroke={stroke} />
          ) : (
            <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h ?? s.w} rx="7" fill={fill} stroke={stroke} />
          );
        })}
        <circle
          cx={active === 'guest' ? 68 : 120}
          cy={active === 'guest' ? 98 : 44}
          r={5}
          fill="rgb(204,255,0)"
          className="animate-pulse"
        />
        <text x="105" y="145" textAnchor="middle" fontSize="7" letterSpacing="1.8" fill="rgba(204,255,0,0.58)">
          SENSE · DECIDE · ACT
        </text>
      </svg>
    </div>
  );
}

/* ─── COMMAND CHAPTER — terminal-style typewriter demo (rebuilt) ───────── */

type CommandPhase = 'typing' | 'thinking' | 'responding' | 'hold' | 'exit';

function CommandChapter({ activeView }: { activeView: ViewMode }) {
  const scenarios = COMMAND_SCENARIOS[activeView];
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<CommandPhase>('typing');
  const [typedChars, setTypedChars] = useState(0);
  const [revealedLines, setRevealedLines] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  /* Playback loop: typing → thinking → responding → hold → exit → next */
  useEffect(() => {
    if (shouldReduceMotion) return;
    const scenario = scenarios[idx];
    if (!scenario) return;

    let cancelled = false;
    async function play() {
      setPhase('typing');
      setTypedChars(0);
      setRevealedLines(0);

      for (let i = 1; i <= scenario.command.length; i++) {
        const c = scenario.command[i - 1];
        const ms = c === ',' || c === '.' ? 110 : c === ' ' ? 45 : 28 + Math.random() * 22;
        await waitMs(ms);
        if (cancelled) return;
        setTypedChars(i);
      }
      await waitMs(320);
      if (cancelled) return;

      setPhase('thinking');
      await waitMs(scenario.thinkingMs);
      if (cancelled) return;

      setPhase('responding');
      for (let i = 1; i <= scenario.response.length; i++) {
        await waitMs(230);
        if (cancelled) return;
        setRevealedLines(i);
      }
      await waitMs(260);
      if (cancelled) return;

      setPhase('hold');
      await waitMs(3200);
      if (cancelled) return;

      setPhase('exit');
      await waitMs(520);
      if (cancelled) return;
      setIdx((i) => (i + 1) % scenarios.length);
    }
    play();
    return () => { cancelled = true; };
  }, [idx, scenarios, shouldReduceMotion]);

  const scenario = scenarios[idx] ?? scenarios[0];
  const effectivePhase = shouldReduceMotion ? 'hold' : phase;
  const effectiveTypedChars = shouldReduceMotion ? scenario.command.length : typedChars;
  const effectiveRevealedLines = shouldReduceMotion ? scenario.response.length : revealedLines;
  const visibleCommand = scenario.command.slice(0, effectiveTypedChars);
  const showCursor = effectivePhase === 'typing' || effectivePhase === 'thinking';
  const fadingOut = effectivePhase === 'exit';

  return (
    <MobileSection
      index="05"
      label="Sentient Command"
      title={activeView === 'guests' ? 'Talk to your night.' : 'Talk to the whole operation.'}
      copy={
        activeView === 'guests'
          ? 'Plain language becomes a reservation, a memory, or a preference update.'
          : 'One command can move a guest, protect yield, or clear supplier admin without opening five tools.'
      }
    >
      <div className="m-reveal m-art">
        <motion.div
          animate={{ opacity: fadingOut ? 0.25 : 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="overflow-hidden rounded-2xl border border-white/12 bg-[#080808]/95 shadow-[0_22px_55px_rgba(0,0,0,0.52)]"
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between border-b border-white/8 bg-white/[0.02] px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="block h-2 w-2 rounded-full bg-white/20" />
              <span className="block h-2 w-2 rounded-full bg-white/15" />
              <span className="block h-2 w-2 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.28em] text-silver/55">
              TapIn OS · Sentient
            </span>
            <span className="flex items-center gap-1">
              <span className="relative flex h-1 w-1">
                <span className="absolute inset-0 animate-ping rounded-full bg-yuzu opacity-75" />
                <span className="relative h-1 w-1 rounded-full bg-yuzu" />
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-yuzu/75">Live</span>
            </span>
          </div>

          {/* Body */}
          <div className="px-4 py-5 min-h-[210px]">
            {/* Prompt with typewriter */}
            <div className="flex items-baseline gap-2.5">
              <span className="select-none font-mono text-[14px] leading-none text-yuzu/85">›</span>
              <span className="font-mono text-[13px] leading-snug text-white/95">
                {visibleCommand}
                {showCursor && (
                  <motion.span
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.85, repeat: Infinity, ease: 'easeInOut' }}
                    className="-mb-[1px] ml-[1px] inline-block h-3.5 w-[7px] align-middle bg-yuzu/85"
                  />
                )}
              </span>
            </div>

            {/* Thinking */}
            <AnimatePresence>
              {effectivePhase === 'thinking' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="mt-4 flex items-center gap-2 pl-6"
                >
                  <ThinkingDots />
                  <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-silver/45">
                    parsing intent
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Response */}
            <AnimatePresence>
              {(effectivePhase === 'responding' || effectivePhase === 'hold') && (
                <motion.div
                  key={`response-${scenario.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="mt-4 grid gap-1.5 pl-6"
                >
                  {scenario.response.slice(0, effectiveRevealedLines).map((line, lineIdx) => (
                    <motion.div
                      key={`${scenario.id}-${lineIdx}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="flex items-start gap-2"
                    >
                      <LineMarker type={line.type} />
                      <span className={lineClass(line.type)}>{line.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scenario tabs — larger tap targets, clearer affordance */}
          <div className="flex border-t border-white/8 bg-white/[0.02]">
            {scenarios.map((s, i) => {
              const active = i === idx;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Play scenario: ${s.label}`}
                  className={`relative flex-1 min-h-[44px] py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    active ? 'text-yuzu' : 'text-silver/45 active:text-silver/80'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-command-active"
                      className="absolute inset-x-2 bottom-0 h-px bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.5)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  {s.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Affordance microcopy below */}
      <p className="m-reveal pl-5 font-mono text-[9px] uppercase tracking-[0.22em] text-silver/40">
        Tap a label to try another command
      </p>
    </MobileSection>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-yuzu"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}

function LineMarker({ type }: { type: LineType }) {
  if (type === 'header') {
    return <span className="mt-[1px] select-none font-mono text-[12px] leading-snug text-yuzu/95">✓</span>;
  }
  if (type === 'check') {
    return <span className="mt-[2px] select-none font-mono text-[12px] leading-snug text-yuzu/85">·</span>;
  }
  if (type === 'meta') {
    return <span className="mt-[2px] select-none font-mono text-[11px] leading-snug text-silver/40">›</span>;
  }
  return <span className="mt-[8px] block h-1 w-1 rounded-full bg-white/30" />;
}

function lineClass(type: LineType): string {
  switch (type) {
    case 'header': return 'font-sans text-[12.5px] font-medium leading-snug tracking-tight text-yuzu/95';
    case 'check':  return 'font-sans text-[11.5px] leading-snug text-silver/85';
    case 'meta':   return 'font-mono text-[10.5px] italic leading-snug text-silver/50';
    case 'detail':
    default:       return 'font-sans text-[12px] leading-snug tracking-tight text-white/85';
  }
}

function waitMs(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/* ─── TRUST CHAPTER — privacy commitments + monumental brand close ─────── */

function TrustChapter({ activeView, onSwitchView }: { activeView: ViewMode; onSwitchView: () => void }) {
  const isGuests = activeView === 'guests';
  const controls = isGuests
    ? ['Inspect Genome', 'Export memory', 'Pause recognition']
    : ['Role permissions', 'Audit actions', 'Supplier exception log'];

  return (
    <MobileSection
      index="06"
      label="Trust · Brand"
      title={isGuests ? 'Anticipation requires control.' : 'Automation needs a paper trail.'}
      copy={
        isGuests
          ? 'Your Taste Genome is yours. TapIn does not sell it, advertise against it, or expose more than hospitality needs.'
          : 'Every guest cue, staff action, supplier invoice, and automated approval stays permissioned, inspectable, and reversible.'
      }
    >
      {/* Privacy commitments — 3 cards (mirroring desktop PrivacyTrust) */}
      <div className="m-reveal grid gap-2.5">
        {PRIVACY_COMMITMENTS.map((c) => (
          <div
            key={c.keyword}
            className="relative rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3.5"
          >
            <span className="absolute inset-y-3 left-0 w-px bg-yuzu/45" />
            <div className="font-mono text-[9px] uppercase tracking-[0.26em] text-yuzu/75">
              {c.keyword}
            </div>
            <p className="mt-1.5 font-sans text-[12px] leading-snug text-silver/68">{c.body}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="m-reveal grid gap-2">
        {controls.map((item) => (
          <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
            <span className="font-sans text-[12.5px] text-white/82">{item}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-yuzu/68">{isGuests ? 'Yours' : 'Logged'}</span>
          </div>
        ))}
      </div>

      {/* Monumental brand close */}
      <div className="m-reveal mt-12 flex flex-col items-center text-center">
        <span className="mb-5 block h-px w-16 bg-gradient-to-r from-transparent via-yuzu/65 to-transparent" />
        <p className="font-serif text-[clamp(3.5rem,18vw,5.5rem)] italic leading-[0.92] tracking-tight text-silver/90">
          Don't call.
          <span className="block text-yuzu drop-shadow-[0_0_28px_rgba(204,255,0,0.28)]">
            Just TapIn.
          </span>
        </p>
        <p className="mt-5 max-w-[20rem] font-sans text-[12px] leading-relaxed text-silver/55">
          {isGuests
            ? 'Every restaurant. One protocol. From the first tap to the last memory.'
            : 'Every guest recognised. Every table optimised. The OS that runs the room with you.'}
        </p>
        <button
          type="button"
          onClick={onSwitchView}
          className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-silver/45 active:text-yuzu"
        >
          {VIEW_LABELS[activeView].alternate}
          <span>→</span>
        </button>
        <p className="mt-10 pb-4 font-mono text-[9px] uppercase tracking-[0.2em] text-silver/26">
          {isGuests ? 'Guest protocol' : 'Venue protocol'} · TapIn OS
        </p>
      </div>
    </MobileSection>
  );
}

/* ─── MOBILE SECTION WRAPPER ───────────────────────────────────────────── */

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
    <section className="mobile-chapter relative px-5 py-10">
      <div className="pointer-events-none absolute bottom-8 left-5 top-16 w-px bg-white/8">
        <span className="m-progress absolute left-0 top-0 block h-full w-px origin-top bg-yuzu shadow-[0_0_12px_rgba(204,255,0,0.55)]" />
      </div>
      <div className="relative mx-auto flex w-full max-w-[430px] flex-col gap-6 pl-5">
        <div className="m-reveal flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-yuzu/74">
            <span className="h-px w-8 bg-yuzu/42" />
            {label}
          </div>
          {/* Section index — bolder, with yuzu accent line, easier to wayfind */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-silver/35">Chapter {index}/06</span>
            <span className="h-px w-3 bg-yuzu/40" />
            <span className="font-serif text-4xl italic leading-none text-white/22">{index}</span>
          </div>
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

/* ─── SHARED HELPERS ───────────────────────────────────────────────────── */

function SignalRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.025] px-3 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.7)]" />
      <span className="text-[11px] leading-snug text-silver/62">{label}</span>
    </div>
  );
}

function Metric({ number, label, tone = 'positive' }: { number: string; label: string; tone?: 'positive' | 'neutral' | 'warn' }) {
  const toneClass =
    tone === 'warn'
      ? 'text-[#ffdf8a]'
      : tone === 'neutral'
        ? 'text-silver/78'
        : 'text-yuzu';
  const borderClass =
    tone === 'warn'
      ? 'border-[#ffdf8a]/20 bg-[#ffdf8a]/[0.035]'
      : 'border-white/10 bg-white/[0.025]';
  return (
    <div className={`rounded-xl border px-3 py-3 ${borderClass}`}>
      <div className={`font-serif text-[24px] italic leading-none ${toneClass}`}>{number}</div>
      <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em] text-silver/45">{label}</div>
    </div>
  );
}
