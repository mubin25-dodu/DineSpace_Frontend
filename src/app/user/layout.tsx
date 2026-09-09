"use client"
import Usernav from "@/components/userComponents/usernav"
import { OrderItem, Restaurant } from "@/lib/interfaces/order";
import { useEffect, useState } from "react"
import { userContext } from "@/lib/context/Context";
import { Route, ShieldQuestionMark, Utensils } from "lucide-react";
import AlerPopup from "@/components/alertPopup";
import ServerError from "@/components/serverError";

export default function userlayout({ children }: { children: React.ReactNode }){
    const [popup, setPopup] = useState("");
    const [servererror , setservererror] = useState("");

    const [myBowl , setbowl] = useState<OrderItem[] >([]);

    const [activeLink, setActiveLink] = useState("home");
    const [navinfo, setNavinfo] = useState<{ icon1?: React.ReactNode; icon2?: React.ReactNode; title: string , goback?:boolean }>(
        { icon1: <Utensils color="#A13924" />, icon2: <ShieldQuestionMark />, title: "DineSpace" , goback:false}
    );

    const getlocal =()=>{
         if(myBowl.length === 0){
            const storedBowl = localStorage.getItem("mybowl");
             if (!storedBowl) return ;
             try {
                const parsedBowl = JSON.parse(storedBowl) as OrderItem[];
                setbowl(parsedBowl);
             } catch (error) {
                console.error("Error parsing stored bowl:", error);
             }
        }
    }    
    useEffect(()=>{
        getlocal();
    },[])    
    useEffect(() => {  
        localStorage.setItem("mybowl", JSON.stringify(myBowl));
    }, [myBowl]);


    return <div className="h-svh overflow-y-auto no-scrollbar">
    <userContext.Provider value={{setActiveLink, setNavinfo , setPopup , setservererror , setbowl , myBowl}}  >
    <Usernav title={navinfo.title} icon1={navinfo.icon1} icon2={navinfo.icon2}  goback={navinfo.goback}/>
    {popup && <AlerPopup setpopup={() => setPopup("")} Message={popup} />}
    {servererror && <ServerError error={servererror} setservererror={() => setservererror}  />}
   
    <main className="mb-22">{children}</main>
    </userContext.Provider>
    </div>
}