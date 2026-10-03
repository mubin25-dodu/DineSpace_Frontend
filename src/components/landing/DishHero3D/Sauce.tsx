"use no memo";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Sauce drizzle — a flattened torus that appears as sauce on top of the dish.
 * Fades/scales in with a softer animation (no hard bounce).
 */
export default function Sauce({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const progress = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.TorusGeometry(0.28, 0.035, 8, 32);
    // Flatten it to look like a sauce drizzle ring
    geo.scale(1, 0.3, 1);
    // Add some irregularity
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(
        i,
        pos.getY(i) + Math.sin(x * 8 + z * 6) * 0.008
      );
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;

    if (visible && progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 2.5);
    }

    const p = progress.current;
    // Soft ease-out
    const eased = 1 - Math.pow(1 - p, 4);

    meshRef.current.scale.setScalar(eased);
    meshRef.current.position.y = 0.02 + 0.8 * (1 - eased);
    matRef.current.opacity = eased * 0.85;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0} castShadow>
      <meshStandardMaterial
        ref={matRef}
        color="#A13924"
        emissive="#4A1A10"
        emissiveIntensity={0.15}
        roughness={0.3}
        metalness={0.1}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
