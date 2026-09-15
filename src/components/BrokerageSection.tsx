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
const STATS = [
  { value: 1200, suffix: "+", label: "Aircraft transacted", fmt: "comma" },
  {
    value: 2.4,
    suffix: "B",
    prefix: "$",
    label: "Portfolio value",
    fmt: "decimal",
  },
  {
    value: 4,
    suffix: "",
    label: "Phases per transaction",
    fmt: "plain",
    pad: true,
  },
  { value: 100, suffix: "%", label: "Technical oversight", fmt: "plain" },
];

const PHASES = [
  {
    n: "01",
    title: "Market Analysis",
    subtitle: "Acquisition Strategy",
    desc: "We define your operational requirements, mission profiles, and financial parameters — then run a global market scan to surface off-market and listed assets aligned with your strategic goals.",
  },
  {
    n: "02",
    title: "Due Diligence",
    subtitle: "Technical & Financial",
    desc: "A deep-dive audit of historical maintenance records, AD/SB compliance, and engine life-limited parts. Independent appraisals and secure escrow managed end-to-end.",
  },
  {
    n: "03",
    title: "Pre-Buy Inspection",
    subtitle: "Verification & Negotiation",
    desc: "Our MRO engineers inspect the aircraft at the seller's facility. A comprehensive discrepancy report becomes leverage — for price adjustment or pre-closing rectification.",
  },
  {
    n: "04",
    title: "Closing & Delivery",
    subtitle: "Transition Management",
    desc: "Final closing procedures, ferry flight logistics, international deregistration and re-registration, import duty processing, and seamless integration into your fleet.",
  },
];

const SERVICES = [
  {
    n: "01",
    title: "Lease Return Management",
    desc: "Gap analyses, oversight of required maintenance and refurbishment, negotiation with lessor technical representatives to minimize or eliminate end-of-lease penalties.",
    size: "large",
  },
  {
    n: "02",
    title: "Fleet Planning",
    desc: "Strategic advisory on utilization, operating cost, and resale depreciation curves — optimal upgrades, downsizing, or divestment.",
    size: "small",
  },
  {
    n: "03",
    title: "Appraisals & Valuations",
    desc: "Accurate market-backed valuations for financing, insurance, tax, or partnership buyouts, using real-time global transaction data.",
    size: "small",
  },
  {
    n: "04",
    title: "Import / Export & Registration",
    desc: "Coordination with NCAA, FAA, EASA and other global registries for flawless deregistration, export C of A, and local re-registration.",
    size: "large",
  },
];

const TICKER_ITEMS = [
  "B737-800 · 2018 · 12,400 hrs",
  "A320neo · 2020 · 6,200 hrs",
  "G650ER · 2019 · 3,100 hrs",
  "B777-300ER · 2016 · 28,900 hrs",
  "A330-300 · 2015 · 32,100 hrs",
  "CITATION XLS+ · 2021 · 1,800 hrs",
  "GLOBAL 6000 · 2017 · 4,500 hrs",
  "PC-12 NGX · 2022 · 900 hrs",
];

/* ============================================================
   HELPERS
   ============================================================ */
