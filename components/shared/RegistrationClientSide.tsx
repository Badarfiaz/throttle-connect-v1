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

  // ✅ NEW STATE (important)
  const [dialogType, setDialogType] = useState<
    "marketplace" | "networking"
  >("marketplace");

  const marketplaceHook = useMarketplaceStore({
    isCompleted: true,
  });

  const { data: marketplaceStores, fetchMarketplaceStores } =
    marketplaceHook;

  useEffect(() => {
    if (!user) return;
    fetchMarketplaceStores().catch(() => undefined);
  }, [user, fetchMarketplaceStores]);

  const hasMarketplaceCompleted = Boolean(
    marketplaceStores?.some((store) => store?.completed) ||
      user?.marketplace?.completed,
  );

  const isNetworkCompleted = true;

  console.log("hasMarketplaceCompleted =>", hasMarketplaceCompleted);

  // ✅ FIXED
  const handleMarketplaceClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!hasMarketplaceCompleted) return;

    event.preventDefault();
    setDialogType("marketplace"); // 👈 important
    setIsMarketplaceCompletedOpen(true);
  };

  // ✅ FIXED
  const handleNetworkClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!isNetworkCompleted) return;

    event.preventDefault();
    setDialogType("networking"); // 👈 important
    setIsMarketplaceCompletedOpen(true);
  };

  return (
    <>
      <section
        className="
          grid gap-12 max-w-6xl mx-auto
          md:grid-cols-3
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
          link="/networking/registration"
          onButtonClick={handleNetworkClick}
        />

        <OnboardingCard
          icon="🚗"
          title="Join as member"
          description="Become a member to connect with car & bike enthusiasts, clubs, events, and mechanics."
          buttonText="Join as Member"
          benefits={["member"]}
          link="/member-registration"
        />
      </section>

      {/* ✅ DYNAMIC DIALOG FIX */}
      <AlertDialogShared
        isOpen={isMarketplaceCompletedOpen}
        onOpenChange={setIsMarketplaceCompletedOpen}
        dialogTitle={
          dialogType === "marketplace"
            ? "Already registered as marketplace vendor"
            : "Already registered in networking"
        }
        dialogDescription={
          dialogType === "marketplace"
            ? "You have already completed the marketplace vendor registration. Please proceed to the marketplace to manage your store or explore other features."
            : "You have already joined networking. Please proceed to explore clubs, events, and connections."
        }
        routeLink={
          dialogType === "marketplace"
            ? "/marketplace"
            : "/networking"
        }
        btnLabel={
          dialogType === "marketplace"
            ? "Go to marketplace"
            : "Go to networking"
        }
      />
    </>
  );
}