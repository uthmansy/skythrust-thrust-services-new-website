"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const TIERS = [
  {
    id: "a",
    letter: "A",
    index: "01",
    zone: "NOSE",
    title: "A-CHECK",
    caption: "Light Line Maintenance",
    body: "Routine line-level inspection performed on the ramp. Quick turnaround, minimal aircraft downtime. Engineered for maximum fleet availability.",
    chips: ["400-600 FH", "200-300 FC", "~2 days"],
    items: [
      "Routine visual inspections",
      "Engine oil & hydraulic levels",
      "Filter replacements",
      "Landing gear lubrication",
      "Emergency equipment test",
    ],
    readout: {
      ref: "01-A",
      vessel: "B737-800",
      reg: "5N-BQA",
      cycle: "18,420",
      status: "OK",
    },
    accent: "#7DD3FC",
    lensValue: "24/24",
    lensStatus: "OK",
  },
  {
    id: "b",
    letter: "B",
    index: "02",
    zone: "WING",
    title: "B-CHECK",
    caption: "Intermediate Inspection",
    body: "Deeper system-level inspection with calibrated diagnostics. Covers internal components, control linkages, and instrument accuracy.",
    chips: ["6-8 MO", "500-800 FH", "~1 week"],
    items: [
      "Internal component inspection",
      "Panel & control checks",
      "Instrument calibration",
      "Deeper fluid analysis",
      "Minor defect rectification",
    ],
    readout: {
      ref: "02-B",
      vessel: "A320neo",
      reg: "5N-STB",
      cycle: "12,105",
      status: "OK",
    },
    accent: "#94A3B8",
    lensValue: "100%",
    lensStatus: "OK",
  },
  {
    id: "c",
    letter: "C",
    index: "03",
    zone: "BODY",
    title: "C-CHECK",
    caption: "Heavy Base Maintenance",
    body: "Aircraft taken out of service for weeks of deep structural inspection, engine overhaul, and NDT of critical stress points.",
    chips: ["20-24 MO", "3,000-6,000 FH", "~3 weeks"],
    items: [
      "Major access panel opening",
      "Structural rib & spar inspection",
      "Engine & gear overhaul",
      "NDT of critical stress points",
      "Avionics deep-dive inspection",
    ],
    readout: {
      ref: "03-C",
      vessel: "B777-300ER",
      reg: "5N-STC",
      cycle: "8,240",
      status: "OK",
    },
    accent: "#D97706",
    lensValue: "340pts",
    lensStatus: "OK",
  },
  {
    id: "d",
    letter: "D",
    index: "04",
    zone: "TAIL",
    title: "D-CHECK",
    caption: "Structural Overhaul",
    body: "Complete disassembly, corrosion control, fatigue analysis, and full reassembly with flight testing. The most extensive maintenance event.",
    chips: ["6-12 YR", "20,000-30,000 FH", "6-12 weeks"],
    items: [
      "Complete aircraft disassembly",
      "Intensive corrosion control",
      "Structural fatigue analysis",
      "Complete system rewiring",
      "Reassembly + flight testing",
    ],
    readout: {
      ref: "04-D",
      vessel: "A330-300",
      reg: "5N-STD",
      cycle: "24,890",
      status: "WATCH",
    },
    accent: "#B91C1C",
    lensValue: "1,240",
    lensStatus: "WATCH",
  },
];

const ZONES = [0.12, 0.38, 0.62, 0.86];

