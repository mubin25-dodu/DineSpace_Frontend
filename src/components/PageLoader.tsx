"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function UsersLoading({time}:{time?:number}) {
    const[loading , setLoading] = useState(true);
    useEffect(() => {
        const timeout = window.setTimeout(() => setLoading(false), time ?? 1000);
        return () => window.clearTimeout(timeout);
    }, [time]);

    if (!loading) return null;

    return (<>
        <motion.div
            className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-[#FBF9F6] px-6"
            role="status"
            aria-live="polite"
            aria-label="Loading"
        >
            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#F2E3DE] blur-3xl" />
            <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#F2E3DE] blur-3xl" />
            <div className="relative flex w-full max-w-sm flex-col items-center rounded-3xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.9)_0%,rgba(251,249,246,0.55)_45%,rgba(242,227,222,0)_75%)] px-8 py-10 text-center">
                <Image
                    className="mb-5 h-24 w-24 animate-pulse object-contain"
                    width={128}
                    height={128}
                    src="/Loadinggif.gif"
                    alt=""
                />
                <p className="text-xl font-bold tracking-tight text-[#3B2520] sm:text-2xl">
                    Cooking things up
                </p>
                <div className="mt-6 flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#A13924] [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#A13924] [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#A13924]" />
                </div>
            </div>
        </motion.div>
        </>
    );
}