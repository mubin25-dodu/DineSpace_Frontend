import type { Vector3Tuple } from "three";

/** Configuration for a single food ingredient in the assembly animation */
export interface IngredientConfig {
  /** Unique key for React reconciliation */
  id: string;
  /** Starting position above the bowl (x, y, z) */
  startPosition: Vector3Tuple;
  /** Final resting position inside/on the bowl */
  endPosition: Vector3Tuple;
  /** Starting rotation (radians) */
  startRotation: Vector3Tuple;
  /** Final resting rotation */
  endRotation: Vector3Tuple;
  /** Delay in seconds before this ingredient begins falling */
  delay: number;
  /** Duration of the fall animation in seconds */
  duration: number;
  /** Color of the procedural geometry */
  color: string;
  /** Optional emissive color for subtle glow */
  emissive?: string;
}

/** Mouse position normalized to [-1, 1] range relative to the hero container */
export interface NormalizedMouse {
  x: number;
  y: number;
}

/** Current phase of the dish animation */
export type AnimationPhase = "loading" | "assembling" | "idle";
