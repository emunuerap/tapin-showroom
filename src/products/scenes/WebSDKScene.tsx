export function WebSDKScene() {
  return (
    <div className="relative h-full min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#080808] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.52)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_24%,rgba(204,255,0,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_34%)]" />
      <div className="relative h-full rounded-[1.5rem] border border-white/10 bg-[#111]/78 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="font-serif text-2xl italic text-white">Osteria Lumina</div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-silver/42">restaurant website</div>
          </div>
          <div className="rounded-full border border-white/10 bg-black/34 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-silver/52">
            menu / events / book
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_0.74fr]">
          <div className="space-y-4">
            <div className="relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015))]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_24%,rgba(255,255,255,0.2),transparent_22%),radial-gradient(circle_at_70%_60%,rgba(204,255,0,0.13),transparent_32%),linear-gradient(140deg,#191816,#070707_68%)]" />
              <div className="absolute bottom-5 left-5 max-w-64">
                <div className="font-serif text-2xl italic text-white/88">Tonight, quietly arranged.</div>
                <div className="mt-2 h-px w-24 bg-yuzu/50" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['Tasting', 'Terrace', 'Private'].map((item) => (
                <div key={item} className="grid h-24 content-end rounded-xl border border-white/8 bg-white/[0.025] p-3">
                  <div className="h-1 w-10 rounded-full bg-yuzu/60" />
                  <div className="mt-3 font-mono text-[8px] uppercase tracking-[0.18em] text-silver/50">{item}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[22rem]">
            <div className="absolute right-4 top-8 rounded-full border border-yuzu/35 bg-yuzu px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-obsidian shadow-[0_0_28px_rgba(204,255,0,0.35)]">
              TapIn
            </div>
            <div className="absolute bottom-0 right-0 w-full max-w-[20rem] rounded-[1.6rem] border border-yuzu/24 bg-[#050505]/94 p-4 shadow-[0_0_70px_rgba(204,255,0,0.12)]">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-yuzu/76">booking layer</span>
                <span className="text-xs text-silver/42">12 sec</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['19:30', '20:00', '20:30'].map((time, index) => (
                  <div
                    key={time}
                    className={`rounded-xl border px-3 py-3 text-center font-mono text-[10px] ${
                      index === 1 ? 'border-yuzu/45 bg-yuzu/[0.08] text-yuzu' : 'border-white/10 text-silver/55'
                    }`}
                  >
                    {time}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white/80">
                +1 555 verified. Quiet corner remembered.
              </div>
              <div className="mt-4 h-11 rounded-full bg-yuzu text-center text-[10px] font-extrabold uppercase leading-11 tracking-[0.22em] text-obsidian">
                Swipe to confirm
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
