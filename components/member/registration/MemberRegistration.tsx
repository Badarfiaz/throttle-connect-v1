"use client";

import React, { useRef, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import AnimatedStep from "@/components/shared/registration/AnimatedStep";
import SidebarRegistration from "@/components/shared/registration/SidebarRegistration";
import StepNavigationButtons from "@/components/shared/registration/StepNavigationButtons";
import RegistrationHeader from "@/components/shared/registration/RegistrationHeader";
import {
  RegistrationCardStyles,
  RegistrationContainerStyles,
} from "@/components/shared/registration/registrationStyles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PersonalInfo from "./PersonalInfo";
import VehicleDetails from "./VehicleDetails";
import EmergencyDetails from "./EmergencyDetails";
import { MemberProfile } from "./types";

const steps = [
  {
    key: 0,
    name: "Personal Info",
    description: "Tell us about yourself",
  },
  {
    key: 1,
    name: "Vehicle Details",
    description: "Share your ride information",
  },
  {
    key: 2,
    name: "Safety & Emergency",
    description: "Add documents and emergency contact",
  },
];

const normalizeImages = (
  value: MemberProfile["vehicle"]["images"],
): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item) => item && item.trim().length > 0);
  }

  if (typeof value === "string") {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
};

export default function MemberRegistration() {
  const [collectedData, setCollectedData] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const forms: UseFormReturn<MemberProfile>[] = [
    useForm<MemberProfile>(),
    useForm<MemberProfile>(),
    useForm<MemberProfile>(),
  ];
  const currentForm = forms[currentStep];

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = currentForm.handleSubmit(async (data) => {
    const mergedData = { ...collectedData, ...data };
    const isLastStep = currentStep === steps.length - 1;

    setCollectedData(mergedData);

    if (!isLastStep) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      return;
    }

    try {
      setSubmitting(true);
      //   await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Member onboarding payload:", mergedData);
      setIsSuccessOpen(true);
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className={RegistrationContainerStyles}>
      <div className={RegistrationCardStyles}>
        <SidebarRegistration
          steps={steps}
          currentStep={currentStep}
          title="Member"
          subtitle="Complete your rider profile"
          supportNote="Need help? Reach out to the riders' desk anytime."
        />
        <div className="flex-1 p-6 md:p-12 flex flex-col relative overflow-hidden">
          <div className="flex-1 relative">
            <AnimatedStep direction={direction} stepKey={currentStep}>
              <RegistrationHeader currentStep={currentStep} steps={steps} />
              <div className="flex-1 overflow-y-auto pr-2 -mr-2 scrollbar-none">
                <div className="py-2">
                  {currentStep === 0 && <PersonalInfo form={currentForm} />}
                  {currentStep === 1 && <VehicleDetails form={currentForm} />}
                  {currentStep === 2 && <EmergencyDetails form={currentForm} />}
                </div>
              </div>
            </AnimatedStep>
          </div>

          <StepNavigationButtons
            currentStep={currentStep}
            steps={steps}
            onPrevious={handlePrevious}
            onNext={handleNext}
            submitting={submitting}
          />
        </div>
      </div>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Member Profile Saved</DialogTitle>
            <DialogDescription>
              We have captured your onboarding details locally. Backend
              integration will wire this up soon.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-3 sm:flex-row">
            <Button
              variant="ghost"
              className="w-full"
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
