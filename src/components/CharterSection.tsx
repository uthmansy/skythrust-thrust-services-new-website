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
const CHAPTERS = [
  {
    numeral: "I",
    title: "Service Profiles",
    intro:
      "Four charter programs, engineered for every mission profile — from single-city hops to complex multi-leg itineraries.",
    items: [
      {
        n: "01",
        title: "On-Demand Private Charter",
        meta: "Global",
        desc: "Fully customized point-to-point flights departing on your schedule. A meticulously vetted network of light, mid-size, super-mid, and heavy jets, plus turboprops for regional accessibility.",
      },
      {
        n: "02",
        title: "Corporate Shuttle & Block Hour",
        meta: "Enterprise",
        desc: "Predictable aviation solutions for enterprise clients. Optimized routing and block-hour agreements guarantee aircraft availability while maximizing budget efficiency.",
      },
      {
        n: "03",
        title: "Empty Leg Management",
        meta: "On-Demand",
        desc: "Exclusive access to discounted repositioning flights. Continuous fleet monitoring to surface premium aircraft availability at significantly reduced rates.",
      },
      {
        n: "04",
        title: "Specialized & Humanitarian",
        meta: "Priority",
        desc: "Rapid deployment for Air Ambulance and Medevac with advanced life-support modules, plus secure, discreet transport for government and high-profile VIPs.",
      },
    ],
  },
  {
    numeral: "II",
    title: "Bespoke Experience",
    intro:
      "Every variable managed. Every detail considered — from first inquiry to post-flight follow-up.",
    items: [
      {
        n: "01",
        title: "Dedicated Flight Concierge",
        meta: "24/7",
        desc: "A single, always-on point of contact. Complex multi-leg itineraries, visa coordination, and pet travel logistics — managed end-to-end.",
      },
      {
        n: "02",
        title: "Ground Handling & FBO Access",
        meta: "FBO",
        desc: "Bypass commercial terminal congestion. Exclusive private FBO access, fast-track immigration and customs, private security, and luxury ground transport direct to the tarmac.",
      },
      {
        n: "03",
        title: "Bespoke Catering & Amenities",
        meta: "Curated",
        desc: "Culinary experiences curated to your exact preferences. Michelin-standard catering, rare vintage selections, custom dietary requirements, cabin florals.",
      },
      {
        n: "04",
        title: "Absolute Privacy & Security",
        meta: "NDA",
        desc: "Discretion is our default. Crew trained in confidentiality protocols, secure communications, NDA-backed operations, and threat assessments for sensitive routes.",
      },
    ],
  },
  {
    numeral: "III",
    title: "Network Reach",
    intro:
      "From Lagos to London. Every airspace understood. Every runway within reach.",
    items: [
      {
        n: "01",
        title: "Domestic Excellence",
        meta: "05 Hubs",
        desc: "Hourly departures connecting Lagos, Abuja, Port Harcourt, Kano, and other major Nigerian hubs with zero commercial delays.",
      },
      {
        n: "02",
        title: "West African Regional Network",
        meta: "06 Cities",
        desc: "Direct, efficient access to Accra, Freetown, Monrovia, Dakar, Cotonou, and Douala — navigating complex regional airspace with localized expertise.",
      },
      {
        n: "03",
        title: "Global Intercontinental Reach",
        meta: "4 Continents",
        desc: "Seamless connections to London, Dubai, Johannesburg, and New York, supported by comprehensive overflight and landing permit management.",
      },
    ],
  },
];

const PANELS = [
  { label: "00 / PROLOGUE" },
  { label: "01 / SERVICE" },
  { label: "02 / EXPERIENCE" },
  { label: "03 / NETWORK" },
  { label: "04 / ADVANTAGE" },
];

const PANEL_COUNT = PANELS.length;
const PANEL_WINDOW = 1 / PANEL_COUNT;

const CERTS = ["NCAA", "EASA", "FAA", "IBAC", "IS-BAO", "ARGUS"];

