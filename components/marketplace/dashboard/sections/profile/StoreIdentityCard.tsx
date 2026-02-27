import { Button } from "@/components/ui/button";
import {
  shopSetupFields,
  type FieldConfig,
} from "@/components/marketplace/registration/formFields";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import type { UseFormReturn } from "react-hook-form";

type Props = {
  form?: UseFormReturn<any>;
  onSave?: () => void;
  saving?: boolean;
};

export default function StoreIdentityCard({ form, onSave, saving }: Props) {
  const fields: FieldConfig[] = [...shopSetupFields];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Store Identity
          </h2>
          <p className="text-sm text-slate-500">
            Update your public-facing details.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          type="button"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <RegistrationInputField key={field.name} field={field} form={form} />
        ))}
      </div>
    </div>
  );
}
