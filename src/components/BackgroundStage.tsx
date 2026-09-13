"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BackgroundStage() {
  const aircraftRef = useRef<HTMLImageElement>(null);
  const distantCloudsRef = useRef<HTMLImageElement>(null);
  const foregroundMistRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Load Choreography: Aircraft glides in from right with subtle rotation
      gsap.fromTo(
        aircraftRef.current,
        { x: 100, rotation: 3, opacity: 0 },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.8,
          ease: "var(--ease-physics-out)",
          delay: 0.2,
        }
      );

      // 2. Distant Clouds: Slowest (0.4x relative speed)
      gsap.to(distantCloudsRef.current, {
        y: -150, // Increased distance for more dramatic parallax
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement, // FIX: Measure against the whole document
          start: "top top",
          end: "bottom bottom",
          scroller: document.documentElement, // FIX: Tell GSAP Lenis is scrolling the html element
          scrub: 1.2,
        },
      });

      // 3. Hero Aircraft: Medium speed (0.8x relative speed) + subtle bank on scroll
      gsap.to(aircraftRef.current, {
        y: -300, // Increased distance
        rotation: 6, // Slightly more dramatic banking
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scroller: document.documentElement,
          scrub: 0.8,
        },
      });

      // 4. Foreground Mist: Fastest (1.2x relative speed)
      gsap.to(foregroundMistRef.current, {
        y: -450, // Increased distance
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scroller: document.documentElement,
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert(); // Cleanup for Next.js HMR
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Layer 0: Atmospheric Canvas (Opaque Base) */}
      <div className="absolute inset-0 bg-[var(--color-stratosphere)]">
        <img
          src="/assets/sky-gradient.webp"
          alt="Atmospheric Gradient"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Layer 1: Distant Clouds (Parallax 0.4x) */}
      <img
        ref={distantCloudsRef}
        src="/assets/clouds-distant.webp"
        alt="Distant Clouds"
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen will-change-transform"
        draggable={false}
      />

      {/* Layer 2: Hero Aircraft (Parallax 0.8x) */}
      <div className="absolute top-[5%] right-[5%] w-[60%] max-w-[1000px] will-change-transform">
        <img
          ref={aircraftRef}
          src="/assets/hero-aircraft.webp"
          alt="Sky Thrust Hero Aircraft"
          className="w-full h-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)]"
          draggable={false}
        />
      </div>

      {/* Layer 3: Foreground Mist (Parallax 1.2x) */}
      <img
        ref={foregroundMistRef}
        src="/assets/clouds-foreground.webp"
        alt="Foreground Mist"
        className="absolute bottom-0 left-0 w-full h-[60vh] object-cover opacity-5 mix-blend-screen will-change-transform"
        draggable={false}
      />
    </div>
  );
}
