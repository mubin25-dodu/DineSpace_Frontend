"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChefHat, CircleCheck, ClipboardList, Utensils } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showDeveloperStory, setShowDeveloperStory] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#FBF9F6] text-[#171717]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-[#A13924] sm:text-2xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A13924] text-white sm:h-10 sm:w-10 sm:rounded-xl">
            <Utensils size={19} />
          </span>
          DineSpace
        </Link>
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <Link
            href="/auth"
            className="hidden rounded-lg px-2 py-2 text-xs font-semibold text-[#735B53] transition hover:bg-[#F4E9E5] hover:text-[#A13924] sm:block sm:px-4 sm:text-sm"
          >
            Restaurant owner?
          </Link>
          <Link
            href="/user"
            className="rounded-lg bg-[#A13924] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#842F1E] focus:outline-none focus:ring-2 focus:ring-[#A13924]/20 sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">Browse</span>
            <span className="hidden sm:inline">Browse restaurants</span>
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-8 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-28 lg:pt-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F1D8D0] bg-[#FDF7F5] px-3 py-1.5 text-xs font-medium text-[#A13924] sm:mb-6 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#C86A52]" />
            Restaurant ordering, automated
          </div>
          <h1 className="max-w-xl text-[2.75rem] font-bold leading-[1.08] tracking-tight text-[#171717] sm:text-6xl">
            Order what you want.{" "}
            <span className="text-[#A13924]">Without waiting for a waiter.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-[#514947] sm:mt-6 sm:text-lg sm:leading-8">
            DineSpace automates the restaurant ordering experience. Browse the menu from your
            table, see what is special today, and place your order whenever you are ready.
            No repeated calls, no waiting just to ask a question.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link
              href="/user"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#A13924] px-6 py-3.5 font-semibold text-white transition hover:bg-[#842F1E] sm:w-auto"
            >
              Explore restaurants
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/auth"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#DDBDB3] bg-white px-6 py-3.5 font-semibold text-[#A13924] transition hover:bg-[#FFF3EE] sm:w-auto"
            >
              Manage your restaurant
            </Link>
            <button
              type="button"
              onClick={() => setShowDeveloperStory(true)}
              className="inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 font-semibold text-[#735B53] transition hover:bg-[#F4E9E5] hover:text-[#A13924] sm:w-auto"
            >
              Developer Story
            </button>
          </div>
          <div className="mt-8 grid max-w-md grid-cols-1 gap-3 border-t border-[#EAD8D2] pt-5 text-sm text-[#735B53] sm:mt-10 sm:grid-cols-2 sm:gap-4 sm:pt-6">
            <span className="flex items-center gap-2">
              <CircleCheck size={17} className="text-[#A13924]" />
              Browse the menu yourself
            </span>
            <span className="flex items-center gap-2">
              <CircleCheck size={17} className="text-[#A13924]" />
              Order without the wait
            </span>
          </div>
        </div>

        <div className="relative mt-2 sm:mt-0">
          <div className="absolute -inset-4 rounded-4xl bg-[#EFD8CF] opacity-60 blur-2xl" />
          <div className="relative overflow-hidden rounded-4xl border-8 border-white bg-white shadow-2xl">
            <Image
              src="/dinespace-landing.png"
              alt="Guests enjoying a meal together in a warm restaurant"
              width={1365}
              height={768}
              priority
              className="h-auto w-full object-cover"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/40 bg-[#171717]/75 p-4 text-white backdrop-blur-md">
              <p className="text-sm font-medium text-[#F3D4C9]">Your next favorite place</p>
              <p className="mt-1 text-lg font-semibold">Good food is better together.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#EAD8D2] bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-5 px-6 py-16 sm:grid-cols-3 lg:px-10">
          <div className="rounded-2xl border border-[#EAD8D2] bg-white p-6">
            <Utensils className="text-[#A13924]" />
            <h2 className="mt-5 text-xl font-semibold">For diners</h2>
            <p className="mt-2 leading-7 text-[#735B53]">
              Browse the menu, discover today&apos;s specials, and place an order from your table
              without having to call a waiter every time.
            </p>
            <Link href="/user" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#A13924]">
              Start exploring <ArrowRight size={16} />
            </Link>
          </div>
          <div className="rounded-2xl border border-[#EAD8D2] bg-white p-6">
            <ChefHat className="text-[#A13924]" />
            <h2 className="mt-5 text-xl font-semibold">For restaurant owners</h2>
            <p className="mt-2 leading-7 text-[#735B53]">
              Automate order collection while keeping menus, tables, payments, and service
              operations organized in one workspace.
            </p>
            <Link href="/auth" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#A13924]">
              Owner sign in <ArrowRight size={16} />
            </Link>
          </div>
          <div className="rounded-2xl border border-[#EAD8D2] bg-white p-6">
            <ClipboardList className="text-[#A13924]" />
            <h2 className="mt-5 text-xl font-semibold">One connected space</h2>
            <p className="mt-2 leading-7 text-[#735B53]">
              Guests get a faster, more independent experience while restaurant teams spend less
              time taking repetitive requests and more time delivering great hospitality.
            </p>
          </div>
        </div>
      </section>

      {showDeveloperStory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#171717]/60 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-6"
          role="presentation"
          onClick={() => setShowDeveloperStory(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="developer-story-title"
            className="flex max-h-[calc(100svh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#EAD8D2] bg-[#FBF9F6] p-5 shadow-2xl sm:max-h-[calc(100svh-3rem)] sm:rounded-3xl sm:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between gap-3 sm:gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A13924] sm:text-sm sm:tracking-[0.16em]">
                  Why DineSpace exists
                </p>
                <h2 id="developer-story-title" className="mt-2 text-2xl font-bold leading-tight text-[#171717] sm:text-3xl">
                  A small frustration became a better way to dine.
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close developer story"
                onClick={() => setShowDeveloperStory(false)}
                className="shrink-0 rounded-full px-2 py-1 text-2xl leading-none text-[#735B53] transition hover:bg-[#F4E9E5] hover:text-[#A13924] sm:px-3"
              >
                &times;
              </button>
            </div>
            <div className="mt-5 min-h-0 overflow-y-auto space-y-4 pr-1 text-sm leading-7 text-[#514947] sm:mt-6 sm:text-base sm:leading-8">
              <p>
                I built DineSpace from a simple personal frustration: having to call a waiter
                whenever I wanted to see the menu, ask what was special today, or place another
                order.
              </p>
              <p>
                Sometimes the restaurant was busy, sometimes I had to wait, and sometimes I felt
                uncomfortable calling someone over for something that should have been simple.
                Dining should feel relaxed, not like a series of interruptions.
              </p>
              <p>
                DineSpace is my attempt to solve that problem. Guests can explore the menu,
                discover specials, and order when they are ready, while restaurant teams receive
                organized orders without repeating the same information at every table.
              </p>
            </div>
            <div className="mt-6 flex shrink-0 justify-stretch sm:mt-8 sm:justify-end">
              <button
                type="button"
                onClick={() => setShowDeveloperStory(false)}
                className="w-full rounded-xl bg-[#A13924] px-5 py-3 font-semibold text-white transition hover:bg-[#842F1E] sm:w-auto"
              >
                Back to DineSpace
              </button>
            </div>
          </section>
        </div>
      )}

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-7 text-sm text-[#8B7168] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span>© {new Date().getFullYear()} DineSpace</span>
        <span>Made for better dining experiences.</span>
      </footer>
    </main>
  );
}
