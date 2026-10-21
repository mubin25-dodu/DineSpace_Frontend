"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  QrCode,
  Utensils,
  ChefHat,
  Wallet,
  ArrowRight,
  CheckCircle2,
  ToggleRight,
  TrendingUp,
} from "lucide-react";

interface OperationalFeature {
  id: string;
  name: string;
  badge: string;
  title: string;
  description: string;
  route: string;
  icon: typeof QrCode;
  highlights: string[];
  mockupContent: React.ReactNode;
}

export default function OperationsSuite() {
  const [activeTab, setActiveTab] = useState<string>("live_kds");

  const features: OperationalFeature[] = [
    {
      id: "live_kds",
      name: "Kitchen Display (KDS)",
      badge: "Real-time Operations",
      title: "Keep the line moving with live order tickets",
      description:
        "Incoming orders appear instantly without paper tickets or waiter handoffs. Kitchen staff update stages with a single click, automatically updating diner screens.",
      route: "/auth?demo=owner",
      icon: ChefHat,
      highlights: [
        "Instant WebSocket push directly to kitchen screens",
        "Color-coded urgency & elapsed order timers",
        "1-click transitions: Pending → Preparing → Ready",
        "Automatic dining table routing & order history",
      ],
      mockupContent: (
        <div className="rounded-2xl border border-[#3e2e27] bg-[#1a1311] p-4 text-[#f7f2ed] shadow-lg">
          <div className="flex items-center justify-between border-b border-[#342721] pb-3 mb-3">
            <span className="text-xs font-bold text-[#e8ded6]">Kitchen Order Queue</span>
            <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              ● 4 Active Orders
            </span>
          </div>
          <div className="space-y-2">
            <div className="rounded-xl border border-[#a13924]/60 bg-[#281b17] p-3">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>#D-408 • Table 04</span>
                <span className="text-[#f5a18a]">New • 1m ago</span>
              </div>
              <p className="mt-1 text-xs text-[#eeddd3]">1x Truffle Salmon Bowl</p>
              <div className="mt-2 flex justify-end">
                <span className="rounded bg-[#a13924] px-2 py-0.5 text-[10px] font-bold text-white">
                  Accept Order →
                </span>
              </div>
            </div>
            <div className="rounded-xl border border-blue-500/30 bg-[#1e2329] p-3 opacity-90">
              <div className="flex justify-between text-xs font-bold text-white">
                <span>#D-405 • Table 02</span>
                <span className="text-blue-300">Cooking • 6m ago</span>
              </div>
              <p className="mt-1 text-xs text-blue-100">2x Wagyu Short Rib Bowl</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "table_qr",
      name: "Universal Restaurant QR",
      badge: "Single QR Setup",
      title: "One universal QR code for your entire restaurant",
      description:
        "No need to print and replace different QR codes for each table. DineSpace generates one master QR code for your restaurant. Print once for all dining tables—guests scan the same code to load your live menu and specify their table at order submission.",
      route: "/auth?demo=owner",
      icon: QrCode,
      highlights: [
        "One universal QR code placed on all dining tables and counters",
        "Instant digital menu loading with zero app downloads",
        "Diners choose or confirm their table number upon ordering",
        "Live table occupancy and seat capacity tracking in the owner workspace",
      ],
      mockupContent: (
        <div className="rounded-2xl border border-[#dec9bd] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#f0e4dc] pb-3 mb-3">
            <span className="text-xs font-bold text-[#201614]">Restaurant QR & Seating</span>
            <span className="rounded-md bg-[#f6eee9] px-2 py-0.5 text-[10px] font-bold text-[#a13924]">
              Same QR for All Tables
            </span>
          </div>
          <div className="rounded-xl border border-[#eddcd5] bg-[#faf7f4] p-3 mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-[#a13924] text-white">
                <QrCode size={16} />
              </span>
              <div>
                <p className="text-xs font-bold text-[#201614]">Artisan Bistro Menu QR</p>
                <p className="text-[10px] text-[#78645c]">PNG / SVG printable stand</p>
              </div>
            </div>
            <span className="rounded-md bg-white border border-[#dec0ba] px-2 py-0.5 text-[10px] font-semibold text-[#a13924]">
              Universal
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-[#a13924] bg-[#fbf5f2] p-2.5 text-center">
              <span className="font-extrabold text-[#a13924]">Table 04</span>
              <p className="text-[10px] text-[#78645c] mt-0.5">Occupied • Active Order</p>
            </div>
            <div className="rounded-xl border border-[#eddcd5] bg-white p-2.5 text-center">
              <span className="font-bold text-[#352520]">Table 05</span>
              <p className="text-[10px] text-[#78645c] mt-0.5">Vacant • 4 Seats</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "digital_menu",
      name: "Menu & Price Control",
      badge: "Real-time Availability",
      title: "Update prices, tags, and item availability in seconds",
      description:
        "Ran out of fresh salmon during the evening rush? Flip the availability toggle, and the dish is instantly marked unavailable across all diner phones.",
      route: "/auth?demo=owner",
      icon: Utensils,
      highlights: [
        "Instant 80-millisecond availability toggles",
        "Live pricing updates with 0 customer cache issues",
        "Categorization for chef specials, mains, and beverages",
        "Upload food photography and dietary badges",
      ],
      mockupContent: (
        <div className="rounded-2xl border border-[#dec9bd] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#f0e4dc] pb-3 mb-3">
            <span className="text-xs font-bold text-[#201614]">Live Menu Catalog</span>
            <span className="text-[10px] text-[#78645c]">Direct Editor</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between rounded-xl border border-[#eddcd5] p-2.5">
              <div>
                <p className="font-bold text-[#1f1614]">Truffle Salmon Bowl</p>
                <p className="text-[10px] text-[#a13924] font-semibold">480 BDT</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-800">
                <ToggleRight size={14} className="text-emerald-700" />
                Available
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#eddcd5] p-2.5 opacity-70">
              <div>
                <p className="font-bold text-[#1f1614]">Seasonal Lobster Roll</p>
                <p className="text-[10px] text-[#857169]">850 BDT</p>
              </div>
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700">
                Sold Out
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "payouts",
      name: "Wallet & Payments",
      badge: "Revenue & Settlements",
      title: "Track revenue, cash, and digital payment collections",
      description:
        "Support cash-at-table alongside simulated mobile payments (bKash & Nagad). Monitor total sales volume and request owner payout withdrawals seamlessly.",
      route: "/auth?demo=owner",
      icon: Wallet,
      highlights: [
        "Real-time revenue aggregation per service shift",
        "Multi-tender support: Cash, bKash, and Nagad",
        "Transparent fee tracking & withdrawal management",
        "Comprehensive order-by-order financial logs",
      ],
      mockupContent: (
        <div className="rounded-2xl border border-[#dec9bd] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#f0e4dc] pb-3 mb-3">
            <span className="text-xs font-bold text-[#201614]">Today's Shift Revenue</span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
              <TrendingUp size={12} /> +18.4%
            </span>
          </div>
          <div className="text-2xl font-black text-[#171717] tracking-tight">
            42,850 BDT
          </div>
          <p className="text-[10px] text-[#78645c] mt-0.5">38 completed table orders</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            <div className="rounded-lg bg-[#fbf5f2] p-2">
              <span className="text-[#857169] block">Cash Collected</span>
              <span className="font-bold text-[#a13924] text-xs">26,400 BDT</span>
            </div>
            <div className="rounded-lg bg-[#fbf5f2] p-2">
              <span className="text-[#857169] block">Digital / Mobile</span>
              <span className="font-bold text-[#1f1614] text-xs">16,450 BDT</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const currentFeature = features.find((f) => f.id === activeTab) || features[0];

  return (
    <section
      aria-labelledby="operations-title"
      className="px-6 py-20 sm:px-8 md:px-[8vw] md:py-28 bg-[#fbf9f6]"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f6eee9] px-3.5 py-1 text-xs font-bold text-[#a13924] mb-3">
            <ChefHat size={14} />
            Restaurant Management Architecture
          </div>
          <h2
            id="operations-title"
            className="text-3xl font-medium tracking-tight text-[#171717] sm:text-4xl lg:text-5xl"
          >
            Built for the speed of actual restaurant service.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#68534b]">
            DineSpace bridges the gap between hungry guests at their tables and the kitchen crew firing tickets. Explore the four core modules powering each shift.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="mb-8 flex flex-wrap gap-2 border-b border-[#ebdcd3] pb-4">
          {features.map((feat) => {
            const isActive = feat.id === activeTab;
            const Icon = feat.icon;
            return (
              <button
                key={feat.id}
                type="button"
                onClick={() => setActiveTab(feat.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#211714] text-white shadow-sm"
                    : "bg-white text-[#68534b] border border-[#ebdcd3] hover:bg-[#f6eee9]"
                }`}
              >
                <Icon size={16} className={isActive ? "text-[#f5a18a]" : "text-[#a13924]"} />
                <span>{feat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentFeature.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 gap-8 rounded-3xl border border-[#dec9bd] bg-white p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 shadow-xs"
          >
            {/* Left Column: Details */}
            <div className="flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-md bg-[#f6eee9] px-2.5 py-1 text-xs font-bold text-[#a13924] uppercase tracking-wide">
                  {currentFeature.badge}
                </span>
                <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#171717] sm:text-3xl">
                  {currentFeature.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#68534b]">
                  {currentFeature.description}
                </p>

                <div className="mt-6 space-y-2.5">
                  {currentFeature.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-[#2f221e]">
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#f6eee9] text-[#a13924]">
                        <CheckCircle2 size={13} strokeWidth={2.5} />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#f0e4dc]">
                <Link
                  href={currentFeature.route}
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#a13924] px-4 text-sm font-bold text-white shadow-xs transition-[background-color,transform] hover:bg-[#862e1c] hover:-translate-y-0.5 active:translate-y-0"
                >
                  Explore in demo workspace
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right Column: Authentic UI Mockup Card */}
            <div className="flex flex-col justify-center">
              {currentFeature.mockupContent}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
