export function IntegrationsScene() {
  const nodes = [
    ['POS', 18, 24],
    ['Stripe', 50, 14],
    ['NFC', 82, 24],
    ['Instagram', 84, 66],
    ['Maps', 50, 84],
    ['WhatsApp', 16, 66],
    ['Telegram', 28, 46],
    ['Web SDK', 72, 46],
  ] as const;

  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.52)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(204,255,0,0.11),transparent_42%)]" />
      <div className="relative mx-auto aspect-[1.5] w-full max-w-5xl">
        <svg viewBox="0 0 100 66" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          <circle cx="50" cy="50" r="16" fill="rgba(204,255,0,0.06)" stroke="rgba(204,255,0,0.35)" />
          {nodes.map(([label, x, y]) => (
            <g key={label}>
              <line x1="50" y1="50" x2={x} y2={y} stroke="rgba(255,255,255,0.12)" />
              <circle cx={x} cy={y} r="4.6" fill="rgba(255,255,255,0.035)" stroke="rgba(204,255,0,0.38)" />
            </g>
          ))}
        </svg>
        <div className="absolute left-1/2 top-[76%] grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-yuzu/40 bg-[#050505]/90 shadow-[0_0_60px_rgba(204,255,0,0.16)]">
          <div className="text-center">
            <div className="font-serif text-3xl italic text-yuzu">TapIn</div>
            <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-silver/42">protocol</div>
          </div>
        </div>
        {nodes.map(([label, x, y]) => (
          <div
            key={label}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/72 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-silver/68 backdrop-blur-xl"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
