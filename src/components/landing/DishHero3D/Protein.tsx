"use no memo";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Protein piece – a rounded irregular shape representing grilled meat/fish.
 * Uses a deformed box geometry for an organic look.
 */
export default function Protein({ visible }: { visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const animProgress = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.42, 0.12, 0.32, 8, 4, 8);
    // Deform vertices for organic shape
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      // Round the edges
      const dist = Math.sqrt(x * x + z * z);
      const roundFactor = Math.max(0, 1 - dist * 1.8);
      pos.setY(i, y + roundFactor * 0.06 + Math.sin(x * 5 + z * 3) * 0.01);
      pos.setX(i, x + Math.sin(y * 8 + z * 4) * 0.015);
      pos.setZ(i, z + Math.cos(x * 6 + y * 3) * 0.015);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    if (visible && animProgress.current < 1) {
      animProgress.current = Math.min(1, animProgress.current + delta * 2.6);
    }

    const p = animProgress.current;
    const eased = 1 - Math.pow(1 - p, 3);
    // Bounce effect
    const bounce = p < 0.85 ? 0 : Math.sin((p - 0.85) * Math.PI / 0.15) * 0.03;

    meshRef.current.scale.setScalar(eased);
    meshRef.current.position.set(
      0.15,
      0.05 + 3.2 * (1 - eased) + bounce,
      0.05
    );
    meshRef.current.rotation.set(
      -0.1 + 0.4 * (1 - eased),
      0.3 - 1.0 * (1 - eased),
      0.15 * (1 - eased)
    );
    materialRef.current.opacity = eased;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0} castShadow>
      <meshStandardMaterial
        ref={materialRef}
        color="#C8704A"
        emissive="#3D2216"
        emissiveIntensity={0.1}
        roughness={0.65}
        metalness={0.05}
        transparent
        opacity={0}
      />
    </mesh>
  );
}
