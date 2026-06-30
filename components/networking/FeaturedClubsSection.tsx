"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Crown } from "lucide-react";

type FeaturedClub = {
  id: string;
  clubName: string;
  logoUrl?: string | null;
  createdAt?: string;
};

export default function FeaturedClubsSection() {
  const [clubs, setClubs] = useState<FeaturedClub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const q = query(
          collection(db, "networkingStores"),
          where("featured", "==", true),
          where("completed", "==", true),
        );
        const snap = await getDocs(q);
        const list = snap.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              clubName: data.clubName || "Unnamed Club",
              logoUrl: data.logoUrl || null,
              createdAt: data.createdAt || "",
            };
          })
          .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
        if (mounted) setClubs(list);
      } catch {
        if (mounted) setClubs([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && clubs.length === 0) return null;

  return (
    <section className="py-12  bg-[#D8E7ED] px-4 xs:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-xl shadow-sm shrink-0">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Clubs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Hand-picked automotive communities worth joining
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-6 overflow-x-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2.5 shrink-0">
                <div className="size-20 sm:size-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-3 -mx-4 px-4 xs:mx-0 xs:px-0 scrollbar-none snap-x snap-mandatory">
            {clubs.map((club) => (
              <Link
                key={club.id}
                href={`/networking/Club-Profile/${club.id}`}
                className="group flex flex-col items-center gap-2.5 shrink-0 snap-start"
              >
                <div className="relative size-20 sm:size-24 rounded-xl p-[3px] bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 shadow-md group-hover:shadow-lg transition-all duration-300 ease-out group-hover:scale-105">
                  <div className="size-full rounded-md bg-white dark:bg-slate-950 p-[3px]">
                    <div className="size-full rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      {club.logoUrl ? (
                        <img
                          src={club.logoUrl}
                          alt={club.clubName}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-bold text-[#19376D] dark:text-blue-400">
                          {club.clubName
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((w) => w[0]?.toUpperCase())
                            .join("")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 text-center max-w-[6.5rem] line-clamp-2 leading-snug group-hover:text-[#19376D] dark:group-hover:text-blue-400 transition-colors">
                  {club.clubName}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
