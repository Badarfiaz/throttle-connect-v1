"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useOnboardStep } from "@/hooks/useOnboardStep";
import ShopSetup from "./ShopSetup";
import ShopDetails from "./ShopDetails";
import SocialFields from "./SocialFields";
import { Button } from "@/components/ui/button";

// Steps configuration
const steps = [
  {
    name: "Shop Setup",
    key: 0,
    description: "Basic information about your shop",
  },
  {
    name: "Shop Details",
    key: 1,
    description: "Tell us more about what you sell",
  },
  {
    name: "Social & Contact",
    key: 2,
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
        <div className="w-full md:w-1/3 bg-primary/5 p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-primary via-transparent to-transparent rounded-full blur-3xl" />
          </div>

          <div className="z-10 w-full">
            <div className="mb-10 text-center md:text-left">
              <h1 className="text-2xl font-bold text-primary">Marketplace</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Setup your store
              </p>
            </div>

            {/* Vertical Stepper for Desktop */}
            <div className="hidden md:flex flex-col gap-6">
              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div
                    key={step.key}
                    className="flex items-start gap-4 relative"
                  >
                    {/* Step Line */}
                    {index !== steps.length - 1 && (
                      <div
                        className={`absolute left-[15px] top-8 w-[2px] h-[calc(100%+24px)] -z-10 transition-colors duration-500 ${isCompleted ? "bg-primary" : "bg-border"}`}
                      />
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 shrink-0
                        ${
                          isActive
                            ? "bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30"
                            : isCompleted
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground border border-border"
                        }
                      `}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                    </div>

                    <div
                      className={`transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}
                    >
                      <h3
                        className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}
                      >
                        {step.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Horizontal Stepper for Mobile */}
            <div className="md:hidden flex justify-between items-center mb-2 px-2 relative w-full">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
              />

              {steps.map((step, index) => {
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                return (
                  <div
                    key={step.key}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${isActive ? "bg-primary text-primary-foreground scale-110 ring-4 ring-background" : isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"}`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-auto hidden md:block z-10">
            <div className="p-4 bg-background/50 backdrop-blur-sm rounded-xl border border-border/50 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Need Help?</p>
              <p>Contact support if you have trouble setting up your store.</p>
            </div>
          </div>
        </div>

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
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={onPrevious}
              disabled={currentStep === 0 || submitting}
              className={`text-muted-foreground hover:text-foreground transition-all pl-0 hover:bg-transparent ${currentStep === 0 ? "invisible" : ""}`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <Button
              onClick={onNext}
              disabled={submitting}
              className="px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 rounded-full transition-all hover:scale-105 active:scale-95"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>
                    {currentStep === steps.length - 1
                      ? "Complete Setup"
                      : "Continue"}
                  </span>
                  {currentStep !== steps.length - 1 && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
