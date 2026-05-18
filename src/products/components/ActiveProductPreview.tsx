import { AnimatePresence, motion } from 'framer-motion';

import type { ProductDefinition, ProductVisualType } from '../content/products';

interface ActiveProductPreviewProps {
  product: ProductDefinition;
}

export function ActiveProductPreview({ product }: ActiveProductPreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#070807]/72 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl md:p-5">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-yuzu/55 to-transparent" />
      <div className="pointer-events-none absolute right-[-18%] top-[-60%] h-56 w-56 rounded-full bg-yuzu/[0.055] blur-3xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 16, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 grid gap-4 md:grid-cols-[0.86fr_1.14fr] md:items-center"
        >
          <ProductVisualFragment type={product.visualType} />

          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_18px_rgba(204,255,0,0.7)]" />
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-yuzu/76">
                {product.eyebrow}
              </span>
            </div>
            <h3 className="max-w-[26rem] text-[clamp(1.25rem,2.1vw,1.9rem)] font-black leading-[0.98] tracking-tight text-silver">
              {product.headline}
            </h3>
            <p className="mt-3 max-w-md text-[12px] leading-relaxed text-silver/58 md:text-[13px]">
              {product.shortDescription}
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {product.bullets.slice(0, 3).map((bullet) => (
                <div
                  key={bullet}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2"
                >
                  <div className="mb-1 h-px w-8 bg-yuzu/42" />
                  <div className="font-mono text-[7.2px] uppercase tracking-[0.18em] text-silver/56">
                    {bullet}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProductVisualFragment({ type }: { type: ProductVisualType }) {
  switch (type) {
    case 'web-sdk-strip':
      return <WebSdkFragment />;
    case 'consumer-app-mini':
      return <ConsumerAppFragment />;
    case 'hospitality-cockpit':
      return <HospitalityOsFragment />;
    case 'messaging-bubbles':
      return <MessagingFragment />;
    case 'ai-core-signals':
      return <AiCoreFragment />;
    case 'integrations-fabric':
      return <IntegrationsFragment />;
    default:
      return null;
  }
}

function WebSdkFragment() {
  return (
    <div className="relative min-h-[11rem] overflow-hidden rounded-[1.3rem] border border-white/10 bg-black/45 p-3">
      <div className="flex items-center justify-between border-b border-white/8 pb-2">
        <span className="font-serif text-sm italic text-silver">Osteria Lumina</span>
        <span className="rounded-full border border-yuzu/30 px-3 py-1 font-mono text-[7px] uppercase tracking-[0.24em] text-yuzu">
          TapIn
        </span>
      </div>
      <div className="mt-4 grid grid-cols-[1fr_0.72fr] gap-3">
        <div>
          <div className="font-serif text-[1.75rem] italic leading-[0.9] text-silver/82">
            Tonight,
            <br />
            quietly.
          </div>
          <div className="mt-4 h-px w-16 bg-yuzu/45" />
        </div>
        <div className="rounded-2xl border border-yuzu/22 bg-yuzu/[0.055] p-3 shadow-[0_0_30px_rgba(204,255,0,0.08)]">
          <div className="mb-2 flex justify-between font-mono text-[6px] uppercase tracking-[0.22em] text-silver/40">
            <span>Booking</span>
            <span className="text-yuzu">12 sec</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {['19:30', '20:00', '20:30'].map((slot) => (
              <span
                key={slot}
                className={`rounded-lg border px-1 py-2 text-center font-mono text-[7px] ${
                  slot === '20:00' ? 'border-yuzu/50 bg-yuzu/12 text-yuzu' : 'border-white/8 text-silver/38'
                }`}
              >
                {slot}
              </span>
            ))}
          </div>
          <div className="mt-3 rounded-full bg-yuzu px-3 py-2 text-center font-mono text-[7px] font-black uppercase tracking-[0.24em] text-obsidian">
            Swipe
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsumerAppFragment() {
  return (
    <div className="relative grid min-h-[11rem] place-items-center overflow-hidden rounded-[1.3rem] border border-white/10 bg-black/45 p-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(204,255,0,0.13),transparent_55%)]" />
      <div className="relative h-40 w-20 rounded-[1.55rem] border border-white/22 bg-[#050605] p-2 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <div className="mx-auto mb-3 h-2.5 w-9 rounded-full bg-black" />
        <div className="font-serif text-sm italic text-silver">TapIn<span className="text-yuzu">·</span></div>
        <div className="mt-2 rounded-xl border border-yuzu/26 bg-yuzu/[0.055] p-2">
          <div className="font-mono text-[5.5px] uppercase tracking-[0.22em] text-yuzu/80">Reservation</div>
          <div className="font-serif text-lg italic leading-none text-silver">8:30pm</div>
        </div>
        <div className="mt-3 space-y-1.5">
          {[88, 72, 64].map((value) => (
            <div key={value} className="h-1 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-yuzu" style={{ width: `${value}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HospitalityOsFragment() {
  const tableNodes = [
    { left: '18%', top: '22%', active: true },
    { left: '58%', top: '20%', active: false },
    { left: '36%', top: '54%', active: true },
    { left: '72%', top: '64%', active: false },
  ];

  return (
    <div className="relative min-h-[11rem] overflow-hidden rounded-[1.3rem] border border-white/10 bg-black/45 p-3">
      <div className="grid h-full grid-cols-[1fr_0.9fr] gap-3">
        <div className="relative rounded-2xl border border-white/8 bg-white/[0.02] p-3">
          <div className="absolute inset-3 rounded-xl border border-yuzu/16" />
          {tableNodes.map(({ left, top, active }) => (
            <span
              key={`${left}-${top}`}
              className={`absolute h-5 w-5 rounded-full border ${
                active ? 'border-yuzu/60 bg-yuzu/18 shadow-[0_0_16px_rgba(204,255,0,0.25)]' : 'border-white/16 bg-black/40'
              }`}
              style={{ left, top }}
            />
          ))}
        </div>
        <div className="space-y-2">
          {['VIP context', 'Yield +18%', 'No-show -4'].map((label) => (
            <div key={label} className="rounded-xl border border-white/8 bg-white/[0.025] px-3 py-2">
              <div className="h-px w-8 bg-yuzu/48" />
              <div className="mt-2 font-mono text-[7px] uppercase tracking-[0.18em] text-silver/58">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MessagingFragment() {
  return (
    <div className="relative min-h-[11rem] overflow-hidden rounded-[1.3rem] border border-white/10 bg-black/45 p-3">
      <div className="space-y-3">
        <MessageBubble align="left" label="Guest" text="Two of us, quiet table around 9." />
        <MessageBubble align="right" label="TapIn" text="9:00 available · Casa Marisol." />
        <MessageBubble align="right" label="Confirm" text="Verified phone · swipe link ready." active />
      </div>
    </div>
  );
}

function MessageBubble({
  align,
  label,
  text,
  active = false,
}: {
  align: 'left' | 'right';
  label: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-2xl border px-3 py-2 ${
          active ? 'border-yuzu/38 bg-yuzu/[0.075]' : 'border-white/9 bg-white/[0.025]'
        }`}
      >
        <div className="font-mono text-[6px] uppercase tracking-[0.22em] text-yuzu/64">{label}</div>
        <div className="mt-1 text-[11px] leading-snug text-silver/76">{text}</div>
      </div>
    </div>
  );
}

function AiCoreFragment() {
  const nodes = [
    ['Taste', '17%', '28%'],
    ['Tetris', '58%', '18%'],
    ['Sentiment', '63%', '64%'],
    ['Gratitude', '18%', '66%'],
  ];

  return (
    <div className="relative min-h-[11rem] overflow-hidden rounded-[1.3rem] border border-white/10 bg-black/45 p-3">
      <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 260 170" aria-hidden="true">
        <path d="M130 82 L55 48 M130 82 L170 38 M130 82 L182 116 M130 82 L62 118" stroke="rgba(204,255,0,0.32)" strokeWidth="1" />
        <circle cx="130" cy="82" r="28" fill="rgba(204,255,0,0.045)" stroke="rgba(204,255,0,0.35)" />
        <circle cx="130" cy="82" r="5" fill="#ccff00" />
      </svg>
      {nodes.map(([label, left, top]) => (
        <div
          key={label}
          className="absolute rounded-full border border-white/10 bg-[#080908]/86 px-3 py-2 font-mono text-[7px] uppercase tracking-[0.2em] text-silver/62"
          style={{ left, top }}
        >
          {label}
        </div>
      ))}
      <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-yuzu/20 bg-yuzu/[0.045] px-3 py-2 font-mono text-[7px] uppercase tracking-[0.24em] text-yuzu/72">
        Decision layer · live
      </div>
    </div>
  );
}

function IntegrationsFragment() {
  const items = ['POS', 'Stripe', 'NFC', 'Maps', 'Social'];

  return (
    <div className="relative min-h-[11rem] overflow-hidden rounded-[1.3rem] border border-white/10 bg-black/45 p-3">
      <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-yuzu/34 bg-yuzu/[0.055] font-serif text-lg italic text-silver">
        TapIn
      </div>
      {items.map((item, index) => {
        const angle = (-90 + index * 72) * (Math.PI / 180);
        const left = 50 + Math.cos(angle) * 34;
        const top = 50 + Math.sin(angle) * 35;
        return (
          <div
            key={item}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-[7px] uppercase tracking-[0.2em] text-silver/62"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
