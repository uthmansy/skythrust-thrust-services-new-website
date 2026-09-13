"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
        desc: "Fully customized point-to-point flights departing on your schedule. A meticulously vetted network of light, mid-size, super-mid, and heavy jets, plus turboprops for regional accessibility.",
      },
      {
        n: "02",
        title: "Corporate Shuttle & Block Hour",
        desc: "Predictable aviation solutions for enterprise clients. Optimized routing and block-hour agreements guarantee aircraft availability while maximizing budget efficiency.",
      },
      {
        n: "03",
        title: "Empty Leg Management",
        desc: "Exclusive access to discounted repositioning flights. Continuous fleet monitoring to surface premium aircraft availability at significantly reduced rates.",
      },
      {
        n: "04",
        title: "Specialized & Humanitarian",
        desc: "Rapid deployment for Air Ambulance and Medevac with advanced life-support modules, plus secure, discreet transport for government and high-profile VIPs.",
      },
    ],
  },
  {
    numeral: "II",
    title: "Bespoke Passenger Experience",
    intro:
      "Every variable managed. Every detail considered — from the first inquiry to post-flight follow-up.",
    items: [
      {
        n: "01",
        title: "Dedicated Flight Concierge",
        desc: "A single, 24/7 point of contact. Complex multi-leg itineraries, visa coordination, and pet travel logistics — managed end-to-end.",
      },
      {
        n: "02",
        title: "Ground Handling & FBO Access",
        desc: "Bypass commercial terminal congestion. Exclusive private FBO access, fast-track immigration and customs, private security, and luxury ground transport direct to the tarmac.",
      },
      {
        n: "03",
        title: "Bespoke Catering & Amenities",
        desc: "Culinary experiences curated to your exact preferences. Michelin-standard catering, rare vintage selections, custom dietary requirements, cabin florals.",
      },
      {
        n: "04",
        title: "Absolute Privacy & Security",
        desc: "Discretion is our default. Crew trained in confidentiality protocols, secure communications, NDA-backed operations, and threat assessments for sensitive routes.",
      },
    ],
  },
  {
    numeral: "III",
    title: "Network & Destination Reach",
    intro:
      "From Lagos to London. Every airspace understood. Every runway within reach.",
    items: [
      {
        n: "01",
        title: "Domestic Excellence",
        desc: "Hourly departures connecting Lagos, Abuja, Port Harcourt, Kano, and other major Nigerian hubs with zero commercial delays.",
      },
      {
        n: "02",
        title: "West African Regional Network",
        desc: "Direct, efficient access to Accra, Freetown, Monrovia, Dakar, Cotonou, and Douala — navigating complex regional airspace with localized expertise.",
      },
      {
        n: "03",
        title: "Global Intercontinental Reach",
        desc: "Seamless connections to London, Dubai, Johannesburg, and New York, supported by comprehensive overflight and landing permit management.",
      },
    ],
  },
];

const smoothstep = (t: number, a: number, b: number) => {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
};

const PANEL_COUNT = 5;
const PANEL_WINDOW = 1 / PANEL_COUNT;

const TOKENS =
  ".ch-eyebrow, .ch-headline-line, .ch-body, .ch-label, .ch-chapter-title, .ch-chapter-intro, .ch-num, .ch-item-title, .ch-item-desc, .ch-closing-el";

