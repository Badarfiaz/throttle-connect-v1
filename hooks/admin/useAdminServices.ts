"use client";
import { useState, useCallback } from "react";
import { collectionGroup, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";

export type AdminService = {
  id: string;
  storeId?: string;
  ownerUid?: string;
  title?: string;
  serviceType?: string;
  price?: number;
  priceUnit?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  featured?: boolean;
  createdAt?: string;
  views?: number;
  clicks?: number;
};

export function useAdminServices() {
  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collectionGroup(db, "services"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: AdminService[] = snap.docs.map((d) => {
        const parentPath = d.ref.parent.parent?.id;
        return {
          id: d.id,
          storeId: parentPath,
          ...(d.data() as Omit<AdminService, "id" | "storeId">),
        };
      });
      setServices(list);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch services";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (storeId: string, serviceId: string, current: boolean) => {
    try {
      const ref = doc(db, "marketplaceStores", storeId, "services", serviceId);
      await updateDoc(ref, { featured: !current });
      setServices((prev) =>
        prev.map((s) => (s.id === serviceId ? { ...s, featured: !current } : s)),
      );
      toast.success(`Service ${!current ? "featured" : "unfeatured"}`);
    } catch {
      toast.error("Failed to update featured status");
    }
  }, []);

  const deleteService = useCallback(async (storeId: string, serviceId: string) => {
    try {
      await deleteDoc(doc(db, "marketplaceStores", storeId, "services", serviceId));
      setServices((prev) => prev.filter((s) => s.id !== serviceId));
      toast.success("Service deleted");
    } catch {
      toast.error("Failed to delete service");
    }
  }, []);

  return { services, loading, error, fetchServices, toggleFeatured, deleteService };
}
