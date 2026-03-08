import React from "react";
import RegistrationInputField from "../../marketplace/registration/RegistrationInputField";
import { clubDetailsFields } from "./formFields";

type ClubDetailsProps = {
  form: any;
};

function ClubDetails({ form }: ClubDetailsProps) {
  const clubType = form.watch("clubType");

  return (
    <div className="grid gap-5">
      {/* Show "Specify Club Type" only if Other */}
      {clubType === "other" && (
        <RegistrationInputField
          field={{
            name: "otherClubType",
            label: "Specify Club Type",
            placeholder: "Enter club type",
            required: true,
          }}
          form={form}
        />
      )}

      {clubDetailsFields.map((field) => (
        <RegistrationInputField key={field.name} field={field} form={form} />
      ))}
    </div>
  );
}

export default ClubDetails;