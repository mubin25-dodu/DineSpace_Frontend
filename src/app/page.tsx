"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChefHat, CircleCheck, ClipboardList, Utensils } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showDeveloperStory, setShowDeveloperStory] = useState(false);

  return (
    <main className="min-h-screen overflow-hidden bg-[#FBF9F6] text-[#171717]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#A13924]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#A13924] text-white">
            <Utensils size={21} />
          </span>
          DineSpace
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#735B53] transition hover:bg-[#F4E9E5] hover:text-[#A13924]"
          >
            Restaurant owner?
          </Link>
          <Link
            href="/user"
            className="rounded-lg bg-[#A13924] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#842F1E] focus:outline-none focus:ring-2 focus:ring-[#A13924]/20"
          >
            Browse restaurants
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-28 lg:pt-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#F1D8D0] bg-[#FDF7F5] px-3 py-1.5 text-sm font-medium text-[#A13924]">
            <span className="h-2 w-2 rounded-full bg-[#C86A52]" />
            Restaurant ordering, automated
          </div>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.08] tracking-tight text-[#171717] sm:text-6xl">
            Order what you want.{" "}
            <span className="text-[#A13924]">Without waiting for a waiter.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-[#514947]">
            DineSpace automates the restaurant ordering experience. Browse the menu from your
            table, see what is special today, and place your order whenever you are ready.
            No repeated calls, no waiting just to ask a question.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/user"
              className="inline-flex items-center gap-2 rounded-xl bg-[#A13924] px-6 py-3.5 font-semibold text-white transition hover:bg-[#842F1E]"
            >
              Explore restaurants
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center gap-2 rounded-xl border border-[#DDBDB3] bg-white px-6 py-3.5 font-semibold text-[#A13924] transition hover:bg-[#FFF3EE]"
            >
              Manage your restaurant
            </Link>
            <button
              type="button"
              onClick={() => setShowDeveloperStory(true)}
              className="inline-flex items-center rounded-xl px-5 py-3.5 font-semibold text-[#735B53] transition hover:bg-[#F4E9E5] hover:text-[#A13924]"
            >
              Developer Story
            </button>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-4 border-t border-[#EAD8D2] pt-6 text-sm text-[#735B53]">
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

        <div className="relative">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/60 px-5 py-6 backdrop-blur-sm"
          role="presentation"
          onClick={() => setShowDeveloperStory(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="developer-story-title"
            className="w-full max-w-2xl rounded-3xl border border-[#EAD8D2] bg-[#FBF9F6] p-7 shadow-2xl sm:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#A13924]">
                  Why DineSpace exists
                </p>
                <h2 id="developer-story-title" className="mt-2 text-3xl font-bold text-[#171717]">
                  A small frustration became a better way to dine.
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close developer story"
                onClick={() => setShowDeveloperStory(false)}
                className="rounded-full px-3 py-1 text-2xl leading-none text-[#735B53] transition hover:bg-[#F4E9E5] hover:text-[#A13924]"
              >
                &times;
              </button>
            </div>
            <div className="mt-6 space-y-4 text-base leading-8 text-[#514947]">
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
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDeveloperStory(false)}
                className="rounded-xl bg-[#A13924] px-5 py-3 font-semibold text-white transition hover:bg-[#842F1E]"
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
