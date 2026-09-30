"use client"

import AlerPopup from "@/components/alertPopup";
import Load from "@/components/load";
import { api } from "@/lib/api/axios";
import Result from "@/lib/Result";
import { CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "zod";
import { da } from "zod/v4/locales";

export default function PasswordResetPage() {
    const [resetpassword, setResetPassword] = useState<{ password: string; confirmPassword: string }>({
        password: "",
        confirmPassword: "",
    });
    const [tokenerror , setTokenError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [popup, setPopup] = useState("");
    const [loading, setLoading] = useState(true);
    const token = useParams(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get<Result<unknown>>(`/verification-request/verify/${token.id}`);
                if (!data.Success) {
                    setPopup(data.Message || "Verification failed.");
                    setTokenError(true);
                    setLoading(false);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setPopup("Error occurred while verifying the request.");
            }
        };
        fetchData();
    }, [token.id]);

    const handleResetPass = async () => {
        console.log("Resetting password with token:", token.id, "and new password:", resetpassword.password);
        try {
            const { data } = await api.post<Result<unknown>>(`/verification-request/resetPassword/${token.id}?password=${resetpassword.password}`);
            if (!data.Success) {
                setPopup(data.Message || "Password reset failed.");
                return;
            }
            setPopup(`Password reset successful. You can now log in with your new password. <link href="/"> Login</link>`);
        } catch (error) {
            console.error("Error resetting password:", error);
            setPopup("Error occurred while resetting the password.");
        }
    }

    const passwordsMatch =
        resetpassword.password.length > 0 &&
        resetpassword.confirmPassword.length > 0 &&
        resetpassword.password === resetpassword.confirmPassword;

    return (
        <>
            {popup && <AlerPopup setpopup={() => setPopup("")} Message={popup} />}
            { tokenerror ? <div className="min-h-screen bg-[#f9f5f1] px-4 py-8 sm:px-6 lg:px-8 text-[#A13924] items-center flex justify-center text-2xl" > <Link href="/"> Explore DineSpace.</Link></div> : !loading ? 
            <div className="min-h-screen bg-[#f9f5f1] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-[32px] border border-[#e8ddd0] bg-white shadow-[0_25px_80px_rgba(118,75,51,0.12)]">
                    <div className="hidden w-1/2 bg-[radial-gradient(circle_at_top_left,_#f4d9c7,_#a13924_42%,_#472117)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                                <Sparkles size={14} />
                                Secure access
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <p className="text-sm uppercase tracking-[0.28em] text-white/70">DineSpace</p>
                                <h1 className="max-w-sm text-4xl font-bold leading-tight">Create a new password for your account.</h1>
                            </div>

                            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white/70">Password security</p>
                                        <p className="text-lg font-semibold">Protected & encrypted</p>
                                    </div>
                                </div>
                                <p className="text-sm leading-6 text-white/75">
                                    Use a strong password with at least 8 characters, a mix of upper and lower case letters, numbers, and symbols.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-white/80">
                            <CheckCircle2 size={18} className="text-[#f9d7c7]" />
                            Your account stays protected after reset.
                        </div>
                    </div>

                    <div className="flex w-full items-center justify-center bg-[#fffdfb] p-6 sm:p-10 lg:w-1/2">
                        <div className="w-full max-w-md">
                            <div className="mb-8 text-center lg:text-left">
                                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7ede6] text-[#a13924] shadow-sm">
                                    <LockKeyhole size={26} />
                                </div>
                                <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#a13924]">Reset password</p>
                                <h2 className="mt-3 text-3xl font-bold text-[#1b1c1a]">Set a new password</h2>
                                <p className="mt-2 text-sm text-[#5f6163]">Please enter your new password below to continue.</p>
                            </div>

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor="new-password" className="text-sm font-medium text-[#1f2430]">
                                        New password
                                    </label>
                                    <div className="flex items-center gap-3 rounded-2xl border border-[#eaded5] bg-white px-4 py-3 shadow-sm transition focus-within:border-[#a13924] focus-within:ring-2 focus-within:ring-[#a13924]/10">
                                        <LockKeyhole size={18} className="text-[#7d7d7d]" />
                                        <input
                                            id="new-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={resetpassword.password}
                                            onChange={(e) => setResetPassword({ ...resetpassword, password: e.target.value })}
                                            className="w-full border-none bg-transparent text-sm text-[#1f2430] placeholder:text-[#9aa0a6] outline-none"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="text-[#5d6470] transition hover:text-[#1f2430]"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirm-password" className="text-sm font-medium text-[#1f2430]">
                                        Confirm password
                                    </label>
                                    <div className="flex items-center gap-3 rounded-2xl border border-[#eaded5] bg-white px-4 py-3 shadow-sm transition focus-within:border-[#a13924] focus-within:ring-2 focus-within:ring-[#a13924]/10">
                                        <LockKeyhole size={18} className="text-[#7d7d7d]" />
                                        <input
                                            id="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter new password"
                                            value={resetpassword.confirmPassword}
                                            onChange={(e) =>
                                                setResetPassword({ ...resetpassword, confirmPassword: e.target.value })
                                            }
                                            className="w-full border-none bg-transparent text-sm text-[#1f2430] placeholder:text-[#9aa0a6] outline-none"
                                        />
                                        <button
                                            type="button"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="text-[#5d6470] transition hover:text-[#1f2430]"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-[#f7f1ee] px-4 py-3 text-sm text-[#4c5968]">
                                    <p className="font-medium text-[#2e3340]">Password requirements</p>
                                    <ul className="mt-2 space-y-1 text-[#5a646f]">
                                        <li>• At least 8 characters</li>
                                        <li>• One uppercase and one lowercase letter</li>
                                        <li>• One number and one special character</li>
                                    </ul>
                                </div>

                                {resetpassword.confirmPassword.length > 0 && (
                                    <p
                                        className={`text-sm ${
                                            passwordsMatch ? "text-emerald-600" : "text-red-500"
                                        }`}
                                    >
                                        {passwordsMatch ? "Passwords match." : "Passwords do not match."}
                                    </p>
                                )}

                                <button
                                    type="button"
                                    disabled={!passwordsMatch}
                                    className="w-full rounded-2xl bg-[#a13924] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(161,57,36,0.25)] transition hover:-translate-y-0.5 hover:bg-[#8f3121] disabled:cursor-not-allowed disabled:bg-[#d6b8af] disabled:shadow-none"
                                    onClick={() => {handleResetPass()}}
                                >
                                    Reset password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : <Load />}
        </>
    );
}
