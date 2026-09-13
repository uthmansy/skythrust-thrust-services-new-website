# ScrollTrigger + Sticky Sections: Fast-Scroll Artifacts

**Document type:** Post-mortem / debugging reference  
**Stack:** Next.js 15 · GSAP 3 · ScrollTrigger · SplitType · Lenis  
**Pattern:** Sticky-stacked full-viewport scenes with enter/exit choreography  
**Date:** Reference doc

---

## 1. Symptom

On fast scroll (mouse-wheel fling or trackpad inertial scroll), one or more of the following occurred:

| Symptom                                                                                                       | Frequency                         |
| ------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| Enter animations never play — section shows only the eyebrow or partial content                               | Intermittent                      |
| Exit animations leave elements half-faded on-screen                                                           | Intermittent                      |
| Content "leaks" through the next scene (double-text soup)                                                     | Intermittent                      |
| Scrolling back up and down again does not fix the state — the section is permanently broken until page reload | Persistent after first occurrence |
| On slow scroll, everything works perfectly                                                                    | —                                 |

The intermittency was the diagnostic clue: **state-dependent behavior that depended on frame timing, not scroll position**.

---

## 2. Architecture Context

The site uses a **sticky-scene stack**:

```tsx
<main>
  <SharedBackdrop /> {/* fixed inset-0 */}
  <Scene id="hero" z={1}>
    …
  </Scene>{" "}
  {/* sticky top-0 h-screen */}
  <Scene id="about" z={2}>
    …
  </Scene>
  <Scene id="capabilities" z={3}>
    …
  </Scene>
  <Scene id="footprint" z={4}>
    …
  </Scene>
</main>
```

Each scene:

- Wraps content in a `position: sticky; top: 0; height: 100vh` element
- Uses **real-time enter** triggered by its own top entering the viewport
- Uses **scrubbed exit** triggered by the _next_ scene's top entering the viewport

Smooth scroll is provided by **Lenis**, driven by **GSAP's ticker**, with `ScrollTrigger.update` wired into Lenis's `scroll` event.

---

## 3. Root Causes

Five independent issues compounded. Each one on its own might be tolerable; together, they produced the observed failures.

### 3.1 Double RAF — Lenis driven by two loops

`ReactLenis` defaults `autoRaf: true`, meaning it starts its own `requestAnimationFrame` loop to advance its internal state. The project also added a GSAP-ticker-driven RAF:

```tsx
const tick = (time: number) => lenis.raf(time * 1000);
gsap.ticker.add(tick);
```

Two RAFs calling `lenis.raf()` per frame → Lenis was advanced **twice per frame** at unpredictable offsets, feeding inconsistent scroll positions into `ScrollTrigger.update()`. This is a well-known Lenis + GSAP footgun.

**Fix:** `autoRaf={false}` on `<ReactLenis>` and let GSAP's ticker be the only driver.

---

### 3.2 `kill()` permanently destroys timelines

`gsap.timeline.kill()` is not "stop" — it is "destroy". Once called:

- All child tweens are removed from the global timeline
- All inline styles remain stuck at their last-applied values
- The timeline cannot be `.play()`ed or `.reverse()`ed again

The exit trigger was calling `enterTl.kill()` in its `onEnter` to "hand off" control:

```tsx
onEnter: () => {
  enterTl.kill(); // 💥 permanent destruction
};
```

On fast scroll, this fired before the enter had fully played. Elements stopped mid-animation. On subsequent scrolls, `enterTl.play()` was a no-op because the timeline was empty.

**Fix:** Use `enterTl.progress(1).pause()` — jump the enter to its completed state and pause it. The timeline remains alive and reusable.

---

### 3.3 `overwrite: "auto"` created orphaned targets

The enter and exit timelines shared DOM targets (`.about-title-line`, `.about-stat`, etc.). Both were configured with `overwrite: "auto"` so each new tween killed the previous one on the same target.

During fast scroll:

1. Enter tween starts on `.about-title-line`
2. Exit tween starts (kills enter tween on that target)
3. Exit tween is scrubbed to `progress: 0` (because scroll is between exit start and end)
4. The target now has **no owner** — inline styles from the killed tween persist

The result: elements stuck at partial opacity, or reverted to a from-state that was never intended to be visible.

**Fix:** Replace all `overwrite: "auto"` with explicit `fromTo()` + `immediateRender: false` on the exit timeline. Also, drive timelines manually via `ScrollTrigger.create` + `onUpdate` callbacks instead of `toggleActions` + `scrub` combined.

---

### 3.4 Scrubbed triggers on sticky elements miscalculate

`position: sticky` elements **never reach their natural layout position** once stuck. ScrollTrigger's default trigger-position math computes `start` / `end` from `element.offsetTop + element.offsetHeight`, but a sticky element's offsetTop is its pre-stick position — while its visual position is pinned at `top: 0`.

