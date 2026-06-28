"use client";
import { useState, useCallback } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useAppSelector } from "@/app/redux/hooks";

export type Lead = {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  storeOwnerUid: string;
  clickerUid: string;
  clickerName: string;
  clickerEmail: string;
  clickerPhone: string;
  clickedAt?: unknown;
};

export function useLeads() {
  const { user } = useAppSelector((s) => s.auth);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  const recordLead = useCallback(
    async (data: {
      productId: string;
      productName: string;
      productImage?: string;
      storeOwnerUid: string;
    }) => {
      if (!user?.userId) return;
      // Don't record a lead if the viewer is the store owner
      if (user.userId === data.storeOwnerUid) return;

      try {
        await addDoc(collection(db, "leads"), {
          ...data,
          clickerUid: user.userId,
          clickerName: user.name ?? "",
          clickerEmail: user.email ?? "",
          clickerPhone: user.phone ?? "",
          clickedAt: serverTimestamp(),
        });
      } catch {
        // silently fail — don't block the contact action
      }
    },
    [user],
  );

  const fetchLeads = useCallback(async () => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "leads"),
        where("storeOwnerUid", "==", user.userId),
        orderBy("clickedAt", "desc"),
      );
      const snap = await getDocs(q);
      setLeads(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) })),
      );
    } catch {
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { recordLead, leads, loading, fetchLeads };
}
