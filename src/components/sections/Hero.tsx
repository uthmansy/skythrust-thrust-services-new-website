"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import TextReveal from "@/components/ui/TextReveal";

const CabinReveal = dynamic(() => import("../canvas/CabinReveal"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-bg-primary">
      <Suspense fallback={<div className="absolute inset-0 bg-bg-primary" />}>
        <CabinReveal />
      </Suspense>

      <div className="relative z-10 text-center pointer-events-none select-none">
        <TextReveal
          as="h1"
          animation="mask"
          className="text-5xl md:text-8xl font-bold text-text-luxury tracking-tighter mb-4 drop-shadow-2xl"
        >
          Sky Thrust Services
        </TextReveal>

        <TextReveal
          as="p"
          animation="stagger"
          delay={0.5}
          className="text-accent-luxury font-mono text-sm md:text-base uppercase tracking-[0.2em] drop-shadow-lg mt-4"
        >
          [ Move cursor to reveal ]
        </TextReveal>
      </div>
    </section>
  );
}
