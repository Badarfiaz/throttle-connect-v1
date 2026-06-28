"use client";

import {
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MapPin, Users2, ChevronRight, User } from "lucide-react";
import { Club, CategoryType } from "@/types/main";
import AnimateMotion from "../shared/AnimateMotion";
import Link from "next/link";
import { FeaturedBadge } from "@/components/admin/FeaturedBadge";

interface ClubCardProps {
  club: Club;
  isLandingPage?: boolean;
}

const ClubCard = ({ club, isLandingPage }: ClubCardProps) => {
  // Map category to styles
  const categoryStyles: Record<CategoryType, string> = {
    sedans: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    hatchbacks: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    "super-cars": "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    offroad: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    bikes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    "electric-bikes": "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    superbikes: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    cruisers: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    "vespa-scooter": "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    "sports-car": "bg-rose-500/10 text-rose-600 border-rose-500/20",
    "diy-tools": "bg-orange-500/10 text-orange-600 border-orange-500/20",
    wrench: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    "racing-flag": "bg-neutral-800/10 text-neutral-800 border-neutral-800/20",
    jeep: "bg-amber-800/10 text-amber-800 border-amber-800/20",
    "electric-car": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    "vintage-car": "bg-amber-600/10 text-amber-700 border-amber-600/20",
    "electric-bike": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "cafe-racer": "bg-red-800/10 text-red-800 border-red-800/20",
    "modified-bike": "bg-violet-500/10 text-violet-600 border-violet-500/20",
  };

  const badgeStyle = categoryStyles[club.categoryType] || "bg-slate-500/10 text-slate-600 border-slate-500/20";

  return (
    <AnimateMotion
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="h-full"
    >
      <Card
        className="group relative h-full flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300"
      >
        {/* Banner Image Section */}
        <div className="relative w-full h-44 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={club.image || "/images/category/offroad.webp"}
            alt={club.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Category Tag overlay on top of banner */}
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border backdrop-blur-sm ${badgeStyle}`}>
              {club.categoryType.replace("-", " ")}
            </span>
          </div>
        </div>

        {/* Overlapping Club Logo & Info Section */}
        <div className="relative px-5 pt-0 pb-4 flex-grow flex flex-col justify-between">
          <div>
            {/* Club Logo Avatar overlap */}
            <div className="relative -mt-10 mb-4 inline-block z-10">
              <div className="size-20 rounded-2xl border-4 border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-md flex items-center justify-center">
                {club.logoUrl ? (
                  <img
                    src={club.logoUrl}
                    alt={`${club.name} logo`}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="size-full bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center font-bold text-xl uppercase">
                    {club.name.split(" ").filter(Boolean).slice(0, 2).map((w: string) => w[0].toUpperCase()).join("")}
                  </div>
                )}
              </div>
            </div>

            {/* Club Identity */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1 leading-snug flex-1">
                  {club.name}
                </h3>
                {club.featured && <FeaturedBadge featured={true} />}
              </div>
              <p className="text-sm text-slate-550 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {club.description}
              </p>
            </div>
          </div>

          {/* Quick Stats & Metadata */}
          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="size-4 text-slate-400 shrink-0" />
              <span className="truncate dark:text-slate-400">{club.location}</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
              <Users2 className="size-4 text-primary shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">{club.memberCount}</span>
            </div>
          </div>
        </div>

        {/* Card Actions Footer */}
        <CardFooter className="px-5 py-4 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Created By</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate max-w-[140px]">
              {club.createdBy.split("@")[0]}
            </p>
          </div>
          
          <Link href={`/networking/Club-Profile/${club.id}`} className="shrink-0">
            <Button size="sm" variant="default" className="rounded-xl bg-[#0B2447] hover:bg-[#19376D] text-white font-semibold transition-all shadow-xs hover:shadow-md flex items-center gap-1 cursor-pointer">
              View Club <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </AnimateMotion>
  );
};

export default ClubCard;
