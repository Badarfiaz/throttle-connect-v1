"use client";
import ClubCard from "@/components/networking/ClubsCard";
import CategorySection from "@/components/shared/CategorySection";
import FeaturedSection from "@/components/shared/FeaturedSection";
import HeroSection from "@/components/shared/HeroSection";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
 
import { clubs } from "@/dummydata/networking";

function home() {
  return (
    <div>
          <HeroSection
            // layout={1}
            title="Your Next Adventure Awaits"
            subtitle="Join a club that matches your passion and make unforgettable memories."
            ctaText="Get Started"
            // imageSrc="/images/category/offroad.webp"
            onCtaClick={() => alert("Let's go!")}
          />
      <CategorySection />
    
                <FeaturedSection />

      <div className="bg-background text-text py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold text-primary">Discover Clubs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our thriving network of automotive clubs — from off-roaders
            to superbikes.
          </p>

          {/* 🚗 Shadcn Carousel */}
          <PrimaryCarousel
            items={clubs}
            multiple={3}
            renderItem={(club) => <ClubCard club={club} />}
          />

        </div>
      </div>
       <RegistureClubBanner />

    </div>
  );
}

export default home;
