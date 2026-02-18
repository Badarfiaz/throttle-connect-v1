import React from "react";
import { shopDetailsFields } from "./formFields";
import RegistrationInputField from "./RegistrationInputField";
type ShopDetailsProps = {
  form: any; // You can replace 'any' with the specific type of your form object
};
function ShopDetails({ form }: ShopDetailsProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Shop Details</h2>
      <div className="grid gap-5">
        {shopDetailsFields.map((field) => (
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

export default ShopDetails;
