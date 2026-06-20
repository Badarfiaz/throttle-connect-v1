import { MarketplaceStore } from "./marketplace";
import { MemberProfile } from "./member";
import { NetworkingStore } from "./networking";

export type locationFields = {
  area?: string;
  city: string;
  province?: string;
  country?: string;
};
export type ContactMethod = "email" | "phone" | "whatsapp" | "social";
export type allowedPageType = "marketplace" | "networking";
export const mobileResponsiveCount = 1.5;

export type SocialMediaPlatform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "website";

export type BusinessCategory =
  | "automotive-services"
  | "car-dealerships"
  | "car-repair-shops"
  | "car-rental-services"
  | "car-wash-and-detailing"
  | "auto-parts-stores"
  | "tire-shops"
  | "oil-change-services"
  | "auto-body-shops"
  | "car-accessories-stores";

export type OnBoardType = {
  storeTitle: string;
  email: string;
  contactNumber: string;
  address: string;
  selectCategory: BusinessCategory[]; // array of categories
  overview: string;
  location: locationFields;
  completed: boolean;
  whatsappNumber: string;
  contactMethod: ContactMethod;
  websiteLink: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};

export type User = {
  userId: string;
  email: string;
  name: string;
  completed?: boolean;
  marketplace?: MarketplaceStore | null;
  networking?: NetworkingStore | null;
  profileData?: MemberProfile | null;
};
