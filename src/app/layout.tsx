import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import ScrollTriggerRefresh from "@/components/ScrollTriggerRefresh";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Sky Thrust Services | Precision Aviation",
  description: "Heavy Maintenance & Elite Aircraft Brokerage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        {/* Runs BEFORE hydration and BEFORE first paint.
            Disables scroll restoration + forces scrollY to 0 so
            every ScrollTrigger computes from a clean position. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if ('scrollRestoration' in history) {
                  history.scrollRestoration = 'manual';
                }
                window.scrollTo(0, 0);
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[var(--color-void)] text-[var(--color-titanium)] overflow-x-hidden">
        <LenisProvider>
          <Preloader />
          <CustomCursor />
          {children}
          <ScrollTriggerRefresh />
        </LenisProvider>
      </body>
    </html>
  );
}
