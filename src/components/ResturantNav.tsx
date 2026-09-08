import { resturantContext } from "@/lib/context/Context";
import { useEffect, useState, type ChangeEvent } from "react";

interface Resturant{
    id:string;
    resturantName?:string;
}

interface func{
    handleDefaultResturant:(id:string)=> void;
}

export default function ResturantNav({handleDefaultResturant}:func) {
    const [defaultResturant, setdefaultResturant] = useState<Resturant>({ id: "", resturantName: "No resturant Found" });
    const [resturants , setResturants] = useState<Resturant[]>([]);


    useEffect(() => {
        const defaultResturant = localStorage.getItem("defaultres");
        const allres = localStorage.getItem("resids");

        if(allres){
            setResturants(JSON.parse(allres));
        }
        if (!defaultResturant) {
            setdefaultResturant({ id: "", resturantName: "No resturant Found" });
            return;
        }

        try {
            const parsedRes = JSON.parse(defaultResturant);
            setdefaultResturant(parsedRes);
        } catch {
            setdefaultResturant({ id: "", resturantName: "No resturant Found" });
        }
        console.log("res loadin..")
        
    }, []);

    useEffect(()=>{
        handleDefaultResturant(defaultResturant.id);
    },[defaultResturant.id]);

    const handleresturantchange = (id:string) => {
        const selectedRestaurant = resturants.find((restaurant) => restaurant.id === id);
        if (!selectedRestaurant) return;

        console.log("hit resturant toggle")
        console.log(id);
        setdefaultResturant(selectedRestaurant);
        localStorage.setItem("defaultres", JSON.stringify(selectedRestaurant));
    };


    return (
        // <resturantContext.Provider value={defaultResturant}>
        <>
            <div className="flex flex-row font-black ml-[13.5%] border border-b-[#DEC0BA] p-5 fixed w-full bg-[#FBF9F6]">
                <span>
                <select name="resturentName" className="w-[120%]" value={defaultResturant.id} onChange={(e)=> handleresturantchange(e.target.value)} id="">
                    <option value={defaultResturant.id}>{(defaultResturant.resturantName ?? "Unnamed restaurant").toUpperCase()}</option>
                    {resturants
                        .filter((restaurant) => restaurant.id !== defaultResturant.id)
                        .map((restaurant) => (
                            <option  key={restaurant.id} value={restaurant.id}>
                                {(restaurant.resturantName ?? "Unnamed restaurant").toUpperCase()}
                            </option>
                        ))}
                </select>
                </span>
            </div>
        </>
        // </resturantContext.Provider>
    );
}
