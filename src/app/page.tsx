"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowRight, ChefHat, Utensils } from "lucide-react";
import { MotionConfig, motion, useReducedMotion } from "motion/react";
import DepthCarousel from "@/components/DepthCarousel/DepthCarousel";
import HeroProductStory from "@/components/landing/HeroProductStory";
import MetricsBar from "@/components/landing/MetricsBar";
import OperationsSuite from "@/components/landing/OperationsSuite";
import Plasma from "@/components/Plasma/Plasma";

type FlowItem = {
  image: string;
  alt: string;
  title: string;
  description: string;
};

const dinerFlow: FlowItem[] = [
  {
    image: "/Diner/restaurant-browsing.jpg",
    alt: "A diner looking through restaurant options",
    title: "Find a place",
    description: "Browse restaurants and choose where you would like to eat.",
  },
  {
    image: "/Diner/table-qr-scan.jpg",
    alt: "A diner scanning the restaurant QR code on a table stand",
    title: "Open the restaurant menu",
    description: "Scan the restaurant QR code on your table to open the live digital menu instantly.",
  },
  {
    image: "/Diner/mobile-ordering.jpg",
    alt: "A diner placing an order on a phone",
    title: "Choose and order",
    description: "Explore the menu, add items to your bowl, and send the order to the restaurant.",
  },
  {
    image: "/Diner/diner-restaurant-connection.jpg",
    alt: "A diner and a restaurant team connected through an order",
    title: "Stay in the loop",
    description: "Check the order status while the restaurant team prepares your meal.",
  },
  {
    image: "/Diner/live-order-tracking.jpg",
    alt: "A diner checking the progress of an order",
    title: "Follow the progress",
    description: "See when the restaurant has confirmed, prepared, or completed your order.",
  },
  {
    image: "/Diner/diner-journeys.jpg",
    alt: "Diners sharing a meal together",
    title: "Enjoy the table",
    description: "Keep the ordering steps close at hand and focus on the meal.",
  },
];

const restaurantFlow: FlowItem[] = [
  {
    image: "/Restaurant/Staff_managing_restaurant_orders…_20261004172446.jpg",
    alt: "Restaurant staff reviewing incoming orders",
    title: "Receive incoming orders",
    description: "New diner orders appear in the restaurant's order workflow.",
  },
  {
    image: "/Restaurant/Staff_managing_restaurant_order_…_20261004172442.jpg",
    alt: "Restaurant staff coordinating order preparation",
    title: "Move orders through service",
    description: "Review an order and update its status as the team prepares it.",
  },
  {
    image: "/Restaurant/Manager_updating_digital_restaur…_20261004172439.jpg",
    alt: "A restaurant manager updating restaurant information",
    title: "Keep restaurant details current",
    description: "Manage the information diners see when they browse and order.",
  },
  {
    image: "/Restaurant/Manager_managing_table_QR_codes_20261004172521.jpg",
    alt: "A restaurant manager organizing dining tables and seating",
    title: "Organize dining tables",
    description: "Manage table seating capacity and layout so every order maps to the right table.",
  },
  {
    image: "/Restaurant/Manager_using_restaurant_workflo…_20261004172529.jpg",
    alt: "A restaurant manager using the restaurant workflow",
    title: "Keep service moving",
    description: "Bring menu, table, and order tasks into one restaurant workspace.",
  },
];

const orderSteps = ["Pending", "Confirmed", "Preparing", "Ready", "Completed"];

const faqs = [
  {
    question: "What does DineSpace do?",
    answer:
      "DineSpace connects restaurant digital menus and table orders directly with the kitchen's live order management workflow in real time.",
  },
  {
    question: "How do I start an order?",
    answer:
      "Scan the restaurant QR code on your table to open the live digital menu on your phone. Browse dishes, add items to your bowl, choose your table at review, and submit your order directly to the kitchen.",
  },
  {
    question: "Can I follow my order?",
    answer:
      "Yes. The diner experience includes real-time order tracking so you can see when the kitchen confirms, prepares, and completes your meal.",
  },
  {
    question: "Which payment methods are available?",
    answer:
      "The checkout flow lists Cash, bKash, and Nagad. Digital payment is simulated in the current product and is not a completed payment provider integration.",
  },
  {
    question: "What can restaurant teams manage?",
    answer:
      "Restaurant teams can review live orders, update kitchen preparation stages, manage menus and pricing, track seating capacity, and oversee daily sales through the owner workspace.",
  },
  {
    question: "How does a restaurant get started?",
    answer:
      "Restaurant owners can sign in through the owner route to access the restaurant workspace.",
  },
];

