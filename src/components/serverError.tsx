"use client";

import { useState, useEffect } from "react";

interface ServerErrorProps {
    error: boolean | string;
    setservererror?: () => void;
}

export default function ServerError({ error, setservererror }: ServerErrorProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(Boolean(error));
    }, [error]);

    return (
        show && (
            <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center font-semibold z-50 flex justify-between items-center">
                <span className="flex-1">⚠️ Server Error: {typeof error === "string" ? error : "Please try again after some time."}</span>
                <button 
                    onClick={() => {setShow(false); setservererror?.()}}
                    className="text-white hover:text-gray-200 font-bold text-lg"> ✕ </button>
            </div>
        )
    );
}