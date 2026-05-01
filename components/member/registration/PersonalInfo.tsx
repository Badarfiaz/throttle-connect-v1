import React from "react";
import type { UseFormReturn } from "react-hook-form";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import ImageUploadField from "@/components/shared/ImageUploadField";
import { personalInfoFields } from "./formFields";
import type { MemberRegistrationFormValues } from "@/types/member";
import { auth } from "@/firebase";

type PersonalInfoProps = {
  form: UseFormReturn<MemberRegistrationFormValues>;
};

export default function PersonalInfo({ form }: PersonalInfoProps) {
  const userId = auth.currentUser?.uid || "guest";

  return (
    <div className="grid gap-5">
      {personalInfoFields.map((field) => {
        // Use ImageUploadField for profileImage
        if (field.name === "profileImage") {
          return (
            <ImageUploadField
              key={field.name}
              label={field.label}
              value={form.watch("profileImage")}
              onChange={(url) => form.setValue("profileImage", url)}
              ownerId={userId}
              folder="profile"
              basePath="members"
              placeholder="Upload your profile image"
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
