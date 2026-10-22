"use client";

import { restaurantContext } from "@/lib/context/Context";
import { useContext } from "react";
import { ChevronDown, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Store, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface RestaurantNavProps {
    handleDefaultRestaurant: (id: string) => void;
    socConnect: boolean;
    sidebarCollapsed: boolean;
    mobileNavOpen: boolean;
    onToggleSidebar: () => void;
    onToggleMobileNav: () => void;
}

export default function RestaurantNav({
    handleDefaultRestaurant,
    socConnect,
    sidebarCollapsed,
    mobileNavOpen,
    onToggleSidebar,
    onToggleMobileNav,
}: RestaurantNavProps) {
    const { restaurants, defaultRestaurant: defaultRestaurantId } = useContext(restaurantContext);
    const router = useRouter();
    const defaultRestaurant = restaurants?.find((restaurant) => restaurant.id === defaultRestaurantId)
        ?? { id: defaultRestaurantId, resturantName: "No restaurant found" };

    const handleRestaurantChange = (id: string) => {
        const selectedRestaurant = restaurants?.find((restaurant) => restaurant.id === id);
        if (!selectedRestaurant) return;

        localStorage.setItem("defaultres", JSON.stringify(selectedRestaurant));
        handleDefaultRestaurant(selectedRestaurant.id);
    };

    const handleLogout = () => {
        document.cookie = "accesstoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        router.replace("/auth");
    };

    return (
        <header
            className={`fixed left-0 right-0 top-0 z-30 flex h-[76px] items-center gap-3 border-b border-[#E7D9D2] bg-[#FBF9F6] px-3 shadow-[0_4px_18px_rgb(47,39,36,0.04)] sm:px-5 ${
                sidebarCollapsed ? "md:left-20" : "md:left-64"
            }`}
        >
            <button
                type="button"
                onClick={onToggleMobileNav}
                aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileNavOpen}
                aria-controls="owner-sidebar"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E7D9D2] bg-white text-[#584840] shadow-sm transition hover:border-[#C77A6A] hover:text-[#A13924] focus:outline-none focus:ring-2 focus:ring-[#A13924]/20 md:hidden"
            >
                {mobileNavOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
            <button
                type="button"
                onClick={onToggleSidebar}
                aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!sidebarCollapsed}
                aria-controls="owner-sidebar"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-[#E7D9D2] bg-white text-[#584840] shadow-sm transition hover:border-[#C77A6A] hover:text-[#A13924] focus:outline-none focus:ring-2 focus:ring-[#A13924]/20 md:inline-flex"
            >
                {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>
            <div className="flex min-w-0 flex-col gap-0.5">
                <label htmlFor="restaurant-name" className="hidden text-[9px] font-bold uppercase tracking-[0.17em] text-[#9A8880] sm:block">
                    Managing restaurant
                </label>
                <span className="relative block min-w-0">
                    <Store className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A13924]" size={16} aria-hidden="true" />
                    <select
                        name="restaurantName"
                        className="h-10 w-[min(52vw,15rem)] appearance-none rounded-xl border border-[#E7D9D2] bg-white pl-9 pr-9 text-xs font-bold tracking-wide text-[#514947] shadow-sm outline-none transition hover:border-[#C77A6A] focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/15 sm:w-56 sm:text-sm"
                        value={defaultRestaurant.id}
                        onChange={(event) => handleRestaurantChange(event.target.value)}
                        id="restaurant-name"
                    >
                        <option value={defaultRestaurant.id}>{defaultRestaurant.resturantName ?? "No restaurant found"}</option>
                        {restaurants?.filter((restaurant) => restaurant.id !== defaultRestaurant.id).map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.resturantName ?? "Unnamed restaurant"}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A13924]" size={16} />
                </span>
            </div>
            <span
                role="status"
                aria-live="polite"
                className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1.5 text-[11px] font-bold tracking-wide sm:px-3 sm:text-xs ${
                    socConnect
                        ? "border-[#B9E8C8] bg-[#ECFAF0] text-[#168044]"
                        : "border-[#F1C4BE] bg-[#FFF0EE] text-[#B42318]"
                }`}
            >
                <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${
                        socConnect ? "bg-[#22A05A] shadow-[0_0_0_3px_rgba(34,160,90,0.15)]" : "bg-[#D0443E]"
                    }`}
                />
                <span className="hidden sm:inline">{socConnect ? "You are live" : "You are offline"}</span>
                <span className="sm:hidden">{socConnect ? "Live" : "Offline"}</span>
            </span>
            <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#E7D9D2] bg-white px-3 py-2 text-sm font-bold text-[#A13924] shadow-sm transition hover:border-[#A13924] hover:bg-[#F5F3F0] focus:outline-none focus:ring-2 focus:ring-[#A13924]/20"
            >
                <LogOut size={18} aria-hidden="true" />
                <span className="hidden sm:inline">Log out</span>
            </button>
        </header>
    );
}
