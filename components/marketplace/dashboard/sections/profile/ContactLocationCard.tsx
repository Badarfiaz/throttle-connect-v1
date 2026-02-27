import { shopDetailsFields } from "@/components/marketplace/registration/formFields";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import type { UseFormReturn } from "react-hook-form";

type Props = {
  form?: UseFormReturn<any>;
};

export default function ContactLocationCard({ form }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Contact & Location
      </h2>
      <p className="text-sm text-slate-500">
        Manage how buyers reach you and where you operate.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {shopDetailsFields.map((field) => (
          <RegistrationInputField key={field.name} field={field} form={form} />
        ))}
      </div>
    </div>
  );
}
