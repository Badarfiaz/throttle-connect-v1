"use client";

import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import AnimatedStep from "../../shared/registration/AnimatedStep";
import { useOnboardStep } from "@/hooks/useOnboardStep";
import SidebarRegistration from "@/components/shared/registration/SidebarRegistration";
import StepNavigationButtons from "../../shared/registration/StepNavigationButtons";
import RegistrationHeader from "@/components/shared/registration/RegistrationHeader";
import {
  RegistrationCardStyles,
  RegistrationContainerStyles,
} from "@/components/shared/registration/registrationStyles";

import ClubSetup from "./ClubSetup";
import ClubDetails from "./ClubDetails";
import SocialFields from "../../marketplace/registration/SocialFields"; // reusable component

// Step definitions
const steps = [
  {
    key: 0,
    name: "Club Setup",
    description: "Basic information about your club",
  },
  {
    key: 1,
    name: "Club Details",
    description: "Tell us about your club activities",
  },
  {
    key: 2,
    name: "Social & Contact",
    description: "How members can reach you",
  },
];

export default function NetworkingRegistration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [collectedData, setCollectedData] = useState<Record<string, any>>({});
  const [completed, setCompleted] = useState(false);

  // One form per step
  const forms: UseFormReturn[] = [useForm(), useForm(), useForm()];
  const currentForm = forms[currentStep];

  const { submitStep, submitting } = useOnboardStep({ pageType: "networking" });

  // Next button handler
  const onNext = currentForm.handleSubmit(async (data) => {
    const mergedData = { ...collectedData, ...data };
    const isLastStep = currentStep === steps.length - 1;

    setCollectedData(mergedData);

    try {
      if (isLastStep) {
        // Final submission
        console.log("Final Submission:", mergedData);
        await submitStep(mergedData, { completed: true });
        setCompleted(true);
        return;
      }

      await submitStep(mergedData, { completed: false });
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } catch (error) {
      console.error("Error submitting step:", error);
    }
  });

  // Previous button handler
  const onPrevious = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className={RegistrationContainerStyles}>
      <div className={RegistrationCardStyles}>
        <SidebarRegistration steps={steps} currentStep={currentStep} />
        <div className="flex-1 p-6 md:p-12 flex flex-col relative overflow-hidden">
          <div className="flex-1 relative">
            <AnimatedStep direction={direction} stepKey={currentStep}>
              <RegistrationHeader currentStep={currentStep} steps={steps} />
              <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-none">
                <div className="py-2">
                  {completed ? (
                    // ✅ Thank You Screen without any button
                    <div className="text-center py-20">
                      <h2 className="text-3xl font-bold mb-4">
                        Thank you for registering!
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Your club registration has been successfully submitted.
                      </p>
                    </div>
                  ) : (
                    <>
                      {currentStep === 0 && <ClubSetup form={currentForm} />}
                      {currentStep === 1 && <ClubDetails form={currentForm} />}
                      {currentStep === 2 && <SocialFields form={currentForm} />}
                    </>
                  )}
                </div>
              </div>
            </AnimatedStep>
          </div>

          {!completed && (
            <StepNavigationButtons
              currentStep={currentStep}
              steps={steps}
              onPrevious={onPrevious}
              onNext={onNext}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}
