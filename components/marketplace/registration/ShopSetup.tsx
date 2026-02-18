import React from "react";
import { shopSetupFields } from "./formFields";
import RegistrationInputField from "./RegistrationInputField";
type ShopSetupProps = {
  form: any; // You can replace 'any' with the specific type of your form object
};
function ShopSetup({ form }: ShopSetupProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Shop Setup</h2>
      <div className="grid gap-5">
        {shopSetupFields.map((field) => (
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

export default ShopSetup;
