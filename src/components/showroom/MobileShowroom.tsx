import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import type { ShowroomProps, ViewMode } from '../../types/showroom';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0 },
};

const VIEW_LABELS: Record<ViewMode, { primaryCta: string; alternate: string }> = {
  guests: { primaryCta: 'Join Waitlist', alternate: 'For venues' },
  venues: { primaryCta: 'Request Demo', alternate: 'For guests' },
};

const COMMANDS: Record<ViewMode, Array<{ label: string; prompt: string; result: string[] }>> = {
  guests: [
    {
      label: 'Book',
      prompt: 'Italian, intimate, tonight at 20:30',
      result: ['Osteria Lumina - 94% match', 'Table 04 held for 2', 'Your Chablis preference noted'],
    },
    {
      label: 'Remember',
      prompt: 'What did I have last time?',
      result: ['Casa Marisol - 3 weeks ago', 'Mussels and Cotes du Rhone', 'Window table with Diego'],
    },
  ],
  venues: [
    {
      label: 'Route',
      prompt: 'VIP just arrived. Where do they go?',
      result: ['Seat T09 - quiet booth', 'Server Sofia assigned', '2018 Barolo pre-staged'],
    },
    {
      label: 'Optimize',
      prompt: 'Four walk-ins waiting. Any table soon?',
      result: ['T11 frees in 4 min', 'Bar alternative ready now', 'RevPASH impact +18%'],
    },
  ],
};

