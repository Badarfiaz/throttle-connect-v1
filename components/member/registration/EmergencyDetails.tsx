import React from "react";
import type { UseFormReturn } from "react-hook-form";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import { verificationFields } from "./formFields";
import type { MemberProfile } from "./types";

type EmergencyDetailsProps = {
  form: UseFormReturn<MemberProfile>;
};

export default function EmergencyDetails({ form }: EmergencyDetailsProps) {
  return (
    <div className="grid gap-5">
      {verificationFields.map((field) => (
        <RegistrationInputField key={field.name} field={field} form={form} />
      ))}
    </div>
  );
}
