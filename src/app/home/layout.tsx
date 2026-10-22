"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/axios";
import Result from "@/lib/Result";
import { Restaurant } from "@/lib/interfaces/order";
import { restaurantContext } from "@/lib/context/Context";
import AlerPopup from "@/components/alertPopup";
import OwnerNav from "@/components/OwnerNav";
import ServerError from "@/components/serverError";
import { socket } from "@/lib/websock/socket";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    const [defaultRestaurant, setDefaultRestaurant] = useState("");
    const [popup, setPopup] = useState("");
    const [servererror , setservererror] = useState("");
    const [Today , settoday] = useState<Date>();
    const [refreshOrders, setRefreshOrders] = useState(0);
    const [socConnect, setSocConnect] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
    const [restaurants, setRestaurants] = useState<{ id: string; resturantName?: string }[]>([]);
    // for fetching users data
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
                setRestaurants(restaurantOptions);
                localStorage.setItem("resids", JSON.stringify(restaurantOptions));

                const storedRestaurant = localStorage.getItem("defaultres");
                const restaurant = storedRestaurant
                    ? JSON.parse(storedRestaurant)
                    : { resturantName: restaurants[0].resturantName, id: restaurants[0].id };

                localStorage.setItem("defaultres", JSON.stringify(restaurant));
                setDefaultRestaurant(restaurant.id);
            } catch (error) {
                console.error(error);
            }
        }

        getUserData();
    }, []);


    // for websock restaurant
    useEffect(()=>{
        if(!defaultRestaurant) return;
        const handleConnect = ()=>{
           setSocConnect(true);
           console.log("soc connected" , socket.id);
           socket.emit(
                "subscribeRestaurant",
                {
                resturantId: defaultRestaurant,
                },
                (response: { success: boolean; message: string }) => {
                console.log("Subscription response:", response);
                },
            );
        }
        const handleDisconnect = ()=>{
           setSocConnect(false);
           console.log("soc Disconnected" );
        }
        const handleConnectError = (error: Error) => {
        console.error("WebSocket connection failed:", error.message);
        };

        const handleOrderChanged = (data: { orderId: string }) => {
            console.log("Order changed:", data);
            setRefreshOrders((p)=>p+1);
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("newOrder", handleOrderChanged);
        socket.auth = {
        token: localStorage.getItem("accesstoken"),
        };

        socket.connect();
        

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("newOrder", handleOrderChanged);
            socket.disconnect();
        };

    },[defaultRestaurant])



    // useEffect(()=>{
    //     settoday(new Date());
    // },[new Date().getMilliseconds])

    return (
        <restaurantContext.Provider value={{ defaultRestaurant, setpopup: setPopup , setservererror , refreshOrders , restaurants }}>
            <OwnerNav
                handleDefaultRestaurant={setDefaultRestaurant}
                socConnect={socConnect}
                sidebarCollapsed={sidebarCollapsed}
                mobileNavOpen={mobileNavOpen}
                onToggleSidebar={() => setSidebarCollapsed((collapsed) => !collapsed)}
                onToggleMobileNav={() => setMobileNavOpen((open) => !open)}
                onCloseMobileNav={closeMobileNav}
            />
            {popup && <AlerPopup setpopup={() => setPopup("")} Message={popup} />}
            {servererror && <ServerError error={servererror} setservererror={() => setservererror("")}  />}
            <main
                className={`relative z-0 mt-20 min-w-0 px-3 pb-8 pt-4 transition-[margin] duration-200 sm:px-5 md:mt-20 md:px-6 ${
                    sidebarCollapsed ? "md:ml-20" : "md:ml-64"
                }`}
            >
                {children}
            </main>
        </restaurantContext.Provider>
    );
}
