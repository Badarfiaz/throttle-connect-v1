"use client";

import React, { useState } from "react";
import Link from "next/link";
import OnboardingCard from "@/components/shared/OnboardingCard";
import { useAppSelector } from "@/app/redux/hooks";

import { AlertDialogShared } from "@/components/shared/AlertDialogShared";

export default function RegistrationPage() {
  const marketplaceCompleted = useAppSelector((state) => state.auth.user);
  console.log("marketplaceCompleted:", marketplaceCompleted);
  const [isMarketplaceCompletedOpen, setIsMarketplaceCompletedOpen] =
    useState(false);

  const isMarketplaceCompleted = Boolean(marketplaceCompleted);
  console.log("Marketplace completed status:", isMarketplaceCompleted);
  const handleMarketplaceClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!isMarketplaceCompleted) return;
    event.preventDefault();
    setIsMarketplaceCompletedOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-6 py-20">
      {/* Heading */}
      <section className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
          Get Started with{" "}
          <span className="text-primary">Throttle Connect</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose how you want to continue
        </p>
      </section>

      {/* Cards */}
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
          link="/networking/registration"
        />
      </section>

      {/* Continue as Guest */}
      <div className="text-center mt-20">
        <p className="text-sm text-muted-foreground mb-2">Just exploring?</p>
        <Link
          href="/"
          className="
            inline-flex items-center gap-1
            text-primary font-medium
            hover:underline
          "
        >
          Continue as Guest →
        </Link>
      </div>
      <AlertDialogShared
        isOpen={isMarketplaceCompletedOpen}
        onOpenChange={setIsMarketplaceCompletedOpen}
        dialogTitle="Already registured as marketplace vendor"
        dialogDescription="You have already completed the marketplace vendor registration. Please proceed to the marketplace to manage your store or explore other features."
        routeLink="/marketplace"
        btnLabel="Go to marketplace"
      />
    </div>
  );
}
