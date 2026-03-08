"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import {
  DashboardTab,
  marketplaceNavItems,
  staticProfile,
  getLocationLabel,
  getStoreInitials,
} from "@/ulity/marketplaceDashboard";

export const useMarketplaceDashboard = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const user = useAppSelector((state) => state.auth.user);

  const {
    data: marketplaceStores,
    loading,
    error,
    fetchMarketplaceStores,
    updateMarketplaceStore,
    updating,
    updateError,
  } = useMarketplaceStore();

  const {
    products,
    loading: productsLoading,
    error: productsError,
    fetchProducts,
  } = useMarketplaceProducts();

  useEffect(() => {
    if (!user) return;
    fetchMarketplaceStores().catch(() => undefined);
    fetchProducts().catch(() => undefined);
  }, [user, fetchMarketplaceStores, fetchProducts]);

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
    updating,
    updateError,
    navItems: marketplaceNavItems,
    products: products ?? [],
    productsLoading,
    productsError,
    staticProfile,
    updateMarketplaceStore,
    fetchProducts,
  };
};
