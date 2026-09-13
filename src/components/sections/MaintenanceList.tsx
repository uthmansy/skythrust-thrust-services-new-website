"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MaintenanceList({ checks }: { checks: any[] }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!listRef.current || checks.length === 0) return;

    const cards = listRef.current.querySelectorAll(".maintenance-card");

    // Animate cards fading up and sliding into place
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15, // Each card follows the previous one
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 75%",
        },
      }
    );
  }, [checks]);

  return (
    <div
      ref={listRef}
      className="w-full max-w-2xl border border-accent-tech/20 p-6 rounded-lg bg-bg-secondary/50 backdrop-blur-sm"
    >
      {checks.length > 0 ? (
        <div className="space-y-4">
          {checks.map((check) => (
            <div
              key={check.id}
              className="maintenance-card border-b border-white/5 pb-3"
            >
              <h3 className="text-xl text-text-luxury">{check.title}</h3>
              <p className="text-accent-luxury font-mono text-xs uppercase tracking-widest">
                Level: {check.checkLevel}-Check
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-text-tech italic text-center">
          No maintenance data found. Go to /admin to create one.
        </p>
      )}
    </div>
  );
}
