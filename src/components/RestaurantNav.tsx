import { restaurantContext } from "@/lib/context/Context";
import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

interface Restaurant{
    id:string;
    resturantName?:string;
}

interface func{
    handleDefaultRestaurant:(id:string)=> void;
    socConnect:boolean;
}

export default function RestaurantNav({handleDefaultRestaurant , socConnect}:func) {
    const [defaultRestaurant, setdefaultRestaurant] = useState<Restaurant>({ id: "", resturantName: "No restaurant Found" });
    const { restaurants } = useContext(restaurantContext);
    const router = useRouter();


    useEffect(() => {
        if(!restaurants?.length) return;
        const defaultRestaurant = localStorage.getItem("defaultres");
        const allres = localStorage.getItem("resids");

  
        if (!defaultRestaurant) {
            setdefaultRestaurant({ id: "", resturantName: "No restaurant Found" });
            return;
        }

        try {
            const parsedRes = JSON.parse(defaultRestaurant);
            setdefaultRestaurant(parsedRes);
        } catch {
            setdefaultRestaurant({ id: "", resturantName: "No restaurant Found" });
        }
        console.log("res loadin..")
        
    }, [restaurants]);

    useEffect(()=>{
        handleDefaultRestaurant(defaultRestaurant.id);
    },[defaultRestaurant.id]);

    const handlerestaurantchange = (id:string) => {
        if(!restaurants?.length) return;
        const selectedRestaurant = restaurants?.find((restaurant) => restaurant.id === id);
        if (!selectedRestaurant) return;

        console.log("hit restaurant toggle")
        console.log(id);
        setdefaultRestaurant(selectedRestaurant);
        localStorage.setItem("defaultres", JSON.stringify(selectedRestaurant));
    };

    const handleLogout = () => {
        // localStorage.removeItem("accesstoken");
        document.cookie = "accesstoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        router.replace("/auth");
    };


    return (
        // <restaurantContext.Provider value={defaultRestaurant}>
        <>
            <div className="fixed left-0 right-0 top-0 z-30 flex min-h-20 flex-row items-center gap-3 border-b border-[#DEC0BA] bg-[#FBF9F6] p-4 font-black shadow-sm sm:min-h-21 sm:gap-5 sm:p-5 md:left-[14%]">
                <span className="relative block">
                <select
                    name="restaurantName"
                    className="w-56 appearance-none rounded-xl border border-[#DEC0BA] bg-white px-4 py-2.5 pr-10 text-sm font-bold tracking-wide text-[#514947] shadow-sm outline-none transition hover:border-[#C77A6A] focus:border-[#A13924] focus:ring-2 focus:ring-[#A13924]/15"
                    value={defaultRestaurant.id}
                    onChange={(e)=> handlerestaurantchange(e.target.value)}
                    id="restaurant-name"
                >
                    <option value={defaultRestaurant.id}>{(defaultRestaurant.resturantName ?? "Unnamed restaurant").toUpperCase()}</option>
                    {restaurants && restaurants!
                        .filter((restaurant) => restaurant.id !== defaultRestaurant.id)
                        .map((restaurant) => (
                            <option  key={restaurant.id} value={restaurant.id}>
                                {(restaurant.resturantName ?? "Unnamed restaurant").toUpperCase()}
                            </option>
                        ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#A13924]" size={18}/>
                </span>
                <span
                    role="status"
                    aria-live="polite"
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold tracking-wide shadow-sm ${
                        socConnect
                            ? "border-[#B9E8C8] bg-[#ECFAF0] text-[#168044]"
                            : "border-[#F1C4BE] bg-[#FFF0EE] text-[#B42318]"
                    }`}
                >
                    <span
                        aria-hidden="true"
                        className={`h-2.5 w-2.5 rounded-full ${
                            socConnect ? "bg-[#22A05A] shadow-[0_0_0_3px_rgba(34,160,90,0.15)]" : "bg-[#D0443E]"
                        }`}
                    />
                    {socConnect ? "You are live" : "You are offline"}
                </span>
                <button
                    type="button"
                    onClick={handleLogout}
                    aria-label="Log out"
                    className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#DEC0BA] bg-white px-3 py-2 text-sm font-bold text-[#A13924] shadow-sm transition hover:border-[#A13924] hover:bg-[#F5F3F0] focus:outline-none focus:ring-2 focus:ring-[#A13924]/20"
                >
                    <LogOut size={18} aria-hidden="true" />
                    <span className="hidden sm:inline">Log out</span>
                </button>
            </div>
        </>
        // </restaurantContext.Provider>
    );
}
