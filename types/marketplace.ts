import { ContactMethod, locationFields } from "./CommonType";

export type MarketplaceStore = {
  id?: string;
  title?: string;
  address?: string;
  businessType?: string[] | null;
  completed?: boolean;
  contactMethod?: ContactMethod;
  createdAt?: string | null;
  email?: string | null;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  location?: locationFields | null;
  onBoardType?: string | null;
  overview?: string | null;
  ownerUid?: string | null;
  slugUrl?: string | null;
  pageType?: string | null;
  phone?: string | null;
  featured?: boolean;
};

export type MarketplaceStoreCard = {
  id: string;
  title?: string | null;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  slugUrl?: string | null;
  businessType?: string[] | null;
  location?: locationFields | null;
};

export type MarketplaceProduct = {
  id: string;
  ownerUid: string;
  owner?: MarketplaceStore | null;
  productName: string;
  description?: string;
  category?: string;
  imageurl?: {
    ref: string;
    url: string;
  };
  imageUrlMulti?: { ref: string; url: string }[];
  stock: number;
  price: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
export type MarketplaceProductImageInput = {
  ref: string;
  url: string;
};

export type ServiceReview = {
  id: string;
  serviceId: string;
  storeId: string;
  reviewerUid: string;
  reviewerName?: string | null;
  rating: number;
  comment?: string | null;
  createdAt?: string | null;
};

export type MarketplaceService = {
  id: string;
  storeId: string;
  ownerUid: string;
  store?: MarketplaceStore | null;
  title: string;
  serviceType: string;
  description?: string | null;
  price?: number | null;
  priceUnit?: string | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  featured?: boolean;
  reviews?: ServiceReview[];
  averageRating?: number | null;
  reviewCount?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type MarketplaceServiceFormInput = {
  title: string;
  serviceType: string;
  description?: string;
  price?: number;
  priceUnit?: string;
  imageUrl?: string;
  isAvailable?: boolean;
};

export const SERVICE_TYPES = [
  { value: "mechanic", label: "Mechanic" },
  { value: "electrician", label: "Electrician" },
  { value: "body-shop", label: "Body Shop / Panel Beater" },
  { value: "car-wash", label: "Car Wash & Detailing" },
  { value: "tire-service", label: "Tire Service" },
  { value: "ac-repair", label: "AC / Air Conditioning" },
  { value: "oil-change", label: "Oil Change" },
  { value: "wheel-alignment", label: "Wheel Alignment" },
  { value: "inspection", label: "Vehicle Inspection" },
  { value: "custom-fabrication", label: "Custom Fabrication" },
  { value: "window-tinting", label: "Window Tinting" },
  { value: "other", label: "Other" },
] as const;

export const PRICE_UNITS = [
  { value: "fixed", label: "Fixed Price" },
  { value: "per-hour", label: "Per Hour" },
  { value: "starting-from", label: "Starting From" },
  { value: "on-quote", label: "On Quote" },
] as const;

export type MarketplaceProductFormInput = {
  productName: string;
  imageurl?: MarketplaceProductImageInput;
  imageUrlMulti?: MarketplaceProductImageInput[];
  stock: number;
  price: number;
  description?: string;
  category?: string;
};
