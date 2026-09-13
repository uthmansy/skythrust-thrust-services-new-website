"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const aircraftRef = useRef<HTMLImageElement>(null);
  const lenis = useLenis();
  const [ready, setReady] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const textEl = textRef.current;
    const aircraft = aircraftRef.current;
    if (!section || !textEl || !aircraft) return;

    let split: SplitType | null = null;
    let mm: ReturnType<typeof gsap.matchMedia> | null = null;

    const ctx = gsap.context(() => {
      //@ts-ignore
      split = new SplitType(textEl, { types: "lines, words" });
      const words = split.words;

      // PRE-PAINT
      gsap.set(words, { yPercent: 100, opacity: 0 });
      gsap.set(aircraft, { opacity: 0 });
      gsap.set(".hero-ui", { y: 20, opacity: 0 });
      gsap.set(".hero-meta", { opacity: 0, y: 8 });
      gsap.set(".hero-bracket", { opacity: 0, scale: 0.9 });
      gsap.set(".hero-scan", { opacity: 0 });
      gsap.set(".hero-pulse", { opacity: 0 });
      setReady(true);

      mm = gsap.matchMedia();

      mm.add(
        { isMobile: "(max-width: 767px)", isDesktop: "(min-width: 768px)" },
        (context) => {
          const { isMobile } = context.conditions as {
            isMobile: boolean;
            isDesktop: boolean;
          };

          const startX = isMobile ? "-85vw" : "-55vw";
          gsap.set(aircraft, { x: startX });

          // INTRO
          const introTl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
          });

          introTl
            .to(".shared-ambient", {
              opacity: 1,
              scale: 1,
              duration: 1.8,
              ease: "power2.out",
            })
            .to(
              words,
              { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.04 },
              "-=1.4"
            )
            .to(
              aircraft,
              { x: "0vw", opacity: 1, duration: 1.7, ease: "power2.out" },
              "-=1.1"
            )
            .to(
              ".hero-ui",
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
              "-=1.1"
            )
            .to(
              ".hero-bracket",
              { opacity: 1, scale: 1, duration: 0.8, stagger: 0.06 },
              "-=0.7"
            )
            .to(
              ".hero-meta",
              { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
              "-=0.6"
            );

          const startIntro = () => {
            introTl.progress(0).play();
          };

          if ((window as any).__preloaderComplete) {
            startIntro();
          } else {
            window.addEventListener("preloader:complete", startIntro, {
              once: true,
            });
          }

          // EXIT
          const exitTl = gsap.timeline({ paused: true });

          exitTl
            .fromTo(
              words,
              { yPercent: 0, opacity: 1, scale: 1 },
              {
                yPercent: (i: number) => (i % 2 === 0 ? -90 : 90),
                opacity: 0,
                scale: 1.15,
                duration: 0.7,
                stagger: 0.012,
                ease: "power3.in",
                immediateRender: false,
              }
            )
            .fromTo(
              aircraft,
              { x: "0vw", scale: 1, opacity: 1, filter: "blur(0px)" },
              {
                x: "120vw",
                scale: 0.85,
                opacity: 0,
                filter: "blur(12px)",
                duration: 0.55,
                ease: "power4.in",
                immediateRender: false,
              },
              "-=0.3"
            )
            .fromTo(
              ".hero-ui",
              { y: 0, opacity: 1 },
              {
                y: 60,
                opacity: 0,
                duration: 0.4,
                stagger: 0.03,
                ease: "power2.in",
                immediateRender: false,
              },
              "-=0.5"
            )
            .to(
              ".hero-bracket",
              {
                opacity: 0,
                scale: 0.7,
                duration: 0.3,
                stagger: 0.02,
                ease: "power2.in",
              },
              "-=0.3"
            )
            .to(
              ".hero-meta",
              {
                opacity: 0,
                y: -20,
                duration: 0.3,
                stagger: 0.03,
                ease: "power2.in",
              },
              "-=0.3"
            );

          exitTl
            .fromTo(
              ".hero-scan",
              { yPercent: -100, opacity: 0 },
              {
                yPercent: 100,
                opacity: 1,
                duration: 0.55,
                ease: "power2.inOut",
                immediateRender: false,
              }
            )
            .to(
              ".shared-dot-grid",
              { opacity: 0, scale: 1.18, duration: 0.5, ease: "power2.in" },
              "<0.05"
            )
            .to(
              ".shared-ambient",
              { scale: 2.2, opacity: 0, duration: 0.8, ease: "power2.inOut" },
              "<0.1"
            )
            .fromTo(
              ".hero-pulse",
              { scale: 0.2, opacity: 0 },
              {
                scale: 2.2,
                opacity: 0.85,
                duration: 0.8,
                ease: "power2.out",
                immediateRender: false,
              },
              "<0.05"
            )
            .fromTo(
              ".shared-grid",
              { clipPath: "inset(50% 0% 50% 0%)", opacity: 0 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                immediateRender: false,
              },
              "<0.15"
            )
            .to(
              ".hero-scan",
              { yPercent: 260, opacity: 0, duration: 0.35, ease: "power2.in" },
              "<0.25"
            )
            .to(
              ".shared-bg",
              {
                backgroundColor: "#F1F5F9",
                duration: 0.7,
                ease: "power2.inOut",
              },
              "<0.05"
            )
            .to(
              ".hero-pulse",
              { opacity: 0, duration: 0.4, ease: "power2.in" },
              "<0.1"
            );

          const next = document.getElementById("about");
          if (next) {
            ScrollTrigger.create({
              trigger: next,
              start: "top bottom",
              end: "top top",
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (introTl.progress() < 1) {
                  introTl.progress(1).pause();
                }
                exitTl.progress(self.progress);
              },
            });
          }

          return () => {
            window.removeEventListener("preloader:complete", startIntro);
          };
        }
      );
    }, section);

    return () => {
      mm?.revert();
      ctx.revert();
      split?.revert();
    };
  }, []);

  const scrollToNext = () => {
    if (lenis) {
      const target = document.getElementById("about");
      if (target) lenis.scrollTo(target, { duration: 2 });
    }
  };

  return (
    <div
      ref={sectionRef}
      className={`relative w-full h-full ${ready ? "" : "opacity-0"}`}
    >
      {/* PULSE RING */}
      <div
        className="hero-pulse absolute left-1/2 top-1/2 pointer-events-none z-[2] rounded-full"
        style={{
          width: "60vmax",
          height: "60vmax",
          marginLeft: "-30vmax",
          marginTop: "-30vmax",
          border: "1px solid rgba(15,23,42,0.18)",
          willChange: "transform, opacity",
        }}
      />

      {/* SCAN BEAM */}
      <div
        className="hero-scan absolute left-0 right-0 top-0 h-px pointer-events-none z-30"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(251,146,60,0.95), transparent)",
          boxShadow: "0 0 28px 3px rgba(251,146,60,0.55)",
          willChange: "transform, opacity",
        }}
      />

      {/* HUD CORNER BRACKETS — desktop only */}
      <div className="hero-bracket hidden md:block absolute top-20 md:top-28 left-5 md:left-10 w-5 h-5 border-l border-t border-[var(--color-ink-primary)]/30 z-10 pointer-events-none" />
      <div className="hero-bracket hidden md:block absolute top-20 md:top-28 right-5 md:right-10 w-5 h-5 border-r border-t border-[var(--color-ink-primary)]/30 z-10 pointer-events-none" />
      <div className="hero-bracket hidden md:block absolute bottom-5 md:bottom-10 left-5 md:left-10 w-5 h-5 border-l border-b border-[var(--color-ink-primary)]/30 z-10 pointer-events-none" />
      <div className="hero-bracket hidden md:block absolute bottom-5 md:bottom-10 right-5 md:right-10 w-5 h-5 border-r border-b border-[var(--color-ink-primary)]/30 z-10 pointer-events-none" />

      {/* SIDE META — desktop only */}
      <div className="hero-meta hidden md:flex flex-col gap-2 absolute left-10 top-1/2 -translate-y-1/2 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-secondary)]/55 pointer-events-none">
        <span>N 25°16&apos;</span>
        <span className="w-8 h-px bg-[var(--color-ink-secondary)]/25" />
        <span>E 55°18&apos;</span>
      </div>
      <div className="hero-meta hidden md:flex flex-col gap-2 items-end absolute right-10 top-1/2 -translate-y-1/2 z-20 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-secondary)]/55 pointer-events-none">
        <span>ALT 38,000 FT</span>
        <span className="w-8 h-px bg-[var(--color-ink-secondary)]/25" />
        <span>M 0.82</span>
      </div>

      {/* TYPOGRAPHY — top-anchored on mobile, centered on desktop */}
      <div className="absolute inset-0 flex items-start md:items-center justify-center pointer-events-none z-[1] px-5 md:px-[8vw] pt-[16vh] md:pt-0">
        <div ref={textRef} className="w-full">
          <h1 className="font-display text-[16vw] md:text-[14vw] lg:text-[12vw] font-bold leading-[0.82] tracking-[-0.045em] text-[var(--color-ink-primary)] uppercase text-center md:text-left select-none">
            Flight
            <br />
            Readiness
          </h1>
        </div>
      </div>

      {/* AIRCRAFT — bleeds off both edges on mobile, larger and lower */}
      <div className="absolute bottom-[20%] md:bottom-[10%] left-0 w-full flex justify-center md:justify-start md:pl-[5vw] z-10 pointer-events-none">
        <img
          ref={aircraftRef}
          src="/assets/hero-aircraft-light.webp"
          alt="Sky Thrust Pristine Aircraft"
          className="w-[165%] md:w-[80%] lg:w-[70%] max-w-none h-auto object-contain drop-shadow-[0_40px_80px_rgba(15,23,42,0.22)] will-change-transform"
          draggable={false}
        />
      </div>

      {/* NAV */}
      <nav className="hero-ui absolute top-0 left-0 right-0 p-4 md:p-10 flex items-center justify-between z-20 pointer-events-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--color-ink-primary)] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs tracking-tight">
              ST
            </span>
          </div>
          <span className="font-display font-bold text-base md:text-lg tracking-tight text-[var(--color-ink-primary)]">
            Sky Thrust
          </span>
        </div>
        <div className="hidden md:flex gap-8 font-mono text-xs uppercase tracking-widest text-[var(--color-ink-secondary)]">
          <a
            href="#capabilities"
            className="hover:text-[var(--color-ink-primary)] transition-colors"
          >
            Capabilities
          </a>
          <a
            href="#footprint"
            className="hover:text-[var(--color-ink-primary)] transition-colors"
          >
            Footprint
          </a>
          <a
            href="#spares"
            className="hover:text-[var(--color-ink-primary)] transition-colors"
          >
            Spares
          </a>
        </div>
        <div className="hidden md:block">
          <button className="px-6 py-2 border border-[var(--color-ink-primary)]/20 rounded-full font-mono text-xs uppercase tracking-widest hover:bg-[var(--color-ink-primary)] hover:text-white transition-all duration-300">
            Client Portal
          </button>
        </div>
        <div className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-ink-primary)]/15 bg-white/60 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-ink-primary)]">
            Live
          </span>
        </div>
      </nav>

      {/* BOTTOM ACTION BAR — compacted on mobile */}
      <div className="hero-ui absolute bottom-0 left-0 right-0 px-4 pt-3 pb-5 md:p-10 z-20 flex flex-col md:flex-row items-stretch md:items-end justify-between w-full gap-3 md:gap-6 pointer-events-auto">
        <div className="max-w-md">
          <p className="font-mono text-[9px] md:text-xs text-[var(--color-amber-accent)] uppercase tracking-[0.25em] mb-1.5 md:mb-2">
            // 01. Premium Aviation MRO
          </p>
          <p className="font-sans text-[12px] md:text-lg text-[var(--color-ink-secondary)] leading-snug md:leading-relaxed">
            Delivering heavy maintenance, advanced component checks, and
            comprehensive parts logistics from our state-of-the-art hangars.
          </p>
        </div>
        <button
          onClick={scrollToNext}
          className="group relative flex items-center justify-between md:justify-start gap-3 md:gap-4 w-full md:w-auto pl-5 md:pl-7 pr-1.5 md:pr-2 py-1.5 md:py-2 bg-[var(--color-ink-primary)] text-white rounded-full overflow-hidden transition-shadow duration-500 hover:shadow-[0_20px_50px_-10px_rgba(15,23,42,0.5)]"
        >
          <span className="font-mono text-[10.5px] md:text-sm uppercase tracking-[0.18em] md:tracking-[0.2em] text-white/95">
            Request Facility Audit
          </span>
          <div className="w-9 h-9 md:w-8 md:h-8 rounded-full bg-[var(--color-amber-accent)] flex items-center justify-center group-hover:translate-x-0.5 transition-transform duration-300">
            <svg
              className="w-3.5 h-3.5 text-[var(--color-ink-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
}
