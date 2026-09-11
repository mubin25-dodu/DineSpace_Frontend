"use client";
import React, { useEffect, useState } from "react";
import { Bell, X } from "lucide-react";
interface param{
    Message:string;
    time?:number;
    setpopup?: (message:string)=>void;
}

export default function  AlerPopup({Message , time, setpopup}:param){
    const [isVisible, setIsVisible] = useState(true);

    useEffect(()=>{
        setIsVisible(true);
        const timer = setTimeout(() => {
            setIsVisible(false);
            setpopup?.("");
        }, time ?? 15000);

        return () => clearTimeout(timer);
    },[Message, setpopup, time]);        
    return (
        <>
        {isVisible?
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/45 p-4 backdrop-blur-[2px]"
            role="presentation"
            onClick={() => { setIsVisible(false); setpopup?.(""); }} >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="alert-popup-title"
                aria-describedby="alert-popup-message"
                className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-[#E6C5BC] bg-[#FBF9F6] shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
            <div className="flex items-start gap-3 border-b border-[#EAD8D2] bg-[#FFF5F1] px-5 py-4 sm:px-6">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F5DED7] text-[#A13924]">
                    <Bell size={20} />
                </span>
                <div className="min-w-0 pr-8">
                    <h2 id="alert-popup-title" className="text-base font-bold text-[#2F2724] sm:text-lg">
                        We have a little update for you
                    </h2>
                    <p className="mt-0.5 text-xs text-[#8B7168]">DineSpace notification</p>
                </div>
                <button
                    type="button"
                    aria-label="Close notification"
                    onClick={() => { setIsVisible(false); setpopup?.(""); }}
                    className="absolute right-4 top-4 rounded-full p-2 text-[#735B53] transition hover:bg-[#F4E1DB] hover:text-[#A13924] focus:outline-none focus:ring-2 focus:ring-[#A13924]/30"
                >
                    <X size={19} />
                </button>
            </div>
            <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                <p id="alert-popup-message" className="wrap-break-word text-sm leading-7 text-[#514947] sm:text-base">
                    {Message}
                </p>
            </div>
            <div className="flex justify-end border-t border-[#EAD8D2] px-5 py-3 sm:px-6">
                <button
                    type="button"
                    onClick={() => { setIsVisible(false); setpopup?.(""); }}
                    className="rounded-xl bg-[#A13924] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#842F1E] focus:outline-none focus:ring-2 focus:ring-[#A13924]/30"
                >
                    Got it
                </button>
            </div>
            </div>
        </div>:null}
        </>
    );
}