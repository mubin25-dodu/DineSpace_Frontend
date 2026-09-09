import { createContext, Dispatch, SetStateAction } from "react";
import { OrderItem } from "../interfaces/order";

interface RestaurantContextValue {
	defaultResturant: string;
	setpopup: Dispatch<SetStateAction<string>>;
	setservererror: Dispatch<SetStateAction<string>>;
}

export const resturantContext = createContext<RestaurantContextValue>({
	defaultResturant: "",
	setpopup: () => undefined,
	setservererror:() => undefined,
});

interface Usercontext{
	setActiveLink:Dispatch<SetStateAction<string>>;
	setNavinfo:Dispatch<SetStateAction<{ icon1?: React.ReactNode; icon2?: React.ReactNode; title: string , goback?:boolean }>>;
	setPopup: Dispatch<SetStateAction<string>>;
	setservererror: Dispatch<SetStateAction<string>>;
	setbowl:Dispatch<SetStateAction<OrderItem[] >>
	myBowl?:OrderItem[] | null
}
export const userContext = createContext<Usercontext>({
	setActiveLink:() => undefined,
	setNavinfo:() => undefined,
	setPopup: () => undefined,
	setservererror:() => undefined,
	setbowl: () => undefined,
	myBowl: [],
});
