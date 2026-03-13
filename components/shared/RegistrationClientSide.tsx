"use client";

import React, { useEffect, useState } from "react";
import OnboardingCard from "@/components/shared/OnboardingCard";
import { AlertDialogShared } from "@/components/shared/AlertDialogShared";
import { useAppSelector } from "@/app/redux/hooks";
import { useMarketplaceStore } from "@/hooks/useMarketplaceStore";

export default function RegistrationClientSide() {
  const user = useAppSelector((state) => state.auth.user);
  const [isMarketplaceCompletedOpen, setIsMarketplaceCompletedOpen] =
    useState(false);

  const ismarkeptlaceCompleted = useMarketplaceStore({
    isCompleted: true,
  });

  const { data: marketplaceStores, fetchMarketplaceStores } =
    ismarkeptlaceCompleted;

  useEffect(() => {
    if (!user) return;
    fetchMarketplaceStores().catch(() => undefined);
  }, [user, fetchMarketplaceStores]);

  const hasMarketplaceCompleted = Boolean(
    marketplaceStores?.some((store) => store?.completed) ||
    user?.marketplace?.completed,
  );

  const handleMarketplaceClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!hasMarketplaceCompleted) return;
    event.preventDefault();
    setIsMarketplaceCompletedOpen(true);
  };

  return (
    <>
      <section
        className="
          grid gap-12 max-w-6xl mx-auto
          md:grid-cols-2
          items-stretch
        "
      >
        <OnboardingCard
          icon="🛒"
          title="Register as Marketplace Vendor"
          description="Sell automotive parts, accessories, and tools to verified buyers across Pakistan."
          benefits={[
            "List your products",
            "Manage orders easily",
            "Increase brand visibility",
            "Connect with verified buyers",
          ]}
          buttonText="Register as Vendor"
          link="/marketplace/registration"
          onButtonClick={handleMarketplaceClick}
        />

        <OnboardingCard
          icon="🚗"
          title="Join Automotive Networking"
          description="Connect with car & bike enthusiasts, clubs, events, and mechanics."
          benefits={[
            "Join or create clubs",
            "Participate in events",
            "Post discussions & updates",
            "Connect with mechanics",
          ]}
          buttonText="Join Networking"
          link="/networking/Club-Registration"
        />
      </section>

      <AlertDialogShared
        isOpen={isMarketplaceCompletedOpen}
        onOpenChange={setIsMarketplaceCompletedOpen}
        dialogTitle="Already registured as marketplace vendor"
        dialogDescription="You have already completed the marketplace vendor registration. Please proceed to the marketplace to manage your store or explore other features."
        routeLink="/marketplace"
        btnLabel="Go to marketplace"
      />
    </>
  );
}
