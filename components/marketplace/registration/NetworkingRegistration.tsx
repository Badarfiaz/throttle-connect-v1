"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AnimatedStep from "../../shared/registration/AnimatedStep";
import { useOnboardStep } from "@/hooks/useOnboardStep";
import SidebarRegistration from "@/components/shared/registration/SidebarRegistration";
import StepNavigationButtons from "../../shared/registration/StepNavigationButtons";
import RegistrationHeader from "@/components/shared/registration/RegistrationHeader";
import { RegistrationCardStyles, RegistrationContainerStyles } from "@/components/shared/registration/registrationStyles";

import ClubSetup from "./ClubSetup";
import ClubDetails from "./ClubDetails";
import SocialFields from "./SocialFields"; // same reusable component

const steps = [
  { key: 0, name: "Club Setup", description: "Basic information about your club" },
  { key: 1, name: "Club Details", description: "Tell us about your club activities" },
  { key: 2, name: "Social & Contact", description: "How members can reach you" },
];

export default function NetworkingRegistration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [collectedData, setCollectedData] = useState<Record<string, unknown>>({});

  const forms = [useForm(), useForm(), useForm()];
  const currentForm = forms[currentStep];

  const { submitStep, submitting } = useOnboardStep({ pageType: "networking" });

  const onNext = currentForm.handleSubmit(async (data) => {
    const mergedData = { ...collectedData, ...data };
    const isLastStep = currentStep === steps.length - 1;

    setCollectedData(mergedData);

    try {
      if (isLastStep) console.log("Final Submission:", mergedData);
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
    <div className={RegistrationContainerStyles}>
      <div className={RegistrationCardStyles}>
        <SidebarRegistration steps={steps} currentStep={currentStep} />
        <div className="flex-1 p-6 md:p-12 flex flex-col relative overflow-hidden">
          <div className="flex-1 relative">
            <AnimatedStep direction={direction} stepKey={currentStep}>
              <RegistrationHeader currentStep={currentStep} steps={steps} />
              <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-none">
                <div className="py-2">
                  {currentStep === 0 && <ClubSetup form={currentForm} />}
                  {currentStep === 1 && <ClubDetails form={currentForm} />}
                  {currentStep === 2 && <SocialFields form={currentForm} prefix="club" />}
                </div>
              </div>
            </AnimatedStep>
          </div>
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