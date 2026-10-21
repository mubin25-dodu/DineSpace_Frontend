"use client";

import { motion } from "motion/react";
import { CheckCircle2, Clock, ChefHat, Bell, Receipt, Sparkles } from "lucide-react";

export type OrderStage = "pending" | "confirmed" | "preparing" | "ready";

interface OrderConfirmationDemoProps {
  orderStage: OrderStage;
  orderNumber?: string;
  tableNumber?: string;
  itemCount?: number;
  totalAmount?: number;
  reducedMotion?: boolean;
}

export default function OrderConfirmationDemo({
  orderStage,
  orderNumber = "D-408",
  tableNumber = "04",
  itemCount = 1,
  totalAmount = 480,
  reducedMotion = false,
}: OrderConfirmationDemoProps) {
  const steps: { key: OrderStage; label: string; desc: string }[] = [
    { key: "pending", label: "Sent", desc: "Arrived at kitchen POS" },
    { key: "confirmed", label: "Confirmed", desc: "Accepted by staff" },
    { key: "preparing", label: "Preparing", desc: "Chef firing on line" },
    { key: "ready", label: "Ready", desc: "Heading to Table 04" },
  ];

  const getStepIndex = (stage: OrderStage) => {
    switch (stage) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "preparing":
        return 2;
      case "ready":
        return 3;
    }
  };

  const currentIndex = getStepIndex(orderStage);

  return (
    <div className="relative flex h-full w-full flex-col bg-[#fdfbf9] text-[#211714] p-4 select-none justify-between overflow-y-auto no-scrollbar">
      {/* Top Banner */}
      <div>
        <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-700">
              <CheckCircle2 size={18} strokeWidth={2.5} />
            </span>
            <div>
              <h4 className="text-xs font-bold tracking-tight text-[#171717]">Order Placed!</h4>
              <p className="text-[10px] text-[#78645c]">Order #{orderNumber} • Table #{tableNumber}</p>
            </div>
          </div>
          <span className="rounded-full bg-[#f6eee9] px-2 py-0.5 text-[10px] font-bold text-[#a13924]">
            Live Sync
          </span>
        </div>

        {/* Live Status Card */}
        <motion.div
          key={orderStage}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-3 rounded-2xl border border-[#eddcd5] bg-white p-3.5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="grid size-8 place-items-center rounded-xl bg-[#a13924] text-white shadow-xs">
                  {orderStage === "pending" && <Clock size={16} />}
                  {orderStage === "confirmed" && <CheckCircle2 size={16} />}
                  {orderStage === "preparing" && <ChefHat size={16} />}
                  {orderStage === "ready" && <Bell size={16} />}
                </span>
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-white animate-ping" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1a1412] capitalize">
                  {orderStage === "pending" && "Waiting for Kitchen"}
                  {orderStage === "confirmed" && "Order Confirmed"}
                  {orderStage === "preparing" && "Chef Cooking Now"}
                  {orderStage === "ready" && "Ready for Table"}
                </p>
                <p className="text-[10px] text-[#735e56]">
                  {orderStage === "pending" && "Sent via table QR"}
                  {orderStage === "confirmed" && "Kitchen acknowledged ticket"}
                  {orderStage === "preparing" && "Estimated time: 8–10 mins"}
                  {orderStage === "ready" && "Being served to Table #04"}
                </p>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-[#a13924] bg-[#fbf5f2] px-2 py-1 rounded-md">
              {orderStage === "pending" ? "0m ago" : "Just now"}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mt-4 pt-3 border-t border-[#f4ede7]">
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div key={st.key} className="flex flex-col items-center">
                    <div
                      className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                        isPassed ? "bg-[#a13924]" : "bg-[#eee4de]"
                      } ${isCurrent ? "ring-2 ring-[#a13924]/30" : ""}`}
                    />
                    <span
                      className={`mt-1.5 text-[9px] font-bold ${
                        isPassed ? "text-[#a13924]" : "text-[#b09e96]"
                      }`}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Order Receipt Summary */}
        <div className="mt-3 rounded-2xl border border-[#f0e4dc] bg-[#faf6f2] p-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#ebdcd3]">
            <span className="flex items-center gap-1.5 font-bold text-[#352520] text-[11px]">
              <Receipt size={13} className="text-[#a13924]" />
              Item Summary
            </span>
            <span className="text-[10px] text-[#867167]">Table #04</span>
          </div>
          <div className="py-2 space-y-1 text-[11px]">
            <div className="flex justify-between font-medium text-[#2d211d]">
              <span>{itemCount}x Truffle Salmon Bowl</span>
              <span className="font-bold">{totalAmount} BDT</span>
            </div>
            <div className="flex justify-between text-[10px] text-[#867167]">
              <span>Payment Mode</span>
              <span className="font-semibold text-emerald-700">Cash / Simulated</span>
            </div>
          </div>
          <div className="flex justify-between border-t border-[#ebdcd3] pt-2 font-bold text-[#1f1614] text-[11px]">
            <span>Total Payable</span>
            <span className="text-[#a13924] font-black">{totalAmount} BDT</span>
          </div>
        </div>
      </div>

      {/* Reassurance Footer */}
      <div className="rounded-xl bg-white border border-[#eddcd5] p-2.5 text-center shadow-2xs mt-3">
        <p className="text-[10px] font-medium text-[#65524b] flex items-center justify-center gap-1">
          <Sparkles size={11} className="text-[#a13924]" />
          DineSpace keeps this tab synced live. Relax at your table!
        </p>
      </div>
    </div>
  );
}
