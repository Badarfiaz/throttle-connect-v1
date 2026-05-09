import React, { useMemo } from "react";
import RegistrationInputField from "./RegistrationInputField";
import { shopSetupFields } from "./formFields";
import StoreLogoCard from "../dashboard/sections/profile/StoreLogoCard";
import StoreBannerCard from "../dashboard/sections/profile/StoreBannerCard";
import { useAppSelector } from "@/app/redux/hooks";
import { getStoreInitials } from "@/ulity/marketplaceDashboard";
import type { MarketplaceStore } from "@/types/marketplace";

type ShopSetupProps = {
  form: any;
};

function ShopSetup({ form }: ShopSetupProps) {
  const marketplaceStoreData = useAppSelector(
    (state) => state.auth.user?.marketplace,
  ) as MarketplaceStore | null;

  const storeInitials = useMemo(
    () => getStoreInitials(marketplaceStoreData),
    [marketplaceStoreData],
  );

  const handleLogoUrlChange = (logoUrl: string | null) => {
    form.setValue("logoUrl", logoUrl);
  };

  const handleBannerUrlChange = (bannerUrl: string | null) => {
    form.setValue("bannerUrl", bannerUrl);
  };

  return (
    <form className="grid gap-5">
      {/* Shop Setup Form Fields */}
      {shopSetupFields.map((field) => {
        if (field.name === "logoUrl") {
          return (
            <StoreLogoCard
              key={field.name}
              store={marketplaceStoreData}
              storeInitials={storeInitials}
              onLogoUrlChange={handleLogoUrlChange}
            />
          );
        }

        if (field.name === "bannerUrl") {
          return (
            <StoreBannerCard
              key={field.name}
              store={marketplaceStoreData}
              onBannerUrlChange={handleBannerUrlChange}
            />
          );
        }

        return (
          <RegistrationInputField key={field.name} field={field} form={form} />
        );
      })}
    </form>
  );
}

export default ShopSetup;
