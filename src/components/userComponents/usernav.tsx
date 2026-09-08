import { House } from "lucide-react";
import Link from "next/link";

export default function Usernav({ activeLink }: { activeLink: string }) {
    return(
        <>
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 flex-row items-center justify-around border-t border-[#] bg-[#FBF9F6]px-4 shadow-lg">
            <Link href={""} className= {`flex flex-col justify-between items-center ${activeLink === 'home' ? 'text-[#A13924]' : 'text-gray-500'}`}><House /> <span>Home</span> </Link>
            <Link href={""} className= {`flex flex-col justify-between items-center ${activeLink === 'Cart' ? 'text-[#A13924]' : 'text-gray-500'}`}><House /> <span>Cart</span> </Link>
            <Link href={""} className= {`flex flex-col justify-between items-center ${activeLink === 'order' ? 'text-[#A13924]' : 'text-gray-500'}`}><House /> <span>Order</span> </Link>
        </div>
        </>
    )
}