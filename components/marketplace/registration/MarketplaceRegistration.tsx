"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import AnimatedStep from "../../shared/registration/AnimatedStep";
import { useOnboardStep } from "@/hooks/useOnboardStep";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { setMarketplace } from "@/app/redux/features/marketplaceSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ShopSetup from "./ShopSetup";
import ShopDetails from "./ShopDetails";
import SocialFields from "./SocialFields";
import SidebarRegistration from "@/components/shared/registration/SidebarRegistration";
import StepNavigationButtons from "../../shared/registration/StepNavigationButtons";
import RegistrationHeader from "@/components/shared/registration/RegistrationHeader";
import {
  RegistrationCardStyles,
  RegistrationContainerStyles,
} from "@/components/shared/registration/registrationStyles";

// Steps configuration
const steps = [
  {
    key: 0,
    name: "Shop Setup",
    description: "Basic information about your shop",
  },
  {
    key: 1,
    name: "Shop Details",
    description: "Tell us more about what you sell",
  },
  {
    key: 2,
    name: "Social & Contact",
    description: "How customers can reach you",
  },
];

export default function MarketplaceRegistration({}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const marketplaceStore = useAppSelector((state) => state.marketplace.store);

  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // For slide animation direction
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [collectedData, setCollectedData] = useState<Record<string, unknown>>(
    marketplaceStore || {},
  );
  const marketplaceData = useAppSelector((state) => state.marketplace.store);
  console.log("marketplace data", marketplaceData);

  // One form instance per step to manage validation independently
  // Initialize forms with default values from Redux store
  const forms = [
    useForm({ defaultValues: marketplaceStore || {} }),
    useForm({ defaultValues: marketplaceStore || {} }),
    useForm({ defaultValues: marketplaceStore || {} }),
  ];
  const currentForm = forms[currentStep];

  // Update form values when marketplaceStore changes or when step changes
  useEffect(() => {
    if (marketplaceStore && !marketplaceStore.completed) {
      // Reset all forms with the store data if registration is not completed
      forms.forEach((form) => {
        form.reset(marketplaceStore);
      });
    }
  }, [marketplaceStore]);

  const { submitStep, submitting } = useOnboardStep({
    pageType: "marketplace",
  });

  const onNext = currentForm.handleSubmit(async (data) => {
    const mergedData = { ...collectedData, ...data };
    const isLastStep = currentStep === steps.length - 1;

    setCollectedData(mergedData);

    // Dispatch to marketplace slice on every step
    dispatch(
      setMarketplace({
        ...mergedData,
        completed: isLastStep,
      }),
    );

    try {
      if (isLastStep) {
        console.log("Final Submission:", mergedData);
      }

      await submitStep(mergedData, { completed: isLastStep });

      if (!isLastStep) {
        setDirection(1);
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      } else {
        // Registration completed, show success modal
        setIsSuccessOpen(true);
      }
    } catch (error) {
      console.error("Error submitting step:", error);
    }
  });

  const onPrevious = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className={RegistrationContainerStyles}>
      <div className={RegistrationCardStyles}>
        {/* Sidebar / Progress Section */}
        <SidebarRegistration steps={steps} currentStep={currentStep} />
        {/* Content Area */}
        <div className="flex-1 p-6 md:p-12 flex flex-col relative overflow-hidden">
          <div className="flex-1 relative">
            <AnimatedStep direction={direction} stepKey={currentStep}>
              <RegistrationHeader currentStep={currentStep} steps={steps} />
              <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-none">
                <div className="py-2">
                  {currentStep === 0 && <ShopSetup form={currentForm} />}
                  {currentStep === 1 && <ShopDetails form={currentForm} />}
                  {currentStep === 2 && <SocialFields form={currentForm} />}
                </div>
              </div>
            </AnimatedStep>
          </div>

          {/* Navigation Buttons */}
          <StepNavigationButtons
            currentStep={currentStep}
            steps={steps}
            onPrevious={onPrevious}
            onNext={onNext}
            submitting={submitting}
          />
        </div>
      </div>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Registration Complete</DialogTitle>
            <DialogDescription>
              Your marketplace registration has been submitted successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="w-full sm:w-auto"
              onClick={() => router.push("/marketplace")}
            >
              Go to Marketplace
            </Button>
            <Button
              variant="ghost"
              className="w-full sm:w-auto"
              onClick={() => setIsSuccessOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
