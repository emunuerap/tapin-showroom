export function HospitalityOSScene() {
  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.52)]">
      <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(204,255,0,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.22)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="relative grid h-full gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-white/10 bg-black/42 p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-yuzu/72">floor intelligence</span>
            <span className="rounded-full border border-yuzu/30 px-3 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-yuzu">live</span>
          </div>
          <svg viewBox="0 0 520 360" className="h-[28rem] max-h-[65vh] w-full" aria-hidden="true">
            <rect x="18" y="18" width="484" height="302" rx="24" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.16)" />
            <path d="M72 114H448M72 218H448M258 48V294" stroke="rgba(255,255,255,0.08)" />
            {[
              [96, 82, 'T04', true],
              [196, 98, 'T09', false],
              [342, 96, 'T11', true],
              [112, 236, 'B2', false],
              [262, 238, 'T18', true],
              [410, 230, 'VIP', true],
            ].map(([x, y, label, active]) => (
              <g key={label as string}>
                <rect
                  x={(x as number) - 34}
                  y={(y as number) - 22}
                  width="68"
                  height="44"
                  rx="12"
                  fill={active ? 'rgba(204,255,0,0.09)' : 'rgba(255,255,255,0.035)'}
                  stroke={active ? 'rgba(204,255,0,0.55)' : 'rgba(255,255,255,0.2)'}
                />
                <text x={x as number} y={(y as number) + 4} textAnchor="middle" fontSize="11" letterSpacing="2" fill="rgba(255,255,255,0.76)">
                  {label as string}
                </text>
              </g>
            ))}
            <path d="M410 230C360 210 310 140 196 98" fill="none" stroke="rgba(204,255,0,0.52)" strokeDasharray="7 10" />
          </svg>
        </div>

        <div className="grid gap-4">
          {[
            ['Tetris Agent', 'Move VIP to T09. Server Sofia assigned.'],
            ['No-show risk', 'Table 11 risk down 18% after message cue.'],
            ['Revenue pressure', 'Bar alternative protects +23% RevPASH.'],
            ['Service feed', 'Bottle reorder scheduled before the ask.'],
          ].map(([title, body], index) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-yuzu/70">{title}</span>
                <span className="font-serif text-2xl italic text-white/30">0{index + 1}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-silver/64">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
