"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, Suspense } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { vertexShader, fragmentShader } from "../shaders/flashlightShader";

function ShaderPlane() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport, size } = useThree();

  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));

  // Load the texture. If this crashes, the image path is wrong.
  const texture = useTexture("/assets/cabin.jpg");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseTarget.current.set(
        e.clientX / size.width,
        1.0 - e.clientY / size.height
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size]);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.u_mouse.value.lerp(mouseTarget.current, 0.08);
      material.current.uniforms.u_time.value = state.clock.getElapsedTime();
      material.current.uniforms.u_resolution.value.set(size.width, size.height);
    }
  });

  return (
    <mesh>
      {/* viewport.width/height perfectly fills the screen */}
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          u_texture: { value: texture },
          u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
          u_resolution: { value: new THREE.Vector2(size.width, size.height) },
          u_time: { value: 0 },
        }}
      />
    </mesh>
  );
}

export default function CabinReveal() {
  return (
    <Canvas className="!absolute inset-0 z-0">
      {/* Suspense waits for the image to load before rendering the plane */}
      <Suspense fallback={null}>
        <ShaderPlane />
      </Suspense>
    </Canvas>
  );
}
