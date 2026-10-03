"use no memo";

import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Bowl from "./Bowl";
import BaseFood from "./BaseFood";
import Protein from "./Protein";
import Vegetables from "./Vegetables";
import Sauce from "./Sauce";
import Garnish from "./Garnish";
import DishLighting from "./DishLighting";
import {
  MAX_TILT,
  MOUSE_DAMPING,
  IDLE_FLOAT_AMPLITUDE,
  IDLE_ROTATE_AMPLITUDE,
} from "./dishConfig";
import type { NormalizedMouse, AnimationPhase } from "./types";

interface DishSceneProps {
  /** Normalized mouse position from the container */
  mouse: NormalizedMouse;
  /** Whether to respect prefers-reduced-motion */
  reducedMotion: boolean;
}

/**
 * DishScene – the main 3D scene orchestrator.
 * Manages animation timing, mouse-follow rotation, and idle floating.
 */
export default function DishScene({ mouse, reducedMotion }: DishSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const currentTilt = useRef({ x: 0, y: 0 });

  // Stagger visibility of each ingredient layer
  const [bowlVisible, setBowlVisible] = useState(false);
  const [baseVisible, setBaseVisible] = useState(false);
  const [proteinVisible, setProteinVisible] = useState(false);
  const [vegsVisible, setVegsVisible] = useState(false);
  const [sauceVisible, setSauceVisible] = useState(false);
  const [garnishVisible, setGarnishVisible] = useState(false);
  const [phase, setPhase] = useState<AnimationPhase>("loading");

  // Kick off assembly sequence
  const startAssembly = useCallback(() => {
    if (reducedMotion) {
      // Skip animation — show everything immediately
      setBowlVisible(true);
      setBaseVisible(true);
      setProteinVisible(true);
      setVegsVisible(true);
      setSauceVisible(true);
      setGarnishVisible(true);
      setPhase("idle");
      return;
    }

    setPhase("assembling");

    // Stagger each layer's appearance
    setBowlVisible(true);
    setTimeout(() => setBaseVisible(true), 300);
    setTimeout(() => setProteinVisible(true), 700);
    setTimeout(() => setVegsVisible(true), 1050);
    setTimeout(() => setSauceVisible(true), 1400);
    setTimeout(() => setGarnishVisible(true), 1650);
    setTimeout(() => setPhase("idle"), 2500);
  }, [reducedMotion]);

  useEffect(() => {
    // Small delay to ensure canvas is painted before starting
    const timer = setTimeout(startAssembly, 200);
    return () => clearTimeout(timer);
  }, [startAssembly]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    elapsed.current += delta;

    // --- Mouse-follow rotation with damping ---
    const isIdle = phase === "idle";
    const targetX = isIdle ? -mouse.y * MAX_TILT : 0;
    const targetY = isIdle ? mouse.x * MAX_TILT : 0;

    const damping = reducedMotion ? 0.01 : MOUSE_DAMPING;
    currentTilt.current.x += (targetX - currentTilt.current.x) * damping;
    currentTilt.current.y += (targetY - currentTilt.current.y) * damping;

    // --- Idle floating animation ---
    let floatY = 0;
    let idleRotX = 0;
    let idleRotZ = 0;

    if (isIdle && !reducedMotion) {
      const t = elapsed.current;
      floatY = Math.sin(t * 0.8) * IDLE_FLOAT_AMPLITUDE;
      idleRotX = Math.sin(t * 0.5) * IDLE_ROTATE_AMPLITUDE;
      idleRotZ = Math.cos(t * 0.6) * IDLE_ROTATE_AMPLITUDE * 0.5;
    }

    groupRef.current.rotation.x = currentTilt.current.x + idleRotX;
    groupRef.current.rotation.y = currentTilt.current.y;
    groupRef.current.rotation.z = idleRotZ;
    groupRef.current.position.y = floatY;
  });

  return (
    <>
      <DishLighting />
      <group ref={groupRef}>
        <Bowl visible={bowlVisible} />
        <BaseFood visible={baseVisible} />
        <Protein visible={proteinVisible} />
        <Vegetables visible={vegsVisible} />
        <Sauce visible={sauceVisible} />
        <Garnish visible={garnishVisible} />
      </group>
    </>
  );
}
