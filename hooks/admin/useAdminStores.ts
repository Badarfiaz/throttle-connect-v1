"use client";
import { useState, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";

export type AdminStore = {
  id: string;
  title?: string;
  ownerUid?: string;
  ownerName?: string;
  businessType?: string[];
  location?: { city?: string; country?: string };
  logoUrl?: string;
  bannerUrl?: string;
  slugUrl?: string;
  email?: string;
  phone?: string;
  featured?: boolean;
  completed?: boolean;
  createdAt?: string;
  views?: number;
  clicks?: number;
  productsCount?: number;
};

export function useAdminStores() {
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "marketplaceStores"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: AdminStore[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AdminStore, "id">),
      }));
      setStores(list);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch stores";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (storeId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "marketplaceStores", storeId), { featured: !current });
      setStores((prev) =>
        prev.map((s) => (s.id === storeId ? { ...s, featured: !current } : s)),
      );
      toast.success(`Store ${!current ? "featured" : "unfeatured"}`);
    } catch {
      toast.error("Failed to update featured status");
    }
  }, []);

  const deleteStore = useCallback(async (storeId: string) => {
    try {
      await deleteDoc(doc(db, "marketplaceStores", storeId));
      setStores((prev) => prev.filter((s) => s.id !== storeId));
      toast.success("Store deleted");
    } catch {
      toast.error("Failed to delete store");
    }
  }, []);

  return { stores, loading, error, fetchStores, toggleFeatured, deleteStore };
}
