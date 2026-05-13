export function AICoreScene() {
  const nodes = [
    ['Taste Genome', 50, 12],
    ['Sentiment Matrix', 84, 36],
    ['Tetris Agent', 70, 78],
    ['Gratitude Protocol', 30, 78],
    ['Memory Graph', 16, 36],
  ] as const;

  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#060606] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.52)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,196,87,0.14),transparent_32%),radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.08),transparent_48%)]" />
      <div className="relative mx-auto aspect-[1.65] w-full max-w-5xl">
        <svg viewBox="0 0 100 62" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <circle cx="50" cy="31" r="9" fill="rgba(204,255,0,0.1)" stroke="rgba(204,255,0,0.55)" />
          <text x="50" y="32.5" textAnchor="middle" fontSize="3.2" letterSpacing="0.45" fill="rgba(204,255,0,0.95)">
            AI CORE
          </text>
          {nodes.map(([label, x, y]) => (
            <g key={label}>
              <path d={`M50 31 C ${x} 31, 50 ${y}, ${x} ${y}`} fill="none" stroke="rgba(204,255,0,0.28)" strokeDasharray="1 2" />
              <circle cx={x} cy={y} r="4.2" fill="rgba(5,5,5,0.9)" stroke="rgba(255,255,255,0.18)" />
              <circle cx={x} cy={y} r="1.1" fill="rgba(204,255,0,0.92)" />
            </g>
          ))}
        </svg>

        {nodes.map(([label, x, y]) => (
          <div
            key={label}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-[#080808]/86 px-4 py-2 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-silver/68 backdrop-blur-xl"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="relative mx-auto grid max-w-5xl gap-3 md:grid-cols-4">
        {[
          ['taste', 'preference vector'],
          ['intent', 'plain language'],
          ['yield', 'room pressure'],
          ['memory', 'repeat loop'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="font-serif text-3xl italic text-yuzu">{label}</div>
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.22em] text-silver/48">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
