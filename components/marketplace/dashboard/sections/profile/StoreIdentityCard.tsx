import { Button } from "@/components/ui/button";
import type { MarketplaceStore } from "@/types/marketplace";
import {
  shopSetupFields,
  type FieldConfig,
} from "@/components/marketplace/registration/formFields";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";

type Props = {
  store: MarketplaceStore | null;
  userEmail?: string | null;
};

export default function StoreIdentityCard({ store, userEmail }: Props) {
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
        <Button size="sm" variant="outline">
          Save changes
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const value =
            store?.[field.name as keyof MarketplaceStore] ??
            (field.name === "email"
              ? userEmail
              : field.name === "phone"
                ? (store?.phone ?? "")
                : "");

          return (
            <RegistrationInputField
              key={field.name}
              field={field}
              isDashboard
              defaultValue={value as string}
            />
          );
        })}
      </div>
    </div>
  );
}
