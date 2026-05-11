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
  variables?: Record<string, unknown>;
};

const marketplaceStoreCache = new Map<string, MarketplaceStore[] | null>();
const marketplaceStorePromises = new Map<
  string,
  Promise<MarketplaceStore[] | null>
>();
const EMPTY_VARIABLES: Record<string, unknown> = {};

export const useMarketplaceStore = ({
  query = MARKETPLACE_STORES_QUERY,
  isPublic = false,
  variables,
}: UseMarketplaceStoreProps) => {
  const resolvedVariables = variables ?? EMPTY_VARIABLES;
  const cacheKey = JSON.stringify({
    query,
    isPublic,
    variables: resolvedVariables,
  });
  const [data, setData] = useState<MarketplaceStore[] | null>(
    () => marketplaceStoreCache.get(cacheKey) ?? null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const fetchMarketplaceStores = useCallback(async () => {
    const cachedStores = marketplaceStoreCache.get(cacheKey);
    if (cachedStores !== undefined) {
      setData(cachedStores);
      setError(null);
      setLoading(false);
      return cachedStores;
    }

    const inFlightRequest = marketplaceStorePromises.get(cacheKey);
    if (inFlightRequest) {
      setLoading(true);
      setError(null);
      const stores = await inFlightRequest;
      setData(stores);
      return stores;
    }

    setLoading(true);
    setError(null);
    setData(null);

    // If not explicitly public, treat as private unless query indicates otherwise
    const isPublicResolved =
      typeof isPublic === "boolean"
        ? isPublic
        : String(query).includes("marketplaceAllStores");

    const requestPromise = (async () => {
      let token: string | null = null;
      if (!isPublicResolved) {
        const tokenResult = await getFirebaseToken();
        token = tokenResult.token;

        if (!token) {
          throw new Error("Not authenticated. Please log in first.");
        }
      }

      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      let res = await fetch(FETCHER_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({ query: query, variables }),
      });

      let result = await res.json();

      // If this is a public query and the response indicates an auth error,
      // retry without the Authorization header
      if (
        (!res.ok || result?.errors) &&
        isPublicResolved &&
        headers.Authorization
      ) {
        const fallbackHeaders: HeadersInit = {
          "Content-Type": "application/json",
        };
        const fallbackRes = await fetch(FETCHER_URL, {
          method: "POST",
          headers: fallbackHeaders,
          body: JSON.stringify({ query: query }),
        });
        const fallbackResult = await fallbackRes.json();
        res = fallbackRes;
        result = fallbackResult;
      }

      if (!res.ok || result.errors) {
        const message = result?.errors
          ? JSON.stringify(result.errors, null, 2)
          : "Request failed.";
        throw new Error(message);
      }

      const stores =
        result?.data?.marketplaceStores ??
        result?.data?.marketplaceAllStores ??
        result?.data?.marketplaceStoreProfile ??
        null;

      marketplaceStoreCache.set(cacheKey, stores);
      return stores as MarketplaceStore[] | null;
    })();

    marketplaceStorePromises.set(cacheKey, requestPromise);

    try {
      const stores = await requestPromise;
      setData(stores);
      return stores;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      throw err;
    } finally {
      marketplaceStorePromises.delete(cacheKey);
      setLoading(false);
    }
  }, [cacheKey, isPublic, query, resolvedVariables]);

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
