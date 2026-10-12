"use client"
import { api } from "@/lib/api/axios";
import Image from "next/image";
import { userContext } from "@/lib/context/Context";
import { MenuItem, OrderItem, Restaurant } from "@/lib/interfaces/order";
import Result from "@/lib/Result";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import {  Delete, MapPinCheckInside, Minus, Plus, Shrink, Trash } from "lucide-react";
import Link from "next/link";
import UsersLoading from "@/components/userComponents/Loading";
import { motion, vh } from "motion/react";
import CountUp from "@/components/countUp/countUp";

export default function Resturants(params:{id:string}){
    const param = useParams<{ id: string }>();
    const {setNavinfo , setservererror , myBowl , setbowl ,setPopup } = useContext(userContext);
    const [catbtn, setcatbtn]= useState("all");
    const [cat, setcat] = useState<string[]>([]);
    const [resturent, setResturent] = useState<Restaurant | null>(null);
    const [nextTotal, setnextTotal] = useState(0);
    const [isCartExpanded, setIsCartExpanded] = useState(false);
    const [error, setError] = useState(false);
    

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
                // console.log(data)
                } else {
                    setError(true);
                    setPopup("Failed to fetch resturent");
                }
            } catch (e) {
                // console.error(e);
                setError(true);
                setPopup("Failed to fetch resturent");
                new Error("Failed to fetch resturent");
            }
        };

        void getresturent();
    }, [param.id, setNavinfo]);

    const handlemenucatagory =(cat:string)=>{
        // console.log(cat);
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
        resturent? <div className="mx-auto flex w-full min-h-[100vh] max-w-7xl flex-col scroll-smooth duration-200">
            <Image className="h-120 w-full object-cover sm:h-64 md:h-80" src={resturent.coverFile?.Path?encodeURI((resturent.coverFile?.Path?.replace(/\\/g, "/")).startsWith("http")
            ? resturent.coverFile?.Path?.replace(/\\/g, "/")
            : `${api.defaults.baseURL?.replace(/\/$/, "")}/${resturent.coverFile?.Path?.replace(/\\/g, "/").replace(/^\//, "")}`) : "/broken_resturant_cover.png"} width={1000} height={600} alt="cover"></Image>
            <div className="mt-[-1.5rem] flex min-h-[70vh] flex-col rounded-[20px_20px_0_0] bg-[#FBF9F6] sm:mt-[-2.5rem]">
                <div className="flex flex-wrap items-center gap-3 px-4 pt-5 sm:px-6">
                 <Image className="mt-[-3rem] h-20 w-20 rounded-2xl object-cover shadow-md sm:mt-[-5rem] sm:h-28 sm:w-28" src={resturent.logoFile?.Path
                ? encodeURI((resturent.logoFile?.Path?.replace(/\\/g, "/")).startsWith("http")
                ? resturent.logoFile?.Path?.replace(/\\/g, "/")
                : `${api.defaults.baseURL?.replace(/\/$/, "")}/${resturent.logoFile?.Path?.replace(/\\/g, "/").replace(/^\//, "")}`) : "/broken_resturant__logo.png"} width={256} height={256} alt={`${resturent.resturantName} logo`}></Image>
                <h1 className="min-w-0 flex-1 text-xl font-bold text-[#A13924] sm:text-2xl">{resturent.resturantName.toUpperCase()}</h1>
                </div>
            <div className="flex items-start gap-2 px-4 py-4 sm:px-6">
                <MapPinCheckInside className="mt-0.5 shrink-0"/>
                <p className="break-words text-sm text-black sm:text-base">{resturent.address}</p>
            </div>
                <p className="px-4 pb-3 text-[#A13924] font-bold sm:px-6">Checkout the menu</p>
                <hr className="w-full border-[#97756f]" />
                
                <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{duration:.7}} className="sticky top-14 z-20 flex min-w-0 flex-row flex-nowrap overflow-x-auto overflow-y-hidden scroll-smooth snap-x snap-mandatory bg-[#FBF9F6] p-1 no-scrollbar">
                    <a id="allitems" href="#allitems" className = {`m-2 shrink-0 whitespace-nowrap rounded-3xl border pl-3 pr-3 pt-1 pb-1 ${catbtn == "all" ? "bg-[#A13924] text-white" :" bg-[#F5F3F0] border border-[#DEC0BA]"}`} onClick={()=>handlemenucatagory("all")}>All items</a>
                   
                    {cat.map((val) => (
                        <motion.a                         
                       href={`#${val}`}
                            key={val}
                            className={`m-2 shrink-0 whitespace-nowrap rounded-3xl border pl-3 pr-3 pt-1 pb-1 ${catbtn === val ? "bg-[#A13924] text-white" : "bg-[#F5F3F0] border border-[#DEC0BA]"}`}
                            onClick={() => handlemenucatagory(val)} >
                            {val}
                        </motion.a>
                    ))}
                </motion.div>
                
                {/* cards load */}
               <div className="grid grid-cols-1 gap-x-6 gap-y-2 p-2 sm:p-4 xl:grid-cols-2">
                {cat.map(e=> <section id={e} key={e} className="mb-4 flex scroll-mt-28 flex-col font-semibold"> <h2 className="px-2 py-2 text-base sm:text-lg">{e}</h2>{resturent.menu.map(f=> e == f.catagory && f.isAvailable ? <motion.div                        
                          key={f.id} initial={{ y: Math.random() * 100, opacity: 0 }} viewport={{ once: true }} whileInView={{ y: 0, opacity: 1 }} transition={{duration:.7}}> <Ordercard resturent={resturent.resturantName} resid={param.id} key={f.id} item={f}/></motion.div>:"")}</section>)}
               </div>
            </div>
            <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                {nextTotal > 0 ? isCartExpanded ? (
                    <motion.div
                        drag
                        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        dragElastic={0.5}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="fixed bottom-[calc(3.75rem+max(0.75rem,env(safe-area-inset-bottom)))] left-0 right-0 z-40 min-h-16 bg-[#A13924] px-4 py-3 text-sm text-white sm:text-base md:bottom-4 md:left-1/2 md:right-auto md:w-[calc(100%-2rem)] md:max-w-5xl md:-translate-x-1/2 md:rounded-2xl"
                    >
                        <span className="mx-auto flex w-full flex-wrap items-center justify-between gap-2">
                            <button
                                type="button"
                                onClick={() => setIsCartExpanded(false)}
                                className="flex items-center gap-2 font-bold"
                                aria-label="Collapse order summary"
                            >
                                <span>Total: <CountUp to={nextTotal} from={0} duration={0.5} /></span>
                                <Shrink size={18} aria-hidden="true" />
                            </button>
                            <span className="flex items-center justify-end gap-2 sm:gap-4">
                                <Link href={`../checkout/${param.id}`} className="rounded-3xl bg-[#F5F3F0] px-3 py-1.5 font-semibold text-[#A13924]">Checkout</Link>
                                <button type="button" onClick={handledeleteall} className="rounded-2xl border border-white px-3 py-1.5">Remove all</button>
                            </span>
                        </span>
                    </motion.div>
                ) : (
                    <motion.button
                        type="button"
                        drag
                        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
                        dragElastic={0.5}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsCartExpanded(true)}
                        className="fixed bottom-[calc(3.75rem+max(0.75rem,env(safe-area-inset-bottom)))] right-4 z-40 flex h-fit p-2 mb-1 min-w-16 items-center justify-center rounded-full bg-[#A13924] px-4 text-sm font-bold text-white shadow-lg sm:text-base md:bottom-4"
                        aria-label="Show order summary"
                    >
                        <span>Total: <CountUp to={nextTotal} from={0} duration={0.5} /></span>
                    </motion.button>
                ) : ""}
            </div>
        </div> :error ? <span className="flex items-center min-h-20 justify-center text-[#A13924] font-semibold">
                   <Link href="/user" className="text-[#A13924] font-semibold"> Failed to load restaurant go back and try again </Link>
                </span> : <UsersLoading time={2000} />}
        </>
    )
}

