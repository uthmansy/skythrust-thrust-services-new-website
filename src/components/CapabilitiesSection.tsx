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
      /* ---------- PRE-PAINT ---------- */
      gsap.set(".cap-eyebrow", { opacity: 0, y: 30 });
      gsap.set(".cap-title", { opacity: 0, y: 50 });
      gsap.set(".cap-header-rule", {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(".cap-row-content", { opacity: 0, y: 30 });
      gsap.set(".cap-row-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".cap-foot-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".cap-foot", { opacity: 0, y: 16 });

      /* ---------- ENTER ---------- */
      const enterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      enterTl
        .to(".cap-eyebrow", { opacity: 1, y: 0, duration: 0.5 })
        .to(".cap-title", { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
        .to(
          ".cap-header-rule",
          { scaleX: 1, duration: 0.9, ease: "power2.inOut" },
          "-=0.4"
        )
        .to(
          ".cap-row-rule",
          {
            scaleX: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.6"
        )
        .to(
          ".cap-row-content",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          "-=0.55"
        )
        .to(
          ".cap-foot-rule",
          { scaleX: 1, duration: 0.7, ease: "power2.inOut" },
          "-=0.35"
        )
        .to(".cap-foot", { opacity: 1, y: 0, duration: 0.4 }, "-=0.5");

      /* ---------- EXIT ---------- */
      const exitTl = gsap.timeline({ paused: true });

      exitTl
        /* Eyebrow up */
        .to(
          ".cap-eyebrow",
          { opacity: 0, y: -24, duration: 0.4, ease: "power3.in" },
          0
        )
        /* Title collapses */
        .to(
          ".cap-title",
          { opacity: 0, y: -40, duration: 0.5, ease: "power3.in" },
          0.05
        )
        /* Header rule wipes right-to-left */
        .to(
          ".cap-header-rule",
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.5,
            ease: "power3.inOut",
          },
          0.1
        )
        /* Rows exit in reverse (bottom → top), border wipes + content lifts */
        .to(
          ".cap-row-content",
          {
            opacity: 0,
            y: -30,
            duration: 0.45,
            stagger: { each: 0.08, from: "end" },
            ease: "power3.in",
          },
          0.15
        )
        .to(
          ".cap-row-rule",
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.45,
            stagger: { each: 0.08, from: "end" },
            ease: "power3.inOut",
          },
          0.2
        )
        /* Foot clears last */
        .to(
          ".cap-foot",
          { opacity: 0, y: -12, duration: 0.35, ease: "power3.in" },
          0.5
        )
        .to(
          ".cap-foot-rule",
          {
            scaleX: 0,
            transformOrigin: "right center",
            duration: 0.4,
            ease: "power3.inOut",
          },
          0.55
        );

      /* ---------- ENTER TRIGGER ---------- */
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        onEnter: () => enterTl.progress(0).play(),
        onLeaveBack: () => enterTl.progress(0).pause(),
      });

      /* ---------- EXIT TRIGGER ---------- */
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
            /* Reset when out of range — allows re-entry */
            if (self.progress <= 0) {
              if (exitActive) {
                exitActive = false;
                gsap.set(".cap-eyebrow", { opacity: 1, y: 0 });
                gsap.set(".cap-title", { opacity: 1, y: 0 });
                gsap.set(".cap-header-rule", { scaleX: 1 });
                gsap.set(".cap-row-content", { opacity: 1, y: 0 });
                gsap.set(".cap-row-rule", { scaleX: 1 });
                gsap.set(".cap-foot", { opacity: 1, y: 0 });
                gsap.set(".cap-foot-rule", { scaleX: 1 });
              }
              return;
            }

            if (!exitActive) {
              exitActive = true;

              /* Force-complete the enter so it doesn't fight the exit */
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
      className="relative w-full h-full px-5 md:px-10 py-12 md:py-24"
    >
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col justify-center">
        {/* ---------- HEADER ---------- */}
        <header className="mb-6 md:mb-14">
          <p className="cap-eyebrow font-mono text-[10px] md:text-xs text-[var(--color-amber-accent)] uppercase tracking-[0.3em] mb-2 md:mb-3">
            {"// 03. Capabilities"}
          </p>
          <h2 className="cap-title font-display text-[9vw] md:text-[5vw] font-bold leading-[0.9] tracking-[-0.04em] text-[var(--color-ink-primary)] uppercase max-w-4xl">
            Everything Under One Roof.
          </h2>
          <div className="cap-header-rule mt-5 md:mt-8 h-px bg-[var(--color-ink-primary)]/20 w-full max-w-md" />
        </header>

        {/* ---------- ROWS ---------- */}
        <div className="flex flex-col">
          {CAPABILITIES.map((c) => (
            <div
              key={c.n}
              className="cap-row group relative grid grid-cols-12 items-start gap-x-3 md:gap-x-4 gap-y-1.5 md:gap-y-0 py-4 md:py-7 transition-colors"
            >
              {/* Row top rule — animated separately */}
              <div
                className="cap-row-rule absolute top-0 left-0 right-0 h-px bg-[var(--color-ink-primary)]/15 group-hover:bg-[var(--color-ink-primary)]/40 transition-colors"
                aria-hidden
              />

              {/* Number */}
              <span className="cap-row-content col-span-2 md:col-span-1 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/70 pt-1.5 md:pt-0">
                {c.n}
              </span>

              {/* Title */}
              <h3 className="cap-row-content col-span-10 md:col-span-4 font-display text-[20px] md:text-3xl font-bold tracking-[-0.01em] md:tracking-tight text-[var(--color-ink-primary)] leading-[1.1]">
                {c.title}
              </h3>

              {/* Description — indented under title on mobile */}
              <p className="cap-row-content col-span-10 col-start-3 md:col-span-6 md:col-start-auto font-sans text-[12.5px] md:text-sm text-[var(--color-ink-secondary)] leading-relaxed pr-6 md:pr-0">
                {c.desc}
              </p>

              {/* Arrow — mobile shows small, desktop normal */}
              <span
                className="cap-row-content col-span-12 md:hidden mt-1 ml-0 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-primary)]/45"
                aria-hidden
              >
                {"->"}
              </span>

              {/* Arrow — desktop */}
              <span
                className="cap-row-content hidden md:block md:col-span-1 justify-self-end font-mono text-xs text-[var(--color-ink-primary)]/60 group-hover:text-[var(--color-ink-primary)] group-hover:translate-x-1 transition-all"
                aria-hidden
              >
                {"->"}
              </span>
            </div>
          ))}
        </div>

        {/* ---------- FOOTER HUD ---------- */}
        <div className="cap-foot-rule mt-2 md:mt-4 h-px bg-[var(--color-ink-primary)]/15 w-full" />
        <div className="cap-foot mt-3 md:mt-4 flex items-center justify-between gap-4">
          <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/55">
            04 Divisions / One Provider
          </p>
          <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/55 whitespace-nowrap">
            NCAA / EASA / FAA
          </p>
        </div>
      </div>
    </div>
  );
}
