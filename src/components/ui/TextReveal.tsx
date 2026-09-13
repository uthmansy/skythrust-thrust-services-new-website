"use client";

import { createElement, useLayoutEffect, useRef, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  as?: string;
  animation?: "mask" | "stagger";
  delay?: number;
}

export default function TextReveal({
  children,
  className = "",
  as = "div",
  animation = "mask",
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  // FIX 1: useLayoutEffect runs synchronously before paint, preventing the visual "jump"
  useLayoutEffect(() => {
    if (!ref.current) return;

    // Split the text into lines or characters
    const split = new SplitType(ref.current, {
      types: animation === "mask" ? "lines" : "chars",
    });

    // FIX 2: gsap.context() scopes all animations to this component
    // This prevents StrictMode from creating duplicate animations that jump
    const ctx = gsap.context(() => {
      if (animation === "mask" && split.lines) {
        // Set initial state: hidden below the mask
        gsap.set(split.lines, { yPercent: 100 });

        gsap.to(split.lines, {
          yPercent: 0,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.1,
          delay,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true, // FIX 3: Only animate once. Prevents jumping when scrolling back up.
          },
        });
      } else if (animation === "stagger" && split.chars) {
        gsap.set(split.chars, { opacity: 0, y: 20 });

        gsap.to(split.chars, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.02,
          delay,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true, // FIX 3: Only animate once
          },
        });
      }
    }, ref); // Scope the context to this component's ref

    // Cleanup: Revert animations and restore original text when component unmounts
    return () => {
      ctx.revert();
      split.revert();
    };
  }, [animation, delay]);

  // FIX 4: Use createElement instead of JSX to avoid the TypeScript "never" error
  return createElement(as, { ref, className }, children);
}
