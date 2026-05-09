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
};

export type MarketplaceStoreCard = {
  id: string;
  title?: string | null;
  bannerUrl?: string | null;
  logoUrl?: string | null;
  slugUrl?: string | null;
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
  stock: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
};
export type MarketplaceProductImageInput = {
  ref: string;
  url: string;
};

export type MarketplaceProductFormInput = {
  productName: string;
  imageurl?: MarketplaceProductImageInput;
  stock: number;
  price: number;
  description?: string;
  category?: string;
};
