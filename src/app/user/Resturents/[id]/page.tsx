"use client"
import { api } from "@/lib/api/axios";
import Image from "next/image";
import { userContext } from "@/lib/context/Context";
import { MenuItem, OrderTable, Restaurant } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {  MapPinCheckInside } from "lucide-react";

export default function(params:{id:string}){
    const param = useParams<{ id: string }>();
    const {setNavinfo , setservererror} = useContext(userContext);
    const [catbtn, setcatbtn]= useState("all");
    const [cat , setcat]= useState<Set<string>>(new Set);

    const [resturent, setResturent] = useState<Restaurant | null>(null);

    useEffect(()=>{
        if(!resturent){return}
        const cats = new Set(resturent.menu.map(e=>e.catagory));
        setcat(cats)
        console.log(cats);   
        // console.log("catagories")

    },[resturent]);

    useEffect(()=>{
        setNavinfo({title:"Resturent" , goback:true});
        const getresturent = async () => {
            if (!param.id) return;

            try {
                const {data} = await api.get<Result<Restaurant>>(`resturant/getResturentById/${param.id}`);
                if (data?.Success && data.Data) {
                    setResturent(data.Data);
                    setNavinfo({title:data.Data.resturantName ?? "Resturent" , goback:true});
                console.log(data)
                }
            } catch (e) {
                console.error(e);
            }
        };

        void getresturent();
    }, [param.id, setNavinfo]);

    const handlemenucatagory =(cat:string)=>{
        console.log(cat);
        setcatbtn(cat);
    }
    return(
        <>
        {
        resturent? <div className="flex flex-col">
            <Image src={resturent.coverFile?.Path?encodeURI((resturent.coverFile?.Path?.replace(/\\/g, "/")).startsWith("http")
            ? resturent.coverFile?.Path?.replace(/\\/g, "/")
            : `${api.defaults.baseURL?.replace(/\/$/, "")}/${resturent.coverFile?.Path?.replace(/\\/g, "/").replace(/^\//, "")}`) : "/broken_resturant_cover.png"} width={1000} height={1000} alt="cover"></Image>
            <div className="bg-[#FBF9F6] flex flex-col  rounded-[20px_20px_0px_0px] mt-[-5%] min-h-[70vh] border border-[#c9c9c9]">
                <span className="text-2xl font-bold text-[#A13924] mt-5 ml-5 flex items-center gap-3">
                 <Image className="w-30 h-30 mt-[-15%] shadow inset-shadow-zinc-950 rounded-2xl ml-5 object-fit" src={resturent.logoFile?.Path
                ? encodeURI((resturent.logoFile?.Path?.replace(/\\/g, "/")).startsWith("http")
                ? resturent.logoFile?.Path?.replace(/\\/g, "/")
                : `${api.defaults.baseURL?.replace(/\/$/, "")}/${resturent.logoFile?.Path?.replace(/\\/g, "/").replace(/^\//, "")}`) : "/broken_resturant__logo.png"} width={1000} height={1000} alt="cover"></Image>
                {resturent.resturantName.toUpperCase()}
            </span>
            <div className="p-5 flex flex-row itemcenter gap-1 justify-items-start">
                <MapPinCheckInside/>
                <p className="text-black">{resturent.address}</p>
            </div>
                <p className=" p-3 text-[#A13924] font-bold">Checkout the menu</p>
                <hr className="  border-[#97756f] w-full " />
                
                <div className="flex min-w-0 flex-row flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory no-scrollbar">
                    <button className = {`m-2 shrink-0 whitespace-nowrap rounded-3xl border pl-3 pr-3 pt-1 pb-1 ${catbtn == "all" ? "bg-[#A13924] text-white" :" bg-[#F5F3F0] border border-[#DEC0BA]"}`} onClick={()=>handlemenucatagory("all")}>All items</button>
                    {Array.from(cat).map((val) => (
                        <button
                            key={val}
                            className={`m-2 shrink-0 whitespace-nowrap rounded-3xl border pl-3 pr-3 pt-1 pb-1 ${catbtn === val ? "bg-[#A13924] text-white" : "bg-[#F5F3F0] border border-[#DEC0BA]"}`}
                            onClick={() => handlemenucatagory(val)} >
                            {val}
                        </button>
                    ))}
                </div>
            </div>
        </div> : "<UsersLoading time={2000}/>"}

        </>
    )
}

export function Ordercard({item}:{item:MenuItem}){

    return(
        <>
        dsd asd as
        </>
    )

}