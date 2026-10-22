"use client";

import {
    Bell,
    CalendarDays,
    ClipboardList,
    CreditCard,
    LayoutDashboard,
    Store,
    Table2,
    Utensils,
    Wallet,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { restaurantContext } from "@/lib/context/Context";
import DinespaceLogo from "./DinespaceLogo";
import RestaurantNav from "./RestaurantNav";

interface OwnerNavProps {
    handleDefaultRestaurant: (id: string) => void;
    socConnect: boolean;
    sidebarCollapsed: boolean;
    mobileNavOpen: boolean;
    onToggleSidebar: () => void;
    onToggleMobileNav: () => void;
    onCloseMobileNav: () => void;
}

const navItems = [
    { name: "Overview", href: "/home", icon: LayoutDashboard },
    { name: "Orders", href: "/home/orders", icon: ClipboardList },
    { name: "Booking", href: "/home/bookings", icon: CalendarDays },
    { name: "Menu", href: "/home/menu", icon: Utensils },
    { name: "Tables", href: "/home/tables", icon: Table2 },
    { name: "Restaurants", href: "/home/restaurants", icon: Store },
    { name: "Payment", href: "/home/payments", icon: CreditCard },
    { name: "Wallet", href: "/home/wallet", icon: Wallet },
    { name: "Notification", href: "/home/notifications", icon: Bell },
];

export default function OwnerNav({
    handleDefaultRestaurant,
    socConnect,
    sidebarCollapsed,
    mobileNavOpen,
    onToggleSidebar,
    onToggleMobileNav,
    onCloseMobileNav,
}: OwnerNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { defaultRestaurant } = useContext(restaurantContext);
    const constraintsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mobileNavOpen) return;

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onCloseMobileNav();
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [mobileNavOpen, onCloseMobileNav]);

    return (
        <>
            <RestaurantNav
                handleDefaultRestaurant={handleDefaultRestaurant}
                socConnect={socConnect}
                sidebarCollapsed={sidebarCollapsed}
                mobileNavOpen={mobileNavOpen}
                onToggleSidebar={onToggleSidebar}
                onToggleMobileNav={onToggleMobileNav}
            />
            {mobileNavOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    onClick={onCloseMobileNav}
                    className="fixed inset-0 z-40 bg-[#2F2724]/35 backdrop-blur-[1px] md:hidden"
                />
            )}
            <aside
                id="owner-sidebar"
                aria-label="Restaurant navigation"
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#E7D9D2] bg-[#FBF9F6] px-3 pb-5 pt-5 font-semibold text-[#64534D] shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-[width,transform] duration-200 md:px-4 md:translate-x-0 ${
                    sidebarCollapsed ? "md:w-20" : "md:w-64"
                } ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className={`mb-8 flex h-11 items-center justify-between ${sidebarCollapsed ? "md:justify-center" : "px-1"}`}>
                    <div className={sidebarCollapsed ? "md:hidden" : ""}>
                        <DinespaceLogo />
                    </div>
                    <Link
                        href="/"
                        aria-label="DineSpace home"
                        title="DineSpace"
                        className={`hidden size-10 shrink-0 items-center justify-center rounded-xl bg-[#A13924] text-white ${
                            sidebarCollapsed ? "md:flex" : ""
                        }`}
                    >
                        <Utensils size={19} aria-hidden="true" />
                    </Link>
                    <button
                        type="button"
                        onClick={onCloseMobileNav}
                        aria-label="Close navigation menu"
                        className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#E7D9D2] bg-white text-[#584840] hover:text-[#A13924] focus:outline-none focus:ring-2 focus:ring-[#A13924]/20 md:hidden"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>
                <p className={`mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9A8880] ${sidebarCollapsed ? "md:hidden" : ""}`}>
                    Workspace
                </p>

                <nav className="flex w-full flex-col gap-1">
                    {navItems.map((item, index) => {
                        const isActive = item.href === "/home" ? pathname === item.href : pathname.startsWith(item.href);

                        return (
                            <motion.span
                                key={item.href}
                                className="w-full"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.025 * index, duration: 0.2 }}
                            >
                                <Link
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    title={sidebarCollapsed ? item.name : undefined}
                                    onClick={onCloseMobileNav}
                                    className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
                                        sidebarCollapsed ? "md:justify-center md:px-0" : ""
                                    } ${
                                        isActive
                                            ? "bg-[#F3E8E2] text-[#A13924] shadow-sm"
                                            : "text-[#64534D] hover:bg-[#F3EDE8] hover:text-[#A13924]"
                                    }`}
                                >
                                    <item.icon size={19} strokeWidth={2} aria-hidden="true" />
                                    <span className={sidebarCollapsed ? "md:hidden" : ""}>{item.name}</span>
                                    {isActive && <span className="ml-auto size-1.5 rounded-full bg-[#A13924] md:hidden" />}
                                </Link>
                            </motion.span>
                        );
                    })}
                </nav>

            </aside>
            {!pathname.includes("home/orders") && (
                    <div ref={constraintsRef} className={`pointer-events-none fixed inset-0 z-[60] ${mobileNavOpen ? "max-md:hidden" : ""}`}>
                        <motion.button
                            drag
                            dragConstraints={constraintsRef}
                            dragElastic={0.15}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5, type: "spring" }}
                            onDoubleClick={() => router.push(`/user/Restaurant/${defaultRestaurant}`)}
                            className="pointer-events-auto absolute bottom-[calc(3.75rem+max(0.75rem,env(safe-area-inset-bottom)))] right-4 mb-1 flex h-fit min-w-16 items-center justify-center rounded-full bg-[#A13924] p-2 px-4 text-sm font-bold text-white shadow-lg sm:text-base md:bottom-4"
                            title="Double click to place order"
                        >
                            Place an order
                        </motion.button>
                    </div>
                )}
        </>
    );
}
