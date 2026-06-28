"use client";
import { useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { format, subDays } from "date-fns";

export type ClubAnalyticsData = {
  totalViews: number;
  totalClicks: number;
  dailyViews: Record<string, number>;
};

export function last7DaysLabels(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), "yyyy-MM-dd"),
  );
}

export function useClubAnalytics(clubId: string | undefined) {
  const [data, setData] = useState<ClubAnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    if (!clubId) return;
    setLoading(true);
    try {
      const snap = await getDoc(doc(db, "clubAnalytics", clubId));
      setData(
        snap.exists()
          ? (snap.data() as ClubAnalyticsData)
          : { totalViews: 0, totalClicks: 0, dailyViews: {} },
      );
    } catch {
      setData({ totalViews: 0, totalClicks: 0, dailyViews: {} });
    } finally {
      setLoading(false);
    }
  }, [clubId]);

  const days = last7DaysLabels();
  const dailyAggregate = days.map((date) => ({
    date: format(new Date(date), "MMM d"),
    views: data?.dailyViews?.[date] ?? 0,
  }));

  return { data, loading, fetchAnalytics, dailyAggregate };
}
