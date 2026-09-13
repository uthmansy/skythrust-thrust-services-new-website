"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ============================================================
   DATA
   ============================================================ */
const INVENTORY = [
  {
    n: "01",
    title: "Consumables",
    desc: "Aircraft tires, carbon brake pads, hydraulic fluids, engine oils, filters, lubricants.",
    chip: "Fast-moving",
  },
  {
    n: "02",
    title: "Hardware",
    desc: "Precision fasteners, bolts, nuts, rivets, bearings, seals, gaskets, oxygen components.",
    chip: "Certified",
  },
  {
    n: "03",
    title: "Chemicals",
    desc: "Cleaning agents, degreasers, solvents, corrosion inhibitors, sealants, touch-up paint.",
    chip: "Safety-rated",
  },
  {
    n: "04",
    title: "Rotables",
    desc: "Hydraulic pumps, fuel control units, avionics modules, actuators, valves, pneumatics.",
    chip: "Managed LRU",
  },
];

const AOG_STEPS = [
  {
    n: "01",
    title: "Cross-reference",
    desc: "Instant inventory lookup across all hubs.",
  },
  {
    n: "02",
    title: "Priority allocate",
    desc: "On-hand stock reserved for immediate dispatch.",
  },
  {
    n: "03",
    title: "Expedite freight",
    desc: "Direct courier, hand-carry, or chartered movement.",
  },
  {
    n: "04",
    title: "Tarmac delivery",
    desc: "Direct to aircraft. Any Nigerian airfield.",
  },
];

const CERTS = ["FAA 8130-3", "EASA Form 1", "Manufacturer C of C"];
const JOURNEY = ["Sourcing", "Export", "NCS", "Tarmac"];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/* ============================================================
   COMPONENT
   ============================================================ */
