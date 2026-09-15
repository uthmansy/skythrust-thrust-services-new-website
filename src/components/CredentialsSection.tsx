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
const METRICS = [
  {
    n: "001",
    value: 15,
    suffix: "+",
    fmt: "plain",
    unit: "YEARS",
    label: "Combined Executive & Engineering Leadership",
    note: "In global aviation",
  },
  {
    n: "002",
    value: 500,
    suffix: "+",
    fmt: "comma",
    unit: "CHECKS",
    label: "Heavy Maintenance (C & D) Executed",
    note: "Returned to service",
  },
  {
    n: "003",
    value: 99.8,
    suffix: "%",
    fmt: "decimal",
    unit: "RELIABILITY",
    label: "Fleet Dispatch Reliability Rate",
    note: "Managed corporate & commercial fleets",
  },
  {
    n: "004",
    value: 4,
    prefix: "<",
    suffix: "HRS",
    fmt: "plain",
    unit: "RESPONSE",
    label: "Average AOG Dispatch Time",
    note: "Critical spares protocol",
  },
  {
    n: "005",
    value: 0,
    suffix: "",
    fmt: "plain",
    unit: "INCIDENTS",
    label: "Safety Incidents. Regulatory Infractions.",
    note: "Since inception",
  },
];

const ACCREDITATIONS = [
  {
    n: "01",
    code: "NCAA",
    part: "Part 145",
    title: "Approved Maintenance Organization",
    desc: "Fully certified for line and base maintenance on approved aircraft types.",
  },
  {
    n: "02",
    code: "NCAA",
    part: "Part 135",
    title: "Air Operator Certificate",
    desc: "Certified for commercial air transport and private charter operations.",
  },
  {
    n: "03",
    code: "EASA",
    part: "FAA Aligned",
    title: "European & Federal Alignment",
    desc: "Maintenance and QA protocols aligned with EASA and FAA standards, facilitating reciprocal international acceptance.",
  },
  {
    n: "04",
    code: "ISO",
    part: "9001:2015",
    title: "Quality Management System",
    desc: "Standardized, continuous improvement across all engineering and customer service processes.",
  },
  {
    n: "05",
    code: "ISO",
    part: "14001:2015",
    title: "Environmental Management",
    desc: "Sustainable aviation practices, responsible chemical disposal, carbon footprint mitigation.",
  },
];

const PARTNERS = {
  airframe: {
    label: "Airframe Manufacturers",
    items: [
      "Boeing",
      "Airbus",
      "Bombardier",
      "Gulfstream",
      "Dassault",
      "Cessna / Textron",
      "Embraer",
    ],
  },
  engine: {
    label: "Engine & Component OEMs",
    items: [
      "Pratt & Whitney",
      "Rolls-Royce",
      "GE Aviation",
      "Honeywell",
      "Collins Aerospace",
      "Safran",
      "Lufthansa Technik",
    ],
  },
  avionics: {
    label: "Avionics & Software",
    items: ["Universal Avionics", "Garmin", "JetCraft"],
  },
};

const SECTORS = [
  {
    n: "01",
    title: "Commercial Airlines",
    desc: "Heavy maintenance, line maintenance, and component pooling to maximize fleet utilization and minimize turnaround times.",
    stat: "01",
  },
  {
    n: "02",
    title: "Corporate Flight Departments",
    desc: "Asset management, pre-buy inspections, and bespoke charter solutions for enterprise executive travel.",
    stat: "02",
  },
  {
    n: "03",
    title: "Government & Diplomatic Fleets",
    desc: "Secure, highly confidential maintenance and VIP transport for state officials and military assets.",
    stat: "03",
  },
  {
    n: "04",
    title: "HNW Individuals & Family Offices",
    desc: "Complete lifecycle of private aircraft ownership — acquisition, interior customization, daily charter operations.",
    stat: "04",
  },
  {
    n: "05",
    title: "Cargo & Logistics Operators",
    desc: "Rapid, reliable maintenance and parts supply for time-critical freight fleets.",
    stat: "05",
  },
];

