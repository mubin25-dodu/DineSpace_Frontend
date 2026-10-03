"use no memo";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface VegPieceProps {
  color: string;
  emissive: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scaleVal: number;
  delay: number;
  shape: "sphere" | "cylinder" | "torus";
  visible: boolean;
}

/**
 * A single vegetable piece with its own fall/bounce animation.
 */
function VegPiece({
  color,
  emissive,
  position,
  rotation,
  scaleVal,
  delay,
  shape,
  visible,
}: VegPieceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const progress = useRef(0);
  const elapsed = useRef(0);

  const geometry = useMemo(() => {
    switch (shape) {
      case "sphere":
        return new THREE.SphereGeometry(0.08, 12, 12);
      case "cylinder": {
        const cyl = new THREE.CylinderGeometry(0.04, 0.05, 0.12, 8);
        cyl.rotateZ(Math.PI * 0.3);
        return cyl;
      }
      case "torus":
        return new THREE.TorusGeometry(0.06, 0.025, 8, 16);
      default:
        return new THREE.SphereGeometry(0.08, 12, 12);
    }
  }, [shape]);

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;

    elapsed.current += delta;
    if (!visible || elapsed.current < delay) return;

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 3.0);
    }

    const p = progress.current;
    const eased = 1 - Math.pow(1 - p, 3);
    const bounce = p > 0.8 ? Math.sin((p - 0.8) * Math.PI / 0.2) * 0.025 : 0;

    meshRef.current.scale.setScalar(scaleVal * eased);
    meshRef.current.position.set(
      position[0],
      position[1] + 3.5 * (1 - eased) + bounce,
      position[2]
    );
    meshRef.current.rotation.set(
      rotation[0] + 1.5 * (1 - eased),
      rotation[1] - 2.0 * (1 - eased),
      rotation[2] + 0.8 * (1 - eased)
    );
    matRef.current.opacity = eased;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0} castShadow>
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={emissive}
        emissiveIntensity={0.08}
        roughness={0.7}
        metalness={0.0}
        transparent
        opacity={0}
      />
    </mesh>
  );
}

/**
 * Vegetables group — multiple small pieces scattered on the dish.
 */
export default function Vegetables({ visible }: { visible: boolean }) {
  return (
    <group>
      {/* Broccoli-like sphere */}
      <VegPiece
        color="#5B8C3E"
        emissive="#1A2B12"
        position={[-0.25, 0.05, 0.15]}
        rotation={[0.1, -0.2, 0.05]}
        scaleVal={1.0}
        delay={0}
        shape="sphere"
        visible={visible}
      />
      {/* Carrot slice */}
      <VegPiece
        color="#D4752E"
        emissive="#3D2110"
        position={[0.2, 0.0, -0.2]}
        rotation={[0, 0.15, -0.1]}
        scaleVal={1.1}
        delay={0.15}
        shape="cylinder"
        visible={visible}
      />
      {/* Onion ring */}
      <VegPiece
        color="#E8DBC5"
        emissive="#3D3620"
        position={[-0.1, 0.08, -0.15]}
        rotation={[0.5, 0, 0.2]}
        scaleVal={0.9}
        delay={0.3}
        shape="torus"
        visible={visible}
      />
      {/* Cherry tomato */}
      <VegPiece
        color="#C23B22"
        emissive="#4A1610"
        position={[0.28, 0.03, 0.12]}
        rotation={[0, 0, 0]}
        scaleVal={0.85}
        delay={0.2}
        shape="sphere"
        visible={visible}
      />
    </group>
  );
}
