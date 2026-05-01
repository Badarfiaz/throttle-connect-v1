"use client";
import { MARKETPLACE_STORE_PROFILE_QUERY } from "@/app/graphql/marketplace";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import { useParams } from "next/navigation";
import { useEffect } from "react";

function StoreProfileContainer() {
  const params = useParams();
  const slugUrl = params.id;
  const { data, loading, error, fetchMarketplaceStores } = useMarketplaceStore({
    query: MARKETPLACE_STORE_PROFILE_QUERY,
    variables: { slugUrl },
  });
  useEffect(() => {
    fetchMarketplaceStores().catch(() => undefined);
  }, [fetchMarketplaceStores]);
  console.log("store profile data ", data);
  return (
    <div>
      <h1>{slugUrl}</h1>
    </div>
  );
}

export default StoreProfileContainer;
