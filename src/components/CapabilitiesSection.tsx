"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
const CAPABILITIES = [
  {
    n: "01",
    title: "Heavy Maintenance",
    desc: "C-checks, structural repair, and aging-aircraft programs.",
  },
  {
    n: "02",
    title: "Component MRO",
    desc: "Avionics, hydraulics, landing gear, and NDT inspections.",
  },
  {
    n: "03",
    title: "Parts Logistics",
    desc: "AOG support, bonded warehousing, and OEM distribution.",
  },
  {
    n: "04",
    title: "Private Charter",
    desc: "Bespoke executive jet charter with seamless ground handling and elite in-flight service.",
  },
];

export default function CapabilitiesSection() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // ENTER timeline
      const enterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      enterTl
        .fromTo(
          ".cap-eyebrow",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.5 },
          "+=0.15"
        )
        .fromTo(
          ".cap-title",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.3"
        )
        .fromTo(
          ".cap-row",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.4"
        );

      // EXIT timeline
      const exitTl = gsap.timeline({ paused: true });

      exitTl
        .fromTo(
          ".cap-eyebrow",
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -20,
            duration: 0.5,
            ease: "power3.in",
            immediateRender: false,
          },
          0
        )
        .fromTo(
          ".cap-title",
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -60,
            duration: 0.7,
            ease: "power3.in",
            immediateRender: false,
          },
          0.05
        )
        .fromTo(
          ".cap-row",
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -40,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.in",
            immediateRender: false,
          },
          0.15
        );

      // ENTER trigger
      ScrollTrigger.create({
        trigger: el,
        start: "top 40%",
        onEnter: () => enterTl.play(),
        onLeaveBack: () => enterTl.reverse(),
      });

      // EXIT trigger
      const next = document.getElementById("maintenance");
      if (next) {
        let exitActive = false;

        ScrollTrigger.create({
          trigger: next,
          start: "top bottom",
          end: "top 45%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onUpdate: (self) => {
            // Reset the moment we come back out of range
            if (self.progress <= 0) {
              if (exitActive) exitActive = false;
              return;
            }

            if (!exitActive) {
              exitActive = true;
              if (enterTl.progress() < 1) {
                enterTl.progress(1).pause();
              }
            }
            exitTl.progress(self.progress);
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-full px-5 md:px-10 py-16 md:py-24"
    >
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center">
        <header className="mb-10 md:mb-16">
          <p className="cap-eyebrow font-mono text-[10px] md:text-xs text-[var(--color-amber-accent)] uppercase tracking-[0.3em] mb-3">
            {"// 03. Capabilities"}
          </p>
          <h2 className="cap-title font-display text-[9vw] md:text-[5vw] font-bold leading-[0.9] tracking-[-0.04em] text-[var(--color-ink-primary)] uppercase max-w-4xl">
            Everything Under One Roof.
          </h2>
        </header>

        <div className="flex flex-col">
          {CAPABILITIES.map((c) => (
            <div
              key={c.n}
              className="cap-row group grid grid-cols-12 items-center gap-4 border-t border-[var(--color-ink-primary)]/15 py-6 md:py-8 hover:border-[var(--color-ink-primary)]/40 transition-colors"
            >
              <span className="col-span-2 md:col-span-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/70">
                {c.n}
              </span>
              <h3 className="col-span-10 md:col-span-4 font-display text-2xl md:text-3xl font-bold tracking-tight text-[var(--color-ink-primary)]">
                {c.title}
              </h3>
              <p className="col-span-12 md:col-span-6 font-sans text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                {c.desc}
              </p>
              <span className="hidden md:block md:col-span-1 justify-self-end font-mono text-xs text-[var(--color-ink-primary)]/60 group-hover:text-[var(--color-ink-primary)] transition-colors">
                {"->"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
