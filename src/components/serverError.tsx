"use client";

import { useState, useEffect } from "react";


export default function ServerError(param:any) {
    const [show, setShow] = useState(false);

    console.log(param);

    useEffect(() => {
        setShow(param.error);
    }, [param.error]);

    return (
        show && (
            <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center font-semibold z-50 flex justify-between items-center">
                <span className="flex-1">⚠️ Server Error: {param.error? param.error : "Please try again after some time."}</span>
                <button 
                    onClick={() => {setShow(false) ; param.setservererror("")}}
                    className="text-white hover:text-gray-200 font-bold text-lg"> ✕ </button>
            </div>
        )
    );
}