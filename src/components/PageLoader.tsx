"use client";

import { useState } from "react";

interface param{
    load:Boolean;
    time?:number;
}

export default function (params:param){
    const [loading , setloading] = useState(params.load);
        setTimeout(()=>{
            setloading(false);
        } , params.time?? 3000)
    return (
        <>
        <div className={`w-full h-full fixed inset-0 flex items-center justify-center bg-[#E8E4DF] ${!loading? "hidden":""}`}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4">
             <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-center">Cooking things up..</span> 
             <img className="w-16 sm:w-20 md:w-24 lg:w-32 h-auto lg:mb-20" src="../Loadinggif.gif" alt="loading"></img>
            </div>
        </div>
        </>
    );
}