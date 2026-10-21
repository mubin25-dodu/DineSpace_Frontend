"use client";

import { motion } from "motion/react";
import QRCode from "react-qr-code";
import { Sparkles, Utensils, CheckCircle2 } from "lucide-react";

interface QRCodeScanDemoProps {
  isScanned: boolean;
  onScanComplete?: () => void;
  reducedMotion?: boolean;
}

export default function QRCodeScanDemo({
  isScanned,
  onScanComplete,
  reducedMotion = false,
}: QRCodeScanDemoProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center select-none">
      {/* Restaurant Acrylic Table Tent Stand */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-col items-center rounded-3xl border border-[#e5dcd3] bg-gradient-to-b from-[#ffffff] to-[#faf6f0] p-6 shadow-[0_16px_40px_-12px_rgba(50,30,20,0.14)] w-full max-w-[280px]"
      >
        {/* Restaurant Header */}
        <div className="flex items-center gap-2 mb-3">
          <span className="grid size-7 place-items-center rounded-lg bg-[#a13924] text-white shadow-sm">
            <Utensils size={14} strokeWidth={2} />
          </span>
          <div className="text-left">
            <p className="text-xs font-bold tracking-tight text-[#221714]">The Artisan Bistro</p>
            <p className="text-[10px] text-[#857169]">Digital Menu • Scan to Order</p>
          </div>
        </div>

        {/* Restaurant QR Code Container with Scanning Laser */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#a13924]/20 bg-white p-3.5 shadow-inner">
          <QRCode
            value="https://dinespace.mu-bin.dev/user"
            size={140}
            level="M"
            className="h-auto w-full max-w-[140px]"
            fgColor="#211714"
            bgColor="#ffffff"
          />

          {/* Scanning Beam Animation */}
          {!isScanned && (
            <motion.div
              animate={
                reducedMotion
                  ? { opacity: [0.3, 0.8, 0.3] }
                  : { y: [0, 130, 0] }
              }
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none absolute inset-x-2 h-0.75 bg-gradient-to-r from-transparent via-[#a13924] to-transparent shadow-[0_0_12px_#a13924]"
            />
          )}

          {/* Scanned Success Overlay */}
          {isScanned && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#a13924]/95 backdrop-blur-xs text-white"
            >
              <CheckCircle2 size={36} className="text-white drop-shadow-md mb-1" />
              <span className="text-xs font-bold tracking-wide">Menu Unlocked</span>
              <span className="text-[10px] text-white/80">Opening Restaurant Menu...</span>
            </motion.div>
          )}
        </div>

        {/* Instruction Badge */}
        <div className="mt-4 flex items-center gap-1.5 rounded-full bg-[#f4ebe6] px-3 py-1 text-[11px] font-semibold text-[#8a2f1c]">
          <Sparkles size={12} className="animate-pulse" />
          <span>Universal Restaurant QR</span>
        </div>
      </motion.div>

      {/* Table Shadow */}
      <div className="mt-3 h-3 w-44 rounded-[100%] bg-black/5 blur-sm" />
    </div>
  );
}