function FAQItem({
  faq,
  index,
}: {
  faq: { question: string; answer: string };
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const answerId = `faq-answer-${index}`;

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateContentHeight = () => setContentHeight(content.scrollHeight);
    updateContentHeight();

    const observer = new ResizeObserver(updateContentHeight);
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  const toggleOpen = () => {
    if (!isOpen && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
    setIsOpen((open) => !open);
  };

  const duration = shouldReduceMotion ? 0.16 : 0.28;

  return (
    <div className="border-b border-[#d4c9bd]">
      <button
        aria-controls={answerId}
        aria-expanded={isOpen}
        className="flex min-h-16 w-full items-center justify-between gap-6 py-5 text-left text-lg font-medium leading-snug text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924]"
        onClick={toggleOpen}
        type="button"
      >
        <span>{faq.question}</span>
        <motion.span
          animate={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
          aria-hidden="true"
          className="shrink-0 text-2xl font-normal text-[#a13924]"
          transition={{ duration, ease: [0.23, 1, 0.32, 1] }}
        >
          +
        </motion.span>
      </button>
      <motion.div
        animate={{
          height: isOpen ? contentHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
        aria-hidden={!isOpen}
        className="overflow-hidden"
        id={answerId}
        initial={false}
        transition={{
          height: { duration, ease: [0.23, 1, 0.32, 1] },
          opacity: { duration: shouldReduceMotion ? 0.12 : 0.2, ease: "easeOut" },
        }}
      >
        <p
          className="mb-0 max-w-[58ch] pb-6 pr-10 text-base leading-relaxed text-[#655950]"
          ref={contentRef}
        >
          {faq.answer}
        </p>
      </motion.div>
    </div>
  );
}

function WordsReveal({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <motion.span
            initial={{ color: "rgba(23, 23, 23, 0.32)" }}
            key={`${word}-${index}`}
            transition={{
              duration: 0.8,
              delay: index * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            viewport={{ once: true, amount: 0.8 }}
            whileInView={{ color: "rgb(23, 23, 23)" }}
          >
            {word}
            {index < words.length - 1 ? " " : ""}
          </motion.span>
        ))}
      </span>
      <span className="sr-only">{text}</span>
    </>
  );
}

function ProjectRoadmap({
  onClose,
  closeButtonRef,
}: {
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 grid overscroll-contain overflow-y-auto bg-[#14100e]/80 p-4"
      initial={{ opacity: 0 }}
      onClick={onClose}
      role="presentation"
      transition={{ duration: 0.2 }}
    >
      <motion.section
        aria-labelledby="roadmap-title"
        aria-modal="true"
        animate={{ opacity: 1, y: 0 }}
        className="m-auto w-full max-w-3xl rounded-3xl bg-[#fbf9f6] p-6 text-[#171717] sm:p-12"
        initial={{ opacity: 0, y: 16 }}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start justify-between gap-8">
          <h2
            className="max-w-[12ch] text-4xl font-medium leading-tight tracking-[-0.055em] text-balance"
            id="roadmap-title"
          >
            Where DineSpace is going
          </h2>
          <button
            aria-label="Close project roadmap"
            className="min-h-11 rounded-lg px-3 text-sm font-semibold text-[#a13924] transition-colors hover:bg-[#f5f3f0] hover:text-[#842f1e] active:scale-[0.98]"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            Close
          </button>
        </div>
        <p className="mt-6 max-w-[56ch] text-base leading-relaxed text-[#655950]">
          DineSpace is in active development. The current product connects diner
          ordering with restaurant order management; the work ahead builds on
          that foundation.
        </p>
        <ol className="mt-8 grid gap-5">
          <li className="grid gap-1">
            <strong className="font-semibold">Core dining flow</strong>
            <span className="text-[0.9375rem] leading-relaxed text-[#655950]">
              Menus, table ordering, payment integration, and live order status.
            </span>
          </li>
          <li className="grid gap-1">
            <strong className="font-semibold">Restaurant control</strong>
            <span className="text-[0.9375rem] leading-relaxed text-[#655950]">
              Staff permissions, salary tracking, menus, tables, and payouts.
            </span>
          </li>
          <li className="grid gap-1">
            <strong className="font-semibold">Admin visibility</strong>
            <span className="text-[0.9375rem] leading-relaxed text-[#655950]">
              Restaurant oversight, withdrawals, and platform reporting.
            </span>
          </li>
          <li className="grid gap-1">
            <strong className="font-semibold">Product refinement</strong>
            <span className="text-[0.9375rem] leading-relaxed text-[#655950]">
              Testing, performance improvements, and a smoother mobile experience.
            </span>
          </li>
        </ol>
      </motion.section>
    </motion.div>
  );
}

export default function Home() {
  const [selectedFlow, setSelectedFlow] = useState<"diner" | "restaurant">("diner");
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const [showRoadmap, setShowRoadmap] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const roadmapTriggerRef = useRef<HTMLButtonElement>(null);
  const roadmapCloseRef = useRef<HTMLButtonElement>(null);
  const activeFlow = selectedFlow === "diner" ? dinerFlow : restaurantFlow;

  useEffect(() => {
    if (!showRoadmap) return;

    const trigger = roadmapTriggerRef.current;
    roadmapCloseRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowRoadmap(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [showRoadmap]);

  const chooseFlow = (flow: "diner" | "restaurant") => {
    setSelectedFlow(flow);
    setActiveFlowStep(0);
  };

  return (
    <MotionConfig reducedMotion="user">
      <main
        className="min-h-svh overflow-x-clip bg-[#fbf9f6] text-[#171717]"
        id="main-content"
        tabIndex={-1}
      >
        <a
          className="absolute left-2 top-2 z-100 translate-y-[-180%] bg-[#fbf9f6] px-4 py-3 font-semibold text-[#171717] focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924]"
          href="#main-content"
        >
          Skip to content
        </a>

        <section
          aria-labelledby="hero-title"
          className="relative flex min-h-svh flex-col overflow-hidden bg-[#fbf9f6] pt-16 text-[#171717]"
          id="top"
        >
          <Plasma
            aria-hidden="true"
            className="pointer-events-none !absolute inset-0 z-0 !h-auto"
            color="#a13924"
            speed={0.3}
            scale={1.15}
            twist={0.7}
            wave={0.52}
            softness={0.88}
            shine={0.25}
            brightness={0.4}
            grain={0}
            quality={0.45}
            mouseInteractive={false}
            fade={0.72}
            opacity={0.5}
            lightMode
            paused={Boolean(shouldReduceMotion)}
          />
          <motion.header
            animate={{ opacity: 1, transform: "scale(1)" }}
            className="fixed inset-x-0 top-0 z-30 border-b border-[#ead8d3] bg-[#fbf9f6]/95 shadow-sm backdrop-blur-md"
            initial={{ opacity: 0, transform: "scale(0.99)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-18 lg:px-10">
              <Link
                aria-label="DineSpace home"
                className="inline-flex shrink-0 items-center gap-2.5 text-lg font-semibold tracking-tight text-[#171717] no-underline sm:text-xl"
                href="/"
              >
                <span className="grid size-9 place-items-center rounded-lg bg-[#a13924] text-white">
                  <Utensils aria-hidden="true" size={18} strokeWidth={1.8} />
                </span>
                DineSpace
              </Link>

              <nav
                aria-label="Main navigation"
                className="hidden flex-1 items-center justify-center gap-1 text-sm md:flex"
              >
                <a className="rounded-xl px-4 py-2.5 font-semibold text-[#806f6b] transition-colors hover:bg-[#f8efec] hover:text-[#a13924]" href="#how-it-works">
                  The flow
                </a>
                <a className="rounded-xl px-4 py-2.5 font-semibold text-[#806f6b] transition-colors hover:bg-[#f8efec] hover:text-[#a13924]" href="#restaurants">
                  For restaurants
                </a>
                <a className="hidden rounded-xl px-4 py-2.5 font-semibold text-[#806f6b] transition-colors hover:bg-[#f8efec] hover:text-[#a13924] lg:inline-flex" href="#questions">
                  Questions
                </a>
              </nav>

              <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
                <Link
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dec0ba] bg-white px-3 text-sm font-semibold text-[#a13924] no-underline transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#f8efec] active:translate-y-px active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924] lg:px-4"
                  href="/auth?demo=owner"
                >
                  <span className="hidden lg:inline">Demo owner sign in</span>
                  <span className="lg:hidden">Demo sign in</span>
                </Link>
                <Link
                  aria-label="Browse restaurants"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#a13924] px-3 text-sm font-semibold text-white no-underline transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#842f1e] active:translate-y-px active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924] lg:px-4"
                  href="/user"
                >
                  <span className="hidden lg:inline">Browse restaurants</span>
                  <span className="lg:hidden">Browse</span>
                  <ArrowRight aria-hidden="true" className="hidden lg:block" size={16} />
                </Link>
              </div>

              <details className="group relative ml-auto md:hidden">
                <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-lg px-3 text-sm font-semibold text-[#806f6b] transition-colors hover:bg-[#f8efec] hover:text-[#a13924] [&::-webkit-details-marker]:hidden">
                  Menu
                </summary>
                <nav
                  aria-label="Mobile navigation"
                  className="absolute right-0 top-full z-20 mt-2 grid min-w-56 gap-1 rounded-2xl border border-[#ead8d3] bg-[#fbf9f6] p-3 shadow-[0_8px_30px_rgba(115,65,52,0.16)]"
                >
                  <a className="rounded-xl px-4 py-3 text-sm font-semibold text-[#806f6b] hover:bg-[#f8efec] hover:text-[#a13924]" href="#how-it-works">
                    The flow
                  </a>
                  <a className="rounded-xl px-4 py-3 text-sm font-semibold text-[#806f6b] hover:bg-[#f8efec] hover:text-[#a13924]" href="#restaurants">
                    For restaurants
                  </a>
                  <a className="rounded-xl px-4 py-3 text-sm font-semibold text-[#806f6b] hover:bg-[#f8efec] hover:text-[#a13924]" href="#questions">
                    Questions
                  </a>
                  <Link
                    className="mt-1 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#dec0ba] bg-white px-4 text-sm font-semibold text-[#a13924] no-underline hover:bg-[#f8efec]"
                    href="/auth?demo=owner"
                  >
                    Demo owner sign in
                  </Link>
                  <Link
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#a13924] px-4 text-sm font-semibold text-white no-underline hover:bg-[#842f1e]"
                    href="/user"
                  >
                    Browse restaurants
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </nav>
              </details>
            </div>
          </motion.header>

          <div className="flex w-full flex-1 items-center justify-center px-6 py-16">
            <div className="relative z-10 mx-auto max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <h1
                  className="m-0 text-6xl font-medium leading-[0.95] tracking-[-0.065em] text-[#171717] text-balance sm:text-7xl xl:text-8xl"
                  id="hero-title"
                >
                  Good food.
                  <br />
                  Better flow.
                </h1>
                <p className="mx-auto mt-8 max-w-[48ch] text-lg leading-relaxed text-[#655950] text-pretty sm:text-xl">
                  Guests order at the table. Their orders go straight to the kitchen team.
                </p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#a13924] px-5 text-sm font-semibold text-white no-underline transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#842f1e] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924]"
                    href="/user"
                  >
                    Browse restaurants
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                  <Link
                    className="inline-flex min-h-12 items-center rounded-xl border border-[#dec0ba] bg-white px-4 text-sm font-semibold text-[#a13924] no-underline transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#f8efec] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924]"
                    href="/auth?demo=owner"
                  >
                    Demo owner sign in
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>

          <a
            aria-label="Scroll to the order flow"
            className="absolute bottom-5 right-5 hidden sm:inline-flex items-center gap-2 text-[0.8125rem] text-[#735b53] no-underline transition-colors hover:text-[#a13924] sm:right-8 lg:right-20"
            href="#how-it-works"
          >
            See the order flow
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </section>

        <section
          aria-labelledby="order-flow-title"
          className="bg-[#f2ece6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
          id="how-it-works"
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <div className="mb-10 grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.6fr)] md:gap-10">
              <h2
                className="m-0 max-w-[16ch] text-4xl font-medium leading-[1.02] tracking-[-0.055em] text-[#171717] text-balance sm:text-5xl"
                id="order-flow-title"
              >
                Watch an order move.
              </h2>
              <p className="m-0 max-w-[42ch] text-base leading-relaxed text-[#655950]">
                Follow a diner order as it moves from a table QR scan to the live kitchen board.
              </p>
            </div>
            <HeroProductStory />
          </div>
        </section>

        {/* Real-time Performance Metrics Bar */}
        <MetricsBar />

        <section
          aria-labelledby="journey-title"
          className="grid min-h-96 grid-cols-1 items-center gap-6 bg-[#e9e4dc] px-6 py-20 md:grid-cols-[1.2fr_0.5fr] md:gap-12 md:px-[12vw] md:py-28"
          id="journey"
        >
          <h2
            className="m-0 max-w-[30ch] text-3xl font-medium leading-[1.14] tracking-[-0.045em] text-balance md:text-4xl"
            id="journey-title"
          >
            <WordsReveal
              text="From table to kitchen."
            />
          </h2>
          <p className="m-0 max-w-[27ch] text-base leading-relaxed text-[#655950]">
            One connected journey, from the menu in your hand to the order in
            the kitchen.
          </p>
        </section>

        <section
          aria-labelledby="flow-title"
          className="px-6 py-20 sm:px-8 md:px-[8vw] md:py-32"
          id="diner-journey"
        >
          <motion.div
            className="mb-12 grid items-end gap-6 md:mb-16 md:grid-cols-[1fr_0.6fr] md:gap-8"
            initial={{ y: 14 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.12 }}
            whileInView={{ y: 0 }}
          >
            <h2
              className="m-0 max-w-[18ch] text-4xl font-medium leading-[1.02] tracking-[-0.06em] text-balance md:text-5xl"
              id="flow-title"
            >
              The table becomes the starting point.
            </h2>
            <p className="m-0 min-w-0 max-w-[39ch] text-base leading-relaxed text-[#655950]">
              The diner flow keeps choosing, ordering, and checking progress
              together in one place.
            </p>
          </motion.div>

          <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-20">
            <motion.figure
              className="relative m-0 pb-5 pr-6 pt-6 sm:pb-8 sm:pr-12 sm:pt-8"
              initial={{ y: 14 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.12 }}
              whileInView={{ y: 0 }}
            >
              <div className="relative aspect-[1.1] overflow-hidden rounded-2xl bg-[#e4d8ca]">
                <Image
                  alt="A diner browsing the restaurant menu on a phone"
                  className="object-cover"
                  fill
                  loading="lazy"
                  sizes="(max-width: 760px) 100vw, 48vw"
                  src="/Diner/mobile-ordering.jpg"
                />
              </div>
              <figcaption className="mt-3 text-sm leading-snug text-[#655950]">
                Choose from the menu at your own pace
              </figcaption>
            </motion.figure>

            <ol className="m-0 grid list-none gap-8 p-0">
              <motion.li
                className="grid gap-2"
                initial={{ y: 12 }}
                transition={{ duration: 0.65, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.12 }}
                whileInView={{ y: 0 }}
              >
                <h3 className="m-0 text-2xl font-medium tracking-[-0.04em]">
                  Scan the restaurant QR
                </h3>
                <p className="m-0 max-w-[38ch] text-base leading-relaxed text-[#655950]">
                  Scan the restaurant QR stand on your table to open the live digital menu directly on your phone—no app install required.
                </p>
              </motion.li>
              <motion.li
                className="grid gap-2"
                initial={{ y: 12 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.12 }}
                whileInView={{ y: 0 }}
              >
                <h3 className="m-0 text-2xl font-medium tracking-[-0.04em]">
                  Build your bowl
                </h3>
                <p className="m-0 max-w-[38ch] text-base leading-relaxed text-[#655950]">
                  Browse dishes, customize options, view dietary details, and add items to your bowl with live pricing.
                </p>
              </motion.li>
              <motion.li
                className="grid gap-2"
                initial={{ y: 12 }}
                transition={{ duration: 0.65, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, amount: 0.12 }}
                whileInView={{ y: 0 }}
              >
                <h3 className="m-0 text-2xl font-medium tracking-[-0.04em]">
                  Pick your table & send
                </h3>
                <p className="m-0 max-w-[38ch] text-base leading-relaxed text-[#655950]">
                  Confirm your table number, select Cash, bKash, or Nagad, and dispatch the ticket straight to the kitchen.
                </p>
              </motion.li>
            </ol>
          </div>
        </section>

        {/* Restaurant Operations Architecture Suite */}
        <OperationsSuite />

        <section
          aria-labelledby="status-title"
          className="border-y border-[#ebdcd3] bg-[#f5ede7]/60 px-6 py-20 sm:px-8 md:px-[8vw] md:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <motion.div
              className="max-w-3xl mb-12"
              initial={{ y: 14 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true, amount: 0.12 }}
              whileInView={{ y: 0 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#dec9bd] bg-white px-3.5 py-1 text-xs font-bold text-[#a13924] mb-3 shadow-2xs">
                <span>Deterministic Service States</span>
              </div>
              <h2
                className="m-0 text-3xl font-medium tracking-tight text-[#171717] sm:text-4xl lg:text-5xl"
                id="status-title"
              >
                Know what comes next, every step of the meal.
              </h2>
              <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-[#655950]">
                Orders advance through clear, verifiable service stages. Guests track live progress on their phone while kitchen staff update tickets directly from the POS workspace.
              </p>
            </motion.div>

            {/* Stepper Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {[
                { step: "01", name: "Pending", desc: "Order sent via restaurant QR" },
                { step: "02", name: "Confirmed", desc: "Kitchen acknowledges ticket" },
                { step: "03", name: "Preparing", desc: "Chef fires dishes on the line" },
                { step: "04", name: "Ready", desc: "Plated & runner dispatched" },
                { step: "05", name: "Completed", desc: "Delivered to dining table" },
              ].map((st, idx) => (
                <div
                  key={st.name}
                  className="flex flex-col justify-between rounded-2xl border border-[#dec9bd] bg-white p-4 shadow-2xs"
                >
                  <div>
                    <span className="text-[11px] font-extrabold text-[#a13924]">
                      STEP {st.step}
                    </span>
                    <h3 className="mt-1 text-base font-bold text-[#1f1614]">
                      {st.name}
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#735e56]">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Payment Reassurance Pill */}
            <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-[#dec9bd] bg-white p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-[#f5ede7] text-[#a13924]">
                  <Utensils size={17} />
                </span>
                <p className="m-0 text-xs sm:text-sm text-[#45342d]">
                  Flexible checkout: Supports <strong>Cash at table</strong> alongside simulated mobile payment with <strong>bKash</strong> and <strong>Nagad</strong>.
                </p>
              </div>
              <span className="rounded-lg bg-[#f5ede7] px-3 py-1 text-xs font-bold text-[#a13924] shrink-0">
                Zero Friction
              </span>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="restaurants-title"
          className="px-6 py-20 sm:px-8 md:px-[8vw] md:py-32"
          id="restaurants"
        >
          <motion.div
            className="grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)] md:gap-8"
            initial={{ y: 14 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.12 }}
            whileInView={{ y: 0 }}
          >
            <div>
              <p className="mb-4 flex items-center gap-2 text-[0.9375rem] font-semibold text-[#a13924]">
                <ChefHat aria-hidden="true" size={19} />
                The restaurant side
              </p>
              <h2
                className="m-0 max-w-[18ch] text-4xl font-medium leading-[1.02] tracking-[-0.06em] text-balance md:text-5xl"
                id="restaurants-title"
              >
                The other side of every order.
              </h2>
            </div>
            <div>
              <p className="m-0 max-w-[39ch] text-base leading-relaxed text-[#655950]">
                Orders arrive directly in the restaurant workspace, where teams can review
                service, update progress, and manage live menus and dining tables.
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#a13924] no-underline transition-[color,transform] duration-200 hover:translate-x-1 hover:text-[#842f1e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#a13924]"
                href="/auth?demo=owner"
              >
                Demo owner sign in
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </motion.div>

          <div aria-label="Choose a product journey" className="relative z-20 mt-12 grid w-full max-w-md grid-cols-2 gap-2 rounded-2xl bg-[#f5f3f0] p-2" role="group">
            <button
              aria-pressed={selectedFlow === "diner"}
              className={`min-h-11 min-w-0 whitespace-nowrap rounded-xl px-2 text-[0.8125rem] transition-[background-color,color,transform] duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924] sm:px-4 sm:text-sm ${
                selectedFlow === "diner"
                  ? "bg-[#f5ded7] font-semibold text-[#842f1e]"
                  : "text-[#655950] hover:bg-[#f5f3f0] hover:text-[#171717]"
              }`}
              onClick={() => chooseFlow("diner")}
              type="button"
            >
              Diner flow
            </button>
            <button
              aria-pressed={selectedFlow === "restaurant"}
              className={`min-h-11 min-w-0 whitespace-nowrap rounded-xl px-2 text-[0.8125rem] transition-[background-color,color,transform] duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a13924] sm:px-4 sm:text-sm ${
                selectedFlow === "restaurant"
                  ? "bg-[#f5ded7] font-semibold text-[#842f1e]"
                  : "text-[#655950] hover:bg-[#f5f3f0] hover:text-[#171717]"
              }`}
              onClick={() => chooseFlow("restaurant")}
              type="button"
            >
              Restaurant flow
            </button>
          </div>

          <div
            aria-label={`${selectedFlow === "diner" ? "Diner" : "Restaurant"} journey gallery`}
            aria-live="polite"
            className="relative z-0 mt-20 grid min-w-0 items-center gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)] xl:gap-16"
          >
            <div className="min-h-80 min-w-0 sm:min-h-120">
              <DepthCarousel
                key={selectedFlow}
                autoplay={!shouldReduceMotion}
                autoplayDelay={4200}
                blur={0}
                cardHeight={480}
                cardWidth={760}
                depth={115}
                duration={900}
                ease="power3.out"
                falloff={0.16}
                items={activeFlow}
                loop
                onChange={(index) => setActiveFlowStep(index)}
                perspective={1300}
                radius={16}
                showCaptions={false}
                showControls
                showIndicators
                spread={18}
                tilt={4}
                tiltDirection={selectedFlow === "diner" ? "right" : "left"}
                visibleCards={1}
              />
            </div>
            <div className="min-w-0 max-w-lg px-2">
              <h3 className="m-0 max-w-[12ch] text-4xl font-medium leading-[1.04] tracking-[-0.055em] text-balance">
                {activeFlow[activeFlowStep].title}
              </h3>
              <p className="mt-4 max-w-[37ch] text-base leading-relaxed text-[#655950]">
                {activeFlow[activeFlowStep].description}
              </p>
              <Link
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-[0.9375rem] font-semibold text-[#a13924] no-underline transition-[color,transform] duration-200 hover:translate-x-1 hover:text-[#842f1e]"
                href={selectedFlow === "diner" ? "/user" : "/auth"}
              >
                {selectedFlow === "diner" ? "Browse restaurants" : "Owner sign in"}
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="questions-title"
          className="grid grid-cols-1 gap-10 bg-[#e9e4dc] px-6 py-20 sm:px-8 md:grid-cols-[0.75fr_1.25fr] md:gap-28 md:px-[8vw] md:py-32"
          id="questions"
        >
          <motion.div
            initial={{ y: 14 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, amount: 0.12 }}
            whileInView={{ y: 0 }}
          >
            <h2
              className="m-0 max-w-[18ch] text-4xl font-medium leading-[1.02] tracking-[-0.06em] text-balance md:text-5xl"
              id="questions-title"
            >
              Questions, answered.
            </h2>
            <p className="mt-5 max-w-[39ch] text-base leading-relaxed text-[#655950]">
              A clear picture of what works today, including the payment
              experience still in development.
            </p>
          </motion.div>
          <div className="grid content-start border-t border-[#d4c9bd]">
            {faqs.map((faq, index) => (
              <FAQItem faq={faq} index={index} key={faq.question} />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="closing-title"
          className="grid items-center gap-10 px-6 py-20 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:gap-28 md:px-[8vw] md:py-32"
        >
          <figure className="relative m-0">
            <div className="relative aspect-[1.32] overflow-hidden rounded-2xl bg-[#d8c9ba]">
              <Image
                alt="Diners sharing a meal around a restaurant table"
                className="object-cover"
                fill
                loading="lazy"
                sizes="(max-width: 760px) 100vw, 46vw"
                src="/Diner/diner-journeys.jpg"
              />
            </div>
            <figcaption className="mt-3 text-sm leading-snug text-[#655950]">
              Make more room for the meal
            </figcaption>
          </figure>
          <div>
            <h2
              className="m-0 max-w-[18ch] text-4xl font-medium leading-[1.02] tracking-[-0.06em] text-balance md:text-5xl"
              id="closing-title"
            >
              Order from your table.
            </h2>
            <p className="mt-5 max-w-[39ch] text-base leading-relaxed text-[#655950]">
              Browse a restaurant, open its menu, and start your next table
              order with DineSpace.
            </p>
            <Link
              className="mt-7 inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#a13924] px-5 text-base font-semibold text-white no-underline transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#842f1e] active:translate-y-px active:scale-[0.98]"
              href="/user"
            >
              Browse restaurants
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link
              className="mt-4 block w-fit text-[0.9375rem] font-medium text-[#a13924] underline decoration-1 underline-offset-4"
              href="/auth"
            >
              Run a restaurant? Sign in here
            </Link>
          </div>
        </section>

        <footer className="grid grid-cols-1 gap-6 bg-[#211916] px-6 py-8 text-[#fbf6ef] sm:px-8 md:grid-cols-[auto_1fr] md:items-center md:px-20">
          <Link
            aria-label="DineSpace home"
            className="inline-flex w-fit items-center gap-2.5 text-lg font-semibold tracking-tight text-white no-underline"
            href="/"
          >
            <span className="grid size-9 place-items-center rounded-lg bg-[#a13924] text-white">
              <Utensils aria-hidden="true" size={17} strokeWidth={1.8} />
            </span>
            DineSpace
          </Link>
          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap justify-start gap-x-6 gap-y-3 text-sm md:justify-end"
          >
            <Link className="text-white no-underline hover:text-[#e7b99e]" href="/user">
              Browse restaurants
            </Link>
            <Link className="text-white no-underline hover:text-[#e7b99e]" href="/auth">
              Restaurant owners
            </Link>
            <a
              className="text-white no-underline hover:text-[#e7b99e]"
              href="https://mu-bin.dev"
              rel="noreferrer"
              target="_blank"
            >
              About the maker
            </a>
            <button
              className="rounded-lg border-0 bg-transparent px-2 py-1 text-left text-sm text-white transition-colors hover:bg-white/10 hover:text-[#e7b99e]"
              onClick={() => setShowRoadmap(true)}
              ref={roadmapTriggerRef}
              type="button"
            >
              Project roadmap
            </button>
          </nav>
          <p className="m-0 text-sm leading-relaxed text-[#d2c5b9] md:col-span-2">
            © {new Date().getFullYear()} DineSpace. Made for better dining
            experiences.
          </p>
        </footer>

        {showRoadmap && (
          <ProjectRoadmap
            closeButtonRef={roadmapCloseRef}
            onClose={() => setShowRoadmap(false)}
          />
        )}
      </main>
    </MotionConfig>
  );
}
