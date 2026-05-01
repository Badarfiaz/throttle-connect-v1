"use client";

import OnboardingCard from "@/components/shared/OnboardingCard";
import { AlertDialogShared } from "@/components/shared/AlertDialogShared";
import { useAppSelector } from "@/app/redux/hooks";
import { useState, useEffect } from "react";

export default function RegistrationClientSide() {
  const user = useAppSelector((state) => state.auth.user);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "marketplace" | "networking" | null
  >(null);

  const isMarketplaceCompleted = user?.marketplace?.completed;
  const isNetworkingCompleted = user?.networking?.completed;

  const getAlertContent = (type: "marketplace" | "networking" | null) => {
    if (type === "marketplace") {
      return {
        title: "Already registered as marketplace vendor",
        description:
          "You have already completed the marketplace vendor registration. Please proceed to the marketplace to manage your store or explore other features.",
        routeLink: "/marketplace",
        btnLabel: "Go to marketplace",
      };
    }
    if (type === "networking") {
      return {
        title: "Already joined automotive networking",
        description:
          "You have already joined the automotive networking. Please proceed to the networking section to connect with enthusiasts, clubs, and events.",
        routeLink: "/networking",
        btnLabel: "Go to networking",
      };
    }
    return {
      title: "",
      description: "",
      routeLink: "",
      btnLabel: "",
    };
  };

  const alertContent = getAlertContent(dialogType);

  const handleMarketplaceClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMarketplaceCompleted) {
      e.preventDefault();
      setDialogType("marketplace");
      setIsDialogOpen(true);
    }
  };

  const handleNetworkingClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isNetworkingCompleted) {
      e.preventDefault();
      setDialogType("networking");
      setIsDialogOpen(true);
    }
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
          onButtonClick={handleNetworkingClick}
        />

        <OnboardingCard
          icon="🚗"
          title="Join as member"
          description="Become a member to connect with car & bike enthusiasts, clubs, events, and mechanics."
          benefits={["member"]}
          buttonText="Join as Member"
          link="/member-registration"
        />
      </section>

      <AlertDialogShared
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        dialogTitle={alertContent.title}
        dialogDescription={alertContent.description}
        routeLink={alertContent.routeLink}
        btnLabel={alertContent.btnLabel}
      />
    </>
  );
}
