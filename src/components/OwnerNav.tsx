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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RestaurantNav from "./RestaurantNav";
import { motion } from "framer-motion";
import { useContext, useRef } from "react";
import { restaurantContext } from "@/lib/context/Context";
import DinespaceLogo from "./DinespaceLogo";

interface OwnerNavProps {
    handleDefaultRestaurant: (id:string)=> void;
    socConnect:boolean;
};

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

export default function OwnerNav({ handleDefaultRestaurant , socConnect}: OwnerNavProps) {
    const pathname = usePathname();
    const {defaultRestaurant} = useContext(restaurantContext)
    const constraintsRef = useRef<HTMLDivElement>(null);

    return <>
    <RestaurantNav handleDefaultRestaurant={handleDefaultRestaurant} socConnect ={socConnect} />
    <div className="fixed left-0 top-0 z-30 flex h-full min-w-50 w-[14%] flex-col items-start gap-2 border-r-2 border-[#DEC0BA] bg-[#F5F3F0] p-7 font-semibold text-[#646468]" >
    <div className="ml-2 mb-10"> <DinespaceLogo/></div> 

    {navItems.map((item ,index)=><motion.span key={item.href} className="w-full" initial={{ x: index !== 0 ? -220 * index : -200}} animate={{  x: 0 }} transition={{ delay: 0.1 * index, duration: 0.45 ,type:"spring" }}><Link
        href={item.href}
        type="button"
        className={`${(item.href === "/home" ? pathname === item.href : pathname.startsWith(item.href)) ? "bg-[#EAE8E5] border-r-5 border-[#A13924] text-[#A13924] ml-2" : ""} hover:bg-[#EAE8E5] rounded hover:border-r-5 hover:border-[#A13924] hover:text-[#A13924] hover:ml-2 w-full p-2 h-auto transition-all duration-200 flex flex-row gap-2 items-center cursor-pointer`}
    > <item.icon size={20} strokeWidth={2} aria-hidden="true" /> {item.name}</Link></motion.span>
    )}

        {!pathname.includes("home/orders") ? <div ref={constraintsRef} className="pointer-events-none fixed inset-0 z-40">
        <motion.button
            // href={`../user/Restaurant/${defaultRestaurant}`}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.15}
            // dragMomentum={false}
            // dragTransition={{ bounceStiffness: 500, bounceDamping: 20 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 , type:"spring" }}
            onDoubleClick={() =>window.location.href=`../user/Restaurant/${defaultRestaurant}` }
            className="pointer-events-auto absolute bottom-[calc(3.75rem+max(0.75rem,env(safe-area-inset-bottom)))] right-4 flex h-fit p-2 mb-1 min-w-16 items-center justify-center rounded-full bg-[#A13924] px-4 text-sm font-bold text-white shadow-lg sm:text-base md:bottom-4"
            title="Double click to place order"
        >
            Place an order
        </motion.button></div>:""}
    </div>
    </>

}