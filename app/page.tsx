"use client";
import HeroSection from "@/components/shared/HeroSection";

export default function Home() {
  return (
    <div>
      <HeroSection
        title="Zumar"
        subtitle="Hello"
        ctaText="Get Started"
        onCtaClick={() => alert("Let's go")}
        layout={2}
      />
    </div>
  );
}
 