import { motion } from 'framer-motion';

const rails = [
  ['Web SDK', 'reservation intent'],
  ['POS', 'table + check state'],
  ['Stripe', 'deposit + card hold'],
  ['NFC', 'arrival identity'],
  ['WhatsApp', 'conversation booking'],
  ['Telegram', 'confirmation link'],
] as const;

const invoices = [
  ['Maré Seafood', 'matched supplier · 4 line items'],
  ['Valle Produce', 'invoice captured · due Friday'],
  ['Bodega Norte', 'wine SKU linked · margin alert'],
] as const;

export function IntegrationsScene() {
  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] p-5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
      <motion.div
        animate={{ opacity: [0.42, 0.75, 0.42], scale: [1, 1.16, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(204,255,0,0.16),transparent_34%),radial-gradient(circle_at_78%_78%,rgba(255,255,255,0.06),transparent_36%)]"
      />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(204,255,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.2)_1px,transparent_1px)] [background-size:54px_54px]" />

      <div className="relative z-10 grid min-h-[31rem] gap-4 md:grid-cols-[1.08fr_0.92fr]">
        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/46 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.26em] text-yuzu/72">integration fabric</div>
              <div className="mt-2 font-serif text-3xl italic text-white">Everything speaks TapIn.</div>
            </div>
            <div className="rounded-full border border-yuzu/25 bg-yuzu/[0.08] px-3 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-yuzu">
              live sync
            </div>
          </div>

          <div className="relative min-h-[20rem]">
            <svg viewBox="0 0 520 320" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <circle cx="260" cy="160" r="58" fill="rgba(204,255,0,0.08)" stroke="rgba(204,255,0,0.45)" />
              <circle cx="260" cy="160" r="112" fill="none" stroke="rgba(255,255,255,0.09)" strokeDasharray="5 12" />
              {[
                [90, 58],
                [260, 36],
                [430, 58],
                [430, 252],
                [260, 284],
                [90, 252],
              ].map(([x, y], index) => (
                <motion.line
                  key={`${x}-${y}`}
                  x1="260"
                  y1="160"
                  x2={x}
                  y2={y}
                  stroke={index % 2 ? 'rgba(255,255,255,0.16)' : 'rgba(204,255,0,0.32)'}
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ delay: 0.08 * index, duration: 0.9 }}
                />
              ))}
            </svg>

            <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-yuzu/40 bg-[#070707]/94 shadow-[0_0_55px_rgba(204,255,0,0.2)]">
              <div className="text-center">
                <div className="font-serif text-3xl italic text-yuzu">TapIn</div>
                <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/54">protocol</div>
              </div>
            </div>

            {rails.map(([label, value], index) => {
              const positions = [
                ['8%', '6%'],
                ['50%', '0%'],
                ['92%', '6%'],
                ['92%', '78%'],
                ['50%', '88%'],
                ['8%', '78%'],
              ] as const;
              const [left, top] = positions[index];
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.22 + index * 0.06 }}
                  className="absolute min-w-28 -translate-x-1/2 rounded-2xl border border-white/10 bg-[#090909]/90 px-3 py-2 text-center shadow-[0_12px_45px_rgba(0,0,0,0.38)] backdrop-blur-xl"
                  style={{ left, top }}
                >
                  <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/74">{label}</div>
                  <div className="mt-1 text-[10px] text-silver/45">{value}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl">
            <div className="font-mono text-[9px] uppercase tracking-[0.26em] text-yuzu/72">back office memory</div>
            <div className="mt-4 grid gap-3">
              {invoices.map(([vendor, body], index) => (
                <motion.div
                  key={vendor}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24 + index * 0.08 }}
                  className="rounded-2xl border border-white/10 bg-black/42 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-xl italic text-white">{vendor}</span>
                    <span className="rounded-full bg-yuzu/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-yuzu">auto</span>
                  </div>
                  <div className="mt-2 text-sm text-silver/56">{body}</div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {['payments', 'suppliers', 'crm'].map((label) => (
              <div key={label} className="rounded-2xl border border-yuzu/12 bg-yuzu/[0.035] p-4 text-center">
                <div className="font-serif text-2xl italic text-yuzu">✓</div>
                <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-silver/55">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
