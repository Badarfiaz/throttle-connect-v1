"use client";
import { useCallback, useState } from "react";
import { FETCHER_URL } from "@/lib/config";
import getFirebaseToken from "@/ulity/getFirebaseToken";
import type { MarketplaceStore } from "@/types/marketplace";
import {
  MARKETPLACE_STORES_QUERY,
  UPDATE_MARKETPLACE_STORE_MUTATION,
} from "@/app/graphql/marketplace";

type UseMarketplaceStoreProps = {
  query?: string;
  isPublic?: boolean;
};
export const useMarketplaceStore = ({
  query = MARKETPLACE_STORES_QUERY,
  isPublic = false,
}: UseMarketplaceStoreProps) => {
  const [data, setData] = useState<MarketplaceStore[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchMarketplaceStores = useCallback(async () => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const { token } = await getFirebaseToken();

      if (!token) {
        throw new Error("Not authenticated. Please log in first.");
      }

      const res = await fetch(FETCHER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: query }),
      });

      const result = await res.json();
      console.log("Fetch Result marketplace store :", result);
      if (!res.ok || result.errors) {
        const message = result?.errors
          ? JSON.stringify(result.errors, null, 2)
          : "Request failed.";
        throw new Error(message);
      }

      const stores =
        result?.data?.marketplaceStores ??
        result?.data?.marketplaceAllStores ??
        null;
      setData(stores);

      return stores as MarketplaceStore[] | null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [query]);

  const updateMarketplaceStore = useCallback(
    async (id: string, input: Record<string, unknown>) => {
      setUpdating(true);
      setUpdateError(null);

      try {
        const { token } = await getFirebaseToken();

        if (!token) {
          throw new Error("Not authenticated. Please log in first.");
        }

        const res = await fetch(FETCHER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: UPDATE_MARKETPLACE_STORE_MUTATION,
            variables: { id, input },
          }),
        });

        const result = await res.json();

        if (!res.ok || result.errors) {
          const message = result?.errors
            ? JSON.stringify(result.errors, null, 2)
            : "Request failed.";
          throw new Error(message);
        }

        const updatedStore = result?.data?.updateMarketplaceStore as
          | MarketplaceStore
          | undefined;

        if (updatedStore) {
          setData((prev) => {
            if (!prev) return [updatedStore];
            return prev.map((item) =>
              item.id === updatedStore.id ? updatedStore : item,
            );
          });
        }

        return updatedStore ?? null;
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
    fetchMarketplaceStores,
    updateMarketplaceStore,
  };
};
