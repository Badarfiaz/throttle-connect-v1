"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Sparkles, MapPin } from "lucide-react";

type FeaturedEvent = {
  id: string;
  title: string;
  city?: string;
  locationName?: string;
  startDateTime: string;
  clubId: string;
  clubLogo?: string | null;
  clubName?: string;
};

export default function FeaturedEventsSection() {
  const router = useRouter();
  const [events, setEvents] = useState<FeaturedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("featured", "==", true),
          where("status", "==", "upcoming"),
        );
        const snap = await getDocs(q);
        const list = snap.docs
          .map((d) => {
            const data = d.data();
            return {
              id: d.id,
              title: data.title || "Untitled Event",
              city: data.city || data.location?.city || "",
              locationName: data.location?.name || "",
              startDateTime: data.startDateTime || "",
              clubId: data.clubId || "",
              clubLogo: data.clubLogo || null,
              clubName: data.clubName || "",
            };
          })
          .sort((a, b) => a.startDateTime.localeCompare(b.startDateTime));
        if (mounted) setEvents(list);
      } catch {
        if (mounted) setEvents([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && events.length === 0) return null;

  return (
    <section className="py-12  bg-[#D8E7ED] px-4 xs:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-xl shadow-sm shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Events
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Don&apos;t miss these hand-picked rides &amp; meets
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-72 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse shrink-0"
              />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 xs:mx-0 xs:px-0 scrollbar-none snap-x snap-mandatory">
            {events.map((event) => {
              const eventDate = new Date(event.startDateTime);
              const day = eventDate.getDate();
              const month = eventDate.toLocaleDateString([], { month: "short" }).toUpperCase();

              return (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => router.push(`/networking/Club-Profile/${event.clubId}`)}
                  className="group flex items-center gap-3 shrink-0 w-72 snap-start text-left rounded-2xl border border-amber-200/60 dark:border-amber-900/30 bg-gradient-to-r from-amber-50/80 to-white dark:from-amber-950/10 dark:to-slate-900 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 p-3.5 cursor-pointer"
                >
                  {/* Date chip */}
                  <div className="flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm px-2.5 py-1.5 shrink-0 min-w-[48px]">
                    <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider leading-none">
                      {month}
                    </span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white leading-none mt-1">
                      {day}
                    </span>
                  </div>

                  {/* Name + location */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{event.locationName || event.city || "TBA"}</span>
                    </div>
                  </div>

                  {/* Small club logo */}
                  <div className="shrink-0">
                    {event.clubLogo ? (
                      <img
                        src={event.clubLogo}
                        alt={event.clubName}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-150 dark:border-slate-800"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#19376D] to-[#0B2447] text-white flex items-center justify-center text-[10px] font-bold">
                        {event.clubName
                          ?.split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((w) => w[0]?.toUpperCase())
                          .join("") || "C"}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
