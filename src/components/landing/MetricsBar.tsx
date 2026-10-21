"use client";

import { motion } from "motion/react";
import { Zap, Clock, Wifi, Sparkles } from "lucide-react";

export default function MetricsBar() {
  const metrics = [
    {
      value: "< 1.2s",
      label: "Scan to Restaurant Menu",
      detail: "Instant web access with zero app downloads",
      icon: Zap,
    },
    {
      value: "0 min",
      label: "Waiter Waiting Delay",
      detail: "Guests browse and order as soon as they sit",
      icon: Clock,
    },
    {
      value: "100%",
      label: "Live Ticket Sync",
      detail: "WebSocket delivery from table to kitchen line",
      icon: Wifi,
    },
    {
      value: "3 Taps",
      label: "Total Ordering Steps",
      detail: "Scan QR, select dishes, send to kitchen",
      icon: Sparkles,
    },
  ];

  return (
    <section
      aria-label="Performance highlights"
      className="border-y border-[#ebdcd3] bg-[#f5ede7]/60 py-10 px-6 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-[#a13924]/12 text-[#a13924]">
                    <Icon size={14} />
                  </span>
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#171717]">
                    {m.value}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-[#241a17]">
                  {m.label}
                </h4>
                <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-[#735e56]">
                  {m.detail}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
