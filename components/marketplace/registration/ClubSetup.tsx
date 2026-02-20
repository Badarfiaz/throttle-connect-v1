import React from "react";
import RegistrationInputField from "./RegistrationInputField";
import { clubSetupFields } from "./formFields";

function ClubSetup({ form }: { form: any }) {
  return (
    <div className="grid gap-5">
      {clubSetupFields.map((field) => (
        <RegistrationInputField key={field.name} field={field} form={form} />
      ))}
    </div>
  );
}

export default ClubSetup;