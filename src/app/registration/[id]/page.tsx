"use client"

import Link from "next/link";
import { useState } from "react"

export  default function register(){
        const [registred , setRegistred] = useState(true);
        
        // setRegistred(true);

    return(
        <>
        <div className=" mt-6 mb-6 text-gray-800  flex justify-center items-start">
        {registred === true ?
        <form >
            {/* <div className="text-center">
             <span className="mt-5 font-bold text-[50px] text-[#A13924]">DineSpace</span>
             <br /><span className="font-bold text-[15px] mb-4 text-[#17375E]"> Manage Smarter. Serve Better</span>
             </div> */}
            <div className="w-fit   bg-white shadow  rounded-2xl p-10 flex flex-col gap-6">
              <div className="text-center">
                <h1 className="font-bold text-[20px]">Regester To DineSpace</h1>
                <h2 className="font-normal text-gray-600">Join DineSpace to Manage Your orders and grow your buisiness</h2>
              </div>

              <div className="flex flex-col gap-2">
              <div className="border-b border-gray-300 mb-5">Personal Details</div>
                
            <div className="flex flex-col gap-1">
                <label htmlFor="">Enter Your Email <span className="text-red-800">*</span></label>
              <input type="email" name="email" id="" className=" rounded border border-gray-300 p-1 pl-5"  placeholder="owner@dinespace.com" />
              <span className="text-red-800 text-[14px]"></span>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="">Enter password <span className="text-red-800">*</span></label>
              <input type="password" name="password" id="" className=" rounded border border-gray-300 p-1 pl-5"  placeholder="Enter your password" />
              <span className="flex flex-wrap text-gray-400 text-[14px]">At least 8 characters, one uppercase, one lowercase, one number, and one special character.</span>
              <span className="text-red-800 text-[14px]"></span>
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="">Confirm password <span className="text-red-800">*</span></label>
              <input type="password" name="conPassword" id="" className=" rounded border border-gray-300 p-1 pl-5"  placeholder="Enter your password again" />
              <span className="text-red-800 text-[14px]"></span>
            </div>
            <div>
            </div>
            </div>
            
             <div className="flex flex-col gap-2">
              <div className="border-b border-gray-300 mb-5">Resturant Details (Optional)</div>
                
            <div className="flex flex-col gap-1">
                <label htmlFor="">Enter Resturant Email <span className="text-red-800">*</span></label>
              <input type="email" name="email" id="" className=" rounded border border-gray-300 p-1 pl-5"  placeholder="owner@dinespace.com" />
              <span className="text-red-800 text-[14px]"></span>
            </div>

            <div className="flex flex-wrap justify-between gap-1">
              <div className="flex flex-col w-[49%]">
              <label htmlFor="">Enter Resturant Email <span className="text-red-800">*</span></label>
              <input type="email" name="email" id="" className=" rounded border border-gray-300 p-1 pl-5"  placeholder="owner@dinespace.com" />
              <span className="text-red-800 text-[14px]"></span>
              </div>
              <div className="flex flex-col w-[49%]">
              <label htmlFor="">Resturant Phone Number <span className="text-red-800">*</span></label>
              <input type="number" name="number" id="" className=" rounded border border-gray-300 p-1 pl-5"  placeholder="+88012345678912" />
              <span className="text-red-800 text-[14px]"></span>
              </div>
            </div>
             <div className="flex flex-col gap-1">
              <label htmlFor="">Physical Address <span className="text-red-800">*</span></label>
              <textarea name="description" id="" placeholder="123 Main St, Suite 100..." className=" rounded border border-gray-300 p-1 pl-5" />
              <span className="text-red-800 text-[14px]"></span>
            </div>

            <div className="flex flex-wrap justify-between gap-1">
              <div className="flex flex-col w-[49%]">
              <label htmlFor="">Opening time<span className="text-red-800">*</span></label>
              <input type="time" name="openingTime" id="" className=" rounded border border-gray-300 p-1 pl-5"  placeholder="owner@dinespace.com" />
              <span className="text-red-800 text-[14px]"></span>
              </div>
              <div className="flex flex-col w-[49%]">
              <label htmlFor="">Closing time <span className="text-red-800">*</span></label>
              <input type="time" name="closingTime" id="" className=" rounded border border-gray-300 p-1 pl-5"  placeholder="+88012345678912" />
              <span className="text-red-800 text-[14px]"></span>
              </div>
            </div>
            
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="border-b border-gray-300 ">Platform Preferences</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="bg-[#E8E4DF] p-3 rounded-2xl">
              <input type="checkbox" className="m-2 scale-110" name="" id="" />
              <span className="">Currently Open </span>
              </div>
              <div className="bg-[#E8E4DF] p-3 rounded-2xl">
              <input type="checkbox" className="m-2 scale-110" name="" id="" />
              <span className="">Require Pay First </span>
              </div>
            </div>

          <div className="flex flex-col gap-2">
              <div className="border-b border-gray-300 "></div>
            </div>
            <button className="bg-[#A13924] rounded h-8 text-white cursor-pointer hover:scale-98 transition-all duration-500 ">Create Account</button>
            <span className="text-[14px] text-center">By creating an account, you agree to DineSpace's Terms of Service and Privacy Policy.</span>
            </div>

            
        </form>: 
        
        <div className=" shadow w-fit mt-[25%] shadow-[#A13924] rounded-2xl p-10">
            Invalid Id Please <Link className="text-[#A13924] " href="/auth">Sign up</Link> Or Try again
            
        </div> }
        </div>
        </>
    )
}