const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const smoothstep = (t: number, a: number, b: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

/* ============================================================
   BACKDROP
   ============================================================ */
function CharterBackdrop() {
  return (
    <div className="charter-backdrop-group absolute inset-0">
      {/* LIGHT */}
      <div className="charter-bg-light absolute inset-0">
        <div className="absolute inset-0 bg-[#EFE7D9]" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,15,10,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,15,10,0.05) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 20% 75%, rgba(217,119,6,0.18) 0%, transparent 65%), radial-gradient(ellipse 55% 50% at 95% 15%, rgba(251,191,36,0.16) 0%, transparent 55%)",
          }}
        />
      </div>

      {/* DARK */}
      <div className="charter-bg-dark absolute inset-0">
        <div className="absolute inset-0 bg-[#08060a]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="charter-glow-core absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 50% 45%, rgba(251,146,60,0.16) 0%, rgba(180,83,9,0.06) 40%, transparent 72%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background:
              "radial-gradient(ellipse 90% 100% at 50% 100%, rgba(120,53,15,0.26) 0%, transparent 70%)",
          }}
        />
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              left: `${4 + ((i * 23) % 92)}%`,
              bottom: "-6px",
              background: "rgba(251,146,60,0.5)",
              animation: `charterDrift ${22 + (i % 5) * 4}s linear ${i * 1.7}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   HUD
   ============================================================ */
function CharterHUD() {
  return (
    <div
      className="charter-hud absolute inset-0 pointer-events-none z-30"
      style={{ mixBlendMode: "difference" }}
    >
      <div className="charter-corner absolute top-5 left-5 w-4 h-4 border-l border-t border-white/70" />
      <div className="charter-corner absolute top-5 right-5 w-4 h-4 border-r border-t border-white/70" />
      <div className="charter-corner absolute bottom-5 left-5 w-4 h-4 border-l border-b border-white/70" />
      <div className="charter-corner absolute bottom-5 right-5 w-4 h-4 border-r border-b border-white/70" />

      <div className="charter-hud-el absolute top-6 left-12 right-12 flex items-center justify-between font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-white/80">
        <span>{"// 06. Private Charter"}</span>
        <span className="flex items-center gap-2.5">
          <span className="relative flex h-1 w-1">
            <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1 w-1 bg-white" />
          </span>
          <span data-hud-state>GROUND</span>
        </span>
      </div>

      <div className="charter-hud-el absolute bottom-6 left-12 right-12 flex items-center justify-between font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-white/55">
        <span data-hud-coords>N 6°27' / E 3°23'</span>
        <span data-hud-panel>00 / 04</span>
      </div>
    </div>
  );
}

/* ============================================================
   MASKED HEADLINE
   ============================================================ */
function MaskedLine({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="block overflow-hidden pb-[0.12em] pt-[0.02em]">
      <span className={`ch-mask-line block will-change-transform ${className}`}>
        {children}
      </span>
    </span>
  );
}

/* ============================================================
   IMAGE FRAME — no base position class so caller controls it
   ============================================================ */
function ImageFrame({
  src,
  alt,
  caption,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div className={`ch-image-frame overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        draggable={false}
        loading="eager"
        className="ch-image-inner absolute inset-0 w-full h-full object-cover will-change-transform"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.42) 0%, transparent 45%)",
        }}
      />
      <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t border-l border-white/60 z-10" />
      <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t border-r border-white/60 z-10" />
      <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b border-l border-white/60 z-10" />
      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b border-r border-white/60 z-10" />
      {caption && (
        <div className="ch-fade absolute bottom-4 left-4 z-10 flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-[#F59E0B]" />
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/90">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PANEL 0 — OPENING
   ============================================================ */
function PanelOpening() {
  return (
    <div className="charter-panel relative min-h-[92svh] md:absolute md:inset-0 md:min-h-0 md:grid md:grid-cols-12">
      {/* Content column */}
      <div className="md:col-span-7 flex flex-col justify-between px-6 md:px-16 py-14 md:py-20 gap-8 md:gap-0">
        <div className="ch-eyebrow flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.4em] text-[#92400E]">
          <span>{"// 06. Private Charter"}</span>
          <span className="hidden md:inline opacity-60">N 6°27' / E 3°23'</span>
        </div>

        <div className="md:max-w-[46rem]">
          <h2 className="font-display font-bold text-[14vw] md:text-[6.4vw] leading-[0.9] tracking-[-0.055em] uppercase text-[#1a1410]">
            <MaskedLine>Flying,</MaskedLine>
            <MaskedLine>elevated</MaskedLine>
            <MaskedLine>to an</MaskedLine>
            <MaskedLine className="italic text-[#B45309]">art form.</MaskedLine>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-6 md:gap-14 items-start">
          <p className="ch-fade font-sans text-[13.5px] md:text-[14.5px] leading-[1.65] text-[#3f342a]/80 max-w-md">
            Sky Thrust redefines private aviation in West Africa — merging
            uncompromising safety with bespoke, white-glove luxury.
          </p>
          <div className="ch-fade flex flex-col gap-3">
            <div className="flex items-baseline gap-3 border-t border-[#1a1410]/15 pt-3">
              <span className="font-display font-bold text-[26px] md:text-[30px] leading-none tracking-[-0.03em] text-[#1a1410] tabular-nums">
                14
              </span>
              <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[#3f342a]/60">
                Aircraft types
              </span>
            </div>
            <div className="flex items-baseline gap-3 border-t border-[#1a1410]/15 pt-3">
              <span className="font-display font-bold text-[26px] md:text-[30px] leading-none tracking-[-0.03em] text-[#1a1410] tabular-nums">
                24/7
              </span>
              <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-[#3f342a]/60">
                Flight desk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Image column */}
      <div className="md:col-span-5 relative h-[55vh] md:h-full overflow-hidden">
        <ImageFrame
          src="/assets/jets/jet-landing.webp"
          alt="Business jet on final approach"
          caption="Approach / Runway 18L"
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}

/* ============================================================
   PANEL 1-3 — CHAPTERS
   ============================================================ */
function PanelChapter({
  chapter,
  variant,
  image,
  imageCaption,
}: {
  chapter: (typeof CHAPTERS)[number];
  variant: "default" | "mirror" | "fullbleed";
  image: string;
  imageCaption: string;
}) {
  if (variant === "fullbleed") {
    return (
      <div className="charter-panel relative min-h-[92svh] md:absolute md:inset-0 md:min-h-0">
        <div className="absolute inset-0">
          <ImageFrame
            src={image}
            alt={chapter.title}
            caption={imageCaption}
            className="absolute inset-0"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, rgba(6,4,8,0.95) 0%, rgba(6,4,8,0.82) 42%, rgba(6,4,8,0.25) 78%, rgba(6,4,8,0.1) 100%)",
            }}
          />
        </div>

        <div className="relative h-full grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 px-6 md:px-16 py-14 md:py-20 items-center">
          <div className="md:col-span-5 flex flex-col justify-center">
            <div className="ch-eyebrow flex items-center gap-4 mb-5 md:mb-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#F59E0B]">
                Chapter {chapter.numeral}
              </span>
              <span className="ch-rule flex-1 h-px bg-[#F59E0B]/60 origin-left" />
            </div>

            <h3 className="font-display font-bold text-[11vw] md:text-[3vw] leading-[1] tracking-[-0.035em] uppercase text-white mb-4 md:mb-6">
              <MaskedLine>{chapter.title}</MaskedLine>
            </h3>

            <p className="ch-fade font-sans text-[13px] md:text-[14px] leading-[1.6] text-white/65 max-w-md mb-8 md:mb-12">
              {chapter.intro}
            </p>

            <div className="flex flex-col">
              {chapter.items.map((item) => (
                <div
                  key={item.n}
                  className="ch-fade grid grid-cols-[auto_1fr_auto] gap-4 md:gap-6 border-t border-white/12 py-4 items-baseline"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#F59E0B]">
                    {item.n}
                  </span>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-[14px] md:text-[16px] tracking-[-0.01em] mb-1.5 uppercase text-white/95">
                      {item.title}
                    </h4>
                    <p className="font-sans text-[11.5px] md:text-[12.5px] leading-[1.55] text-white/50 max-w-lg">
                      {item.desc}
                    </p>
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/40 whitespace-nowrap hidden md:inline">
                    {item.meta}
                  </span>
                </div>
              ))}
              <div className="border-t border-white/12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isMirror = variant === "mirror";

  return (
    <div className="charter-panel relative min-h-[92svh] md:absolute md:inset-0 md:min-h-0 md:grid md:grid-cols-12">
      {/* Chapter info — 3 cols */}
      <div
        className={`md:col-span-3 relative flex flex-col justify-center px-6 md:px-16 py-10 md:py-20 order-1 ${
          isMirror ? "md:order-3" : "md:order-1"
        }`}
      >
        {/* Watermark numeral, bleeding off the edge */}
        <div className="ch-numeral-mark absolute top-6 -left-4 md:top-10 md:-left-8 pointer-events-none select-none">
          <span
            className="font-display font-bold text-white/[0.05] leading-[0.75]"
            style={{ fontSize: "clamp(160px, 26vw, 380px)" }}
          >
            {chapter.numeral}
          </span>
        </div>

        <div className="ch-eyebrow flex items-center gap-4 mb-5 md:mb-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#F59E0B]">
            Chapter {chapter.numeral}
          </span>
          <span className="ch-rule flex-1 h-px bg-[#F59E0B]/60 origin-left" />
        </div>

        <h3 className="font-display font-bold text-[9vw] md:text-[2.2vw] leading-[1] tracking-[-0.035em] uppercase text-white mb-4 md:mb-5">
          {chapter.title.split(" ").map((w, i) => (
            <MaskedLine key={i}>{w}</MaskedLine>
          ))}
        </h3>

        <p className="ch-fade font-sans text-[12.5px] md:text-[13.5px] leading-[1.6] text-white/55 max-w-sm">
          {chapter.intro}
        </p>
      </div>

      {/* Items — 5 cols */}
      <div className="md:col-span-5 flex flex-col justify-center px-6 md:px-0 py-10 md:py-20 order-3 md:order-2">
        <div className="flex flex-col">
          {chapter.items.map((item) => (
            <div
              key={item.n}
              className="ch-fade grid grid-cols-[auto_1fr_auto] gap-4 md:gap-5 border-t border-white/12 py-3.5 md:py-4 items-baseline"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#F59E0B]">
                {item.n}
              </span>
              <div className="min-w-0">
                <h4 className="font-display font-bold text-[14px] md:text-[15px] tracking-[-0.01em] mb-1 uppercase text-white/95">
                  {item.title}
                </h4>
                <p className="font-sans text-[11.5px] md:text-[12px] leading-[1.55] text-white/50 max-w-xl">
                  {item.desc}
                </p>
              </div>
              <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/40 whitespace-nowrap hidden md:inline">
                {item.meta}
              </span>
            </div>
          ))}
          <div className="border-t border-white/12" />
        </div>
      </div>

      {/* Image — 4 cols */}
      <div
        className={`md:col-span-4 relative h-[42vh] md:h-full overflow-hidden order-2 ${
          isMirror ? "md:order-1" : "md:order-3"
        }`}
      >
        <ImageFrame
          src={image}
          alt={chapter.title}
          caption={imageCaption}
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}

/* ============================================================
   PANEL 4 — CLOSING
   ============================================================ */
function PanelClosing() {
  return (
    <div className="charter-panel relative min-h-[92svh] md:absolute md:inset-0 md:min-h-0 flex flex-col justify-between px-6 md:px-16 py-14 md:py-20">
      <div className="ch-eyebrow flex items-center gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#F59E0B]">
          The Sky Thrust Advantage
        </span>
        <span className="ch-rule flex-1 h-px bg-[#F59E0B]/40 origin-left" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <h3 className="font-display font-bold text-[9.5vw] md:text-[3.6vw] leading-[1.08] tracking-[-0.035em] text-white/95 max-w-5xl">
          <MaskedLine>Not just a luxury seat.</MaskedLine>
          <MaskedLine className="text-[#F59E0B]">
            A flight engineered for absolute safety.
          </MaskedLine>
        </h3>

        <p className="ch-fade font-sans text-[13px] md:text-[14.5px] leading-[1.7] text-white/55 max-w-2xl mt-7 md:mt-10">
          Unlike traditional charter brokers, Sky Thrust is an engineering-first
          organization. Every aircraft in our network undergoes in-house
          technical auditing — from maintenance records to physical inspections
          to crew training — all validated against our internal MRO standards.
        </p>
      </div>

      <div className="ch-marquee relative overflow-hidden">
        <div className="flex whitespace-nowrap font-mono text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-white/45">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 items-center"
              style={{ animation: "charterMarquee 24s linear infinite" }}
            >
              {CERTS.map((c, i) => (
                <span
                  key={`${dup}-${i}`}
                  className="flex items-center gap-8 pr-8"
                >
                  <span>{c}</span>
                  <span className="w-1 h-1 rounded-full bg-[#F59E0B]/60" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ALL PANELS
   ============================================================ */
function CharterPanels() {
  return (
    <>
      <PanelOpening />
      <PanelChapter
        chapter={CHAPTERS[0]}
        variant="default"
        image="/assets/jets/jet-engine.webp"
        imageCaption="Engine Bay / CFM LEAP-1A"
      />
      <PanelChapter
        chapter={CHAPTERS[1]}
        variant="mirror"
        image="/assets/jets/jet-wing-portrait-mode.webp"
        imageCaption="Wing Root / FL 410"
      />
      <PanelChapter
        chapter={CHAPTERS[2]}
        variant="fullbleed"
        image="/assets/jets/jet-landing.webp"
        imageCaption="Runway 18L / Cleared to Land"
      />
      <PanelClosing />
    </>
  );
}

/* ============================================================
   MAIN
   ============================================================ */
export default function CharterSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let mm: ReturnType<typeof gsap.matchMedia> | null = null;

    const ctx = gsap.context(() => {
      /* ---------- Builders ---------- */
      const buildEnter = (panel: HTMLElement, fast = false) => {
        const s = fast ? 0.7 : 1;
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        const imageFrame = panel.querySelector<HTMLElement>(".ch-image-frame");
        const imageInner = panel.querySelector<HTMLElement>(".ch-image-inner");
        const lines = panel.querySelectorAll(".ch-mask-line");
        const fades = panel.querySelectorAll(".ch-fade");
        const rules = panel.querySelectorAll(".ch-rule");
        const numeral = panel.querySelector<HTMLElement>(".ch-numeral-mark");
        const eyebrow = panel.querySelector<HTMLElement>(".ch-eyebrow");
        const marquee = panel.querySelector<HTMLElement>(".ch-marquee");

        if (imageFrame) {
          tl.fromTo(
            imageFrame,
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 * s },
            0
          );
        }
        if (imageInner) {
          tl.fromTo(
            imageInner,
            { scale: 1.16 },
            { scale: 1, duration: 1.6 * s },
            0
          );
        }
        if (eyebrow) {
          tl.fromTo(
            eyebrow,
            { opacity: 0, x: -18 },
            { opacity: 1, x: 0, duration: 0.7 * s },
            0.05
          );
        }
        if (numeral) {
          tl.fromTo(
            numeral,
            { opacity: 0, x: -40 },
            { opacity: 1, x: 0, duration: 1.2 * s },
            0.1
          );
        }
        if (lines.length) {
          tl.fromTo(
            lines,
            { yPercent: 115, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 1.05 * s, stagger: 0.08 * s },
            0.15
          );
        }
        if (rules.length) {
          tl.fromTo(
            rules,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.9 * s, stagger: 0.1 },
            0.3
          );
        }
        if (fades.length) {
          tl.fromTo(
            fades,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.75 * s, stagger: 0.055 * s },
            0.5
          );
        }
        if (marquee) {
          tl.fromTo(
            marquee,
            { opacity: 0 },
            { opacity: 1, duration: 0.8 * s },
            0.7
          );
        }
        return tl;
      };

      const buildExit = (panel: HTMLElement) => {
        const tl = gsap.timeline({ defaults: { ease: "power2.in" } });
        const lines = panel.querySelectorAll(".ch-mask-line");
        const fades = panel.querySelectorAll(".ch-fade");
        const rules = panel.querySelectorAll(".ch-rule");
        const imageFrame = panel.querySelector<HTMLElement>(".ch-image-frame");
        const numeral = panel.querySelector<HTMLElement>(".ch-numeral-mark");
        const eyebrow = panel.querySelector<HTMLElement>(".ch-eyebrow");

        if (lines.length) {
          tl.to(
            lines,
            {
              yPercent: -115,
              opacity: 0,
              duration: 0.55,
              stagger: { each: 0.035, from: "end" },
            },
            0
          );
        }
        if (fades.length) {
          tl.to(
            fades,
            {
              opacity: 0,
              y: -14,
              duration: 0.4,
              stagger: { each: 0.018, from: "end" },
            },
            0
          );
        }
        if (eyebrow) tl.to(eyebrow, { opacity: 0, x: 18, duration: 0.4 }, 0);
        if (numeral) tl.to(numeral, { opacity: 0, x: 20, duration: 0.5 }, 0);
        if (rules.length) {
          tl.to(
            rules,
            { scaleX: 0, transformOrigin: "right center", duration: 0.5 },
            0
          );
        }
        if (imageFrame) {
          tl.to(
            imageFrame,
            { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7 },
            0.15
          );
        }
        return tl;
      };

      const resetPanel = (panel: HTMLElement) => {
        gsap.set(panel.querySelectorAll(".ch-mask-line"), {
          yPercent: 115,
          opacity: 0,
        });
        gsap.set(panel.querySelectorAll(".ch-fade"), { opacity: 0, y: 22 });
        gsap.set(panel.querySelectorAll(".ch-rule"), {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(panel.querySelectorAll(".ch-eyebrow"), { opacity: 0, x: -18 });
        gsap.set(panel.querySelector(".ch-numeral-mark"), {
          opacity: 0,
          x: -40,
        });
        gsap.set(panel.querySelector(".ch-marquee"), { opacity: 0 });
        gsap.set(panel.querySelector(".ch-image-frame"), {
          clipPath: "inset(0% 0% 100% 0%)",
        });
        gsap.set(panel.querySelector(".ch-image-inner"), { scale: 1.16 });
      };

      /* ---------- Initial state ---------- */
      gsap.set(".charter-corner", { opacity: 0, scale: 0.9 });
      gsap.set(".charter-hud-el", { opacity: 0 });
      gsap.set(".charter-bg-light", { opacity: 1 });
      gsap.set(".charter-bg-dark", { opacity: 0 });
      gsap.set(".charter-glow-core", { opacity: 0.3, scale: 1 });
      gsap.set(".charter-backdrop-group", { opacity: 1 });
      gsap.set(".charter-hud", { opacity: 0 });

      section
        .querySelectorAll<HTMLElement>(".charter-panel")
        .forEach(resetPanel);

      /* ---------- HUD updaters ---------- */
      const setHud = (selector: string, text: string) => {
        section.querySelectorAll<HTMLElement>(selector).forEach((el) => {
          if (el.textContent !== text) el.textContent = text;
        });
      };

      const applyBackdrop = (p: number) => {
        const darkP = smoothstep(p, 0.14, 0.22);
        gsap.set(".charter-bg-light", { opacity: 1 - darkP });
        gsap.set(".charter-bg-dark", { opacity: darkP });
        gsap.set(".charter-glow-core", {
          opacity: 0.3 + darkP * 0.7,
          scale: 1 + darkP * 0.12,
        });
        const state =
          p < 0.16
            ? "GROUND"
            : p < 0.38
              ? "PREFLIGHT"
              : p < 0.62
                ? "IN FLIGHT"
                : p < 0.86
                  ? "EN ROUTE"
                  : "TOUCHDOWN";
        setHud("[data-hud-state]", state);
        setHud(
          "[data-hud-coords]",
          `ALT ${Math.round(10500 + darkP * 27500 + p * 8000).toLocaleString()} FT`
        );
      };

      /* ============================================================
         MATCHMEDIA
         ============================================================ */
      mm = gsap.matchMedia();

      /* ---------- MOBILE ---------- */
      mm.add("(max-width: 767px)", () => {
        const panels = Array.from(
          section.querySelectorAll<HTMLElement>(
            '[data-panel-set="mobile"] .charter-panel'
          )
        );

        gsap.set(".charter-corner", { opacity: 1, scale: 1 });
        gsap.set(".charter-hud-el", { opacity: 1 });
        gsap.set(".charter-hud", { opacity: 1 });

        const triggers = panels.map((panel, i) => {
          return ScrollTrigger.create({
            trigger: panel,
            start: "top 78%",
            onEnter: () => {
              resetPanel(panel);
              buildEnter(panel, i === 0).play();
            },
            onEnterBack: () => {
              resetPanel(panel);
              buildEnter(panel, i === 0).play();
            },
          });
        });

        const driver = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            applyBackdrop(self.progress);
            const idx = Math.min(
              PANEL_COUNT - 1,
              Math.floor(self.progress * PANEL_COUNT + 0.0001)
            );
            setHud("[data-hud-panel]", PANELS[idx].label);
          },
        });

        const exit = ScrollTrigger.create({
          trigger: section,
          start: "bottom 95%",
          end: "bottom 40%",
          scrub: 0.4,
          onUpdate: (self) => {
            gsap.set(".charter-hud", { opacity: 1 - self.progress });
            gsap.set(".charter-backdrop-group", { opacity: 1 - self.progress });
          },
        });

        return () => {
          triggers.forEach((t) => t.kill());
          driver.kill();
          exit.kill();
          gsap.set(".charter-hud", { opacity: 1 });
          gsap.set(".charter-backdrop-group", { opacity: 1 });
        };
      });

      /* ---------- DESKTOP ---------- */
      mm.add("(min-width: 768px)", () => {
        const panels = Array.from(
          section.querySelectorAll<HTMLElement>(
            '[data-panel-set="desktop"] .charter-panel'
          )
        );

        panels.forEach((p) => {
          resetPanel(p);
          gsap.set(p, { opacity: 0, pointerEvents: "none" });
        });

        let revealed = false;
        const revealFirst = () => {
          if (revealed) return;
          revealed = true;
          gsap.to(".charter-corner", {
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.08,
            ease: "power3.out",
          });
          gsap.to(".charter-hud-el", {
            opacity: 1,
            duration: 1.1,
            stagger: 0.05,
            ease: "power3.out",
          });
          gsap.to(".charter-hud", { opacity: 1, duration: 0.8 });
          gsap.set(panels[0], { opacity: 1, pointerEvents: "auto" });
          buildEnter(panels[0]).play();
        };

        const introTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top 75%",
          onEnter: revealFirst,
          onEnterBack: revealFirst,
        });

        if (section.getBoundingClientRect().top < window.innerHeight * 0.75) {
          revealFirst();
        }

        let activeIdx = 0;
        let transitionTl: gsap.core.Timeline | null = null;

        const driver = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            applyBackdrop(p);

            const targetIdx = Math.min(
              PANEL_COUNT - 1,
              Math.floor(p / PANEL_WINDOW + 0.0001)
            );
            setHud("[data-hud-panel]", PANELS[targetIdx].label);

            if (revealed && targetIdx !== activeIdx) {
              const prev = activeIdx;
              activeIdx = targetIdx;

              if (transitionTl) {
                transitionTl.progress(1).kill();
                transitionTl = null;
              }

              const prevPanel = panels[prev];
              const nextPanel = panels[targetIdx];

              resetPanel(nextPanel);
              gsap.set(nextPanel, { opacity: 1, pointerEvents: "auto" });

              panels.forEach((pnl, i) => {
                if (i !== prev && i !== targetIdx) {
                  gsap.set(pnl, { opacity: 0, pointerEvents: "none" });
                }
              });

              const tl = gsap.timeline({
                onComplete: () => {
                  gsap.set(prevPanel, { opacity: 0, pointerEvents: "none" });
                  transitionTl = null;
                },
              });
              tl.add(buildExit(prevPanel));
              tl.to({}, { duration: 0.04 });
              tl.add(buildEnter(nextPanel, true));
              transitionTl = tl;
            }

            const clearP = smoothstep(p, 0.95, 1);
            gsap.set(".charter-hud", { opacity: 1 - clearP * 0.85 });
          },
        });

        const nextSection = document.getElementById("brokerage");
        let exitTrigger: ScrollTrigger | null = null;
        if (nextSection) {
          exitTrigger = ScrollTrigger.create({
            trigger: nextSection,
            start: "top 95%",
            end: "top 55%",
            scrub: 0.5,
            onUpdate: (self) => {
              gsap.set(".charter-hud", { opacity: 1 - self.progress });
              gsap.set(".charter-backdrop-group", {
                opacity: 1 - self.progress,
              });
            },
          });
        }

        return () => {
          introTrigger.kill();
          driver.kill();
          exitTrigger?.kill();
          if (transitionTl) {
            transitionTl.kill();
            transitionTl = null;
          }
        };
      });
    }, section);

    return () => {
      mm?.revert();
      ctx.revert();
    };
  }, []);

  /* ============================================================
     RENDER
     ============================================================ */
  return (
    <section
      ref={sectionRef}
      id="charter"
      className="relative w-full"
      style={{ zIndex: 6 }}
    >
      {/* ============ MOBILE ============ */}
      <div className="md:hidden relative">
        <div className="sticky top-0 h-[92svh] overflow-hidden z-0 pointer-events-none">
          <CharterBackdrop />
          <CharterHUD />
        </div>
        <div className="relative -mt-[92svh] z-10" data-panel-set="mobile">
          <CharterPanels />
        </div>
      </div>

      {/* ============ DESKTOP ============ */}
      <div className="hidden md:block relative h-[500vh]">
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <CharterBackdrop />
          <CharterHUD />
          <div className="absolute inset-0 z-10" data-panel-set="desktop">
            <CharterPanels />
          </div>
        </div>
      </div>

      <style jsx global>{`
        .ch-mask-line {
          will-change: transform, opacity;
        }
        .ch-numeral-mark {
          will-change: opacity, transform;
        }
        .ch-image-frame {
          will-change: clip-path;
        }
        .ch-image-inner {
          will-change: transform;
        }

        @keyframes charterMarquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        @keyframes charterDrift {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          12% {
            opacity: 0.75;
          }
          50% {
            transform: translateY(-55vh) translateX(8px) scale(1.2);
            opacity: 0.45;
          }
          88% {
            opacity: 0.12;
          }
          100% {
            transform: translateY(-110vh) translateX(18px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
