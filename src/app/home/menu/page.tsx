"use client";

import CountUp from "@/components/countUp/countUp";
import LatticeLoader from "@/components/LatticeLoader/LetticalLoader";
import MenuCard from "@/components/MenuCard";
import { api } from "@/lib/api/axios";
import { restaurantContext } from "@/lib/context/Context";
import { MenuItem } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { ArrowUpDown, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";


type AvailabilityFilter = "all" | "available" | "unavailable";
type PriceSort = "none" | "ascending" | "descending";

async function fetchMenu(restaurantId: string) {
  const { data } = await api.get<Result<MenuItem[]>>(
    `/menu/GetMenu/${restaurantId}`,
  );
  return data;
}

export default function MenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] =
    useState<AvailabilityFilter>("all");
  const [priceSort, setPriceSort] = useState<PriceSort>("none");
  const { defaultRestaurant, setpopup } = useContext(restaurantContext);
  const [loadedRestaurantId, setLoadedRestaurantId] = useState<string | null>(
    null,
  );

  const callmenuapi = useCallback(async () => {
    if (!defaultRestaurant) return;

    try {
      const data = await fetchMenu(defaultRestaurant);
      if (data.Success) {
        setMenu(data.Data ?? []);
      } else {
        setMenu([]);
        setpopup(data.Message || "Unable to load menu items.");
      }
      setLoadedRestaurantId(defaultRestaurant);
    } catch (error) {
      console.error("Menu items could not be loaded:", error);
      setMenu([]);
      setLoadedRestaurantId(defaultRestaurant);
      setpopup("Unable to load menu items.");
    }
  }, [defaultRestaurant, setpopup]);

  useEffect(() => {
    const restaurantId = defaultRestaurant;
    if (!restaurantId) return;

    let active = true;
    const loadMenu = async () => {
      try {
        const data = await fetchMenu(restaurantId);
        if (!active) return;
        if (data.Success) {
          setMenu(data.Data ?? []);
        } else {
          setMenu([]);
          setpopup(data.Message || "Unable to load menu items.");
        }
        setLoadedRestaurantId(restaurantId);
      } catch (error) {
        if (!active) return;
        console.error("Menu items could not be loaded:", error);
        setMenu([]);
        setLoadedRestaurantId(restaurantId);
        setpopup("Unable to load menu items.");
      }
    };

    void loadMenu();
    return () => {
      active = false;
    };
  }, [defaultRestaurant, setpopup]);

  const currentMenu = useMemo(
    () =>
      defaultRestaurant && loadedRestaurantId === defaultRestaurant
        ? menu
        : [],
    [defaultRestaurant, loadedRestaurantId, menu],
  );
  const loading = Boolean(
    defaultRestaurant && loadedRestaurantId !== defaultRestaurant,
  );

  const categories = useMemo(
    () =>
      [...new Set(currentMenu.map((item) => item.catagory).filter(Boolean))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [currentMenu],
  );

  const visibleMenu = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const filtered = currentMenu.filter((item) => {
      const matchesSearch = [
        item.itemName,
        item.catagory,
        item.description,
      ].some((value) => value?.toLowerCase().includes(query));
      const matchesCategory =
        selectedCategory === "All" || item.catagory === selectedCategory;
      const matchesAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available"
          ? Boolean(item.isAvailable)
          : !item.isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });

    if (priceSort === "ascending") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (priceSort === "descending") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [availabilityFilter, currentMenu, priceSort, searchTerm, selectedCategory]);

  const toggleAvailable = async (available: boolean, id: string) => {
    const previousAvailability = menu.find((item) => item.id === id)?.isAvailable;
    setMenu((current) =>
      current.map((item) =>
        item.id === id ? { ...item, isAvailable: available } : item,
      ),
    );

    try {
      const { data } = await api.get<Result<unknown>>(
        `menu/toggleAvailabel/${id}`,
      );
      if (!data.Success) {
        throw new Error(data.Message || "Unable to update availability.");
      }
    } catch (error) {
      console.error("Menu item availability could not be updated:", error);
      setpopup("Unable to update menu item availability.");
      setMenu((current) =>
        current.map((item) =>
          item.id === id
            ? { ...item, isAvailable: previousAvailability }
            : item,
        ),
      );
    }
  };

  const deleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    setMenu((current) => current.filter((item) => item.id !== id));
    try {
      const { data } = await api.delete<Result<unknown>>(
        `menu/DeleteMenuItem/${id}`,
      );
      if (!data.Success) {
        setpopup(data.Message || "Unable to delete menu item.");
        await callmenuapi();
      }
    } catch (error) {
      console.error("Menu item could not be deleted:", error);
      setpopup("Unable to delete menu item.");
      await callmenuapi();
    }
  };

  const advancePriceSort = () => {
    setPriceSort((current) =>
      current === "none"
        ? "ascending"
        : current === "ascending"
          ? "descending"
          : "none",
    );
  };

  const availabilityOptions: {
    label: string;
    value: AvailabilityFilter;
    count: number;
  }[] = [
    { label: "All", value: "all", count: currentMenu.length },
    {
      label: "Available",
      value: "available",
      count: currentMenu.filter((item) => item.isAvailable).length,
    },
    {
      label: "Unavailable",
      value: "unavailable",
      count: currentMenu.filter((item) => !item.isAvailable).length,
    },
  ];

  return (
    <main className="mt-5 pr-5">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold text-[#28211e]">
            Menu Management
          </h1>
          <p className="text-gray-600">
            Organize categories, update pricing, and manage availability.
          </p>
        </div>
        <Link
          href="menu/addMenu"
          className="flex h-fit w-fit items-center gap-2 rounded-[10px] bg-[#A13924] p-2 text-white transition-colors hover:bg-[#812d1d]"
        >
          <Plus strokeWidth={3} size={20} />
          Add Menu Item
        </Link>
      </div>

      <section
        aria-label="Menu filters"
        className="mb-5 rounded-xl border border-[#dec0ba] bg-white p-4"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-sm">
            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7168]"
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search menu items..."
              aria-label="Search menu items"
              className="w-full rounded-lg border border-[#dec0ba] bg-white py-2 pl-10 pr-3 text-sm text-[#28211e] outline-none transition placeholder:text-[#a58d85] focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/15"
            />
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex max-w-full overflow-x-auto rounded-lg bg-[#F5F3F0] p-1"
              role="group"
              aria-label="Filter by availability"
            >
              {availabilityOptions.map((option) => {
                const selected = availabilityFilter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setAvailabilityFilter(option.value)}
                    className={`shrink-0 rounded-md px-3 py-1.5 text-xs transition-colors ${
                      selected
                        ? "bg-white font-semibold text-[#A13924] shadow-sm"
                        : "text-[#646468] hover:text-[#A13924]"
                    }`}
                  >
                    {option.label}{" "}
                    <span className="ml-1 text-[#A13924]">
                      ({option.count})
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={advancePriceSort}
              aria-label={`Price sort: ${priceSort}`}
              className="inline-flex items-center gap-2 rounded-lg border border-[#dec0ba] px-3 py-2 text-sm text-[#654f48] transition-colors hover:border-[#A13924] hover:text-[#A13924]"
            >
              <ArrowUpDown size={16} />
              {priceSort === "ascending"
                ? "Price: low to high"
                : priceSort === "descending"
                  ? "Price: high to low"
                  : "Sort by price"}
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#8b7168]">
            Categories
          </div>
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label="Filter by category"
          >
            {["All", ...categories].map((category) => {
              const selected = selectedCategory === category;
              const count =
                category === "All"
                  ? currentMenu.length
                  : currentMenu.filter((item) => item.catagory === category)
                      .length;
              return (
                <motion.button initial={{x:-20}}
                  whileInView={{x:0}}
                  whileHover={{scale:1.02}}
                  whileTap={{scale:0.95}}
                  transition={{duration:0.8 , type:"spring"}}
                  key={category}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    selected
                      ? "border-[#A13924] bg-[#A13924] text-white"
                      : "border-[#dec0ba] bg-white text-[#654f48] hover:border-[#A13924] hover:text-[#A13924]"
                  }`}
                >
                  {category}
                  <span
                    className={
                      selected
                        ? "ml-1.5 text-white/80"
                        : "ml-1.5 text-[#8b7168]"
                    }
                  >
                    {count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#dec0ba] bg-[#fff8f5] px-3 py-1.5 text-sm font-medium text-[#654f48]">
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#A13924] px-1.5 text-xs font-bold text-white">
            <CountUp from={0} to={visibleMenu.length} />
          </span>
          {visibleMenu.length === 1 ? "menu item" : "menu items"} found
        </div>
      </section>

      {loading ? (
        <div className="flex min-h-72 items-center justify-center rounded-xl border border-[#dec0ba] bg-white">
          <LatticeLoader
            status="working"
            label="Loading Menu Items"
            doneLabel="Done in"
            errorLabel="Failed after"
            pattern="arrow"
            grid={3}
            shape="round"
            doneColor="#22c55e"
            errorColor="#ef4444"
            cellSize={6}
            gap={2}
            fontSize={14}
            step={90}
            idleOpacity={0.15}
            glow={false}
            glowColor="#f5f5f5"
            showTimer
            color="#A13924"
          />
        </div>
      ) : visibleMenu.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 pb-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleMenu.map((item, index) => (
            <MenuCard
              key={item.id}
              item={item}
              index={index}
              onAvailabilityChange={toggleAvailable}
              onDelete={deleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#dec0ba] bg-white px-5 py-14 text-center">
          <h2 className="text-lg font-semibold text-[#28211e]">
            {currentMenu.length === 0
              ? "No menu items yet"
              : "No matching menu items"}
          </h2>
          <p className="mt-1 text-sm text-[#654f48]">
            {currentMenu.length === 0
              ? "Add an item to start building your restaurant menu."
              : "Try adjusting your search or filters."}
          </p>
        </div>
      )}
    </main>
  );
}
