"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function UsersLoading({time}:{time?:number}) {
    const[loading , setLoading] = useState(true);
    useEffect(() => {
        const timeout = window.setTimeout(() => setLoading(false), time ?? 1000);
        return () => window.clearTimeout(timeout);
    }, [time]);

    if (!loading) return null;

    return (<>
        <div
            className="fixed inset-0 z-10 flex min-h-screen items-center justify-center bg-[#E8E4DF]"
            role="status"
            aria-live="polite"
            aria-label="Loading"
        >
            <div className="flex flex-col items-center justify-center gap-4 px-4 text-center sm:flex-row sm:gap-6">
                <span className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl">
                    Cooking things up..
                </span>
                <Image
                    className="h-auto w-20 sm:w-24 lg:mb-20 lg:w-32"
                    width={128}
                    height={128}
                    src="/Loadinggif.gif"
                    alt=""
                />
            </div>
        </div>
        </>
    );
}