The result: an enter trigger with `scrub: true` on a sticky scene frequently reads a `start` position _already passed_ on page load, so the scrub sits at `progress: 1` before the user scrolls, then never re-evaluates.

**Fix:** Never use `scrub` on a trigger whose element is `position: sticky`. Use **real-time callbacks** (`onEnter` / `onLeave` / `onLeaveBack`) for enter, and use `scrub` only on triggers pointing to a **different, non-sticky** element (like the next scene).

---

### 3.5 Fast scroll skips trigger boundaries

ScrollTrigger evaluates triggers on each tick of GSAP's ticker (≈60 Hz). With Lenis interpolation and fast flings, `scrollY` can jump **200–400 px between ticks**. If a trigger's `[start, end]` window is shorter than that jump, the boundary is crossed between ticks and the associated callback may not fire.

Combined with issue 3.2 (where a missed callback left a timeline in a destroyed state), this is why the failure only manifested under fast scroll.

**Fix:** Two-fold:

- Use `fastScrollEnd: true` on triggers (forces callbacks to fire even on fling)
- Wire `lenis.on("scroll", ScrollTrigger.update)` so ScrollTrigger sees every scroll delta Lenis emits, not just ticker samples

---

## 4. The Solution Pattern

The reliable architecture for sticky scenes with enter + exit:

```tsx
// 1. Two paused timelines — built once, never destroyed
const enterTl = gsap.timeline({ paused: true });
enterTl.fromTo(".target", { fromState }, { toState /* ... */ });

const exitTl = gsap.timeline({ paused: true });
exitTl.fromTo(
  ".target",
  { fromState },
  { toState, immediateRender: false } // ← critical for scrubbed exits
);

// 2. Enter trigger — real-time callbacks, no scrub
ScrollTrigger.create({
  trigger: el, // sticky scene element
  start: "top 70%",
  onEnter: () => enterTl.play(),
  onLeaveBack: () => enterTl.reverse(),
});

// 3. Exit trigger — scrubbed, driven by NEXT scene, with handoff
const next = document.getElementById("next-scene");
if (next) {
  ScrollTrigger.create({
    trigger: next, // NON-sticky next scene
    start: "top 80%",
    end: "top 45%",
    scrub: 0.5,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      // Force-complete the enter before scrubbing the exit
      if (enterTl.progress() < 1) {
        enterTl.progress(1).pause();
      }
      exitTl.progress(self.progress);
    },
  });
}
```

### Why each piece matters

| Element                            | Purpose                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `paused: true`                     | Timelines exist but don't auto-play. We control them explicitly.                                                    |
| `fromTo` on exit                   | Explicit from-values prevent ScrollTrigger from "capturing" the current DOM state (which may be mid-enter).         |
| `immediateRender: false`           | Prevents the from-state from being applied at build time. Only applies when the scrubbed timeline actually renders. |
| `onEnter` / `onLeaveBack` on enter | Real-time callbacks fire reliably on scroll boundary crossing. Not affected by sticky positioning.                  |
| `trigger: next` on exit            | The next scene is a normal (non-sticky) sibling — its offsets are predictable.                                      |
| `scrub: 0.5`                       | Halves lag between scroll and timeline progress — catches up before user overshoots.                                |
| `onUpdate` handoff                 | Guarantees that only one timeline writes to shared targets at any given frame. Eliminates race conditions.          |
| `fastScrollEnd: true`              | Ensures callbacks fire even when scroll velocity skips the trigger window.                                          |

---

## 5. Diagnostic Checklist

When a scroll-driven animation misbehaves, check in this order:

### 5.1 Verify single RAF driver

```js
// In browser console
gsap.ticker._tickFunctions?.length;
```

If this is `> 1` and any of them call `lenis.raf`, you have a double-RAF. Set `autoRaf={false}`.

### 5.2 Verify ScrollTrigger knows about Lenis

```js
// In browser console
ScrollTrigger.getAll().forEach((t) => console.log(t.start, t.end, t.progress));
```

If `start` or `end` are near `0` or `100`, ScrollTrigger is reading the wrong scroll container or the trigger element has zero height.

### 5.3 Verify trigger positions are stable

Scroll to load. Watch the console for `ScrollTrigger.refresh()` calls. If a refresh fires **after** the initial paint (from a font swap or image load), all cached positions are invalid — every trigger needs rebuilding.

Fix: `ScrollTrigger.refresh()` once after `document.fonts.ready` + `window.load`.

### 5.4 Verify timelines are alive

```js
// In browser console — after scrolling fast past a section
window.__debugEnterTl?.progress(); // should be 1, not undefined
```

If you get `undefined` or a size-zero timeline, a `.kill()` was called. Grep your code for `.kill()`.

### 5.5 Verify callbacks fire on fast scroll

Add temporary logging:

```js
ScrollTrigger.create({
  // ...
  onEnter: () => console.log("ENTER fired"),
  onLeave: () => console.log("LEAVE fired"),
  onUpdate: (self) => console.log("update", self.progress),
});
```

