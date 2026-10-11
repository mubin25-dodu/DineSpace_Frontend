"use client"
import LatticeLoader from "@/components/LatticeLoader/LetticalLoader";
import { UserHeroPhone , UserHeroDesktop } from "@/components/userComponents/hero"
import ResturantCard from "@/components/userComponents/resturantcard";
import { api } from "@/lib/api/axios";
import { userContext } from "@/lib/context/Context";
import { Restaurant } from "@/lib/interfaces/order"
import Result from "@/lib/Result";
import { Utensils } from "lucide-react";
import { useContext, useEffect, useState } from "react"
import { motion } from "motion/react";
export default function User() {
    
    const [resturants , setresturants] = useState<Restaurant[]>();
    const { setNavinfo } = useContext(userContext);
    const [searchQuery, setSearchQuery] = useState<string>("");
    let filteredResturants = resturants?.filter((resturant) =>
        resturant.resturantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // const [windowWidth, setWindowWidth] = useState(0);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setWindowWidth(window.innerWidth);
    //     };
    //     window.addEventListener('resize', handleResize);
    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    useEffect(() => {
        setNavinfo({ icon1: <Utensils color="#A13924" />, title: "DineSpace" });
    }, [setNavinfo]);

    useEffect(() => {
        const getresturants = async () => {
            try {
                const {data} = await api.get<Result<Restaurant[]>>("resturant/getAllResturants");
                console.log(data);
                if (data?.Success) {
                    setresturants(data.Data ?? []);
                }
            } catch (e) {
                console.log(e);
            }
        };

        getresturants();
    }, []);

   
    useEffect(() => {

        filteredResturants = resturants?.filter((resturant) =>
            resturant.resturantName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    },[searchQuery]);


    return (
       <>
       <span className="block sm:hidden"><UserHeroPhone /></span>
        <span className="hidden lg:block"><UserHeroDesktop /></span>
       <section className="m-5 mb-20">
        <div className="flex flex-1 items-center justify-center">
        <span className="flex flex-row items-center">
        <input type="text" onChange={(e) => setSearchQuery(e.target.value)} className="border h-12 w-60 pl-4 border-gray-400 rounded-3xl" placeholder="Resturant name" /> <button  className="relative ml-[-87px] h-10 bg-[#A13924] pl-4 pr-4 pt-2 pb-2 rounded-4xl text-white">Search</button>
        </span>
        </div>        
       </section>
       {filteredResturants && filteredResturants?.length > 0 ? <><div className="flex flex-row "> 
       <p className="text-gray-500 ml-5">Showing {filteredResturants?.length} Resturents</p></div>
       <motion.span className="m-3 flex min-h-[50vh] flex-row flex-wrap justify-center gap-5">
            {filteredResturants?.map((resturant) => (
               <motion.div key={resturant.id} initial={{ x: Math.random() * 100, opacity: 0 }} animate={{ x: 0 ,opacity: 1 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.01 }} className="w-full flex-none sm:w-[calc((100%-1.25rem)/2)] lg:w-[calc((100%-2.5rem)/3)]">
                 <ResturantCard key={resturant.id} resturant={resturant} />
               </motion.div>
            ))}
        </motion.span></> : <span className="flex items-center min-h-20 justify-center"><LatticeLoader
        status="working"
        label="Loading restaurants..."
        doneLabel="Done in"
        errorLabel="Failed after"
        pattern="arrow"
        grid={3}
        shape="round"
        doneColor="#22c55e"
        errorColor="#ef4444"
        cellSize={6}
        gap={2}
        fontSize={14}
        step={90}
        idleOpacity={0.15}
        glow={false}
        glowColor="#f5f5f5"
        showTimer
        color="#A13924"
        /></span>}
       </>
    )
}
