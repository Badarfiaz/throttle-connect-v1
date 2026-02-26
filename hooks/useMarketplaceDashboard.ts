"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import {
  DashboardTab,
  marketplaceNavItems,
  sampleProducts,
  staticProfile,
  getLocationLabel,
  getStoreInitials,
} from "@/ulity/marketplaceDashboard";

export const useMarketplaceDashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const user = useAppSelector((state) => state.auth.user);

  const { data: marketplaceStores, loading, error, fetchMarketplaceStores } =
    useMarketplaceStore();

  useEffect(() => {
    if (!user) return;
    fetchMarketplaceStores().catch(() => undefined);
  }, [user, fetchMarketplaceStores]);

  const store = marketplaceStores?.[0] ?? null;
  const locationLabel = useMemo(() => getLocationLabel(store), [store]);
  const storeInitials = useMemo(() => getStoreInitials(store), [store]);

  return {
    user,
    store,
    locationLabel,
    storeInitials,
    activeTab,
    setActiveTab,
    loading,
    error,
    navItems: marketplaceNavItems,
    products: sampleProducts,
    staticProfile,
  };
};
