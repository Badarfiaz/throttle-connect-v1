"use client";
import { useState, useCallback } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { toast } from "sonner";
import { UserRole } from "@/types/CommonType";

export type AdminUser = {
  id: string;
  userId?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  profileImage?: string;
  createdAt?: unknown;
  completed?: boolean;
  hasMarketplace?: boolean;
  hasNetworking?: boolean;
};

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all users (no orderBy — createdAt may not exist on all docs)
      const [usersSnap, storesSnap, clubsSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(query(collection(db, "marketplaceStores"), where("completed", "==", true))),
        getDocs(query(collection(db, "networkingStores"), where("completed", "==", true))),
      ]);

      // Build ownerUid sets for O(1) lookup
      const marketplaceOwners = new Set(
        storesSnap.docs.map((d) => d.data().ownerUid as string).filter(Boolean),
      );
      const networkingOwners = new Set(
        clubsSnap.docs.map((d) => d.data().ownerUid as string).filter(Boolean),
      );

      const list: AdminUser[] = usersSnap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...(data as Omit<AdminUser, "id" | "hasMarketplace" | "hasNetworking">),
          hasMarketplace: marketplaceOwners.has(d.id),
          hasNetworking: networkingOwners.has(d.id),
        };
      });

      // Sort client-side: superAdmins first, then by name
      list.sort((a, b) => {
        if (a.role === "superAdmin" && b.role !== "superAdmin") return -1;
        if (b.role === "superAdmin" && a.role !== "superAdmin") return 1;
        return (a.name ?? a.email ?? "").localeCompare(b.name ?? b.email ?? "");
      });

      setUsers(list);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to fetch users";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const changeRole = useCallback(async (userId: string, newRole: UserRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update role");
    }
  }, []);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    }
  }, []);

  return { users, loading, error, fetchUsers, changeRole, deleteUser };
}
