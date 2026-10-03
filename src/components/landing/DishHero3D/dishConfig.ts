import type { IngredientConfig } from "./types";

/**
 * Ingredient assembly sequence configuration.
 * Each ingredient has its own timing, trajectory, and visual properties
 * to create an organic-feeling assembly animation.
 */
export const INGREDIENTS: IngredientConfig[] = [
  {
    id: "base-rice",
    startPosition: [-0.3, 4.5, 0.1],
    endPosition: [0, -0.15, 0],
    startRotation: [0.2, 0.5, 0.1],
    endRotation: [0, 0, 0],
    delay: 0.3,
    duration: 0.7,
    color: "#F5F0E1",
    emissive: "#2A2518",
  },
  {
    id: "protein",
    startPosition: [0.5, 5.2, -0.2],
    endPosition: [0.15, 0.1, 0.05],
    startRotation: [-0.3, 1.2, 0.4],
    endRotation: [-0.1, 0.3, 0],
    delay: 0.6,
    duration: 0.65,
    color: "#C8704A",
    emissive: "#3D2216",
  },
  {
    id: "vegetable-1",
    startPosition: [-0.6, 4.8, 0.3],
    endPosition: [-0.25, 0.05, 0.15],
    startRotation: [0.5, -0.8, 0.3],
    endRotation: [0.1, -0.2, 0.05],
    delay: 0.9,
    duration: 0.55,
    color: "#5B8C3E",
    emissive: "#1A2B12",
  },
  {
    id: "vegetable-2",
    startPosition: [0.4, 5.0, -0.4],
    endPosition: [0.2, 0.0, -0.2],
    startRotation: [-0.2, 0.6, -0.5],
    endRotation: [0, 0.15, -0.1],
    delay: 1.05,
    duration: 0.6,
    color: "#D4752E",
    emissive: "#3D2110",
  },
  {
    id: "sauce",
    startPosition: [0.0, 4.6, 0.5],
    endPosition: [0, 0.18, 0],
    startRotation: [0, 0, 0],
    endRotation: [0, 0, 0],
    delay: 1.3,
    duration: 0.5,
    color: "#A13924",
    emissive: "#4A1A10",
  },
  {
    id: "garnish-1",
    startPosition: [-0.2, 5.4, -0.1],
    endPosition: [-0.1, 0.25, 0.1],
    startRotation: [1.0, 2.0, 0.5],
    endRotation: [0.3, 0.8, 0.1],
    delay: 1.55,
    duration: 0.45,
    color: "#3D7A3A",
    emissive: "#0F2A0E",
  },
  {
    id: "garnish-2",
    startPosition: [0.3, 5.1, 0.2],
    endPosition: [0.12, 0.22, -0.08],
    startRotation: [-0.5, 1.5, -0.3],
    endRotation: [-0.1, 0.4, 0],
    delay: 1.7,
    duration: 0.4,
    color: "#F2E8C9",
    emissive: "#3D3820",
  },
];

/** Total time until all ingredients have settled */
export const ASSEMBLY_TOTAL_DURATION = 2.5;

/** Maximum rotation angle (radians) for mouse interaction */
export const MAX_TILT = 0.18;

/** Damping factor for mouse-follow interpolation (lower = smoother) */
export const MOUSE_DAMPING = 0.04;

/** Idle animation amplitude (very subtle) */
export const IDLE_FLOAT_AMPLITUDE = 0.008;
export const IDLE_ROTATE_AMPLITUDE = 0.006;
