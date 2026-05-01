"use client";
import { MARKETPLACE_STORE_PROFILE_QUERY } from "@/app/graphql/marketplace";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import StoreProfileSection from "./StoreProfileSection";

function StoreProfileContainer() {
  const params = useParams();
  const slugUrl = params.id;
  const { data, loading, error, fetchMarketplaceStores } = useMarketplaceStore({
    query: MARKETPLACE_STORE_PROFILE_QUERY,
    variables: { slugUrl },
    isPublic: true,
  });
  useEffect(() => {
    fetchMarketplaceStores().catch(() => undefined);
  }, [fetchMarketplaceStores]);

  // Handle array data from API
  const store = Array.isArray(data) ? data[0] : data;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2 text-red-600">
            Error Loading Store
          </h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return <StoreProfileSection store={store} loading={loading} />;
}

export default StoreProfileContainer;
