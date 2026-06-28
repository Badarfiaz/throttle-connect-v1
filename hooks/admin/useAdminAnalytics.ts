"use client";
import { useState, useCallback } from "react";
import { collection, getDocs, getCountFromServer } from "firebase/firestore";
import { db } from "@/firebase";

export type PlatformStats = {
  totalUsers: number;
  totalStores: number;
  totalClubs: number;
  totalEvents: number;
  totalProducts: number;
  totalServices: number;
  totalViews: number;
  totalClicks: number;
};

export type GrowthDataPoint = { month: string; count: number };

export function useAdminAnalytics() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalStores: 0,
    totalClubs: 0,
    totalEvents: 0,
    totalProducts: 0,
    totalServices: 0,
    totalViews: 0,
    totalClicks: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersSnap, storesSnap, clubsSnap, eventsSnap] = await Promise.all([
        getCountFromServer(collection(db, "users")),
        getCountFromServer(collection(db, "marketplaceStores")),
        getCountFromServer(collection(db, "networkingStores")),
        getCountFromServer(collection(db, "networkingEvents")),
      ]);

      // Aggregate views/clicks from storeAnalytics collection
      let totalViews = 0;
      let totalClicks = 0;
      let totalProducts = 0;
      let totalServices = 0;

      try {
        const analyticsSnap = await getDocs(collection(db, "storeAnalytics"));
        analyticsSnap.forEach((d) => {
          const data = d.data();
          totalViews += data.totalViews ?? 0;
          totalClicks += data.totalClicks ?? 0;
        });
      } catch {
        // analytics collection may not exist yet
      }

      // Count products via marketplaceStores subcollections would require collectionGroup
      // Use store data productsCount field if available as approximation
      const storesData = await getDocs(collection(db, "marketplaceStores"));
      storesData.forEach((d) => {
        const data = d.data();
        totalProducts += data.productsCount ?? 0;
        totalServices += data.servicesCount ?? 0;
      });

      setStats({
        totalUsers: usersSnap.data().count,
        totalStores: storesSnap.data().count,
        totalClubs: clubsSnap.data().count,
        totalEvents: eventsSnap.data().count,
        totalProducts,
        totalServices,
        totalViews,
        totalClicks,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch analytics";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, fetchStats };
}
