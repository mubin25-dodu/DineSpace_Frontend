import { ScrollText } from "lucide-react";
import { CookingPot, HandCoins, RotateCwFadingClock, Table, Utensils } from "lucide-react";
import type { ReactNode } from "react";


interface data{
    title:string;
    icon?:ReactNode;
    amount?:number;
    subtitle?:string | null;
}
export default function KPICard(params:data){
    // console.log(params);
    // console.log("-----");
    const chunksArray: string[] = [];

    if(params.amount && params.amount>99){
    const cleanString = Math.floor(Number(params.amount)).toString();
    
    let tempStr = cleanString;

    while (tempStr.length > 0) {
        chunksArray.unshift(tempStr.slice(-3));
        tempStr = tempStr.slice(0, -3);
    }
    console.log("Parsed Chunks:", chunksArray);
    }

    const isLoading = params.amount === undefined || params.amount === null;

    return (
    <>
     <div className="border border-[#DEC0BA] w-fit h-fit min-h-28 shadow rounded-2xl   p-5 flex flex-col justify-between">
        <div className="flex flex-row justify-between"><span className="w-fit text-gray-600 text-[16px]">{params.title}</span> <span className="rounded-4xl ml-2 p-1 h-fit w-fit text-[#812a19]"> {params.icon ??<ScrollText />}</span>
        </div>
        <span className=" flex flex-row gap-1">
        {isLoading ? <span className="font-mono text-[20px]"></span> : params.amount && params.amount >= 999 ? <span> {chunksArray.map((e, index)=> <span key={`${params.title}-${index}`} className="countdown font-mono text-[20px]"> 
        <span style={{"--value":e, "--digits":e.toLocaleString().length} as React.CSSProperties  } aria-live="polite" aria-label={e.toString()}>{e} </span>
        </span>) }</span> : <span className="countdown font-mono text-[20px]"> 
        <span style={{"--value":params.amount, "--digits":params.amount &&  params.amount.toLocaleString().length} as React.CSSProperties  } aria-live="polite" aria-label={params.amount === undefined ? undefined : String(params.amount)}>{params.amount} </span>
        </span>
        }<span>{params.subtitle}</span>
        </span>
        {/* <div className="text-black text-[30px]">{params.amount}</div> */}
    </div>
    </>
    )
}