function CharterBackdrop() {
  return (
    <div className="charter-backdrop-group absolute inset-0">
      <div className="charter-bg-light absolute inset-0">
        <div className="absolute inset-0 bg-[#F5EDE0]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(15,23,42,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(15,23,42,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(251,191,36,0.18) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="charter-bg-dark absolute inset-0">
        <div className="absolute inset-0 bg-[#0a0705]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
        <div
          className="charter-glow-core absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(251,191,36,0.22) 0%, rgba(217,119,6,0.10) 35%, transparent 72%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[55%]"
          style={{
            background:
              "radial-gradient(ellipse 90% 100% at 50% 100%, rgba(120,53,15,0.35) 0%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[35%]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 w-[22%]"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[22%]"
          style={{
            background:
              "linear-gradient(to left, rgba(0,0,0,0.45) 0%, transparent 100%)",
          }}
        />
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? "3px" : "2px",
              height: i % 3 === 0 ? "3px" : "2px",
              left: `${5 + ((i * 13) % 90)}%`,
              bottom: "-6px",
              background: "rgba(251,191,36,0.55)",
              filter: "blur(0.5px)",
              animation: `charterDrift ${16 + (i % 6) * 3}s linear ${i * 1.1}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function CharterHUD() {
  return (
    <div
      className="charter-hud-fade absolute inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: "difference" }}
    >
      <div className="charter-corner absolute top-6 left-6 w-5 h-5 border-l border-t border-white/70" />
      <div className="charter-corner absolute top-6 right-6 w-5 h-5 border-r border-t border-white/70" />
      <div className="charter-corner absolute bottom-6 left-6 w-5 h-5 border-l border-b border-white/70" />
      <div className="charter-corner absolute bottom-6 right-6 w-5 h-5 border-r border-b border-white/70" />

      <div className="charter-hud-el absolute top-8 left-16 right-16 flex items-center justify-between font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-white/75">
        <span className="hidden md:inline">{"// 06. Private Charter"}</span>
        <span className="md:hidden">{"// 06. Charter"}</span>
        <span className="flex items-center gap-3">
          <span
            className="w-1 h-1 rounded-full bg-white"
            style={{ animation: "charterBlink 2.2s ease-in-out infinite" }}
          />
          <span data-hud-alt>10,500 FT</span>
        </span>
      </div>

      <div className="charter-hud-el absolute bottom-8 left-16 right-16 flex items-center justify-between font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-white/60">
        <span className="hidden md:inline">N 6°27' / E 3°23'</span>
        <span className="md:hidden">6°27'N</span>
        <span data-hud-cycle>01 / 05</span>
      </div>

      <div className="charter-hud-el hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col gap-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="block w-2 h-px bg-white/40"
            style={{
              animation: `charterBlink ${3 + i * 0.4}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className="charter-hud-el hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col gap-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="block w-2 h-px bg-white/40"
            style={{
              animation: `charterBlink ${3 + i * 0.4}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      <div className="charter-hud-el absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-6 h-px bg-white/25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-6 bg-white/25" />
      </div>

      <div className="charter-hud-el hidden md:block absolute bottom-16 right-16 w-14 h-14 rounded-full border border-white/20">
        <div className="absolute inset-1 rounded-full border border-white/10" />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.35) 40deg, transparent 60deg)",
            animation: "charterRadar 5s linear infinite",
          }}
        />
      </div>

      <div className="charter-hud-el absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          className="relative w-[46vh] h-[46vh]"
          style={{ animation: "charterOrbit 32s linear infinite" }}
        >
          <span className="charter-dot absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white/70" />
          <span className="charter-dot absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/40" />
          <span className="charter-dot absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
      </div>

      <div className="charter-hud-el hidden md:block absolute inset-y-0 left-0 w-full pointer-events-none">
        <div
          className="absolute top-0 bottom-0 w-px bg-white/15"
          style={{ animation: "charterScan 12s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}

function CharterPanels({ mode }: { mode: "mobile" | "desktop" }) {
  const panelClass =
    mode === "mobile"
      ? "charter-panel relative min-h-screen flex items-center px-5 py-24"
      : "charter-panel absolute inset-0 flex items-center px-16 py-24";

  return (
    <>
      <div className={panelClass}>
        <div className="w-full max-w-6xl mx-auto">
          <p className="ch-eyebrow font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#92400E] mb-6 md:mb-8">
            {"// 06. Private Charter"}
          </p>

          <h2 className="font-display text-[12vw] md:text-[5vw] leading-[1.1] uppercase tracking-[-0.03em] text-[#1a1410] max-w-4xl">
            <span className="block overflow-hidden pb-[0.15em] pt-[0.05em]">
              <span className="ch-headline-line block will-change-transform">
                Flying,
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.15em] pt-[0.05em]">
              <span className="ch-headline-line block will-change-transform">
                elevated to
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.15em] pt-[0.05em]">
              <span className="ch-headline-line block text-[#B45309] will-change-transform">
                an art form.
              </span>
            </span>
          </h2>

          <div className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 max-w-4xl">
            <p className="ch-body font-sans text-[13.5px] md:text-[15.5px] leading-relaxed text-[#3f342a]/85">
              Sky Thrust redefines private aviation in West Africa by merging
              uncompromising safety with bespoke, white-glove luxury. We do not
              simply book flights — we curate sovereign, frictionless travel
              experiences.
            </p>
            <p className="ch-body font-sans text-[13.5px] md:text-[15.5px] leading-relaxed text-[#3f342a]/85">
              Because our charter operations are backed by our own elite MRO
              engineering division, we offer technical oversight and safety
              assurance that independent brokers cannot match.
            </p>
          </div>
        </div>
      </div>

      {CHAPTERS.map((chapter) => (
        <div key={chapter.numeral} className={panelClass}>
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
            <div className="md:col-span-4">
              <div className="flex items-center gap-4 mb-5 md:mb-6">
                <span className="ch-label font-mono text-[10px] uppercase tracking-[0.4em] text-[#F59E0B]/90 whitespace-nowrap">
                  Chapter {chapter.numeral}
                </span>
                <span className="ch-rule flex-1 h-px bg-white/15 will-change-transform" />
              </div>
              <h3 className="font-display text-[9vw] md:text-[2.5vw] leading-[1.2] tracking-[-0.02em] uppercase text-white overflow-hidden block">
                <span className="ch-chapter-title block pb-[0.12em] will-change-transform">
                  {chapter.title}
                </span>
              </h3>
              <p className="ch-chapter-intro mt-5 md:mt-6 font-sans text-[13px] md:text-[14px] leading-relaxed text-white/55 max-w-sm">
                {chapter.intro}
              </p>
            </div>

            <div className="md:col-span-8">
              {chapter.items.map((item) => (
                <div
                  key={item.n}
                  className="ch-item border-t border-white/12 py-5 md:py-6 grid grid-cols-[auto_1fr] gap-x-5 md:gap-x-10"
                >
                  <span className="ch-num font-mono text-[10px] uppercase tracking-[0.3em] text-[#F59E0B]/85 pt-1.5 will-change-transform">
                    {item.n}
                  </span>
                  <div>
                    <h4 className="font-display text-[5.5vw] md:text-[1.55vw] font-medium leading-[1.3] text-white/95 mb-2 tracking-[-0.01em] overflow-hidden block">
                      <span className="ch-item-title block pb-[0.1em] will-change-transform">
                        {item.title}
                      </span>
                    </h4>
                    <p className="ch-item-desc font-sans text-[12.5px] md:text-[13.5px] leading-relaxed text-white/50 max-w-2xl">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-white/12" />
            </div>
          </div>
        </div>
      ))}

      <div className={panelClass}>
        <div className="w-full max-w-4xl mx-auto text-center">
          <p className="ch-closing-el font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#F59E0B]/90 mb-8 md:mb-10">
            The Sky Thrust Advantage
          </p>

          <h3 className="font-display text-[9vw] md:text-[3.4vw] leading-[1.2] tracking-[-0.03em] text-white/95 max-w-3xl mx-auto">
            <span className="block overflow-hidden pb-[0.15em] pt-[0.05em]">
              <span className="ch-closing-el block will-change-transform">
                Not just a luxury seat.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.15em] pt-[0.05em]">
              <span className="ch-closing-el block text-[#F59E0B] will-change-transform">
                A flight engineered for absolute safety.
              </span>
            </span>
          </h3>

          <p className="ch-closing-el font-sans text-[13.5px] md:text-[15px] leading-relaxed text-white/55 max-w-2xl mx-auto mt-8 md:mt-10">
            Unlike traditional charter brokers, Sky Thrust is an
            engineering-first organization. Every aircraft in our network
            undergoes in-house technical auditing — from maintenance records to
            physical inspections to crew training — all validated against our
            internal MRO standards.
          </p>

          <div className="ch-closing-el mt-12 md:mt-16 flex items-center justify-center gap-5 md:gap-8 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.35em] text-white/35">
            <span>NCAA</span>
            <span className="w-1 h-1 rounded-full bg-[#F59E0B]/50" />
            <span>EASA</span>
            <span className="w-1 h-1 rounded-full bg-[#F59E0B]/50" />
            <span>FAA</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CharterSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let mm: ReturnType<typeof gsap.matchMedia> | null = null;

    const ctx = gsap.context(() => {
      const buildEnter = (panel: HTMLElement, fast = false) => {
        const s = fast ? 0.65 : 1;
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        const eyebrow = panel.querySelector(".ch-eyebrow");
        const headlineLines = panel.querySelectorAll(".ch-headline-line");
        const label = panel.querySelector(".ch-label");
        const rule = panel.querySelector(".ch-rule");
        const chapterTitle = panel.querySelector(".ch-chapter-title");
        const chapterIntro = panel.querySelector(".ch-chapter-intro");
        const bodies = panel.querySelectorAll(".ch-body");
        const items = panel.querySelectorAll(".ch-item");
        const nums = panel.querySelectorAll(".ch-num");
        const itemTitles = panel.querySelectorAll(".ch-item-title");
        const itemDescs = panel.querySelectorAll(".ch-item-desc");
        const closingEls = panel.querySelectorAll(".ch-closing-el");

        if (eyebrow) {
          tl.fromTo(
            eyebrow,
            { clipPath: "inset(0 100% 0 0)", opacity: 0, x: -16 },
            {
              clipPath: "inset(0 0% 0 0)",
              opacity: 1,
              x: 0,
              duration: 0.85 * s,
            },
            0
          );
        }
        if (headlineLines.length) {
          tl.fromTo(
            headlineLines,
            {
              yPercent: 115,
              opacity: 0,
              rotateX: -28,
              transformOrigin: "50% 100%",
              transformPerspective: 900,
            },
            {
              yPercent: 0,
              opacity: 1,
              rotateX: 0,
              duration: 1.1 * s,
              stagger: 0.09 * s,
            },
            0.12
          );
        }
        if (bodies.length) {
          tl.fromTo(
            bodies,
            { y: 34, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85 * s,
              stagger: 0.12 * s,
              ease: "power3.out",
            },
            0.5
          );
        }
        if (label) {
          tl.fromTo(
            label,
            { x: -20, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.55 * s, ease: "power3.out" },
            0
          );
        }
        if (rule) {
          tl.fromTo(
            rule,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 0.85 * s },
            0.05
          );
        }
        if (chapterTitle) {
          tl.fromTo(
            chapterTitle,
            {
              yPercent: 105,
              opacity: 0,
              rotateX: -20,
              transformOrigin: "50% 100%",
              transformPerspective: 900,
            },
            { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.0 * s },
            0.15
          );
        }
        if (chapterIntro) {
          tl.fromTo(
            chapterIntro,
            { y: 22, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 * s, ease: "power3.out" },
            0.45
          );
        }
        if (nums.length) {
          tl.fromTo(
            nums,
            { x: -20, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.55 * s,
              stagger: 0.09 * s,
              ease: "power3.out",
            },
            0.55
          );
        }
        if (itemTitles.length) {
          tl.fromTo(
            itemTitles,
            {
              yPercent: 95,
              opacity: 0,
              rotateX: -16,
              transformOrigin: "50% 100%",
              transformPerspective: 900,
            },
            {
              yPercent: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.8 * s,
              stagger: 0.09 * s,
            },
            0.58
          );
        }
        if (itemDescs.length) {
          tl.fromTo(
            itemDescs,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6 * s,
              stagger: 0.09 * s,
              ease: "power3.out",
            },
            0.65
          );
        }
        if (items.length) {
          tl.fromTo(
            items,
            { borderTopColor: "rgba(255,255,255,0)" },
            {
              borderTopColor: "rgba(255,255,255,0.12)",
              duration: 0.55 * s,
              stagger: 0.09 * s,
              ease: "power2.out",
            },
            0.55
          );
        }
        if (closingEls.length) {
          tl.fromTo(
            closingEls,
            {
              y: 40,
              opacity: 0,
              rotateX: -20,
              transformOrigin: "50% 100%",
              transformPerspective: 900,
            },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.95 * s,
              stagger: 0.15 * s,
            },
            0.08
          );
        }
        return tl;
      };

      const buildExit = (panel: HTMLElement, fast = false) => {
        const s = fast ? 0.6 : 1;
        const tl = gsap.timeline({ defaults: { ease: "power2.in" } });
        const tokens = panel.querySelectorAll(TOKENS);
        const rules = panel.querySelectorAll(".ch-rule");
        const items = panel.querySelectorAll(".ch-item");

        tl.to(
          tokens,
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.5 * s,
            stagger: { each: 0.012 * s, from: "end" },
          },
          0
        );
        if (rules.length) {
          tl.to(
            rules,
            { scaleX: 0, transformOrigin: "right center", duration: 0.5 * s },
            0
          );
        }
        if (items.length) {
          tl.to(
            items,
            {
              borderTopColor: "rgba(255,255,255,0)",
              duration: 0.5 * s,
              stagger: { each: 0.02 * s, from: "end" },
            },
            0
          );
        }
        tl.set(tokens, {
          y: 0,
          x: 0,
          yPercent: 0,
          rotateX: 0,
          scale: 1,
          opacity: 0,
          clipPath: "none",
        });
        return tl;
      };

      const resetPanelTokens = (panel: HTMLElement) => {
        gsap.set(panel.querySelectorAll(TOKENS), { opacity: 0 });
        gsap.set(panel.querySelectorAll(".ch-item"), {
          borderTopColor: "rgba(255,255,255,0)",
        });
      };

      gsap.set(".charter-corner", { opacity: 0, scale: 0.9 });
      gsap.set(".charter-hud-el", { opacity: 0 });
      gsap.set(".charter-dot", { scale: 0, opacity: 0 });
      gsap.set(".charter-bg-light", { opacity: 1 });
      gsap.set(".charter-bg-dark", { opacity: 0 });
      gsap.set(".charter-glow-core", { opacity: 0.3, scale: 1 });
      gsap.set(".charter-backdrop-group", { opacity: 1 });

      section
        .querySelectorAll<HTMLElement>(".charter-panel")
        .forEach(resetPanelTokens);

      const setHudAlt = (text: string) => {
        section
          .querySelectorAll<HTMLElement>("[data-hud-alt]")
          .forEach((el) => {
            el.textContent = text;
          });
      };
      const setHudCycle = (text: string) => {
        section
          .querySelectorAll<HTMLElement>("[data-hud-cycle]")
          .forEach((el) => {
            el.textContent = text;
          });
      };
      const applyBackdrop = (p: number) => {
        /* Tight transition window — completes in ~6% of pin scroll (~300ms) */
        const darkP = smoothstep(p, 0.16, 0.22);
        gsap.set(".charter-bg-light", { opacity: 1 - darkP });
        gsap.set(".charter-bg-dark", { opacity: darkP });
        gsap.set(".charter-glow-core", {
          opacity: 0.3 + darkP * 0.7,
          scale: 1 + darkP * 0.15,
        });
        setHudAlt(
          `${Math.round(10500 + darkP * 27500 + p * 8000).toLocaleString()} FT`
        );
      };

      mm = gsap.matchMedia();

      /* ==========================================================
         MOBILE
         ========================================================== */
      mm.add("(max-width: 767px)", () => {
        const panels = Array.from(
          section.querySelectorAll<HTMLElement>(
            '[data-panel-set="mobile"] .charter-panel'
          )
        );

        gsap.set(".charter-corner", { opacity: 1, scale: 1 });
        gsap.set(".charter-hud-el", { opacity: 1 });
        gsap.set(".charter-dot", { scale: 1, opacity: 1 });

        const revealTriggers = panels.map((panel, i) => {
          return ScrollTrigger.create({
            trigger: panel,
            start: "top 78%",
            onEnter: () => {
              resetPanelTokens(panel);
              buildEnter(panel, i === 0).play();
            },
            onEnterBack: () => {
              resetPanelTokens(panel);
              buildEnter(panel, i === 0).play();
            },
          });
        });

        /* Backdrop morph + end-of-section clear */
        const driverTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const p = self.progress;
            applyBackdrop(p);
            const idx = Math.min(PANEL_COUNT - 1, Math.floor(p * PANEL_COUNT));
            setHudCycle(`0${idx + 1} / 0${PANEL_COUNT}`);
          },
        });

        /* EXPLICIT EXIT — fade HUD + backdrop as the section's bottom
           approaches the viewport bottom. This guarantees the stage
           clears even if sticky doesn't release on its own. */
        const exitTrigger = ScrollTrigger.create({
          trigger: section,
          start: "bottom 95%",
          end: "bottom 30%",
          scrub: 0.4,
          onUpdate: (self) => {
            const e = self.progress;
            gsap.set(".charter-hud-fade", { opacity: 1 - e });
            gsap.set(".charter-backdrop-group", { opacity: 1 - e });
          },
        });

        return () => {
          revealTriggers.forEach((t) => t.kill());
          driverTrigger.kill();
          exitTrigger.kill();
          gsap.set(".charter-hud-fade", { opacity: 1 });
          gsap.set(".charter-backdrop-group", { opacity: 1 });
        };
      });

      /* ==========================================================
         DESKTOP
         ========================================================== */
      mm.add("(min-width: 768px)", () => {
        const panels = Array.from(
          section.querySelectorAll<HTMLElement>(
            '[data-panel-set="desktop"] .charter-panel'
          )
        );

        gsap.set(".charter-backdrop-group", { opacity: 1 });

        panels.forEach((p) => {
          resetPanelTokens(p);
          gsap.set(p, { opacity: 0, pointerEvents: "none" });
        });

        let panel0Revealed = false;
        const revealIntro = () => {
          if (panel0Revealed) return;
          panel0Revealed = true;
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
          gsap.to(".charter-dot", {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "back.out(1.5)",
          });
          gsap.set(panels[0], { opacity: 1, pointerEvents: "auto" });
          buildEnter(panels[0]).play();
        };

        const introTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top 70%",
          onEnter: revealIntro,
          onEnterBack: () => {
            if (!panel0Revealed) revealIntro();
          },
        });

        let activeIdx = 0;
        let transitionTl: gsap.core.Timeline | null = null;

        const driverTrigger = ScrollTrigger.create({
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
            setHudCycle(`0${targetIdx + 1} / 0${PANEL_COUNT}`);

            if (panel0Revealed && targetIdx !== activeIdx) {
              const prev = activeIdx;
              activeIdx = targetIdx;

              if (transitionTl) {
                transitionTl.progress(1).kill();
                transitionTl = null;
              }

              const prevPanel = panels[prev];
              const nextPanel = panels[targetIdx];

              resetPanelTokens(nextPanel);
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

              tl.add(buildExit(prevPanel, true));
              tl.to({}, { duration: 0.06 });
              tl.add(buildEnter(nextPanel, true));
              transitionTl = tl;
            }

            const clearP = smoothstep(p, 0.94, 1);
            gsap.set(".charter-hud-fade", { opacity: 1 - clearP });
          },
        });

        const footprint = document.getElementById("footprint");
        let exitTrigger: ScrollTrigger | null = null;
        if (footprint) {
          exitTrigger = ScrollTrigger.create({
            trigger: footprint,
            start: "top 95%",
            end: "top 55%",
            scrub: 0.5,
            onUpdate: (self) => {
              gsap.set(".charter-hud-fade", { opacity: 1 - self.progress });
              gsap.set(".charter-backdrop-group", {
                opacity: 1 - self.progress,
              });
            },
          });
        }

        return () => {
          introTrigger.kill();
          driverTrigger.kill();
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

  return (
    <section
      ref={sectionRef}
      id="charter"
      className="relative w-full"
      style={{ zIndex: 6 }}
    >
      {/* ============ MOBILE TREE ============ */}
      <div className="md:hidden relative">
        <div className="sticky top-0 h-screen z-0 pointer-events-none">
          <CharterBackdrop />
          <CharterHUD />
        </div>
        <div className="relative -mt-[100vh] z-10" data-panel-set="mobile">
          <CharterPanels mode="mobile" />
        </div>
      </div>

      {/* ============ DESKTOP TREE ============ */}
      <div className="hidden md:block relative h-[380vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <CharterBackdrop />
          <CharterHUD />
          <div className="absolute inset-0 z-10" data-panel-set="desktop">
            <CharterPanels mode="desktop" />
          </div>
        </div>
      </div>

      <style jsx global>{`
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
        @keyframes charterRadar {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes charterOrbit {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes charterScan {
          0% {
            transform: translateX(-10vw);
            opacity: 0;
          }
          15% {
            opacity: 0.55;
          }
          85% {
            opacity: 0.55;
          }
          100% {
            transform: translateX(110vw);
            opacity: 0;
          }
        }
        @keyframes charterBlink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.2;
          }
        }
      `}</style>
    </section>
  );
}
