"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ============================================================
   DATA
   ============================================================ */
const CATEGORIES = [
  {
    n: "01",
    title: "Consumables",
    tag: "Fast-moving",
    count: "4,200",
    img: "/assets/spares/grid-wheel.webp",
    desc: "Aircraft tires, carbon brake pads, hydraulic fluids, engine oils, filters, lubricants.",
  },
  {
    n: "02",
    title: "Hardware",
    tag: "Certified",
    count: "3,100",
    img: "/assets/spares/grid-avionics.webp",
    desc: "Precision fasteners, bolts, nuts, rivets, bearings, seals, gaskets, oxygen components.",
  },
  {
    n: "03",
    title: "Chemicals",
    tag: "Safety-rated",
    count: "1,600",
    img: "/assets/spares/grid-cargo.webp",
    desc: "Cleaning agents, degreasers, solvents, corrosion inhibitors, sealants, touch-up paint.",
  },
  {
    n: "04",
    title: "Rotables",
    tag: "Managed LRU",
    count: "1,500",
    img: "/assets/spares/grid-hero-shelves.webp",
    desc: "Hydraulic pumps, fuel control units, avionics modules, actuators, valves, pneumatics.",
  },
];

const AOG_STEPS = [
  {
    n: "01",
    title: "Cross-reference",
    desc: "Instant lookup across all hubs.",
  },
  {
    n: "02",
    title: "Priority allocate",
    desc: "On-hand stock reserved for dispatch.",
  },
  {
    n: "03",
    title: "Expedite freight",
    desc: "Courier, hand-carry, or chartered.",
  },
  {
    n: "04",
    title: "Tarmac delivery",
    desc: "Direct to aircraft. Any Nigerian airfield.",
  },
];

const JOURNEY = ["Sourcing", "Export", "NCS", "Tarmac"];

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const rangeP = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

/* Scroll choreography milestones (of overall section progress) */
const M = {
  INTRO_OUT_A: 0.1,
  INTRO_OUT_B: 0.24,
  INDEX_IN_A: 0.22,
  INDEX_IN_B: 0.34,
  SWAPS_A: 0.38,
  SWAP_GAP: 0.09,
  INDEX_OUT_A: 0.68,
  INDEX_OUT_B: 0.78,
  PROTO_IN_A: 0.76,
  PROTO_IN_B: 0.86,
};

/* ============================================================
   KINETIC TEXT
   ============================================================ */