const smoothstep = (t: number, a: number, b: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

const formatNumber = (val: number, fmt: string) => {
  if (fmt === "comma") return Math.round(val).toLocaleString();
  if (fmt === "decimal") return val.toFixed(1);
  return Math.round(val).toString();
};

/* ============================================================
   COMPONENT
   ============================================================ */
export default function BrokerageSection() {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      /* ============ PRE-PAINT ============ */
      gsap.set(".bk-eyebrow", { clipPath: "inset(0 100% 0 0)", opacity: 0 });
      gsap.set(".bk-headline-line", { yPercent: 110, opacity: 0 });
      gsap.set(".bk-intro-body", { y: 28, opacity: 0 });
      gsap.set(".bk-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".bk-stat", { y: 30, opacity: 0 });
      gsap.set(".bk-phase", { y: 40, opacity: 0 });
      gsap.set(".bk-phase-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".bk-advantage-line", { yPercent: 105, opacity: 0 });
      gsap.set(".bk-advantage-rule", {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(".bk-service", { y: 40, opacity: 0 });
      gsap.set(".bk-service-rule", {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(".bk-closing-line", { yPercent: 110, opacity: 0 });
      gsap.set(".bk-closing-rule", {
        scaleX: 0,
        transformOrigin: "center center",
      });
      gsap.set(".bk-corner", { opacity: 0, scale: 0.9 });
      gsap.set(".bk-ticker", { opacity: 0, y: 20 });

      /* ============ INTRO SPREAD ============ */
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".bk-intro",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "expo.out" },
      });

      introTl
        .to(".bk-eyebrow", {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 0.9,
        })
        .to(
          ".bk-headline-line",
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.15,
            stagger: 0.1,
          },
          "-=0.5"
        )
        .to(
          ".bk-rule",
          { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
          "-=0.9"
        )
        .to(
          ".bk-intro-body",
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          ".bk-stat",
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.1,
            ease: "back.out(1.4)",
          },
          "-=0.55"
        );

      /* Stat counters — animate text content using a proxy object */
      STATS.forEach((stat, i) => {
        const target = el.querySelector<HTMLElement>(
          `[data-stat-value="${i}"]`
        );
        if (!target) return;
        const proxy = { v: 0 };
        ScrollTrigger.create({
          trigger: ".bk-intro",
          start: "top 70%",
          once: true,
          onEnter: () => {
            gsap.to(proxy, {
              v: stat.value,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                const num = formatNumber(proxy.v, stat.fmt);
                target.textContent = `${stat.pad && proxy.v < 10 ? "0" : ""}${num}${stat.suffix}`;
              },
            });
          },
        });
      });

      /* ============ PROCESS PHASES ============ */
      const phaseTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".bk-process",
          start: "top 72%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "back.out(1.5)" },
      });

      phaseTl
        .to(
          ".bk-phase-rule",
          { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
          0
        )
        .to(
          ".bk-phase",
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.14,
          },
          0.15
        );

      /* ============ ADVANTAGE QUOTE ============ */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".bk-advantage",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "expo.out" },
        })
        .to(".bk-advantage-rule", {
          scaleX: 1,
          duration: 1.1,
          ease: "power3.inOut",
        })
        .to(
          ".bk-advantage-line",
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.15,
            stagger: 0.1,
          },
          "-=0.8"
        );

      /* ============ SERVICES GRID ============ */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".bk-services",
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "back.out(1.4)" },
        })
        .to(".bk-service-rule", {
          scaleX: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.inOut",
        })
        .to(
          ".bk-service",
          {
            y: 0,
            opacity: 1,
            duration: 0.95,
            stagger: 0.12,
          },
          0.1
        );

      /* ============ CLOSING ============ */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".bk-closing",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "expo.out" },
        })
        .to(".bk-closing-rule", {
          scaleX: 1,
          duration: 1.3,
          ease: "power3.inOut",
        })
        .to(
          ".bk-closing-line",
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.12,
          },
          "-=1"
        );

      /* ============ SECTION HUD ============ */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        .to(".bk-corner", {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
        })
        .to(".bk-ticker", { opacity: 1, y: 0, duration: 0.9 }, "-=0.5");

      /* ============ ENTER / EXIT via Next section ============ */
      const next = document.getElementById("credentials");
      if (next) {
        const exitTl = gsap.timeline({ paused: true });
        exitTl.to(
          [
            ".bk-eyebrow",
            ".bk-headline-line",
            ".bk-intro-body",
            ".bk-stat",
            ".bk-phase",
            ".bk-advantage-line",
            ".bk-service",
            ".bk-closing-line",
            ".bk-ticker",
            ".bk-corner",
          ],
          {
            opacity: 0,
            y: -24,
            duration: 0.5,
            stagger: 0.01,
            ease: "power3.in",
          },
          0
        );

        let exitActive = false;
        ScrollTrigger.create({
          trigger: next,
          start: "top 95%",
          end: "top 55%",
          scrub: 0.5,
          onUpdate: (self) => {
            if (self.progress <= 0 && exitActive) {
              exitActive = false;
              /* Reset visibility for scroll-back-up */
              gsap.set(
                [
                  ".bk-eyebrow",
                  ".bk-headline-line",
                  ".bk-intro-body",
                  ".bk-stat",
                  ".bk-phase",
                  ".bk-advantage-line",
                  ".bk-service",
                  ".bk-closing-line",
                  ".bk-ticker",
                  ".bk-corner",
                ],
                { opacity: 1, y: 0 }
              );
              return;
            }
            if (self.progress <= 0) return;
            if (!exitActive) exitActive = true;
            exitTl.progress(self.progress);
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="brokerage"
      className="relative w-full overflow-x-clip bg-[#F4EFE6] text-[#0F0E0C]"
      style={{ zIndex: 7 }}
    >
      {/* ============ PERSISTENT HUD ============ */}
      {/* Corner brackets */}
      <div className="bk-corner absolute top-6 left-6 w-4 h-4 border-l border-t border-[#0F0E0C]/30 pointer-events-none z-20" />
      <div className="bk-corner absolute top-6 right-6 w-4 h-4 border-r border-t border-[#0F0E0C]/30 pointer-events-none z-20" />
      <div className="bk-corner absolute bottom-6 left-6 w-4 h-4 border-l border-b border-[#0F0E0C]/30 pointer-events-none z-20" />
      <div className="bk-corner absolute bottom-6 right-6 w-4 h-4 border-r border-b border-[#0F0E0C]/30 pointer-events-none z-20" />

      {/* ============================================================
          INTRO SPREAD
          ============================================================ */}
      <div className="bk-intro relative px-5 md:px-16 pt-24 md:pt-32 pb-16 md:pb-24 min-h-[85vh] flex items-center">
        <div className="w-full max-w-[1400px] mx-auto">
          {/* Top meta row */}
          <div className="flex items-center justify-between mb-12 md:mb-16">
            <p className="bk-eyebrow font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#B4622B]">
              {"// 07. Aircraft Brokerage"}
            </p>
            <div className="hidden md:flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#0F0E0C]/55">
              <span>EST · MMXXIV</span>
              <span className="w-6 h-px bg-[#0F0E0C]/25" />
              <span>Global Registry</span>
            </div>
          </div>

          {/* Headline + body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20">
            <div className="md:col-span-7">
              <h2 className="font-display text-[13vw] md:text-[6vw] leading-[1.05] uppercase tracking-[-0.035em] text-[#0F0E0C]">
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="bk-headline-line block will-change-transform">
                    Acquisition.
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="bk-headline-line block will-change-transform">
                    Disposition.
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="bk-headline-line block text-[#B4622B] will-change-transform">
                    Advisory.
                  </span>
                </span>
              </h2>
            </div>

            <div className="md:col-span-5 md:pt-3">
              <div className="bk-rule h-px bg-[#0F0E0C]/25 w-full mb-6 md:mb-8" />
              <p className="bk-intro-body font-sans text-[13.5px] md:text-[15.5px] leading-relaxed text-[#0F0E0C]/75 mb-5">
                Sky Thrust Services provides end-to-end aircraft brokerage and
                strategic advisory — guiding clients through the complex,
                high-stakes lifecycle of aircraft acquisition, disposition, and
                lease management.
              </p>
              <p className="bk-intro-body font-sans text-[13.5px] md:text-[15.5px] leading-relaxed text-[#0F0E0C]/75">
                We act as your fiduciary advocate, ensuring every transaction is
                grounded in technical reality, market accuracy, and financial
                prudence.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 border-t border-[#0F0E0C]/15 pt-8 md:pt-10">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="bk-stat flex flex-col gap-2 md:pr-8 md:border-r md:border-[#0F0E0C]/12 md:last:border-r-0"
              >
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-[#0F0E0C]/50">
                  0{i + 1}
                </span>
                <span
                  className="font-display text-3xl md:text-[2.4vw] font-bold leading-none tracking-[-0.03em] text-[#0F0E0C] tabular-nums"
                  data-stat-value={i}
                >
                  {stat.prefix ?? ""}
                  {stat.pad ? "00" : "0"}
                  {stat.suffix}
                </span>
                <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-[#0F0E0C]/60 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          THE TRANSACTION PROCESS
          ============================================================ */}
      <div className="bk-process relative px-5 md:px-16 py-20 md:py-32 border-t border-[#0F0E0C]/12">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="flex items-baseline justify-between mb-10 md:mb-16">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#B4622B]">
              The Transaction Process
            </p>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#0F0E0C]/45">
              04 Phases
            </p>
          </div>

          {/* Horizontal rule that draws in */}
          <div className="bk-phase-rule h-px bg-[#0F0E0C]/20 w-full mb-10 md:mb-14" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-10">
            {PHASES.map((phase) => (
              <div key={phase.n} className="bk-phase flex flex-col">
                <div className="flex items-baseline gap-3 mb-5">
                  <span className="font-display text-[36px] md:text-[3vw] font-bold leading-none tracking-[-0.04em] text-[#B4622B] tabular-nums">
                    {phase.n}
                  </span>
                  <div className="flex-1 h-px bg-[#0F0E0C]/20 self-center" />
                </div>
                <h3 className="font-display text-[7vw] md:text-[1.6vw] leading-[1.1] font-bold uppercase tracking-[-0.02em] text-[#0F0E0C] mb-1.5">
                  {phase.title}
                </h3>
                <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[#0F0E0C]/55 mb-4 md:mb-5">
                  {phase.subtitle}
                </p>
                <p className="font-sans text-[12.5px] md:text-[13.5px] leading-relaxed text-[#0F0E0C]/70">
                  {phase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================
          THE ADVANTAGE — WARM PAPER QUOTE
          ============================================================ */}
      <div className="bk-advantage relative px-5 md:px-16 py-24 md:py-36 bg-[#E8D9C0] border-t border-[#0F0E0C]/10">
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="bk-advantage-rule h-px bg-[#0F0E0C]/30 w-full mb-10 md:mb-16" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <p className="md:col-span-3 font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#B4622B] md:pt-3">
              The Engineering-First Advantage
            </p>

            <h3 className="md:col-span-9 font-display text-[7.5vw] md:text-[3.4vw] leading-[1.15] tracking-[-0.025em] text-[#0F0E0C]">
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="bk-advantage-line block will-change-transform">
                  Unlike traditional brokers who rely solely on market data,
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="bk-advantage-line block will-change-transform">
                  we evaluate the aircraft itself. Not just its{" "}
                  <em className="not-italic font-bold text-[#B4622B]">
                    market value
                  </em>
                  ,
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <span className="bk-advantage-line block will-change-transform">
                  but its physical and mechanical{" "}
                  <em className="not-italic font-bold text-[#B4622B]">
                    integrity.
                  </em>
                </span>
              </span>
            </h3>
          </div>
        </div>
      </div>

      {/* ============================================================
          ADVISORY SERVICES GRID
          ============================================================ */}
      <div className="bk-services relative px-5 md:px-16 py-20 md:py-32 border-t border-[#0F0E0C]/12">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="flex items-baseline justify-between mb-10 md:mb-16">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#B4622B]">
              Advisory & Asset Management
            </p>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#0F0E0C]/45">
              04 Services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-8">
            {SERVICES.map((svc, i) => {
              const spanClass =
                svc.size === "large" ? "lg:col-span-7" : "lg:col-span-5";
              return (
                <article
                  key={svc.n}
                  className={`bk-service group relative flex flex-col ${spanClass}`}
                >
                  <div className="bk-service-rule h-px bg-[#0F0E0C]/20 w-full mb-6 md:mb-8" />
                  <div className="flex items-baseline justify-between mb-6">
                    <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#0F0E0C]/45 tabular-nums">
                      {svc.n}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#B4622B]">
                      Advisory
                    </span>
                  </div>
                  <h3 className="font-display text-[6.5vw] md:text-[1.85vw] leading-[1.1] font-bold uppercase tracking-[-0.02em] text-[#0F0E0C] mb-4 md:mb-5 group-hover:text-[#B4622B] transition-colors duration-500">
                    {svc.title}
                  </h3>
                  <p className="font-sans text-[12.5px] md:text-[14px] leading-relaxed text-[#0F0E0C]/70 max-w-[46ch]">
                    {svc.desc}
                  </p>
                  <div className="mt-6 md:mt-8 flex items-center gap-3">
                    <span className="w-8 h-px bg-[#0F0E0C]/30 group-hover:w-14 group-hover:bg-[#B4622B] transition-all duration-500" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#0F0E0C]/45 group-hover:text-[#B4622B] transition-colors duration-500">
                      Explore
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================
          CLOSING STATEMENT
          ============================================================ */}
      <div className="bk-closing relative px-5 md:px-16 py-24 md:py-40 bg-[#0F0E0C] text-[#F4EFE6]">
        <div className="w-full max-w-[1200px] mx-auto text-center">
          <div className="bk-closing-rule h-px bg-[#F4EFE6]/25 w-full mb-12 md:mb-16" />

          <h3 className="font-display text-[10vw] md:text-[4.2vw] leading-[1.05] tracking-[-0.035em] uppercase text-[#F4EFE6] max-w-[18ch] mx-auto">
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="bk-closing-line block will-change-transform">
                End-to-end.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="bk-closing-line block text-[#B4622B] will-change-transform">
                Zero compromise.
              </span>
            </span>
          </h3>

          <div className="bk-closing-line mt-12 md:mt-16 flex items-center justify-center gap-5 md:gap-8 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-[#F4EFE6]/55">
            <span>NCAA</span>
            <span className="w-1 h-1 rounded-full bg-[#B4622B]" />
            <span>EASA</span>
            <span className="w-1 h-1 rounded-full bg-[#B4622B]" />
            <span>FAA</span>
          </div>

          <div className="bk-closing-rule h-px bg-[#F4EFE6]/25 w-full mt-12 md:mt-16" />
        </div>
      </div>

      {/* ============================================================
          PASSIVE TICKER — market data strip
          ============================================================ */}
      <div className="bk-ticker relative bg-[#0F0E0C] border-t border-[#F4EFE6]/15 overflow-hidden">
        <div className="flex py-3.5 whitespace-nowrap">
          <div
            className="flex shrink-0"
            style={{ animation: "bkMarquee 40s linear infinite" }}
          >
            {[0, 1, 2, 3].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {TICKER_ITEMS.map((item, idx) => (
                  <span
                    key={`${copy}-${idx}`}
                    className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#F4EFE6]/55 pr-10 flex items-center gap-10"
                  >
                    <span>{item}</span>
                    <span className="text-[#B4622B]">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes bkMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
