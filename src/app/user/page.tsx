"use client"
import UserHero from "@/components/userComponents/hero"
import ResturantCard from "@/components/userComponents/resturantcard";
import { api } from "@/lib/api/axios";
import { Restaurant } from "@/lib/interfaces/order"
import Result from "@/lib/Result";
import { useEffect, useState } from "react"
export default function User() {
    
    const [resturants , setresturants] = useState<Restaurant[]>();

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

    return (
       <>
       <UserHero/>
       <section className="m-5 mb-20">
        <div className="flex flex-1 items-center justify-center">
        <span className="flex flex-row items-center">
        <input type="text" className="border h-12 w-60 pl-4 border-gray-400 rounded-3xl" placeholder="Resturant name" /> <button  className="relative ml-[-87px] h-10 bg-[#A13924] pl-4 pr-4 pt-2 pb-2 rounded-4xl text-white">Search</button>
        </span>
        </div>        
       </section>
       <span className="flex flex-row flex-wrap m-3 gap-5">
            {resturants?.map((resturant) => (
                <ResturantCard key={resturant.id} resturant={resturant} />
            ))}
        </span>
       </>
    )
}
