import type { MarketplaceStore } from "@/types/marketplace";
import type { DashboardNavItem } from "@/components/shared/DashboardContainer";

export type DashboardTab = "profile" | "products" | "add-product";

export type ProductItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  status: "Active" | "Draft";
};

export const marketplaceNavItems: DashboardNavItem[] = [
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

export const staticProfile = {
  website: "https://yourstore.example",
  linkedin: "linkedin.com/company/yourstore",
  instagram: "@yourstore",
  other: "",
};

export const sampleProducts: ProductItem[] = [
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

export const getStoreInitials = (store?: MarketplaceStore | null) => {
  if (!store?.title) return "MS";
  return store.title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export const getLocationLabel = (store?: MarketplaceStore | null) => {
  const parts = [
    store?.location?.area,
    store?.location?.city,
    store?.location?.province,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "Lahore, Punjab";
};
