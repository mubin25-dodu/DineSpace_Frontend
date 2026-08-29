"use client";

import { LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ResturantNav from "./ResturantNav";

interface OwnerNavProps {
    handleDefaultResturant: (id:string)=> void;
};

const navItems = [
    { name: "Overview", href: "/home" , icon: <LayoutDashboard /> },
    { name: "Orders", href: "/home/orders" },
    { name: "Booking", href: "/home/bookings" },
    { name: "Menu", href: "/home/menu" },
    { name: "Tables", href: "/home/tables" },
    { name: "Restaurants", href: "/home/restaurants" },
    { name: "Payment", href: "/home/payments" },
    { name: "Wallet", href: "/home/wallet" },
    { name: "Notification", href: "/home/notifications" },
];

export default function OwnerNav({ handleDefaultResturant }: OwnerNavProps) {
    const pathname = usePathname();

    return <>
    <ResturantNav handleDefaultResturant={handleDefaultResturant} />
    <div className="bg-[#F5F3F0] font-semibold text-[#646468] border-r-2 border-[#DEC0BA] flex flex-col gap-2 items-start min-w-50 w-[14%] h-full p-7 fixed" >
    <div> <Image src="/Header_margin.svg" alt="logo" className="ml-7 mt-5 scale-140 " width={2000} height={10000} quality={100}/></div> 

    {navItems.map((item, index)=><Link
        key={item.href}
        href={item.href}
        type="button"
        className={`${(item.href === "/home" ? pathname === item.href : pathname.startsWith(item.href)) ? "bg-[#EAE8E5] border-r-5 border-[#A13924] text-[#A13924] ml-2" : ""} hover:bg-[#EAE8E5] rounded hover:border-r-5 hover:border-[#A13924] hover:text-[#A13924] hover:ml-2 w-full p-2 h-auto transition-all duration-200 flex flex-row gap-2 items-center cursor-pointer`}
    > {item.icon} {item.name}</Link>
    )}
    </div>
    </>

}