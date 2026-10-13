import { Utensils } from "lucide-react";
import Link from "next/link";
import {motion} from "motion/react";
export default function DinespaceLogo() {
    return (
         <motion.span whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
           <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-[#A13924] sm:text-2xl">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A13924] text-white sm:h-10 sm:w-10 sm:rounded-xl">
              <Utensils size={19} />
            </span>
            DineSpace
          </Link>
        </motion.span>
    )
}