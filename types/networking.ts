export type NetworkingContactMethod = "whatsapp" | "call" | "email";

export type NetworkingSocialPlatforms = Partial<{
  website: string;
  linkedin: string;
  instagram: string;
  other: string;
}>;

export type NetworkingStore = {
  id?: string;
  clubName?: string;
  clubType?: string;
  otherClubType?: string | null;
  description?: string | null;
  city?: string | null;
  phone?: string | null;
  email?: string | null;
  contactMethod?: NetworkingContactMethod;
  socialPlatforms?: NetworkingSocialPlatforms | null;
  createdAt?: string | null;
  ownerUid?: string | null;
  pageType?: string | null;
  onBoardType?: string | null;
  completed?: boolean;
};
