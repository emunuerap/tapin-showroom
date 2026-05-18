import { motion } from "framer-motion";

export function HospitalityOSScene() {
  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
      <div className="absolute inset-0 opacity-[0.15] [background-image:linear-gradient(rgba(204,255,0,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(204,255,0,0.15)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative z-10 grid h-full gap-6 md:grid-cols-[1.3fr_0.7fr]">
        <div className="flex flex-col rounded-[2rem] border border-white/10 bg-black/60 p-5 backdrop-blur-xl shadow-2xl">
          <div className="mb-6 flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-yuzu animate-pulse shadow-[0_0_15px_rgba(204,255,0,0.8)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-yuzu">
                floor intelligence
              </span>
            </div>
            <span className="rounded-full border border-yuzu/30 bg-yuzu/10 px-4 py-1.5 font-mono text-[8px] uppercase tracking-[0.2em] text-yuzu">
              live
            </span>
          </div>

          <div className="relative flex-1 rounded-2xl border border-white/5 bg-[#0a0a0a]/50 p-4">
            <svg
              viewBox="0 0 520 360"
              className="h-full w-full"
              aria-hidden="true"
            >
              <rect
                x="18"
                y="18"
                width="484"
                height="302"
                rx="24"
                fill="rgba(255,255,255,0.01)"
                stroke="rgba(255,255,255,0.08)"
              />
              <path
                d="M72 114H448M72 218H448M258 48V294"
                stroke="rgba(255,255,255,0.05)"
              />

              {/* Animated connection path */}
              <motion.path
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                d="M410 230C360 210 310 140 196 98"
                fill="none"
                stroke="rgba(204,255,0,0.8)"
                strokeWidth="2"
                strokeDasharray="6 8"
              />

              {[
                [96, 82, "T04", true, 0.1],
                [196, 98, "T09", false, 0.2],
                [342, 96, "T11", true, 0.3],
                [112, 236, "B2", false, 0.4],
                [262, 238, "T18", true, 0.5],
                [410, 230, "VIP", true, 0.6],
              ].map(([x, y, label, active, delay]) => (
                <motion.g
                  key={label as string}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: delay as number,
                    type: "spring",
                    bounce: 0.5,
                  }}
                >
                  <rect
                    x={(x as number) - 34}
                    y={(y as number) - 22}
                    width="68"
                    height="44"
                    rx="12"
                    fill={
                      active ? "rgba(204,255,0,0.1)" : "rgba(255,255,255,0.02)"
                    }
                    stroke={
                      active ? "rgba(204,255,0,0.6)" : "rgba(255,255,255,0.15)"
                    }
                    className="transition-colors duration-500"
                  />
                  {active && (
                    <motion.circle
                      cx={(x as number) + 34}
                      cy={(y as number) - 22}
                      r="4"
                      fill="#ccff00"
                      className="drop-shadow-[0_0_8px_rgba(204,255,0,0.8)]"
                    />
                  )}
                  <text
                    x={x as number}
                    y={(y as number) + 4}
                    textAnchor="middle"
                    fontSize="11"
                    letterSpacing="2"
                    fill={
                      active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.4)"
                    }
                  >
                    {label as string}
                  </text>
                </motion.g>
              ))}
            </svg>
          </div>
        </div>

        <div className="grid gap-3">
          {[
            ["Tetris Agent", "Move VIP to T09. Server Sofia assigned.", true],
            [
              "No-show risk",
              "Table 11 risk down 18% after message cue.",
              false,
            ],
            [
              "Revenue pressure",
              "Bar alternative protects +23% RevPASH.",
              false,
            ],
            ["Service feed", "Bottle reorder scheduled before the ask.", false],
          ].map(([title, body, highlight], index) => (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              key={title as string}
              className={`group cursor-pointer rounded-[1.5rem] border p-5 transition-all hover:scale-[1.02] ${
                highlight
                  ? "border-yuzu/40 bg-yuzu/[0.08] shadow-[0_0_30px_rgba(204,255,0,0.1)]"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-mono text-[9px] uppercase tracking-[0.25em] ${highlight ? "text-yuzu" : "text-yuzu/60"}`}
                >
                  {title}
                </span>
                <span
                  className={`font-serif text-3xl italic ${highlight ? "text-white" : "text-white/20"}`}
                >
                  0{index + 1}
                </span>
              </div>
              <p
                className={`mt-3 text-sm leading-relaxed ${highlight ? "text-white/90" : "text-silver/50"}`}
              >
                {body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
