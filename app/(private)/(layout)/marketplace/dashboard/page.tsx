"use client";

import React, { useEffect, useMemo, useState } from "react";
import { DashboardContainer, DashboardNavItem } from "@/components/shared/DashboardContainer";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/app/redux/hooks";

type DashboardTab = "profile" | "products" | "add-product";

type ProductItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  status: "Active" | "Draft";
};

const navItems: DashboardNavItem[] = [
  {
    id: "profile",
    label: "Profile",
    description: "Store details & branding",
  },
  {
    id: "products",
    label: "Products",
    description: "View, edit, delete",
    badge: "12",
  },
  {
    id: "add-product",
    label: "Add Product",
    description: "Create a new listing",
  },
];

const staticProfile = {
  website: "https://yourstore.example",
  facebook: "facebook.com/yourstore",
  instagram: "@yourstore",
  tiktok: "@yourstore",
  whatsapp: "+92 300 0000000",
};

const products: ProductItem[] = [
  {
    id: "PRD-001",
    name: "Premium Brake Pad Kit",
    category: "Braking",
    price: "PKR 4,500",
    stock: "12 in stock",
    status: "Active",
  },
  {
    id: "PRD-002",
    name: "LED Headlight Set",
    category: "Lighting",
    price: "PKR 9,800",
    stock: "5 in stock",
    status: "Active",
  },
  {
    id: "PRD-003",
    name: "Performance Air Filter",
    category: "Engine",
    price: "PKR 3,200",
    stock: "Draft",
    status: "Draft",
  },
];

const MarketplaceDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const user = useAppSelector((state) => state.auth.user);

  const { data: marketplaceStores, loading, error, fetchMarketplaceStores } =
    useMarketplaceStore();

  useEffect(() => {
    if (!user) return;
    fetchMarketplaceStores().catch(() => undefined);
  }, [user, fetchMarketplaceStores]);

  const store = marketplaceStores?.[0] ?? null;

  const storeInitials = useMemo(() => {
    if (!store?.title) return "MS";
    return store.title
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [store?.title]);

  const locationLabel = useMemo(() => {
    const parts = [
      store?.location?.area,
      store?.location?.city,
      store?.location?.province,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "Lahore, Punjab";
  }, [store?.location]);

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Store Identity
              </h2>
              <p className="text-sm text-slate-500">
                Update your public-facing details.
              </p>
            </div>
            <Button size="sm" variant="outline">
              Save changes
            </Button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Store Title
              </label>
              <Input
                className="mt-2"
                defaultValue={store?.title ?? "Throttle Auto Hub"}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Business Type
              </label>
              <Input
                className="mt-2"
                defaultValue={store?.businessType ?? "Parts & Accessories"}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase text-slate-500">
                Overview
              </label>
              <Textarea
                className="mt-2"
                defaultValue={
                  store?.overview ??
                  "Specializing in performance parts, OEM replacements, and expert guidance for automotive enthusiasts."
                }
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Contact Method
              </label>
              <Input
                className="mt-2"
                defaultValue={store?.contactMethod ?? "WhatsApp"}
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Phone
              </label>
              <Input className="mt-2" defaultValue={store?.phone ?? "+92 312 555 2233"} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Store Logo</h2>
          <p className="text-sm text-slate-500">
            Add a brand mark to help buyers recognize your store.
          </p>

          <div className="mt-6 flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
              {storeInitials}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {store?.title ?? "Throttle Auto Hub"}
              </p>
              <p className="text-xs text-slate-500">Recommended 512x512px</p>
            </div>
            <Button className="ml-auto" size="sm" variant="outline">
              Upload Logo
            </Button>
          </div>

          <div className="mt-6 grid gap-4">
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Website
                <Badge className="ml-2" variant="secondary">
                  Static
                </Badge>
              </label>
              <Input className="mt-2" defaultValue={staticProfile.website} disabled />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase text-slate-500">
                Social Links
                <Badge className="ml-2" variant="secondary">
                  Static
                </Badge>
              </label>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <Input defaultValue={staticProfile.facebook} disabled />
                <Input defaultValue={staticProfile.instagram} disabled />
                <Input defaultValue={staticProfile.tiktok} disabled />
                <Input defaultValue={staticProfile.whatsapp} disabled />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Contact & Location</h2>
        <p className="text-sm text-slate-500">
          Manage how buyers reach you and where you operate.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Email
            </label>
            <Input className="mt-2" defaultValue={store?.email ?? user?.email ?? "store@email.com"} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Address
            </label>
            <Input className="mt-2" defaultValue={store?.address ?? "Main Boulevard, Gulberg"} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Area
            </label>
            <Input className="mt-2" defaultValue={store?.location?.area ?? "Gulberg"} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              City
            </label>
            <Input className="mt-2" defaultValue={store?.location?.city ?? "Lahore"} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Province
            </label>
            <Input className="mt-2" defaultValue={store?.location?.province ?? "Punjab"} />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Location Summary
            </label>
            <Input className="mt-2" defaultValue={locationLabel} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Store Metadata</h2>
        <p className="text-sm text-slate-500">
          System details captured during onboarding.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Owner UID
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.ownerUid ?? user?.id ?? "UID-0001"}
              disabled
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Created At
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.createdAt ?? "2024-01-15T12:30:00+05:00"}
              disabled
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Page Type
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.pageType ?? "marketplace"}
              disabled
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-slate-500">
              Onboard Type
            </label>
            <Input
              className="mt-2"
              defaultValue={store?.onBoardType ?? "marketplace"}
              disabled
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Product Catalog</h2>
          <p className="text-sm text-slate-500">
            Keep your inventory fresh and visible.
          </p>
        </div>
        <Button onClick={() => setActiveTab("add-product")}>Add Product</Button>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-slate-900">
                  {product.name}
                </h3>
                <Badge variant={product.status === "Active" ? "default" : "secondary"}>
                  {product.status}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {product.category} · {product.price} · {product.stock}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Edit
              </Button>
              <Button variant="destructive" size="sm">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Add New Product</h2>
          <p className="text-sm text-slate-500">
            List a fresh item for buyers to discover.
          </p>
        </div>
        <Button variant="outline" onClick={() => setActiveTab("products")}>
          Back to Products
        </Button>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Product Name
          </label>
          <Input className="mt-2" placeholder="e.g., Premium Brake Pad Kit" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Category
          </label>
          <Input className="mt-2" placeholder="Braking, Lighting, Engine" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Price
          </label>
          <Input className="mt-2" placeholder="PKR 0" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Stock
          </label>
          <Input className="mt-2" placeholder="Available units" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs font-semibold uppercase text-slate-500">
            Description
          </label>
          <Textarea
            className="mt-2"
            placeholder="Highlight features, fitment, and warranty details."
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button>Save Draft</Button>
        <Button variant="outline">Publish</Button>
      </div>
    </div>
  );

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

      {activeTab === "profile" && renderProfile()}
      {activeTab === "products" && renderProducts()}
      {activeTab === "add-product" && renderAddProduct()}
    </DashboardContainer>
  );
};

export default MarketplaceDashboardPage;