Fast-scroll. If "ENTER fired" never logs, either `fastScrollEnd` is missing or the trigger is being clobbered by a parent trigger's `refresh`.

---

## 6. Anti-Patterns (Do Not Do)

| ❌ Anti-pattern                                                         | Why it breaks                                                                                       |
| ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `timeline.kill()` in a scroll callback                                  | Destroys the timeline permanently. Content cannot recover on scroll-back.                           |
| `overwrite: "auto"` on scrubbed tweens                                  | Kills real-time tweens mid-flight, orphaning their target state.                                    |
| `scrub: true` on a `position: sticky` element                           | ScrollTrigger's offset math is invalid for sticky. Use real-time callbacks instead.                 |
| `toggleActions: "play reverse play reverse"` on enter + `scrub` on exit | Creates reverse-direction races — the enter may play backward while the exit plays forward.         |
| Two RAF loops calling `lenis.raf()`                                     | Lenis state desyncs from ScrollTrigger. Always pair `autoRaf={false}` with a single ticker.         |
| Manual `ScrollTrigger.refresh()` inside a scroll event                  | Triggers a re-calculation loop. Refresh only on layout-affecting events (resize, font load).        |
| Multiple `gsap.context()` for the same scene                            | Two contexts = two teardown graphs. If one reverts, it wipes the other's tweens. Use one per scene. |

---

## 7. Reference Implementation

Complete, battle-tested pattern for a scene with enter + exit:

```tsx
"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function MyScene({ nextId }: { nextId: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // ── Enter timeline (paused) ──────────────────────────────
      const enterTl = gsap.timeline({ paused: true });
      enterTl
        .fromTo(
          ".s-eyebrow",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 }
        )
        .fromTo(
          ".s-title",
          { opacity: 0, y: 60 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.3"
        )
        .fromTo(
          ".s-row",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          "-=0.4"
        );

      // ── Exit timeline (paused) ───────────────────────────────
      const exitTl = gsap.timeline({ paused: true });
      exitTl
        .fromTo(
          ".s-eyebrow",
          { opacity: 1, y: 0 },
          { opacity: 0, y: -20, duration: 0.5, immediateRender: false }
        )
        .fromTo(
          ".s-title",
          { opacity: 1, y: 0 },
          { opacity: 0, y: -60, duration: 0.7, immediateRender: false },
          0.05
        )
        .fromTo(
          ".s-row",
          { opacity: 1, y: 0 },
          {
            opacity: 0,
            y: -40,
            duration: 0.6,
            stagger: 0.06,
            immediateRender: false,
          },
          0.15
        );

      // ── Enter trigger ───────────────────────────────────────
      ScrollTrigger.create({
        trigger: el,
        start: "top 70%",
        onEnter: () => enterTl.play(),
        onLeaveBack: () => enterTl.reverse(),
      });

      // ── Exit trigger (scrubbed by next scene) ───────────────
      const next = document.getElementById(nextId);
      if (next) {
        ScrollTrigger.create({
          trigger: next,
          start: "top 80%",
          end: "top 45%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (enterTl.progress() < 1) enterTl.progress(1).pause();
            exitTl.progress(self.progress);
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [nextId]);

  return <div ref={ref}>...</div>;
}
```

---

## 8. Commit Checklist

Before shipping any scroll-driven section, confirm:

- [ ] Lenis has `autoRaf={false}` if driven by GSAP ticker
- [ ] `gsap.ticker.lagSmoothing(0)` is set in the Lenis provider
- [ ] `lenis.on("scroll", ScrollTrigger.update)` is wired
- [ ] `ScrollTrigger.refresh()` runs once after `document.fonts.ready` + `window.load`
- [ ] No `.kill()` calls in scroll callbacks — use `.progress(1).pause()`
- [ ] No `overwrite: "auto"` on scrubbed timelines
- [ ] Enter timeline uses `toggleActions` or explicit `onEnter`/`onLeaveBack` — never `scrub` on a sticky element
- [ ] Exit timeline uses `scrub` on a **non-sticky** trigger element (the next scene)
- [ ] Exit trigger has `fastScrollEnd: true`
- [ ] Exit `onUpdate` completes enter via `progress(1).pause()` before scrubbing
- [ ] Each scene wraps its GSAP work in a single `gsap.context()` scoped to its root
- [ ] Full end-to-end test: fast fling down, fast fling up, mixed directions, reload mid-scroll

---

## 9. Related Reading

- GSAP ScrollTrigger docs: `fastScrollEnd`, `invalidateOnRefresh`, `scrub`
- Lenis docs: `ReactLenis` `autoRaf`, `raf(time)` signature, `on("scroll")`
- GSAP `.kill()` vs `.pause()` vs `.progress(1)` — the distinction is documented but easy to miss
- `position: sticky` + ScrollTrigger — widely reported offset issue; treat sticky elements as "never a scrub trigger"

---

_End of document._
