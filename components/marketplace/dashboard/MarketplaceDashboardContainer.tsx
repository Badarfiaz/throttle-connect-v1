"use client";

import React, { useState, useEffect } from "react";
import { DashboardContainer } from "@/components/shared/DashboardContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMarketplaceDashboard } from "@/hooks/useMarketplaceDashboard";
import { useMarketplaceProducts } from "@/hooks/useMarketplaceProducts";
import ProfileSection from "@/components/marketplace/dashboard/sections/ProfileSection";
import ProductsSection from "@/components/marketplace/dashboard/sections/ProductsSection";
import AddProductSection from "@/components/marketplace/dashboard/sections/AddProductSection";
import ServicesSection from "@/components/marketplace/dashboard/sections/ServicesSection";
import AddServiceSection from "@/components/marketplace/dashboard/sections/AddServiceSection";
import LeadsSection from "@/components/marketplace/dashboard/sections/LeadsSection";
import AnalyticsSection from "@/components/marketplace/dashboard/sections/AnalyticsSection";
import { useMarketplaceServices } from "@/hooks/useMarketplaceServices";
import {
  Package,
  Layers,
  Eye,
  DollarSign,
  Plus,
  Sparkles,
  Info,
  AlertCircle,
  ArrowRight,
  Edit2,
  Store,
  Wrench,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { MarketplaceService } from "@/types/marketplace";
import GoldUserBanner from "@/components/shared/GoldUserBanner";

type LocalDashboardTab = "overview" | "profile" | "products" | "add-product" | "services" | "add-service" | "leads" | "analytics";

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
  const [activeTab, setActiveTab] = useState<LocalDashboardTab>("overview");
  const [editingProduct, setEditingProduct] = useState<MarketplaceProduct | null>(null);
  const [editingService, setEditingService] = useState<MarketplaceService | null>(null);

  const {
    user,
    store,
    locationLabel,
    storeInitials,
    loading,
    error,
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

  const {
    services,
    loading: servicesLoading,
    error: servicesError,
    deleting: deletingService,
    fetchMyServices,
    deleteService,
  } = useMarketplaceServices();

  useEffect(() => {
    fetchMyServices().catch(() => undefined);
  }, [fetchMyServices]);

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

  const handleEditService = (service: MarketplaceService) => {
    setEditingService(service);
    setActiveTab("add-service");
  };

  const handleDeleteService = async (storeId: string, serviceId: string) => {
    await deleteService(storeId, serviceId);
  };

  const handleBackToServices = () => {
    setEditingService(null);
    setActiveTab("services");
  };

  const outOfStockProducts = products.filter((p) => p.stock === 0);

  const localNavItems = [
    {
      id: "overview",
      label: "Overview",
      description: "Store insights & quick stats",
    },
    {
      id: "profile",
      label: "Store Profile",
      description: "Store details & branding",
    },
    {
      id: "products",
      label: "Products",
      description: "View, edit, delete",
      badge: products.length > 0 ? String(products.length) : undefined,
    },
    {
      id: "add-product",
      label: "Add Product",
      description: "Create a new listing",
    },
    {
      id: "services",
      label: "Services",
      description: "Mechanic, electrician & more",
      badge: services.length > 0 ? String(services.length) : undefined,
    },
    {
      id: "add-service",
      label: "Add Service",
      description: "List a new service",
    },
    {
      id: "leads",
      label: "Leads",
      description: "Buyers who contacted you",
    },
    {
      id: "analytics",
      label: "Analytics",
      description: "Views & clicks per listing",
    },
  ];

  return (
    <DashboardContainer
      title={store?.title ?? "Marketplace Dashboard"}
      subtitle={`Manage your store, listings, and buyer experience. Location: ${locationLabel}.`}
      navItems={localNavItems}
      activeId={activeTab}
      onNavigate={(id) => {
        setActiveTab(id as LocalDashboardTab);
        setEditingProduct(null);
      }}
      actions={
        <div className="flex items-center gap-2">
          {loading ? (
            <Badge variant="secondary">Loading store data</Badge>
          ) : (
            <Badge variant="secondary">Store ready</Badge>
          )}
          {store?.slugUrl && (
            <Button size="sm" variant="outline" onClick={() => window.location.href = `/marketplace/storeProfile/${store.slugUrl}`}>
              Preview Store Page
            </Button>
          )}
        </div>
      }
    >
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-6">
          {error}
        </div>
      ) : null}

      {/* ── Gold User Banner (shown on all tabs) ── */}
      <GoldUserBanner />

      {/* ── Landing Overview Tab ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">

          {/* Welcome Banner */}
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                Welcome to your Store Dashboard <Sparkles className="h-5 w-5 text-amber-500" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Keep your product catalog updated, check store visits, and monitor inventory items.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <Button size="sm" onClick={() => { setEditingProduct(null); setActiveTab("add-product"); }} className="rounded-xl bg-[#19376D] text-white">
                <Plus className="h-4 w-4 mr-1.5" /> Add Product
              </Button>
            </div>
          </div>

          {/* Out of stock warning banner */}
          {outOfStockProducts.length > 0 && (
            <div className="rounded-2xl border border-rose-250 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 p-4 shadow-sm flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                <span className="text-xs sm:text-sm font-bold">
                  Warning: You have {outOfStockProducts.length} product listings that are currently out of stock.
                </span>
              </div>
              <Button size="sm" variant="outline" onClick={() => setActiveTab("products")} className="h-8 text-xs border-rose-300/40 text-rose-800 dark:text-rose-200 hover:bg-rose-100 bg-white dark:bg-slate-900 rounded-xl cursor-pointer">
                Restock Now <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          )}

          {/* Statistics Grid Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Listings</span>
                  <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{products.length}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400"><Package className="h-5 w-5" /></div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Out of Stock</span>
                  <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{outOfStockProducts.length}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400"><Layers className="h-5 w-5" /></div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Store Views</span>
                  <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">1,840</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-650 dark:text-purple-400"><Eye className="h-5 w-5" /></div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Sales Volume</span>
                  <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">PKR 45,800</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"><DollarSign className="h-5 w-5" /></div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Static Insights */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Quick Actions Panel */}
            <Card className="md:col-span-2 rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
              <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
                <CardTitle className="text-sm font-bold">Quick Actions</CardTitle>
                <CardDescription className="text-xs">Shortcuts to manage your marketplace presence</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" onClick={() => { setEditingProduct(null); setActiveTab("add-product"); }} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Plus className="h-4.5 w-4.5 text-emerald-650" />
                    <span className="text-xs font-bold">Add Product</span>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("products")} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Package className="h-4.5 w-4.5 text-blue-600" />
                    <span className="text-xs font-bold">Manage Catalog</span>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("profile")} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Edit2 className="h-4.5 w-4.5 text-slate-550" />
                    <span className="text-xs font-bold">Edit Profile</span>
                  </Button>
                  <Button variant="outline" onClick={() => {
                    if (store?.slugUrl) {
                      window.location.href = `/marketplace/storeProfile/${store.slugUrl}`;
                    } else {
                      toast.error("Store page unavailable.");
                    }
                  }} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Store className="h-4.5 w-4.5 text-purple-650" />
                    <span className="text-xs font-bold">Preview Page</span>
                  </Button>
                  <Button variant="outline" onClick={() => { setEditingService(null); setActiveTab("add-service"); }} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Wrench className="h-4.5 w-4.5 text-orange-500" />
                    <span className="text-xs font-bold">Add Service</span>
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("services")} className="h-16 flex flex-col items-center justify-center gap-1 border dark:border-slate-800 hover:border-primary rounded-xl cursor-pointer">
                    <Wrench className="h-4.5 w-4.5 text-teal-600" />
                    <span className="text-xs font-bold">My Services</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Static Insights / Tips panel */}
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between">
              <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
                <CardTitle className="text-sm font-bold">Seller Insights & Tips</CardTitle>
                <CardDescription className="text-xs">Optimize listings & increase sales</CardDescription>
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="flex gap-2.5 items-start">
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Listing Tip:</strong> Upload high-quality pictures from multiple angles to increase conversion by 40%.
                  </p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Category Demand:</strong> Riding gear and tires are the most searched categories during weekend mornings.
                  </p>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Info className="h-4 w-4 text-purple-650 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                    <strong className="text-slate-800 dark:text-slate-200">Restock Advisory:</strong> Keeping stock quantities above 3 units ensures item visibility in recommendation sliders.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Sales Sparkline Graph */}
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <CardHeader className="py-4 px-6 border-b dark:border-slate-800">
              <CardTitle className="text-base font-bold">Monthly Store Clicks and Search Traffic</CardTitle>
              <CardDescription className="text-xs">SaaS analytics representing listing visits over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full h-44">
                <svg className="w-full h-full" viewBox="0 0 500 120">
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-slate-800" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#cbd5e1" strokeWidth="1" className="dark:stroke-slate-700" />
                  
                  <path
                    d="M40,100 L40,90 Q120,50 200,80 T360,50 T480,30 L480,100 Z"
                    fill="url(#marketOverviewGradient)"
                    opacity="0.15"
                  />
                  <path
                    d="M40,90 Q120,50 200,80 T360,50 T480,30"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle cx="40" cy="90" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  <circle cx="200" cy="80" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  <circle cx="360" cy="50" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  <circle cx="480" cy="30" r="4.5" fill="#10b981" stroke="#fff" strokeWidth="2" />

                  <text x="40" y="115" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-bold">Jan</text>
                  <text x="150" y="115" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-bold">Mar</text>
                  <text x="300" y="115" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-bold">May</text>
                  <text x="480" y="115" fill="#94a3b8" textAnchor="middle" className="text-[10px] font-bold">Jun</text>

                  <defs>
                    <linearGradient id="marketOverviewGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </CardContent>
          </Card>

        </div>
      )}

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

      {activeTab === "services" && (
        <ServicesSection
          services={services}
          loading={servicesLoading}
          error={servicesError}
          onAddService={() => {
            setEditingService(null);
            setActiveTab("add-service");
          }}
          onEditService={handleEditService}
          onDeleteService={handleDeleteService}
          deleting={deletingService}
        />
      )}

      {activeTab === "add-service" && (
        <AddServiceSection
          onBack={handleBackToServices}
          editService={editingService}
        />
      )}

      {activeTab === "leads" && (
        <LeadsSection products={products.map((p) => ({ id: p.id, productName: p.productName }))} />
      )}
      {activeTab === "analytics" && (
        <AnalyticsSection products={products.map((p) => ({ id: p.id, productName: p.productName }))} />
      )}
    </DashboardContainer>
  );
};

export default MarketplaceDashboardContainer;