function Split({
  text,
  className,
  letterClass,
}: {
  text: string;
  className?: string;
  letterClass?: string;
}) {
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <span
          key={i}
          className={`inline-block will-change-transform ${letterClass ?? ""}`}
          data-letter
        >
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function SparesGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const protocolRef = useRef<HTMLDivElement>(null);

  const introImgRef = useRef<HTMLDivElement>(null);
  const introSmallA = useRef<HTMLDivElement>(null);
  const introSmallB = useRef<HTMLDivElement>(null);

  const indexImgRefs = useRef<Array<HTMLDivElement | null>>([]);
  const indexRowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const indexCounterRef = useRef<HTMLSpanElement>(null);
  const indexLabelRef = useRef<HTMLSpanElement>(null);

  const sceneLabelRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const railDotsRef = useRef<Array<HTMLDivElement | null>>([]);

  const [clock, setClock] = useState("--:--:--");

  /* ---- live clock ---- */
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const d = new Date();
      setClock(
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* ============================================================
     SCROLL ORCHESTRATION
     ============================================================ */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let enterPlayed = false;
    let activeCategory = -1;
    let activeScene = 0;
    let lastSceneLabel = "";

    const setSceneLabel = (text: string) => {
      if (!sceneLabelRef.current || text === lastSceneLabel) return;
      lastSceneLabel = text;
      gsap.to(sceneLabelRef.current, {
        opacity: 0,
        duration: 0.12,
        onComplete: () => {
          if (sceneLabelRef.current) {
            sceneLabelRef.current.textContent = text;
            gsap.to(sceneLabelRef.current, { opacity: 1, duration: 0.3 });
          }
        },
      });
    };

    const setScene = (i: number) => {
      if (i === activeScene) return;
      activeScene = i;
      railDotsRef.current.forEach((dot, idx) => {
        if (!dot) return;
        const active = idx === i;
        dot.style.width = active ? "28px" : "8px";
        dot.style.background = active
          ? "var(--color-amber-accent)"
          : "rgba(255,255,255,0.28)";
      });
      setSceneLabel(
        i === 0 ? "01 — OVERVIEW" : i === 1 ? "02 — MANIFEST" : "03 — PROTOCOL"
      );
    };

    /* -------- CATEGORY SWAP -------- */
    const setCategory = (next: number, animate = true) => {
      if (next === activeCategory) return;
      const prev = activeCategory;
      activeCategory = next;

      if (indexCounterRef.current) {
        indexCounterRef.current.textContent = `0${next + 1}`;
      }
      if (indexLabelRef.current) {
        indexLabelRef.current.textContent = CATEGORIES[next].title;
      }

      indexRowRefs.current.forEach((row, i) => {
        if (!row) return;
        const active = i === next;
        const num = row.querySelector<HTMLElement>("[data-num]");
        const title = row.querySelector<HTMLElement>("[data-title]");
        const desc = row.querySelector<HTMLElement>("[data-desc]");
        const tag = row.querySelector<HTMLElement>("[data-tag]");
        const bar = row.querySelector<HTMLElement>("[data-bar]");

        if (!animate) {
          gsap.set(row, { opacity: active ? 1 : 0.28 });
          if (num)
            gsap.set(num, {
              color: active
                ? "var(--color-amber-accent)"
                : "rgba(255,255,255,0.28)",
            });
          if (title) gsap.set(title, { opacity: active ? 1 : 0.55, x: 0 });
          if (desc)
            gsap.set(desc, {
              opacity: active ? 1 : 0,
              height: active ? "auto" : 0,
            });
          if (tag) gsap.set(tag, { opacity: active ? 1 : 0 });
          if (bar) gsap.set(bar, { scaleX: active ? 1 : 0 });
          return;
        }

        gsap.to(row, {
          opacity: active ? 1 : 0.28,
          duration: 0.45,
          ease: "power2.out",
        });
        if (num)
          gsap.to(num, {
            color: active
              ? "var(--color-amber-accent)"
              : "rgba(255,255,255,0.28)",
            duration: 0.45,
          });
        if (title)
          gsap.to(title, {
            opacity: active ? 1 : 0.55,
            x: 0,
            duration: 0.45,
          });
        if (desc)
          gsap.to(desc, {
            opacity: active ? 1 : 0,
            height: active ? "auto" : 0,
            duration: 0.55,
            ease: "power3.out",
          });
        if (tag) gsap.to(tag, { opacity: active ? 1 : 0, duration: 0.4 });
        if (bar)
          gsap.to(bar, {
            scaleX: active ? 1 : 0,
            duration: 0.6,
            ease: "power3.out",
          });
      });

      indexImgRefs.current.forEach((img, i) => {
        if (!img) return;
        if (i === next) {
          gsap.set(img, { zIndex: 3 });
          gsap.fromTo(
            img,
            { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: animate ? 1.0 : 0,
              ease: "power3.out",
            }
          );
        } else if (i === prev) {
          gsap.to(img, {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: animate ? 0.9 : 0,
            ease: "power3.inOut",
            onComplete: () => gsap.set(img, { zIndex: 1 }),
          });
        } else {
          gsap.set(img, { clipPath: "inset(100% 0% 0% 0%)", zIndex: 0 });
        }
      });
    };

    const ctx = gsap.context(() => {
      /* INTRO — initial state */
      gsap.set(introRef.current, { opacity: 1 });
      if (introImgRef.current)
        gsap.set(introImgRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
      if (introSmallA.current)
        gsap.set(introSmallA.current, { opacity: 0, y: 30 });
      if (introSmallB.current)
        gsap.set(introSmallB.current, { opacity: 0, y: 40 });
      gsap.set(".intro-title-letter", { yPercent: 110, opacity: 0 });
      gsap.set(".intro-meta", { opacity: 0, y: 14 });
      gsap.set(".intro-stats .stat-row", { opacity: 0, y: 18 });

      /* INDEX — hidden */
      gsap.set(indexRef.current, { opacity: 0 });
      gsap.set(".index-row", { opacity: 0, x: -50 });
      gsap.set(".index-frame", { clipPath: "inset(50% 0% 50% 0%)" });
      gsap.set(".index-hud", { opacity: 0, y: 14 });

      /* PROTOCOL — hidden */
      gsap.set(protocolRef.current, { opacity: 0 });
      gsap.set(".proto-letter", { yPercent: 100, opacity: 0 });
      gsap.set(".proto-meta", { opacity: 0, y: 20 });
      gsap.set(".proto-step", { opacity: 0, y: 28 });
      gsap.set(".proto-journey-item", { opacity: 0, x: -30 });
      gsap.set(".proto-journey-line", {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(".proto-glow", { opacity: 0, scale: 0.7 });

      /* ============================================================
         INTRO ENTRANCE
         ============================================================ */
      const introTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power4.out" },
      });

      introTl
        .to(
          ".intro-meta",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          0
        )
        .to(
          ".intro-title-letter",
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            stagger: { each: 0.05, from: "start" },
          },
          0.1
        )
        .to(
          introImgRef.current,
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "power4.out",
          },
          0.25
        )
        .to(introSmallA.current, { opacity: 1, y: 0, duration: 0.8 }, 0.7)
        .to(introSmallB.current, { opacity: 1, y: 0, duration: 0.8 }, 0.8)
        .to(
          ".intro-stats .stat-row",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
          },
          0.9
        );

      const skuEl =
        introRef.current?.querySelector<HTMLElement>("[data-sku-count]");
      if (skuEl) {
        const obj = { v: 0 };
        introTl.to(
          obj,
          {
            v: 10400,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              skuEl.textContent = Math.round(obj.v).toLocaleString("en-US");
            },
          },
          0.9
        );
      }

      ScrollTrigger.create({
        trigger: section,
        start: "top 65%",
        onEnter: () => {
          if (enterPlayed) return;
          enterPlayed = true;
          introTl.play();
        },
        onLeaveBack: () => {
          introTl.pause(0);
          enterPlayed = false;
        },
      });

      /* ============================================================
         MASTER SCRUB
         ============================================================ */
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;

          if (progressBarRef.current) {
            progressBarRef.current.style.transform = `scaleX(${p})`;
          }

          /* ---------- INTRO EXIT (0.10 → 0.24) ---------- */
          const ix = rangeP(p, M.INTRO_OUT_A, M.INTRO_OUT_B);
          if (introRef.current) {
            gsap.set(introRef.current, { opacity: ix < 1 ? 1 : 0 });
          }
          if (ix > 0 && ix < 1.001) {
            gsap.set(".intro-title-letter", {
              yPercent: -110 * ix,
              opacity: 1 - ix * 1.4,
            });
            gsap.set(".intro-meta", { opacity: 1 - ix * 1.8, y: -30 * ix });
            if (introImgRef.current) {
              gsap.set(introImgRef.current, {
                clipPath: `inset(${ix * 60}% 0% ${ix * 0}% 0%)`,
                scale: 1 + ix * 0.08,
              });
            }
            if (introSmallA.current)
              gsap.set(introSmallA.current, {
                opacity: 1 - ix * 2,
                x: 40 * ix,
              });
            if (introSmallB.current)
              gsap.set(introSmallB.current, {
                opacity: 1 - ix * 2,
                x: -40 * ix,
              });
            gsap.set(".intro-stats .stat-row", {
              opacity: 1 - ix * 2,
              y: 20 * ix,
            });
          } else if (ix >= 1) {
            gsap.set(introRef.current, { opacity: 0, pointerEvents: "none" });
          }

          /* ---------- INDEX ENTER (0.22 → 0.34) ---------- */
          const ii = rangeP(p, M.INDEX_IN_A, M.INDEX_IN_B);
          if (indexRef.current) {
            gsap.set(indexRef.current, { opacity: ii > 0 ? 1 : 0 });
          }
          if (ii > 0) {
            gsap.set(".index-row", {
              opacity: ii,
              x: -50 * (1 - ii),
            });
            gsap.set(".index-frame", {
              clipPath: `inset(${50 - ii * 50}% 0% ${50 - ii * 50}% 0%)`,
            });
            gsap.set(".index-hud", { opacity: ii, y: 14 * (1 - ii) });
          }

          /* ---------- CATEGORY SWAPS ---------- */
          if (ii >= 0.9 && p < M.INDEX_OUT_A) {
            const swapP = p - M.SWAPS_A;
            let idx = 0;
            if (swapP >= M.SWAP_GAP * 3) idx = 3;
            else if (swapP >= M.SWAP_GAP * 2) idx = 2;
            else if (swapP >= M.SWAP_GAP) idx = 1;
            setCategory(idx, true);
          }

          /* ---------- INDEX EXIT (0.68 → 0.78) ---------- */
          const ixOut = rangeP(p, M.INDEX_OUT_A, M.INDEX_OUT_B);
          if (ixOut > 0) {
            gsap.set(".index-row", {
              x: -70 * ixOut,
              opacity: (1 - ixOut) * 0.9,
            });
            gsap.set(".index-frame", {
              clipPath: `inset(0% 0% ${ixOut * 100}% 0%)`,
            });
            gsap.set(".index-hud", { opacity: 1 - ixOut });
            if (ixOut >= 1 && indexRef.current) {
              gsap.set(indexRef.current, { opacity: 0, pointerEvents: "none" });
            }
          }

          /* ---------- PROTOCOL ENTER (0.76 → 0.86) ---------- */
          const pi = rangeP(p, M.PROTO_IN_A, M.PROTO_IN_B);
          if (protocolRef.current) {
            gsap.set(protocolRef.current, { opacity: pi > 0 ? 1 : 0 });
          }
          if (pi > 0) {
            const eased = 1 - Math.pow(1 - pi, 3);
            gsap.set(".proto-glow", {
              opacity: eased * 0.85,
              scale: 0.7 + eased * 0.6,
            });
            gsap.set(".proto-letter", {
              yPercent: 100 - 100 * eased,
              opacity: eased * 1.3,
            });
            gsap.set(".proto-meta", { opacity: eased, y: 20 * (1 - eased) });
            gsap.set(".proto-step", {
              opacity: eased,
              y: 28 * (1 - eased),
            });
            gsap.set(".proto-journey-line", { scaleX: eased });
            gsap.set(".proto-journey-item", {
              opacity: eased,
              x: -30 * (1 - eased),
            });
          }

          /* ---------- SCENE INDICATOR ---------- */
          if (p < 0.2) setScene(0);
          else if (p < 0.7) setScene(1);
          else setScene(2);
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <section
      ref={sectionRef}
      id="spares"
      className="relative w-full h-[300vh] md:h-[460vh]"
      style={{ zIndex: 5 }}
    >
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-[var(--color-sky-base)]">
        <div ref={stageRef} className="relative w-full h-full">
          {/* ============================================================
              AMBIENT LAYERS
              ============================================================ */}
          <div
            className="absolute inset-0 pointer-events-none z-[11] opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: "170px 170px",
            }}
            aria-hidden
          />

          {/* ============================================================
              SCENE 1 — INTRO / EDITORIAL COLLAGE
              ============================================================ */}
          <div ref={introRef} className="absolute inset-0 z-10">
            <div className="relative w-full h-full p-5 md:p-10">
              <div className="flex justify-between items-center intro-meta">
                <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[var(--color-amber-accent)]">
                  {"// 05. Parts & Logistics"}
                </p>
                <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-primary)]/55">
                  06°27'N 003°23'E
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mt-6 md:mt-8 h-[calc(100%-140px)]">
                <div className="md:col-span-8 relative h-[40vh] md:h-full order-2 md:order-1">
                  <div
                    ref={introImgRef}
                    className="absolute inset-0 overflow-hidden"
                    style={{ willChange: "clip-path, transform" }}
                  >
                    <img
                      src="/assets/spares/grid-hero-shelves.webp"
                      alt="Aviation parts shelving"
                      className="w-full h-full object-cover scale-[1.02]"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber-accent)]" />
                      <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/90">
                        Hub 01 / Lagos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 flex flex-col gap-4 md:gap-6 order-1 md:order-2">
                  <div>
                    <div className="overflow-hidden">
                      <h2 className="font-display font-bold uppercase text-[var(--color-ink-primary)] text-[18vw] md:text-[5.5vw] leading-[0.82] tracking-[-0.055em]">
                        <Split
                          text="Spares."
                          letterClass="intro-title-letter"
                        />
                      </h2>
                    </div>
                    <p className="font-display font-bold uppercase text-[var(--color-ink-primary)]/50 text-[4.5vw] md:text-[1.35vw] leading-[1.05] tracking-[-0.03em] mt-2 md:mt-3 max-w-md">
                      Certified stock. Immediate availability.
                    </p>
                  </div>

                  <div className="hidden md:grid grid-cols-2 gap-3 md:gap-4 flex-1">
                    <div
                      ref={introSmallA}
                      className="relative overflow-hidden aspect-[4/5]"
                    >
                      <img
                        src="/assets/spares/grid-wheel.webp"
                        alt="Brake assembly"
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                    <div
                      ref={introSmallB}
                      className="relative overflow-hidden aspect-[4/5] mt-6"
                    >
                      <img
                        src="/assets/spares/grid-avionics.webp"
                        alt="Avionics"
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="intro-stats absolute bottom-5 md:bottom-10 left-5 md:left-10 right-5 md:right-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 border-t border-[var(--color-ink-primary)]/15 pt-4">
                  <div className="stat-row">
                    <p className="font-display font-bold text-[var(--color-ink-primary)] text-[28px] md:text-[36px] leading-none tracking-[-0.04em] tabular-nums">
                      <span data-sku-count>0</span>
                    </p>
                    <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-secondary)]/60 mt-1.5">
                      SKUs indexed
                    </p>
                  </div>
                  <div className="stat-row">
                    <p className="font-display font-bold text-[var(--color-ink-primary)] text-[28px] md:text-[36px] leading-none tracking-[-0.04em]">
                      24/7
                    </p>
                    <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-secondary)]/60 mt-1.5">
                      AOG desk
                    </p>
                  </div>
                  <div className="stat-row hidden md:block">
                    <p className="font-display font-bold text-[var(--color-ink-primary)] text-[28px] md:text-[36px] leading-none tracking-[-0.04em]">
                      03
                    </p>
                    <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-secondary)]/60 mt-1.5">
                      Intl. hubs
                    </p>
                  </div>
                  <div className="stat-row hidden md:flex items-end justify-end">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-ink-primary)]/65 flex items-center gap-2">
                      Scroll
                      <span className="inline-block animate-bounce">↓</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              SCENE 2 — MANIFEST INDEX
              ============================================================ */}
          <div
            ref={indexRef}
            className="absolute inset-0 z-10 bg-[var(--color-sky-base)]"
          >
            <div className="relative w-full h-full p-5 md:p-10 flex flex-col">
              <div className="index-hud flex justify-between items-center">
                <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[var(--color-amber-accent)]">
                  {"// Manifest Index"}
                </p>
                <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink-primary)]/60 tabular-nums">
                  <span ref={indexCounterRef}>01</span> / 04
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mt-6 md:mt-10 min-h-0">
                <div className="md:col-span-5 flex flex-col justify-center">
                  <div className="flex flex-col">
                    {CATEGORIES.map((cat, i) => (
                      <div
                        key={cat.n}
                        ref={(el) => {
                          indexRowRefs.current[i] = el;
                        }}
                        className="index-row relative border-t border-[var(--color-ink-primary)]/15 py-4 md:py-5"
                      >
                        <div
                          data-bar
                          className="absolute left-0 top-0 h-px w-full bg-[var(--color-amber-accent)] origin-left"
                          style={{ transform: "scaleX(0)" }}
                        />
                        <div className="flex items-baseline gap-4 md:gap-6">
                          <span
                            data-num
                            className="font-mono text-[11px] md:text-[13px] tracking-[0.2em] tabular-nums"
                            style={{ color: "var(--color-ink-secondary)" }}
                          >
                            {cat.n}
                          </span>
                          <div className="flex-1 min-w-0">
                            <h3
                              data-title
                              className="font-display font-bold uppercase text-[var(--color-ink-primary)] text-[26px] md:text-[2.4vw] leading-[0.95] tracking-[-0.035em]"
                            >
                              {cat.title}
                            </h3>
                            <div
                              data-desc
                              className="overflow-hidden"
                              style={{ opacity: 0, height: 0 }}
                            >
                              <p className="font-sans text-[12px] md:text-[13px] leading-[1.55] text-[var(--color-ink-secondary)] max-w-[42ch] mt-2 mb-1">
                                {cat.desc}
                              </p>
                              <div
                                data-tag
                                className="flex items-center gap-3 mt-2"
                                style={{ opacity: 0 }}
                              >
                                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[var(--color-amber-accent)]">
                                  {cat.tag}
                                </span>
                                <span className="w-4 h-px bg-[var(--color-amber-accent)]/40" />
                                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-primary)]/60 tabular-nums">
                                  {cat.count} in stock
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="border-t border-[var(--color-ink-primary)]/15" />
                  </div>
                </div>

                <div className="md:col-span-7 hidden md:block relative">
                  <div className="index-frame absolute inset-0 overflow-hidden">
                    {CATEGORIES.map((cat, i) => (
                      <div
                        key={cat.n}
                        ref={(el) => {
                          indexImgRefs.current[i] = el;
                        }}
                        className="absolute inset-0"
                        style={{
                          clipPath: "inset(100% 0% 0% 0%)",
                          willChange: "clip-path, transform",
                        }}
                      >
                        <img
                          src={cat.img}
                          alt={cat.title}
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    ))}

                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/40" />
                      <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-white/40" />
                      <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/40" />
                      <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/40" />

                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-amber-accent)] opacity-75 animate-ping" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--color-amber-accent)]" />
                        </span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/90">
                          Active · <span ref={indexLabelRef}>Consumables</span>
                        </span>
                      </div>

                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-transparent via-[var(--color-amber-accent)]/40 to-transparent" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="index-hud mt-6 flex items-center gap-4 md:gap-6">
                <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-primary)]/50">
                  Sourced · Verified · Dispatched
                </p>
                <div className="flex-1 h-px bg-[var(--color-ink-primary)]/15" />
                <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[var(--color-ink-primary)]/50 hidden md:block">
                  FAA 8130-3 / EASA Form 1
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================
              SCENE 3 — PROTOCOL / KICKER  (DARK STAGE)
              ============================================================ */}
          <div
            ref={protocolRef}
            className="absolute inset-0 z-10 bg-[#050810] text-white"
          >
            {/* ambient amber glow behind headline */}
            <div
              className="proto-glow absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[55vw] md:h-[55vw] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(251,146,60,0.22) 0%, rgba(251,146,60,0.06) 40%, transparent 70%)",
                filter: "blur(40px)",
                willChange: "transform, opacity",
              }}
              aria-hidden
            />
            {/* deep vignette so the top/bottom HUD still reads */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.6) 100%)",
              }}
              aria-hidden
            />

            <div className="relative w-full h-full p-5 md:p-10 flex flex-col">
              <div className="proto-meta flex justify-between items-center">
                <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[var(--color-amber-accent)]">
                  {"// AOG Protocol"}
                </p>
                <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white/55">
                  QRF · 24/7/365
                </p>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="overflow-hidden">
                  <h2 className="font-display font-bold leading-[0.78] tracking-[-0.06em] text-white text-[26vw] md:text-[11vw]">
                    <Split text="24" letterClass="proto-letter" />
                    <span className="text-[var(--color-amber-accent)]">
                      <Split text="/7" letterClass="proto-letter" />
                    </span>
                    <span className="text-white/30">
                      <Split text="/365" letterClass="proto-letter" />
                    </span>
                  </h2>
                </div>

                <div className="proto-meta mt-6 md:mt-10 max-w-2xl">
                  <p className="font-sans text-[13px] md:text-[16px] leading-[1.6] text-white/70">
                    When an aircraft is grounded, our protocol initiates
                    immediately. No queue. No escalation. No delay. A dedicated
                    desk, engineered for maximum operational velocity.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-white/15 pt-5 mb-6">
                {AOG_STEPS.map((step) => (
                  <div
                    key={step.n}
                    className="proto-step flex flex-col gap-1.5"
                  >
                    <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[var(--color-amber-accent)]">
                      {step.n}
                    </span>
                    <h4 className="font-display font-bold text-white text-[14px] md:text-[18px] tracking-[-0.02em] uppercase leading-tight">
                      {step.title}
                    </h4>
                    <p className="font-sans text-[11px] md:text-[12px] text-white/60 leading-snug">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="proto-meta relative pb-2">
                <div className="proto-journey-line h-px w-full bg-gradient-to-r from-[var(--color-amber-accent)] via-[var(--color-amber-accent)]/40 to-white/10 origin-left" />
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {JOURNEY.map((j, i) => (
                    <div
                      key={j}
                      className="proto-journey-item flex items-center gap-2"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          background:
                            i === JOURNEY.length - 1
                              ? "var(--color-amber-accent)"
                              : "rgba(255,255,255,0.4)",
                          animation:
                            i === JOURNEY.length - 1
                              ? "pulse 2s ease-in-out infinite"
                              : "none",
                        }}
                      />
                      <span className="font-mono text-[9px] md:text-[11px] uppercase tracking-[0.2em] text-white/75">
                        {j}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              PERSISTENT HUD — mix-blend-difference so it auto-inverts
              ============================================================ */}
          <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between gap-4 px-5 md:px-10 pt-5 md:pt-8 pointer-events-none mix-blend-difference">
            <span
              ref={sceneLabelRef}
              className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-white"
            >
              01 — OVERVIEW
            </span>
            <span className="hidden md:block font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white tabular-nums">
              {clock} WAT
            </span>
          </div>

          {/* Rail dots */}
          <div className="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-3 pointer-events-none">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                ref={(el) => {
                  railDotsRef.current[i] = el;
                }}
                className="h-[3px] rounded-full transition-all duration-500"
                style={{
                  width: i === 0 ? "28px" : "8px",
                  background:
                    i === 0
                      ? "var(--color-amber-accent)"
                      : "rgba(140,140,140,0.5)",
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-30 h-[2px] bg-black/15">
            <div
              ref={progressBarRef}
              className="h-full bg-[var(--color-amber-accent)] origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <style jsx>{`
            @keyframes pulse {
              0%,
              100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.5;
                transform: scale(1.6);
              }
            }
            @keyframes ping {
              75%,
              100% {
                transform: scale(2.2);
                opacity: 0;
              }
            }
            :global(.animate-ping) {
              animation: ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite;
            }
            :global(.animate-bounce) {
              animation: bounce 1.6s ease-in-out infinite;
            }
            @keyframes bounce {
              0%,
              100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(4px);
              }
            }
          `}</style>
        </div>
      </div>
    </section>
  );
}
