"use no memo";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Base food layer (rice/grain bed) that sits inside the bowl.
 * Creates a slightly domed disc of food as the foundation.
 */
export default function BaseFood({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const animProgress = useRef(0);

  const geometry = useMemo(() => {
    // Slightly domed sphere segment for a natural rice mound look
    const geo = new THREE.SphereGeometry(0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.28);
    geo.scale(1, 0.45, 1);
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    if (visible && animProgress.current < 1) {
      animProgress.current = Math.min(1, animProgress.current + delta * 2.8);
    }

    const p = animProgress.current;
    const eased = 1 - Math.pow(1 - p, 3);

    meshRef.current.scale.setScalar(eased);
    meshRef.current.position.y = -0.18 + 2.5 * (1 - eased);
    meshRef.current.rotation.x = 0.3 * (1 - eased);
    materialRef.current.opacity = eased;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0} castShadow>
      <meshStandardMaterial
        ref={materialRef}
        color="#F5F0E1"
        emissive="#2A2518"
        emissiveIntensity={0.08}
        roughness={0.75}
        metalness={0.0}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
