"use client";
import { useCallback } from "react";
import { doc, updateDoc, increment, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";

type AnalyticsCollection =
  | "storeAnalytics"
  | "productAnalytics"
  | "serviceAnalytics"
  | "clubAnalytics"
  | "eventAnalytics";

export function useTrackClick(collection: AnalyticsCollection, entityId: string) {
  const trackClick = useCallback(async () => {
    if (!entityId) return;
    try {
      const ref = doc(db, collection, entityId);
      const existing = await getDoc(ref);
      if (existing.exists()) {
        await updateDoc(ref, {
          totalClicks: increment(1),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(ref, {
          totalViews: 0,
          totalClicks: 1,
          uniqueVisitors: 0,
          dailyViews: {},
          updatedAt: serverTimestamp(),
        });
      }
    } catch {
      // silently fail
    }
  }, [collection, entityId]);

  return { trackClick };
}
