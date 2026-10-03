"use client";
"use no memo";

import { useRef, useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type { NormalizedMouse } from "./types";

// Lazy-load the heavy 3D scene to avoid blocking the landing page
const DishScene = lazy(() => import("./DishScene"));

/**
 * DishHero3D — the top-level container for the interactive 3D dish.
 *
 * Responsibilities:
 * - Mounts the R3F Canvas
 * - Tracks mouse position relative to the container
 * - Detects prefers-reduced-motion
 * - Provides responsive sizing
 * - Shows a subtle loading state while the 3D scene initializes
 */
export default function DishHero3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<NormalizedMouse>({ x: 0, y: 0 });
  const [mouse, setMouse] = useState<NormalizedMouse>({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mouse tracking with RAF throttle for performance
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseRef.current = { x, y };

    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setMouse({ ...mouseRef.current });
        rafRef.current = null;
      });
    }
  }, []);

  // Reset mouse when leaving the container
  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: 0, y: 0 };
    setMouse({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // Fade in the canvas once it's created
  const handleCreated = useCallback(() => {
    setCanvasReady(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      style={{ minHeight: 320 }}
      aria-hidden="true"
    >
      {/* Subtle loading pulse while 3D scene initializes */}
      {!canvasReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-24 w-24 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(161,57,36,0.12) 0%, transparent 70%)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
        </div>
      )}

      <div
        className="h-full w-full transition-opacity duration-700"
        style={{ opacity: canvasReady ? 1 : 0 }}
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{
            position: [0, 1.2, 3.2],
            fov: 32,
            near: 0.1,
            far: 20,
          }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          style={{ background: "transparent" }}
          onCreated={handleCreated}
        >
          <Suspense fallback={null}>
            <DishScene mouse={mouse} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
