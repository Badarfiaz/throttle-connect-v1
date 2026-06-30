"use client";
import { useState, useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAppSelector } from "@/app/redux/hooks";

export type NetworkingLead = {
  id: string;
  clubId: string;
  clubName: string;
  clubOwnerUid: string;
  clickerUid: string;
  clickerName: string;
  clickerEmail: string;
  clickerPhone: string;
  viewedAt?: unknown;
};

export function useNetworkingLeads() {
  const { user } = useAppSelector((s) => s.auth);
  const [leads, setLeads] = useState<NetworkingLead[]>([]);
  const [loading, setLoading] = useState(false);

  const recordLead = useCallback(
    async (data: { clubId: string; clubName: string; clubOwnerUid: string }) => {
      if (!user?.userId) return;
      // Don't record the club owner viewing their own club
      if (user.userId === data.clubOwnerUid) return;

      // Deduplicate within the browser session
      const sessionKey = `tc_club_lead_${data.clubId}_${user.userId}`;
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");

      try {
        await addDoc(
          collection(db, "networkingStores", data.clubId, "leads"),
          {
            clubId: data.clubId,
            clubName: data.clubName,
            clubOwnerUid: data.clubOwnerUid,
            clickerUid: user.userId,
            clickerName: user.name ?? "",
            clickerEmail: user.email ?? "",
            clickerPhone: user.phone ?? "",
            viewedAt: serverTimestamp(),
          },
        );
      } catch {
        // silently fail — don't block the user
      }
    },
    [user],
  );

  // Fetch leads for all of the owner's clubs in parallel
  const fetchLeads = useCallback(
    async (clubIds: string[]) => {
      if (!user?.userId || clubIds.length === 0) return;
      setLoading(true);
      try {
        const snaps = await Promise.all(
          clubIds.map((id) =>
            getDocs(collection(db, "networkingStores", id, "leads")),
          ),
        );
        const all: NetworkingLead[] = [];
        snaps.forEach((snap) => {
          snap.docs.forEach((d) =>
            all.push({ id: d.id, ...(d.data() as Omit<NetworkingLead, "id">) }),
          );
        });
        // Sort newest first
        all.sort((a, b) => {
          const at = (a.viewedAt as any)?.seconds ?? 0;
          const bt = (b.viewedAt as any)?.seconds ?? 0;
          return bt - at;
        });
        setLeads(all);
      } catch {
        setLeads([]);
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  return { recordLead, leads, loading, fetchLeads };
}
