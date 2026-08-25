import { ScrollText } from "lucide-react";
import { CookingPot, HandCoins, RotateCwFadingClock, Table, Utensils } from "lucide-react";


interface data{
    title:string;
    icon?:string;
    amount:number;
}
export default function KPICard(params:data){
    return (
    <>
    <div className="border border-gray-300 w-50 h-30 shadow rounded-2xl   p-5 flex flex-col">
        <div className="flex flex-row justify-between"><span className="w-[70%] text-gray-600 text-[16px]">{params.title}</span> <span className="rounded-4xl ml-1 mb-1  p-1 h-fit w-fit text-[#812a19]"> {params.icon ??<ScrollText />}</span>
        </div>
        <div className="text-black text-[30px]">{params.amount}</div>
    </div>
    </>
    )
}