import React from "react";
import RegistrationInputField from "./RegistrationInputField";
import { shopSetupFields } from "./formFields";
type ShopSetupProps = {
  form: any; // You can replace 'any' with the specific type from react-hook-form if needed
};
function ShopSetup({ form }: ShopSetupProps) {
  return (
    <form className="grid gap-5">
      {shopSetupFields.map((field) => (
        <RegistrationInputField key={field.name} field={field} form={form} />
      ))}
    </form>
  );
}

export default ShopSetup;
