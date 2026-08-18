"use client"
import Image from "next/image";
import PageLoader from "@/components/PageLoader";
import { useState } from "react";

export default function Home() {
  const [loading , setloading] = useState(true);
  setTimeout(()=>{
    setloading(false);

  } , 5000)

  return (
  <>
  <PageLoader load={loading}/>
  </>
  );
}
