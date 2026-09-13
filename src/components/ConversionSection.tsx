"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ConversionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Form Fields "Drawing" Reveal
      const fields = gsap.utils.toArray<HTMLElement>(".form-field");

      gsap.fromTo(
        fields,
        { y: 40, opacity: 0, scaleX: 0.95 },
        {
          y: 0,
          opacity: 1,
          scaleX: 1,
          duration: 1,
          stagger: 0.1,
          ease: "var(--ease-physics-out)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // 2. Magnetic Button Physics
      const btn = buttonRef.current;
      if (!btn) return;

      const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = btn.getBoundingClientRect();

        // Calculate distance from cursor to center of button
        const x = clientX - (left + width / 2);
        const y = clientY - (top + height / 2);

        // Move button towards cursor (magnetic pull)
        xTo(x * 0.3);
        yTo(y * 0.3);
      };

      const handleMouseLeave = () => {
        // Spring back to origin
        xTo(0);
        yTo(0);
      };

      btn.addEventListener("mousemove", handleMouseMove);
      btn.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        btn.removeEventListener("mousemove", handleMouseMove);
        btn.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-[8vw] py-[15vh] bg-gradient-to-b from-[var(--color-void)] to-[#0a0f1c]"
    >
      {/* Ambient background glow for the form */}
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[500px] h-[500px] bg-[var(--color-amber-flare)]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* Left: Copy */}
        <div className="flex flex-col justify-center">
          <p className="font-mono text-[var(--color-amber-flare)] text-sm tracking-widest uppercase mb-6">
            // 05. Terminal Conversion
          </p>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[var(--color-titanium)] mb-8 leading-[1.1]">
            Secure Your Fleet's
            <br />
            <span className="text-gray-500">Next Check.</span>
          </h2>
          <p className="font-sans text-lg text-gray-400 leading-relaxed max-w-md mb-12">
            Partner with Sky Thrust Services for transparent turnaround times
            and certified engineering rigor.
          </p>

          <div className="space-y-4 font-mono text-sm text-gray-500">
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-amber-flare)]" />
              Kano & Abuja Facilities Active
            </p>
            <p className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--color-amber-flare)]" />
              24/7 AOG Response Team
            </p>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-[var(--color-glass-sheen)] border border-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-12 shadow-2xl">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="form-field space-y-2">
              <label className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                Airline / Operator Name
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-white/10 py-3 text-[var(--color-titanium)] focus:outline-none focus:border-[var(--color-amber-flare)] transition-colors duration-300"
                placeholder="e.g. Sky Thrust Aviation"
              />
            </div>

            <div className="form-field space-y-2">
              <label className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                Aircraft Type
              </label>
              <input
                type="text"
                className="w-full bg-transparent border-b border-white/10 py-3 text-[var(--color-titanium)] focus:outline-none focus:border-[var(--color-amber-flare)] transition-colors duration-300"
                placeholder="e.g. Boeing 737-800"
              />
            </div>

            <div className="form-field space-y-2">
              <label className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                Service Required
              </label>
              <select className="w-full bg-transparent border-b border-white/10 py-3 text-[var(--color-titanium)] focus:outline-none focus:border-[var(--color-amber-flare)] transition-colors duration-300 appearance-none">
                <option className="bg-[var(--color-void)]">
                  A-Check Maintenance
                </option>
                <option className="bg-[var(--color-void)]">
                  C-Check Heavy Maintenance
                </option>
                <option className="bg-[var(--color-void)]">
                  Component Overhaul
                </option>
                <option className="bg-[var(--color-void)]">
                  Spares Procurement
                </option>
              </select>
            </div>

            <div className="form-field space-y-2">
              <label className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                Direct Contact Email
              </label>
              <input
                type="email"
                className="w-full bg-transparent border-b border-white/10 py-3 text-[var(--color-titanium)] focus:outline-none focus:border-[var(--color-amber-flare)] transition-colors duration-300"
                placeholder="ops@airline.com"
              />
            </div>

            {/* The Magnetic Submit Button */}
            <div className="pt-6">
              <button
                ref={buttonRef}
                type="submit"
                className="group relative px-10 py-5 bg-[var(--color-amber-flare)] text-[var(--color-void)] font-semibold tracking-wide uppercase overflow-hidden will-change-transform"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Initiate Service Request
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </span>
                {/* Hover shine effect */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
