"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    id: 1,
    title: "High-Volume Consumables",
    desc: "Aircraft tires, specialized brake pads, hydraulic fluids, engine oils, high-grade filters, and lubricants.",
    icon: "⚙️", // Replace with actual SVG/Lucide icon in production
  },
  {
    id: 2,
    title: "Structural Hardware",
    desc: "Specialized aircraft fasteners (screws, bolts, rivets), sealants, and oxygen system components.",
    icon: "🔩",
  },
  {
    id: 3,
    title: "Maintenance Chemicals",
    desc: "Industry-compliant cleaning chemicals and safety-rated operational solvents.",
    icon: "🧪",
  },
];

export default function SparesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".spare-item");

      items.forEach((item, i) => {
        const isEven = i % 2 === 0;
        const textBlock = item.querySelector(".spare-text");
        const visualBlock = item.querySelector(".spare-visual");

        // 1. Scroll-Triggered Alternating Slide-In
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "top 50%",
            scrub: 1, // Physics-based scrub
          },
        });

        tl.fromTo(
          textBlock,
          { x: isEven ? -100 : 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: "var(--ease-physics-out)" }
        ).fromTo(
          visualBlock,
          { x: isEven ? 100 : -100, opacity: 0, scale: 0.9 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "var(--ease-physics-out)",
          },
          "-=0.8"
        );

        // 2. Continuous Zero-Gravity Floating Animation (Sine Wave)
        if (visualBlock) {
          gsap.to(visualBlock, {
            y: -15,
            duration: 2.5 + i * 0.5, // Stagger the timing so they don't float in sync
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-[15vh] px-[8vw] bg-[var(--color-void)]"
    >
      <div className="max-w-7xl mx-auto mb-20">
        <p className="font-mono text-[var(--color-amber-flare)] text-sm tracking-widest uppercase mb-4">
          // 04. Logistics & Supply Chain
        </p>
        <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight text-[var(--color-titanium)] max-w-3xl">
          High-Volume Spares &<br />
          <span className="text-gray-500">Consumables Supply.</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto space-y-[15vh]">
        {pillars.map((pillar, i) => (
          <div
            key={pillar.id}
            className="spare-item flex flex-col md:flex-row items-center gap-12 md:gap-24"
          >
            {/* Text Block */}
            <div
              className={`spare-text flex-1 ${i % 2 !== 0 ? "md:order-2" : ""}`}
            >
              <h3 className="font-display text-3xl md:text-4xl font-semibold text-[var(--color-titanium)] mb-6">
                {pillar.title}
              </h3>
              <p className="font-sans text-lg text-gray-400 leading-relaxed max-w-lg">
                {pillar.desc}
              </p>
              <div className="mt-8 h-[1px] w-24 bg-[var(--color-amber-flare)]/50" />
            </div>

            {/* Visual Block (Floating) */}
            <div
              className={`spare-visual flex-1 ${i % 2 !== 0 ? "md:order-1" : ""}`}
            >
              <div className="relative w-full aspect-square max-w-md rounded-3xl bg-[var(--color-glass-sheen)] border border-white/5 backdrop-blur-xl flex items-center justify-center overflow-hidden group">
                {/* Subtle inner glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-amber-flare)]/0 to-[var(--color-amber-flare)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span
                  className="text-8xl grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
                  style={{ transitionTimingFunction: "var(--ease-elastic)" }}
                >
                  {pillar.icon}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
