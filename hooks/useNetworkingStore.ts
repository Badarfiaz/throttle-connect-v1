"use client";

import { useCallback, useState } from "react";
import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { NetworkingStore } from "@/types/networking";

type UseNetworkingStoreProps = {
  query?: string;
  isPublic?: boolean;
  variables?: Record<string, unknown>;
};

export const useNetworkingStore = ({
  query = "",
  isPublic = false,
  variables = {},
}: UseNetworkingStoreProps = {}) => {
  const [data, setData] = useState<NetworkingStore[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchNetworkingStores = useCallback(async (userId?: string) => {
    if (!userId) {
      setData([]);
      return [];
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const docRef = doc(db, "networkingStores", userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const clubData = {
          id: docSnap.id,
          ...docSnap.data(),
        } as NetworkingStore;
        
        setData([clubData]);
        return [clubData];
      }

      setData([]);
      return [];
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNetworkingStore = useCallback(
    async (id: string, input: Record<string, unknown>) => {
      setUpdating(true);
      setUpdateError(null);

      try {
        const docRef = doc(db, "networkingStores", id);
        await setDoc(docRef, input, { merge: true });

        const docSnap = await getDoc(docRef);
        const updatedStore = {
          id: docSnap.id,
          ...docSnap.data(),
        } as NetworkingStore;

        setData((prev) => {
          if (!prev) return [updatedStore];
          return prev.map((item) =>
            item.id === updatedStore.id ? updatedStore : item,
          );
        });

        return updatedStore;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setUpdateError(message);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [],
  );

  return {
    data,
    loading,
    error,
    updating,
    updateError,
    fetchNetworkingStores,
    updateNetworkingStore,
  };
};
