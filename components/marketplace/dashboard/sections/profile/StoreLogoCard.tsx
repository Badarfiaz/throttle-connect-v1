import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MarketplaceStore } from "@/types/marketplace";
import { readImagePreview, uploadImage } from "@/ulity/imageUpload";
import DashboardWrapper from "@/components/shared/DashboardWrapper";
import { useAppSelector } from "@/app/redux/hooks";

type Props = {
  store: MarketplaceStore | null;
  storeInitials?: string;
  onUpdateStore?: (
    id: string,
    input: Record<string, unknown>,
  ) => Promise<MarketplaceStore | null>;
  onLogoUrlChange?: (url: string | null) => void;
};

export default function StoreLogoCard({
  store,
  storeInitials = "MS",
  onUpdateStore,
  onLogoUrlChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localLogoPreview, setLocalLogoPreview] = useState<string | null>(null);
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null);

  const isRegistrationMode = !onUpdateStore;
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.userId;

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    let logoUrl: string | null = null;

    try {
      // Get ownerId based on mode
      const ownerId = isRegistrationMode
        ? userId
        : (store?.ownerUid ?? store?.id);

      if (!ownerId) {
        toast.error("Upload failed", {
          description: "User information not available.",
        });
        event.target.value = "";
        setUploading(false);
        return;
      }

      console.log(
        "Starting logo upload for ownerId:",
        ownerId,
        "isRegistrationMode:",
        isRegistrationMode,
      );

      // Upload file to Firebase and get URL
      const uploadResult = await uploadImage(file, {
        ownerId,
        folder: "logo",
        maxSizeMb: 5,
      });

      logoUrl = uploadResult.url;
      console.log("Logo uploaded successfully, URL:", logoUrl);

      // Create preview from file
      const preview = await readImagePreview(file);
      setLocalLogoPreview(preview);

      // Store the uploaded URL
      setUploadedLogoUrl(logoUrl);

      // Notify parent form of the URL
      if (onLogoUrlChange) {
        console.log("Calling onLogoUrlChange with URL:", logoUrl);
        onLogoUrlChange(logoUrl);
      }

      // In dashboard mode, update store immediately
      if (!isRegistrationMode && onUpdateStore && store?.id) {
        console.log("Dashboard mode - updating store with logoUrl");
        await onUpdateStore(store.id, { logoUrl });
      }

      toast.success("Logo uploaded", {
        description: "Your store logo has been uploaded successfully.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      console.error("Logo upload error:", err);
      toast.error("Upload failed", { description: message });
      setLocalLogoPreview(null);
      setUploadedLogoUrl(null);
      if (onLogoUrlChange) {
        onLogoUrlChange(null);
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setLocalLogoPreview(null);
    setUploadedLogoUrl(null);
    if (onLogoUrlChange) {
      onLogoUrlChange(null);
    }
  };

  const displayLogo = uploadedLogoUrl || localLogoPreview || store?.logoUrl;

  return (
    <DashboardWrapper
      title="Store Logo"
      description="Upload a logo to represent your store and make it easily recognizable to customers."
    >
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        {displayLogo ? (
          <img
            src={displayLogo}
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
        <div className="ml-auto flex gap-2">
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
          {(displayLogo || localLogoPreview) && isRegistrationMode && (
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleRemoveLogo}
              disabled={uploading}
              className="border-red-200 text-red-600 hover:bg-red-50"
            >
              Remove
            </Button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoChange}
          />
        </div>
      </div>
    </DashboardWrapper>
  );
}
