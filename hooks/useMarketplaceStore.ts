import { useCallback, useMemo, useState } from "react";
import { FETCHER_URL } from "@/lib/config";
import getFirebaseToken from "@/ulity/getFirebaseToken";

const MARKETPLACE_STORES_QUERY = `{
  marketplaceStores {
    id
    title
    address
    businessType
    completed
    contactMethod
    createdAt
    email
    location { area city province }
    onBoardType
    overview
    ownerUid
    pageType
    phone
  }
}`;

const MARKETPLACE_COMPLETED_QUERY = `{
  marketplaceStores {
    completed
  }
}`;

export type MarketplaceStore = {
  id?: string;
  title?: string;
  address?: string;
  businessType?: string;
  completed: boolean;
  contactMethod?: string | null;
  createdAt?: string | null;
  email?: string | null;
  location?: {
    area?: string | null;
    city?: string | null;
    province?: string | null;
  } | null;
  onBoardType?: string | null;
  overview?: string | null;
  ownerUid?: string | null;
  pageType?: string | null;
  phone?: string | null;
};

type UseMarketplaceStoreOptions = {
  isCompleted?: boolean;
  iscompleted?: boolean;
};

export const useMarketplaceStore = (
  options: UseMarketplaceStoreOptions = {},
) => {
  const resolvedIsCompleted =
    options.isCompleted ?? options.iscompleted ?? false;
  const [data, setData] = useState<MarketplaceStore[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(
    () =>
      resolvedIsCompleted
        ? MARKETPLACE_COMPLETED_QUERY
        : MARKETPLACE_STORES_QUERY,
    [resolvedIsCompleted],
  );

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
        body: JSON.stringify({ query }),
      });

      const result = await res.json();

      if (!res.ok || result.errors) {
        const message = result?.errors
          ? JSON.stringify(result.errors, null, 2)
          : "Request failed.";
        throw new Error(message);
      }

      const stores = result?.data?.marketplaceStores ?? null;
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

  return {
    data,
    loading,
    error,
    fetchMarketplaceStores,
    query,
  };
};
