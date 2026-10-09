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
export default function User() {
    
    const [resturants , setresturants] = useState<Restaurant[]>();
    const { setNavinfo } = useContext(userContext);
    const [searchQuery, setSearchQuery] = useState<string>("");
    let filteredResturants = resturants?.filter((resturant) =>
        resturant.resturantName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

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
       {windowWidth > 0 && windowWidth < 768 ? <UserHeroPhone/> : <UserHeroDesktop/>}
       <section className="m-5 mb-20">
        <div className="flex flex-1 items-center justify-center">
        <span className="flex flex-row items-center">
        <input type="text" onChange={(e) => setSearchQuery(e.target.value)} className="border h-12 w-60 pl-4 border-gray-400 rounded-3xl" placeholder="Resturant name" /> <button  className="relative ml-[-87px] h-10 bg-[#A13924] pl-4 pr-4 pt-2 pb-2 rounded-4xl text-white">Search</button>
        </span>
        </div>        
       </section>
       {filteredResturants && filteredResturants?.length > 0 ? <><div className="flex flex-row "> 
       <p className="text-gray-500">Showing {filteredResturants?.length} Resturents</p></div>
       <span className="flex flex-row flex-wrap m-3 gap-5 min-h-[50vh] ">
            {filteredResturants?.map((resturant) => (
                <ResturantCard key={resturant.id} resturant={resturant} />
            ))}
        </span></> : <span className="flex items-center min-h-20 justify-center"><LatticeLoader
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
