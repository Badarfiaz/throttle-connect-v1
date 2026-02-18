"use client";

import { useForm } from "react-hook-form";
import { shopDetailsFields, shopSetupFields, socialFields } from "./formFields";
import Title from "@/components/shared/Title";
import { Button } from "@/components/ui/button";
import ShopSetup from "./ShopSetup";
import ShopDetails from "./ShopDetails";
import SocialFields from "./SocialFields";
import React from "react";

export default function MarketplaceRegistration() {
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    { name: "Shop Setup", key: 1 },
    { name: "Shop Details", key: 2 },
    { name: "Social & Contact", key: 3 },
  ];

  return (
    <div className="min-h-screen bg-background flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-card shadow-xl rounded-2xl p-8">
        <Title title="Marketplace Registration" />
        {currentStep === 0 && <ShopSetup />}
        {currentStep === 1 && <ShopDetails />}
        {currentStep === 2 && <SocialFields />}
        <div className="flex justify-end mt-6 gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={() =>
              setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
            }
            disabled={currentStep === steps.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
