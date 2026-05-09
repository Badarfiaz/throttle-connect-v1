import {
  shopDetailsFields,
  socialFields,
} from "@/components/marketplace/registration/formFields";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import DashboardWrapper from "@/components/shared/DashboardWrapper";
import type { UseFormReturn } from "react-hook-form";

type Props = {
  form?: UseFormReturn<any>;
};

export default function ContactLocationCard({ form }: Props) {
  return (
    <DashboardWrapper
      title="Contact & Location"
      description="Provide your store's contact details and location information to help customers reach you easily."
    >
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {shopDetailsFields.map((field) => (
          <RegistrationInputField key={field.name} field={field} form={form} />
        ))}
      </div>
    </DashboardWrapper>
  );
}
