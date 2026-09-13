"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function ScrollTriggerRefresh() {
  useEffect(() => {
    const ready = Promise.all([
      document.fonts.ready,
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      }),
    ]);

    ready.then(() => {
      // Ensure we're still at the top before refreshing
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
  }, []);

  return null;
}
