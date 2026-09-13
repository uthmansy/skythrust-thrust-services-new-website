import SharedBackdrop from "@/components/SharedBackdrop";
import Scene from "@/components/Scene";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import CapabilitiesSection from "@/components/CapabilitiesSection";
import MaintenanceSpectrum from "@/components/MaintenanceSpectrum";
import StrategicFootprint from "@/components/StrategicFootprint";
import SparesGrid from "@/components/SparesGrid";
import CharterSection from "@/components/CharterSection";

export default function Home() {
  return (
    <main className="relative">
      <SharedBackdrop />

      <Scene id="hero" z={1}>
        <HeroSection />
      </Scene>

      <Scene id="about" z={2}>
        <AboutSection />
      </Scene>

      <Scene id="capabilities" z={3}>
        <CapabilitiesSection />
      </Scene>

      {/* Renders its own <section> at 500vh — no <Scene> wrapper */}
      <MaintenanceSpectrum />
      <SparesGrid />
      <CharterSection />

      <Scene id="footprint" z={5}>
        <StrategicFootprint />
      </Scene>
    </main>
  );
}
