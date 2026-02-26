"use client";

import React from "react";
import { DashboardContainer } from "@/components/shared/DashboardContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarketplaceDashboard } from "@/hooks/useMarketplaceDashboard";
import type { DashboardTab } from "@/ulity/marketplaceDashboard";
import ProfileSection from "@/components/marketplace/dashboard/sections/ProfileSection";
import ProductsSection from "@/components/marketplace/dashboard/sections/ProductsSection";
import AddProductSection from "@/components/marketplace/dashboard/sections/AddProductSection";

const MarketplaceDashboardContainer = () => {
  const {
    user,
    store,
    locationLabel,
    storeInitials,
    activeTab,
    setActiveTab,
    loading,
    error,
    navItems,
    products,
    staticProfile,
  } = useMarketplaceDashboard();

  return (
    <DashboardContainer
      title={store?.title ?? "Marketplace Dashboard"}
      subtitle={`Manage your store, listings, and buyer experience. Location: ${locationLabel}.`}
      navItems={navItems}
      activeId={activeTab}
      onNavigate={(id) => setActiveTab(id as DashboardTab)}
      actions={
        <div className="flex items-center gap-2">
          {loading ? (
            <Badge variant="secondary">Loading store data</Badge>
          ) : (
            <Badge variant="secondary">Store ready</Badge>
          )}
          <Button size="sm" variant="outline">
            Preview Store
          </Button>
        </div>
      }
    >
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {activeTab === "profile" && (
        <ProfileSection
          store={store}
          userEmail={user?.email}
          userId={user?.id}
          locationLabel={locationLabel}
          storeInitials={storeInitials}
          staticProfile={staticProfile}
        />
      )}

      {activeTab === "products" && (
        <ProductsSection
          products={products}
          onAddProduct={() => setActiveTab("add-product")}
        />
      )}

      {activeTab === "add-product" && (
        <AddProductSection onBack={() => setActiveTab("products")} />
      )}
    </DashboardContainer>
  );
};

export default MarketplaceDashboardContainer;
