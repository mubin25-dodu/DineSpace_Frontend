"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Plus, Check, ShoppingBag, Flame, Sparkles } from "lucide-react";

export interface DemoDish {
  id: string;
  name: string;
  category: string;
  price: number;
  calories: string;
  image: string;
  tag?: string;
  description: string;
}

export const DEMO_DISHES: DemoDish[] = [
  {
    id: "dish-1",
    name: "Truffle Salmon Bowl",
    category: "Signature Bowls",
    price: 480,
    calories: "520 kcal",
    image: "/Diner/restaurant-browsing.jpg",
    tag: "Chef's Pick",
    description: "Sashimi salmon, avocado, edamame, warm jasmine rice with black truffle ponzu.",
  },
  {
    id: "dish-2",
    name: "Smoked Wagyu Short Rib",
    category: "Mains",
    price: 640,
    calories: "680 kcal",
    image: "/Diner/mobile-ordering.jpg",
    tag: "Popular",
    description: "12-hour braised short rib, pickled shallots, roasted garlic glaze.",
  },
  {
    id: "dish-3",
    name: "Artisan Burrata Tartine",
    category: "Starters",
    price: 360,
    calories: "340 kcal",
    image: "/Diner/diner-journeys.jpg",
    description: "Heirloom cherry tomatoes, fresh basil oil on wood-fired sourdough.",
  },
];

interface PhoneMenuDemoProps {
  selectedDishId: string | null;
  onSelectDish: (dish: DemoDish) => void;
  cartCount: number;
  cartSubtotal: number;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  reducedMotion?: boolean;
}

export default function PhoneMenuDemo({
  selectedDishId,
  onSelectDish,
  cartCount,
  cartSubtotal,
  activeCategory,
  onCategoryChange,
  reducedMotion = false,
}: PhoneMenuDemoProps) {
  const categories = ["All", "Signature Bowls", "Mains", "Starters"];

  return (
    <div className="relative flex h-full w-full flex-col bg-[#fdfbf9] text-[#211714] overflow-hidden select-none">
      {/* Mini App Bar */}
      <div className="flex items-center justify-between border-b border-[#f0e7e1] px-4 py-2.5 bg-white/95 backdrop-blur-xs">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xs font-bold tracking-tight text-[#171717]">The Artisan Bistro</h3>
          </div>
          <p className="text-[10px] text-[#857169]">Digital Menu • Open for Orders</p>
        </div>
        <div className="rounded-full bg-[#f6eee9] px-2.5 py-1 text-[10px] font-semibold text-[#a13924]">
          DineSpace Menu
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-[#f3ece6] overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#211714] text-white shadow-xs"
                : "bg-white text-[#6b5850] hover:bg-[#f6eee9] border border-[#eee5df]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Cards List */}
      <div className="flex-1 overflow-y-auto px-3 py-2.5 space-y-2.5 no-scrollbar">
        {DEMO_DISHES.map((dish, idx) => {
          const isSelected = selectedDishId === dish.id;
          return (
            <motion.div
              key={dish.id}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onSelectDish(dish)}
              className={`group relative flex cursor-pointer gap-3 rounded-2xl border p-2.5 transition-all duration-200 ${
                isSelected
                  ? "border-[#a13924] bg-[#fbf5f2] shadow-[0_8px_20px_-8px_rgba(161,57,36,0.22)] ring-1 ring-[#a13924]"
                  : "border-[#eddcd5] bg-white hover:border-[#a13924]/60 hover:shadow-xs"
              }`}
            >
              {/* Dish Thumbnail */}
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#eee7df]">
                <Image
                  src={dish.image}
                  alt={dish.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="80px"
                />
                {dish.tag && (
                  <span className="absolute bottom-1 left-1 rounded-md bg-[#211714]/85 px-1.5 py-0.5 text-[8px] font-bold text-white backdrop-blur-xs">
                    {dish.tag}
                  </span>
                )}
              </div>

              {/* Dish Info */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold leading-snug text-[#1f1614] truncate">
                      {dish.name}
                    </h4>
                    <span className="text-xs font-bold text-[#a13924] shrink-0">
                      {dish.price} BDT
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-[10px] leading-relaxed text-[#735e56]">
                    {dish.description}
                  </p>
                </div>

                <div className="mt-1 flex items-center justify-between pt-1 border-t border-[#f2eae4]">
                  <span className="flex items-center gap-1 text-[9px] text-[#937f76]">
                    <Flame size={10} className="text-amber-600" />
                    {dish.calories}
                  </span>

                  <button
                    type="button"
                    aria-label={`Add ${dish.name} to bowl`}
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold transition-transform duration-150 active:scale-95 ${
                      isSelected
                        ? "bg-[#a13924] text-white shadow-xs"
                        : "bg-[#f5ebe5] text-[#842f1e] hover:bg-[#a13924] hover:text-white"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check size={11} strokeWidth={2.5} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={11} strokeWidth={2.5} />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      <div className="border-t border-[#f0e7e1] bg-white/95 px-3.5 py-2.5 backdrop-blur-xs">
        <motion.div
          animate={
            cartCount > 0
              ? { scale: [1, 1.03, 1] }
              : { scale: 1 }
          }
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between rounded-xl bg-[#211714] px-3.5 py-2 text-white shadow-md"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <ShoppingBag size={16} className="text-[#f5ded7]" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full bg-[#a13924] text-[9px] font-bold text-white shadow-xs"
                >
                  {cartCount}
                </motion.span>
              )}
            </div>
            <div>
              <p className="text-[11px] font-bold leading-tight">My Bowl ({cartCount})</p>
              <p className="text-[9px] text-[#e3cfc7]">Pick table at review</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">{cartSubtotal} BDT</span>
            <span className="rounded-lg bg-[#a13924] px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
              Review
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
