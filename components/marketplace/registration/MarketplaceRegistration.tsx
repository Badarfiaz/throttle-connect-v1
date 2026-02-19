"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sidebar } from "lucide-react";
import { useOnboardStep } from "@/hooks/useOnboardStep";
import ShopSetup from "./ShopSetup";
import ShopDetails from "./ShopDetails";
import SocialFields from "./SocialFields";
import { Button } from "@/components/ui/button";
import SidebarRegistration from "@/components/shared/SidebarRegistration";
import StepNavigationButtons from "./StepNavigationButtons";

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

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export default function MarketplaceRegistration({}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // For slide animation direction
  const [collectedData, setCollectedData] = useState<Record<string, unknown>>(
    {},
  );

  // One form instance per step to manage validation independently
  const forms = [useForm(), useForm(), useForm()];
  const currentForm = forms[currentStep];

  const { submitStep, submitting } = useOnboardStep({
    pageType: "marketplace",
  });

  const onNext = currentForm.handleSubmit(async (data) => {
    const mergedData = { ...collectedData, ...data };
    const isLastStep = currentStep === steps.length - 1;

    setCollectedData(mergedData);

    try {
      if (isLastStep) {
        console.log("Final Submission:", mergedData);
      }

      await submitStep(mergedData, { completed: isLastStep });

      if (!isLastStep) {
        setDirection(1);
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-5xl bg-background/80 backdrop-blur-xl border border-border/50 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar / Progress Section */}
        <SidebarRegistration steps={steps} currentStep={currentStep} />
        {/* Content Area */}
        <div className="flex-1 p-6 md:p-12 flex flex-col relative overflow-hidden">
          <div className="flex-1 relative">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentStep}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full h-full flex flex-col"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {steps[currentStep].name}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {steps[currentStep].description}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-none">
                  {/* Ensuring inner components take full width and handle their layout */}
                  <div className="py-2">
                    {currentStep === 0 && <ShopSetup form={currentForm} />}
                    {currentStep === 1 && <ShopDetails form={currentForm} />}
                    {currentStep === 2 && <SocialFields form={currentForm} />}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
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
    </div>
  );
}
