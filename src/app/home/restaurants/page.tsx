"use client"
import { resturantContext } from "@/lib/context/Context";
import { useContext } from "react";

export default function RestaurantsPage() {
    const { defaultResturant } = useContext(resturantContext);
    
    // const getdat
    return <h1 className="p-8 text-3xl font-semibold text-[#27221E]">Restaurants</h1>;
}
