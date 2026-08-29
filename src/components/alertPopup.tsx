"use client";
import React, { useEffect, useState } from "react";
interface param{
    Message:string;
    time?:number;
    setpopup:()=>void;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 transition-all duration-500">
            <div className="relative flex gap-5 p-5 bg-[#FBF9F6] flex-col rounded-2xl shadow-2xl border border-[#A13924] w-[90%] max-w-md">
            <button onClick={() => { setIsVisible(false); setpopup?.("") }} className="absolute top-4 right-4 text-black hover:text-[#A13924] font-extrabold text-2xl cursor-pointer transition-colors"> ✕ </button> 
            <span className="font-semibold text-center text-[20px] border-b-2 border-[#A13924] pr-8"> We have got a little update for you. </span> 
             <span className="font-light text-[16px] border border-gray-300 rounded-2xl p-5 text-wrap text-justify">{Message}</span> 
            </div>
        </div>:null}
        </>
    );
}