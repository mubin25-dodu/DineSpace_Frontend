import { createContext, Dispatch, SetStateAction } from "react";

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
}
export const userContext = createContext<Usercontext>({
	setActiveLink:() => undefined,
});
