import React from "react";
import { shopDetailsFields } from "./formFields";
import RegistrationInputField from "./RegistrationInputField";
function ShopDetails() {
  const handleSubmit = () => {
    // Handle form submission logic here
  };
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Shop Details</h2>
      <div className="grid gap-5">
        {shopDetailsFields.map((field) => (
          <RegistrationInputField key={field.name} field={field} />
        ))}
      </div>
    </div>
  );
}

export default ShopDetails;
