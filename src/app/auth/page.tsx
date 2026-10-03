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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/55 p-4 backdrop-blur-sm">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="forgot-password-title"
                aria-describedby="forgot-password-description"
                className="w-full max-w-md overflow-hidden rounded-3xl border border-[#E6C5BC] bg-[#FBF9F6] shadow-2xl"
            >
                <div className="border-b border-[#EAD8D2] bg-[#FFF5F1] px-6 py-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F5DED7] text-[#A13924]">
                        <MailQuestionMark size={23} />
                    </div>
                    <h2 id="forgot-password-title" className="text-xl font-bold text-[#2F2724]">
                        Forgot your password?
                    </h2>
                    <p id="forgot-password-description" className="mt-1 text-sm leading-6 text-[#735B53]">
                        Enter the email address linked to your account and we’ll send you a reset link.
                    </p>
                </div>

                <form
                    className="space-y-5 px-6 py-6"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void handleforgetpass();
                    }}
                >
                    <div className="space-y-2">
                        <label htmlFor="forgot-password-email" className="block text-sm font-semibold text-[#352C29]">
                            Email address
                        </label>
                        <input
                            id="forgot-password-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? "forgot-password-error" : undefined}
                            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#2F2724] outline-none transition placeholder:text-[#A9958D] focus:ring-4 ${
                                error
                                    ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                                    : "border-[#E6D7D1] focus:border-[#A13924] focus:ring-[#A13924]/10"
                            }`}
                        />
                        {error && (
                            <p id="forgot-password-error" role="alert" className="text-sm text-[#A13924]">
                                {error}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setbuttons((state) => ({ ...state, forget: false }))}
                            className="rounded-xl border border-[#D9B7AD] px-5 py-2.5 text-sm font-semibold text-[#7A3426] transition hover:bg-[#F8EAE5] focus:outline-none focus:ring-4 focus:ring-[#A13924]/10 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-[#A13924] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#842F1E] focus:outline-none focus:ring-4 focus:ring-[#A13924]/20 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <>
                                    Sending
                                    <Loader size={17} className="animate-spin" />
                                </>
                            ) : (
                                "Send reset link"
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    )
}