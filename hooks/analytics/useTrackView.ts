"use client";
import { useCallback, useRef } from "react";
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { format } from "date-fns";

type AnalyticsCollection =
  | "storeAnalytics"
  | "productAnalytics"
  | "serviceAnalytics"
  | "clubAnalytics"
  | "eventAnalytics";

export function useTrackView(collection: AnalyticsCollection, entityId: string) {
  const tracked = useRef(false);

  const trackView = useCallback(
    async (visitorId?: string) => {
      if (tracked.current || !entityId) return;
      tracked.current = true;

      try {
        const ref = doc(db, collection, entityId);
        const today = format(new Date(), "yyyy-MM-dd");
        const existing = await getDoc(ref);

        // Check unique visitor within session
        const sessionKey = `tc_view_${collection}_${entityId}`;
        if (visitorId && sessionStorage.getItem(sessionKey) === visitorId) return;
        if (visitorId) sessionStorage.setItem(sessionKey, visitorId);

        if (existing.exists()) {
          await updateDoc(ref, {
            totalViews: increment(1),
            [`dailyViews.${today}`]: increment(1),
            lastViewedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } else {
          await setDoc(ref, {
            totalViews: 1,
            totalClicks: 0,
            uniqueVisitors: 0,
            dailyViews: { [today]: 1 },
            lastViewedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch {
        // silently fail — analytics should never break the UI
      }
    },
    [collection, entityId],
  );

  return { trackView };
}
