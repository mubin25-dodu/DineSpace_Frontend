import Image from "next/image"

export default function userHero() {
    return (
        <section className="relative h-svh w-full overflow-hidden scrollbar-none bg-[#291812]">
            <Image
                className="h-full w-full object-cover object-center rounded-[0_0_150px_0]"
                src="/user_hero.png"
                alt="Guests enjoying a meal in a warmly lit restaurant"
                sizes="100vw"
                priority
                fill
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1b0d09]/90 via-[#1b0d09]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-20 z-10 max-w-xl px-7 pb-20 text-[#fffaf3]">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#f4b183]">
                    DineSpace
                </p>
                <h1 className="max-w-xs text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                    Your table. Your food.
                    <span className="mt-2 block text-[#ffe0bd]">Your experience.</span>
                </h1>
                <p className="mt-5 max-w-xs text-sm leading-6 text-[#fff3e6]/85">
                    Make every meal worth remembering.
                </p>
            </div>
           
        </section>
    )
}