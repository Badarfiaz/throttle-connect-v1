import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MarketplaceStore } from "@/types/marketplace";
import { socialFields } from "@/components/marketplace/registration/formFields";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";

type StaticProfile = {
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
};

type Props = {
  store: MarketplaceStore | null;
  storeInitials: string;
  staticProfile: StaticProfile;
};

export default function StoreLogoCard({
  store,
  storeInitials,
  staticProfile,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Store Logo</h2>
      <p className="text-sm text-slate-500">
        Add a brand mark to help buyers recognize your store.
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
          {storeInitials}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {store?.title ?? "Throttle Auto Hub"}
          </p>
          <p className="text-xs text-slate-500">Recommended 512x512px</p>
        </div>
        <Button className="ml-auto" size="sm" variant="outline">
          Upload Logo
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        {socialFields.map((field) => (
          <RegistrationInputField
            key={field.name}
            field={field}
            isDashboard
            defaultValue={
              field.name === "contactMethod"
                ? (store?.contactMethod ?? "")
                : staticProfile[field.name as keyof StaticProfile]
            }
          />
        ))}

        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Social Links
          </label>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Input
              defaultValue={staticProfile.facebook}
              placeholder="Facebook URL"
            />
            <Input
              defaultValue={staticProfile.instagram}
              placeholder="Instagram URL"
            />
            <Input
              defaultValue={staticProfile.tiktok}
              placeholder="TikTok URL"
            />
            <Input
              defaultValue={staticProfile.whatsapp}
              placeholder="WhatsApp URL"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
