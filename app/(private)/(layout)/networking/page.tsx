"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Club } from "@/types/main";
import ClubCard from "@/components/networking/ClubsCard";
import FeaturedSection from "@/components/shared/FeaturedSection";
import HeroSection from "@/components/shared/HeroSection";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
import Title from "@/components/shared/Title";
import ProfileRequiredBanner from "@/components/networking/ProfileRequiredBanner";
import UpcomingEventsSection from "@/components/networking/UpcomingEventsSection";

import {
  cardDataNetworking,
  vehicleCategories,
} from "@/dummydata/networking";


function Home() {
  const [dbClubs, setDbClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "networkingStores"));
        const fetchedClubs: Club[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.completed) {
            fetchedClubs.push({
              id: doc.id,
              name: data.clubName || "Unnamed Club",
              categoryType: (data.clubType === "car" ? "sedans" : data.clubType === "bike" ? "bikes" : "offroad") as any,
              image: data.bannerUrl || "/images/category/offroad.webp",
              location: data.city || "Unknown Location",
              memberCount: 1,
              description: data.description || "No description provided.",
              createdBy: data.email || "Owner",
              logoUrl: data.logoUrl || "/images/category/offroad.webp",
            });
          }
        });
        setDbClubs(fetchedClubs);
      } catch (err) {
        console.error("Error fetching clubs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  return (
    <div>
      <HeroSection
        title="Your Next Adventure Awaits"
        subtitle="Join a club that matches your passion and make unforgettable memories."
        ctaText="Get Started"
      />

      <ProfileRequiredBanner />

 

      <div className="max-w-5xl mt-20 mx-auto px-6">
        {/* Section Heading */}
        <Title
          title="Explore Categories"
          description="Discover your next ride — from elegant sedans to powerful superbikes"
        />
      </div>

      <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-0 pb-0">
        <PrimaryCarousel
          items={vehicleCategories}
          responsive={{
            mobile: 2,
            tablet: 3,
            desktop: 4,
          }}
          className="w-full"
          renderItem={(category) => (
            <div className="w-full h-full">
              {/* <CategorySection key={category.id} items={category} /> */}
            </div>
          )}
        />
      </div>

      <FeaturedSection />
      {/* Upcoming Events Component */}
    

      <div className="bg-background text-text py-12 xs:py-16 px-4 xs:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6 xs:space-y-8">
          <Title
            title="Discover Clubs"
            description="Explore our thriving network of automotive clubs — from off-roaders to superbikes."
          />

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <p className="text-muted-foreground animate-pulse font-medium">Loading clubs...</p>
            </div>
          ) : dbClubs.length > 0 ? (
            <PrimaryCarousel
              items={dbClubs}
              responsive={{
                mobile: 1,
                tablet: 2,
                desktop: 3,
              }}
              renderItem={(club) => <ClubCard club={club} />}
            />
          ) : (
            <p className="text-muted-foreground text-sm py-10">No clubs registered yet.</p>
          )}
        </div>
      </div>
      <RegistureClubBanner
        cardData={cardDataNetworking}
      />
   <UpcomingEventsSection />


    </div>
  );
}

export default Home;
