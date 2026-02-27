import type { MarketplaceStore } from "@/types/marketplace";
import { shopDetailsFields } from "@/components/marketplace/registration/formFields";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";

type Props = {
  store: MarketplaceStore | null;
};

export default function ContactLocationCard({ store }: Props) {
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
          <RegistrationInputField
            key={field.name}
            field={field}
            isDashboard
            defaultValues={
              field.name === "businessType"
                ? Array.isArray(store?.businessType)
                  ? (store?.businessType as unknown as string[])
                  : store?.businessType
                    ? [store.businessType]
                    : []
                : undefined
            }
            defaultValue={
              field.name === "overview"
                ? (store?.overview ?? "")
                : field.name === "location.province"
                  ? (store?.location?.province ?? "")
                  : field.name === "location.city"
                    ? (store?.location?.city ?? "")
                    : field.name === "location.area"
                      ? (store?.location?.area ?? "")
                      : ""
            }
          />
        ))}
      </div>
    </div>
  );
}
