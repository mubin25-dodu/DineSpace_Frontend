import { Utensils } from "lucide-react";
import Link from "next/link";
import {motion} from "motion/react";
export default function DinespaceLogo({ light = false }: { light?: boolean }) {
    return (
         <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
           <Link href="/" className={`flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight sm:text-2xl ${light ? "text-white" : "text-[#A13924]"}`}>
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg text-white sm:h-10 sm:w-10 sm:rounded-xl ${light ? "bg-[#D95638]" : "bg-[#A13924]"}`}>
              <Utensils size={19} />
            </span>
            DineSpace
          </Link>
        </motion.span>
    )
}