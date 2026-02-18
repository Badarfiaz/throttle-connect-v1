"use client";

import { useForm } from "react-hook-form";
import Title from "@/components/shared/Title";
import { Button } from "@/components/ui/button";
import ShopSetup from "./ShopSetup";
import ShopDetails from "./ShopDetails";
import SocialFields from "./SocialFields";
import React from "react";

export default function MarketplaceRegistration() {
  const [currentStep, setCurrentStep] = React.useState(0);

  const forms = [
    useForm(), // Step 1
    useForm(), // Step 2
    useForm(), // Step 3
  ];

  const steps = [
    { name: "Shop Setup", key: 1 },
    { name: "Shop Details", key: 2 },
    { name: "Social & Contact", key: 3 },
  ];

  const currentForm = forms[currentStep];

  const onNext = currentForm.handleSubmit((data) => {
    console.log(`STEP ${currentStep + 1} DATA:`, data);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  });

  const onPrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen bg-background flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-card shadow-xl rounded-2xl p-8">
        <Title title="Marketplace Registration" />

        {/* Render the active step */}
        {currentStep === 0 && <ShopSetup form={currentForm} />}
        {currentStep === 1 && <ShopDetails form={currentForm} />}
        {currentStep === 2 && <SocialFields form={currentForm} />}

        <div className="flex justify-end mt-6 gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <Button onClick={onNext}>
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
