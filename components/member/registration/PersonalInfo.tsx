import React from "react";
import type { UseFormReturn } from "react-hook-form";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import { personalInfoFields } from "./formFields";
import type { MemberProfile } from "./types";

type PersonalInfoProps = {
  form: UseFormReturn<MemberProfile>;
};

export default function PersonalInfo({ form }: PersonalInfoProps) {
  return (
    <div className="grid gap-5">
      {personalInfoFields.map((field) => (
        <RegistrationInputField key={field.name} field={field} form={form} />
      ))}
    </div>
  );
}
