import React from "react";
import { shopSetupFields } from "./formFields";
import RegistrationInputField from "./RegistrationInputField";

function ShopSetup() {
  const handleSubmit = () => {
    // Handle form submission logic here
  };
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Shop Setup</h2>
      <div className="grid gap-5">
        {shopSetupFields.map((field) => (
          <RegistrationInputField key={field.name} field={field} />
        ))}
      </div>
    </div>
  );
}

export default ShopSetup;
