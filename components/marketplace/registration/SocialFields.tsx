import React from "react";
import { socialFields } from "./formFields";
import RegistrationInputField from "./RegistrationInputField";
type SocialFieldsProps = {
  form: any; // You can replace 'any' with the specific type from react-hook-form if needed
};
function SocialFields({ form }: SocialFieldsProps) {
  const handleSubmit = () => {
    // Handle form submission logic here
  };
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Social & Contact</h2>
      <div className="grid gap-5">
        {socialFields.map((field) => (
          <RegistrationInputField key={field.name} field={field} form={form} />
        ))}
      </div>
    </div>
  );
}

export default SocialFields;
