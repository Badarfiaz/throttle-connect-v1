import { Button } from "@/components/ui/button";
import {
  shopSetupFields,
  type FieldConfig,
} from "@/components/marketplace/registration/formFields";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import type { UseFormReturn } from "react-hook-form";
import DashboardWrapper from "@/components/shared/DashboardWrapper";

type Props = {
  form?: UseFormReturn<any>;
  onSave?: () => void;
  saving?: boolean;
};

export default function StoreIdentityCard({ form, onSave, saving }: Props) {
  const fields: FieldConfig[] = [...shopSetupFields];

  return (
    <>
      <DashboardWrapper
        title="Store Identity"
        description="Update your public-facing details."
      >
        <div className="flex items-center justify-between">
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
            <RegistrationInputField
              key={field.name}
              field={field}
              form={form}
            />
          ))}
        </div>
      </DashboardWrapper>
    </>
  );
}
