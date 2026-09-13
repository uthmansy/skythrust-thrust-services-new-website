"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const LOCATIONS = [
  {
    code: "KAN",
    name: "Kano",
    desc: "Northern heavy-lift & wide-body hangar.",
    capacity: "6 bays",
  },
  {
    code: "ABV",
    name: "Abuja",
    desc: "Government & VIP fleet line maintenance.",
    capacity: "4 bays",
  },
  {
    code: "LOS",
    name: "Lagos",
    desc: "Primary component & engine MRO hub.",
    capacity: "8 bays",
  },
];

export default function StrategicFootprint() {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Pre-paint hidden states
      gsap.set([".sf-eyebrow", ".sf-title"], { opacity: 0, y: 40 });
      gsap.set(".sf-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".sf-card", { opacity: 0, y: 80 });

      // ─── ENTER ─────────────────────────────────────────────────
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        .to(".sf-eyebrow", { opacity: 1, y: 0, duration: 0.5 })
        .to(".sf-title", { opacity: 1, y: 0, duration: 0.7 }, "-=0.3")
        .to(".sf-rule", { scaleX: 1, duration: 0.7 }, "-=0.5")
        .to(
          ".sf-card",
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.6 },
          "-=0.4"
        );

      // ─── EXIT — triggered by the next scene ────────────────────
      //   const next = document.getElementById("capabilities");
      //   if (next) {
      //     gsap
      //       .timeline({
      //         scrollTrigger: {
      //           trigger: next,
      //           start: "top bottom",
      //           end: "top top",
      //           scrub: 1,
      //           invalidateOnRefresh: true,
      //         },
      //       })
      //       .to(".sf-eyebrow", { opacity: 0, y: -20, ease: "power3.in" }, 0)
      //       .to(".sf-title", { opacity: 0, y: -60, ease: "power3.in" }, 0)
      //       .to(
      //         ".sf-rule",
      //         { scaleX: 0, transformOrigin: "right center", ease: "power3.in" },
      //         0
      //       )
      //       .to(
      //         ".sf-card",
      //         { opacity: 0, y: -40, stagger: 0.05, ease: "power3.in" },
      //         0
      //       );
      //   }
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
          <p className="sf-eyebrow font-mono text-[10px] md:text-xs text-[var(--color-amber-accent)] uppercase tracking-[0.3em] mb-3">
            // 02. Strategic Footprint
          </p>
          <h2 className="sf-title font-display text-[9vw] md:text-[5vw] font-bold leading-[0.9] tracking-[-0.04em] text-[var(--color-ink-primary)] uppercase max-w-4xl">
            Three Hangars. One Standard.
          </h2>
          <div className="sf-rule mt-6 h-px bg-[var(--color-ink-primary)]/20 w-full max-w-2xl" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {LOCATIONS.map((loc) => (
            <article
              key={loc.code}
              className="sf-card relative rounded-2xl border border-[var(--color-ink-primary)]/10 bg-white/50 backdrop-blur-md p-5 md:p-7 flex flex-col gap-6"
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/70">
                  {loc.code}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-ink-primary)] mb-2">
                  {loc.name}
                </h3>
                <p className="font-sans text-xs md:text-sm text-[var(--color-ink-secondary)] leading-relaxed">
                  {loc.desc}
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-primary)]">
                <span>{loc.capacity}</span>
                <span className="w-6 h-px bg-[var(--color-ink-primary)]/30" />
                <span className="opacity-60">View</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
