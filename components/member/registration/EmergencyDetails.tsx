import React from "react";
import type { UseFormReturn } from "react-hook-form";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import ImageUploadField from "@/components/shared/ImageUploadField";
import { verificationFields } from "./formFields";
import type { MemberProfile } from "./types";
import { auth } from "@/firebase";

type EmergencyDetailsProps = {
  form: UseFormReturn<MemberProfile>;
};

export default function EmergencyDetails({ form }: EmergencyDetailsProps) {
  const userId = auth.currentUser?.uid || "guest";

  return (
    <div className="grid gap-5">
      {verificationFields.map((field) => {
        // Use ImageUploadField for documents (driving license)
        if (field.name === "drivingLicenseImage") {
          return (
            <ImageUploadField
              key={field.name}
              label={field.label}
              value={form.watch("drivingLicenseImage")}
              onChange={(url) => form.setValue("drivingLicenseImage", url)}
              ownerId={userId}
              folder="drivingLicenseImage"
              basePath="members"
              placeholder="Upload your driving license"
            />
          );
        }
        
        return (
          <RegistrationInputField key={field.name} field={field} form={form} />
        );
      })}
    </div>
  );
}
