"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const PANEL_COUNT = 5;

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);
  const bracketsRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Freeze scroll via Lenis — no CSS overflow lock, no layout recalc
    lenis?.stop();

    let split: SplitType | null = null;
    if (logoRef.current) {
      split = new SplitType(logoRef.current, { types: "chars" });
    }

    const ctx = gsap.context(() => {
      const panels = panelsRef.current
        ? Array.from(panelsRef.current.children)
        : [];
      const brackets = bracketsRef.current
        ? Array.from(bracketsRef.current.children)
        : [];

      gsap.set(panels, { yPercent: 0 });
      gsap.set(brackets, { opacity: 0, scale: 0.9 });
      gsap.set([taglineRef.current, statusRef.current], { opacity: 0, y: 20 });
      gsap.set(counterRef.current, { opacity: 0 });
      gsap.set(progressRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(split?.chars ?? [], { yPercent: 120, opacity: 0 });

      const counter = { value: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => {
          // Unlock scroll
          lenis?.start();

          // Signal hero (and any other on-load animation) to begin
          if (typeof window !== "undefined") {
            (window as any).__preloaderComplete = true;
            window.dispatchEvent(new CustomEvent("preloader:complete"));
          }

          // Refresh AFTER panels are display:none — layout is stable
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
          });
        },
      });

      tl
        // BEAT 1 — Logo
        .to(split?.chars ?? [], {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.045,
        })
        .to(
          brackets,
          { opacity: 1, scale: 1, duration: 0.45, stagger: 0.05 },
          "-=0.5"
        )
        .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.45 }, "-=0.4")
        .to(statusRef.current, { opacity: 1, y: 0, duration: 0.45 }, "-=0.35")
        .to(counterRef.current, { opacity: 1, duration: 0.25 }, "-=0.35")

        // BEAT 2 — Counter + progress
        .to(
          counter,
          {
            value: 100,
            duration: 1.4,
            ease: "power1.inOut",
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = String(
                  Math.round(counter.value)
                ).padStart(3, "0");
              }
            },
          },
          "-=0.15"
        )
        .to(
          progressRef.current,
          { scaleX: 1, duration: 1.4, ease: "power1.inOut" },
          "<"
        )

        // BEAT 3 — Exit content
        .to({}, { duration: 0.12 })
        .to([taglineRef.current, statusRef.current, counterRef.current], {
          opacity: 0,
          y: -20,
          duration: 0.35,
          stagger: 0.03,
          ease: "power2.in",
        })
        .to(
          brackets,
          {
            opacity: 0,
            scale: 0.85,
            duration: 0.35,
            stagger: 0.02,
            ease: "power2.in",
          },
          "<"
        )
        .to(
          split?.chars ?? [],
          {
            yPercent: -120,
            opacity: 0,
            duration: 0.55,
            stagger: { each: 0.025, from: "center" },
            ease: "power3.in",
          },
          "<0.1"
        )

        // BEAT 4 — Panels rise
        .to(
          panels,
          {
            yPercent: -100,
            duration: 0.95,
            stagger: { each: 0.055, from: "center" },
            ease: "power4.inOut",
          },
          "-=0.15"
        )

        // BEAT 5 — Hide container (but keep in DOM)
        .set(container, { display: "none" });
    }, container);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [lenis]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100]">
      {/* PANELS — vertical strips that bloom outward on exit */}
      <div ref={panelsRef} className="absolute inset-0 flex">
        {Array.from({ length: PANEL_COUNT }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full bg-[var(--color-void)] will-change-transform"
          />
        ))}
      </div>

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 55%, rgba(251,146,60,0.10) 0%, transparent 55%)",
        }}
      />

      {/* HUD corner brackets */}
      <div ref={bracketsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-6 h-6 border-l border-t border-[var(--color-titanium)]/25" />
        <div className="absolute top-8 right-8 w-6 h-6 border-r border-t border-[var(--color-titanium)]/25" />
        <div className="absolute bottom-8 left-8 w-6 h-6 border-l border-b border-[var(--color-titanium)]/25" />
        <div className="absolute bottom-8 right-8 w-6 h-6 border-r border-b border-[var(--color-titanium)]/25" />
      </div>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <h1
          ref={logoRef}
          className="font-display font-bold uppercase text-[var(--color-titanium)] text-[11vw] md:text-[4.5vw] lg:text-[3.2vw] leading-none text-center will-change-transform"
          style={{ letterSpacing: "0.22em" }}
        >
          Sky Thrust
        </h1>

        <p
          ref={taglineRef}
          className="font-mono text-[9px] md:text-[11px] uppercase tracking-[0.45em] text-[var(--color-amber-flare)] mt-6 md:mt-8"
        >
          Precision · Aviation · Services
        </p>
      </div>

      {/* Bottom HUD */}
      <div
        ref={statusRef}
        className="absolute bottom-8 md:bottom-10 left-0 right-0 px-8 md:px-10 flex items-end justify-between"
      >
        <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[var(--color-titanium)]/45">
          // Initializing Facility Systems
        </p>
        <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[var(--color-titanium)]/45">
          <span ref={counterRef} className="text-[var(--color-titanium)]/90">
            000
          </span>{" "}
          / 100
        </p>
      </div>

      {/* Progress line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-titanium)]/10">
        <div
          ref={progressRef}
          className="h-full bg-[var(--color-amber-flare)] will-change-transform"
        />
      </div>
    </div>
  );
}
