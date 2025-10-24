"use client";
import ClubCard from "@/components/networking/ClubsCard";
import CategorySection from "@/components/shared/CategorySection";
import FeaturedSection from "@/components/shared/FeaturedSection";
import HeroSection from "@/components/shared/HeroSection";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
import Title from "@/components/shared/Title";

import { clubs, vehicleCategories } from "@/dummydata/networking";

function home() {
  return (
    <div>
      <HeroSection
        title="Your Next Adventure Awaits"
        subtitle="Join a club that matches your passion and make unforgettable memories."
        ctaText="Get Started"
        onCtaClick={() => alert("Let's go!")}
      />

      <div className="max-w-5xl mt-20 mx-auto px-6">
        {/* Section Heading */}
        <Title
          title="Explore Categories"
          description="Discover your next ride — from elegant sedans to powerful superbikes"
        />
      </div>

      <div className="p-20 pt-0 pb-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {vehicleCategories.map((category) => (
          <CategorySection key={category.id} items={category} />
        ))}
      </div>

      <FeaturedSection />

      <div className="bg-background text-text py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <Title
            title="Discover Clubs"
            description="Explore our thriving network of automotive clubs — from off-roaders
            to superbikes."
          />

          {/* 🚗 Shadcn Carousel */}
          <PrimaryCarousel
            items={clubs}
            multiple={3}
            renderItem={(club) => <ClubCard club={club} />}
          />
        </div>
      </div>
      <RegistureClubBanner
        title="Join the Throttle Connect Club Network"
        description="Whether you’re looking to register your own club or discover new
            ones, we’ve got you covered. Connect with auto enthusiasts, explore
            meetups, and grow your community."
        ctaButton1="Register Club"
        ctaButton2="Find a Club"
      />
    </div>
  );
}

export default home;
