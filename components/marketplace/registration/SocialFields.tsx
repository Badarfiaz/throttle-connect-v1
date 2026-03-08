import React from "react";
import { createSocialFields } from "./formFields";
import RegistrationInputField from "./RegistrationInputField";

type SocialFieldsProps = {
  form: any;
  prefix?: string; // optional prefix
};

export default function SocialFields({ form, prefix }: SocialFieldsProps) {
  const socialFields = createSocialFields(prefix);

  return (
    <div className="grid gap-5">
      {socialFields.map((field) => (
        <RegistrationInputField key={field.name} field={field} form={form} />
      ))}
    </div>
  );
}