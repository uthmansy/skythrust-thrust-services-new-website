"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CursorState = "default" | "hover" | "view" | "drag" | "text";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Only render on fine-pointer, motion-permitted devices
  useEffect(() => {
    if (typeof window === "undefined") return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!coarse && !reduced) setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Hide native cursor
    document.documentElement.classList.add("has-custom-cursor");

    // Center all cursor layers via xPercent/yPercent; start off-screen
    gsap.set([dot, ring, label], {
      xPercent: -50,
      yPercent: -50,
      x: -200,
      y: -200,
    });

    // Fast dot, lagging ring + label
    const dotX = gsap.quickTo(dot, "x", { duration: 0.06, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.06, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.32, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.32, ease: "power3" });
    const labelX = gsap.quickTo(label, "x", { duration: 0.32, ease: "power3" });
    const labelY = gsap.quickTo(label, "y", { duration: 0.32, ease: "power3" });

    let lastX = -200;
    let lastY = -200;
    let currentState: CursorState = "default";

    // ─── Movement + velocity deformation ─────────────────────
    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      dotX(x);
      dotY(y);
      ringX(x);
      ringY(y);
      labelX(x);
      labelY(y);

      const dx = x - lastX;
      const dy = y - lastY;
      const speed = Math.min(Math.hypot(dx, dy), 60);

      // Fast movement → slight ring squash + elongation along motion axis
      if (currentState === "default" || currentState === "hover") {
        const scale = 1 - (speed / 60) * 0.18;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        gsap.set(ring, {
          scale,
          rotation: angle,
          rotate: angle,
        });
      }

      lastX = x;
      lastY = y;
    };

    // ─── State machine ───────────────────────────────────────
    const stateConfig: Record<
      CursorState,
      {
        ring: gsap.TweenVars;
        dot: gsap.TweenVars;
        label: { show: boolean; text?: string };
      }
    > = {
      default: {
        ring: {
          width: 34,
          height: 34,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.55)",
          backgroundColor: "rgba(255,255,255,0)",
          borderRadius: 9999,
        },
        dot: { opacity: 1, scale: 1 },
        label: { show: false },
      },
      hover: {
        ring: {
          width: 64,
          height: 64,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.85)",
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: 9999,
        },
        dot: { opacity: 0, scale: 0.4 },
        label: { show: false },
      },
      view: {
        ring: {
          width: 92,
          height: 92,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.9)",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: 9999,
        },
        dot: { opacity: 0, scale: 0.4 },
        label: { show: true, text: "VIEW" },
      },
      drag: {
        ring: {
          width: 92,
          height: 92,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.9)",
          backgroundColor: "rgba(255,255,255,0.12)",
          borderRadius: 9999,
        },
        dot: { opacity: 0, scale: 0.4 },
        label: { show: true, text: "DRAG" },
      },
      text: {
        ring: {
          width: 4,
          height: 30,
          borderWidth: 0,
          borderColor: "rgba(255,255,255,0)",
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: 2,
        },
        dot: { opacity: 0, scale: 0.4 },
        label: { show: false },
      },
    };

    const setState = (next: CursorState, customLabel?: string) => {
      if (next === currentState) return;
      currentState = next;

      const cfg = stateConfig[next];

      // Ring — reset rotation on state change so text-shape stays upright
      gsap.to(ring, {
        ...cfg.ring,
        rotation: 0,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.6)",
        overwrite: "auto",
      });

      // Dot
      gsap.to(dot, {
        ...cfg.dot,
        duration: 0.35,
        ease: "power3.out",
        overwrite: "auto",
      });

      // Label
      if (label) {
        if (cfg.label.show) {
          label.textContent = customLabel ?? cfg.label.text ?? "";
        }
        gsap.to(label, {
          opacity: cfg.label.show ? 1 : 0,
          scale: cfg.label.show ? 1 : 0.85,
          duration: 0.3,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    // ─── Event delegation (survives dynamic content) ─────────
    const resolveTarget = (t: EventTarget | null): Element | null =>
      (t as Element | null)?.closest?.(
        "[data-cursor], a, button, [role='button'], input, select, textarea"
      ) ?? null;

    const onPointerOver = (e: PointerEvent) => {
      const target = resolveTarget(e.target);
      if (!target) return;

      const attr = target.getAttribute("data-cursor") as CursorState | null;
      const customLabel = target.getAttribute("data-cursor-label") ?? undefined;

      if (attr === "text") setState("text");
      else if (attr === "view") setState("view", customLabel);
      else if (attr === "drag") setState("drag", customLabel);
      else setState("hover");
    };

    const onPointerOut = (e: PointerEvent) => {
      const target = resolveTarget(e.target);
      if (!target) return;
      // Ignore if moving to another cursor-aware element
      if (resolveTarget(e.relatedTarget)) return;
      setState("default");
    };

    // ─── Click squash ────────────────────────────────────────
    const onDown = () => {
      gsap.to(ring, {
        scale: 0.82,
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onUp = () => {
      gsap.to(ring, {
        scale: 1,
        duration: 0.45,
        ease: "back.out(3)",
        overwrite: "auto",
      });
    };

    // ─── Window leave / enter ────────────────────────────────
    const onDocLeave = () =>
      gsap.to([dot, ring, label], {
        opacity: 0,
        duration: 0.25,
        overwrite: "auto",
      });

    const onDocEnter = () =>
      gsap.to([dot, ring], { opacity: 1, duration: 0.35, overwrite: "auto" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onDocLeave);
    document.addEventListener("mouseenter", onDocEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onDocLeave);
      document.removeEventListener("mouseenter", onDocEnter);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Ring — context circle with size + label changes */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] will-change-transform mix-blend-difference"
        style={{
          width: 34,
          height: 34,
          borderRadius: 9999,
          border: "1px solid rgba(255,255,255,0.55)",
        }}
      />

      {/* Dot — tight center marker */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform mix-blend-difference"
        style={{
          width: 6,
          height: 6,
          borderRadius: 9999,
          background: "#fff",
        }}
      />

      {/* Label — appears inside VIEW / DRAG states */}
      <div
        ref={labelRef}
        className="pointer-events-none fixed top-0 left-0 z-[10000] flex items-center justify-center font-mono text-[10px] font-medium uppercase tracking-[0.25em] text-black opacity-0 will-change-transform"
      />
    </>
  );
}
