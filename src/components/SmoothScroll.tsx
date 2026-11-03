"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll() {
  useEffect(() => {
    // Disable if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Disable on coarse pointer devices (touchscreens/mobiles) to preserve native 120Hz gestures
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let targetScroll = window.scrollY;
    let currentScroll = window.scrollY;
    let isRunning = false;
    let lastTime = performance.now();

    // Damping coefficient (higher = faster snap, lower = longer momentum glide)
    // 7.5 provides an ultra-smooth, luxurious studio feel
    const DAMPING_LAMBDA = 7.5;

    const getMaxScroll = () =>
      Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    // Frame-rate independent animation loop
    const onTick = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const maxScroll = getMaxScroll();
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));

      // Exponential decay: 1 - e^(-lambda * dt)
      const factor = 1 - Math.exp(-DAMPING_LAMBDA * dt);
      currentScroll += (targetScroll - currentScroll) * factor;

      // Apply instantaneous frame update without browser internal smooth-scroll lag
      window.scrollTo({
        top: currentScroll,
        behavior: "instant" as ScrollBehavior,
      });

      // Keep GSAP ScrollTrigger in exact lockstep
      ScrollTrigger.update();

      // Stop loop when resting
      if (Math.abs(targetScroll - currentScroll) < 0.35) {
        currentScroll = targetScroll;
        window.scrollTo({
          top: currentScroll,
          behavior: "instant" as ScrollBehavior,
        });
        ScrollTrigger.update();
        isRunning = false;
        return;
      }

      requestAnimationFrame(onTick);
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        requestAnimationFrame(onTick);
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Allow browser zoom and modifier shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Allow native scroll inside modals, dialogs, code blocks, or textareas
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("[role='dialog'], [data-lenis-prevent], textarea, select, .overflow-y-auto")
      ) {
        return;
      }

      e.preventDefault();

      // Normalize delta across input devices and browsers
      let delta = e.deltaY;
      if (e.deltaMode === 1) {
        // Line mode (standard mouse wheels on Windows)
        delta *= 38;
      } else if (e.deltaMode === 2) {
        // Page mode
        delta *= window.innerHeight;
      } else {
        // Pixel mode: slight boost for mouse wheel without disrupting trackpads
        const isTrackpad = Math.abs(delta) < 40 && delta % 1 !== 0;
        if (!isTrackpad) {
          delta *= 1.12;
        }
      }

      const maxScroll = getMaxScroll();
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll + delta));

      startLoop();
    };

    // Smooth momentum glide for anchor navigation
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const el = document.getElementById(href.slice(1));
      if (!el) return;

      e.preventDefault();

      const navOffset = 74;
      const rect = el.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - navOffset;

      targetScroll = Math.max(0, Math.min(getMaxScroll(), targetY));
      startLoop();
    };

    // Sync state when native actions occur (e.g. scrollbar dragging, keys)
    const onNativeScroll = () => {
      if (!isRunning) {
        targetScroll = window.scrollY;
        currentScroll = window.scrollY;
      }
    };

    // Reset on window resize
    const onResize = () => {
      const maxScroll = getMaxScroll();
      targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));
      currentScroll = Math.max(0, Math.min(maxScroll, currentScroll));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onNativeScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("click", onAnchorClick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("click", onAnchorClick);
      isRunning = false;
    };
  }, []);

  return null;
}
