import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MarketplaceStore } from "@/types/marketplace";
import { uploadImage } from "@/ulity/imageUpload";
import DashboardWrapper from "@/components/shared/DashboardWrapper";

type StaticProfile = {
  website: string;
  linkedin: string;
  instagram: string;
  other: string;
};

type Props = {
  store: MarketplaceStore | null;
  storeInitials: string;
  staticProfile: StaticProfile;
  onUpdateStore?: (
    id: string,
    input: Record<string, unknown>,
  ) => Promise<MarketplaceStore | null>;
};

export default function StoreLogoCard({
  store,
  storeInitials,
  onUpdateStore,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const canUpdateStore = Boolean(
    onUpdateStore && (store?.id || store?.ownerUid),
  );

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
    <DashboardWrapper
      title="Store Logo"
      description="Upload a logo to represent your store and make it easily recognizable to customers."
    >
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
        {canUpdateStore ? (
          <>
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
          </>
        ) : (
          <div className="ml-auto rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
            Logo preview
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
}
