export function ConsumerAppScene() {
  return (
    <div className="relative grid min-h-[34rem] place-items-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#070707] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,196,87,0.14),transparent_34%),radial-gradient(circle_at_80%_78%,rgba(204,255,0,0.08),transparent_32%)]" />
      <div className="relative grid w-full max-w-4xl items-center gap-7 md:grid-cols-[0.88fr_1.12fr]">
        <div className="mx-auto h-[31rem] w-[16rem] rounded-[2.4rem] border border-white/15 bg-black p-3 shadow-[0_0_80px_rgba(255,196,87,0.08)]">
          <div className="h-full overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#0c0c0c] p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-yuzu/70">passport</span>
              <span className="h-2 w-2 rounded-full bg-yuzu shadow-[0_0_12px_rgba(204,255,0,0.8)]" />
            </div>
            <div className="mt-8 font-serif text-4xl italic leading-[0.88] text-white">
              Marisol
              <span className="block text-yuzu">94</span>
            </div>
            <div className="mt-8 grid gap-3">
              {[
                ['Taste', 'Chablis / mineral whites'],
                ['Room', 'quiet corner / late table'],
                ['Gratitude', '22% generosity signal'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                  <div className="font-mono text-[8px] uppercase tracking-[0.2em] text-yuzu/64">{label}</div>
                  <div className="mt-1 text-xs text-silver/70">{value}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-full border border-yuzu/28 bg-yuzu/[0.08] py-3 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-yuzu">
              next table ready
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
            <div className="font-mono text-[9px] uppercase tracking-[0.24em] text-silver/44">flashback</div>
            <div className="mt-3 font-serif text-3xl italic text-white">Osteria Lumina, 12 weeks ago</div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-silver/62">
              Phone tap at the door. No profile, no app. TapIn learned wine, pace, table, and service preference.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['Taste Genome', 'Reservation Wallet', 'Gratitude Loop'].map((label) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-[#050505]/70 p-4">
                <div className="h-1 w-10 rounded-full bg-yuzu" />
                <div className="mt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-silver/64">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
