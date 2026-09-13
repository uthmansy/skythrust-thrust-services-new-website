"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const locations = [
  {
    id: 1,
    city: "Kano",
    status: "Active",
    role: "Heavy Maintenance Hub",
    desc: "Heavy structural checks, engine maintenance, and dedicated line service capabilities. Full regulatory certification and tooling.",
    coords: "12.0022° N, 8.5920° E",
  },
  {
    id: 2,
    city: "Abuja",
    status: "Active",
    role: "Rapid Response Center",
    desc: "Rapid response maintenance, avionics overhauls, and component testing. Centralized hub for executive and commercial fleets.",
    coords: "9.0579° N, 7.4951° E",
  },
  {
    id: 3,
    city: "Lagos",
    status: "Coming Soon",
    role: "West Africa Gateway",
    desc: "Expanding our national network to deliver turnaround speed directly to West Africa's primary aviation gateway.",
    coords: "6.5244° N, 3.3792° E",
  },
];

export default function FootprintSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".location-card");

      // Scroll-triggered staggered reveal
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, rotateX: 10 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.15,
          ease: "var(--ease-physics-out)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // 3D Tilt Physics on Hover
      cards.forEach((card) => {
        card.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg tilt
          const rotateY = ((x - centerX) / centerX) * 5;

          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: "var(--ease-elastic)",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="footprint"
      ref={sectionRef}
      className="relative py-[15vh] px-[8vw] bg-[var(--color-void)]"
    >
      {/* Background Grid Lines for Technical Feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <p className="font-mono text-[var(--color-amber-flare)] text-sm tracking-widest uppercase mb-4">
            // 02. Strategic Footprint
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[var(--color-titanium)] max-w-4xl leading-[1.1]">
            Positioned Where You
            <br />
            <span className="text-gray-500">Need Us Most.</span>
          </h2>
          <p className="mt-6 font-sans text-lg text-gray-400 max-w-2xl">
            Minimizing Aircraft on Ground (AOG) time through a decentralized
            network of state-of-the-art hangars across Nigeria.
          </p>
        </div>

        {/* Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="location-card group relative bg-[var(--color-glass-sheen)] border border-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 transition-colors duration-500 hover:border-[var(--color-amber-flare)]/20 hover:bg-white/[0.06] will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Status Indicator */}
              <div className="flex items-center gap-2 mb-8">
                <span
                  className={`w-2 h-2 rounded-full ${loc.status === "Active" ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-gray-500"}`}
                />
                <span className="font-mono text-xs tracking-wider uppercase text-gray-400">
                  {loc.status}
                </span>
              </div>

              {/* City & Role */}
              <h3 className="font-display text-4xl md:text-5xl font-bold text-[var(--color-titanium)] mb-2 tracking-tight">
                {loc.city}
              </h3>
              <p className="font-mono text-sm text-[var(--color-amber-flare)] mb-6">
                {loc.role}
              </p>

              {/* Description */}
              <p className="font-sans text-base text-gray-400 leading-relaxed mb-8">
                {loc.desc}
              </p>

              {/* Coordinates (Technical Detail) */}
              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  Coordinates
                </span>
                <span className="font-mono text-xs text-gray-300">
                  {loc.coords}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
