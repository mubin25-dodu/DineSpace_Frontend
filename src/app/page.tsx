"use client";

import Image from "next/image";
import FlexCarousel from "@/components/FlexCarousel/FlexCarousel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ChefHat, CircleCheck, ClipboardList, GitBranch, Loader2, LogIn, Sparkles, Store, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/axios";
import Result from "@/lib/Result";
import { Restaurant } from "@/lib/interfaces/order";
import Imagepath from "@/lib/algorithms/Imagepath";
import LatticeLoader from "@/components/LatticeLoader/LetticalLoader";
import Counter from "@/components/Counter/Counter";
import DepthCarousel from "@/components/DepthCarousel/DepthCarousel";

interface LoginResponse {
  role: string;
  email: string;
  id: string;
}


export default function Home() {
  const router = useRouter();
  const [showDeveloperStory, setShowDeveloperStory] = useState(false);
  const [showProjectPlan, setShowProjectPlan] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [dummyLoginError, setDummyLoginError] = useState<string | null>(null);
  const [resturants, setresturants] = useState<Restaurant[]>();
  const dinerFlowItems = [
    { image: "/Diner/restaurant-browsing.jpg", alt: "A diner browsing nearby restaurants", title: "Discover restaurants", description: "Explore restaurants and find a place that suits your next meal." },
    { image: "/Diner/table-qr-scan.jpg", alt: "A diner scanning a QR code at their table", title: "Scan your table", description: "Scan the table QR code to get started with your in-restaurant order." },
    { image: "/Diner/mobile-ordering.jpg", alt: "A diner placing an order on a phone", title: "Browse and order", description: "Browse the menu, choose your favorites, and place your order from your phone." },
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
  const [items, setItems] = useState([
    { src: 'public/images/one.jpg', alt: 'A chrome sculpture', title: 'Iridescence', resturentLink: '/user' },
  ]);

  const getresturants = async () => {
              try {
                  const {data} = await api.get<Result<Restaurant[]>>("resturant/getAllResturants");
                  console.log(data);
                  if (data?.Success) {
                      setresturants(data.Data ?? []);
                  }
              } catch (e) {
                  console.log(e);
              }
          };

          useEffect(() => {
              setItems(resturants?.filter((e)=>e.coverFile).map((resturant) => ({
                  src: Imagepath(resturant.coverFile!.Path),
                  alt: resturant.resturantName,
                  title: resturant.resturantName,
                  resturentLink: `/resturant/${resturant.id}`
              })) ?? []);
          }, [resturants]);

  useEffect(() => {
    getresturants();
  }, []);

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


    <main className="min-h-screen overflow-hidden bg-[#FBF9F6] text-[#171717]">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-[#A13924] sm:text-2xl">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#A13924] text-white sm:h-10 sm:w-10 sm:rounded-xl">
            <Utensils size={19} />
          </span>
          DineSpace
        </Link>
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={handleDummyLogin}
            disabled={isLoggingIn}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#DEC0BA] bg-white px-2.5 py-2 text-xs font-semibold text-[#A13924] shadow-xs transition hover:bg-[#FDF7F5] disabled:cursor-not-allowed disabled:opacity-60 sm:px-3.5 sm:text-sm"
            title="Instant login as Demo Restaurant Owner (mubin9516@gmail.com)"
          >
            {isLoggingIn ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} className="text-[#C86A52]" />
                <span>Dummy Login</span>
              </>
            )}
          </button>
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

      <div className="mx-auto mt-2 max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-3 rounded-2xl border border-[#E7BE78] bg-[#FFF4D8] px-4 py-3 text-sm text-[#76511A] shadow-sm sm:px-5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F2C66D] text-[#76511A]" aria-hidden="true">
            <GitBranch size={16} />
          </span>
          <p className="flex-1">
            <span className="font-bold">In development:</span> DineSpace is actively growing with new restaurant operations tools.
          </p>
          <button
            type="button"
            onClick={() => setShowProjectPlan(true)}
            className="hidden shrink-0 rounded-lg bg-[#76511A] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#5F4014] sm:inline-flex"
          >
            View plan
          </button>
        </div>
      </div>

 

      <section className="mx-auto grid grid-cols-1 max-w-7xl items-center gap-10 px-4 pb-14 pt-8 sm:gap-12 sm:px-6 sm:pb-20 sm:pt-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:pb-28 lg:pt-16">
        <div className="min-w-0">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#F1D8D0] bg-[#FDF7F5] px-3 py-1.5 text-xs font-medium text-[#A13924] sm:mb-6 sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-[#C86A52]" />
            Restaurant ordering, automated
          </div>
          <h1 className="max-w-xl text-[2.75rem] font-bold leading-[1.08] tracking-tight text-[#171717] sm:text-6xl">
            Order what you want.{" "}
            <span className="text-[#A13924]">Without waiting for a waiter.</span>
          </h1>

          <div className="mt-6 flex w-fit max-w-lg items-center gap-4 rounded-2xl border border-[#EAD8D2] bg-white/80 px-4 py-3 shadow-sm sm:mt-7 sm:px-5">
           
            <span className="flex min-w-0 items-center gap-3">
              <span className="shrink-0" aria-hidden="true">
                <Counter
                  value={resturants?.length ?? 0}
                  fontSize={28}
                  padding={4}
                  gap={1}
                  textColor="#A13924"
                  fontWeight={800}
                />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-[#291812] sm:text-base">
                  Restaurants are currently using DineSpace
                </span>
                <span className="mt-0.5 block text-xs leading-5 text-[#735B53] sm:text-sm">
                  To automate their ordering experience.
                </span>
                <span className="sr-only">{resturants?.length ?? 0} restaurants on DineSpace.</span>
              </span>
            </span>
          </div>
          {/* <p className="mt-5 max-w-lg text-base leading-7 text-[#514947] sm:mt-6 sm:text-lg sm:leading-8">
            DineSpace automates the restaurant ordering experience. Browse the menu from your
            table, see what is special today, and place your order whenever you are ready.
            No repeated calls, no waiting just to ask a question.
          </p> */}
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
           
          </div>
          {dummyLoginError && (
            <div className="mt-3 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-medium text-red-700">
              {dummyLoginError}
            </div>
          )}

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

        <div className="relative mt-2 min-w-0 sm:mt-0 flex">
          {/* <div className="absolute -inset-4 rounded-4xl bg-[#EFD8CF] opacity-60 blur-2xl" />
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
          </div> */}
  {resturants !== undefined && resturants?.length > 0 ?  <div className="relative h-72 w-full sm:h-110 lg:h-155">
  <FlexCarousel
    items={items}
    preset="liquid"
    intro="rise"
    cardHeight={0.5}
    gap={12}
    squeeze={0.2}
    focusOnClick
    captions
    fit="natural"
    radius={0}
    lensWidth={0.74}
    lensHeight={1.18}
    tilt={62}
    roundness={1}
    bend={0.34}
    reach={0.38}
    curl="twist"
    dispersion={0.45}
    liquid={0}
    followCursor={false}
    autoplay={false}
    interval={4}
    captureWheel
/>
</div> : <span className="flex items-center justify-center sm:pl-[40%] lg:h-155"> <LatticeLoader
  status="working"
  label="Loading restaurants..."
  doneLabel="Done in"
  errorLabel="Failed after"
  pattern="arrow"
  grid={3}
  shape="round"
  doneColor="#22c55e"
  errorColor="#ef4444"
  cellSize={6}
  gap={2}
  fontSize={14}
  step={90}
  idleOpacity={0.15}
  glow={false}
  glowColor="#f5f5f5"
  showTimer
  color="#A13924"
/>   </span> }
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex justify-center gap-2" role="tablist" aria-label="Choose a product flow">
            <button
              id="diner-flow-tab"
              type="button"
              role="tab"
              aria-selected={selectedFlow === "diner"}
              aria-controls="product-flow-panel"
              onClick={() => {
                setSelectedFlow("diner");
                setActiveFlowStep(0);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${selectedFlow === "diner" ? "bg-[#A13924] text-white shadow-md" : "bg-white/70 text-[#735B53] hover:bg-white"}`}
            >
              Diner flow
            </button>
            <button
              id="restaurant-flow-tab"
              type="button"
              role="tab"
              aria-selected={selectedFlow === "restaurant"}
              aria-controls="product-flow-panel"
              onClick={() => {
                setSelectedFlow("restaurant");
                setActiveFlowStep(0);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${selectedFlow === "restaurant" ? "bg-[#A13924] text-white shadow-md" : "bg-white/70 text-[#735B53] hover:bg-white"}`}
            >
              Restaurant flow
            </button>
          </div>

          <div
            id="product-flow-panel"
            role="tabpanel"
            aria-labelledby={selectedFlow === "diner" ? "diner-flow-tab" : "restaurant-flow-tab"}
            className="grid grid-cols-1 items-center lg:grid-cols-12"
          >
            <div className={`h-[480px] min-w-0 px-2 py-6 sm:h-[540px] sm:px-4 sm:py-8 lg:col-span-9 lg:px-6 ${selectedFlow === "diner" ? "order-1" : "order-2"}`}>
              <DepthCarousel
                key={selectedFlow}
                items={activeFlowItems}
                depth={170}
                spread={20}
                tilt={18}
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
              <Link href={selectedFlow === "diner" ? "/user" : "/auth"} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#A13924]">
                {selectedFlow === "diner" ? "Explore restaurants" : "Manage your restaurant"} <ArrowRight size={16} />
              </Link>
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

      <section className="border-t border-[#EAD8D2] bg-[#28211E] text-[#FFF9F3]">
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
      </section>

      {showProjectPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#171717]/70 px-3 py-4 backdrop-blur-sm sm:px-5 sm:py-6"
          role="presentation"
          onClick={() => setShowProjectPlan(false)}
        >
          <section
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
                <li><span className="font-semibold text-[#171717]">01. Core dining flow:</span> menus, table ordering, payments, and live order status.</li>
                <li><span className="font-semibold text-[#171717]">02. Restaurant control:</span> staff permissions, salary tracking, menus, tables, and payouts.</li>
                <li><span className="font-semibold text-[#171717]">03. Admin visibility:</span> restaurant oversight, withdrawals, and platform reporting.</li>
                <li><span className="font-semibold text-[#171717]">04. Refinement:</span> testing, performance improvements, and a smoother mobile experience.</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={() => setShowProjectPlan(false)}
              className="mt-7 w-full rounded-xl bg-[#A13924] px-5 py-3 font-semibold text-white transition hover:bg-[#842F1E] sm:w-auto"
            >
              Back to DineSpace
            </button>
          </section>
        </div>
      )}

      

      <footer className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-7 text-sm text-[#8B7168] sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <span>© {new Date().getFullYear()} DineSpace</span>
        <span className="flex flex-wrap items-center gap-1">
          Made for better dining experiences by
          <a
            href="https://mu-bin.dev"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#A13924] underline decoration-[#DDBDB3] underline-offset-4 transition hover:text-[#842F1E]"
          >
            Abdullah Al Mubin
          </a>
          .
        </span>
      </footer>
    </main>
  );
}
