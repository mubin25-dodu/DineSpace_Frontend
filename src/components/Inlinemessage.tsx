"use client";

import { useState, useEffect } from "react";


export default function Inlinemessage(param:any) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(param.error);
    }, [param.error]);

    return (
        show && (
            <div className=" text-red-800 text-[15px] p-1 rounded font-semibold flex">
                <span className="flex-1">{param.Message}.</span>
                <button 
                    onClick={() => setShow(false)}
                    className="text-red-500 hover:text-red-800 cursor-pointer font-bold text-lg"> ✕ </button>
            </div>
        )
    );
}