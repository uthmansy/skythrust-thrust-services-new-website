"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const MARQUEE_WORDS = [
  "Absolute Safety",
  "Uncompromising Quality",
  "Relentless Efficiency",
];

const STATS = [
  { value: "03", label: "Strategic Hubs", meta: "Kano / Abuja / Lagos" },
  { value: "100%", label: "Regulatory Compliance", meta: "NCAA / EASA / FAA" },
  {
    value: "24/7/365",
    label: "AOG Rapid Dispatch",
    meta: "Continuous Coverage",
  },
  { value: "ISO 9001", label: "Quality Management", meta: "2015 Aligned" },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const trackARef = useRef<HTMLDivElement>(null);
  const trackBRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Marquee infinite loops
      const trackA = trackARef.current;
      const trackB = trackBRef.current;
      if (trackA) {
        gsap.to(trackA, {
          xPercent: -50,
          duration: 45,
          ease: "none",
          repeat: -1,
        });
      }
      if (trackB) {
        gsap.fromTo(
          trackB,
          { xPercent: -50 },
          { xPercent: 0, duration: 60, ease: "none", repeat: -1 }
        );
      }

      // ENTER timeline
      const enterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      enterTl
        .fromTo(
          ".about-marquee-top",
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.9 }
        )
        .fromTo(
          ".about-eyebrow",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.6"
        )
        .fromTo(
          ".about-title-line",
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          "-=0.4"
        )
        .fromTo(
          ".about-rule",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.9 },
          "-=0.5"
        )
        .fromTo(
          ".about-body",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          "-=0.6"
        )
        .fromTo(
          ".about-stats-rule",
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          ".about-stat",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          "-=0.4"
        )
        .fromTo(
          ".about-marquee-footer",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4"
        );

      // EXIT timeline
      const exitTl = gsap.timeline({ paused: true });

      exitTl
        .fromTo(
          ".about-marquee-top",
          { opacity: 1, x: 0 },
          {
            opacity: 0,
            x: "-15%",
            duration: 0.9,
            ease: "power2.in",
            immediateRender: false,
          },
          0
        )
        .fromTo(
          ".about-marquee-footer",
          { opacity: 1, x: 0 },
          {
            opacity: 0,
            x: "15%",
            duration: 0.9,
            ease: "power2.in",
            immediateRender: false,
          },
          0
        )
        .fromTo(
          ".about-eyebrow",
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -30,
            duration: 0.5,
            stagger: 0.04,
            ease: "power3.in",
            immediateRender: false,
          },
          0
        )
        .fromTo(
          ".about-title-line",
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -80,
            duration: 0.7,
            stagger: { each: 0.08, from: "end" },
            ease: "power3.in",
            immediateRender: false,
          },
          0.1
        )
        .fromTo(
          ".about-rule",
          { scaleX: 1, transformOrigin: "right center" },
          {
            scaleX: 0,
            duration: 0.6,
            ease: "power3.in",
            immediateRender: false,
          },
          0.3
        )
        .fromTo(
          ".about-body",
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -40,
            duration: 0.6,
            stagger: 0.1,
            ease: "power3.in",
            immediateRender: false,
          },
          0.35
        )
        .fromTo(
          ".about-stats-rule",
          { scaleX: 1, transformOrigin: "right center" },
          {
            scaleX: 0,
            duration: 0.5,
            ease: "power3.in",
            immediateRender: false,
          },
          0.4
        )
        .fromTo(
          ".about-stat",
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: 50,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.in",
            immediateRender: false,
          },
          0.45
        );

      // ENTER trigger
      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        onEnter: () => enterTl.play(),
        onLeaveBack: () => enterTl.reverse(),
      });

      // EXIT trigger — fires the instant capabilities enters the viewport
      const next = document.getElementById("capabilities");
      if (next) {
        let exitActive = false;

        ScrollTrigger.create({
          trigger: next,
          start: "top bottom",
          end: "top 50%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onUpdate: (self) => {
            if (self.progress > 0 && !exitActive) {
              exitActive = true;
              if (enterTl.progress() < 1) {
                enterTl.progress(1).pause();
              }
            }
            if (exitActive) {
              exitTl.progress(self.progress);
            }
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-full flex flex-col px-5 md:px-10 py-8 md:py-14 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6 md:mb-10">
        <p className="about-eyebrow font-mono text-[10px] md:text-xs text-[var(--color-amber-accent)] uppercase tracking-[0.3em]">
          {"// 02. Corporate Overview"}
        </p>
        <p className="about-eyebrow font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-secondary)]/55">
          EST / MMXXIV
        </p>
      </div>

      <div className="about-marquee-top -mx-5 md:-mx-10 overflow-hidden border-y border-[var(--color-ink-primary)]/10 py-2 md:py-4 will-change-transform">
        <div
          ref={trackARef}
          className="flex whitespace-nowrap will-change-transform"
        >
          {[0, 1, 2, 3].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {MARQUEE_WORDS.map((word, idx) => (
                <span
                  key={`${copy}-${idx}`}
                  className="font-display font-bold uppercase tracking-[-0.035em] text-[14vw] md:text-[10vw] leading-[0.9] pr-[5vw]"
                  style={{
                    color:
                      idx % 2 === 0
                        ? "var(--color-ink-primary)"
                        : "transparent",
                    WebkitTextStroke:
                      idx % 2 === 0 ? "0" : "1px rgba(15,23,42,0.35)",
                  }}
                >
                  {word}
                  <span className="text-[var(--color-amber-accent)] pl-[1vw]">
                    {"*"}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mt-8 md:mt-12">
        <div className="md:col-span-5">
          <h2 className="about-title-line font-display text-[9vw] md:text-[3.4vw] font-bold leading-[0.92] tracking-[-0.04em] text-[var(--color-ink-primary)] uppercase">
            Integrated
          </h2>
          <h2 className="about-title-line font-display text-[9vw] md:text-[3.4vw] font-bold leading-[0.92] tracking-[-0.04em] text-[var(--color-ink-primary)] uppercase">
            Aviation
          </h2>
          <h2 className="about-title-line font-display text-[9vw] md:text-[3.4vw] font-bold leading-[0.92] tracking-[-0.04em] uppercase">
            <span className="text-[var(--color-amber-accent)]">Ecosystem.</span>
          </h2>
          <div className="about-rule mt-5 md:mt-7 h-px bg-[var(--color-ink-primary)]/20 w-full max-w-sm" />
        </div>

        <div className="md:col-span-7 flex flex-col gap-4 md:gap-5 md:pt-2">
          <p className="about-body font-sans text-[12.5px] md:text-[15px] text-[var(--color-ink-secondary)] leading-relaxed max-w-xl">
            Sky Thrust Services is West Africa&apos;s premier integrated
            aviation partner, delivering a closed-loop ecosystem for the entire
            aircraft lifecycle. We bridge rigorous engineering with
            uncompromising luxury.
          </p>
          <p className="about-body font-sans text-[12.5px] md:text-[15px] text-[var(--color-ink-secondary)] leading-relaxed max-w-xl">
            Heavy maintenance, rapid supply-chain logistics, elite private
            charter, and strategic brokerage, united under one roof, eliminating
            the friction of fragmented vendor management.
          </p>
          <div className="about-body flex items-center gap-3 font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink-primary)]/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Zero-Incident Safety Culture</span>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 md:pt-10">
        {/* Extracted so it can be animated in/out */}
        <div className="about-stats-rule h-px bg-[var(--color-ink-primary)]/15 w-full" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 pt-5 md:pt-7 pb-8 md:pb-10">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="about-stat flex flex-col gap-1.5 md:pr-6 md:border-r md:border-[var(--color-ink-primary)]/10 md:last:border-r-0"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-ink-secondary)]/55">
                0{i + 1}
              </span>
              <span className="font-display text-2xl md:text-[2.4vw] font-bold tracking-[-0.03em] text-[var(--color-ink-primary)] leading-none">
                {s.value}
              </span>
              <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-primary)]/75 mt-1">
                {s.label}
              </span>
              <span className="font-sans text-[10px] md:text-[11px] text-[var(--color-ink-secondary)]/65">
                {s.meta}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="about-marquee-footer hidden md:block absolute bottom-0 left-0 right-0 border-t border-[var(--color-ink-primary)]/10 bg-white/40 backdrop-blur-md will-change-transform">
        <div className="overflow-hidden py-2.5">
          <div
            ref={trackBRef}
            className="flex whitespace-nowrap will-change-transform"
          >
            {[0, 1, 2, 3].map((copy) => (
              <div key={copy} className="flex shrink-0">
                {[...Array(4)].map((_, idx) => (
                  <span
                    key={`${copy}-${idx}`}
                    className="font-mono text-[9px] uppercase tracking-[0.4em] text-[var(--color-ink-secondary)]/55 pr-10"
                  >
                    Safety / Quality / Availability / Compliance / Precision
                    /{" "}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
