"use client";

export default function Scene({
  children,
  id,
  z = 1,
  hold = 0,
}: {
  children: React.ReactNode;
  id: string;
  z?: number;
  /** Extra scroll distance in viewport-heights. hold={4} = 500vh total. */
  hold?: number;
}) {
  if (hold === 0) {
    return (
      <section
        id={id}
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ zIndex: z }}
      >
        {children}
      </section>
    );
  }

  return (
    <section
      id={id}
      className="relative w-full"
      style={{ zIndex: z, height: `calc(100vh + ${hold * 100}vh)` }}
    >
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {children}
      </div>
    </section>
  );
}
