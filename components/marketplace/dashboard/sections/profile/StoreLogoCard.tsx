import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MarketplaceStore } from "@/types/marketplace";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import { uploadImage } from "@/ulity/imageUpload";
import type { UseFormReturn } from "react-hook-form";
import { socialFields } from "@/components/marketplace/registration/formFields";

type StaticProfile = {
  website: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
};

type Props = {
  form?: UseFormReturn<any>;
  store: MarketplaceStore | null;
  storeInitials: string;
  staticProfile: StaticProfile;
  onUpdateStore?: (
    id: string,
    input: Record<string, unknown>,
  ) => Promise<MarketplaceStore | null>;
};

export default function StoreLogoCard({
  form,
  store,
  storeInitials,
  staticProfile,
  onUpdateStore,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const ownerId = store?.ownerUid ?? store?.id;
    if (!ownerId || !store?.id) {
      toast.error("Store not available", {
        description: "We couldn't find a store to update.",
      });
      event.target.value = "";
      return;
    }

    if (!onUpdateStore) {
      toast.error("Update unavailable", {
        description: "Please refresh and try again.",
      });
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const { url: logoUrl } = await uploadImage(file, {
        ownerId,
        folder: "logo",
        maxSizeMb: 5,
      });

      await onUpdateStore(store.id, { logoUrl });

      toast.success("Logo uploaded", {
        description: "Your store logo has been updated.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      toast.error("Upload failed", { description: message });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Store Logo</h2>
      <p className="text-sm text-slate-500">
        Add a brand mark to help buyers recognize your store.
      </p>

      {/* ✅ FIXED RESPONSIVE SECTION */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        
        {/* Logo */}
        {store?.logoUrl ? (
          <img
            src={store.logoUrl}
            alt={`${store?.title ?? "Store"} logo`}
            className="size-16 rounded-full object-cover border border-slate-200 bg-white"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
            {storeInitials}
          </div>
        )}

        {/* Store Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">
            {store?.title ?? "Throttle Auto Hub"}
          </p>
          <p className="text-xs text-slate-500">
            Recommended 512x512px
          </p>
        </div>

        {/* Button */}
        <Button
          className="w-full sm:w-auto"
          size="sm"
          variant="outline"
          type="button"
          onClick={handleLogoClick}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Logo"}
        </Button>

        {/* Hidden Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
      </div>

      {/* Rest Form */}
      <div className="mt-6 grid gap-4">
        {socialFields.map((field) => (
          <RegistrationInputField key={field.name} field={field} form={form} />
        ))}

        <div>
          <label className="text-xs font-semibold uppercase text-slate-500">
            Social Links
          </label>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <Input defaultValue={staticProfile.facebook} placeholder="Facebook URL" />
            <Input defaultValue={staticProfile.instagram} placeholder="Instagram URL" />
            <Input defaultValue={staticProfile.tiktok} placeholder="TikTok URL" />
            <Input defaultValue={staticProfile.whatsapp} placeholder="WhatsApp URL" />
          </div>
        </div>
      </div>
    </div>
  );
}