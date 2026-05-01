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
  logoUrl?: string | null;
  slugUrl?: string | null;
};

export type MarketplaceProduct = {
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