const easeInOutQuad = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export default function MaintenanceSpectrum() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const ctx = gsap.context(() => {
      const cards = Array.from(stage.querySelectorAll<HTMLElement>(".ms-card"));

      // PRE-PAINT
      cards.forEach((card, i) => {
        const isActive = i === 0;
        gsap.set(card, { opacity: isActive ? 1 : 0 });

        gsap.set(
          [
            card.querySelector(".ms-letter"),
            card.querySelector(".ms-title"),
            card.querySelector(".ms-caption"),
            card.querySelector(".ms-body"),
          ],
          { opacity: isActive ? 1 : 0 }
        );
        gsap.set(card.querySelectorAll(".ms-chip"), {
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : 12,
        });
        gsap.set(card.querySelectorAll(".ms-item"), {
          opacity: isActive ? 1 : 0,
          x: isActive ? 0 : 16,
        });
        gsap.set(card.querySelectorAll(".ms-readout-row"), {
          opacity: isActive ? 1 : 0,
          x: isActive ? 0 : 12,
        });
      });

      gsap.set(".ms-hud-top, .ms-hud-bottom", { opacity: 0, y: 14 });
      gsap.set(".ms-spine-line", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".ms-trail-fill", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(".ms-zone-marker", { scale: 0, opacity: 0 });
      gsap.set(".ms-lens", { scale: 0, opacity: 0 });
      gsap.set(".ms-arcs", { opacity: 0 });
      gsap.set(".ms-arc", { scale: 0.88, opacity: 0 });
      gsap.set(".ms-progress-fill", {
        scaleX: 0,
        transformOrigin: "left center",
      });

      // ENTER timeline - arc breathing loop is chained on complete
      const enterTl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onComplete: () => {
          gsap.to(".ms-arc", {
            opacity: 0.55,
            duration: 5,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            stagger: { each: 0.7, from: "start" },
          });
        },
      });

      enterTl
        .to(".ms-hud-top, .ms-hud-bottom", { opacity: 1, y: 0, duration: 0.5 })
        .to(".ms-arcs", { opacity: 1, duration: 0.6 }, "-=0.4")
        .to(
          ".ms-arc",
          {
            scale: 1,
            opacity: 1,
            duration: 1.4,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=0.4"
        )
        .to(
          ".ms-spine-line",
          { scaleX: 1, duration: 1.1, ease: "power2.inOut" },
          "-=1.2"
        )
        .to(
          ".ms-zone-marker",
          { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1 },
          "-=0.6"
        )
        .to(
          ".ms-lens",
          { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.4)" },
          "-=0.4"
        );

      // ENTER trigger - fires when the section is 55% into the viewport
      ScrollTrigger.create({
        trigger: section,
        start: "top 55%",
        onEnter: () => enterTl.progress(0).play(),
        onLeaveBack: () => {
          enterTl.progress(0).pause();
          gsap.killTweensOf(".ms-arc");
          gsap.set(".ms-arc", { opacity: 0, scale: 0.88 });
          gsap.set(".ms-arcs", { opacity: 0 });
        },
      });

      // TIER SWITCH
      let activeTier = 0;
      let switchTimeline: gsap.core.Timeline | null = null;

      const setCardState = (
        card: HTMLElement,
        visible: boolean,
        reset = false
      ) => {
        const letter = card.querySelector(".ms-letter");
        const title = card.querySelector(".ms-title");
        const caption = card.querySelector(".ms-caption");
        const body = card.querySelector(".ms-body");
        const chips = card.querySelectorAll(".ms-chip");
        const items = card.querySelectorAll(".ms-item");
        const readouts = card.querySelectorAll(".ms-readout-row");

        if (reset) {
          gsap.set(letter, { opacity: 0, scale: 0.94 });
          gsap.set(title, { opacity: 0, x: 24 });
          gsap.set(caption, { opacity: 0, x: 18 });
          gsap.set(body, { opacity: 0, y: 12 });
          gsap.set(chips, { opacity: 0, y: 12 });
          gsap.set(items, { opacity: 0, x: 16 });
          gsap.set(readouts, { opacity: 0, x: 12 });
        } else {
          gsap.set([letter, title, caption, body], {
            opacity: visible ? 1 : 0,
          });
          gsap.set(chips, { opacity: visible ? 1 : 0, y: visible ? 0 : 12 });
          gsap.set(items, { opacity: visible ? 1 : 0, x: visible ? 0 : 16 });
          gsap.set(readouts, {
            opacity: visible ? 1 : 0,
            x: visible ? 0 : 12,
          });
        }
      };

      const switchTier = (next: number) => {
        if (next === activeTier) return;
        const prev = activeTier;
        activeTier = next;

        if (switchTimeline) {
          switchTimeline.kill();
          switchTimeline = null;
        }

        cards.forEach((card, i) => {
          if (i !== prev && i !== next) gsap.set(card, { opacity: 0 });
        });

        const prevCard = cards[prev];
        const nextCard = cards[next];
        if (!prevCard || !nextCard) return;

        setCardState(nextCard, false, true);
        gsap.set(nextCard, { opacity: 1 });

        const tl = gsap.timeline({
          onComplete: () => {
            switchTimeline = null;
            gsap.set(prevCard, { opacity: 0 });
          },
        });

        // EXIT prev
        tl.to(
          prevCard.querySelectorAll(".ms-item"),
          {
            x: 20,
            opacity: 0,
            duration: 0.22,
            stagger: 0.015,
            ease: "power2.in",
          },
          0
        )
          .to(
            prevCard.querySelectorAll(".ms-chip"),
            {
              scale: 0.9,
              opacity: 0,
              duration: 0.18,
              stagger: 0.025,
              ease: "power2.in",
            },
            0
          )
          .to(
            prevCard.querySelectorAll(".ms-readout-row"),
            {
              opacity: 0,
              x: 12,
              duration: 0.2,
              stagger: 0.02,
              ease: "power2.in",
            },
            0
          )
          .to(
            prevCard.querySelector(".ms-body"),
            { y: -8, opacity: 0, duration: 0.22, ease: "power2.in" },
            0.03
          )
          .to(
            [
              prevCard.querySelector(".ms-title"),
              prevCard.querySelector(".ms-caption"),
            ],
            {
              y: -12,
              opacity: 0,
              duration: 0.22,
              stagger: 0.02,
              ease: "power2.in",
            },
            0.03
          )
          .to(
            prevCard.querySelector(".ms-letter"),
            { scale: 0.95, opacity: 0, duration: 0.22, ease: "power2.in" },
            0.06
          )
          .set(prevCard, { opacity: 0 }, 0.28)
          .to({}, { duration: 0.08 }, 0.28);

        // ENTRY next
        tl.to(
          nextCard.querySelector(".ms-letter"),
          { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.5)" },
          0.36
        )
          .to(
            nextCard.querySelector(".ms-title"),
            { opacity: 1, x: 0, duration: 0.42, ease: "power3.out" },
            0.36
          )
          .to(
            nextCard.querySelector(".ms-caption"),
            { opacity: 1, x: 0, duration: 0.38, ease: "power3.out" },
            0.4
          )
          .to(
            nextCard.querySelector(".ms-body"),
            { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" },
            0.4
          )
          .to(
            nextCard.querySelectorAll(".ms-chip"),
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              stagger: 0.05,
              ease: "power2.out",
            },
            0.42
          )
          .to(
            nextCard.querySelectorAll(".ms-item"),
            {
              opacity: 1,
              x: 0,
              duration: 0.35,
              stagger: 0.035,
              ease: "power2.out",
            },
            0.44
          )
          .to(
            nextCard.querySelectorAll(".ms-readout-row"),
            {
              opacity: 1,
              x: 0,
              duration: 0.3,
              stagger: 0.04,
              ease: "power2.out",
            },
            0.46
          );

        switchTimeline = tl;
      };

      // DOM refs
      const tierDots = section.querySelectorAll<HTMLElement>("[data-tier-dot]");
      const zoneMarkers =
        stage.querySelectorAll<HTMLElement>("[data-zone-marker]");
      const counterEl = section.querySelector<HTMLElement>(".ms-counter");
      const lensEl = stage.querySelector<HTMLElement>(".ms-lens");
      const lensValueEl = stage.querySelector<HTMLElement>(".ms-lens-value");
      const lensStatusEl = stage.querySelector<HTMLElement>(".ms-lens-status");
      const lensLabelEl = stage.querySelector<HTMLElement>(".ms-lens-label");
      const trailFillEl = stage.querySelector<HTMLElement>(".ms-trail-fill");
      const lensScanEl = stage.querySelector<HTMLElement>(".ms-lens-scan");

      let lastUIState = -1;
      let exitActive = false;

      // MAIN SCRUB
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.35,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          const raw = p * 4;
          const tierIdx = Math.min(3, Math.floor(raw));
          const windowP = Math.min(1, Math.max(0, raw - tierIdx));

          const fromX = ZONES[tierIdx];
          const toX = tierIdx < 3 ? ZONES[tierIdx + 1] : ZONES[3];
          const eased = easeInOutQuad(windowP);
          const lensX = fromX + (toX - fromX) * eased;

          if (lensEl) gsap.set(lensEl, { left: `${lensX * 100}%` });
          if (trailFillEl) gsap.set(trailFillEl, { scaleX: lensX });
          gsap.set(".ms-progress-fill", { scaleX: p });

          if (!exitActive) switchTier(tierIdx);

          if (tierIdx !== lastUIState) {
            lastUIState = tierIdx;
            const tier = TIERS[tierIdx];

            if (lensValueEl) lensValueEl.textContent = tier.lensValue;
            if (lensStatusEl) {
              lensStatusEl.textContent = tier.lensStatus;
              lensStatusEl.style.color = tier.accent;
            }
            if (lensLabelEl)
              lensLabelEl.textContent = `ZONE ${tier.index} / ${tier.zone}`;

            if (lensEl) {
              gsap.to(lensEl, {
                borderColor: tier.accent,
                boxShadow: `0 0 0 4px ${tier.accent}18, 0 0 60px ${tier.accent}22`,
                duration: 0.4,
                overwrite: "auto",
              });
            }

            if (lensScanEl) {
              gsap.fromTo(
                lensScanEl,
                { y: "-100%", opacity: 0.9 },
                {
                  y: "100%",
                  opacity: 0,
                  duration: 0.55,
                  ease: "power2.inOut",
                  overwrite: "auto",
                }
              );
            }

            zoneMarkers.forEach((m, i) => {
              const isActive = i === tierIdx;
              m.style.background = isActive ? tier.accent : "transparent";
              m.style.borderColor = isActive
                ? tier.accent
                : "rgba(15,23,42,0.4)";
              if (isActive) {
                gsap.fromTo(
                  m,
                  { scale: 1 },
                  {
                    scale: 1.6,
                    duration: 0.4,
                    yoyo: true,
                    repeat: 1,
                    ease: "power2.out",
                    overwrite: "auto",
                  }
                );
              }
            });

            tierDots.forEach((d, i) => {
              const isActive = i === tierIdx;
              d.style.background = isActive ? tier.accent : "transparent";
              d.style.borderColor = isActive
                ? tier.accent
                : "rgba(15,23,42,0.35)";
              d.style.boxShadow = isActive
                ? `0 0 0 5px ${tier.accent}22`
                : "none";
            });

            if (counterEl) counterEl.textContent = `TIER ${tier.index} / 04`;
          }
        },
      });

      // EXIT
      const nextSection = document.getElementById("spares");
      if (nextSection) {
        const exitTl = gsap.timeline({ paused: true });
        exitTl
          .to(
            ".ms-lens",
            { scale: 0, opacity: 0, duration: 0.5, ease: "power3.in" },
            0
          )
          .to(
            ".ms-card",
            { opacity: 0, y: 40, duration: 0.5, ease: "power3.in" },
            0
          )
          .to(
            ".ms-zone-marker",
            {
              scale: 0,
              opacity: 0,
              duration: 0.4,
              stagger: 0.03,
              ease: "power3.in",
            },
            0.05
          )
          .to(
            ".ms-spine-line, .ms-trail-fill",
            { opacity: 0, scaleX: 0, duration: 0.5, ease: "power3.in" },
            0.1
          )
          .to(
            ".ms-hud-top, .ms-hud-bottom",
            { opacity: 0, y: 20, duration: 0.4, ease: "power3.in" },
            0.15
          )
          .to(".ms-arcs", { opacity: 0, duration: 0.6, ease: "power2.in" }, 0);

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
              return;
            }
            if (self.progress <= 0) return;

            if (!exitActive) {
              exitActive = true;

              if (switchTimeline) {
                switchTimeline.kill();
                switchTimeline = null;
              }
              cards.forEach((card, i) => {
                gsap.set(card, {
                  opacity: i === activeTier ? 1 : 0,
                  y: 0,
                });
                if (i === activeTier) setCardState(card, true);
              });

              if (enterTl.progress() < 1) enterTl.progress(1).pause();
            }

            exitTl.progress(self.progress);
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="maintenance"
      className="relative w-full"
      style={{ height: "200vh", zIndex: 4 }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <div ref={stageRef} className="relative w-full h-full">
          <style>{`
            @keyframes msRotate {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
            }
            @keyframes msDrift {
              0%   { transform: translateY(0);      opacity: 0; }
              15%  { opacity: 0.3; }
              85%  { opacity: 0.3; }
              100% { transform: translateY(-100vh); opacity: 0; }
            }
          `}</style>

          {/* CONCENTRIC ARCS */}
          <div
            className="ms-arcs absolute inset-0 pointer-events-none overflow-hidden"
            aria-hidden
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 75% 50%, rgba(251,146,60,0.05) 0%, transparent 45%)",
              }}
            />
            <div
              className="ms-arc absolute rounded-full border"
              style={{
                width: "30vmin",
                height: "30vmin",
                top: "50%",
                left: "75%",
                transform: "translate(-50%, -50%)",
                borderColor: "rgba(15,23,42,0.12)",
              }}
            />
            <div
              className="ms-arc absolute rounded-full border"
              style={{
                width: "50vmin",
                height: "50vmin",
                top: "50%",
                left: "75%",
                transform: "translate(-50%, -50%)",
                borderColor: "rgba(15,23,42,0.10)",
              }}
            />
            <div
              className="ms-arc absolute rounded-full border"
              style={{
                width: "70vmin",
                height: "70vmin",
                top: "50%",
                left: "75%",
                transform: "translate(-50%, -50%)",
                borderColor: "rgba(15,23,42,0.08)",
              }}
            />
            <div
              className="ms-arc absolute rounded-full border"
              style={{
                width: "88vmin",
                height: "88vmin",
                top: "50%",
                left: "75%",
                transform: "translate(-50%, -50%)",
                borderColor: "rgba(15,23,42,0.06)",
              }}
            />
          </div>

          {/* AMBIENT DOTS */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="absolute w-0.5 h-0.5 rounded-full bg-[var(--color-ink-primary)]"
                style={{
                  left: `${12 + i * 15}%`,
                  bottom: "-4px",
                  animation: `msDrift ${20 + (i % 3) * 6}s linear ${
                    i * 2.5
                  }s infinite`,
                }}
              />
            ))}
          </div>

          {/* TOP HUD */}
          <div className="ms-hud-top absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-5 md:px-10 pt-5 md:pt-8">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-[var(--color-amber-accent)]">
              {"// 04. Maintenance Spectrum"}
            </p>
            <p className="ms-counter font-mono text-[10px] md:text-xs uppercase tracking-[0.25em] text-[var(--color-ink-primary)]/70">
              TIER 01 / 04
            </p>
          </div>

          {/* CONTENT BAND */}
          <div className="absolute top-[10%] bottom-[32%] left-0 right-0">
            <div className="relative w-full h-full px-5 md:px-10 max-w-[1400px] mx-auto">
              {TIERS.map((tier) => (
                <div
                  key={tier.id}
                  className="ms-card absolute inset-0 flex items-center"
                >
                  <div className="w-full grid grid-cols-[auto_1fr] gap-4 md:gap-10 lg:gap-14 items-start">
                    <div
                      className="ms-letter font-display font-bold leading-[0.82] shrink-0"
                      style={{
                        color: tier.accent,
                        fontSize: "clamp(56px, 9vw, 140px)",
                        letterSpacing: "-0.05em",
                      }}
                    >
                      {tier.letter}
                    </div>

                    <div className="min-w-0 grid grid-cols-1 md:grid-cols-[1fr_200px] lg:grid-cols-[1fr_220px] gap-6 md:gap-10 items-start">
                      <div className="min-w-0">
                        <h3 className="ms-title font-display font-bold uppercase tracking-[-0.03em] text-[var(--color-ink-primary)] text-[clamp(22px,2.8vw,40px)] leading-tight">
                          {tier.title}
                        </h3>
                        <p className="ms-caption font-mono text-[9px] md:text-[11px] uppercase tracking-[0.3em] text-[var(--color-ink-secondary)]/70 mt-1.5 md:mt-2">
                          {tier.index} / {tier.caption}
                        </p>

                        <p className="ms-body font-sans text-[12px] md:text-[14px] leading-relaxed text-[var(--color-ink-secondary)] max-w-[48ch] mt-3 md:mt-4">
                          {tier.body}
                        </p>

                        <div className="flex flex-wrap gap-1.5 md:gap-2 mt-3 md:mt-5">
                          {tier.chips.map((chip) => (
                            <span
                              key={chip}
                              className="ms-chip font-mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border"
                              style={{
                                borderColor: `${tier.accent}55`,
                                color: "var(--color-ink-primary)",
                                background: `${tier.accent}0E`,
                              }}
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        <ul className="mt-3 md:mt-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5 max-w-[620px]">
                          {tier.items.map((item) => (
                            <li
                              key={item}
                              className="ms-item flex items-start gap-2.5 font-sans text-[11px] md:text-[12.5px] leading-snug text-[var(--color-ink-secondary)]/85"
                            >
                              <span
                                className="mt-[6px] w-1 h-1 shrink-0"
                                style={{ background: tier.accent }}
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="hidden md:block ms-readout pt-1">
                        <div
                          className="ms-readout-row h-px w-full mb-3"
                          style={{ background: `${tier.accent}55` }}
                        />
                        {[
                          ["REF", tier.readout.ref],
                          ["VESSEL", tier.readout.vessel],
                          ["REG", tier.readout.reg],
                          ["CYCLE", tier.readout.cycle],
                        ].map(([label, value]) => (
                          <div
                            key={label}
                            className="ms-readout-row flex items-baseline justify-between py-2 border-b border-[var(--color-ink-primary)]/8"
                          >
                            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-ink-secondary)]/55">
                              {label}
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-ink-primary)]/85">
                              {value}
                            </span>
                          </div>
                        ))}
                        <div className="ms-readout-row flex items-baseline justify-between py-2 mt-1">
                          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--color-ink-secondary)]/55">
                            STATUS
                          </span>
                          <span
                            className="font-mono text-[11px] uppercase tracking-[0.15em]"
                            style={{ color: tier.accent }}
                          >
                            {tier.readout.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RULER BAND */}
          <div className="absolute top-[68%] bottom-[14%] left-0 right-0">
            <div className="relative w-full h-full px-5 md:px-10 max-w-[1400px] mx-auto">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2">
                <div
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 pointer-events-none"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, rgba(15,23,42,0.15) 0 1px, transparent 1px 12px)",
                  }}
                />

                <div className="ms-spine-line absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-[var(--color-ink-primary)]/40" />

                <div
                  className="ms-trail-fill absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-[var(--color-amber-accent)]/60"
                  style={{ transformOrigin: "left center" }}
                />

                {TIERS.map((tier, i) => (
                  <div
                    key={tier.id}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${ZONES[i] * 100}%` }}
                  >
                    <div
                      data-zone-marker={i}
                      className="w-2.5 h-2.5 rounded-full border-2 transition-colors duration-300"
                      style={{
                        borderColor: "rgba(15,23,42,0.4)",
                        background: "transparent",
                      }}
                    />
                    <span className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.3em] text-[var(--color-ink-secondary)]/55 whitespace-nowrap">
                      {tier.zone}
                    </span>
                  </div>
                ))}

                <div
                  className="ms-lens absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-20 h-20 md:w-32 md:h-32 rounded-full border backdrop-blur-sm overflow-hidden pointer-events-none bg-white/10"
                  style={{
                    left: "12%",
                    borderColor: "rgba(15,23,42,0.4)",
                  }}
                >
                  <div
                    className="absolute inset-2 md:inset-2.5 rounded-full border border-dashed border-[var(--color-ink-primary)]/20"
                    style={{ animation: "msRotate 8s linear infinite" }}
                  />

                  <div className="absolute top-1/2 left-2.5 right-2.5 h-px bg-[var(--color-ink-primary)]/20" />
                  <div className="absolute left-1/2 top-2.5 bottom-2.5 w-px bg-[var(--color-ink-primary)]/20" />

                  <p className="ms-lens-label absolute top-1.5 md:top-2 left-0 right-0 text-center font-mono text-[6px] md:text-[8px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/65">
                    ZONE 01 / NOSE
                  </p>

                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 md:pt-2">
                    <span className="ms-lens-value font-display text-sm md:text-2xl font-bold tracking-[-0.03em] text-[var(--color-ink-primary)]">
                      24/24
                    </span>
                    <span className="ms-lens-status font-mono text-[7px] md:text-[9px] uppercase tracking-[0.3em] mt-0.5 text-[#7DD3FC]">
                      OK
                    </span>
                  </div>

                  <div
                    className="ms-lens-scan absolute left-0 right-0 h-px opacity-0"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM HUD */}
          <div className="ms-hud-bottom absolute bottom-0 left-0 right-0 z-30 flex items-center gap-4 md:gap-8 px-5 md:px-10 py-4 md:py-5 border-t border-[var(--color-ink-primary)]/12">
            <div className="flex items-center gap-3 md:gap-4">
              {TIERS.map((tier, i) => (
                <div
                  key={tier.id}
                  className="flex items-center gap-1.5 md:gap-2"
                >
                  <div
                    data-tier-dot={i}
                    className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full border transition-all duration-300"
                    style={{
                      borderColor: "rgba(15,23,42,0.35)",
                      background: "transparent",
                    }}
                  />
                  <span className="hidden md:inline font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/55">
                    {tier.letter}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex-1 h-px bg-[var(--color-ink-primary)]/12 relative overflow-hidden">
              <div className="ms-progress-fill absolute inset-0 bg-[var(--color-amber-accent)] will-change-transform" />
            </div>

            <p className="hidden md:block font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--color-ink-secondary)]/55 whitespace-nowrap">
              NCAA / EASA / FAA / ISO 9001:2015
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
