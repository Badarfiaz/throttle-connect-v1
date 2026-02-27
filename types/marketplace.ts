export type MarketplaceStore = {
  id?: string;
  title?: string;
  address?: string;
  businessType?: string[] | null;
  completed: boolean;
  contactMethod?: string | null;
  createdAt?: string | null;
  email?: string | null;
  logoUrl?: string | null;
  location?: {
    area?: string | null;
    city?: string | null;
    province?: string | null;
  } | null;
  onBoardType?: string | null;
  overview?: string | null;
  ownerUid?: string | null;
  pageType?: string | null;
  phone?: string | null;
};
