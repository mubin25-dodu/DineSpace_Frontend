"use client"
import { userContext } from "@/lib/context/Context";
import { ArrowLeft, House, ShieldQuestionMark, Soup } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

interface UsernavProps {
icon1?: React.ReactNode;
goback?: boolean;
icon2?: React.ReactNode;
title: string;
}

export default function Usernav(params:UsernavProps) {
    const {setActiveLink , myBowl} = useContext(userContext);
    const pathname = usePathname();
    const router = useRouter();
    return(
        <>
        <div className = "sticky top-0 z-5">
            <div className="  flex flex-row items-center justify-between pl-4 h-15 pr-4 border-b border-[#DEC0BA] bg-[#FBF9F6] ">
                <span onClick={params.goback ? () => router.back() : undefined}>{params.icon1 ? params.icon1 : <ArrowLeft/>}</span>
                <span className="font-bold text-[#A13924] text-[25px]">{params.title ? params.title : "DineSpace"}</span>
                <span >{params.icon2 ? params.icon2 : <ShieldQuestionMark />}</span>
            </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 flex-row items-center justify-around border-t border-[#DEC0BA] bg-[#FBF9F6] px-4 shadow-lg">
            <Link href={"/user"} className= {`flex flex-col justify-between items-center ${pathname.startsWith('/user') ? 'text-[#A13924]' : 'text-gray-500'}`}><House /> <span>Home</span> </Link>
            <Link href={"/user/myBowl"} className= {`relative flex flex-col justify-between items-center ${pathname.startsWith('/user/myBowl') ? 'text-[#A13924]' : 'text-gray-500'}`}><Soup /> <span>My Bowl</span><span className=" absolute bg-[#A13924] p-.5 pl-1.5 pr-1.5 rounded-[100%] bottom-7 right-0 text-white">{ myBowl &&myBowl?.length > 0  ? myBowl?.length :""} </span></Link>
            <Link href={"/user/order"} className= {`flex flex-col justify-between items-center ${pathname.startsWith('/user/order') ? 'text-[#A13924]' : 'text-gray-500'}`}><House /> <span>Order</span> </Link>
        </div>
        </>
    )
}