export function Ordercard({item , resid , resturent }:{item:MenuItem , resid:string ,resturent:string }){
    const {myBowl , setbowl} = useContext(userContext);
    const [count, setcount] = useState(1);
    const [found , setfound] = useState(false)   
    const [seemore , setseemore] = useState(false);
    
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
                // console.log(existingItemIndex);
                // console.log("item already exist in bowl");
                return prev!.map(e=> e.menu.id === item.id ? { ...e, quantity: count , resturantName:resturent } : e)
            } else {
                // console.log("item added to bowl");
                return [...prev! , {resturantId:resid, resturantName:resturent , menu: item, quantity: count, price: item.price }];
            }
        })
            // console.log(myBowl);
    }
    useEffect(()=>{
        const existingItemIndex = myBowl?.find((orderItem) => orderItem.menu.id === item.id);
        if(count > 1 && existingItemIndex){
            handleadd();
        }
    },[count])
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
        <div className="m-1 flex min-h-30 min-w-0 flex-row items-center justify-between gap-3 overflow-hidden rounded-2xl border border-[#DEC0BA] bg-[#F5F3F0] p-3 text-sm transition-[border-color,box-shadow] duration-200 hover:border-transparent hover:ring-2 hover:ring-[#DEC0BA] hover:ring-offset-2 hover:ring-offset-[#FBF9F6] sm:m-2 sm:text-base">
            <span className="flex min-w-0 flex-1 flex-col justify-start gap-2">
            <span className="truncate font-semibold text-[#3b3939]">{item.itemName}</span>
            <span className="break-words font-normal leading-5 text-[#7a7776]">{seemore ? item.description : item.description.substring(0, 90) + "..."} {item.description.length > 90 ? <span className="cursor-pointer"><button onClick={() => setseemore(!seemore)} className="text-[#A13924] bold text-[12px] ">Read more</button></span> : null}</span>       
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
          </div> {count > 1 ? <span className="text-[#A13924]">Total: <CountUp to={count * item.price} from={0} duration={0.5} className="text-[#A13924]" /></span> :""}
            </span>
           
            </span>
            <span className="relative shrink-0 ">
            <Image  className="z-0 h-20 w-20 rounded-2xl object-cover shadow-md sm:h-24 sm:w-24" src={item.images?.[0]?.Path
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