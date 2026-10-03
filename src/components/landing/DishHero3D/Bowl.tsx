"use no memo";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Bowl – the base container for the dish.
 * Uses a lathe geometry to create a smooth ceramic bowl shape.
 * Fades/scales into view at animation start.
 */
export default function Bowl({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const animProgress = useRef(0);

  // Generate the bowl profile curve via lathe geometry
  const geometry = useMemo(() => {
    const points: THREE.Vector2[] = [];
    const segments = 32;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Bowl profile: wide opening, curved sides, flat bottom
      const radius = 0.12 + 0.88 * Math.pow(t, 0.45);
      const height = -0.45 * (1 - t);
      points.push(new THREE.Vector2(radius, height));
    }
    return new THREE.LatheGeometry(points, 48);
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    if (visible && animProgress.current < 1) {
      animProgress.current = Math.min(1, animProgress.current + delta * 2.5);
    }

    const p = animProgress.current;
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - p, 3);

    meshRef.current.scale.setScalar(eased);
    meshRef.current.position.y = -0.45 + 0.15 * (1 - eased);
    materialRef.current.opacity = eased;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0} castShadow receiveShadow>
      <meshStandardMaterial
        ref={materialRef}
        color="#E8DDD0"
        roughness={0.35}
        metalness={0.05}
        side={THREE.DoubleSide}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
