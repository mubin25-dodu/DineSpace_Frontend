"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChefHat, GitBranch, Loader2, Sparkles, Utensils } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api/axios";
import Result from "@/lib/Result";
import DepthCarousel from "@/components/DepthCarousel/DepthCarousel";
import ShapeGrid from "@/components/ShapeGrid/ShapeGrid";
import  DinespaceLogo  from "@/components/DinespaceLogo";
import TextType from "@/components/TextType ";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
interface LoginResponse {
  role: string;
  email: string;
  id: string;
}


export default function Home() {
  const router = useRouter();
  const [showProjectPlan, setShowProjectPlan] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [dummyLoginError, setDummyLoginError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const dinerFlowItems = [
    { image: "/Diner/restaurant-browsing.jpg", alt: "A diner browsing nearby restaurants", title: "Discover restaurants", description: "Explore restaurants and find a place that suits your next meal." },
    { image: "/Diner/table-qr-scan.jpg", alt: "A diner scanning a QR code at their table", title: "Scan your table", description: "Scan the table QR code to get started with your in-restaurant order." },
    { image: "/Diner/mobile-ordering.jpg", alt: "A diner placing an order on a phone", title: "Order and pay", description: "Build your order, then choose Cash, bKash, or Nagad at checkout. Digital payment is currently simulated." },
    { image: "/Diner/diner-restaurant-connection.jpg", alt: "A diner connected to the restaurant team", title: "Connect with the restaurant", description: "Your order is shared with the restaurant team as soon as you place it." },
    { image: "/Diner/live-order-tracking.jpg", alt: "A diner checking live order progress", title: "Track your order", description: "Stay informed while the restaurant prepares your order." },
    { image: "/Diner/diner-journeys.jpg", alt: "A diner enjoying the restaurant experience", title: "Enjoy your dining journey", description: "Follow a smoother experience from choosing a restaurant to enjoying your meal." },
  ];
  const restaurantFlowItems = [
    { image: "/Resturent/Staff_managing_restaurant_orders…_20261004172446.jpg", alt: "Restaurant staff managing incoming orders", title: "Manage incoming orders", description: "Restaurant staff can review and manage diner orders as they arrive." },
    { image: "/Resturent/Staff_managing_restaurant_order_…_20261004172442.jpg", alt: "Restaurant staff processing restaurant orders", title: "Process orders", description: "Keep the team coordinated as orders move through preparation and service." },
    { image: "/Resturent/Manager_updating_digital_restaur…_20261004172439.jpg", alt: "A manager updating a restaurant's digital setup", title: "Keep restaurant details up to date", description: "Managers can maintain the digital information diners use when ordering." },
    { image: "/Resturent/Manager_managing_table_QR_codes_20261004172521.jpg", alt: "A manager managing restaurant table QR codes", title: "Manage table QR codes", description: "Organize table QR codes so diners can connect their orders to the right table." },
    { image: "/Resturent/Manager_using_restaurant_workflo…_20261004172529.jpg", alt: "A manager using the restaurant workflow", title: "Run the restaurant workflow", description: "Use connected tools to keep day-to-day restaurant operations moving." },
  ];
  const [selectedFlow, setSelectedFlow] = useState<"diner" | "restaurant">("diner");
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const activeFlowItems = selectedFlow === "diner" ? dinerFlowItems : restaurantFlowItems;

  const handleDummyLogin = async () => {
    setIsLoggingIn(true);
    setDummyLoginError(null);
    try {
      const { data } = await api.post<Result<LoginResponse>>("auth/login", {
        email: "mubin9516@gmail.com",
        password: "Mubin@11",
      });

      if (data.Success && data.Token) {
        localStorage.setItem("accesstoken", data.Token);
        document.cookie = `accesstoken=${encodeURIComponent(data.Token)}; path=/; SameSite=Lax`;

        if (data.Data?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/home");
        }
      } else {
        setDummyLoginError(data.Message || "Login failed. Please try again.");
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("Dummy login error:", error);
      setDummyLoginError("Server error. Please try again in a moment.");
      setIsLoggingIn(false);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
    <main className="min-h-screen bg-[#FBF9F6] text-[#171717]">
      <motion.header
        initial={{ opacity: 0, scale: .99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ease: "easeInOut" }}
        className="fixed inset-x-3 top-3 z-50 mx-auto flex w-auto max-w-7xl items-center justify-between gap-2 rounded-2xl border border-[#DEC0BA]/15 bg-white/95 px-2.5 py-2.5 backdrop-blur-xl transition-all duration-400 sm:inset-x-4 sm:gap-3 sm:px-6 sm:py-4"
      >
        <DinespaceLogo />
        <nav aria-label="Main navigation" className="flex min-w-0 items-center gap-1 sm:gap-3">
          <motion.button
            type="button"
            onClick={handleDummyLogin}
            disabled={isLoggingIn}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Sign in to the demo restaurant owner account"
            title="Demo access signs in to a sample restaurant owner account"
            className="inline-flex items-center gap-1 rounded-lg border border-[#DEC0BA] bg-white px-2 py-2 text-xs font-semibold text-[#A13924] shadow-xs transition hover:bg-[#FDF7F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924] disabled:cursor-not-allowed disabled:opacity-60 sm:gap-1.5 sm:px-3.5 sm:text-sm"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span className="whitespace-nowrap">Logging in...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} className="text-[#C86A52]" />
                <span className="whitespace-nowrap sm:hidden">Demo</span>
                <span className="hidden whitespace-nowrap sm:inline">Demo login</span>
              </>
            )}
          </motion.button>
          <Link
            href="/auth"
            className="hidden rounded-lg px-2 py-2 text-xs font-semibold text-[#735B53] transition hover:bg-[#F4E9E5] hover:text-[#A13924] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924] sm:block sm:px-4 sm:text-sm"
          >
            Restaurant owner?
          </Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/user"
              className="rounded-lg bg-[#A13924] px-2.5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#842F1E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924] sm:px-4 sm:text-sm"
            >
              <span className="sm:hidden">Browse</span>
              <span className="hidden sm:inline">Browse restaurants</span>
            </Link>
          </motion.div>
        </nav>
      </motion.header>
      <div
        className="relative isolate min-h-screen w-full bg-cover bg-center pt-20 sm:pt-24"
        style={{
          backgroundImage:
            "linear-gradient(rgba(22, 13, 10, 0.42), rgba(22, 13, 10, 0.64)), url('/dinespace-landing.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-70">
        <ShapeGrid
          shape="square"
          direction="diagonal"
          lineColor="#2a2734"
          hoverColor="#ffffff"
          hoverFillColor="#ffffff"
          fillOpacity={0.1}
          cellSize={40}
          speed={0.3}
          tiltX={0}
          tiltY={0}
          rainbow={false}
          lineWidth={1}
          radius={1.5}
          trail={0.4}
          glow={0.25}
          twinkle={0}
          fade={1}
          clickCascade
          intro
        />
      </div>
      <motion.div transition={{ duration: 0.4, delay: 0.1 }} initial={{ y: -24 }} animate={{ y: 0 }} className="relative z-10 mx-auto mt-2 max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-[#E7BE78]/80 bg-[#FFF4D8]/95 px-3 py-2.5 text-xs text-[#76511A] shadow-sm sm:flex-nowrap sm:gap-3 sm:px-5 sm:py-3 sm:text-sm">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F2C66D] text-[#76511A] sm:h-8 sm:w-8" aria-hidden="true">
            <GitBranch size={16} />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
            <p className="min-w-0 flex-1 leading-5">
              <span className="font-bold">In active development.</span> Explore what DineSpace does today and what is planned next.
            </p>
            <button
              type="button"
              onClick={() => setShowProjectPlan(true)}
              className="self-start rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#76511A] underline decoration-[#C69A4D] underline-offset-4 transition hover:bg-[#F8E5B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#76511A] sm:shrink-0 sm:self-auto sm:px-3 sm:py-2"
            >
              View roadmap
            </button>
          </div>
        </div>
      </motion.div>

      {/* <Image src="/dinespace-landing.png" alt="DineSpace Landing" width={2000} height={600} className="mx-auto mt-8 max-w-full rounded-lg shadow-lg w-[100vw] h-[100vh]" /> */}

      <section className="relative z-10 mx-auto flex min-h-[70svh] max-w-7xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-10">

        
        <div className="flex w-full flex-col items-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFD18A]/40 bg-[#29140F]/65 px-4 py-2 text-xs font-semibold text-[#FFE0A8] shadow-lg backdrop-blur-sm sm:mb-6 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#FFB454]" />
            Restaurant ordering, automated
          </div>
          <h1 className="mx-auto max-w-4xl text-[2rem] font-bold leading-[1.08] tracking-tight text-[#FFF9F0] sm:text-5xl lg:text-6xl">
            <span className="block sm:inline">Great food. </span>
            <span className="block sm:inline">Seamless ordering.</span>
            <span className="mt-1 block text-[#FFC66E]">All from your table.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#FFF5ED] sm:mt-6 sm:text-lg sm:leading-8">
            Scan the QR code, explore the menu, place your order, and follow its progress — all from your phone.
          </p>
          <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link
              href="/user"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D95638] px-6 py-3.5 font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-[#BD452C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              Explore restaurants
              <ArrowRight size={18} />
            </Link>
            
            <Link
              href="/auth"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/70 bg-[#FFF9F0] px-6 py-3.5 font-semibold text-[#8B321F] transition hover:bg-[#FFE7D8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
            >
              For restaurant owners
            </Link>
           
          </div>
          {dummyLoginError && (
            <div role="alert" className="mt-3 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
              {dummyLoginError}
            </div>
          )}

        </div>
      </section>

      </div>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A13924]">How DineSpace works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#291812] sm:text-4xl">
              From the first scan to the last order update.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#735B53]">
              Explore the customer ordering journey or see how restaurant teams manage service with the tools available today.
            </p>
          </div>
          <div className="mb-6 flex justify-center gap-2" role="group" aria-label="Choose a product flow">
            <button
              type="button"
              aria-pressed={selectedFlow === "diner"}
              onClick={() => {
                setSelectedFlow("diner");
                setActiveFlowStep(0);
              }}
              className={`min-h-11 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924] ${selectedFlow === "diner" ? "bg-[#A13924] text-white shadow-md" : "bg-white/70 text-[#735B53] hover:bg-white"}`}
            >
              Diner flow
            </button>
            <button
              type="button"
              aria-pressed={selectedFlow === "restaurant"}
              onClick={() => {
                setSelectedFlow("restaurant");
                setActiveFlowStep(0);
              }}
              className={`min-h-11 rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924] ${selectedFlow === "restaurant" ? "bg-[#A13924] text-white shadow-md" : "bg-white/70 text-[#735B53] hover:bg-white"}`}
            >
              Restaurant flow
            </button>
          </div>

          <div
            aria-live="polite"
            aria-label={`${selectedFlow === "diner" ? "Diner" : "Restaurant"} product journey`}
            className="grid grid-cols-1 items-center lg:grid-cols-12"
          >
            <div className={`h-[260px] min-w-0 overflow-hidden px-2 py-6 sm:h-[520px] sm:px-4 sm:py-8 lg:h-[560px] lg:col-span-9 lg:px-6 ${selectedFlow === "diner" ? "order-1" : "order-2"}`} >
              <DepthCarousel
                key={selectedFlow}
                items={activeFlowItems}
                depth={170}
                spread={0}
                tilt={180}
                tiltDirection={selectedFlow === "diner" ? "right" : "left"}
                perspective={1400}
                visibleCards={1.5}
                falloff={0.2}
                blur={4}
                autoplay
                loop
                cardWidth={760}
                cardHeight={480}
                radius={18}
                tint="#000000"
                duration={700}
                ease="power3.out"
                autoplayDelay={3000}
                showControls
                showIndicators
                showCaptions={false}
                onChange={(index) => setActiveFlowStep(index)}
              />
            </div>
            <div className={`px-4 py-5 sm:px-8 lg:col-span-3 lg:px-6 ${selectedFlow === "diner" ? "order-2" : "order-1"}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A13924]">
                {selectedFlow === "diner" ? "Diner" : "Restaurant"} flow · {activeFlowStep + 1} of {activeFlowItems.length}
              </p>
              <h3 className="mt-3 text-2xl font-bold text-[#291812] sm:text-3xl">{activeFlowItems[activeFlowStep].title}</h3>
              <p className="mt-4 max-w-lg text-base leading-7 text-[#735B53]">{activeFlowItems[activeFlowStep].description}</p>
              <Link href={selectedFlow === "diner" ? "/user" : "/auth"} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#A13924] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924]">
                {selectedFlow === "diner" ? "Explore restaurants" : "For restaurant owners"} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ y: 20 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{duration:0.5}} className="border-t border-[#EAD8D2] bg-white/60">
        <div className="mx-auto grid max-w-5xl gap-5 px-6 py-16 sm:grid-cols-2 lg:px-10">
          <motion.div initial={{ y: 20 }} whileInView={{y:0}} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 18 , duration: 0.5}} className="rounded-2xl border border-[#EAD8D2] bg-white p-6 shadow-sm">
            <Utensils className="text-[#A13924]" />
            <h2 className="mt-5 text-xl font-semibold">For diners</h2>
            <p className="mt-2 leading-7 text-[#735B53]">
              Scan a table QR code to open the digital menu, place an order from your phone, and follow its progress.
            </p>
            <Link href="/user" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#A13924] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924]">
              Start exploring <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div initial={{ y: 20 }} whileInView={{y:0}} whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 18 , duration: 0.5}} className="rounded-2xl border border-[#EAD8D2] bg-white p-6 shadow-sm">
            <ChefHat className="text-[#A13924]" />
            <h2 className="mt-5 text-xl font-semibold">For restaurant owners</h2>
            <p className="mt-2 leading-7 text-[#735B53]">
              Review incoming orders and manage restaurant details, menus, tables, and service operations from the owner dashboard.
            </p>
            <Link href="/auth" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#A13924] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A13924]">
              Owner sign in <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="border-t border-[#EAD8D2] bg-[#28211E] text-[#FFF9F3]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2C08D]">About this website</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              One connected workspace for diners, restaurant teams, and platform admins.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#E8D9D0] sm:text-base sm:leading-8">
              DineSpace is a full-stack restaurant platform built to make dining more independent
              and restaurant operations more organized. Visitors can browse menus and order from
              their table, while restaurant teams manage the work behind every meal in real time.
            </p>
          </div>
          <div className="rounded-2xl border border-[#6B5148] bg-[#382B27] p-6">
            <p className="text-sm font-semibold text-[#F2C08D]">About This Project</p>
            <p className="mt-3 text-sm leading-7 text-[#E8D9D0]">
              Explore the current product and see what is planned next. The project is actively
              being developed, so this page is also a transparent view of the next milestones.
            </p>
            <button
              type="button"
              onClick={() => setShowProjectPlan(true)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F2C08D] px-5 py-3 font-semibold text-[#382B27] transition hover:bg-[#FFD6A9] sm:w-auto"
            >
              View architecture and plan
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </motion.section>

      {showProjectPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#171717]/70 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-6"
          role="presentation"
          onClick={() => setShowProjectPlan(false)}
        >
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-plan-title"
            className="max-h-[calc(100svh-2rem)] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#EAD8D2] bg-[#FBF9F6] p-5 shadow-2xl sm:max-h-[calc(100svh-3rem)] sm:rounded-3xl sm:p-10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#A13924]">Project roadmap</p>
                <h2 id="project-plan-title" className="mt-2 text-2xl font-bold text-[#171717] sm:text-3xl">
                  How DineSpace is built and where it is going
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close architecture and plan"
                onClick={() => setShowProjectPlan(false)}
                className="rounded-full px-3 py-1 text-2xl leading-none text-[#735B53] transition hover:bg-[#F4E9E5] hover:text-[#A13924]"
              >
                &times;
              </button>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#EAD8D2] bg-white p-5">
                <p className="text-sm font-bold text-[#A13924]">Architecture</p>
                <p className="mt-2 text-sm leading-7 text-[#514947]">
                  A Next.js and React frontend communicates with the backend through REST APIs.
                  Socket.IO provides real-time order updates, while role-based routes separate
                  diner, restaurant owner, and admin experiences.
                </p>
              </div>
              <div className="rounded-2xl border border-[#EAD8D2] bg-white p-5">
                <p className="text-sm font-bold text-[#A13924]">Current focus</p>
                <p className="mt-2 text-sm leading-7 text-[#514947]">
                  Staff Control and Salary Control are currently being developed to help owners
                  organize team access, staff records, compensation, and day-to-day operations.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#EAD8D2] bg-white p-5">
              <p className="text-sm font-bold text-[#A13924]">Plan</p>
              <ol className="mt-3 grid gap-3 text-sm leading-6 text-[#514947] sm:grid-cols-2">
                <li><span className="font-semibold text-[#171717]">01. Core dining flow:</span> menus, table ordering, payment integration, and live order status.</li>
                <li><span className="font-semibold text-[#171717]">02. Restaurant control:</span> staff permissions, salary tracking, menus, tables, and payouts.</li>
                <li><span className="font-semibold text-[#171717]">03. Admin visibility:</span> restaurant oversight, withdrawals, and platform reporting.</li>
                <li><span className="font-semibold text-[#171717]">04. Refinement:</span> testing, performance improvements, and a smoother mobile experience.</li>
              </ol>
            </div>

            <motion.button
              type="button"
              onClick={() => setShowProjectPlan(false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-7 w-full rounded-xl bg-[#A13924] px-5 py-3 font-semibold text-white transition hover:bg-[#842F1E] sm:w-auto"
            >
              Back to DineSpace
            </motion.button>
          </motion.section>
        </motion.div>
      )}

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-7 text-sm text-[#8B7168] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span>© { new Date().getFullYear() > 2025 ? `${2025} - ${new Date().getFullYear()}` : new Date().getFullYear() } DineSpace</span>
        <span className="flex flex-wrap items-center gap-1">
          Made for better dining experiences by
          <a
            href="https://mu-bin.dev"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#A13924] underline decoration-[#DDBDB3] underline-offset-4 transition hover:text-[#842F1E]"
          >
           {shouldReduceMotion ? "Mu-bin.dev" : <TextType
              text={["Mu-bin.dev", "MD. Abdullah Al Mubin"]}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              // texts={["Mu-bin.dev", "MD. Abdullah Al Mubin", "Happy coding!"]}
              deletingSpeed={50}
              // variableSpeedEnabled={false}
              // variableSpeedMin={60}
              // variableSpeedMax={120}
              cursorBlinkDuration={0.5}
            />}
          </a>
          .
        </span>
      </footer>
    </main>
    </MotionConfig>
  );
}