export default function MobileShowroom({ activeView, setActiveView }: ShowroomProps) {
  return (
    <motion.div
      key="mobile-showroom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
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
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-5 bg-gradient-to-t from-[#050505] via-[#050505]/92 to-transparent">
      <button
        type="button"
        className="mx-auto flex min-h-14 w-full max-w-[430px] items-center justify-center rounded-full bg-yuzu px-6 py-4 text-center font-sans text-[12px] font-extrabold uppercase tracking-[0.24em] text-obsidian shadow-[0_0_34px_rgba(204,255,0,0.28)] active:scale-[0.99]"
      >
        {label}
      </button>
    </div>
  );
}

function MobileHero({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <section className="relative flex min-h-[100svh] items-start overflow-hidden px-5 pb-28 pt-24">
      <MobileAtmosphere activeView={activeView} />
      <div className="relative z-10 mx-auto flex w-full max-w-[430px] flex-col gap-6">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-5"
        >
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.34em] text-yuzu/75">
            <span className="h-px w-9 bg-yuzu/45" />
            {isGuests ? 'Guest protocol' : 'Venue protocol'}
          </div>
          <h1 className="text-[clamp(3rem,16vw,5.6rem)] font-black leading-[0.86] tracking-tighter text-silver">
            Hospitality is now
            <span className="mt-2 block font-serif text-[1.12em] font-normal italic leading-[0.88] tracking-tight text-yuzu drop-shadow-[0_0_28px_rgba(204,255,0,0.26)]">
              Sentient.
            </span>
          </h1>
          <p className="max-w-[19rem] font-mono text-[10.5px] leading-relaxed tracking-[0.08em] text-silver/62">
            {isGuests
              ? 'Your phone number becomes the passport. The room recognizes the night before you explain it.'
              : 'Your floor watches, predicts, and acts. Every table becomes a live operating surface.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {isGuests ? <GuestSignalCard /> : <VenueSignalCard />}
        </motion.div>
      </div>
    </section>
  );
}

function MobileAtmosphere({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(204,255,0,0.12)_0%,rgba(204,255,0,0.025)_32%,transparent_66%)]" />
      <svg viewBox="0 0 390 844" className="absolute inset-0 h-full w-full opacity-55" aria-hidden="true">
        <defs>
          <pattern id={`mobile-grid-${activeView}`} width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="390" height="844" fill={`url(#mobile-grid-${activeView})`} />
        {isGuests ? (
          <g fill="none" strokeLinecap="round">
            <path d="M-20 236C78 205 152 262 243 226S358 186 430 210" stroke="rgba(255,255,255,0.11)" />
            <path d="M38 90C94 206 86 362 155 460S247 600 222 790" stroke="rgba(255,255,255,0.08)" />
            <path d="M323 82C270 216 302 356 250 490S151 655 112 850" stroke="rgba(204,255,0,0.12)" strokeDasharray="3 8" />
            {[72, 146, 250, 318].map((cx, i) => (
              <motion.circle
                key={cx}
                cx={cx}
                cy={[220, 344, 508, 666][i]}
                r={i === 1 ? 3.2 : 2.4}
                fill="rgba(204,255,0,0.88)"
                animate={{ opacity: [0.35, 1, 0.35], scale: [1, 1.55, 1] }}
                transition={{ duration: 3 + i * 0.45, repeat: Infinity, ease: 'easeInOut' }}
                style={{ transformOrigin: `${cx}px ${[220, 344, 508, 666][i]}px` }}
              />
            ))}
          </g>
        ) : (
          <g fill="none" strokeLinecap="round">
            <rect x="32" y="135" width="326" height="545" rx="16" stroke="rgba(255,255,255,0.15)" />
            <path d="M64 215H326M64 420H326M64 590H326M195 155V660" stroke="rgba(255,255,255,0.07)" />
            {[88, 158, 238, 305].map((x, i) => (
              <motion.rect
                key={x}
                x={x}
                y={[260, 338, 504, 558][i]}
                width={i === 2 ? 62 : 42}
                height={i === 2 ? 34 : 42}
                rx="8"
                fill="rgba(204,255,0,0.08)"
                stroke="rgba(204,255,0,0.42)"
                animate={{ opacity: [0.34, 0.9, 0.34] }}
                transition={{ duration: 2.8 + i * 0.35, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </g>
        )}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,5,0.52)_58%,#050505_100%)]" />
    </div>
  );
}

function GuestSignalCard() {
  return (
    <div className="w-full rounded-2xl border border-white/12 bg-[#090909]/78 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between border-b border-white/8 pb-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-yuzu/80">Recognized</span>
        <span className="font-mono text-[9px] text-silver/45">now</span>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-3">
        <div>
          <p className="font-serif text-xl italic leading-none text-white/92">Osteria Lumina</p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-silver/58">Table 04 ready. Chablis preference quietly passed to the room.</p>
        </div>
        <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-yuzu/35 bg-yuzu/[0.06]">
          <span className="font-serif text-xl italic text-yuzu">94</span>
        </div>
      </div>
    </div>
  );
}

function VenueSignalCard() {
  return (
    <div className="w-full rounded-2xl border border-yuzu/18 bg-[#090909]/78 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.48)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between border-b border-white/8 pb-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-yuzu/80">Floor signal</span>
        <span className="font-mono text-[9px] text-silver/45">live</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Metric number="+18%" label="RevPASH" />
        <Metric number="4m" label="Wait saved" />
        <Metric number="92%" label="Coverage" />
      </div>
    </div>
  );
}

function ArrivalChapter({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <MobileSection label="Arrival" title={isGuests ? 'Five seconds. No app required.' : 'Every arrival lands clean.'}>
      <p className="mobile-body">
        {isGuests
          ? 'Tap the plate, confirm your number, and the venue knows exactly enough to welcome you back.'
          : 'Walk-ins, regulars, VIPs, and late parties collapse into one calm queue the room can act on.'}
      </p>
      <PhonePassport activeView={activeView} />
      <div className="grid grid-cols-3 gap-2">
        <Metric number="5s" label="Confirm" />
        <Metric number="0" label="Passwords" />
        <Metric number="1" label="Passport" />
      </div>
    </MobileSection>
  );
}

function PhonePassport({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <div className="relative mx-auto flex h-[360px] w-full max-w-[310px] items-center justify-center">
      <div className="absolute h-64 w-64 rounded-full border border-yuzu/16 bg-yuzu/[0.018]" />
      <div className="relative h-[310px] w-[174px] rounded-[2.2rem] border border-white/14 bg-[#111] p-3 shadow-[0_34px_80px_rgba(0,0,0,0.72)]">
        <div className="mx-auto mb-7 h-4 w-16 rounded-b-xl bg-black" />
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yuzu shadow-[0_0_8px_rgba(204,255,0,0.8)]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-silver/55">TapIn</span>
          </div>
          <p className="font-serif text-[26px] italic leading-none text-white">
            {isGuests ? 'Your table awaits.' : 'VIP routed.'}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-silver/58">
            {isGuests ? '+1 555 019 82 verified' : 'T09 - Sofia - quiet booth'}
          </p>
        </div>
        <div className="absolute inset-x-6 bottom-8 h-12 rounded-full bg-yuzu text-center font-mono text-[10px] font-bold uppercase tracking-[0.22em] leading-[3rem] text-obsidian">
          Confirmed
        </div>
      </div>
    </div>
  );
}

function TasteChapter({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <MobileSection label="Taste" title={isGuests ? 'Your palate, remembered.' : 'Guest context before hello.'}>
      <p className="mobile-body">
        {isGuests
          ? 'TapIn learns gently: what you order, when you linger, who you bring, and what should never be suggested.'
          : 'Useful context arrives as a small signal, not a dossier. The team sees what helps tonight.'}
      </p>
      <TasteRadar activeView={activeView} />
    </MobileSection>
  );
}

function TasteRadar({ activeView }: { activeView: ViewMode }) {
  const values = useMemo(
    () => (activeView === 'guests' ? [82, 68, 74, 58, 88] : [91, 76, 62, 84, 70]),
    [activeView]
  );
  const points = useMemo(() => radarPoints(values), [values]);
  return (
    <div className="rounded-2xl border border-white/12 bg-[#090909]/78 p-5 shadow-[0_22px_55px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between border-b border-white/8 pb-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-silver/48">Genome - live</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-yuzu/75">Learning</span>
      </div>
      <svg viewBox="0 0 260 220" className="mx-auto h-[220px] w-full max-w-[320px]" aria-hidden="true">
        {[35, 65, 95].map((r) => (
          <polygon key={r} points={radarRing(r)} fill="none" stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" />
        ))}
        <motion.polygon
          points={points}
          fill="rgba(204,255,0,0.14)"
          stroke="rgba(204,255,0,0.9)"
          strokeWidth="1.4"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: '130px 110px' }}
        />
        {['Palate', 'Room', 'Hour', 'Pace', 'Wine'].map((label, i) => {
          const pos = radarPoint(112, i, 5);
          return (
            <text key={label} x={pos.x} y={pos.y} textAnchor="middle" fontSize="8" letterSpacing="1.2" fill="rgba(255,255,255,0.58)">
              {label.toUpperCase()}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function MemoryChapter({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  const rows = isGuests
    ? ['First tap: quiet corner learned', 'Second visit: wine pre-noted', 'Tonight: welcome already shaped']
    : ['Payment signal captured', 'Preference becomes service memory', 'Return visit opens with context'];
  return (
    <MobileSection label="Memory" title={isGuests ? "A visit doesn't end." : 'Gratitude becomes retention.'}>
      <p className="mobile-body">
        {isGuests
          ? 'The check is not the end of the relationship. It is where the next welcome begins.'
          : 'Every positive signal becomes operational memory the team can use without extra admin.'}
      </p>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <motion.div
            key={row}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.55, delay: i * 0.08 }}
            className="grid grid-cols-[44px_1fr] gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-4"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-full border font-serif text-xl italic ${
              i === rows.length - 1 ? 'border-yuzu/60 text-yuzu' : 'border-white/14 text-silver/60'
            }`}>
              {i + 1}
            </span>
            <div>
              <p className="font-sans text-[13px] font-medium leading-snug text-white/88">{row}</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-silver/38">
                {i === rows.length - 1 ? 'anticipated' : 'remembered'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </MobileSection>
  );
}

function VenueOSChapter({ activeView }: { activeView: ViewMode }) {
  const isGuests = activeView === 'guests';
  return (
    <MobileSection label="Venue OS" title={isGuests ? 'The room moves quietly for you.' : 'Floor intelligence, pocket-sized.'}>
      <p className="mobile-body">
        {isGuests
          ? 'Behind the welcome, the venue sees timing, table fit, and taste signals without exposing the machinery.'
          : 'A lighter mobile surface keeps the operator focused on three facts: money, waiting, and coverage.'}
      </p>
      <MiniFloor activeView={activeView} />
      <div className="grid grid-cols-3 gap-2">
        <Metric number="+23%" label="Revenue" />
        <Metric number="-4m" label="Door wait" />
        <Metric number="85%" label="Seated" />
      </div>
    </MobileSection>
  );
}

function MiniFloor({ activeView }: { activeView: ViewMode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#070707] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.5)]">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-silver/45">Osteria Lumina</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-yuzu/75">Live</span>
      </div>
      <svg viewBox="0 0 330 230" className="h-[230px] w-full" aria-hidden="true">
        <rect x="18" y="20" width="294" height="190" rx="14" fill="none" stroke="rgba(255,255,255,0.16)" />
        <path d="M48 80H282M48 150H282M165 38V194" stroke="rgba(255,255,255,0.08)" />
        <rect x="37" y="42" width="44" height="44" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.22)" />
        <rect x="118" y="50" width="54" height="36" rx="8" fill="rgba(204,255,0,0.11)" stroke="rgba(204,255,0,0.58)" />
        <circle cx="238" cy="68" r="25" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.24)" />
        <rect x="55" y="132" width="56" height="36" rx="8" fill="rgba(204,255,0,0.09)" stroke="rgba(204,255,0,0.42)" />
        <circle cx="190" cy="152" r="27" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.18)" />
        <motion.circle
          cx={activeView === 'guests' ? 118 : 172}
          cy={activeView === 'guests' ? 150 : 68}
          r="5"
          fill="rgb(204,255,0)"
          animate={{ opacity: [0.4, 1, 0.4], r: [4, 7, 4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <text x="165" y="218" textAnchor="middle" fontSize="9" letterSpacing="2" fill="rgba(204,255,0,0.58)">
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
    <MobileSection label="Command" title={activeView === 'guests' ? 'Talk to your night.' : 'Talk to your venue.'}>
      <p className="mobile-body">
        Plain language becomes a confirmed action. No menus, no operator maze, no training curve.
      </p>
      <div className="rounded-2xl border border-white/12 bg-[#090909]/86 shadow-[0_22px_55px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-silver/48">Command</span>
          <div className="flex gap-1.5">
            {scenarios.map((item, i) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setIdx(i)}
                className={`h-2 w-2 rounded-full ${i === idx ? 'bg-yuzu' : 'bg-white/18'}`}
                aria-label={`Show ${item.label}`}
              />
            ))}
          </div>
        </div>
        <div className="p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeView}-${idx}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="rounded-xl border border-yuzu/18 bg-yuzu/[0.035] p-3">
                <span className="font-mono text-[10px] text-yuzu/85">&gt;</span>
                <span className="ml-2 font-sans text-[13px] leading-snug text-white/92">{scenario.prompt}</span>
              </div>
              <div className="space-y-2">
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
    </MobileSection>
  );
}

function TrustChapter({ activeView, onSwitchView }: { activeView: ViewMode; onSwitchView: () => void }) {
  const isGuests = activeView === 'guests';
  return (
    <MobileSection label="Trust" title="Anticipation requires control.">
      <p className="mobile-body">
        Your Taste Genome is yours. TapIn does not sell it, advertise against it, or expose more than hospitality needs.
      </p>
      <div className="grid gap-3">
        {['Inspect', 'Export', 'Pause memory'].map((item) => (
          <div key={item} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
            <span className="font-sans text-[13px] text-white/82">{item}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-yuzu/68">Yours</span>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <p className="font-serif text-[3.2rem] italic leading-[0.9] tracking-tight text-silver">
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

function MobileSection({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="relative px-5 py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-90px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto flex w-full max-w-[430px] flex-col gap-6"
      >
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.34em] text-yuzu/74">
          <span className="h-px w-8 bg-yuzu/42" />
          {label}
        </div>
        <h2 className="font-serif text-[clamp(2.7rem,13vw,4.6rem)] italic leading-[0.96] tracking-tight text-silver">
          {title}
        </h2>
        {children}
      </motion.div>
    </section>
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

function radarPoints(values: number[]) {
  return values.map((value, i) => {
    const p = radarPoint((value / 100) * 95, i, values.length);
    return `${p.x},${p.y}`;
  }).join(' ');
}

function radarRing(radius: number) {
  return [0, 1, 2, 3, 4].map((i) => {
    const p = radarPoint(radius, i, 5);
    return `${p.x},${p.y}`;
  }).join(' ');
}

function radarPoint(radius: number, index: number, total: number) {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  return {
    x: 130 + radius * Math.cos(angle),
    y: 110 + radius * Math.sin(angle),
  };
}
