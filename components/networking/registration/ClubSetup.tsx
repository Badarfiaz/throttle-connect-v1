import React from "react";
import RegistrationInputField from "../../marketplace/registration/RegistrationInputField";
import { clubSetupFields } from "./formFields";

type ClubSetupProps = {
  form: any;
};

function ClubSetup({ form }: ClubSetupProps) {
  return (
    <div className="grid gap-5">
      {clubSetupFields.map((field) => (
        <RegistrationInputField key={field.name} field={field} form={form} />
      ))}
    </div>
  );
}

export default ClubSetup;