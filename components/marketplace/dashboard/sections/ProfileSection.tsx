import type { MarketplaceStore } from "@/types/marketplace";
import StoreIdentityCard from "./profile/StoreIdentityCard";
import StoreLogoCard from "./profile/StoreLogoCard";
import ContactLocationCard from "./profile/ContactLocationCard";
import StoreMetadataCard from "./profile/StoreMetadataCard";

type StaticProfile = {
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
};

type ProfileSectionProps = {
  store: MarketplaceStore | null;
  userEmail?: string | null;
  userId?: string | null;
  locationLabel: string;
  storeInitials: string;
  staticProfile: StaticProfile;
};

export default function ProfileSection({
  store,
  userEmail,
  userId,
  storeInitials,
  staticProfile,
}: ProfileSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <StoreIdentityCard store={store} userEmail={userEmail} />
        <StoreLogoCard
          store={store}
          storeInitials={storeInitials}
          staticProfile={staticProfile}
        />
      </div>

      <ContactLocationCard store={store} />

      <StoreMetadataCard store={store} userId={userId} />
    </div>
  );
}
