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

export type Lead = {
  id: string;
  productId: string;
  productTitle: string;
  storeOwnerUid: string;
  clickerUid: string;
  clickerName: string;
  clickerEmail: string;
  clickerPhone: string;
  viewedAt?: unknown;
};

export function useLeads() {
  const { user } = useAppSelector((s) => s.auth);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const recordLead = useCallback(
    async (data: {
      productId: string;
      productTitle: string;
      storeOwnerUid: string;
    }) => {
      if (!user?.userId) return;
      // Don't record the store owner viewing their own product
      if (user.userId === data.storeOwnerUid) return;

      // Deduplicate within the browser session
      const sessionKey = `tc_lead_${data.productId}_${user.userId}`;
      if (sessionStorage.getItem(sessionKey)) return;
      sessionStorage.setItem(sessionKey, "1");

      try {
        await addDoc(
          collection(db, "marketplaceProducts", data.productId, "leads"),
          {
            productId: data.productId,
            productTitle: data.productTitle,
            storeOwnerUid: data.storeOwnerUid,
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

  // Fetch leads for all of the owner's products in parallel
  const fetchLeads = useCallback(
    async (productIds: string[]) => {
      if (!user?.userId || productIds.length === 0) return;
      setLoading(true);
      try {
        const snaps = await Promise.all(
          productIds.map((id) =>
            getDocs(collection(db, "marketplaceProducts", id, "leads")),
          ),
        );
        const all: Lead[] = [];
        snaps.forEach((snap) => {
          snap.docs.forEach((d) =>
            all.push({ id: d.id, ...(d.data() as Omit<Lead, "id">) }),
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