export default function SparesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const blurWrapperRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const grid = gridRef.current;
    const blurWrapper = blurWrapperRef.current;
    if (!section || !stage || !grid || !blurWrapper) return;

    /* -------- MEASUREMENTS -------- */
    let heroRect = { x: 0, y: 0, w: 0, h: 0 };
    let viewport = { w: 0, h: 0 };
    let sMax = 1;

    const measure = () => {
      const sRect = stage.getBoundingClientRect();
      viewport = { w: sRect.width, h: sRect.height };

      /* Find the VISIBLE hero cell (desktop or mobile one) */
      const heroes = stage.querySelectorAll<HTMLElement>(".ms-cell-hero");
      for (const el of Array.from(heroes)) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          heroRect = {
            x: r.left - sRect.left,
            y: r.top - sRect.top,
            w: r.width,
            h: r.height,
          };
          break;
        }
      }

      sMax =
        viewport.w > 0 && heroRect.w > 0
          ? Math.max(viewport.w / heroRect.w, viewport.h / heroRect.h)
          : 1;
    };

    /* -------- GRID TRANSFORM -------- */
    const applyGrid = (p: number) => {
      if (!heroRect.w) return;
      const s = 1 + (sMax - 1) * p;
      const ox = heroRect.x + heroRect.w / 2;
      const oy = heroRect.y + heroRect.h / 2;
      const tx = (viewport.w / 2 - ox) * p;
      const ty = (viewport.h / 2 - oy) * p;

      gsap.set(grid, {
        transformOrigin: `${ox}px ${oy}px`,
        x: tx,
        y: ty,
        scale: s,
      });
    };

    /* -------- BLUR -------- */
    const applyBlur = (amount: number) => {
      gsap.set(blurWrapper, { filter: `blur(${amount}px)` });
    };

    /* First measure + initial state */
    let measured = false;
    const raf = requestAnimationFrame(() => {
      measure();
      applyGrid(0);
      applyBlur(0);
      measured = true;
    });

    const onResize = () => {
      measure();
      /* Re-apply current state without needing the scroll position */
      applyGrid(0);
      applyBlur(0);
    };
    window.addEventListener("resize", onResize);

    /* -------- GSAP SETUP -------- */
    const ctx = gsap.context(() => {
      const readings = Array.from(
        stage.querySelectorAll<HTMLElement>(".ms-reading")
      );

      /* PRE-PAINT */
      gsap.set(".ms-cell", { opacity: 0 });
      gsap.set(".ms-cell-br", { scaleY: 0, transformOrigin: "top center" });
      gsap.set(".ms-cell-bb", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".ms-cell-photo, .ms-hero-cell-img", { opacity: 0 });
      gsap.set(".ms-hud-top, .ms-hud-bottom", { opacity: 0, y: 12 });
      gsap.set(readings, { opacity: 0 });
      readings.forEach((r) => {
        gsap.set(r.querySelectorAll("[data-r-anim]"), { opacity: 0, y: 40 });
      });
      gsap.set(".ms-content-bg", { opacity: 0 });
      gsap.set(".ms-scan-line", { opacity: 0 });

      /* ENTER */
      const enterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      enterTl
        .to(".ms-hud-top, .ms-hud-bottom", { opacity: 1, y: 0, duration: 0.5 })
        .to(
          ".ms-cell",
          { opacity: 1, duration: 0.5, stagger: { each: 0.02, from: "start" } },
          "-=0.3"
        )
        .to(
          ".ms-cell-br",
          { scaleY: 1, duration: 0.5, stagger: { each: 0.015, from: "start" } },
          "-=0.4"
        )
        .to(
          ".ms-cell-bb",
          { scaleX: 1, duration: 0.5, stagger: { each: 0.015, from: "end" } },
          "<"
        )
        .to(
          ".ms-cell-photo, .ms-hero-cell-img",
          { opacity: 1, duration: 0.6, stagger: 0.05 },
          "-=0.5"
        );

      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        onEnter: () => enterTl.progress(0).play(),
        onLeaveBack: () => {
          enterTl.progress(0).pause();
          gsap.set(".ms-cell, .ms-cell-photo, .ms-hero-cell-img", {
            opacity: 0,
          });
          gsap.set(".ms-cell-br", { scaleY: 0 });
          gsap.set(".ms-cell-bb", { scaleX: 0 });
        },
      });

      /* READING SWITCHER */
      let activeReading = 0;
      let readingTl: gsap.core.Timeline | null = null;

      const setReadingState = (reading: HTMLElement, visible: boolean) => {
        const anim = reading.querySelectorAll("[data-r-anim]");
        gsap.set(anim, { opacity: visible ? 1 : 0, y: visible ? 0 : 40 });
      };

      const switchReading = (next: number) => {
        if (next === activeReading) return;
        const prev = activeReading;
        activeReading = next;

        if (readingTl) {
          readingTl.kill();
          readingTl = null;
        }

        readings.forEach((r, i) => {
          if (i !== prev && i !== next) gsap.set(r, { opacity: 0 });
        });

        const prevR = readings[prev];
        const nextR = readings[next];
        if (!prevR || !nextR) return;

        setReadingState(nextR, false);
        gsap.set(nextR, { opacity: 1 });

        const tl = gsap.timeline({
          onComplete: () => {
            readingTl = null;
            gsap.set(prevR, { opacity: 0 });
          },
        });

        tl.to(
          prevR.querySelectorAll("[data-r-anim]"),
          {
            opacity: 0,
            y: -20,
            duration: 0.25,
            stagger: 0.015,
            ease: "power2.in",
          },
          0
        )
          .set(prevR, { opacity: 0 }, 0.28)
          .to(
            nextR.querySelectorAll("[data-r-anim]"),
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.04,
              ease: "power3.out",
            },
            0.32
          );

        readingTl = tl;
      };

      /* SCRUB */
      const contentBg = stage.querySelector<HTMLElement>(".ms-content-bg");
      const scanLine = stage.querySelector<HTMLElement>(".ms-scan-line");
      const counterEl = section.querySelector<HTMLElement>(".ms-counter");
      const cells = Array.from(stage.querySelectorAll<HTMLElement>(".ms-cell"));
      const nonHeroCells = cells.filter(
        (c) => !c.classList.contains("ms-cell-hero")
      );

      let lastReadingIdx = -1;
      let exitActive = false;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (!measured) measure();
          const p = self.progress;

          /* ---- EXPANSION: 0.05 → 0.32 ---- */
          const expansionP = clamp01((p - 0.05) / 0.27);
          const eased = expansionP * expansionP * (3 - 2 * expansionP);

          if (!exitActive) {
            /* Grid "microscope" transform */
            applyGrid(eased);

            /* Blur ramps in as the image claims the stage */
            const blurAmt = lerp(0, 6, clamp01((p - 0.1) / 0.2));
            applyBlur(blurAmt);

            /* Fade borders */
            const borderFade = clamp01((p - 0.06) / 0.14);
            gsap.set(".ms-cell-br, .ms-cell-bb", { opacity: 1 - borderFade });

            /* Fade non-hero cells (they're already off-screen after scaling,
               this just cleans up mid-transition) */
            const cellFade = clamp01((p - 0.05) / 0.15);
            gsap.set(nonHeroCells, { opacity: 1 - cellFade });
          }

          /* ---- CONTENT GRADIENT ---- */
          const contentBgP = clamp01((p - 0.24) / 0.08);
          if (contentBg) gsap.set(contentBg, { opacity: contentBgP });

          /* ---- SCAN LINE ---- */
          const scanP = clamp01((p - 0.27) / 0.05);
          if (scanLine) {
            gsap.set(scanLine, {
              opacity: scanP > 0 && scanP < 1 ? 0.85 : 0,
              y: lerp(-40, 40, scanP) + "vh",
            });
          }

          /* ---- READINGS: 0.36 / 0.55 / 0.74 ---- */
          let readingIdx = -1;
          if (p >= 0.74) readingIdx = 2;
          else if (p >= 0.55) readingIdx = 1;
          else if (p >= 0.36) readingIdx = 0;

          if (readingIdx >= 0 && readingIdx !== lastReadingIdx && !exitActive) {
            if (lastReadingIdx === -1) {
              gsap.set(readings[readingIdx], { opacity: 1 });
              setReadingState(readings[readingIdx], true);
            } else {
              switchReading(readingIdx);
            }
            lastReadingIdx = readingIdx;
            if (counterEl)
              counterEl.textContent = `SECTION 0${readingIdx + 1} / 03`;
          }

          if (readingIdx === -1 && lastReadingIdx !== -1 && !exitActive) {
            readings.forEach((r) => gsap.set(r, { opacity: 0 }));
            lastReadingIdx = -1;
            if (counterEl) counterEl.textContent = "GRID";
          }
        },
      });

      /* ---- EXIT ---- */
      const nextSection = document.getElementById("charter");
      if (nextSection) {
        const exitTl = gsap.timeline({ paused: true });

        exitTl
          .to(
            ".ms-reading [data-r-anim]",
            {
              opacity: 0,
              y: -30,
              duration: 0.4,
              stagger: 0.02,
              ease: "power2.in",
            },
            0
          )
          .to(".ms-reading", { opacity: 0, duration: 0.25 }, 0.15)
          .to(
            ".ms-content-bg",
            { opacity: 0, duration: 0.4, ease: "power2.in" },
            0.15
          )
          .to(
            ".ms-hud-top, .ms-hud-bottom",
            { opacity: 0, y: 16, duration: 0.4, ease: "power3.in" },
            0.3
          )
          .to(
            blurWrapper,
            { opacity: 0, duration: 0.5, ease: "power2.in" },
            0.4
          );

        ScrollTrigger.create({
          trigger: nextSection,
          start: "top 80%",
          end: "top 45%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onUpdate: (self) => {
            if (self.progress <= 0 && exitActive) {
              exitActive = false;
              gsap.set(blurWrapper, { opacity: 1 });
              applyGrid(clamp01((0 - 0.05) / 0.27) === 0 ? 0 : 1);
              applyBlur(0);
              gsap.set(".ms-cell-br, .ms-cell-bb", { opacity: 1 });
              return;
            }
            if (self.progress <= 0) return;

            if (!exitActive) {
              exitActive = true;

              if (readingTl) {
                readingTl.kill();
                readingTl = null;
              }
              if (enterTl.progress() < 1) enterTl.progress(1).pause();

              readings.forEach((r, i) => {
                if (i === lastReadingIdx) {
                  gsap.set(r, { opacity: 1 });
                  setReadingState(r, true);
                } else {
                  gsap.set(r, { opacity: 0 });
                }
              });

              gsap.set(blurWrapper, { opacity: 1 });
              applyGrid(1);
            }

            exitTl.progress(self.progress);
          },
        });
      }
    }, section);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <section
      ref={sectionRef}
      id="spares"
      className="relative w-full"
      style={{ height: "240vh", zIndex: 5 }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-[var(--color-sky-base)]">
        <div ref={stageRef} className="relative w-full h-full">
          {/* ============ BLUR WRAPPER (grid scales + blurs inside here) ============ */}
          <div
            ref={blurWrapperRef}
            className="absolute inset-0 will-change-[filter,opacity]"
          >
            <div
              ref={gridRef}
              className="absolute inset-0 will-change-transform"
            >
              {/* ===== DESKTOP GRID: 6 cols × 2 rows (portrait cells) ===== */}
              <div className="hidden md:grid grid-cols-6 grid-rows-2 h-full w-full">
                <DeskCell />
                <DeskCell>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-mono text-[var(--color-amber-accent)]">
                    {"// 05. Parts & Logistics"}
                  </p>
                </DeskCell>
                <DeskCell
                  photo="/assets/spares/grid-wheel.webp"
                  alt="Brake assembly"
                />

                <DeskCell />
                <DeskCell
                  photo="/assets/spares/grid-avionics.webp"
                  alt="Avionics"
                />
                <DeskCell />

                <DeskCell>
                  <h2 className="font-display font-bold uppercase text-[3vw] leading-[0.85] tracking-[-0.04em] text-[var(--color-ink-primary)]">
                    Spares.
                  </h2>
                </DeskCell>
                <DeskCell
                  hero
                  photo="/assets/spares/grid-hero-shelves.webp"
                  alt="Aviation parts shelving"
                />
                <DeskCell>
                  <div className="flex flex-col">
                    <span className="font-display text-[1.8vw] font-bold leading-none text-[var(--color-ink-primary)] tracking-[-0.03em]">
                      10,400
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/60 mt-1.5">
                      SKUs
                    </span>
                  </div>
                </DeskCell>
                <DeskCell
                  photo="/assets/spares/grid-cargo.webp"
                  alt="Cargo loading"
                />
                <DeskCell>
                  <div className="flex flex-col">
                    <span className="font-display text-[1.8vw] font-bold leading-none text-[var(--color-ink-primary)] tracking-[-0.03em]">
                      24/7
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/60 mt-1.5">
                      AOG
                    </span>
                  </div>
                </DeskCell>
                <DeskCell>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-primary)]/70">
                    Scroll <span className="inline-block ml-1.5">{"->"}</span>
                  </p>
                </DeskCell>
              </div>

              {/* ===== MOBILE GRID: 3 cols × 5 rows (portrait cells) ===== */}
              <div className="md:hidden grid grid-cols-3 grid-rows-5 h-full w-full">
                <MobCell />
                <MobCell
                  hero
                  photo="/assets/spares/grid-hero-shelves.webp"
                  alt="Aviation parts shelving"
                />
                <MobCell
                  photo="/assets/spares/grid-wheel.webp"
                  alt="Brake assembly"
                />

                <MobCell>
                  <h2 className="font-display font-bold uppercase text-[10vw] leading-[0.85] tracking-[-0.04em] text-[var(--color-ink-primary)]">
                    Spares.
                  </h2>
                </MobCell>
                <MobCell />
                <MobCell>
                  <p className="text-[8px] uppercase tracking-[0.3em] font-mono text-[var(--color-amber-accent)]">
                    {"// 05. Parts"}
                  </p>
                </MobCell>

                <MobCell photo="/assets/spares/grid-cargo.webp" alt="Cargo" />
                <MobCell>
                  <div className="flex flex-col">
                    <span className="font-display text-[7vw] font-bold leading-none text-[var(--color-ink-primary)] tracking-[-0.03em]">
                      10,400
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-ink-secondary)]/60 mt-1">
                      SKUs
                    </span>
                  </div>
                </MobCell>
                <MobCell />

                <MobCell />
                <MobCell
                  photo="/assets/spares/grid-avionics.webp"
                  alt="Avionics"
                />
                <MobCell>
                  <div className="flex flex-col">
                    <span className="font-display text-[7vw] font-bold leading-none text-[var(--color-ink-primary)] tracking-[-0.03em]">
                      24/7
                    </span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-ink-secondary)]/60 mt-1">
                      AOG
                    </span>
                  </div>
                </MobCell>

                <MobCell>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-ink-secondary)]/60">
                    EST / MMXXIV
                  </p>
                </MobCell>
                <MobCell>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-ink-primary)]/70">
                    Scroll <span className="inline-block ml-1">{"->"}</span>
                  </p>
                </MobCell>
                <MobCell>
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--color-ink-secondary)]/60">
                    KANO / ABJ / LOS
                  </p>
                </MobCell>
              </div>
            </div>
          </div>

          {/* ============ CONTENT GRADIENT ============ */}
          <div
            className="ms-content-bg absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(to top, rgba(6,10,18,0.92) 0%, rgba(6,10,18,0.6) 40%, rgba(6,10,18,0.15) 70%, transparent 100%)",
            }}
            aria-hidden
          />

          {/* ============ SCAN LINE ============ */}
          <div
            className="ms-scan-line absolute left-0 right-0 top-1/2 h-px pointer-events-none z-20"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(251,146,60,0.9), transparent)",
              boxShadow: "0 0 24px 2px rgba(251,146,60,0.5)",
            }}
            aria-hidden
          />

          {/* ============ TOP HUD ============ */}
          <div className="ms-hud-top absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 md:px-10 pt-5 md:pt-8 pointer-events-none">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-[var(--color-amber-accent)]">
              {"// 05. Parts & Logistics"}
            </p>
            <p className="ms-counter font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-[var(--color-ink-primary)]/70">
              GRID
            </p>
          </div>

          {/* ============ READINGS ============ */}
          <div className="absolute inset-0 z-20 flex items-center px-5 md:px-10 pointer-events-none">
            <div className="relative w-full max-w-[1400px] mx-auto h-[72vh]">
              {/* READING 1 */}
              <div className="ms-reading absolute inset-0 flex flex-col justify-center">
                <div data-r-anim className="mb-6 md:mb-10">
                  <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[var(--color-amber-accent)] mb-2">
                    01 / Core Inventory
                  </p>
                  <h3 className="font-display font-bold uppercase text-white text-[7vw] md:text-[2.8vw] leading-[0.95] tracking-[-0.03em] max-w-3xl">
                    Certified stock. Immediate availability.
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 md:gap-y-8">
                  {INVENTORY.map((item) => (
                    <div
                      key={item.n}
                      data-r-anim
                      className="flex flex-col gap-2 border-t border-white/15 pt-4"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">
                          {item.n}
                        </span>
                        <h4 className="font-display font-bold text-white text-[15px] md:text-[20px] tracking-[-0.02em] uppercase">
                          {item.title}
                        </h4>
                      </div>
                      <p className="font-sans text-[12px] md:text-[13px] leading-relaxed text-white/65 max-w-[42ch]">
                        {item.desc}
                      </p>
                      <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[var(--color-amber-accent)]/85 mt-1">
                        {item.chip}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* READING 2 */}
              <div className="ms-reading absolute inset-0 flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-10 md:gap-20 items-center">
                  <div data-r-anim className="relative">
                    <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[var(--color-amber-accent)] mb-4 md:mb-6">
                      02 / AOG Response Protocol
                    </p>
                    <div className="relative inline-flex items-baseline">
                      <span className="font-display font-bold leading-none tracking-[-0.05em] text-white text-[16vw] md:text-[7vw]">
                        24/7
                      </span>
                      <span className="font-display font-bold leading-none tracking-[-0.05em] text-[var(--color-amber-accent)] text-[16vw] md:text-[7vw] ml-1 md:ml-2">
                        /365
                      </span>
                      <div
                        className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-16 h-16 md:w-24 md:h-24 rounded-full border border-dashed border-[var(--color-amber-accent)]/40 pointer-events-none"
                        style={{ animation: "spin 12s linear infinite" }}
                      />
                    </div>
                    <p className="font-sans text-[13px] md:text-[15px] leading-relaxed text-white/70 max-w-md mt-5 md:mt-6">
                      Dedicated desk engineered for maximum operational
                      velocity. When an aircraft is grounded, our protocol
                      initiates immediately.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4 md:gap-5">
                    {AOG_STEPS.map((step) => (
                      <div
                        key={step.n}
                        data-r-anim
                        className="grid grid-cols-[auto_1fr] gap-4 md:gap-5 items-start border-t border-white/15 pt-4"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-amber-accent)] mt-0.5">
                          {step.n}
                        </span>
                        <div>
                          <h4 className="font-display font-bold text-white text-[15px] md:text-[18px] tracking-[-0.02em] uppercase">
                            {step.title}
                          </h4>
                          <p className="font-sans text-[12px] md:text-[13px] text-white/60 leading-relaxed mt-1">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* READING 3 */}
              <div className="ms-reading absolute inset-0 flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                  <div>
                    <p
                      data-r-anim
                      className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[var(--color-amber-accent)] mb-3 md:mb-4"
                    >
                      03 / Quality & Traceability
                    </p>
                    <h3
                      data-r-anim
                      className="font-display font-bold uppercase text-white text-[6.5vw] md:text-[2.2vw] leading-[0.95] tracking-[-0.03em] mb-4 md:mb-6"
                    >
                      Every part, fully documented.
                    </h3>
                    <p
                      data-r-anim
                      className="font-sans text-[12.5px] md:text-[14px] leading-relaxed text-white/65 max-w-md mb-6 md:mb-8"
                    >
                      Strict anti-counterfeit enforcement. Full lifecycle
                      traceability. All components shipped with verifiable
                      certification.
                    </p>
                    <div data-r-anim className="flex flex-wrap gap-2">
                      {CERTS.map((c) => (
                        <span
                          key={c}
                          className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 border border-white/25 text-white/90"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p
                      data-r-anim
                      className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[var(--color-amber-accent)] mb-3 md:mb-4"
                    >
                      Global Logistics & Customs
                    </p>
                    <h3
                      data-r-anim
                      className="font-display font-bold uppercase text-white text-[6.5vw] md:text-[2.2vw] leading-[0.95] tracking-[-0.03em] mb-4 md:mb-6"
                    >
                      Sourcing to tarmac.
                    </h3>
                    <p
                      data-r-anim
                      className="font-sans text-[12.5px] md:text-[14px] leading-relaxed text-white/65 max-w-md mb-6 md:mb-8"
                    >
                      Full lifecycle supply chain management, from global
                      sourcing and export compliance to Nigerian Customs
                      clearance and last-mile delivery.
                    </p>

                    <div data-r-anim className="relative">
                      <div className="h-px w-full bg-white/20" />
                      <div className="grid grid-cols-4 gap-2 mt-3 md:mt-4">
                        {JOURNEY.map((j, i) => (
                          <div
                            key={j}
                            className="flex flex-col gap-1.5 md:gap-2"
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background:
                                  i === 0
                                    ? "var(--color-amber-accent)"
                                    : "rgba(255,255,255,0.4)",
                                animation:
                                  i === 0
                                    ? "pulse 2s ease-in-out infinite"
                                    : "none",
                              }}
                            />
                            <span className="font-mono text-[8px] md:text-[10px] uppercase tracking-[0.15em] text-white/70">
                              {j}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============ BOTTOM HUD ============ */}
          <div className="ms-hud-bottom absolute bottom-0 left-0 right-0 z-30 flex items-center gap-4 md:gap-8 px-5 md:px-10 py-4 md:py-5 border-t border-[var(--color-ink-primary)]/15 pointer-events-none">
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-primary)]/60 whitespace-nowrap">
              Kano / Abuja / Lagos
            </p>
            <div className="flex-1 h-px bg-[var(--color-ink-primary)]/15" />
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[var(--color-ink-primary)]/60 whitespace-nowrap hidden md:block">
              AOG Desk / 24/7/365
            </p>
          </div>

          <style jsx>{`
            @keyframes spin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            @keyframes pulse {
              0%,
              100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.6;
                transform: scale(1.4);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CELLS — hero image is a direct prop (not wrapped in children div)
   ============================================================ */
function DeskCell({
  children,
  photo,
  alt,
  hero,
}: {
  children?: React.ReactNode;
  photo?: string;
  alt?: string;
  hero?: boolean;
}) {
  return (
    <div
      className={`ms-cell relative ${
        hero ? "ms-cell-hero" : ""
      } flex items-center justify-start p-5 overflow-hidden`}
    >
      <div className="ms-cell-br absolute top-0 right-0 w-px h-full bg-[var(--color-ink-primary)]/15 z-20" />
      <div className="ms-cell-bb absolute bottom-0 left-0 w-full h-px bg-[var(--color-ink-primary)]/15 z-20" />
      {photo && (
        <img
          src={photo}
          alt={alt ?? ""}
          className={`${
            hero ? "ms-hero-cell-img" : "ms-cell-photo"
          } absolute inset-0 w-full h-full object-cover`}
          draggable={false}
        />
      )}
      {children && <div className="relative z-10 max-w-full">{children}</div>}
    </div>
  );
}

function MobCell({
  children,
  photo,
  alt,
  hero,
}: {
  children?: React.ReactNode;
  photo?: string;
  alt?: string;
  hero?: boolean;
}) {
  return (
    <div
      className={`ms-cell relative ${
        hero ? "ms-cell-hero" : ""
      } flex items-center justify-start p-2.5 overflow-hidden`}
    >
      <div className="ms-cell-br absolute top-0 right-0 w-px h-full bg-[var(--color-ink-primary)]/15 z-20" />
      <div className="ms-cell-bb absolute bottom-0 left-0 w-full h-px bg-[var(--color-ink-primary)]/15 z-20" />
      {photo && (
        <img
          src={photo}
          alt={alt ?? ""}
          className={`${
            hero ? "ms-hero-cell-img" : "ms-cell-photo"
          } absolute inset-0 w-full h-full object-cover`}
          draggable={false}
        />
      )}
      {children && <div className="relative z-10 max-w-full">{children}</div>}
    </div>
  );
}
