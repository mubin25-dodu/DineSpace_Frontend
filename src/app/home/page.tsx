"use client"
import OwnerNav from "@/components/OwnerNav"
import Overview from "@/components/Overview"
import { createContext, useContext, useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";
import { api } from "@/lib/axios";
import Result from "@/lib/Result";
import { resturantContext } from "@/lib/context/Context";

export default function Home() {
    const [activeItem, setActiveItem] = useState("Overview");
    const [defaultResturant, setdefaultResturant] = useState<string>("");
    
    const getuserdata = async ()=>{
    try{
        const {data} = await api.get<Result>("/user/Getme");
        // console.log(data);
        if(data.Success && data.Data.resturants ){
            const resIds = data.Data.resturants && data.Data.resturants.map((e) => ({id:e.id , resturantName:e.resturantName}));
            console.log("ids")
            console.log(resIds);
            localStorage.setItem("resids",JSON.stringify(resIds));
            const defaultres = localStorage.getItem("defaultres");
            console.log(defaultres);
            if(defaultres === null){
                console.log("no default resturants" );
                console.log(data.Date);
                localStorage.setItem("defaultres" , JSON.stringify({resturantName:data.Data.resturants[0].resturantName , id:data.Data.resturants[0].id}));
            }
        }
    }catch(e){console.error(e)}
    }

    function handleDefaultResturant(id:any){
        console.log("resturant id - " +id);
        setdefaultResturant(id);
    }

   useEffect(()=>{
    console.log("Default resturant in homepage check")
    console.log(defaultResturant);
    getuserdata();

   },[])

    const components = [
        {Name:"Overview",Component:<Overview />},
        {Name:"Orders" , Component: <PageLoader time={2202} load={true}/>}
    ]
    const activeComponent = components.find(e => e.Name === activeItem)?.Component;
    
  
    return <>
     <OwnerNav activeItem={activeItem} setActiveItem={setActiveItem} handleDefaultResturant={handleDefaultResturant}/>
    <resturantContext.Provider value={defaultResturant}>
     {activeComponent ?? <div className="text-[50px] text-[#A13924] mt-[20%] ml-[45%]">Coming soon...</div>}
    </resturantContext.Provider>

    </>
}

