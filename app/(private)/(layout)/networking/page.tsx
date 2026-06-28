"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Club } from "@/types/main";
import ClubCard from "@/components/networking/ClubsCard";
import HeroSection from "@/components/shared/HeroSection";
import PrimaryCarousel from "@/components/shared/PrimaryCarousel";
import RegistureClubBanner from "@/components/shared/RegistureClubBanner";
import Title from "@/components/shared/Title";
import ProfileRequiredBanner from "@/components/networking/ProfileRequiredBanner";
import UpcomingEventsSection from "@/components/networking/UpcomingEventsSection";
import { Compass, Wrench, Trophy, ShieldCheck, Users, CalendarDays, Image as ImageIcon, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import NetworkingCategoryGrid from "@/components/networking/NetworkingCategoryGrid";


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

  const customClubStartData = [
    {
      icon: Users,
      title: "Roster Control",
      description: "Review and approve membership requests to build a verified circle of riders.",
    },
    {
      icon: CalendarDays,
      title: "Plan Events",
      description: "Host track days, cafe meets, long-distance breakfast runs, and invite peers.",
    },
    {
      icon: Trophy,
      title: "Show Awards",
      description: "Add awards, milestones, and credentials to showcase on your profile page.",
    },
    {
      icon: ImageIcon,
      title: "Run Moments",
      description: "Share snapshot galleries of your club moments with a 10-image gallery limit.",
    },
  ];

  return (
    <div>
      <HeroSection
        title="Your Next Adventure Awaits"
        subtitle="Join a club that matches your passion and make unforgettable memories."
        ctaText="Get Started"
      />

      <ProfileRequiredBanner />

      {/* Global Discussion Channel Banner */}
      <div className="max-w-5xl mx-auto px-6 mt-8">
        <div className="bg-gradient-to-r from-[#0B2447] via-[#19376D] to-[#0F4C75] rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-305 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              New Feature
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Global Discussion Channel</h3>
            <p className="text-sm text-blue-105 text-blue-100 max-w-xl leading-relaxed">
              Ask questions about parts, recommend services, share photos of your car or bike, and connect instantly with the entire community.
            </p>
          </div>
          <Link href="/networking/discussion" className="relative z-10 w-full md:w-auto shrink-0">
            <Button className="w-full md:w-auto bg-white hover:bg-blue-50 text-[#0B2447] h-12 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-md">
              Join Discussion <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

 

      <div className="max-w-5xl mt-12 mx-auto px-6">
        <NetworkingCategoryGrid />
      </div>

      {/* Redesigned Club Benefits Section */}
      <section className="bg-slate-50/50 text-slate-900 py-16 px-6 relative overflow-hidden border-y border-slate-100">
        <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
          <div className="text-center mb-12 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Why Join an Automotive Club?</h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
              Unlock the full automotive experience. Connect with local communities that match your driving passion and style.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition duration-300">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Compass className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Weekly Breakfast Runs</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Enjoy planned morning runs, scenic weekend trips, multi-day tours, and coffee meetups with fellow riders.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition duration-300">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Wrench className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Collective Tech Knowledge</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Get first-hand vehicle maintenance reviews, help with parts sourcing, tuning discussions, and DIY assistance.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition duration-300">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-purple-500/10 text-purple-650 flex items-center justify-center">
                <Trophy className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Awards & Trophy Wall</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Win recognition, post club achievements, list certificates, and celebrate custom community milestones.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition duration-300">
              <div className="shrink-0 w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Disciplined Safe Riding</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Participate in verified automotive circles that practice strict safety measures, road discipline, and organization.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    

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
        title="Start Your Own Automotive Chapter"
        description="Have a crew or want to lead the pack? Register your club, schedule weekend runs, moderate membership requests, and share milestones with a polished gallery moments view."
        ctaButton1="Register Your Club"
        cardData={customClubStartData}
      />
   <UpcomingEventsSection />


    </div>
  );
}

export default Home;
