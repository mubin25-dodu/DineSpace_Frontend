"use no memo";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GarnishPieceProps {
  color: string;
  position: [number, number, number];
  rotation: [number, number, number];
  delay: number;
  visible: boolean;
}

/** Small herb leaf shape using a custom buffer geometry */
function GarnishLeaf({ color, position, rotation, delay, visible }: GarnishPieceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const progress = useRef(0);
  const elapsed = useRef(0);

  const geometry = useMemo(() => {
    // Leaf shape via extruded shape
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.02, 0.03, 0.04, 0.05, 0.03, 0.07);
    shape.bezierCurveTo(0.02, 0.09, 0.005, 0.08, 0, 0.06);
    shape.bezierCurveTo(-0.005, 0.08, -0.02, 0.09, -0.03, 0.07);
    shape.bezierCurveTo(-0.04, 0.05, -0.02, 0.03, 0, 0);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.005,
      bevelEnabled: true,
      bevelThickness: 0.002,
      bevelSize: 0.003,
      bevelSegments: 2,
    });
    geo.center();
    geo.scale(1.5, 1.5, 1);
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;

    elapsed.current += delta;
    if (!visible || elapsed.current < delay) return;

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 3.5);
    }

    const p = progress.current;
    const eased = 1 - Math.pow(1 - p, 3);
    const flutter = p > 0.7 ? Math.sin((p - 0.7) * Math.PI * 3 / 0.3) * 0.015 * (1 - p) : 0;

    meshRef.current.scale.setScalar(eased);
    meshRef.current.position.set(
      position[0],
      position[1] + 3.0 * (1 - eased) + flutter,
      position[2]
    );
    meshRef.current.rotation.set(
      rotation[0] + 2.0 * (1 - eased),
      rotation[1] - 3.0 * (1 - eased),
      rotation[2] + 1.5 * (1 - eased)
    );
    matRef.current.opacity = eased;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0} castShadow>
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive="#0F2A0E"
        emissiveIntensity={0.1}
        roughness={0.6}
        metalness={0.0}
        transparent
        opacity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Sesame seed – tiny elongated sphere */
function Seed({ position, delay, visible }: { position: [number, number, number]; delay: number; visible: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const progress = useRef(0);
  const elapsed = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.012, 6, 6);
    geo.scale(1, 0.6, 1.4);
    return geo;
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current || !matRef.current) return;

    elapsed.current += delta;
    if (!visible || elapsed.current < delay) return;

    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 4.0);
    }

    const p = progress.current;
    const eased = 1 - Math.pow(1 - p, 2);

    meshRef.current.scale.setScalar(eased);
    meshRef.current.position.set(
      position[0],
      position[1] + 2.5 * (1 - eased),
      position[2]
    );
    matRef.current.opacity = eased;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0}>
      <meshStandardMaterial
        ref={matRef}
        color="#F2E8C9"
        emissive="#3D3820"
        emissiveIntensity={0.08}
        roughness={0.5}
        metalness={0.0}
        transparent
        opacity={0}
      />
    </mesh>
  );
}

/**
 * Garnish group — herb leaves and sesame seeds scattered on top.
 */
export default function Garnish({ visible }: { visible: boolean }) {
  return (
    <group>
      <GarnishLeaf
        color="#3D7A3A"
        position={[-0.1, 0.25, 0.1]}
        rotation={[0.3, 0.8, 0.1]}
        delay={0}
        visible={visible}
      />
      <GarnishLeaf
        color="#4A8C42"
        position={[0.18, 0.22, -0.05]}
        rotation={[-0.2, 1.2, -0.15]}
        delay={0.12}
        visible={visible}
      />
      <GarnishLeaf
        color="#2D6B28"
        position={[-0.05, 0.24, -0.12]}
        rotation={[0.5, 0.3, 0.3]}
        delay={0.25}
        visible={visible}
      />
      {/* Sesame seeds */}
      <Seed position={[0.08, 0.2, 0.08]} delay={0.1} visible={visible} />
      <Seed position={[-0.15, 0.18, 0.05]} delay={0.18} visible={visible} />
      <Seed position={[0.05, 0.19, -0.1]} delay={0.22} visible={visible} />
      <Seed position={[-0.08, 0.21, -0.06]} delay={0.28} visible={visible} />
      <Seed position={[0.2, 0.17, 0.0]} delay={0.15} visible={visible} />
    </group>
  );
}
