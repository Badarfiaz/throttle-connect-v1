"use client";
import { useState, useCallback } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { format, subDays } from "date-fns";

export type ProductAnalyticsData = {
  totalViews: number;
  totalClicks: number;
  dailyViews: Record<string, number>;
};

export type ProductAnalyticsEntry = {
  productId: string;
  productName: string;
} & ProductAnalyticsData;

export function last7DaysLabels(): string[] {
  return Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), "yyyy-MM-dd"),
  );
}

export function useProductAnalytics() {
  const [entries, setEntries] = useState<ProductAnalyticsEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = useCallback(
    async (products: { id: string; productName: string }[]) => {
      if (products.length === 0) return;
      setLoading(true);
      try {
        const snaps = await Promise.all(
          products.map((p) => getDoc(doc(db, "productAnalytics", p.id))),
        );
        const result: ProductAnalyticsEntry[] = products.map((p, i) => {
          const d = snaps[i];
          return d.exists()
            ? {
                productId: p.id,
                productName: p.productName,
                ...(d.data() as ProductAnalyticsData),
              }
            : {
                productId: p.id,
                productName: p.productName,
                totalViews: 0,
                totalClicks: 0,
                dailyViews: {},
              };
        });
        // Sort by most viewed
        result.sort((a, b) => b.totalViews - a.totalViews);
        setEntries(result);
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const totalViews = entries.reduce((s, e) => s + e.totalViews, 0);
  const totalClicks = entries.reduce((s, e) => s + e.totalClicks, 0);

  // Aggregate daily views across all products for the last 7 days
  const days = last7DaysLabels();
  const dailyAggregate = days.map((date) => ({
    date: format(new Date(date), "MMM d"),
    views: entries.reduce((s, e) => s + (e.dailyViews?.[date] ?? 0), 0),
  }));

  return { entries, loading, fetchAnalytics, totalViews, totalClicks, dailyAggregate };
}
