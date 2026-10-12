import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";
import DinespaceLogo from "../DinespaceLogo";

const footerLinks = [
    { href: "/user", label: "Browse restaurants" },
    { href: "/user/myBowl", label: "My bowl" },
    { href: "/user/myorders", label: "My orders" },
];

export default function UserFooter() {
    return (
        <footer className="border-t border-[#ead8d3] bg-[#f4ece7] pb-28 md:pb-0">
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] md:gap-12 md:px-10 md:py-14">
                <div>
                    <DinespaceLogo />
                    <p className="mt-5 max-w-sm text-sm leading-6 text-[#806f6b]">
                        Discover memorable meals from the best local restaurants, all in one place.
                    </p>
                    <div className="mt-6 flex items-center gap-2">
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="DineSpace on Instagram"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dec0ba] bg-[#fbf9f6] text-[#A13924] transition-colors hover:bg-[#A13924] hover:text-white"
                        >
                            <FaInstagram size={17} />
                        </a>
                        <a
                            href="mailto:hello@dinespace.com"
                            aria-label="Email DineSpace"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dec0ba] bg-[#fbf9f6] text-[#A13924] transition-colors hover:bg-[#A13924] hover:text-white"
                        >
                            <Mail size={17} />
                        </a>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#3b3939]">Explore</h2>
                    <nav aria-label="Footer navigation" className="mt-5 flex flex-col items-start gap-3">
                        {footerLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="group inline-flex items-center gap-1 text-sm text-[#806f6b] transition-colors hover:text-[#A13924]"
                            >
                                {link.label}
                                <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                        ))}
                    </nav>
                </div>

                <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-[#3b3939]">Get in touch</h2>
                    <div className="mt-5 flex flex-col gap-4 text-sm text-[#806f6b]">
                        <a className="flex items-start gap-3 transition-colors hover:text-[#A13924]" href="mailto:hello@dinespace.com">
                            <Mail size={17} className="mt-0.5 shrink-0 text-[#A13924]" />
                            <span>hello@dinespace.com</span>
                        </a>
                        <a className="flex items-start gap-3 transition-colors hover:text-[#A13924]" href="tel:+8801700000000">
                            <Phone size={17} className="mt-0.5 shrink-0 text-[#A13924]" />
                            <span>+880 1700 000 000</span>
                        </a>
                        <span className="flex items-start gap-3">
                            <MapPin size={17} className="mt-0.5 shrink-0 text-[#A13924]" />
                            <span>Serving food lovers everywhere</span>
                        </span>
                    </div>
                </div>
            </div>
            <div className="border-t border-[#dec0ba]">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-[#806f6b] sm:px-8 md:flex-row md:items-center md:justify-between md:px-10">
                    <p>© {new Date().getFullYear()} DineSpace. All rights reserved.</p>
                    <p>Made for good food and great company.</p>
                </div>
            </div>
        </footer>
    );
}
