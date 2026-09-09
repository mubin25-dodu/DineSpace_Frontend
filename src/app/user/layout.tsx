"use client"
import Usernav from "@/components/userComponents/usernav"
import { Restaurant } from "@/lib/interfaces/order";
import { useState } from "react"
import { userContext } from "@/lib/context/Context";
import { ShieldQuestionMark, Utensils } from "lucide-react";
import AlerPopup from "@/components/alertPopup";
import ServerError from "@/components/serverError";

export default function userlayout({ children }: { children: React.ReactNode }){
    const [popup, setPopup] = useState("");
    const [servererror , setservererror] = useState("");
    
    const [activeLink, setActiveLink] = useState("home");
    const [navinfo, setNavinfo] = useState<{ icon1?: React.ReactNode; icon2?: React.ReactNode; title: string , goback?:boolean }>(
        { icon1: <Utensils color="#A13924" />, icon2: <ShieldQuestionMark />, title: "DineSpace" , goback:false}
    );
    const handleLinkClick = (link: string) => {
        setActiveLink(link);
    };
    return <div className="h-svh overflow-y-auto no-scrollbar">
    <userContext.Provider value={{setActiveLink, setNavinfo , setPopup , setservererror}}  >
    <Usernav title={navinfo.title} icon1={navinfo.icon1} icon2={navinfo.icon2}  goback={navinfo.goback}/>
    <div className="">
    {popup && <AlerPopup setpopup={() => setPopup("")} Message={popup} />}
    {servererror && <ServerError error={servererror} setservererror={() => setservererror}  />}
    </div>   
    <main>{children}</main>
    </userContext.Provider>
    </div>
}