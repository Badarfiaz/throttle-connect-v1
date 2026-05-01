"use client";

import React, { useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import AnimatedStep from "@/components/shared/registration/AnimatedStep";
import SidebarRegistration from "@/components/shared/registration/SidebarRegistration";
import StepNavigationButtons from "@/components/shared/registration/StepNavigationButtons";
import RegistrationHeader from "@/components/shared/registration/RegistrationHeader";
import {
  RegistrationCardStyles,
  RegistrationContainerStyles,
} from "@/components/shared/registration/registrationStyles";
import { AlertDialogShared } from "@/components/shared/AlertDialogShared";
import PersonalInfo from "./PersonalInfo";
import VehicleDetails from "./VehicleDetails";
import EmergencyDetails from "./EmergencyDetails";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { useAppSelector } from "@/app/redux/hooks";
import { MemberProfile, MemberRegistrationFormValues } from "@/types/member";

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

export default function MemberRegistration() {
  const [collectedData, setCollectedData] = useState<
    Partial<MemberRegistrationFormValues>
  >({});
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const forms: UseFormReturn<MemberRegistrationFormValues>[] = [
    useForm<MemberRegistrationFormValues>(),
    useForm<MemberRegistrationFormValues>(),
    useForm<MemberRegistrationFormValues>(),
  ];
  const currentForm = forms[currentStep];

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = currentForm.handleSubmit(async (data) => {
    const mergedData = { ...collectedData, ...data };
    const isLastStep = currentStep === steps.length - 1;
    const mergedDataWithCompletion: Partial<MemberRegistrationFormValues> = {
      ...mergedData,
      completed: isLastStep,
    };

    setCollectedData(mergedDataWithCompletion);
    console.log("mergedData", mergedDataWithCompletion);
    console.log("collectedData", collectedData);
    if (!isLastStep) {
      setDirection(1);
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      return;
    }

    try {
      setSubmitting(true);

      if (!user) {
        toast.error("Authentication required", {
          description: "Please sign in to complete registration.",
        });
        return;
      }

      // Transform the form data to match the required Firebase structure
      // Map form values to the Firestore member document structure
      const memberData: MemberProfile = {
        userId: user.userId,
        completed: mergedDataWithCompletion.completed ?? false,
        memberName: mergedData.memberName || "",
        phone: mergedData.phone || "",
        whatsapp: mergedData.whatsapp || "",
        location: {
          city: mergedData.city || "",
          province: mergedData.province || "",
          area: mergedData.area || "",
        },
        vehicle: {
          type: mergedData.vehicleType || "",
          brand: mergedData.vehicleBrand || "",
          model: mergedData.vehicleModel || "",
          year: mergedData.ModelYear || "",
          images: mergedData.vehicleImages || "",
        },
        emergencyContact: {
          name: mergedData.emergencyContactName || "",
          phone: mergedData.emergencyContactPhone || "",
          bloodGroup: mergedData.bloodGroup || "",
        },
        profileImage: mergedData.profileImage || "",
        experienceYears: mergedData.experienceYears || "",
        interests: mergedData.interests || [],
        drivingLicenseImage:
          mergedData.drivingLicenseImage || mergedData.documents || "",
        createdAt: new Date().toISOString(),
        ownerUid: user.userId,
      };

      // Save to Firestore using userId as document ID
      const memberDocRef = doc(db, "members", user.userId);
      await setDoc(memberDocRef, memberData);

      console.log("Member onboarding payload saved to Firebase:", memberData);

      toast.success("Registration complete!", {
        description: "Your member profile has been saved successfully.",
      });

      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Error saving member data:", error);
      toast.error("Registration failed", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
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

      <AlertDialogShared
        isOpen={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        dialogTitle="Welcome to the Throttle connect!"
        dialogDescription="Your member profile has been successfully saved!"
        routeLink="/"
        closeRouteLink="/"
        btnLabel="Go to home"
      />
    </div>
  );
}
