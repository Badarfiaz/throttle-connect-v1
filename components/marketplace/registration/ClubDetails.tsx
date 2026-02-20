import React from "react";
import RegistrationInputField from "./RegistrationInputField";
import { clubDetailsFields } from "./formFields";

function ClubDetails({ form }: { form: any }) {
  return (
    <div className="grid gap-5">
      {clubDetailsFields.map((field) => (
        <RegistrationInputField key={field.name} field={field} form={form} />
      ))}
    </div>
  );
}

export default ClubDetails;