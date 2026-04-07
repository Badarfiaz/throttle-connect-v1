import React from "react";
import type { UseFormReturn } from "react-hook-form";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import ImageUploadField from "@/components/shared/ImageUploadField";
import { vehicleFields } from "./formFields";
import type { MemberProfile } from "./types";
import { useAppSelector } from "@/app/redux/hooks";
 
type VehicleDetailsProps = {
  form: UseFormReturn<MemberProfile>;
};

export default function VehicleDetails({ form }: VehicleDetailsProps) {
const userId = useAppSelector((state) => state.auth.user?.id) || "guest";
  return (
    <div className="grid gap-5">
      {vehicleFields.map((field) => {
        // Use ImageUploadField for vehicleImages
        if (field.name === "vehicleImages") {
          return (
            <ImageUploadField
              key={field.name}
              label={field.label}
              value={form.watch("vehicleImages")}
              onChange={(url) => form.setValue("vehicleImages", url)}
              ownerId={userId}
              folder="vehicles"
              basePath="members"
              placeholder="Upload your vehicle image"
            />
          );
        }
        
        return (
          <RegistrationInputField key={field.name} field={field} form={form} />
        );
      })}
    </div>
  );
}
