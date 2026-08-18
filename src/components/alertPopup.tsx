"use client";
import { useEffect, useState } from "react";
interface param{
    Message:string;
    time?:number;
}

export default function (params:param){
    const [isVisible, setIsVisible] = useState(true);

    setTimeout(()=>{
    setIsVisible(false);

    } , params.time ?? 15000)
        
    return (
        <>
        {isVisible?
        <div className={`w-full h-full fixed inset-0 flex items-center justify-center flex-col transition-all duration-500`}>
            <div className="relative flex gap-5 p-5 bg-[#FBF9F6] flex-col rounded-2xl shadow-2xl border border-[#A13924] w-[90%] max-w-md">
            <button onClick={() => { setIsVisible(false); }} className="absolute top-4 right-4 text-black hover:text-[#A13924] font-extrabold text-2xl cursor-pointer transition-colors"> ✕ </button> 
            <span className="font-semibold text-center text-[20px] border-b-2 border-[#A13924] pr-8"> We have got a little update for you. </span> 
             <span className="font-light text-[16px] border border-gray-300 rounded-2xl p-5 text-wrap text-justify">{params.Message}</span> 
            </div>
        </div>:null}
        </>
    );
}