"use client"

import { api } from "@/lib/axios";
import { registerSchema, registrationForm } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import PageLoader from "@/components/PageLoader";
import ServerError from "@/components/serverError";
import AlertPopup from "@/components/alertPopup";
import Result from "@/lib/Result";


export  default function register(){
        const [registred , setRegistred] = useState(true);
        const [serverError , setServerError] = useState (false);
        const [loading , setloading]  = useState(true);
        const [submitting, setSubmitting] = useState(false);
        const [alertMsg, setAlertMsg] = useState("");
        const [useremail ,setuserEmail] = useState("");
        const params = useParams();
        
         useEffect(() => {
          if (!params.id) return;

          const getuser = async () => {
            try {
              const res = await api.get(`auth/checkUsertoken/${params.id}`);
              // console.log(res);
              if(res.data.Success == false){
                setRegistred(false);
              }else{
                setuserEmail(res.data.Data.email);
                form.setValue('email', res.data.Data.email); 
              }
              setloading(false);
            } catch (e) {
              setServerError(true);
              setRegistred(false);
              setloading(false);
              console.error("checkUsertoken failed:", e);
            }
          };

          void getuser();
         }, [params.id]);

         const form = useForm<registrationForm>({
                resolver:zodResolver(registerSchema),
                mode:"onBlur",
            });

      const submitForm = async (payload:registrationForm)=>{
        setSubmitting(true);
        try{
          const {cpass , ...newpayload} = payload;
          // console.log(`newpayload ${newpayload}`);
          const {data} = await api.post<Result>(`/auth/register/${params.id}` , newpayload);
            setAlertMsg(data.Message);
            setSubmitting(false);
          // console.log("data"+data);
        }catch(e){
          setServerError(true);
          setSubmitting(false);
          console.error(String(e))
        }
    }

    return(
        <>
        {alertMsg.length !== 0  ? <AlertPopup Message={alertMsg}/> :""}
        <PageLoader load={loading} time={2000}/>
        <ServerError error={serverError} />
        <div className={`${serverError ? 'mt-20' : 'mt-6'} mb-6 text-gray-800  flex justify-center items-start`}>
        {serverError === false ? registred === true ?
        <form onSubmit={form.handleSubmit(submitForm)} >
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
                <label htmlFor="">Your Email <span className="text-red-800">*</span></label>
              <input type="email" readOnly value={useremail}  className={`${form.formState.errors.email?"border border-red-500":"" } rounded border border-gray-300 bg-gray-300 p-1 pl-5`}  placeholder="owner@dinespace.com" {...form.register('email')}/>
              {form.formState.errors.email ? (<span className="text-red-800 text-[14px] flex flex-wrap">{form.formState.errors.email.message}</span>) : (<span className="flex flex-wrap text-gray-400 text-[14px]">At least 8 characters, one uppercase, one lowercase, one number, and one special character.</span>)}
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="">Enter password <span className="text-red-800">*</span></label>
              <input type="password" id="password" className={`${form.formState.errors.password?"border border-red-500":"" }rounded border border-gray-300 p-1 pl-5`}  placeholder="Enter your password" {...form.register('password')}/>
              {form.formState.errors.password ? (<span className="text-red-800 text-[14px] flex flex-wrap">{form.formState.errors.password.message}</span>) : (<span className="flex flex-wrap text-gray-400 text-[14px]">At least 8 characters, one uppercase, one lowercase, one number, and one special character.</span>)}
            </div>
            <div className="flex flex-col gap-1">
                <label htmlFor="">Confirm password <span className="text-red-800">*</span></label>
              <input type="password" id="confirmPassword" className={`${form.formState.errors.cpass?"border border-red-500":"" } rounded border border-gray-300 p-1 pl-5`}  placeholder="Enter your password again" {...form.register('cpass')} />
              {form.formState.errors.cpass && (<span className="text-red-800 text-[14px]">{form.formState.errors.cpass.message}</span>)}
            </div>
            <div>
            </div>
            </div>
            
             <div className="flex flex-col gap-2">
              <div className="border-b border-gray-300 mb-5">Resturant Details (Optional)</div>
                
            <div className="flex flex-col gap-1">
                <label htmlFor="">Enter Resturant Name <span className="text-red-800">*</span></label>
              <input type="text" id="resturantName" className={`${form.formState.errors.resturantName?"border border-red-500":"" } rounded border border-gray-300 p-1 pl-5`}  placeholder="Name of the resturant" {...form.register('resturantName')}/>
              {form.formState.errors.resturantName && (<span className="text-red-800 text-[14px]">{form.formState.errors.resturantName.message}</span>)}
            </div>

            <div className="flex flex-wrap justify-between gap-1">
              <div className="flex flex-col w-[49%]">
              <label htmlFor="">Enter Resturant Email <span className="text-red-800">*</span></label>
              <input type="email" id="resturantemail" className={`${form.formState.errors.resturantemail?"border border-red-500":"" }rounded border border-gray-300 p-1 pl-5`}  placeholder="owner@dinespace.com" {...form.register('resturantemail')}/>
              {form.formState.errors.resturantemail && (<span className="text-red-800 text-[14px]">{form.formState.errors.resturantemail.message}</span>)}
              </div>
              <div className="flex flex-col w-[49%]">
              <label htmlFor="">Resturant Phone Number <span className="text-red-800">*</span></label>
              <input type="text" id="phone" className={`${form.formState.errors.phone?"border border-red-500":"" }rounded border border-gray-300 p-1 pl-5`}  placeholder="+88012345678912" {...form.register('phone')}/>
              {form.formState.errors.phone && (<span className="text-red-800 text-[14px]">{form.formState.errors.phone.message}</span>)}
              </div>
            </div>
             <div className="flex flex-col gap-1">
              <label htmlFor="">Physical Address <span className="text-red-800">*</span></label>
              <textarea id="address" placeholder="123 Main St, Suite 100..." className={`${form.formState.errors.address?" border-red-500":"" } border rounded  border-gray-300 p-1 pl-5`} {...form.register('address')}/>
              {form.formState.errors.address && (<span className="text-red-800 text-[14px]">{form.formState.errors.address.message}</span>)}
            </div>

            <div className="flex flex-wrap justify-between gap-1">
              <div className="flex flex-col w-[49%]">
              <label htmlFor="">Opening time<span className="text-red-800">*</span></label>
              <input type="time" id="opening" className={`${form.formState.errors.opening?"border border-red-500":"" } rounded border border-gray-300 p-1 pl-5`}  placeholder="12:30 PM" {...form.register('opening')}/>
              {form.formState.errors.opening && (<span className="text-red-800 text-[14px]">{form.formState.errors.opening.message}</span>)}
              </div>
              <div className="flex flex-col w-[49%]">
              <label htmlFor="">Closing time <span className="text-red-800">*</span></label>
              <input type="time" id="closing" className={`${form.formState.errors.closing?"border border-red-500":"" } rounded border border-gray-300 p-1 pl-5`}  placeholder="11:30 PM" {...form.register('closing')}/>
              {form.formState.errors.closing && (<span className="text-red-800 text-[14px]">{form.formState.errors.closing.message}</span>)}
              </div>
            </div>
            
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="border-b border-gray-300 ">Platform Preferences</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="bg-[#E8E4DF] p-3 rounded-2xl">
              <input type="checkbox" className="m-2 scale-110" id="isopen" {...form.register('isopen')} />
              <span className="">Currently Open </span>
              </div>
              <div className="bg-[#E8E4DF] p-3 rounded-2xl">
              <input type="checkbox" className="m-2 scale-110" id="payfirst" {...form.register('payfirst')} />
              <span className="">Require Pay First </span>
              </div>
            </div>

          <div className="flex flex-col gap-2">
              <div className="border-b border-gray-300 "></div>
            </div>
            <button type="submit" disabled={submitting} className={`${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#A13924] cursor-pointer hover:scale-98'} rounded h-8 text-white transition-all duration-500`}>
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
            <span className="text-[14px] text-center">By creating an account, you agree to DineSpace's Terms of Service and Privacy Policy.</span>
            </div>

            
        </form>: 
        <div className=" shadow w-fit mt-[25%] shadow-[#A13924] rounded-2xl p-10">
            Invalid Id Please <Link className="text-[#A13924] " href="/auth">Sign up</Link> Or Try again
            
        </div> :"" }
        </div>
        </>
    )
}