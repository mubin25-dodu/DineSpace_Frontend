"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  QrCode,
  UtensilsCrossed,
  ShoppingBag,
  Send,
  ChefHat,
  Play,
  Pause,
  RotateCcw,
  Wifi,
  Battery,
  Signal,
} from "lucide-react";

import QRCodeScanDemo from "./QRCodeScanDemo";
import PhoneMenuDemo, { DEMO_DISHES, DemoDish } from "./PhoneMenuDemo";
import OrderConfirmationDemo, { OrderStage } from "./OrderConfirmationDemo";
import KitchenDashboardDemo from "./KitchenDashboardDemo";

export type StoryStage = "scan" | "menu" | "cart" | "order" | "kitchen";

interface StageInfo {
  id: StoryStage;
  label: string;
  subtitle: string;
  icon: typeof QrCode;
}

const STAGES: StageInfo[] = [
  { id: "scan", label: "Scan QR", subtitle: "Restaurant Menu", icon: QrCode },
  { id: "menu", label: "Menu", subtitle: "Dishes & prices", icon: UtensilsCrossed },
  { id: "cart", label: "Add dish", subtitle: "One tap selection", icon: ShoppingBag },
  { id: "order", label: "Order", subtitle: "Table 04", icon: Send },
  { id: "kitchen", label: "Kitchen", subtitle: "Live ticket sync", icon: ChefHat },
];

const STAGE_NARRATION: Record<StoryStage, { headline: string; body: string }> = {
  scan: {
    headline: "One QR. Every table.",
    body: "The restaurant places a single QR stand on every table. Diners scan it to instantly open the live digital menu — no app needed.",
  },
  menu: {
    headline: "The full menu, right now.",
    body: "Live pricing, dietary tags, and rich dish cards load in under half a second — always up to date.",
  },
  cart: {
    headline: "Add to your bowl in one tap.",
    body: "Dishes spring into the cart with haptic feedback. The running total updates instantly, no page reload.",
  },
  order: {
    headline: "Pick your table. Fire the order.",
    body: "Confirm your table number at review, choose Cash, bKash, or Nagad, and dispatch the ticket straight to the kitchen line.",
  },
  kitchen: {
    headline: "Kitchen receives it instantly.",
    body: "The POS kanban lights up in real time. Chefs move the ticket — and the diner's phone updates the moment it changes.",
  },
};

