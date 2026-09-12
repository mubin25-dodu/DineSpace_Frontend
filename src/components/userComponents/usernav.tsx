"use client"
import { userContext } from "@/lib/context/Context";
import { ArrowLeft, ClipboardList, House, ShieldQuestionMark, Soup } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

interface UsernavProps {
icon1?: React.ReactNode;
goback?: boolean;
icon2?: React.ReactNode;
title: string;
}

export default function Usernav(params:UsernavProps) {
    const {myBowl} = useContext(userContext);
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { href: "/user", label: "Home", icon: House, isActive: pathname === "/user" },
        { href: "/user/myBowl", label: "My Bowl", icon: Soup, isActive: pathname.startsWith("/user/myBowl"), badge: myBowl?.length },
        { href: "/user/myorders", label: "Orders", icon: ClipboardList, isActive: pathname.startsWith("/user/myorders") },
    ];

    return(
        <>
        <div className="sticky top-0 z-40">
            <div className="flex h-14 items-center justify-between border-b border-[#ead8d3] bg-[#FBF9F6]/95 px-3 shadow-sm backdrop-blur-md">
                {params.goback ? (
                    <button
                        type="button"
                        onClick={() => router.back()}
                        aria-label="Go back"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-[#6d514b] transition-colors hover:bg-[#f1e5e1] hover:text-[#A13924]">
                        {params.icon1 || <ArrowLeft size={22} />}
                    </button>
                ) : (
                    <span className="flex h-9 w-9 items-center justify-center">{params.icon1 || <ArrowLeft size={20} />}</span>
                )}
                <span className="text-lg font-bold tracking-tight text-[#A13924]">{params.title || "DineSpace"}</span>
                <span className="flex h-9 w-9 items-center justify-center text-[#6d514b]">{params.icon2 || <ShieldQuestionMark size={20} />}</span>
            </div>
        </div>
        <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <nav aria-label="User navigation" className="mx-auto flex h-15 max-w-md items-center justify-around rounded-xl border border-[#ead8d3] bg-[#FBF9F6]/95 px-1.5 shadow-[0_8px_30px_rgba(115,65,52,0.16)] backdrop-blur-md">
                {navItems.map(({ href, label, icon: Icon, isActive, badge }) => (
                    <Link
                        key={href}
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={`relative flex min-w-18 flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[11px] font-medium transition-all ${
                            isActive
                                ? "bg-[#f4e5e0] text-[#A13924]"
                                : "text-[#806f6b] hover:bg-[#f8efec] hover:text-[#A13924]"
                        }`}
                    >
                        <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                        <span>{label}</span>
                        {badge ? (
                            <span className="absolute -right-0.5 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#A13924] px-1 text-[10px] font-bold text-white ring-2 ring-[#FBF9F6]">
                                {badge}
                            </span>
                        ) : null}
                    </Link>
                ))}
            </nav>
        </div>
        </>
    )
}