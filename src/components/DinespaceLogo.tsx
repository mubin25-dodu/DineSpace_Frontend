import { Utensils } from "lucide-react";
import Link from "next/link";
export default function DinespaceLogo() {
    return (
         <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-[#A13924] sm:text-2xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A13924] text-white sm:h-10 sm:w-10 sm:rounded-xl">
            <Utensils size={19} />
          </span>
          DineSpace
        </Link>
    )
}