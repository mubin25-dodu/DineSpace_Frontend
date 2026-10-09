"use client"
import UsernavPhone, { UsernavDesktop } from "@/components/userComponents/usernav"
import { OrderItem, Restaurant } from "@/lib/interfaces/order";
import { useEffect, useState } from "react"
import { userContext } from "@/lib/context/Context";
import { Route, ShieldQuestionMark, Utensils } from "lucide-react";
import AlerPopup from "@/components/alertPopup";
import ServerError from "@/components/serverError";

export default function userlayout({ children }: { children: React.ReactNode }){
    const [popup, setPopup] = useState("");
    const [servererror , setservererror] = useState("");
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[]);

    const [myBowl , setbowl] = useState<OrderItem[] >([]);
    const [bowlHydrated, setBowlHydrated] = useState(false);

    const [activeLink, setActiveLink] = useState("home");
    const [navinfo, setNavinfo] = useState<{ icon1?: React.ReactNode; icon2?: React.ReactNode; title: string , goback?:boolean }>(
        { icon1: <Utensils color="#A13924" />, icon2: <ShieldQuestionMark />, title: "DineSpace" , goback:false}
    );

    useEffect(()=>{
        const storedBowl = localStorage.getItem("mybowl");

        if (storedBowl) {
            try {
                const parsedBowl = JSON.parse(storedBowl) as OrderItem[];
                setbowl(parsedBowl);
            } catch (error) {
                console.error("Error parsing stored bowl:", error);
            }
        }

        setBowlHydrated(true);
    }, []);

    useEffect(() => {  
        if (!bowlHydrated) return;
        localStorage.setItem("mybowl", JSON.stringify(myBowl));
    }, [bowlHydrated, myBowl]);

    return <div className="h-svh overflow-y-auto no-scrollbar">
    <userContext.Provider value={{setActiveLink, setNavinfo , setPopup , setservererror , setbowl , myBowl}}  >
   {windowWidth > 0 && windowWidth < 768 ? <UsernavPhone title={navinfo.title} icon1={navinfo.icon1} icon2={navinfo.icon2}  goback={navinfo.goback}/> :  <UsernavDesktop title={navinfo.title} icon1={navinfo.icon1} icon2={navinfo.icon2}  goback={navinfo.goback}/>}
    
    {popup && <AlerPopup setpopup={() => setPopup("")} Message={popup} />}
    {servererror && <ServerError error={servererror} setservererror={() => setservererror}  />}
   
    {windowWidth > 0 && windowWidth < 768 ? <main className="mb-22">{children}</main> : <main className="ml-80 mr-80">{children}</main>}
    
    </userContext.Provider>
    </div>
}