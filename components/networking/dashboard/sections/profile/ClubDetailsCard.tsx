import { clubDetailsFields } from "@/components/networking/registration/formFields";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import type { UseFormReturn } from "react-hook-form";

type Props = {
  form?: UseFormReturn<any>;
};

export default function ClubDetailsCard({ form }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Club Details</h2>
      <p className="text-sm text-slate-500">
        Tell us more about your club and what it represents.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {clubDetailsFields.map((field) => (
          <RegistrationInputField key={field.name} field={field} form={form} />
        ))}
      </div>
    </div>
  );
}
