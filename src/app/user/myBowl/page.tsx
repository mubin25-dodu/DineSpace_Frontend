"use client"
import { userContext } from "@/lib/context/Context";
import { OrderItem } from "@/lib/interfaces/order";
import { ArrowRight, MapPin, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function MyBowl(){
    const {myBowl , setbowl} = useContext(userContext);
    const bowl = myBowl ?? [];
    const restaurants = Array.from(
        bowl.reduce((groups, item) => {
            const restaurantId = item.resturantId ?? "unknown";
            const restaurantItems = groups.get(restaurantId) ?? [];
            restaurantItems.push(item);
            groups.set(restaurantId, restaurantItems);
            return groups;
        }, new Map<string, OrderItem[]>())
    );

    const deleteRestaurantItems = (restaurantId: string) => {
        setbowl((items) => items.filter((item) => item.resturantId !== restaurantId));
    };

    return(
        <main className="min-h-full bg-[#FBF9F6] px-4 py-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
                <div>
                    <h1 className="text-2xl font-bold text-[#3b3939]">My Bowl</h1>
                    <p className="mt-1 text-sm text-[#7a7776]">
                        Review your items before checkout.
                    </p>
                </div>

                {restaurants.length === 0 ? (
                    <div className="rounded-2xl border border-[#DEC0BA] bg-white p-8 text-center">
                        <ShoppingBag className="mx-auto text-[#A13924]" size={36} />
                        <p className="mt-3 font-semibold text-[#3b3939]">Your bowl is empty</p>
                        <p className="mt-1 text-sm text-[#7a7776]">Add items from a restaurant to see them here.</p>
                    </div>
                ) : restaurants.map(([restaurantId, items]) => {
                    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
                    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    const restaurantName = items[0].resturantName || "Restaurant";

                    return (
                        <section key={restaurantId} className="overflow-hidden rounded-2xl border border-[#DEC0BA] bg-white shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#A13924] px-5 py-4 text-white">
                                <div>
                                    <h2 className="text-lg font-bold">{restaurantName}</h2>
                                    <p className="mt-1 flex items-center gap-1 text-sm text-[#F5F3F0]">
                                        <MapPin size={15} /> {itemCount} {itemCount === 1 ? "item" : "items"}
                                    </p>
                                </div>
                                <span className="font-bold">{total} BDT</span>
                            </div>

                            <div className="divide-y divide-[#DEC0BA] px-5">
                                {items.map((item) => (
                                    <div key={item.menu.id} className="flex items-center justify-between gap-4 py-4">
                                        <div className="min-w-0">
                                            <p className="truncate font-semibold text-[#3b3939]">{item.menu.itemName}</p>
                                            <p className="mt-1 text-sm text-[#7a7776]">
                                                {item.quantity} × {item.price} BDT
                                            </p>
                                        </div>
                                        <span className="shrink-0 font-semibold text-[#A13924]">
                                            {item.quantity * item.price} BDT
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap justify-end gap-2 border-t border-[#DEC0BA] bg-[#F5F3F0] p-4">
                                <button
                                    type="button"
                                    onClick={() => deleteRestaurantItems(restaurantId)}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#A13924] px-4 py-2 text-sm font-semibold text-[#A13924] transition hover:bg-[#f2e3de]"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                                <Link
                                    href={`/user/Resturant/${restaurantId}`}
                                    className="inline-flex items-center gap-2 rounded-full border border-[#A13924] px-4 py-2 text-sm font-semibold text-[#A13924] transition hover:bg-[#f2e3de]"
                                >
                                    Go to restaurant <ArrowRight size={16} />
                                </Link>
                                <Link
                                    href={`/user/checkout/${restaurantId}`}
                                    className="inline-flex items-center gap-2 rounded-full bg-[#A13924] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#842d1d]"
                                >
                                    Checkout <ArrowRight size={16} />
                                </Link>
                            </div>
                        </section>
                    );
                })}
            </div>
        </main>
    )
}