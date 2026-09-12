"use client"
import { api } from "@/lib/api/axios";
import Image from "next/image";
import { userContext } from "@/lib/context/Context";
import { MenuItem, OrderItem, Restaurant } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {  Delete, MapPinCheckInside, Minus, Plus, Trash } from "lucide-react";
import Link from "next/link";
import UsersLoading from "@/components/userComponents/Loading";

export default function Resturants(params:{id:string}){
    const param = useParams<{ id: string }>();
    const {setNavinfo , setservererror , myBowl , setbowl } = useContext(userContext);
    const [catbtn, setcatbtn]= useState("all");
    const [cat, setcat] = useState<string[]>([]);
    const [resturent, setResturent] = useState<Restaurant | null>(null);
    const [nextTotal, setnextTotal] = useState(0);
    

    useEffect(()=>{
        if(!resturent){return}
        const cats = Array.from(new Set(resturent.menu.filter((e)=> e.isAvailable).map(e=>e.catagory)));
        setcat(cats);

    },[resturent]);

    useEffect(()=>{
       
        const getresturent = async () => {
            if (!param.id) return;

            try {
                const {data} = await api.get<Result<Restaurant>>(`resturant/getResturentById/${param.id}`);
                if (data?.Success && data.Data) {
                    setResturent(data.Data);
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
    
   
    useEffect(()=>{
         const Total = myBowl?.filter(e=> e.resturantId === param.id)
            .reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0) ?? 0;
            setnextTotal(Total);
    }, [myBowl, param.id ]);

    useEffect(()=>{
        if(!resturent){return}

        setNavinfo({title:resturent.resturantName
                ,
            goback: true
        });
    }, [resturent, nextTotal, setNavinfo]);

    const handledeleteall =()=>{
        setbowl((pr)=>{
            return pr.filter((e)=> e.menu.resturentId !== param.id);
        })
    }
    return(
        <>
        {
        resturent? <div className="flex flex-col scroll-smooth duration-200">
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
                
                <div className="flex min-w-0 flex-row flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory no-scrollbar sticky top-10 z-10 bg-[#FBF9F6] p-1">
                    <a id="allitems" href="#allitems" className = {`m-2 shrink-0 whitespace-nowrap rounded-3xl border pl-3 pr-3 pt-1 pb-1 ${catbtn == "all" ? "bg-[#A13924] text-white" :" bg-[#F5F3F0] border border-[#DEC0BA]"}`} onClick={()=>handlemenucatagory("all")}>All items</a>
                    {cat.map((val) => (
                        <a href={`#${val}`}
                            key={val}
                            className={`m-2 shrink-0 whitespace-nowrap rounded-3xl border pl-3 pr-3 pt-1 pb-1 ${catbtn === val ? "bg-[#A13924] text-white" : "bg-[#F5F3F0] border border-[#DEC0BA]"}`}
                            onClick={() => handlemenucatagory(val)} >
                            {val}
                        </a>
                    ))}
                </div>
                {/* cards load */}
               <div className="flex flex-col gap-1 p-3">
                {cat.map(e=> <span id={e} key={e} className="flex flex-col m-2 mb-4 font-semibold"> {e}{resturent.menu.map(f=> e == f.catagory && f.isAvailable ? <Ordercard resturent={resturent.resturantName} resid={param.id} key={f.id} item={f}/>:"")}</span>)}
               </div>
            </div>
            <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                {nextTotal > 0 ? <span className="fixed bottom-[calc(3.75rem+max(0.75rem,env(safe-area-inset-bottom)))] left-0 right-0 z-40 flex h-16 w-full items-center justify-between gap-4 bg-[#A13924] p-4 text-white">
                <span className="font-bold">Total: {nextTotal} BDT</span>
                <span className="flex flex-row gap-4 items-center justify-end">
                <Link href={`../checkout/${param.id}`} className="rounded-3xl bg-[#F5F3F0] p-1 pl-2.5 pr-2.5 text-[#A13924] font-semibold">Checkout</Link> 
                <button  onClick={()=>{handledeleteall()}} className=" border border-white p-1 pl-2.5 pr-2.5 rounded-2xl">Remove all</button>
                </span></span>:""}
            </div>
        </div> : <UsersLoading time={2000}/>}
        </>
    )
}

export function Ordercard({item , resid , resturent }:{item:MenuItem , resid:string ,resturent:string }){
    const {myBowl , setbowl} = useContext(userContext);
    const [count, setcount] = useState(1);
    const [found , setfound] = useState(false)   
    
    useEffect(() => {
    const checkfound = myBowl?.find(
        (orderItem) =>
            orderItem.menu.id === item.id &&
            orderItem.resturantId === resid
    );

    if (!checkfound) {
        setfound(false);
        setcount(1);
        return;
    }

    setfound(true);
    setcount(checkfound.quantity);
}, [myBowl, item.id, resid]);

    const handleadd =()=>{
        // console.log("add to bowl");
        setbowl((prev:OrderItem[])=>{
            const existingItemIndex = prev!.find((orderItem) => orderItem.menu.id === item.id);
            if (existingItemIndex ) {
                console.log(existingItemIndex);
                // console.log("item already exist in bowl");
                return prev!.map(e=> e.menu.id === item.id ? { ...e, quantity: count , resturantName:resturent } : e)
            } else {
                // console.log("item added to bowl");
                return [...prev! , {resturantId:resid, resturantName:resturent , menu: item, quantity: count, price: item.price }];
            }
        })
            // console.log(myBowl);
    }
    const handleremove =()=>{
        setbowl((prev:OrderItem[])=>{
            const existingItemIndex = prev!.find((orderItem) => orderItem.menu.id === item.id);
            if (existingItemIndex) {
                // console.log("item removed from bowl");
                return prev!.filter(e=> e.menu.id !== item.id)
            } else {
                // console.log("item not found in bowl");
                return prev;
            }
        });
        setcount(1);
        setfound(false);
        
    }
    return(
        <>
        {item ?
        <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl m-2 flex min-h-30 min-w-0 flex-row items-center justify-between overflow-hidden rounded-2xl border border-[#DEC0BA] bg-[#F5F3F0] p-3">
            <span className="flex min-w-0 max-w-[60%] flex-col justify-start gap-2">
            <span className="truncate font-semibold text-[#3b3939]">{item.itemName}</span>
            <span className="break-words font-normal leading-5 text-[#7a7776]">{item.description}</span>       
            {/* counter button */}
        <span className="flex flex-row items-center gap-2">
        <span className="font-bold text-[#A13924]">{item.price} BDT</span>
        <div className="inline-flex w-fit items-center overflow-hidden rounded-full border border-[#DEC0BA] bg-white shadow-sm">
            <button
              aria-label={`Decrease quantity of ${item.itemName}`}
              className="flex h-5 w-5 items-center justify-center text-[#A13924] transition hover:bg-[#f2e3de] disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => setcount((prev) => Math.max(1, prev - 1))}
              type="button"
              disabled={count === 1}
            >
              <Minus size={15} strokeWidth={2.5} />
            </button>
            <span className="flex h-5 min-w-5 items-center justify-center border-x border-[#DEC0BA] px-2 text-sm font-bold text-[#2d221f]" aria-live="polite">
              {count}
            </span>
            <button
              aria-label={`Increase quantity of ${item.itemName}`}
              className="flex h-5 w-5 items-center justify-center text-[#A13924] transition hover:bg-[#f2e3de]"
              onClick={() => setcount((prev) => prev + 1)}
              type="button">
              <Plus size={15} strokeWidth={2.5} />
            </button>
          </div>
            </span>
            {count > 1 ?<span className="text-[#A13924]">Total:{count*item.price} BDT</span> :""}
            </span>
            <span className="relative">
            <Image  className="h-24 w-24 shrink-0 rounded-2xl object-cover shadow-md" src={item.images?.[0]?.Path
                ? encodeURI((item.images[0].Path.replace(/\\/g, "/")).startsWith("http")
                ? item.images[0].Path.replace(/\\/g, "/")
                : `${api.defaults.baseURL?.replace(/\/$/, "")}/${item.images[0].Path.replace(/\\/g, "/").replace(/^\//, "")}`) : "/broken_resturant__logo.png"} width={1000} height={1000} alt={`${item.itemName} image`} />

                {found ? <button onClick={()=>handleremove()} className="absolute top-18 rounded-4xl p-1 bg-[#A13924] right-1"><Trash size={20} color="#ffff" strokeWidth={3} /></button> :<button onClick={()=>handleadd()} className="absolute top-18 rounded-4xl p-1 bg-[#A13924] right-1"><Plus size={20} color="#ffff" strokeWidth={3} /></button>
                }
            </span>
        </div>:""}
        </>
    )

}