"use no memo";

/**
 * DishLighting – restaurant-style 3-point lighting setup.
 * Key light, fill light, rim/accent light, plus ambient.
 * Deliberately subtle — avoids flashy effects while giving depth.
 */
export default function DishLighting() {
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.4} color="#FFF8F0" />

      {/* Key light — warm from upper-right (main illumination) */}
      <directionalLight
        position={[3, 5, 2]}
        intensity={1.2}
        color="#FFF0E0"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-near={0.5}
        shadow-camera-far={15}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-bias={-0.001}
      />

      {/* Fill light — cooler from the left, softer */}
      <directionalLight
        position={[-3, 3, 1]}
        intensity={0.35}
        color="#E8EAF6"
      />

      {/* Rim/accent light — behind and below for edge definition */}
      <pointLight
        position={[0, -1, -3]}
        intensity={0.5}
        color="#FFD9B3"
        distance={8}
        decay={2}
      />

      {/* Subtle top highlight for specular on sauce/glaze */}
      <pointLight
        position={[0, 4, 0]}
        intensity={0.3}
        color="#FFFFFF"
        distance={6}
        decay={2}
      />
    </>
  );
}
