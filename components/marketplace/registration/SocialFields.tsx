import React from "react";
import RegistrationInputField from "./RegistrationInputField";
import { socialFields } from "./formFields";

type SocialFieldsProps = {
  form: any;
};

export default function SocialFields({ form }: SocialFieldsProps) {
  return (
    <div className="grid gap-5">
      {socialFields.map((field) => (
        <RegistrationInputField key={field.name} field={field} form={form} />
      ))}
    </div>
  );
}
