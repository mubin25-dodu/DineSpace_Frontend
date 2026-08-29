import { ScrollText } from "lucide-react";
import { CookingPot, HandCoins, RotateCwFadingClock, Table, Utensils } from "lucide-react";


interface data{
    title:string;
    icon?:string;
    amount:number;
}
export default function KPICard(params:data){
    console.log(params);
    console.log("-----");
    const chunksArray: string[] = [];

    if(params.amount>99){
     // 1. Force convert it to a plain text string safely
    const cleanString = Math.floor(Number(params.amount)).toString();
    
    // 2. Clear array chunking loop from right to left 
    let tempStr = cleanString;

    while (tempStr.length > 0) {
        chunksArray.unshift(tempStr.slice(-3));
        tempStr = tempStr.slice(0, -3);
    }
    // Now this will correctly print: ["71", "500"]
    console.log("Parsed Chunks:", chunksArray);
    }

    return (
    <>
    <div className="border border-[#DEC0BA] w-50 h-30 shadow rounded-2xl   p-5 flex flex-col">
        <div className="flex flex-row justify-between"><span className="w-[70%] text-gray-600 text-[16px]">{params.title}</span> <span className="rounded-4xl ml-1 mb-1  p-1 h-fit w-fit text-[#812a19]"> {params.icon ??<ScrollText />}</span>
        </div>
        {/* For TSX uncomment the commented types below */}
        {params.amount >= 999 ? <span> {chunksArray.map(e=> <span className="countdown font-mono text-[20px]"> 
        <span style={{"--value":e, "--digits":e.toLocaleString().length} as React.CSSProperties  } aria-live="polite" aria-label={e.toString()}>{e}</span>
        </span>) }</span> : <span className="countdown font-mono text-[20px]"> 
        <span style={{"--value":params.amount, "--digits":params.amount.toLocaleString().length} as React.CSSProperties  } aria-live="polite" aria-label={params.amount.toString()}>{params.amount}</span>
        </span>
        }
        {/* <div className="text-black text-[30px]">{params.amount}</div> */}
    </div>
    </>
    )
}