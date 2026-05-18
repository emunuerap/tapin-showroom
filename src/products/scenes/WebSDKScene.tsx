import { motion } from 'framer-motion';

const signals = [
  ['Intent', '2 guests · 20:00'],
  ['Memory', 'corner · Chablis'],
  ['Protect', 'verified · hold ready'],
] as const;

export function WebSDKScene() {
  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] bg-[#050505] shadow-[0_40px_100px_rgba(0,0,0,0.82)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(204,255,0,0.14),transparent_32%),radial-gradient(circle_at_18%_86%,rgba(255,255,255,0.055),transparent_34%)]" />

      <div className="relative min-h-[34rem] overflow-hidden rounded-[1.7rem] border border-white/[0.055] bg-[#080808] shadow-[inset_0_1px_0_rgba(255,255,255,0.045)]">
        <RestaurantBackdrop />

        <div className="relative z-10 flex items-center justify-between border-b border-white/8 bg-black/32 px-5 py-4 backdrop-blur-xl md:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <div className="hidden gap-1.5 md:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-white/14" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/8" />
            </div>
            <span className="hidden h-5 w-px bg-white/10 md:block" />
            <div className="font-serif text-2xl italic tracking-wide text-white/90">Osteria Lumina</div>
          </div>
          <div className="flex items-center gap-5 font-mono text-[9px] uppercase tracking-[0.22em] text-silver/44 md:gap-8">
            <span className="hidden md:inline">Menu</span>
            <span className="hidden md:inline">Events</span>
            <span className="text-yuzu">Book</span>
          </div>
        </div>

        <div className="relative z-10 min-h-[28.5rem] p-5 md:p-8">
          <div className="flex min-w-0 flex-col justify-between gap-8">
            <div className="max-w-[21rem] pt-4 md:pt-8">
              <motion.h3
                initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[clamp(2.35rem,3.55vw,3.85rem)] italic leading-[0.9] text-white/76"
              >
                Tonight,
                <span className="block">quietly arranged.</span>
              </motion.h3>
              <div className="mt-7 h-px w-28 bg-gradient-to-r from-yuzu via-yuzu/55 to-transparent" />
            </div>

            <div className="absolute bottom-6 left-5 z-20 grid w-[min(14rem,36%)] gap-1.5 md:left-8">
              <div className="font-mono text-[7px] uppercase tracking-[0.2em] text-yuzu/62">Signal captured</div>
              {signals.map(([label, value], index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.08, duration: 0.52 }}
                  className="rounded-full border border-white/8 bg-black/44 px-3 py-2 backdrop-blur-xl"
                >
                  <span className="flex min-w-0 items-center gap-2 font-mono text-[7px] uppercase tracking-[0.14em] text-silver/45">
                    <span className="h-1.5 w-1.5 rounded-full bg-yuzu shadow-[0_0_10px_rgba(204,255,0,0.8)]" />
                    {label}
                  </span>
                  <span className="mt-1 block truncate pl-3.5 text-[10px] text-white/68">{value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-end gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="absolute right-6 top-[31%] z-30 flex w-max items-center gap-2 rounded-full border border-yuzu/28 bg-yuzu/[0.08] px-5 py-3 shadow-[0_0_34px_rgba(204,255,0,0.14)] backdrop-blur-xl md:right-8"
            >
              <span className="h-2 w-2 rounded-full bg-yuzu shadow-[0_0_14px_rgba(204,255,0,0.95)]" />
              <span className="font-mono text-[10px] font-extrabold uppercase tracking-[0.26em] text-yuzu">TapIn</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 24, stiffness: 190, delay: 0.38 }}
              className="absolute bottom-6 right-5 z-30 w-[min(19rem,46%)] overflow-hidden rounded-[1.55rem] border border-white/14 bg-black/78 shadow-[0_28px_76px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.13)] backdrop-blur-3xl md:right-8"
            >
              <div className="flex items-center justify-between px-4 py-3.5">
                <span className="font-mono text-[8px] uppercase tracking-[0.26em] text-silver/50">Booking Layer</span>
                <span className="rounded-full bg-yuzu/10 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-yuzu">
                  12 sec
                </span>
              </div>

              <div className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-2">
                  {['19:30', '20:00', '20:30'].map((time, index) => (
                    <div
                      key={time}
                      className={`rounded-xl border px-2 py-2.5 text-center font-mono text-[10px] transition-colors ${
                        index === 1
                          ? 'border-yuzu/55 bg-yuzu/[0.12] text-yuzu shadow-[inset_0_0_20px_rgba(204,255,0,0.12)]'
                          : 'border-white/10 bg-white/[0.045] text-silver/46'
                      }`}
                    >
                      {time}
                    </div>
                  ))}
                </div>

                <div className="mt-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-yuzu shadow-[0_0_14px_rgba(204,255,0,0.8)]" />
                    <p className="text-[10px] leading-relaxed text-silver/66">
                      <span className="text-white">+1 555 verified.</span> Quiet corner remembered. Card hold ready if needed.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-3 h-11 w-full rounded-full bg-yuzu text-center font-mono text-[10px] font-extrabold uppercase tracking-[0.24em] text-black shadow-[0_0_24px_rgba(204,255,0,0.28)]"
                >
                  Swipe to confirm
                </button>
              </div>
            </motion.div>
        </div>
        </div>
      </div>
    </div>
  );
}

function RestaurantBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src="/products/websdk-restaurant-bg.png"
        alt=""
        aria-hidden="true"
        className="h-full w-full object-cover opacity-72 saturate-[0.82]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.56),rgba(0,0,0,0.22)_36%,rgba(0,0,0,0.74)_78%),linear-gradient(180deg,rgba(0,0,0,0.28),rgba(0,0,0,0.86))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(204,255,0,0.105),transparent_30%),radial-gradient(circle_at_24%_76%,rgba(255,255,255,0.055),transparent_28%)]" />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:92px_92px]" />
    </div>
  );
}
