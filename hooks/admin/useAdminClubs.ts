"use client";
import { useState, useCallback } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";

export type AdminClub = {
  id: string;
  clubName?: string;
  ownerUid?: string;
  ownerName?: string;
  clubType?: string;
  city?: string;
  logoUrl?: string;
  bannerUrl?: string;
  featured?: boolean;
  memberCount?: number;
  createdAt?: string;
  views?: number;
  clicks?: number;
};

export function useAdminClubs() {
  const [clubs, setClubs] = useState<AdminClub[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "networkingStores"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: AdminClub[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AdminClub, "id">),
      }));
      setClubs(list);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch clubs";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (clubId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "networkingStores", clubId), { featured: !current });
      setClubs((prev) =>
        prev.map((c) => (c.id === clubId ? { ...c, featured: !current } : c)),
      );
      toast.success(`Club ${!current ? "featured" : "unfeatured"}`);
    } catch {
      toast.error("Failed to update featured status");
    }
  }, []);

  const deleteClub = useCallback(async (clubId: string) => {
    try {
      await deleteDoc(doc(db, "networkingStores", clubId));
      setClubs((prev) => prev.filter((c) => c.id !== clubId));
      toast.success("Club deleted");
    } catch {
      toast.error("Failed to delete club");
    }
  }, []);

  return { clubs, loading, error, fetchClubs, toggleFeatured, deleteClub };
}