const smoothstep = (t: number, a: number, b: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

const formatValue = (v: number, fmt: string) => {
  if (fmt === "comma") return Math.round(v).toLocaleString();
  if (fmt === "decimal") return v.toFixed(1);
  return Math.round(v).toString();
};

/* ============================================================
   COMPONENT
   ============================================================ */
export default function CredentialsSection() {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      /* ============ PRE-PAINT ============ */
      gsap.set(".cr-eyebrow", { clipPath: "inset(0 100% 0 0)", opacity: 0 });
      gsap.set(".cr-headline-line", { yPercent: 110, opacity: 0 });
      gsap.set(".cr-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".cr-body", { y: 26, opacity: 0 });
      gsap.set(".cr-metric-row", { opacity: 0, y: 30 });
      gsap.set(".cr-metric-value", { yPercent: 100, opacity: 0 });
      gsap.set(".cr-metric-label", { y: 20, opacity: 0 });
      gsap.set(".cr-metric-rule", {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(".cr-acc-item", { y: 34, opacity: 0 });
      gsap.set(".cr-acc-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".cr-partner-box", { y: 26, opacity: 0 });
      gsap.set(".cr-partner-label", { y: 20, opacity: 0 });
      gsap.set(".cr-sector", { y: 34, opacity: 0 });
      gsap.set(".cr-sector-rule", {
        scaleX: 0,
        transformOrigin: "left center",
      });
      gsap.set(".cr-guarantee-line", { yPercent: 110, opacity: 0 });
      gsap.set(".cr-guarantee-rule", {
        scaleX: 0,
        transformOrigin: "center center",
      });
      gsap.set(".cr-corner", { opacity: 0, scale: 0.9 });
      gsap.set(".cr-rail-fill", { scaleY: 0, transformOrigin: "top center" });

      /* ============ INTRO ============ */
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cr-intro",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "expo.out" },
      });

      introTl
        .to(".cr-eyebrow", {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 0.9,
        })
        .to(
          ".cr-headline-line",
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.15,
            stagger: 0.09,
          },
          "-=0.5"
        )
        .to(
          ".cr-rule",
          { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
          "-=0.9"
        )
        .to(
          ".cr-body",
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.8"
        );

      /* ============ METRICS ============ */
      /* Each metric row: mask-reveal number + counter + reveal label */
      const metricRows = el.querySelectorAll<HTMLElement>(".cr-metric-row");
      metricRows.forEach((row, i) => {
        const valueEl = row.querySelector<HTMLElement>(".cr-metric-value");
        const valueDisplay = row.querySelector<HTMLElement>(
          "[data-metric-display]"
        );
        const labelEls = row.querySelectorAll(".cr-metric-label");
        const ruleEl = row.querySelector(".cr-metric-rule");
        const metric = METRICS[i];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "expo.out" },
        });

        if (ruleEl) {
          tl.to(ruleEl, { scaleX: 1, duration: 1.05, ease: "power3.inOut" }, 0);
        }
        tl.to(row, { opacity: 1, y: 0, duration: 0.7 }, 0);
        if (valueEl) {
          tl.to(
            valueEl,
            { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out" },
            0.1
          );
        }
        tl.to(
          labelEls,
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.09,
            ease: "power3.out",
          },
          0.3
        );

        /* Counter animation */
        if (valueDisplay) {
          const proxy = { v: 0 };
          ScrollTrigger.create({
            trigger: row,
            start: "top 82%",
            once: true,
            onEnter: () => {
              gsap.to(proxy, {
                v: metric.value,
                duration: 1.6,
                ease: "power2.out",
                onUpdate: () => {
                  const num = formatValue(proxy.v, metric.fmt);
                  const prefix = metric.prefix ?? "";
                  valueDisplay.textContent = `${prefix}${num}${metric.suffix}`;
                },
              });
            },
          });
        }

        /* Scroll-linked subtle zoom on the number */
        ScrollTrigger.create({
          trigger: row,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          onUpdate: (self) => {
            /* 0 → 1 through the viewport. Scale from 0.92 to 1.08 */
            const scale = 0.92 + self.progress * 0.16;
            if (valueEl) gsap.set(valueEl, { scale });
          },
        });
      });

      /* ============ ACCREDITATIONS ============ */
      /* Sticky left rail fills as you scroll through */
      const accSection = el.querySelector(".cr-accreditations");
      const railFill = el.querySelector(".cr-rail-fill");
      if (accSection && railFill) {
        ScrollTrigger.create({
          trigger: accSection,
          start: "top 40%",
          end: "bottom 60%",
          scrub: 0.5,
          onUpdate: (self) => {
            gsap.set(railFill, { scaleY: self.progress });
          },
        });
      }

      /* Each accreditation reveals */
      gsap.utils.toArray<HTMLElement>(".cr-acc-item").forEach((item) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "expo.out" },
        });
        tl.to(
          item.querySelector(".cr-acc-rule"),
          { scaleX: 1, duration: 1.05, ease: "power3.inOut" },
          0
        ).to(item, { y: 0, opacity: 1, duration: 0.85 }, 0.05);
      });

      /* ============ PARTNERSHIPS ============ */
      /* Pan the partnership grid subtly with scroll */
      const partnerGrid = el.querySelector(".cr-partners-grid");
      if (partnerGrid) {
        ScrollTrigger.create({
          trigger: partnerGrid,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          onUpdate: (self) => {
            const x = (self.progress - 0.5) * 40; /* -20px → 20px */
            gsap.set(partnerGrid, { x });
          },
        });
      }

      /* Reveal partner rows */
      gsap.utils.toArray<HTMLElement>(".cr-partner-group").forEach((group) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "back.out(1.4)" },
        });
        tl.to(
          group.querySelector(".cr-partner-label"),
          { y: 0, opacity: 1, duration: 0.7 },
          0
        ).to(
          group.querySelectorAll(".cr-partner-box"),
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            stagger: 0.05,
          },
          0.1
        );
      });

      /* ============ SECTORS ============ */
      gsap.utils.toArray<HTMLElement>(".cr-sector").forEach((sector) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sector,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "expo.out" },
        });
        tl.to(
          sector.querySelector(".cr-sector-rule"),
          { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
          0
        ).to(sector, { y: 0, opacity: 1, duration: 0.9 }, 0.05);
      });

      /* ============ GUARANTEE ============ */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".cr-guarantee",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "expo.out" },
        })
        .to(".cr-guarantee-rule", {
          scaleX: 1,
          duration: 1.4,
          ease: "power3.inOut",
        })
        .to(
          ".cr-guarantee-line",
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.12,
          },
          "-=1"
        );

      /* ============ HUD ============ */
      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
          defaults: { ease: "power3.out" },
        })
        .to(".cr-corner", {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.07,
        });

      /* ============ EXIT — fade to #footprint ============ */
      const next = document.getElementById("footprint");
      if (next) {
        const exitTargets = [
          ".cr-eyebrow",
          ".cr-headline-line",
          ".cr-body",
          ".cr-metric-row",
          ".cr-acc-item",
          ".cr-partner-group",
          ".cr-sector",
          ".cr-guarantee-line",
          ".cr-corner",
        ];

        const exitTl = gsap.timeline({ paused: true });
        exitTl.to(exitTargets, {
          opacity: 0,
          scale: 0.98,
          duration: 0.55,
          stagger: 0.008,
          ease: "power3.in",
        });

        let exitActive = false;
        ScrollTrigger.create({
          trigger: next,
          start: "top 95%",
          end: "top 55%",
          scrub: 0.5,
          onUpdate: (self) => {
            if (self.progress <= 0 && exitActive) {
              exitActive = false;
              gsap.set(exitTargets, { opacity: 1, scale: 1 });
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
      id="credentials"
      className="relative w-full overflow-x-clip bg-[#F4F1EA] text-[#0F0E0C]"
      style={{ zIndex: 7 }}
    >
      {/* ============ PERSISTENT HUD ============ */}
      <div className="cr-corner absolute top-6 left-6 w-4 h-4 border-l border-t border-[#0F0E0C]/30 pointer-events-none z-20" />
      <div className="cr-corner absolute top-6 right-6 w-4 h-4 border-r border-t border-[#0F0E0C]/30 pointer-events-none z-20" />
      <div className="cr-corner absolute bottom-6 left-6 w-4 h-4 border-l border-b border-[#0F0E0C]/30 pointer-events-none z-20" />
      <div className="cr-corner absolute bottom-6 right-6 w-4 h-4 border-r border-b border-[#0F0E0C]/30 pointer-events-none z-20" />

      {/* ============================================================
          INTRO
          ============================================================ */}
      <div className="cr-intro relative px-5 md:px-16 pt-24 md:pt-32 pb-16 md:pb-24">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-12 md:mb-16">
            <p className="cr-eyebrow font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#8B2C1F]">
              {"// 08. Trust & Credentials"}
            </p>
            <div className="hidden md:flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.3em] text-[#0F0E0C]/55">
              <span>Verified</span>
              <span className="w-6 h-px bg-[#0F0E0C]/25" />
              <span>Audited</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            <div className="md:col-span-8">
              <h2 className="font-display text-[11vw] md:text-[5vw] leading-[1.05] uppercase tracking-[-0.035em] text-[#0F0E0C]">
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="cr-headline-line block will-change-transform">
                    Trust is not
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="cr-headline-line block will-change-transform">
                    a marketing
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.12em]">
                  <span className="cr-headline-line block text-[#8B2C1F] will-change-transform">
                    concept.
                  </span>
                </span>
              </h2>
            </div>

            <div className="md:col-span-4 md:pt-4">
              <div className="cr-rule h-px bg-[#0F0E0C]/25 w-full mb-6" />
              <p className="cr-body font-sans text-[13.5px] md:text-[15px] leading-relaxed text-[#0F0E0C]/75 mb-5">
                In aviation, trust is measurable. Auditable. Continuously
                verified. We provide the hard data, regulatory credentials, and
                strategic partnerships that validate our position as West
                Africa&apos;s premier aviation authority.
              </p>
              <p className="cr-body font-sans text-[13.5px] md:text-[15px] leading-relaxed text-[#0F0E0C]/60">
                Every claim below is a number. Every number, a record.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          OPERATIONAL METRICS — Editorial table
          ============================================================ */}
      <div className="cr-metrics relative px-5 md:px-16 py-20 md:py-28 border-t border-[#0F0E0C]/12">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="flex items-baseline justify-between mb-12 md:mb-20">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#8B2C1F]">
              Operational Metrics
            </p>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#0F0E0C]/45">
              / Record
            </p>
          </div>

          {/* Metric rows */}
          <div className="flex flex-col">
            {METRICS.map((metric, i) => (
              <div
                key={metric.n}
                className="cr-metric-row relative py-8 md:py-12"
              >
                <div className="cr-metric-rule absolute top-0 left-0 right-0 h-px bg-[#0F0E0C]/15" />

                <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                  {/* Number index */}
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#0F0E0C]/45 tabular-nums">
                      {metric.n}
                    </span>
                  </div>

                  {/* Value + unit */}
                  <div className="col-span-10 md:col-span-5 lg:col-span-4">
                    <div className="overflow-hidden block">
                      <span className="cr-metric-value block will-change-transform">
                        <span
                          className="font-display font-bold leading-[1] tracking-[-0.045em] text-[#0F0E0C] tabular-nums inline-block will-change-transform"
                          style={{ fontSize: "clamp(48px, 9vw, 128px)" }}
                          data-metric-display
                        >
                          {metric.prefix ?? ""}
                          {metric.value}
                          {metric.suffix}
                        </span>
                      </span>
                    </div>
                    <p className="cr-metric-label font-mono text-[9px] md:text-[10px] uppercase tracking-[0.32em] text-[#8B2C1F] mt-4 md:mt-5">
                      {metric.unit}
                    </p>
                  </div>

                  {/* Label + note */}
                  <div className="col-span-12 md:col-span-6 lg:col-span-7 md:pt-3">
                    <p className="cr-metric-label font-display text-[4.5vw] md:text-[1.4vw] leading-[1.2] font-bold uppercase tracking-[-0.02em] text-[#0F0E0C] mb-2 max-w-[32ch]">
                      {metric.label}
                    </p>
                    <p className="cr-metric-label font-sans text-[12px] md:text-[13px] text-[#0F0E0C]/55">
                      {metric.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="cr-metric-rule h-px bg-[#0F0E0C]/15" />
          </div>
        </div>
      </div>

      {/* ============================================================
          ACCREDITATIONS — Sticky rail
          ============================================================ */}
      <div className="cr-accreditations relative px-5 md:px-16 py-20 md:py-32 border-t border-[#0F0E0C]/12">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="flex items-baseline justify-between mb-12 md:mb-20">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#8B2C1F]">
              Regulatory Accreditations
            </p>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#0F0E0C]/45">
              / 05 Standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            {/* Sticky rail */}
            <div className="hidden md:block md:col-span-1 relative">
              <div className="sticky top-32 h-40 flex flex-col">
                <div className="w-px bg-[#0F0E0C]/15 flex-1 relative overflow-hidden">
                  <div className="cr-rail-fill absolute inset-0 bg-[#8B2C1F] origin-top" />
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#0F0E0C]/45 mt-4 [writing-mode:vertical-rl] rotate-180 self-center">
                  Scrolling
                </p>
              </div>
            </div>

            {/* Items */}
            <div className="md:col-span-11 flex flex-col">
              {ACCREDITATIONS.map((acc) => (
                <div
                  key={acc.n}
                  className="cr-acc-item relative py-8 md:py-12 border-t border-transparent"
                >
                  <div className="cr-acc-rule absolute top-0 left-0 right-0 h-px bg-[#0F0E0C]/15" />

                  <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                    <div className="col-span-2 md:col-span-1">
                      <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#0F0E0C]/45 tabular-nums">
                        {acc.n}
                      </span>
                    </div>

                    <div className="col-span-10 md:col-span-3">
                      <p className="font-display text-[6vw] md:text-[2vw] font-bold leading-[1] tracking-[-0.02em] text-[#8B2C1F]">
                        {acc.code}
                      </p>
                      <p className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-[#0F0E0C]/60 mt-2">
                        {acc.part}
                      </p>
                    </div>

                    <div className="col-span-12 md:col-span-8">
                      <h3 className="font-display text-[5.5vw] md:text-[1.75vw] leading-[1.15] font-bold uppercase tracking-[-0.02em] text-[#0F0E0C] mb-3 md:mb-4">
                        {acc.title}
                      </h3>
                      <p className="font-sans text-[12.5px] md:text-[14px] leading-relaxed text-[#0F0E0C]/65 max-w-[52ch]">
                        {acc.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="cr-acc-rule h-px bg-[#0F0E0C]/15" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          OEM PARTNERSHIPS
          ============================================================ */}
      <div className="cr-partners relative px-5 md:px-16 py-20 md:py-32 border-t border-[#0F0E0C]/12 bg-[#EBE5D8]">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="flex items-baseline justify-between mb-12 md:mb-20">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#8B2C1F]">
              OEM & Technology Partners
            </p>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#0F0E0C]/45">
              / Authorized
            </p>
          </div>

          <div className="cr-partners-grid will-change-transform">
            <div className="flex flex-col gap-12 md:gap-16">
              {Object.entries(PARTNERS).map(([key, group]) => (
                <div key={key} className="cr-partner-group">
                  <p className="cr-partner-label font-mono text-[10px] md:text-[11px] uppercase tracking-[0.32em] text-[#0F0E0C]/60 mb-6">
                    {group.label}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-px bg-[#0F0E0C]/15">
                    {group.items.map((item) => (
                      <div
                        key={item}
                        className="cr-partner-box bg-[#EBE5D8] hover:bg-[#0F0E0C] transition-colors duration-500 group cursor-default"
                      >
                        <div className="px-3 py-5 md:px-4 md:py-6 flex items-center justify-center min-h-[70px] md:min-h-[90px]">
                          <span className="font-display text-[11px] md:text-[13px] font-bold uppercase tracking-[-0.01em] text-[#0F0E0C] group-hover:text-[#F4F1EA] transition-colors duration-500 text-center">
                            {item}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          SECTORS SERVED
          ============================================================ */}
      <div className="cr-sectors relative px-5 md:px-16 py-20 md:py-32 border-t border-[#0F0E0C]/12">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="flex items-baseline justify-between mb-12 md:mb-20">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#8B2C1F]">
              Sectors & Clientele
            </p>
            <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#0F0E0C]/45">
              / 05 Categories
            </p>
          </div>

          <div className="flex flex-col">
            {SECTORS.map((sector) => (
              <div
                key={sector.n}
                className="cr-sector group relative py-8 md:py-12"
              >
                <div className="cr-sector-rule absolute top-0 left-0 right-0 h-px bg-[#0F0E0C]/15" />
                <div className="grid grid-cols-12 gap-4 md:gap-8 items-start">
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#0F0E0C]/45 tabular-nums">
                      {sector.n}
                    </span>
                  </div>
                  <div className="col-span-10 md:col-span-5">
                    <h3 className="font-display text-[7vw] md:text-[2.2vw] leading-[1.15] font-bold uppercase tracking-[-0.02em] text-[#0F0E0C] group-hover:text-[#8B2C1F] transition-colors duration-500">
                      {sector.title}
                    </h3>
                  </div>
                  <div className="col-span-12 md:col-span-6 md:pt-3">
                    <p className="font-sans text-[12.5px] md:text-[14px] leading-relaxed text-[#0F0E0C]/65 max-w-[52ch]">
                      {sector.desc}
                    </p>
                    <div className="mt-4 md:mt-6 flex items-center gap-3">
                      <span className="w-8 h-px bg-[#0F0E0C]/30 group-hover:w-14 group-hover:bg-[#8B2C1F] transition-all duration-500" />
                      <span className="font-mono text-[9px] uppercase tracking-[0.35em] text-[#0F0E0C]/45 group-hover:text-[#8B2C1F] transition-colors duration-500">
                        Servicing
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="cr-sector-rule h-px bg-[#0F0E0C]/15" />
          </div>
        </div>
      </div>

      {/* ============================================================
          GUARANTEE — Dark closing
          ============================================================ */}
      <div className="cr-guarantee relative px-5 md:px-16 py-28 md:py-44 bg-[#0F0E0C] text-[#F4F1EA]">
        <div className="w-full max-w-[1200px] mx-auto text-center">
          <div className="cr-guarantee-rule h-px bg-[#F4F1EA]/25 w-full mb-14 md:mb-20" />

          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#C8805A] mb-10 md:mb-14">
            The Sky Thrust Guarantee
          </p>

          <h3 className="font-display text-[9vw] md:text-[3.6vw] leading-[1.1] tracking-[-0.03em] uppercase text-[#F4F1EA] max-w-[22ch] mx-auto">
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="cr-guarantee-line block will-change-transform">
                Not a vendor.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="cr-guarantee-line block will-change-transform">
                An integrated,
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.12em]">
              <span className="cr-guarantee-line block will-change-transform">
                audited{" "}
                <em className="not-italic font-bold text-[#C8805A]">
                  enterprise.
                </em>
              </span>
            </span>
          </h3>

          <div className="cr-guarantee-line mt-14 md:mt-20 flex items-center justify-center gap-5 md:gap-8 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-[#F4F1EA]/55">
            <span>NCAA</span>
            <span className="w-1 h-1 rounded-full bg-[#C8805A]" />
            <span>EASA</span>
            <span className="w-1 h-1 rounded-full bg-[#C8805A]" />
            <span>FAA</span>
            <span className="w-1 h-1 rounded-full bg-[#C8805A]" />
            <span>ISO</span>
          </div>

          <div className="cr-guarantee-rule h-px bg-[#F4F1EA]/25 w-full mt-14 md:mt-20" />
        </div>
      </div>
    </section>
  );
}
