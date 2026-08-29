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