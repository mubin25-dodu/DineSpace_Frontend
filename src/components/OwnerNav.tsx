"use client";

import { LayoutDashboard } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ResturantNav from "./ResturantNav";

interface OwnerNavProps {
    activeItem: string;
    setActiveItem: (item: string) => void;
    handleDefaultResturant: (id:string)=> void;
};

export default function OwnerNav({ activeItem, setActiveItem , handleDefaultResturant }: OwnerNavProps) {

    const navtems = ["Overview" , "Orders" , "Booking" , "Menu" , "Tables" , "Resturants" , "Payment" , "Wallet" , "Notification" ]
    const icons = [<LayoutDashboard />]

    return <>
    <ResturantNav handleDefaultResturant={handleDefaultResturant} />
    <div className="bg-[#F5F3F0] font-semibold text-[#646468] border-r-2 border-[#DEC0BA] flex flex-col gap-2 items-start min-w-50 w-[14%] h-full p-7 fixed" >
    <div> <Image src="/Header_margin.svg" alt="logo" className="ml-7 mt-5 scale-140 " width={2000} height={10000} quality={100}/></div> 

    {navtems.map((e , i)=><button
        key={e}
        type="button"
        onClick={() => setActiveItem(e)}
        className={`${activeItem === e ? "bg-[#EAE8E5] border-r-5 border-[#A13924] text-[#A13924] ml-2" : ""} hover:bg-[#EAE8E5] rounded hover:border-r-5 hover:border-[#A13924] hover:text-[#A13924] hover:ml-2 w-full p-2 h-auto transition-all duration-200 flex flex-row gap-2 items-center cursor-pointer`}
    > {icons[i]} {e}</button>
    )}
    </div>
    </>

}