import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MarketplaceStore } from "@/types/marketplace";
import { socialFields } from "@/components/marketplace/registration/formFields";
import RegistrationInputField from "@/components/marketplace/registration/RegistrationInputField";
import { storage } from "@/firebase";
import type { UseFormReturn } from "react-hook-form";

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

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file", {
        description: "Please upload an image file.",
      });
      event.target.value = "";
      return;
    }

    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error("File too large", {
        description: `Please upload an image under ${maxSizeMb}MB.`,
      });
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `marketplaceStores/${ownerId}/logo/${Date.now()}-${safeName}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, file);
      const logoUrl = await getDownloadURL(fileRef);

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

      <div className="mt-6 flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
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
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {store?.title ?? "Throttle Auto Hub"}
          </p>
          <p className="text-xs text-slate-500">Recommended 512x512px</p>
        </div>
        <Button
          className="ml-auto"
          size="sm"
          variant="outline"
          type="button"
          onClick={handleLogoClick}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Logo"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoChange}
        />
      </div>

      <div className="mt-6 grid gap-4">
        {socialFields.map((field) => (
          <RegistrationInputField key={field.name} field={field} form={form} />
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
