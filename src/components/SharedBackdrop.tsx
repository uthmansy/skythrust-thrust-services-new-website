"use client";

export default function SharedBackdrop() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* BASE COLOR — starts sky-base, morphs to #F1F5F9 during hero exit */}
      <div className="shared-bg absolute inset-0 bg-[var(--color-sky-base)]" />

      {/* AMBIENT GLOW — hero-only, blooms away during Beat 2 */}
      <div
        className="shared-ambient absolute left-1/2 bottom-[-15%] will-change-transform"
        style={{
          width: "150vw",
          height: "150vw",
          opacity: 0,
          transform: "translateX(-50%) scale(0.9)",
          background:
            "radial-gradient(circle at center, rgba(251,146,60,0.20) 0%, rgba(56,189,248,0.10) 32%, transparent 62%)",
        }}
      />

      {/* DOT GRID — hero-only, dissolves during Beat 2 */}
      <div
        className="shared-dot-grid absolute inset-0 will-change-transform"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(15,23,42,0.16) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(ellipse at 50% 50%, black 25%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 50%, black 25%, transparent 75%)",
        }}
      />

      {/* BLUEPRINT GRID — hidden at first, unfurls during Beat 2, persists for all following scenes */}
      <div
        className="shared-grid absolute inset-0 will-change-transform"
        style={{
          opacity: 0,
          clipPath: "inset(50% 0% 50% 0%)",
          backgroundImage: `
            linear-gradient(rgba(15,23,42,0.10) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.10) 1px, transparent 1px),
            linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
        }}
      />
    </div>
  );
}
