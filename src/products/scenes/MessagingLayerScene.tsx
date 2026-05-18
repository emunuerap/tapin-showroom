import { motion } from "framer-motion";

export function MessagingLayerScene() {
  return (
    <div className="relative min-h-[34rem] overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
      <motion.div
        animate={{ opacity: [0.05, 0.15, 0.05], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#25D366_10%,transparent_40%),radial-gradient(circle_at_80%_80%,#0088cc_10%,transparent_40%)] opacity-20"
      />

      <div className="relative z-10 mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {/* WhatsApp Simulation */}
        <ChatApp
          theme="whatsapp"
          delayOffset={0}
          lines={[
            ["guest", "Italian tonight, quiet, 2 people."],
            [
              "tapin",
              "Osteria Lumina has 20:00 and remembers your Chablis preference.",
            ],
            ["guest", "Hold it."],
            ["tapin", "Held for 4 minutes. Confirm with TapIn."],
          ]}
        />
        {/* Telegram Simulation */}
        <ChatApp
          theme="telegram"
          delayOffset={1.5}
          lines={[
            ["guest", "Move us 30 minutes later?"],
            ["tapin", "20:30 works. Table 04 remains available."],
            ["guest", "Perfect."],
            ["tapin", "Updated. Venue notified without calling."],
          ]}
        />
      </div>

      <div className="relative z-10 mx-auto mt-8 grid max-w-5xl grid-cols-3 gap-4">
        {["Parse intent", "Match availability", "Send confirmation"].map(
          (step, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2 }}
              key={step}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center transition-all hover:bg-white/[0.04]"
            >
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full border border-yuzu/40 bg-yuzu/[0.1] font-serif text-xl italic text-yuzu transition-transform group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(204,255,0,0.4)]">
                {index + 1}
              </div>
              <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-silver/60 group-hover:text-white">
                {step}
              </div>
            </motion.div>
          ),
        )}
      </div>
    </div>
  );
}

function ChatApp({
  theme,
  lines,
  delayOffset,
}: {
  theme: "whatsapp" | "telegram";
  lines: Array<["guest" | "tapin", string]>;
  delayOffset: number;
}) {
  const isWhatsApp = theme === "whatsapp";
  const headerBg = isWhatsApp ? "bg-[#075E54]" : "bg-[#17212b]";
  const chatBg = isWhatsApp ? "bg-[#efeae2]" : "bg-[#0e1621]";
  const sentBg = isWhatsApp ? "bg-[#d9fdd3]" : "bg-[#2b5278]";
  const receivedBg = isWhatsApp ? "bg-white" : "bg-[#182533]";
  const sentText = isWhatsApp ? "text-[#111b21]" : "text-white";
  const receivedText = isWhatsApp ? "text-[#111b21]" : "text-white";

  return (
    <div
      className={`flex flex-col rounded-[2rem] border-4 border-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden ${chatBg} h-80 relative`}
    >
      {/* App Header */}
      <div
        className={`${headerBg} px-4 py-3 flex items-center gap-3 z-10 shadow-sm`}
      >
        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white font-serif italic text-sm">
          T
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm leading-tight">
            TapIn Assistant
          </div>
          <div className="text-white/70 text-[10px]">bot</div>
        </div>
      </div>

      {/* Chat Background Pattern (simulated with opacity) */}
      {isWhatsApp && (
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "10px 10px",
          }}
        />
      )}

      {/* Chat Messages */}
      <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden z-10">
        {lines.map(([speaker, text], i) => {
          const isSent = speaker === "guest";
          return (
            <motion.div
              initial={{ opacity: 0, x: isSent ? 20 : -20, scale: 0.95 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{
                delay: delayOffset + i * 0.4,
                type: "spring",
                bounce: 0.4,
              }}
              key={i}
              className={`max-w-[80%] rounded-[1rem] px-3 py-2 text-[13px] leading-snug shadow-sm relative ${
                isSent
                  ? `ml-auto ${sentBg} ${sentText} rounded-tr-none`
                  : `${receivedBg} ${receivedText} rounded-tl-none`
              }`}
            >
              {text}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
