'use client'
import { useContext, useState, type Dispatch, type SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { loginForm, loginSchema, verifyemailSchema } from '@/schemas/auth.schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {Eye, EyeOff, Loader, Lock, LogIn, MailQuestionMark} from 'lucide-react'
import { api } from '@/lib/api/axios';
import ServerError from '@/components/serverError';
import Result from '@/lib/Result';
import Image from 'next/image';
import Link from 'next/link';
import AlerPopup from '@/components/alertPopup';
interface LoginResponse {
    role: string;
    email:string;
    id:string;
}

export default function Auth(){
    const router = useRouter();
    const [showForm , setShowform] = useState(false);
    const [serverError , setServerError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [btns , setbuttons] = useState({ login: false, verify: false, forget: false });
    const [popup , setpopup] = useState<string>("");

    const form = useForm<loginForm>({
        resolver:zodResolver(loginSchema),
        mode:"onBlur",       
    });

    const verifyform = useForm<verifyemailSchema>({
        resolver:zodResolver(verifyemailSchema),
        mode:"onBlur",
    });

    const loginBtnClicked = ()=> {
        // console.log("loginBtnClicked");
        setbuttons((e) => ({ ...e, login: true }));
         setTimeout(()=>{
            setbuttons((e) => ({ ...e, login: false }));
        } , 15000) //15sec
    }
    

    const login = async (payload: loginForm) => {
        loginBtnClicked();
        try{
            const {data} = await api.post<Result<LoginResponse>>("auth/login" , payload);
            
            if(data.Success){ 
            if(data.Token !== undefined){
                localStorage.setItem("accesstoken" , data.Token);
                document.cookie = `accesstoken=${encodeURIComponent(data.Token)}; path=/; SameSite=Lax`;
            }
            if(data.Data?.role === "owner"){
                router.push("/home");
            }
             if(data.Data?.role === "admin"){
                router.push("/admin");
            }
            }
            
            else if(data.Message && data.Message.includes('Wrong Password')){
            form.setError('password',{
                type:"server",
                message:"Wrong Password"
            })
            }else{ form.setError('email' , {
                type:"server",
                message: data.Message
            })}

            setbuttons((e) => ({ ...e, login: false }));

        }catch(e){ 
            setServerError(true);
            form.setError('email' , {
                type:"server",
                message: "Server error try again after some time"
            })
            setbuttons((e) => ({ ...e, login: false }));
        }
    };

    const verifybtnClicked =  ()=> {  // console.log("loginBtnClicked");
                setbuttons((e) => ({ ...e, verify: true }));
         setTimeout(()=>{
     setbuttons((e) => ({ ...e, verify: false }));

        } , 15000) //15sec
     };

    const verify = async (payload:verifyemailSchema)=>{
        verifybtnClicked();
         try{
            const {data} = await api.post<Result<unknown>>("auth/Verifyemail" , payload);
            // console.log(data);
            verifyform.setError('email' , {
                type:"server",
                message: data.Message 
            })
            if(data.Success){
                setpopup("Verification Email Sent Successfully. Please check your email to verify your account.");
                return;
            }
            setpopup(data.Message);
                         setbuttons((e) => ({ ...e, verify: false }));

        }catch(e){  
            setServerError(true);
            verifyform.setError('email' , {
                type:"server",
                message: "Internal server Error Try again After some time " 
            })
                        setbuttons((e) => ({ ...e, verify: false }));

        }
    }


    return(
    <>
    <ServerError error={serverError} setservererror={() => setServerError(false)}/>
    
    {btns.forget && btns.forget === true && <Forgetpass setpopup={setpopup} setbuttons = {setbuttons} />}
    {popup && <AlerPopup setpopup={() => setpopup("")} Message={popup} />}
    <div className="flex min-h-screen flex-col">
        <div className="flex flex-1 items-center justify-center py-6">
        <div className="w-[80vw] lg:w-[35vw]  md:w-[45vh] h-fitcontent xl:w-[25vw] rounded-3xl shadow ">
            <div className="w-full h-[30%]" > <Link href={"./"}><Image src="/DineSpace.png" width={11120} height={220} loading="eager" className=" w-full h-full rounded-3xl" alt="" /></Link> </div>
            <div className=" mt-1 flex flex-col p-5  gap-4 text-[#1B1C1A] text-[18px]" style={{fontWeight:"400"}}> 
                <form onSubmit={form.handleSubmit(login)} className="flex flex-col gap-3">
                    <label htmlFor="email">Enter Email Address:</label>
                    <div className={`${form.formState.errors.email? "border border-red-500":""} flex items-center p-3 shadow rounded`}>
                        <MailQuestionMark className='text-[#17375E] mr-2' />
                        <input
                            id="email"
                            className="bg-transparent w-full h-full outline-none"
                            type="email"
                            placeholder="example@Dinespace.com"
                            {...form.register('email')}
                        />
                    </div>
                    {form.formState.errors.email && (
                        <span className="text-red-500 text-sm">{form.formState.errors.email.message as string}</span>
                    )}

                    <div className=" flex justify-between">
                        <label htmlFor="password">Password:</label>
                        <span onClick={()=>setbuttons((e)=>({...e , forget:!btns.forget}))} className="text-[12px] font-bold text-[#A13924] cursor-pointer">Forget Password?</span>
                    </div>
                    <div className={`flex items-center p-3 shadow rounded ${form.formState.errors.password? "border border-red-500":""}`}>
                        <Lock className='text-[#17375E] mr-2' />
                        <input
                            id="password"
                            className={`bg-transparent w-full h-full outline-none `}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Your Password"
                            {...form.register('password')}
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((visible) => !visible)}
                            className="text-[#17375E] cursor-pointer"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {form.formState.errors.password && (
                        <span className={`text-red-500 text-sm`}>{form.formState.errors.password.message as string}</span>
                    )}

                    <button type="submit" disabled = {btns.login} className="bg-[#A13924] flex items-center justify-center rounded h-8 text-white cursor-pointer hover:scale-98 transition-all duration-500 " 
                    >Sign In {btns.login?<Loader  className={`ml-2 animate-spin `}  />:<LogIn className='ml-2' />}</button>

                    <button
                        type="button"
                        disabled={btns.login}
                        onClick={() => {
                            form.setValue("email", "mubin9516@gmail.com");
                            form.setValue("password", "Mubin@11");
                            login({ email: "mubin9516@gmail.com", password: "Mubin@11" });
                        }}
                        className="flex h-8 items-center justify-center rounded border border-[#DEC0BA] bg-[#FFF8F6] text-xs font-semibold text-[#A13924] cursor-pointer hover:bg-[#FBECE8] transition-all hover:scale-98"
                    >
                         One-Click Dummy Login (Demo Owner)
                    </button>
                </form>

                <button  className=" rounded h-8 text-[#040505] border-2 border-[#17375E] cursor-pointer hover:scale-98 transition-all duration-500" 
                onClick={()=>{ const a = !showForm; setShowform(a)}}> Sign Up & Serve Better</button>
                
                {showForm && showForm == true ?
                <form onSubmit={verifyform.handleSubmit(verify)}>
                    <div className='flex flex-col  gap-1 bg-gray-200 rounded shadow p-2 transition-all duration-1100 '>
                        <label htmlFor="">Enter Email Address:</label>
                        <div className='flex flex-1 items-center gap-2 flex-wrap justify-between'>
                            <div className='flex items-center bg-white rounded shadow h-8 w-[65%] pl-3 pr-2'>
                                <MailQuestionMark className='text-[#17375E] mr-2' />
                                <input className="bg-transparent w-full h-full outline-none" type="email" {...verifyform.register('email')} placeholder="example@Dinespace.com"/>
                            </div>
                       
                            <button type="submit" disabled = {btns.verify} className='bg-[#A13924] w-fit pl-2 pr-2 rounded flex items-center h-8 text-white cursor-pointer hover:scale-98 transition-all duration-500'>{btns.verify? <>Sending <Loader className='ml-2 animate-spin' /></> : "Send Email"}</button>
                                 {verifyform.formState.errors.email && (
                                 <span className="text-red-500 text-sm">{verifyform.formState.errors.email.message}</span>
                                 )}
                        </div>
                    </div>
                </form>
                :""}
            </div>
            <div className='h-10 w-full text-[#A13924]  cursor-pointer flex justify-around items-center' style={{borderRadius:"0px 0px 10px 10px", boxShadow:"0px -1px 0px 0px"}}>
                <Link href='/'> About DineSpace</Link>
                <a href='mailto:'> Support@DineSpace.com</a>
            </div>

        </div>
        </div>
    </div>
    </>
    );
}

interface ForgetpassProps {
    setbuttons: Dispatch<SetStateAction<{ login: boolean; verify: boolean; forget: boolean }>>;
    setpopup: Dispatch<SetStateAction<string>>;
}
function Forgetpass({setbuttons, setpopup}:ForgetpassProps) {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleforgetpass = async () => {
        setError(null);
        if(email.trim() === ""){
            setError("Please enter your email address.");
            return;
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setError("Please enter a valid email address.");
            return;
        }
        try {
            setIsSubmitting(true);
            const {data} = await api.get<Result<unknown>>("auth/forgetpassword/" + email);
            if(data.Success){
                setpopup("Password reset link sent to your email. Please check your inbox.");
                setbuttons((e) => ({ ...e, forget: false }));
            }
            setpopup(data.Message);
            console.log(data);
        }catch (error) {
            console.error("Error handling forget password:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <div className='fixed inset-0 flex items-center  justify-center bg-[#0000005d]'>
            <div className='bg-[#FFF5F1] min-w-[20vw] w-fit h-fit p-5 text-[#a13924] rounded shadow flex flex-col gap-5 '>
            <span className='flex justify-between flex-col gap-2'>
            <label htmlFor="email" className='font-semibold'>Enter Your Email:</label>
            <input type="text"  className='border border-[#] p-2' onChange={(e) => setEmail(e.target.value)}/>
            {error && <span className='text-[12px] text-[#A13924]'>{error}</span>}
            <span className='flex gap-5 justify-end'>
                <button className='bg-[#A13924] text-white rounded h-8 pl-4 pr-4 flex flex-row items-center justify-center' onClick={()=>{handleforgetpass()}} disabled={isSubmitting}>
                    {isSubmitting ? <span className='flex flex-row justify-center items-center gap-2'>Sending <Loader className='animate-spin' /></span> : "Send"}
                </button>
                <button className='border border-[#A13924] hover:bg-[#A13924] hover:text-white duration-200 cursor-pointer rounded h-8 w-20' onClick={() => 
                     setbuttons((e: { login: boolean; verify: boolean; forget: boolean }) => ({ ...e, forget: false }))}>Cancel</button>
            </span>
            </span>
            </div>
        </div>
        </>
    )
}