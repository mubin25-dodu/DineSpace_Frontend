'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEnvelope , faLock} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function Auth(){
    const [showForm , setShowform] = useState(false);

    return(
    <>
    <div className="flex justify-center items-center min-h-screen">
        <div className="w-[80vw] lg:w-[35vw]  md:w-[45vh] h-fitcontent xl:w-[25vw] rounded-3xl shadow ">
            <div className="w-full h-[30%]" > <img src="./dinespace.png" className=" w-full h-full rounded-3xl" alt="" /> </div>
            <div className=" mt-1 flex flex-col p-5  gap-4 text-[#1B1C1A] text-[18px]" style={{fontWeight:"400"}}> 
                <label htmlFor="">Enter Email Address:</label>
                <div className='flex items-center p-3 shadow rounded'>
                    <FontAwesomeIcon icon={faEnvelope} className='text-[#17375E] mr-2' />
                    <input className="bg-transparent w-full h-full outline-none" type="email" name="Email" id="" placeholder="example@Dinespace.com"/>
                </div>
               <div className=" flex justify-between">
                 <label htmlFor="">Password:</label>
                 <a className="text-[12px] font-bold text-[#A13924] cursor-pointer">Forget Password?</a>
               </div>
                <div className='flex items-center p-3 shadow rounded'>
                    <FontAwesomeIcon icon={faLock} className='text-[#17375E] mr-2' />
                    <input className="bg-transparent w-full h-full outline-none" type="password" name="Email" id="" placeholder="Enter Your Password"/>
                </div>
                <button className="bg-[#A13924] rounded h-8 text-white cursor-pointer hover:scale-98 transition-all duration-500 ">Sign In <FontAwesomeIcon icon={faArrowRight} width={16} height={16}/></button>
                <button className=" rounded h-8 text-[#040505] border-2 border-[#17375E] cursor-pointer hover:scale-98 transition-all duration-500" 
                onClick={()=>{ const a = !showForm; setShowform(a)}}> Sign Up & Serve Better</button>
                {showForm && showForm == true ?
                <form action="">
                    <div className='flex flex-col  gap-1 bg-gray-200 rounded shadow p-2 transition-all duration-1100 '>
                        <label htmlFor="">Enter Email Address:</label>
                        <div className='flex flex-1 items-center gap-2 flex-wrap justify-between'>
                            <div className='flex items-center bg-white rounded shadow h-8 w-[65%] pl-3 pr-2'>
                                <FontAwesomeIcon icon={faEnvelope} className='text-[#17375E] mr-2' />
                                <input className="bg-transparent w-full h-full outline-none" type="email" name="Email" id="" placeholder="example@Dinespace.com"/>
                            </div>
                            <button type='button' className='bg-[#A13924] w-fit pl-2 pr-2 rounded h-8 text-white cursor-pointer hover:scale-98 transition-all duration-500'> Send Email</button>
                        </div>
                    </div>
                </form>
                :""}
            </div>
            <div className='h-10 w-full text-[#A13924]  cursor-pointer flex justify-around items-center' style={{borderRadius:"0px 0px 10px 10px", boxShadow:"0px -1px 0px 0px"}}>
                <a> About DineSpace</a>
                <a> Support@DineSpace.com</a>
            </div>

        </div>
    </div>
    </>
    );
}