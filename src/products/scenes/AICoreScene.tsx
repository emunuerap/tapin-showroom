import { motion } from 'framer-motion';

const agents = [
  { label: 'Taste Genome', value: 'Chablis · shellfish risk · late pace', tone: 'quiet' },
  { label: 'Tetris Agent', value: 'VIP to T09 · server Sofia · 18m turn', tone: 'active' },
  { label: 'Sentiment Matrix', value: 'celebration intent · privacy needed', tone: 'quiet' },
  { label: 'Gratitude Protocol', value: 'return loop · thank-you cue · memory saved', tone: 'active' },
] as const;

export function AICoreScene() {
  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] p-5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.45, 0.72, 0.45] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_52%_28%,rgba(204,255,0,0.14),transparent_34%),radial-gradient(circle_at_50%_72%,rgba(255,255,255,0.07),transparent_42%)]"
      />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:46px_46px]" />

      <div className="relative z-10 grid h-full min-h-[31rem] gap-4 md:grid-cols-[0.82fr_1.18fr]">
        <div className="flex flex-col justify-between rounded-[1.5rem] border border-white/10 bg-black/45 p-5 backdrop-blur-xl">
          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-yuzu/72">AI Core</div>
            <div className="mt-4 font-serif text-4xl italic leading-none text-yuzu">Signal becomes service.</div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="font-mono text-[8px] uppercase tracking-[0.24em] text-silver/42">natural command</div>
            <p className="mt-3 text-sm leading-relaxed text-white/86">
              “Two guests, 20:00, quiet corner, remembers mineral whites. Protect no-show risk.”
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {['parse', 'decide', 'act'].map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.35 }}
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 2.2, repeat: Infinity, delay: index * 0.32 }}
                  className="rounded-full border border-yuzu/20 bg-yuzu/[0.05] px-3 py-2 text-center font-mono text-[8px] uppercase tracking-[0.18em] text-yuzu"
                >
                  {step}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#070707]/82 p-5">
          <svg viewBox="0 0 520 360" className="absolute inset-0 h-full w-full opacity-75" aria-hidden="true">
            <defs>
              <radialGradient id="ai-core-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(204,255,0,0.24)" />
                <stop offset="100%" stopColor="rgba(204,255,0,0)" />
              </radialGradient>
            </defs>
            <circle cx="260" cy="176" r="118" fill="url(#ai-core-glow)" />
            <circle cx="260" cy="176" r="54" fill="rgba(204,255,0,0.08)" stroke="rgba(204,255,0,0.55)" />
            <circle cx="260" cy="176" r="92" fill="none" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 10" />
            <circle cx="260" cy="176" r="136" fill="none" stroke="rgba(204,255,0,0.12)" />
            {[
              [260, 60],
              [430, 150],
              [345, 305],
              [95, 210],
            ].map(([x, y], index) => (
              <g key={`${x}-${y}`}>
                <motion.line
                  x1="260"
                  y1="176"
                  x2={x}
                  y2={y}
                  stroke={index % 2 ? 'rgba(204,255,0,0.38)' : 'rgba(255,255,255,0.22)'}
                  strokeDasharray="8 10"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: index * 0.12 }}
                />
                <circle cx={x} cy={y} r="9" fill="rgba(5,5,5,0.9)" stroke="rgba(255,255,255,0.24)" />
              </g>
            ))}
            <text x="260" y="181" textAnchor="middle" fontSize="15" letterSpacing="3" fill="rgba(204,255,0,0.95)">
              CORE
            </text>
          </svg>

          <div className="relative z-10 grid h-full content-between gap-4">
            <div className="grid gap-3">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.label}
                  initial={{ opacity: 0, x: index % 2 ? 18 : -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 + index * 0.08 }}
                  className="ml-auto w-[82%] rounded-2xl border border-white/10 bg-black/58 p-4 shadow-[0_18px_55px_rgba(0,0,0,0.32)] backdrop-blur-xl odd:ml-0"
                >
                  <div className={`font-mono text-[9px] uppercase tracking-[0.22em] ${agent.tone === 'active' ? 'text-yuzu' : 'text-silver/72'}`}>
                    {agent.label}
                  </div>
                  <div className="mt-2 text-sm leading-relaxed text-silver/68">{agent.value}</div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {['intent confidence 96%', 'yield protected +18%', 'memory saved'].map((metric) => (
                <div key={metric} className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-silver/56">
                  {metric}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