export default function HeroProductStory() {
  const [currentStage, setCurrentStage] = useState<StoryStage>("scan");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [kitchenOrderStage, setKitchenOrderStage] = useState<OrderStage>("pending");
  const [progress, setProgress] = useState<number>(0);

  const shouldReduceMotion = useReducedMotion();

  const hasOrder = currentStage === "cart" || currentStage === "order" || currentStage === "kitchen";
  const selectedDish = DEMO_DISHES.find((dish) => dish.id === selectedDishId) ?? DEMO_DISHES[0];
  const cartCount = hasOrder ? 1 : 0;
  const cartSubtotal = hasOrder ? selectedDish.price : 0;

  const transitionToStage = useCallback(
    (stage: StoryStage, keepSelectedDish = false) => {
      setCurrentStage(stage);
      setProgress(0);

      if (stage === "scan" || stage === "menu") {
        setSelectedDishId(null);
      } else if (!keepSelectedDish) {
        setSelectedDishId(DEMO_DISHES[0].id);
      }

      if (stage === "scan" || stage === "order") {
        setKitchenOrderStage("pending");
      } else if (stage === "kitchen") {
        setKitchenOrderStage("confirmed");
      }
    },
    [],
  );

  // Stage progression loop with progress bar
  useEffect(() => {
    if (shouldReduceMotion || !isPlaying) return;

    const intervalMs = 50;
    const totalDurationMs = 3800;
    let elapsedMs = 0;
    const currentStageIndex = STAGES.findIndex((stage) => stage.id === currentStage);
    const nextStage = STAGES[(currentStageIndex + 1) % STAGES.length].id;

    const interval = setInterval(() => {
      elapsedMs += intervalMs;
      if (elapsedMs >= totalDurationMs) {
        transitionToStage(nextStage);
        return;
      }
      setProgress((elapsedMs / totalDurationMs) * 100);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [currentStage, isPlaying, shouldReduceMotion, transitionToStage]);

  const handleManualStageSelect = (stage: StoryStage) => {
    transitionToStage(stage);
  };

  const handleDishSelect = (dish: DemoDish) => {
    setSelectedDishId(dish.id);
    if (currentStage === "menu") {
      transitionToStage("cart", true);
    }
  };

  const handleKitchenAdvance = () => {
    if (kitchenOrderStage === "pending") {
      setKitchenOrderStage("confirmed");
    } else if (kitchenOrderStage === "confirmed") {
      setKitchenOrderStage("preparing");
    } else if (kitchenOrderStage === "preparing") {
      setKitchenOrderStage("ready");
    } else {
      setKitchenOrderStage("pending");
    }
  };

  const handleReplay = () => {
    transitionToStage("scan");
    setIsPlaying(true);
  };

  const currentStageIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className="grid w-full items-center gap-10 xl:grid-cols-[minmax(20rem,0.72fr)_minmax(0,1.28fr)] xl:gap-12 2xl:gap-16">
      <div className="min-w-0">
        <div>
          <div className="mb-3">
            <div aria-label="Choose a demo step" className="flex flex-wrap items-center gap-1.5" role="group">
              {STAGES.map((st, idx) => {
                const isActive = st.id === currentStage;
                const isPassed = idx < currentStageIndex;
                const Icon = st.icon;

                return (
                  <button
                    key={st.id}
                    type="button"
                    aria-label={`${idx + 1}. ${st.label}`}
                    aria-pressed={isActive}
                    onClick={() => handleManualStageSelect(st.id)}
                    className={`relative flex min-h-9 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold transition-[background-color,color,transform] duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924] ${
                      isActive
                        ? "bg-[#211714] text-white shadow-xs"
                        : isPassed
                          ? "bg-[#f5ede7] text-[#a13924] hover:bg-[#ebdcd4]"
                          : "border border-[#ebdcd3] bg-white text-[#78645c] hover:bg-[#fbf7f4]"
                    }`}
                  >
                    <Icon size={12} className={isActive ? "text-[#f5a18a]" : ""} />
                    <span>{st.label}</span>

                    {isActive && isPlaying && !shouldReduceMotion && (
                      <motion.div
                        className="absolute bottom-0 left-2 h-0.5 rounded-full bg-[#d77858]"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4 flex items-center gap-1.5">
            <button
              type="button"
              aria-label={isPlaying ? "Pause demonstration" : "Play demonstration"}
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[#dec9bd] bg-white px-2.5 text-xs font-semibold text-[#30231e] shadow-2xs transition-colors hover:bg-[#f6eee9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924]"
            >
              {isPlaying ? (
                <>
                  <Pause size={11} className="text-[#a13924]" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play size={11} className="fill-[#a13924] text-[#a13924]" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              aria-label="Restart demonstration"
              onClick={handleReplay}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-[#dec9bd] bg-white px-2.5 text-xs font-semibold text-[#30231e] shadow-2xs transition-colors hover:bg-[#f6eee9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924]"
            >
              <RotateCcw size={11} />
              <span className="hidden sm:inline">Replay</span>
            </button>
          </div>

          <div
            aria-live={isPlaying ? "off" : "polite"}
            className="relative min-h-28 overflow-hidden rounded-2xl border border-[#ead8d3] bg-white/80 p-4 shadow-[0_8px_30px_rgba(33,27,24,0.06)] sm:p-5"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`narration-${currentStage}`}
                initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-start gap-4"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#a13924] text-xs font-bold tabular-nums text-white shadow-xs">
                  {currentStageIndex + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-semibold leading-tight tracking-tight text-[#171717] text-balance">
                    {STAGE_NARRATION[currentStage].headline}
                  </p>
                  <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-[#735b53] text-pretty">
                    {STAGE_NARRATION[currentStage].body}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Dual Theater: Smartphone + Kitchen POS Direct Canvas Display */}
      <div className="relative grid select-none grid-cols-1 items-center gap-5 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-6 2xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* Smartphone Frame */}
        <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[290px] xl:mx-0 xl:max-w-[280px] 2xl:max-w-[300px]">
          {/* Subtle Ambient Device Glow */}
          <div className="pointer-events-none absolute -inset-1 rounded-[46px] bg-[#a13924]/10 blur-md" />

          {/* Phone Shell */}
          <div className="relative aspect-[9/18.5] w-full overflow-hidden rounded-[42px] border-[7px] border-[#241c19] bg-[#241c19] shadow-[0_25px_60px_-15px_rgba(28,20,17,0.35)] ring-1 ring-white/10">
            {/* Dynamic Island */}
            <div className="absolute top-2 inset-x-0 z-30 flex justify-center pointer-events-none">
              <div className="h-5 w-24 rounded-full bg-[#120d0b] flex items-center justify-end pr-2.5">
                <span className="size-2 rounded-full bg-[#1d1613] ring-1 ring-white/5" />
              </div>
            </div>

            {/* Status Bar */}
            <div className="absolute top-0 inset-x-0 z-20 flex h-10 items-center justify-between px-6 pt-1 text-[10px] font-semibold text-[#1f1614] pointer-events-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 text-[#1f1614]">
                <Signal size={10} />
                <Wifi size={10} />
                <Battery size={12} className="rotate-90" />
              </div>
            </div>

            {/* Phone Screen Canvas */}
            <div className="relative h-full w-full pt-10 pb-4 overflow-hidden bg-[#fdfbf9]">
              <AnimatePresence mode="wait">
                {currentStage === "scan" && (
                  <motion.div
                    key="stage-scan"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full"
                  >
                    <QRCodeScanDemo
                      isScanned={progress > 60}
                      reducedMotion={shouldReduceMotion ?? false}
                    />
                  </motion.div>
                )}

                {(currentStage === "menu" || currentStage === "cart") && (
                  <motion.div
                    key="stage-menu"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full"
                  >
                    <PhoneMenuDemo
                      selectedDishId={selectedDishId}
                      onSelectDish={handleDishSelect}
                      cartCount={cartCount}
                      cartSubtotal={cartSubtotal}
                      activeCategory={activeCategory}
                      onCategoryChange={setActiveCategory}
                      reducedMotion={shouldReduceMotion ?? false}
                    />
                  </motion.div>
                )}

                {(currentStage === "order" || currentStage === "kitchen") && (
                  <motion.div
                    key="stage-order"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full w-full"
                  >
                    <OrderConfirmationDemo
                      orderStage={kitchenOrderStage}
                      orderNumber="D-408"
                      tableNumber="04"
                      itemCount={cartCount || 1}
                      totalAmount={cartSubtotal || 480}
                      reducedMotion={shouldReduceMotion ?? false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Home Indicator Bar */}
            <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none">
              <div className="h-1 w-28 rounded-full bg-[#171717]/30" />
            </div>
          </div>

          {/* Customer Device Caption */}
          <div className="mt-2.5 flex items-center justify-between text-xs text-[#735e56] px-1">
            <span className="font-semibold">Diner Interface</span>
            <span className="rounded-md bg-[#f6eee9] px-2 py-0.5 text-[10px] font-bold text-[#a13924]">
              Mobile Web View
            </span>
          </div>
        </div>

        {/* Kitchen POS Terminal View */}
        <div className="relative flex flex-col justify-center w-full">
          {/* Animated SVG Connector Line (Visible on Desktop) */}
          <div className="hidden xl:block absolute -left-6 top-1/2 -translate-y-1/2 w-6 pointer-events-none">
            <svg viewBox="0 0 30 20" fill="none" className="w-full">
              <path
                d="M0 10 H30"
                stroke="#a13924"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
              <circle cx="15" cy="10" r="3" fill="#a13924" />
            </svg>
          </div>

          {/* Kitchen Display System */}
          <div className="w-full min-h-[350px] xl:min-h-[420px] flex flex-col">
            <KitchenDashboardDemo
              orderStage={kitchenOrderStage}
              onAdvanceStage={handleKitchenAdvance}
              reducedMotion={shouldReduceMotion ?? false}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
