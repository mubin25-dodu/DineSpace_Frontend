import { Resturant } from "../interfaces/file";
import { OrderItem, Restaurant } from "../interfaces/order";

export default function(bowldata:OrderItem[], newresdata:Restaurant ){

    // s-1 filter resturent s2 - upodate the price and availibility if not available removes it from the array 
            const updatedBowl = bowldata.filter((orderItem) => {
                if (orderItem.resturantId !== newresdata.id) return true;

                const latestMenuItem = newresdata.menu.find(
                    (menuItem) => menuItem.id === orderItem.menu.id
                );

                return latestMenuItem?.isAvailable !== false && !!latestMenuItem;
            });

            return updatedBowl.map((orderItem) => {
                if (orderItem.resturantId !== newresdata.id) return orderItem;

                const latestMenuItem = newresdata.menu.find(
                    (menuItem) => menuItem.id === orderItem.menu.id
                );

                return {
                    ...orderItem,
                    menu: latestMenuItem!,
                    price: latestMenuItem!.price,
                };
            });
}