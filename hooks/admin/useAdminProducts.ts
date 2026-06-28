"use client";
import { useState, useCallback } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";

export type AdminProduct = {
  id: string;
  ownerUid?: string;
  productName?: string;
  category?: string;
  price?: number;
  stock?: number;
  imageurl?: { url: string; ref: string };
  featured?: boolean;
  createdAt?: unknown;
  views?: number;
  clicks?: number;
};

export function useAdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Products live in the top-level "marketplaceProducts" collection
      const q = query(collection(db, "marketplaceProducts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list: AdminProduct[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<AdminProduct, "id">),
      }));
      setProducts(list);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch products";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFeatured = useCallback(async (productId: string, current: boolean) => {
    try {
      await updateDoc(doc(db, "marketplaceProducts", productId), { featured: !current });
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, featured: !current } : p)),
      );
      toast.success(`Product ${!current ? "featured" : "unfeatured"}`);
    } catch {
      toast.error("Failed to update featured status");
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    try {
      await deleteDoc(doc(db, "marketplaceProducts", productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  }, []);

  return { products, loading, error, fetchProducts, toggleFeatured, deleteProduct };
}
