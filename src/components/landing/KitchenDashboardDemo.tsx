"use client";

import { motion, AnimatePresence } from "motion/react";
import { Utensils, Clock, CheckCircle2, Flame, Bell, ChefHat, Sparkles } from "lucide-react";
import { OrderStage } from "./OrderConfirmationDemo";

interface KitchenDashboardDemoProps {
  orderStage: OrderStage;
  onAdvanceStage?: () => void;
  reducedMotion?: boolean;
}

export default function KitchenDashboardDemo({
  orderStage,
  onAdvanceStage,
  reducedMotion = false,
}: KitchenDashboardDemoProps) {
  // Existing static orders to make the restaurant dashboard feel vibrant and real
  const existingOrders = [
    {
      id: "D-405",
      table: "02",
      time: "8m ago",
      items: "2x Wagyu Short Rib",
      status: "preparing" as const,
      total: 1280,
    },
    {
      id: "D-402",
      table: "07",
      time: "14m ago",
      items: "1x Burrata Tartine, 2x Berry Spritz",
      status: "ready" as const,
      total: 620,
    },
  ];

  const isD408InNew = orderStage === "pending";
  const isD408InPrep = orderStage === "confirmed" || orderStage === "preparing";
  const isD408InReady = orderStage === "ready";

  return (
    <div className="flex h-full w-full flex-col bg-[#1c1513] text-[#f7f2ed] rounded-3xl border border-[#3d2e27] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.55)] overflow-hidden select-none">
      {/* Dashboard Top Header */}
      <div className="flex items-center justify-between border-b border-[#342721] bg-[#241b18] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="grid size-7 sm:size-8 place-items-center rounded-lg bg-[#a13924] text-white shadow-xs">
            <Utensils size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white">
                The Artisan Bistro
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live POS
              </span>
            </div>
            <p className="text-[10px] text-[#b09e96]">Kitchen Display System (KDS)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-[#2e231f] px-3 py-1.5 border border-[#45342c] text-xs">
            <Clock size={13} className="text-[#e2b99f]" />
            <span className="text-[#d8c3b7]">Active Service</span>
          </div>
          <span className="rounded-xl bg-[#a13924] px-2.5 py-1 text-xs font-bold text-white shadow-xs">
            {orderStage === "ready" ? "3 Orders" : "3 Orders"}
          </span>
        </div>
      </div>

      {/* 3-Column Kanban Board */}
      <div className="grid flex-1 grid-cols-1 md:grid-cols-3 gap-2.5 p-3 sm:p-4 overflow-y-auto overflow-x-hidden no-scrollbar bg-[#17110f]">
        {/* Column 1: New / Incoming */}
        <div className="flex flex-col rounded-2xl bg-[#221a17] border border-[#342722] p-2.5 min-h-[220px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#382b25]">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-400" />
              <span className="text-xs font-bold text-[#e8ded6]">New Incoming</span>
            </div>
            <span className="rounded-full bg-[#352822] px-2 py-0.5 text-[10px] font-bold text-[#e0ab8c]">
              {isD408InNew ? 1 : 0}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <AnimatePresence mode="popLayout">
              {isD408InNew && (
                <motion.div
                  layoutId="ticket-d408"
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.85, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="relative rounded-xl border-2 border-[#a13924] bg-[#2a1d19] p-3 shadow-[0_4px_20px_rgba(161,57,36,0.35)]"
                >
                  {/* Incoming Highlight Ping */}
                  <div className="absolute -top-1.5 -right-1.5 flex items-center gap-1 rounded-full bg-[#a13924] px-2 py-0.5 text-[9px] font-black text-white shadow-xs uppercase tracking-wider animate-bounce">
                    <Sparkles size={9} />
                    New QR Order!
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white tracking-wide">
                      #D-408
                    </span>
                    <span className="rounded-md bg-[#a13924]/20 border border-[#a13924]/40 px-2 py-0.5 text-[10px] font-extrabold text-[#f5a18a]">
                      Table 04
                    </span>
                  </div>

                  <div className="mt-2 space-y-0.5 text-[11px] text-[#eeddd3]">
                    <div className="font-semibold text-white">1x Truffle Salmon Bowl</div>
                    <div className="text-[10px] text-[#bdaaa1]">Dine-in • Cash/Simulated</div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#412e27] pt-2">
                    <span className="text-[10px] text-[#e8a38a] flex items-center gap-1">
                      <Clock size={10} /> Just now
                    </span>
                    <button
                      type="button"
                      onClick={onAdvanceStage}
                      className="rounded-lg bg-[#a13924] px-2.5 py-1 text-[10px] font-bold text-white shadow-xs hover:bg-[#862e1c] active:scale-95 transition-transform"
                    >
                      Accept & Prep →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isD408InNew && (
              <div className="flex h-28 items-center justify-center rounded-xl border border-dashed border-[#382b25] text-[11px] text-[#735e55]">
                No pending queue
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Preparing / In Kitchen */}
        <div className="flex flex-col rounded-2xl bg-[#221a17] border border-[#342722] p-2.5 min-h-[220px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#382b25]">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-400" />
              <span className="text-xs font-bold text-[#e8ded6]">Preparing</span>
            </div>
            <span className="rounded-full bg-[#352822] px-2 py-0.5 text-[10px] font-bold text-[#e0ab8c]">
              {isD408InPrep ? 2 : 1}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <AnimatePresence mode="popLayout">
              {isD408InPrep && (
                <motion.div
                  layoutId="ticket-d408"
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="rounded-xl border border-blue-500/40 bg-[#1e2329] p-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">#D-408</span>
                    <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-extrabold text-blue-300">
                      Table 04
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-[#e0e9f2]">
                    <div className="font-semibold text-white">1x Truffle Salmon Bowl</div>
                    <div className="text-[10px] text-blue-200/70 flex items-center gap-1 mt-0.5">
                      <ChefHat size={11} /> Firing on line • Chef Alex
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#2e3742] pt-2">
                    <span className="text-[10px] text-blue-300 flex items-center gap-1">
                      <Clock size={10} /> 2m ago
                    </span>
                    <button
                      type="button"
                      onClick={onAdvanceStage}
                      className="rounded-lg bg-blue-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-transform"
                    >
                      Mark Ready ✓
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Static Existing Prep Order */}
            <div className="rounded-xl border border-[#3a2c26] bg-[#261c18] p-3 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#d9c8bf]">
                  #{existingOrders[0].id}
                </span>
                <span className="rounded-md bg-[#3a2c26] px-1.5 py-0.5 text-[10px] font-semibold text-[#b8a499]">
                  Table {existingOrders[0].table}
                </span>
              </div>
              <p className="mt-1 text-[11px] font-medium text-[#c4b3a8]">
                {existingOrders[0].items}
              </p>
              <span className="mt-2 text-[10px] text-[#867065] block">
                {existingOrders[0].time}
              </span>
            </div>
          </div>
        </div>

        {/* Column 3: Ready for Table */}
        <div className="flex flex-col rounded-2xl bg-[#221a17] border border-[#342722] p-2.5 min-h-[220px]">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#382b25]">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-[#e8ded6]">Ready for Table</span>
            </div>
            <span className="rounded-full bg-[#352822] px-2 py-0.5 text-[10px] font-bold text-[#e0ab8c]">
              {isD408InReady ? 2 : 1}
            </span>
          </div>

          <div className="flex-1 space-y-2">
            <AnimatePresence mode="popLayout">
              {isD408InReady && (
                <motion.div
                  layoutId="ticket-d408"
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="rounded-xl border border-emerald-500/50 bg-[#1a261f] p-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">#D-408</span>
                    <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
                      Table 04
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-emerald-100">
                    <div className="font-semibold text-white">1x Truffle Salmon Bowl</div>
                    <div className="text-[10px] text-emerald-300/80 flex items-center gap-1 mt-0.5">
                      <Bell size={11} /> Food Plated • Runner Dispatched
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-[#293d30] pt-2">
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={11} /> Done
                    </span>
                    <span className="rounded-md bg-emerald-700/60 px-2 py-0.5 text-[10px] font-bold text-white">
                      Delivered
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Static Existing Ready Order */}
            <div className="rounded-xl border border-[#3a2c26] bg-[#261c18] p-3 opacity-80">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#d9c8bf]">
                  #{existingOrders[1].id}
                </span>
                <span className="rounded-md bg-[#3a2c26] px-1.5 py-0.5 text-[10px] font-semibold text-[#b8a499]">
                  Table {existingOrders[1].table}
                </span>
              </div>
              <p className="mt-1 text-[11px] font-medium text-[#c4b3a8]">
                {existingOrders[1].items}
              </p>
              <span className="mt-2 text-[10px] text-[#867065] block">
                {existingOrders[1].time}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Connection Footer */}
      <div className="border-t border-[#342721] bg-[#1a1311] px-4 py-2.5 flex items-center justify-between text-xs text-[#b8a59b]">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px]">WebSocket Connected (Zero Latency)</span>
        </div>
        <span className="text-[11px] text-[#e0ab8c] font-medium">Table 04 synced</span>
      </div>
    </div>
  );
}
