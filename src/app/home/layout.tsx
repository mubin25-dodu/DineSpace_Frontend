"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/axios";
import Result from "@/lib/Result";
import { Restaurant } from "@/lib/interfaces/order";
import { resturantContext } from "@/lib/context/Context";
import AlerPopup from "@/components/alertPopup";
import OwnerNav from "@/components/OwnerNav";
import ServerError from "@/components/serverError";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const [defaultResturant, setDefaultResturant] = useState("");
    const [popup, setPopup] = useState("");
    const [servererror , setservererror] = useState("");
    const [Today , settoday] = useState<Date>();

    useEffect(() => {
        async function getUserData() {
            try {
                const { data } = await api.get<Result<{ resturants: Restaurant[] }>>("/user/Getme");
                const restaurants = data.Data?.resturants;

                if (!data.Success || !restaurants?.length) return;

                const restaurantOptions = restaurants.map((restaurant) => ({
                    id: restaurant.id,
                    resturantName: restaurant.resturantName,
                }));
                localStorage.setItem("resids", JSON.stringify(restaurantOptions));

                const storedRestaurant = localStorage.getItem("defaultres");
                const restaurant = storedRestaurant
                    ? JSON.parse(storedRestaurant)
                    : { resturantName: restaurants[0].resturantName, id: restaurants[0].id };

                localStorage.setItem("defaultres", JSON.stringify(restaurant));
                setDefaultResturant(restaurant.id);
            } catch (error) {
                console.error(error);
            }
        }

        getUserData();
    }, []);

    // useEffect(()=>{
    //     settoday(new Date());
    // },[new Date().getMilliseconds])

    return (
        <resturantContext.Provider value={{ defaultResturant, setpopup: setPopup , setservererror }}>
            <OwnerNav handleDefaultResturant={setDefaultResturant} />
            {popup && <AlerPopup setpopup={() => setPopup("")} Message={popup} />}
            {servererror && <ServerError error={servererror} setservererror={() => setservererror("")}  />}
            <main className="ml-[max(16%,12.5rem)] mt-16">{children}</main>
        </resturantContext.Provider>
    );
}
