import React from "react";
import { socialFields } from "./formFields";
import RegistrationInputField from "./RegistrationInputField";
type SocialFieldsProps = {
  form: any; // You can replace 'any' with the specific type of your form object
};
function SocialFields({ form }: SocialFieldsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Social & Contact</h2>
      <div className="grid gap-5">
        {socialFields.map((field) => (
          <RegistrationInputField
            key={field.name}
            field={field}
            register={form.register}
            setValue={form.setValue}
            watch={form.watch}
          />
        ))}
      </div>
    </div>
  );
}

export default SocialFields;
