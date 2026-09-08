"use client"
import Usernav from "@/components/userComponents/usernav"
import { Restaurant } from "@/lib/interfaces/order";
import { useState } from "react"
import { userContext } from "@/lib/context/Context";

export default function userlayout({ children }: { children: React.ReactNode }){
    const [activeLink, setActiveLink] = useState("home");
    const handleLinkClick = (link: string) => {
        setActiveLink(link);
    };
    const [resturants , setresturants] = useState<Restaurant[]>([]);
    return <div className="h-svh overflow-y-auto no-scrollbar">
    <userContext.Provider value={{setActiveLink}}  >
    <Usernav activeLink={activeLink} />
    <main>{children}</main>
    </userContext.Provider>
    </div>
}