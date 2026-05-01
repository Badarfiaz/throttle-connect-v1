"use client";

import { DashboardContainer } from "@/components/shared/DashboardContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarketplaceDashboard } from "@/hooks/useMarketplaceDashboard";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import type { DashboardTab } from "@/ulity/marketplaceDashboard";
import ProfileSection from "@/components/marketplace/dashboard/sections/ProfileSection";
import ProductsSection from "@/components/marketplace/dashboard/sections/ProductsSection";
import AddProductSection from "@/components/marketplace/dashboard/sections/AddProductSection";
import { useState } from "react";

type MarketplaceProduct = {
  id: string;
  ownerUid: string;
  productName: string;
  imageurl?: {
    ref: string;
    url: string;
  };
  stock: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
};

const MarketplaceDashboardContainer = () => {
  const [editingProduct, setEditingProduct] =
    useState<MarketplaceProduct | null>(null);

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
    productsLoading,
    productsError,
    staticProfile,
    updateMarketplaceStore,
    updating,
    updateError,
    fetchProducts,
  } = useMarketplaceDashboard();

  const { deleteProduct, deleting } = useMarketplaceProducts();

  const handleEditProduct = (product: MarketplaceProduct) => {
    setEditingProduct(product);
    setActiveTab("add-product");
  };

  const handleDeleteProduct = async (productId: string) => {
    await deleteProduct(productId);
  };

  const handleBackToProducts = () => {
    setEditingProduct(null);
    setActiveTab("products");
    fetchProducts().catch(() => undefined);
  };

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
          userId={user?.userId}
          locationLabel={locationLabel}
          storeInitials={storeInitials}
          staticProfile={staticProfile}
          onUpdateStore={updateMarketplaceStore}
          updating={updating}
          updateError={updateError}
        />
      )}

      {activeTab === "products" && (
        <ProductsSection
          products={products}
          loading={productsLoading}
          error={productsError}
          onAddProduct={() => {
            setEditingProduct(null);
            setActiveTab("add-product");
          }}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
          deleting={deleting}
        />
      )}

      {activeTab === "add-product" && (
        <AddProductSection
          onBack={handleBackToProducts}
          editProduct={editingProduct}
        />
      )}
    </DashboardContainer>
  );
};

export default MarketplaceDashboardContainer;
