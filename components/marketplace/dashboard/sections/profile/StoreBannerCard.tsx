"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { MarketplaceStore } from "@/types/marketplace";
import { readImagePreview, uploadImage } from "@/ulity/imageUpload";
import DashboardWrapper from "@/components/shared/DashboardWrapper";
import { useAppSelector } from "@/app/redux/hooks";

type Props = {
  store: MarketplaceStore | null;
  onUpdateStore?: (
    id: string,
    input: Record<string, unknown>,
  ) => Promise<MarketplaceStore | null>;
  onBannerUrlChange?: (url: string | null) => void;
};

export default function StoreBannerCard({
  store,
  onUpdateStore,
  onBannerUrlChange,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localBannerPreview, setLocalBannerPreview] = useState<string | null>(
    null,
  );
  const [uploadedBannerUrl, setUploadedBannerUrl] = useState<string | null>(
    null,
  );

  const isRegistrationMode = !onUpdateStore;
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.userId;

  const handleBannerClick = () => {
    fileInputRef.current?.click();
  };

  const handleBannerChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
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

      const uploadResult = await uploadImage(file, {
        ownerId,
        folder: "banner",
        maxSizeMb: 5,
      });

      const preview = await readImagePreview(file);
      setLocalBannerPreview(preview);
      setUploadedBannerUrl(uploadResult.url);

      if (onBannerUrlChange) {
        onBannerUrlChange(uploadResult.url);
      }

      if (!isRegistrationMode && onUpdateStore && store?.id) {
        await onUpdateStore(store.id, { bannerUrl: uploadResult.url });
      }

      toast.success("Banner uploaded", {
        description: "Your store banner has been uploaded successfully.",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      toast.error("Upload failed", { description: message });
      setLocalBannerPreview(null);
      setUploadedBannerUrl(null);
      if (onBannerUrlChange) {
        onBannerUrlChange(null);
      }
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleRemoveBanner = () => {
    setLocalBannerPreview(null);
    setUploadedBannerUrl(null);
    if (onBannerUrlChange) {
      onBannerUrlChange(null);
    }
  };

  const displayBanner =
    uploadedBannerUrl || localBannerPreview || store?.bannerUrl;

  return (
    <DashboardWrapper
      title="Store Banner"
      description="Upload a wide banner image to give your storefront a stronger visual identity."
    >
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
        {displayBanner ? (
          <img
            src={displayBanner}
            alt={`${store?.title ?? "Store"} banner`}
            className="h-40 w-full rounded-lg object-cover border border-slate-200 bg-white"
          />
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-lg bg-slate-200 text-sm font-medium text-slate-500">
            Recommended 1200x300px
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {store?.title ?? "Throttle Auto Hub"}
            </p>
            <p className="text-xs text-slate-500">
              Banner image for the store header
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleBannerClick}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Banner"}
            </Button>
            {(displayBanner || localBannerPreview) && isRegistrationMode && (
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={handleRemoveBanner}
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
              onChange={handleBannerChange}
            />
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
